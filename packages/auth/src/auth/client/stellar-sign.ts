// Minimal Stellar client helper for all Stellar wallets using kit + Better Auth plugin endpoints
import {
  ALBEDO_ID,
  LOBSTR_ID,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";
import { kit } from "./kit/init";
import type { createClient } from "./auth-client";

export type StartStellarResult = {
  xdr: string;
  networkPassphrase: string;
  nonce: string;
  expiresAt: string;
};

export type StellarWalletId = "xbull" | "albedo" | "lobstr";

const WALLET_ID_MAP = {
  xbull: XBULL_ID,
  albedo: ALBEDO_ID,
  lobstr: LOBSTR_ID,
} as const;

// Unified function for Stellar wallet sign-in
export async function signInWithStellar(
  authClient: ReturnType<typeof createClient>,
  walletId: StellarWalletId
) {
  // Validate wallet ID
  if (!(walletId in WALLET_ID_MAP)) {
    throw new Error(`Unsupported wallet type: ${walletId}`);
  }

  const kitWalletId = WALLET_ID_MAP[walletId];

  // 1) Set the wallet in kit
  kit.setWallet(kitWalletId);

  // 2) Get public key from the connected wallet
  const { address: account } = await kit.getAddress();
  if (!account) throw new Error("Failed to get public key from wallet");

  // 3) Request challenge from server
  const { data: challenge, error: challengeErr } =
    await authClient.stellar.challenge({
      query: {
        account,
      },
    });
  if (!challenge)
    throw new Error(challengeErr?.message || "Failed to get challenge");

  // 4) Sign XDR with the connected wallet
  const signedTxXdr = await signTransactionWithStellar({
    address: account,
    networkPassphrase: challenge.networkPassphrase,
    walletId: kitWalletId,
    xdr: challenge.xdr,
  });

  if (!signedTxXdr) throw new Error("Failed to sign transaction");

  // 5) Verify the signed transaction
  const { data: verified, error: verifyErr } = await authClient.$fetch(
    "/stellar/verify",
    {
      method: "POST",
      body: { xdr: signedTxXdr, account, wallet_type: kitWalletId },
    }
  );
  if (!verified) throw new Error(verifyErr?.message || "Verification failed");
  return true;
}

// export async function signTransaction({
//   session,
//   xdr,
// }: {
//   session: Session;
//   xdr: string;
// }) {
//   const walletType = session.user?.isCustodial;
// }

export async function signTransaction({
  xdr,
  authClient,
}: {
  xdr: string;
  authClient: ReturnType<typeof createClient>;
}) {
  const { data: session } = await authClient.getSession();

  if (session?.user?.isCustodial) {
    const { data: custodialData } = await authClient.signCustodial({ xdr });
    return custodialData?.signedXdr;
  }

  const loginType = session?.session.loginType;

  if (loginType) {
    const stellarPublicKey = session?.user?.stellarPublicKey;

    if (!stellarPublicKey) {
      throw new Error("No Stellar public key found for user");
    }
    if (!(loginType in WALLET_ID_MAP)) {
      throw new Error(`Unsupported wallet type: ${loginType}`);
    }

    return await signTransactionWithStellar({
      address: stellarPublicKey,
      networkPassphrase: "testnet", // Adjust as needed
      walletId: WALLET_ID_MAP[loginType as keyof typeof WALLET_ID_MAP],
      xdr,
    });
  }
}

async function signTransactionWithStellar({
  xdr,
  networkPassphrase,
  address,
  walletId,
}: {
  xdr: string;
  networkPassphrase: string;
  address: string;
  walletId: string;
}) {
  kit.setWallet(walletId);
  const { signedTxXdr } = await kit.signTransaction(xdr, {
    address: address,
    networkPassphrase: networkPassphrase,
  });

  return signedTxXdr;
}
