import { StellarAuthError } from "./errors";

export class CustodialService {
  private static baseUrl = "https://accounts.action-tokens.com";

  static async getOrCreatePublicKey(email: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/pub?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error(`Custodial server error: ${response.status}`);
      }

      const data = await response.json();
      return data.publicKey; // Expected: "G..." format
    } catch (error) {
      console.error("Failed to get custodial public key:", error);
      throw error;
    }
  }

  static async signTransaction(
    email: string,
    publicKey: string,
    xdr: string
  ): Promise<string> {
    try {
      const apiKey = process.env.CUSTODIAL_API_KEY;
      if (!apiKey) {
        throw new Error(StellarAuthError.CUSTODIAL_API_KEY_MISSING);
      }

      const response = await fetch(`${this.baseUrl}/api/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email: email,
          publicKey: publicKey,
          xdr: xdr,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(StellarAuthError.CUSTODIAL_USER_NOT_FOUND);
        }
        if (response.status === 401) {
          throw new Error(StellarAuthError.CUSTODIAL_UNAUTHORIZED);
        }
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || StellarAuthError.CUSTODIAL_BAD_REQUEST
          );
        }
        throw new Error(StellarAuthError.CUSTODIAL_SERVER_ERROR);
      }

      const data = await response.json();
      return data.signedXdr; // Expected: signed XDR string
    } catch (error) {
      console.error(
        "Failed to sign transaction with custodial service:",
        error
      );
      throw error;
    }
  }
}
