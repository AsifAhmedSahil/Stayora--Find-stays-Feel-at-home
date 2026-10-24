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
} as const;

function isNetworkError(error: unknown) {
  if (isClerkRuntimeError(error)) return error.code === "network_error";
  return error instanceof TypeError && /network/i.test(error.message);
}

/** Copy shown when Google SSO fails. */
export function ssoErrorMessage(error: unknown): string {
  if (isNetworkError(error)) return authErrors.network;
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? authErrors.googleFailed;
  }
  return authErrors.googleFailed;
}
