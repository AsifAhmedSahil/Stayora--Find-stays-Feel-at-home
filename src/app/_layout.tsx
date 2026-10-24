import "@/lib/react-native-css-compat";
import "../global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { clerkPublishableKey, missingClerkKeyMessage } from "@/lib/auth/clerk-config";
import { useSession } from "@/lib/auth/session";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  if (!clerkPublishableKey) {
    // Thrown during render (not at import) so the router can still load this route and show the error.
    if (!__DEV__) throw new Error(missingClerkKeyMessage);
    console.warn(`${missingClerkKeyMessage} Running without Clerk.`);
    return <RootNavigator />;
  }

  // `tokenCache` keeps the session in expo-secure-store, so it survives restarts.
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  );
}

function RootNavigator() {
  const { isLoaded: authLoaded, isSignedIn } = useSession();
  const [fontsLoaded, fontError] = useFonts({
    "PlusJakartaSans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });
  // A font error falls back to the system font instead of leaving a blank screen.
  const ready = (fontsLoaded || fontError != null) && authLoaded;

  useEffect(() => {
    if (fontError) console.warn(`Fonts failed to load: ${fontError.message}`);
  }, [fontError]);

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="index" />
      <Stack.Screen name="design-system" />
    </Stack>
  );
}
