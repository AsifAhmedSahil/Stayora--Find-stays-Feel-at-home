import { Image as BaseImage } from "expo-image";
import { View } from "react-native";
import { styled } from "react-native-css/native";
import { AppText, Icon } from "@/components/ui";
import type { OnboardingSlide } from "./onboarding-slides";
import { ProgressBars } from "./progress-bars";
import { SheetCap } from "./sheet-cap";
import { SHEET_CAP_HEIGHT } from "./sheet-cap-base";

const Image = styled(BaseImage, { className: "style" });

type OnboardingPageProps = {
  slide: OnboardingSlide;
  index: number;
  count: number;
  width: number;
  height: number;
  sheetTop: number;
};

export function OnboardingPage({ slide, index, count, width, height, sheetTop }: OnboardingPageProps) {
  return (
    <View style={{ width, height }}>
      <Image
        source={{ uri: slide.image }}
        contentFit="cover"
        transition={200}
        accessible={false}
        className="absolute left-0 right-0 top-0 bg-surface-muted"
        style={{ height: sheetTop + SHEET_CAP_HEIGHT }}
      />

      <View
        className="absolute left-6 min-h-10 flex-row items-center gap-2 rounded-pill border border-on-media/40 bg-scrim px-4"
        style={{ bottom: height - sheetTop + 14 }}
      >
        <Icon name="mapPin" size="sm" tone="onMedia" />
        <AppText variant="label" tone="onMedia">
          {slide.location}
        </AppText>
      </View>

      <View className="absolute bottom-0 left-0 right-0" style={{ top: sheetTop }}>
        <SheetCap width={width} />
        <View
          className="absolute bottom-0 left-0 right-0 bg-surface"
          style={{ top: SHEET_CAP_HEIGHT - 1 }}
        />
        <View className="absolute left-0 right-0 top-8 px-8">
          <ProgressBars count={count} index={index} />
          <AppText variant="hero" className="mt-4">
            {slide.title}
          </AppText>
          <AppText variant="lead" tone="secondary" className="mt-3">
            {slide.body}
          </AppText>
        </View>
      </View>
    </View>
  );
}
