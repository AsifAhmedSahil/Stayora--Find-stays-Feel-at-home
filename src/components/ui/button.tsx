import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { cn } from "@/lib/cn";
import type { IconName } from "./icons";
import { AppText } from "./app-text";
import { Icon } from "./icon";

const variants = {
  primary: "bg-brand-yellow",
  secondary: "border border-line bg-surface",
  lavender: "bg-brand-lavender",
  quiet: "bg-transparent",
} as const;

const sizes = {
  sm: "min-h-12 gap-2 rounded-field px-4 py-2",
  md: "min-h-12 gap-2 rounded-field px-5 py-3",
  lg: "min-h-14 gap-2 rounded-card px-6 py-4",
  pill: "min-h-13 gap-3 rounded-pill px-12 py-3",
  pillCompact: "min-h-12 gap-6 rounded-pill px-12 py-2.5",
} as const;

type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: "leading" | "trailing" | "end";
  leading?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "trailing",
  leading,
  className,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const unavailable = disabled || loading;
  const onBrand = variant === "primary" || variant === "lavender";
  const contentTone = onBrand ? "onBrand" : "default";
  const pill = size === "pill" || size === "pillCompact";
  const labelVariant = pill ? (onBrand ? "buttonStrong" : "buttonLarge") : "button";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      className={cn(
        "flex-row items-center justify-center active:opacity-80",
        variants[variant],
        sizes[size],
        unavailable && "opacity-50",
        className,
      )}
      disabled={unavailable}
      style={style}
      {...props}
    >
      {loading ? <ActivityIndicator /> : null}
      {!loading ? leading : null}
      {!loading && icon && iconPosition === "leading" ? (
        <Icon name={icon} tone={contentTone} />
      ) : null}
      {!loading ? (
        <AppText variant={labelVariant} tone={contentTone}>
          {title}
        </AppText>
      ) : null}
      {!loading && icon && iconPosition === "trailing" ? (
        <Icon name={icon} tone={contentTone} />
      ) : null}
      {!loading && icon && iconPosition === "end" ? (
        <View className="absolute right-6">
          <Icon name={icon} tone={contentTone} />
        </View>
      ) : null}
    </Pressable>
  );
}
