import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { StayoraWordmark } from "@/components/brand/stayora-wordmark";
import { AppText, IconButton, SafeAreaView } from "@/components/ui";

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreen({ title, subtitle, children, footer }: AuthScreenProps) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6 pb-4 pt-2"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <IconButton
            icon="chevronLeft"
            label="Back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/onboarding"))}
          />
          <StayoraWordmark size="sm" />
        </View>
        <AppText variant="hero" accessibilityRole="header" className="mt-8">
          {title}
        </AppText>
        <AppText variant="lead" tone="secondary" className="mt-3">
          {subtitle}
        </AppText>
        {children}
        {footer ? (
          <>
            <View className="min-h-8 flex-1" />
            {footer}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
