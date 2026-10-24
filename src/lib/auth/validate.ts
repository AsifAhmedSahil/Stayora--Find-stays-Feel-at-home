import { authErrors } from "./errors";

/** Same minimum as the Clerk Dashboard. Change both together. */
export const PASSWORD_MIN_LENGTH = 8;

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailError(email: string) {
  if (!email.trim()) return authErrors.emailRequired;
  if (!EMAIL_PATTERN.test(email.trim())) return authErrors.emailInvalid;
}

export function validateSignUp(input: { name: string; email: string; password: string }) {
  const errors: FieldErrors<"name" | "email" | "password"> = {};
  if (!input.name.trim()) errors.name = authErrors.nameRequired;
  const email = emailError(input.email);
  if (email) errors.email = email;
  if (input.password.length < PASSWORD_MIN_LENGTH) errors.password = authErrors.passwordTooShort;
  return errors;
}

export function validateSignIn(input: { email: string; password: string }) {
  const errors: FieldErrors<"email" | "password"> = {};
  const email = emailError(input.email);
  if (email) errors.email = email;
  if (!input.password) errors.password = authErrors.passwordRequired;
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>) {
  return Object.values(errors).some(Boolean);
}
