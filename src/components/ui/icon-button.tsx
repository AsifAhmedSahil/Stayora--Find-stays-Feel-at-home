import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cn } from "@/lib/cn";
import type { IconName } from "./icons";
import { Icon } from "./icon";

type IconButtonProps = Omit<PressableProps, "children" | "style"> & {
  icon: IconName;
  label: string;
  selected?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  label,
  selected = false,
  disabled = false,
  className,
  style,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      className={cn(
        "h-12 w-12 items-center justify-center rounded-full border border-line bg-surface active:opacity-80",
        selected && "bg-brand-yellow",
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled}
      style={style}
      {...props}
    >
      <Icon name={icon} tone={selected ? "onBrand" : "default"} />
    </Pressable>
  );
}
