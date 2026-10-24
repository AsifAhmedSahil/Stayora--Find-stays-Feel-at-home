import { useSyncExternalStore } from "react";
import { authErrors } from "./errors";

// In-memory stand-in for Clerk until the Clerk forms plan. Methods mirror Clerk's
// method-based flows and return `{ error }` instead of throwing. State is lost on reload.

export type AuthFlow = "sign-up" | "sign-in";
type MockUser = { name: string; email: string };
type MockAuthState = {
  session: MockUser | null;
  pending: (MockUser & { flow: AuthFlow }) | null;
};
export type MockAuthResult = { error?: string; next?: "verify" };

export const MOCK_VERIFICATION_CODE = "424242";
const LATENCY_MS = 700;

let state: MockAuthState = { session: null, pending: null };
const listeners = new Set<() => void>();

function setState(next: Partial<MockAuthState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const wait = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

function nameFromEmail(email: string) {
  return email.split("@")[0].split("+")[0];
}

export const mockAuth = {
  signUp: {
    async create(input: { name: string; email: string; password: string }): Promise<MockAuthResult> {
      await wait();
      if (input.email.includes("taken")) return { error: authErrors.emailTaken };
      setState({ pending: { flow: "sign-up", name: input.name, email: input.email } });
      return { next: "verify" };
    },
  },
  signIn: {
    async password(input: { email: string; password: string }): Promise<MockAuthResult> {
      await wait();
      if (input.password === "wrongpassword") return { error: authErrors.wrongCredentials };
      const user = { name: nameFromEmail(input.email), email: input.email };
      if (input.email.includes("+newdevice")) {
        setState({ pending: { flow: "sign-in", ...user } });
        return { next: "verify" };
      }
      setState({ session: user, pending: null });
      return {};
    },
  },
  verify: {
    async code(code: string): Promise<MockAuthResult> {
      await wait();
      if (!state.pending) return { error: authErrors.verificationExpired };
      if (code !== MOCK_VERIFICATION_CODE) return { error: authErrors.wrongCode };
      const { name, email } = state.pending;
      setState({ session: { name, email }, pending: null });
      return {};
    },
    async resend(): Promise<MockAuthResult> {
      await wait();
      return {};
    },
  },
  async social(provider: "google" | "apple"): Promise<MockAuthResult> {
    await wait();
    setState({ session: { name: "Stayora guest", email: `guest@${provider}.example.com` }, pending: null });
    return {};
  },
  signOut() {
    setState({ session: null, pending: null });
  },
};

export function useMockAuthState() {
  return useSyncExternalStore(subscribe, () => state);
}
