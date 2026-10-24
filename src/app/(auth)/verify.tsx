import { useSignIn, useSignUp } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { AuthScreen } from "@/components/auth/auth-screen";
import { CODE_LENGTH, CodeInput } from "@/components/auth/code-input";
import { Alert, AppText, Button } from "@/components/ui";
import { authErrors, clerkErrorMessage } from "@/lib/auth/errors";
import { CLERK_TEST_CODE, isClerkTestEmail, stayOnScreen } from "@/lib/auth/flows";

const RESEND_SECONDS = 30;

export default function Verify() {
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  // Kept from the first render: once the code passes, the attempt completes while the guard navigates.
  const [startedWith] = useState(() => {
    if (flow === "sign-in") {
      const waiting = signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor";
      return waiting ? { flow: "sign-in" as const, email: signIn.identifier ?? "" } : null;
    }
    const waiting =
      signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address");
    return waiting ? { flow: "sign-up" as const, email: signUp.emailAddress ?? "" } : null;
  });
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
    const failure = await checkCode(value);
    setLoading(false);
    if (failure) {
      setError(clerkErrorMessage(failure).message);
      setCode("");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  /** Null once the session is active, otherwise the error. */
  async function checkCode(value: string): Promise<unknown> {
    if (isSignIn) {
      const { error: checkError } = await signIn.mfa.verifyEmailCode({ code: value });
      if (checkError) return checkError;
      if (signIn.status !== "complete") return new Error(`Sign-in still ${signIn.status}`);
      return (await signIn.finalize(stayOnScreen)).error;
    }
    const { error: checkError } = await signUp.verifications.verifyEmailCode({ code: value });
    if (checkError) return checkError;
    if (signUp.status !== "complete") return new Error(`Sign-up missing ${signUp.missingFields}`);
    return (await signUp.finalize(stayOnScreen)).error;
  }

  async function resend() {
    setSecondsLeft(RESEND_SECONDS);
    setError(undefined);
    setNotice(null);
    const { error: sendError } = isSignIn
      ? await signIn.mfa.sendEmailCode()
      : await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(clerkErrorMessage(sendError).message);
      return;
    }
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
        {__DEV__ && isClerkTestEmail(startedWith.email) ? (
          <AppText variant="caption" tone="secondary" className="mt-2">
            Test email: use code {CLERK_TEST_CODE}
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
