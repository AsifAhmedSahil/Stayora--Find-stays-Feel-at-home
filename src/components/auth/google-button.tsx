import * as Haptics from "expo-haptics";
import { useState } from "react";
import { View } from "react-native";
import { GoogleLogo } from "@/components/brand/google-logo";
import { Alert, Button } from "@/components/ui";
import { useGoogleSso } from "@/hooks/use-google-sso";
import { clerkEnabled, missingClerkKeyMessage } from "@/lib/auth/clerk-config";

type GoogleButtonProps = { className?: string };

function GoogleButtonView({
  className,
  loading,
  error,
  onPress,
  onDismissError,
}: GoogleButtonProps & {
  loading: boolean;
  error: string | null;
  onPress: () => void;
  onDismissError: () => void;
}) {
  return (
    <View className={className}>
      {error ? <Alert variant="error" message={error} onDismiss={onDismissError} /> : null}
      <Button
        title="Continue with Google"
        size="pillCompact"
        variant="secondary"
        leading={<GoogleLogo size={24} />}
        loading={loading}
        onPress={onPress}
      />
    </View>
  );
}

/** Clerk browser SSO. On success the root guard navigates. */
function ClerkGoogleButton({ className }: GoogleButtonProps) {
  const { start, loading, error, clearError } = useGoogleSso();

  async function press() {
    if (loading) return;
    const outcome = await start();
    if (outcome === "cancelled") return;
    void Haptics.notificationAsync(
      outcome === "signed-in"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    ).catch(() => {});
  }

  return (
    <GoogleButtonView
      className={className}
      loading={loading}
      error={error}
      onPress={press}
      onDismissError={clearError}
    />
  );
}

/** Development without a Clerk key: explains why Google can't start. */
function MissingKeyGoogleButton({ className }: GoogleButtonProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <GoogleButtonView
      className={className}
      loading={false}
      error={error}
      onPress={() => setError(missingClerkKeyMessage)}
      onDismissError={() => setError(null)}
    />
  );
}

/** Chosen once, so Clerk hooks only run when `ClerkProvider` is mounted. */
export const GoogleButton = clerkEnabled ? ClerkGoogleButton : MissingKeyGoogleButton;
