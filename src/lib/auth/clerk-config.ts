/** Empty when .env.local has no key; in development the app then runs signed out without Clerk. */
export const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

/** False only in development without a key: `ClerkProvider` isn't mounted, so Clerk hooks must not run. */
export const clerkEnabled = clerkPublishableKey !== "";

export const missingClerkKeyMessage =
  "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to .env.local (see .env.example).";
