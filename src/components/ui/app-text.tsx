import { Text as NativeText, type TextProps } from "react-native";
import { cn } from "@/lib/cn";

const variants = {
  wordmark: "font-display text-wordmark",
  display: "font-heading text-display",
  title: "font-heading text-title",
  heading: "font-heading text-heading",
  body: "font-body text-body",
  label: "font-body-medium text-label",
  caption: "font-body text-caption",
  button: "font-body-semibold text-button",
} as const;

export type AppTextVariant = keyof typeof variants;
export type TextTone =
  | "default"
  | "secondary"
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "inverted"
  | "onBrand";

const tones = {
  default: "text-ink",
  secondary: "text-muted",
  accent: "text-accent",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
  inverted: "text-canvas",
  onBrand: "text-on-brand",
} as const;

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  tone?: TextTone;
  className?: string;
};

export function AppText({
  variant = "body",
  tone = "default",
  className,
  style,
  ...props
}: AppTextProps) {
  return (
    <NativeText
      className={cn(variants[variant], tones[tone], className)}
      style={style}
      {...props}
    />
  );
}

export { AppText as Text };
