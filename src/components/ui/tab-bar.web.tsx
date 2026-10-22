import { useState } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";
import { Icon } from "./icon";
import type { IconName } from "./icons";

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
    <View
      accessibilityRole="tablist"
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
    </View>
  );
}
