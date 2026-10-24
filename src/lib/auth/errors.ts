import { isClerkAPIResponseError, isClerkRuntimeError } from "@clerk/expo";

export const authErrors = {
  network: "Can't connect. Check your connection and try again.",
  googleFailed: "Couldn't continue with Google. Please try again.",
  socialFailed: "Couldn't continue. Please try again.",
  nameRequired: "Enter your full name.",
  emailRequired: "Enter your email address.",
  emailInvalid: "Enter a valid email address, like you@example.com.",
  passwordRequired: "Enter your password.",
  passwordTooShort: "Use at least 8 characters.",
  emailTaken: "That email is already in use. Try signing in instead.",
  wrongCredentials: "Incorrect email or password.",
  wrongCode: "That code isn't right. Check the email and try again.",
  codeIncomplete: "Enter all 6 digits.",
  verificationExpired: "This code has expired. Start again to get a new one.",
  passwordResetSoon: "Password reset is coming soon.",
  passwordPwned: "This password has appeared in a data breach. Choose a different one.",
  tooManyAttempts: "Too many attempts. Wait a minute and try again.",
  somethingWrong: "Something went wrong. Please try again.",
} as const;

export type AuthErrorField = "email" | "password" | "code";
export type AuthError = { message: string; field?: AuthErrorField };

// Clerk error codes we word ourselves. Sign-in hides whether the email exists.
const knownCodes: Record<string, AuthError> = {
  form_identifier_exists: { message: authErrors.emailTaken, field: "email" },
  form_identifier_not_found: { message: authErrors.wrongCredentials },
  form_password_incorrect: { message: authErrors.wrongCredentials },
  form_password_pwned: { message: authErrors.passwordPwned, field: "password" },
  form_password_length_too_short: { message: authErrors.passwordTooShort, field: "password" },
  form_code_incorrect: { message: authErrors.wrongCode, field: "code" },
  verification_expired: { message: authErrors.verificationExpired },
  too_many_requests: { message: authErrors.tooManyAttempts },
};

function isNetworkError(error: unknown) {
  if (isClerkRuntimeError(error)) return error.code === "network_error";
  return error instanceof TypeError && /network/i.test(error.message);
}

/** Copy (and the field it belongs under) for an error from a Clerk sign-up, sign-in or SSO call. */
export function clerkErrorMessage(
  error: unknown,
  fallback: string = authErrors.somethingWrong,
): AuthError {
  if (isNetworkError(error)) return { message: authErrors.network };
  if (isClerkAPIResponseError(error)) {
    if (error.status === 429) return { message: authErrors.tooManyAttempts };
    const first = error.errors[0];
    if (first && knownCodes[first.code]) return knownCodes[first.code];
    return { message: first?.longMessage ?? fallback };
  }
  return { message: fallback };
}

/** Copy shown when Google SSO fails. */
export function ssoErrorMessage(error: unknown): string {
  return clerkErrorMessage(error, authErrors.googleFailed).message;
}
