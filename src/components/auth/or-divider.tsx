import { View } from "react-native";
import { AppText } from "@/components/ui";

export function OrDivider() {
  return (
    <View className="mb-5 mt-6 flex-row items-center" accessible accessibilityLabel="or">
      <View className="h-px flex-1 bg-line" />
      <AppText variant="label" tone="secondary" className="px-4">
        or
      </AppText>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
}
