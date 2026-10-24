import * as Haptics from "expo-haptics";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { AuthScreen } from "@/components/auth/auth-screen";
import { CODE_LENGTH, CodeInput } from "@/components/auth/code-input";
import { Alert, AppText, Button } from "@/components/ui";
import { authErrors } from "@/lib/auth/errors";
import { MOCK_VERIFICATION_CODE, mockAuth, useMockAuthState } from "@/lib/auth/mock-auth";

const RESEND_SECONDS = 30;

export default function Verify() {
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const { pending } = useMockAuthState();
  // Kept from the first render: after a successful check `pending` clears while the guard navigates.
  const [startedWith] = useState(pending);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  if (!startedWith) {
    return <Redirect href={flow === "sign-in" ? "/sign-in" : "/sign-up"} />;
  }

  const isSignIn = startedWith.flow === "sign-in";

  async function submit(value = code) {
    if (loading) return;
    if (value.length < CODE_LENGTH) {
      setError(authErrors.codeIncomplete);
      return;
    }
    setError(undefined);
    setNotice(null);
    setLoading(true);
    const result = await mockAuth.verify.code(value);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      setCode("");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  async function resend() {
    setSecondsLeft(RESEND_SECONDS);
    setError(undefined);
    await mockAuth.verify.resend();
    setNotice(`We sent a new code to ${startedWith?.email}.`);
  }

  return (
    <AuthScreen
      title={isSignIn ? "Confirm it's you" : "Check your email"}
      subtitle={
        isSignIn
          ? `You're signing in on a new device. Enter the 6-digit code we sent to ${startedWith.email}.`
          : `We sent a 6-digit code to ${startedWith.email}. Enter it below to finish creating your account.`
      }
    >
      <View className="mt-8">
        <CodeInput
          value={code}
          onChangeText={(value) => {
            setCode(value);
            if (error) setError(undefined);
          }}
          onComplete={submit}
          error={error}
          editable={!loading}
        />
        {__DEV__ ? (
          <AppText variant="caption" tone="secondary" className="mt-2">
            Mock auth: use code {MOCK_VERIFICATION_CODE}
          </AppText>
        ) : null}
      </View>

      {notice ? (
        <Alert
          variant="success"
          message={notice}
          onDismiss={() => setNotice(null)}
          className="mt-6"
        />
      ) : null}

      <Button
        title="Verify"
        size="pill"
        icon="arrowRight"
        iconPosition="end"
        loading={loading}
        onPress={() => submit()}
        className="mt-6"
      />

      <View className="mt-4 flex-row flex-wrap items-center justify-center gap-x-2">
        <AppText variant="body" tone="secondary">
          Didn&apos;t get a code?
        </AppText>
        {secondsLeft > 0 ? (
          <AppText variant="body" tone="secondary" className="min-h-12 py-3">
            Resend in 0:{String(secondsLeft).padStart(2, "0")}
          </AppText>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Resend code"
            onPress={resend}
            className="min-h-12 justify-center active:opacity-60"
          >
            <AppText variant="body" className="underline">
              Resend code
            </AppText>
          </Pressable>
        )}
      </View>
    </AuthScreen>
  );
}
