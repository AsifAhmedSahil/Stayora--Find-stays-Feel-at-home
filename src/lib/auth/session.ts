import { useAuth, useUser } from "@clerk/expo";
import { clerkEnabled } from "./clerk-config";

export type SessionUser = { name: string; email: string };

function useClerkSession() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  return {
    isLoaded,
    isSignedIn: isLoaded && isSignedIn === true,
    user: user
      ? {
          name: user.fullName ?? "",
          email: user.primaryEmailAddress?.emailAddress ?? "",
        }
      : null,
    signOut: () => signOut(),
  };
}

/** Development without a Clerk key: always signed out. */
function useSignedOutSession() {
  return {
    isLoaded: true,
    isSignedIn: false,
    user: null as SessionUser | null,
    signOut: async () => {},
  };
}

/** The signed-in state the root guard, `index` and Sign out read. Chosen once, so hooks never change between renders. */
export const useSession = clerkEnabled ? useClerkSession : useSignedOutSession;
