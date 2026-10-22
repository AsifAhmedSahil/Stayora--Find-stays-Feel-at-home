import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";
import { Icon } from "./icon";
import type { IconName } from "./icons";

type ChipProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  selected?: boolean;
  icon?: IconName;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  label,
  selected = false,
  disabled = false,
  icon,
  className,
  style,
  ...props
}: ChipProps) {
  const isDisabled = Boolean(disabled);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: isDisabled }}
      className={cn(
        "min-h-12 flex-row items-center justify-center gap-2 rounded-pill border px-4 py-2 active:opacity-80",
        selected
          ? "border-brand-lavender bg-brand-lavender"
          : "border-line bg-surface",
        isDisabled && "opacity-50",
        className,
      )}
      disabled={isDisabled}
      style={style}
      {...props}
    >
      {icon ? (
        <Icon name={icon} size="sm" tone={selected ? "onBrand" : "default"} />
      ) : null}
      <AppText variant="label" tone={selected ? "onBrand" : "default"}>
        {label}
      </AppText>
    </Pressable>
  );
}
