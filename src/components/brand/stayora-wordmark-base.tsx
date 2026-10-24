import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { AppText } from "@/components/ui";

export type WordmarkSize = "md" | "sm";

export function StayoraWordmarkBase({ yellow, size = "md" }: { yellow: string; size?: WordmarkSize }) {
  const variant = size === "sm" ? "wordmarkSm" : "wordmark";

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Stayora"
      className="flex-row items-center"
    >
      <AppText variant={variant}>Stay</AppText>
      <View className={size === "sm" ? "h-6 w-6" : "h-9 w-9"}>
        <Svg width="100%" height="100%" viewBox="0 0 36 36">
          <Path
            d="M18 2C9.16 2 2 9.16 2 18s7.16 16 16 16 16-7.16 16-16S26.84 2 18 2Zm-6 32V17a6 6 0 0 1 12 0v17h-12Z"
            fill={yellow}
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </Svg>
      </View>
      <AppText variant={variant}>ra</AppText>
    </View>
  );
}
