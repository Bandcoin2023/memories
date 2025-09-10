import { createAuthClient } from "better-auth/react";

import { stellarClient } from "../server/plugins/stellar-client";

export type AuthClient = ReturnType<typeof createAuthClient>;

export function createClient(options?: { baseURL?: string }) {
  return createAuthClient({
    baseURL: options?.baseURL,
    plugins: [stellarClient()],
  });
}

const authClient = createClient();
