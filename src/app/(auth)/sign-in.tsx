import { useSignIn } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, View, type TextInputInstance } from "react-native";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { AuthScreen } from "@/components/auth/auth-screen";
import { OrDivider } from "@/components/auth/or-divider";
import { PasswordField } from "@/components/auth/password-field";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Alert, AppText, Button, TextField } from "@/components/ui";
import { authErrors, clerkErrorMessage } from "@/lib/auth/errors";
import { stayOnScreen } from "@/lib/auth/flows";
import { hasErrors, validateSignIn, type FieldErrors } from "@/lib/auth/validate";

type Field = "email" | "password";
type Notice = { variant: "error" | "info"; message: string };

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const passwordRef = useRef<TextInputInstance>(null);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: Field, value: string) {
    setValues({ ...values, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  }

  async function submit() {
    if (loading) return;
    setNotice(null);
    const fieldErrors = validateSignIn(values);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    setLoading(true);
    const outcome = await passwordSignIn();
    setLoading(false);
    if (outcome === "verify") {
      router.push({ pathname: "/verify", params: { flow: "sign-in" } });
      return;
    }
    if (outcome) {
      const { message, field } = clerkErrorMessage(outcome);
      if (field === "email" || field === "password") setErrors({ [field]: message });
      else setNotice({ variant: "error", message });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  /** Null once the session is active, "verify" when a new device needs an email code, otherwise the error. */
  async function passwordSignIn(): Promise<unknown> {
    const { error } = await signIn.password({
      emailAddress: values.email.trim(),
      password: values.password,
    });
    if (error) return error;
    if (signIn.status === "complete") {
      return (await signIn.finalize(stayOnScreen)).error;
    }
    const emailSecondFactor = signIn.supportedSecondFactors.some(
      (factor) => factor.strategy === "email_code",
    );
    if (
      (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") &&
      emailSecondFactor
    ) {
      const sent = await signIn.mfa.sendEmailCode();
      return sent.error ?? "verify";
    }
    // Statuses this instance doesn't use (e.g. needs_protect_check) get the generic copy.
    return new Error(`Unhandled sign-in status ${signIn.status}`);
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to pick up where you left off with your saved stays and trips."
      footer={
        <AuthFooterLink prompt="New to Stayora?" label="Create an account" href="/sign-up" />
      }
    >
      <View className="mt-6 gap-3.5">
        <TextField
          variant="filled"
          label="Email address"
          leadingIcon="mail"
          placeholder="you@example.com"
          value={values.email}
          onChangeText={(text) => update("email", text)}
          error={errors.email}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <PasswordField
          ref={passwordRef}
          label="Password"
          placeholder="Your password"
          value={values.password}
          onChangeText={(text) => update("password", text)}
          error={errors.password}
          textContentType="password"
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setNotice({ variant: "info", message: authErrors.passwordResetSoon })}
        className="min-h-12 justify-center self-end active:opacity-60"
      >
        <AppText variant="label" tone="accent">
          Forgot password?
        </AppText>
      </Pressable>

      {notice ? (
        <Alert
          variant={notice.variant}
          message={notice.message}
          onDismiss={() => setNotice(null)}
          className="mb-2"
        />
      ) : null}

      <Button
        title="Sign in"
        size="pill"
        icon="arrowRight"
        iconPosition="end"
        loading={loading}
        onPress={submit}
        className="mt-2"
      />
      {/* Clerk's bot protection mounts its widget here when it's enabled. */}
      <View nativeID="clerk-captcha" />

      <OrDivider />
      <SocialButtons />
    </AuthScreen>
  );
}
