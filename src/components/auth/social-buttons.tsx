import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Platform, View } from "react-native";
import { GoogleLogo } from "@/components/brand/google-logo";
import { Alert, Button } from "@/components/ui";
import { authErrors } from "@/lib/auth/errors";
import { mockAuth } from "@/lib/auth/mock-auth";
import { AppleLogo } from "./apple-logo";

type Provider = "google" | "apple";

/** Google, plus Apple on iOS. Mocked: a successful tap starts a session and the guard navigates. */
export function SocialButtons({ only }: { only?: Provider }) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showGoogle = only !== "apple";
  const showApple = only !== "google" && Platform.OS === "ios";

  async function start(provider: Provider) {
    setPending(provider);
    setError(null);
    const result = await mockAuth
      .social(provider)
      .catch(() => ({ error: authErrors.socialFailed }));
    setPending(null);
    if (result.error) setError(result.error);
    void Haptics.notificationAsync(
      result.error
        ? Haptics.NotificationFeedbackType.Error
        : Haptics.NotificationFeedbackType.Success,
    ).catch(() => {});
  }

  return (
    <View className={only ? "gap-2.5" : "gap-4"}>
      {error ? <Alert variant="error" message={error} onDismiss={() => setError(null)} /> : null}
      {showGoogle ? (
        <Button
          title="Continue with Google"
          size="pillCompact"
          variant="secondary"
          leading={<GoogleLogo size={24} />}
          loading={pending === "google"}
          disabled={pending !== null}
          onPress={() => start("google")}
        />
      ) : null}
      {showApple ? (
        <Button
          title="Continue with Apple"
          size="pillCompact"
          variant="secondary"
          leading={<AppleLogo />}
          loading={pending === "apple"}
          disabled={pending !== null}
          onPress={() => start("apple")}
        />
      ) : null}
    </View>
  );
}
