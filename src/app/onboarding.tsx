import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SocialButtons } from "@/components/auth/social-buttons";
import { StayoraWordmark } from "@/components/brand/stayora-wordmark";
import { OnboardingPage } from "@/components/onboarding/onboarding-page";
import { onboardingSlides, type OnboardingSlide } from "@/components/onboarding/onboarding-slides";
import { AppText, Button } from "@/components/ui";

// Two pill buttons and the gap between them.
const ACTIONS_HEIGHT = 52 * 2 + 10;
// Progress bars, a two-line headline and a three-line body.
const SHEET_CONTENT_HEIGHT = 224;

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [index, setIndex] = useState(0);

  const bottomInset = Math.max(insets.bottom, 16);
  const sheetTop = Math.min(
    Math.round(height * 0.575),
    height - bottomInset - ACTIONS_HEIGHT - SHEET_CONTENT_HEIGHT,
  );
  const isLast = index === onboardingSlides.length - 1;

  useEffect(() => {
    Image.prefetch(onboardingSlides.map((slide) => slide.image));
  }, []);

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  function next() {
    if (isLast) {
      router.push("/sign-up");
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: !reduceMotion });
    setIndex(index + 1);
  }

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <FlatList
        ref={listRef}
        data={onboardingSlides}
        keyExtractor={(slide) => slide.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item, index: i }) => (
          <OnboardingPage
            slide={item}
            index={i}
            count={onboardingSlides.length}
            width={width}
            height={height}
            sheetTop={sheetTop}
          />
        )}
      />

      <View
        pointerEvents="box-none"
        className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-6"
        style={{ paddingTop: insets.top + 4 }}
      >
        <StayoraWordmark />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip"
          onPress={() => router.push("/sign-up")}
          className="min-h-11 items-center justify-center rounded-pill bg-glass px-4 active:opacity-80"
        >
          <AppText variant="button">Skip</AppText>
        </Pressable>
      </View>

      <View
        className="absolute left-0 right-0 gap-2.5 px-6"
        style={{ bottom: bottomInset }}
      >
        <Button
          title="Get started"
          size="pill"
          icon="arrowRight"
          iconPosition="end"
          onPress={next}
        />
        <SocialButtons only="google" />
      </View>
    </View>
  );
}
