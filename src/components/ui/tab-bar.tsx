import { useState } from "react";
import { Platform, Pressable, type StyleProp, type ViewStyle } from "react-native";
import { GlassView } from "expo-glass-effect";
import { styled } from "react-native-css/native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";
import { Icon } from "./icon";
import type { IconName } from "./icons";

const StyledGlassView = styled(GlassView, { className: "style" });

export type TabItem = {
  key: string;
  label: string;
  icon: IconName;
};

type TabBarProps = {
  items: TabItem[];
  selectedKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function TabBar({
  items,
  selectedKey,
  onChange,
  className,
  style,
}: TabBarProps) {
  const [internalKey, setInternalKey] = useState(items[0]?.key ?? "");
  const selected = selectedKey ?? internalKey;

  return (
    <StyledGlassView
      accessibilityRole="tablist"
      glassEffectStyle={Platform.OS === "ios" ? "regular" : "none"}
      isInteractive
      className={cn(
        "flex-row items-center justify-around gap-1 rounded-full border border-line bg-glass px-2 py-2 shadow-floating",
        className,
      )}
      style={[{ borderCurve: "continuous" }, style]}
    >
      {items.map((item) => {
        const isSelected = selected === item.key;

        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isSelected }}
            className={cn(
              "min-h-14 min-w-14 flex-1 items-center justify-center gap-1 rounded-full px-2 py-2 active:opacity-75",
              isSelected && "bg-brand-yellow",
            )}
            onPress={() => {
              setInternalKey(item.key);
              onChange?.(item.key);
            }}
          >
            <Icon name={item.icon} tone={isSelected ? "onBrand" : "default"} />
            <AppText
              variant="caption"
              tone={isSelected ? "onBrand" : "secondary"}
              numberOfLines={1}
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </StyledGlassView>
  );
}
