import type { BetterAuthClientPlugin } from "better-auth/client";
import type { BetterFetchOption } from "@better-fetch/fetch";
import { stellar } from "./stellar";

type ChallengeResponse = {
  xdr: string;
  networkPassphrase: string;
  nonce: string;
  expiresAt: string;
};

type CustodialSignResponse = {
  signedXdr: string;
  publicKey: string;
};

export const stellarClient = () => {
  return {
    $InferServerPlugin: {} as ReturnType<typeof stellar>,
    id: "stellar",
    getActions: ($fetch) => {
      return {
        // Low-level endpoints
        challenge: async (
          args: { account: string },
          fetchOptions?: BetterFetchOption
        ) =>
          $fetch<ChallengeResponse>("/stellar/challenge", {
            method: "GET",
            query: { account: args.account },
            ...fetchOptions,
          }),
        verify: async (
          args: { xdr: string; account: string },
          fetchOptions?: BetterFetchOption
        ) =>
          $fetch<{ status: boolean }>("/stellar/verify", {
            method: "POST",
            body: args,
            ...fetchOptions,
          }),

        // Custodial signing endpoint
        signCustodial: async (
          args: { xdr: string },
          fetchOptions?: BetterFetchOption
        ) =>
          $fetch<CustodialSignResponse>("/stellar/sign-custodial", {
            method: "POST",
            body: args,
            ...fetchOptions,
          }),
      };
    },
  } satisfies BetterAuthClientPlugin;
};

export default stellarClient;
