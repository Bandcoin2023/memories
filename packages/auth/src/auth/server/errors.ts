// Centralized error codes for Stellar authentication plugin
export const StellarAuthError = {
  // Challenge/Authentication errors
  STELLAR_CHALLENGE_FAILED: "stellar_challenge_failed",
  INVALID_XDR: "invalid_xdr",
  INVALID_SOURCE: "invalid_source",
  EXPIRED: "expired",
  MISSING_OPS: "missing_ops",
  INVALID_NONCE: "invalid_nonce",
  NONCE_NOT_FOUND_OR_EXPIRED: "nonce_not_found_or_expired",
  INVALID_MANAGEDATA_OP: "invalid_managedata_op",
  INVALID_SIGNATURE: "invalid_signature",
  VERIFY_FAILED: "verify_failed",

  // Session/Auth errors
  NOT_AUTHENTICATED: "not_authenticated",
  UNAUTHORIZED: "unauthorized",
  NOT_CUSTODIAL_ACCOUNT: "not_custodial_account",

  // Custodial service errors
  CUSTODIAL_API_KEY_MISSING: "custodial_api_key_missing",
  CUSTODIAL_USER_NOT_FOUND: "custodial_user_not_found",
  CUSTODIAL_UNAUTHORIZED: "custodial_unauthorized",
  CUSTODIAL_BAD_REQUEST: "custodial_bad_request",
  CUSTODIAL_SIGNING_FAILED: "custodial_signing_failed",
  CUSTODIAL_SERVER_ERROR: "custodial_server_error",

  // Wallet connection errors
  WALLET_CONNECTION_FAILED: "wallet_connection_failed",
  FAILED_TO_GET_PUBKEY: "failed_to_get_pubkey",
  SIGN_FAILED: "sign_failed",
  CHALLENGE_FAILED: "challenge_failed",

  // Generic errors
  INTERNAL_SERVER_ERROR: "internal_server_error",
  BAD_REQUEST: "bad_request",
  USER_NOT_FOUND: "user_not_found",
} as const;

export type StellarAuthError =
  (typeof StellarAuthError)[keyof typeof StellarAuthError];

// Error mapping for client-side responses
export type StellarAuthErrorResponse = {
  data: null;
  error: StellarAuthError;
};

// Success response type
export type StellarAuthSuccessResponse<T> = {
  data: T;
  error: null;
};

// Union type for all responses
export type StellarAuthResponse<T> =
  | StellarAuthSuccessResponse<T>
  | StellarAuthErrorResponse;

// Utility function to create error responses
export const createErrorResponse = (
  error: StellarAuthError
): StellarAuthErrorResponse => ({
  data: null,
  error,
});

// Utility function to create success responses
export const createSuccessResponse = <T>(
  data: T
): StellarAuthSuccessResponse<T> => ({
  data,
  error: null,
});
