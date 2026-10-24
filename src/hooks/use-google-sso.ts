import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { ssoErrorMessage } from "@/lib/auth/errors";

WebBrowser.maybeCompleteAuthSession();

/** Google sign-in or sign-up through Clerk SSO. The root guard navigates once the session is active. */
export function useGoogleSso() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  /** "cancelled" covers closing the browser and finishing the account on /sign-up. */
  async function start(): Promise<"signed-in" | "cancelled" | "failed"> {
    setLoading(true);
    setError(null);
    try {
      const { createdSessionId, setActive, authSessionResult } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        return "signed-in";
      }
      if (authSessionResult?.type === "success") {
        // Clerk needs more details to finish the account.
        router.push("/sign-up");
      }
      return "cancelled";
    } catch (err) {
      setError(ssoErrorMessage(err));
      return "failed";
    } finally {
      setLoading(false);
    }
  }

  return { start, loading, error, clearError: () => setError(null) };
}
