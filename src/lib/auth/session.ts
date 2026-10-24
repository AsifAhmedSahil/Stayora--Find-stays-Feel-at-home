import { mockAuth, useMockAuthState } from "./mock-auth";

/** The signed-in state the root guard reads. Backed by the mock until Clerk takes over. */
export function useSession() {
  const { session } = useMockAuthState();

  return {
    isLoaded: true,
    isSignedIn: session !== null,
    user: session,
    signOut: mockAuth.signOut,
  };
}
