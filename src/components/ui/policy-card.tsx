import { Pressable, View, type PressableProps } from "react-native";
import { cn } from "@/lib/cn";
import type { IconName } from "./icons";
import { AppText } from "./app-text";
import { Icon } from "./icon";

type PolicyCardProps = Omit<PressableProps, "children"> & {
  title: string;
  description: string;
  icon: IconName;
  className?: string;
};

export function PolicyCard({
  title,
  description,
  icon,
  className,
  ...props
}: PolicyCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      className={cn(
        "flex-row items-center gap-3 rounded-card bg-lavender-soft p-4 active:opacity-80",
        className,
      )}
      {...props}
    >
      <View className="h-11 w-11 items-center justify-center rounded-field bg-brand-lavender/40">
        <Icon name={icon} tone="accent" />
      </View>
      <View className="flex-1 gap-1">
        <AppText variant="label">{title}</AppText>
        <AppText variant="caption">{description}</AppText>
      </View>
      <Icon name="chevronRight" size="sm" tone="accent" />
    </Pressable>
  );
}
