import { useSignUp } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { View, type TextInputInstance } from "react-native";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { AuthScreen } from "@/components/auth/auth-screen";
import { OrDivider } from "@/components/auth/or-divider";
import { PasswordField } from "@/components/auth/password-field";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Alert, Button, TextField } from "@/components/ui";
import { clerkErrorMessage } from "@/lib/auth/errors";
import { splitName } from "@/lib/auth/flows";
import { hasErrors, validateSignUp, type FieldErrors } from "@/lib/auth/validate";

type Field = "name" | "email" | "password";

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: Field, value: string) {
    setValues({ ...values, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  }

  async function submit() {
    if (loading) return;
    setFormError(null);
    const fieldErrors = validateSignUp(values);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    setLoading(true);
    const created = await signUp.password({
      emailAddress: values.email.trim(),
      password: values.password,
      ...splitName(values.name),
    });
    const sent = created.error ? created : await signUp.verifications.sendEmailCode();
    setLoading(false);
    if (sent.error) {
      const { message, field } = clerkErrorMessage(sent.error);
      if (field === "email" || field === "password") setErrors({ [field]: message });
      else setFormError(message);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    router.push({ pathname: "/verify", params: { flow: "sign-up" } });
  }

  return (
    <AuthScreen
      title={"Create\nyour account"}
      subtitle="Join Stayora to save your stays, get personalized recommendations and access them across all your devices."
      footer={
        <AuthFooterLink prompt="Already have an account?" label="Sign in" href="/sign-in" />
      }
    >
      <View className="mt-6 gap-3.5">
        <TextField
          variant="filled"
          label="Full name"
          leadingIcon="user"
          placeholder="e.g. Adrian Hajdin"
          value={values.name}
          onChangeText={(text) => update("name", text)}
          error={errors.name}
          textContentType="name"
          autoComplete="name"
          autoCapitalize="words"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <TextField
          ref={emailRef}
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
          placeholder="At least 8 characters"
          value={values.password}
          onChangeText={(text) => update("password", text)}
          error={errors.password}
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>

      {formError ? (
        <Alert
          variant="error"
          message={formError}
          onDismiss={() => setFormError(null)}
          className="mt-6"
        />
      ) : null}

      <Button
        title="Create account"
        size="pill"
        icon="arrowRight"
        iconPosition="end"
        loading={loading}
        onPress={submit}
        className="mt-6"
      />
      {/* Clerk's bot protection mounts its widget here when it's enabled. */}
      <View nativeID="clerk-captcha" />

      <OrDivider />
      <SocialButtons />
    </AuthScreen>
  );
}
