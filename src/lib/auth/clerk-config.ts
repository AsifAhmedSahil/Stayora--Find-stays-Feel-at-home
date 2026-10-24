/** Empty when .env.local has no key; in development the app then runs signed out without Clerk. */
export const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const missingClerkKeyMessage =
  "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to .env.local (see .env.example).";
