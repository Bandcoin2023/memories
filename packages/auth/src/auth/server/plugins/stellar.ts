import type { BetterAuthPlugin } from "better-auth";
import {
  APIError,
  createAuthEndpoint,
  sessionMiddleware,
} from "better-auth/api";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import {
  Account,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { z } from "zod";
import { session as Session } from "../schema/auth";
import { CustodialService } from "../custodial-service";
import { StellarAuthError } from "../errors";

export type StellarPluginOptions = {
  network: "PUBLIC" | "TESTNET" | { passphrase: string };
  horizonURL?: string; // optional (not used in minimal flow)
  serverSecret: string; // SB.... secret of the server auth account
  webAuthDomain: string; // e.g. auth.example.com
  homeDomain: string; // e.g. app.example.com
  emailDomainName: string; // for creating synthetic emails for users
  challengeTTL?: number; // seconds, default 300
  db: any;
};

function base64Url(bytes: Uint8Array) {
  const b64 = Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomNonce(size = 24) {
  return base64Url(randomBytes(size));
}

export const stellar = (opts: StellarPluginOptions) => {
  // Validate required options early to avoid opaque errors from stellar-sdk
  if (!opts || typeof opts !== "object") {
    throw new Error("stellar plugin: options are required");
  }
  if (!opts.serverSecret || typeof opts.serverSecret !== "string") {
    throw new Error(
      "stellar plugin: STELLAR_SERVER_SECRET (serverSecret) is missing or not a string"
    );
  }
  if (!opts.webAuthDomain || !opts.homeDomain) {
    throw new Error(
      "stellar plugin: WEB_AUTH_DOMAIN and HOME_DOMAIN are required"
    );
  }
  if (!opts.emailDomainName) {
    throw new Error(
      "stellar plugin: EMAIL_DOMAIN_NAME is required to generate fallback emails"
    );
  }
  const serverKeypair = Keypair.fromSecret(opts.serverSecret);
  const serverPublicKey = serverKeypair.publicKey();
  const networkPassphrase =
    typeof opts.network === "string"
      ? opts.network === "PUBLIC"
        ? Networks.PUBLIC
        : Networks.TESTNET
      : opts.network.passphrase;
  const ttl = Math.max(30, opts.challengeTTL ?? 300);

  return {
    id: "stellar",
    schema: {
      session: {
        fields: {
          loginType: {
            type: "string",
            required: false,
            input: true,
          },
        },
      },
      user: {
        fields: {
          stellarPublicKey: {
            type: "string",
            required: false,
            input: false,
          },
          isCustodial: {
            type: "boolean",
            required: false,
            defaultValue: false,
            input: false,
          },
        },
      },
    },

    endpoints: {
      // GET /stellar/challenge?account=G...&client_domain=optional
      challenge: createAuthEndpoint(
        "/stellar/challenge",
        {
          method: "GET",
          query: z.object({
            account: z.string().min(1),
            client_domain: z.string().optional(),
          }),
        },
        async (ctx) => {
          try {
            const { account, client_domain } = ctx.query;

            // Build SEP-10 challenge transaction
            const now = Math.floor(Date.now() / 1000);
            const nonce = randomNonce();
            const serverAccount = new Account(serverPublicKey, "0");
            const builder = new TransactionBuilder(serverAccount, {
              fee: (Number(BASE_FEE) * 1).toString(),
              networkPassphrase,
              timebounds: { minTime: now, maxTime: now + ttl },
            })
              // web_auth_domain (server domain) — operation source = server
              .addOperation(
                Operation.manageData({
                  name: "web_auth_domain",
                  value: opts.webAuthDomain,
                  source: serverPublicKey,
                })
              )
              // home_domain — operation source = client account
              .addOperation(
                Operation.manageData({
                  name: "home_domain",
                  value: opts.homeDomain,
                  source: account,
                })
              )
              // nonce — operation source = client account
              .addOperation(
                Operation.manageData({
                  name: "nonce",
                  value: nonce,
                  source: account,
                })
              );

            if (client_domain) {
              builder.addOperation(
                Operation.manageData({
                  name: "client_domain",
                  value: client_domain,
                  source: account,
                })
              );
            }

            const tx = builder.build();
            tx.sign(serverKeypair);

            // store nonce in verification table to prevent replay
            const expiresAt = new Date((now + ttl) * 1000);
            const identifier = `stellar:nonce:${nonce}`;
            await ctx.context.adapter.create({
              model: "verification",
              data: {
                identifier,
                value: JSON.stringify({ account }),
                expiresAt,
              },
            });

            return ctx.json({
              xdr: tx.toXDR(),
              networkPassphrase,
              nonce,
              expiresAt: expiresAt.toISOString(),
            });
          } catch (e: any) {
            ctx.context.logger.error(
              StellarAuthError.STELLAR_CHALLENGE_FAILED,
              e
            );
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: StellarAuthError.STELLAR_CHALLENGE_FAILED,
            });
          }
        }
      ),

      // POST /stellar/verify
      verify: createAuthEndpoint(
        "/stellar/verify",
        {
          method: "POST",
          body: z.object({
            xdr: z.string().min(1),
            account: z.string().min(1),
            wallet_type: z.string().optional(),
          }),
        },
        async (ctx) => {
          try {
            const { xdr, account, wallet_type } = ctx.body;
            let tx: Transaction;
            try {
              tx = new Transaction(xdr, networkPassphrase);
            } catch {
              throw new APIError("BAD_REQUEST", {
                message: StellarAuthError.INVALID_XDR,
              });
            }

            // Basic SEP-10 checks
            if (tx.source !== serverPublicKey) {
              throw new APIError("BAD_REQUEST", {
                message: StellarAuthError.INVALID_SOURCE,
              });
            }
            const seq: any = (tx as any).sequence;
            const isZeroSeq = String(seq) === "0";
            if (!isZeroSeq) {
              // throw new APIError("BAD_REQUEST", {
              //   message: "invalid_sequence",
              // });
            }
            if (
              !tx.timeBounds ||
              Date.now() / 1000 > Number(tx.timeBounds.maxTime ?? "0")
            ) {
              throw new APIError("BAD_REQUEST", { message: "expired" });
            }

            const ops = tx.operations;
            const findOp = (name: string) =>
              ops.find((o: any) => "name" in o && o.name === name) as any;
            const nonceOp = findOp("nonce");
            const homeDomainOp = findOp("home_domain");
            const webAuthDomainOp = findOp("web_auth_domain");

            if (!nonceOp || !homeDomainOp || !webAuthDomainOp) {
              throw new APIError("BAD_REQUEST", { message: "missing_ops" });
            }
            if (homeDomainOp.source !== account) {
              throw new APIError("BAD_REQUEST", {
                message: "invalid_home_domain_source",
              });
            }
            if (
              (webAuthDomainOp.value?.toString?.() ?? webAuthDomainOp.value) !==
              opts.webAuthDomain
            ) {
              throw new APIError("BAD_REQUEST", {
                message: "invalid_web_auth_domain",
              });
            }
            const nonce = (nonceOp.value?.toString?.() ??
              nonceOp.value) as string;
            if (!nonce) {
              throw new APIError("BAD_REQUEST", {
                message: StellarAuthError.INVALID_NONCE,
              });
            }

            // Ensure nonce exists and is fresh, then consume it
            const verification: any = await ctx.context.adapter.findOne({
              model: "verification",
              where: [{ field: "identifier", value: `stellar:nonce:${nonce}` }],
            });
            if (
              !verification ||
              (verification.expiresAt &&
                new Date(verification.expiresAt).valueOf() < Date.now())
            ) {
              throw new APIError("BAD_REQUEST", {
                message: StellarAuthError.NONCE_NOT_FOUND_OR_EXPIRED,
              });
            }
            await ctx.context.adapter.delete({
              model: "verification",
              where: [{ field: "id", value: verification.id }],
            });

            // Verify signatures: server and client
            const hash = tx.hash();
            const serverVerified = tx.signatures.some((sig: any) =>
              Keypair.fromPublicKey(serverPublicKey).verify(
                hash,
                sig.signature()
              )
            );
            if (!serverVerified) {
              throw new APIError("BAD_REQUEST", {
                message: "server_sig_missing",
              });
            }
            const clientVerified = tx.signatures.some((sig: any) =>
              Keypair.fromPublicKey(account).verify(hash, sig.signature())
            );
            if (!clientVerified) {
              throw new APIError("BAD_REQUEST", {
                message: "client_sig_missing",
              });
            }

            // Find or create user linked to this Stellar account
            const providerId = "stellar";
            let linked =
              await ctx.context.internalAdapter.findAccountByProviderId(
                account,
                providerId
              );
            let userId: string;
            if (linked) {
              userId = linked.userId;
            } else {
              const email = `${account.toLowerCase()}@${opts.emailDomainName}`;
              const createdUser = await ctx.context.internalAdapter.createUser(
                {
                  email,
                  name: account,
                  image: null,
                  emailVerified: true,
                  stellarPublicKey: account,
                },
                ctx
              );
              if (!createdUser) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: "failed_to_create_user",
                });
              }
              userId = createdUser.id;
              await ctx.context.internalAdapter.linkAccount(
                {
                  userId,
                  providerId,
                  accountId: account,
                  scope: networkPassphrase, // store network for reference
                },
                ctx
              );
            }

            const session = await ctx.context.internalAdapter.createSession(
              userId,
              ctx
            );

            await opts.db
              .update(Session)
              .set({ loginType: wallet_type || "stellar" })
              .where(eq(Session.id, session.id));

            if (!session) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: "failed_to_create_session",
              });
            }

            // Set session cookie
            await ctx.setSignedCookie(
              ctx.context.authCookies.sessionToken.name,
              session.token,
              ctx.context.secret,
              ctx.context.authCookies.sessionToken.options
            );

            return ctx.json({ status: true });
          } catch (e: any) {
            ctx.context.logger.error("stellar_verify_failed", e);
            if (e instanceof APIError) throw e;
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "stellar_verify_failed",
            });
          }
        }
      ),

      signCustodial: createAuthEndpoint(
        "/stellar/sign-custodial",
        {
          method: "POST",
          requireHeaders: true,
          use: [sessionMiddleware],
          body: z.object({
            xdr: z.string().min(1),
          }),
        },
        async (ctx) => {
          try {
            const { xdr } = ctx.body;

            // Get current user from session
            const session = ctx.context.session;
            if (!session?.user) {
              throw new APIError("UNAUTHORIZED", {
                message: StellarAuthError.NOT_AUTHENTICATED,
              });
            }

            // Check if user has a custodial account
            if (!session.user.isCustodial || !session.user.email) {
              throw new APIError("BAD_REQUEST", {
                message: StellarAuthError.NOT_CUSTODIAL_ACCOUNT,
              });
            }

            // Get user's custodial public key if not in session
            let publicKey = session.user.stellarPublicKey;
            if (!publicKey) {
              publicKey = await CustodialService.getOrCreatePublicKey(
                session.user.email
              );
            }

            // Sign the transaction using custodial service
            const signedXdr = await CustodialService.signTransaction(
              session.user.email,
              publicKey,
              xdr
            );

            return ctx.json({
              signedXdr,
              publicKey,
            });
          } catch (e: any) {
            ctx.context.logger.error(
              StellarAuthError.CUSTODIAL_SIGNING_FAILED,
              e
            );

            // Handle specific custodial service errors
            if (e.message === StellarAuthError.CUSTODIAL_USER_NOT_FOUND) {
              throw new APIError("NOT_FOUND", {
                message: StellarAuthError.CUSTODIAL_USER_NOT_FOUND,
              });
            }
            if (e.message === StellarAuthError.CUSTODIAL_UNAUTHORIZED) {
              throw new APIError("UNAUTHORIZED", {
                message: StellarAuthError.CUSTODIAL_UNAUTHORIZED,
              });
            }
            if (e.message === StellarAuthError.CUSTODIAL_BAD_REQUEST) {
              throw new APIError("BAD_REQUEST", {
                message: StellarAuthError.CUSTODIAL_BAD_REQUEST,
              });
            }

            if (e instanceof APIError) throw e;
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: StellarAuthError.CUSTODIAL_SIGNING_FAILED,
            });
          }
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};

export default stellar;
