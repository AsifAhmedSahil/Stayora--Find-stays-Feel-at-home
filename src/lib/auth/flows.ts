/**
 * Passed to Clerk's `finalize({ navigate })`. Screens never navigate after auth: the root
 * `Stack.Protected` guard moves the guest once the session is active.
 */
export const stayOnScreen = { navigate: async () => {} };

/** "Ada King Lovelace" → firstName "Ada", lastName "King Lovelace" (omitted when empty). */
export function splitName(fullName: string) {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  const lastName = rest.join(" ");
  return lastName ? { firstName, lastName } : { firstName };
}

/** Clerk's test emails accept the fixed code 424242 in development instances. */
export function isClerkTestEmail(email: string | null | undefined) {
  return Boolean(email?.includes("+clerk_test"));
}

export const CLERK_TEST_CODE = "424242";
