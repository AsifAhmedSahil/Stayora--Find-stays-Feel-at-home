import { Stack } from "expo-router";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Alert } from "@/components/ui";
import { clerkEnabled, missingClerkKeyMessage } from "@/lib/auth/clerk-config";

export default function AuthLayout() {
  // The forms use Clerk hooks, which throw without `ClerkProvider` (development without a key).
  if (!clerkEnabled) {
    return (
      <AuthScreen
        title="Sign-in isn't set up"
        subtitle="This development build has no Clerk key, so accounts are unavailable."
      >
        <Alert variant="error" message={missingClerkKeyMessage} className="mt-6" />
      </AuthScreen>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
