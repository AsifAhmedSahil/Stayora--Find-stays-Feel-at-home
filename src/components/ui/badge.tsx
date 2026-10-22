import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";

const variants = {
  neutral: "bg-surface-muted",
  success: "bg-success/10",
  favorite: "bg-brand-yellow/20",
  discount: "bg-danger/10",
  new: "bg-success/10",
  superhost: "bg-info/10",
} as const;

type BadgeProps = ViewProps & {
  label: string;
  variant?: keyof typeof variants;
  className?: string;
};

export function Badge({
  label,
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <View
      className={cn(
        "min-h-8 flex-row items-center justify-center rounded-pill px-3 py-1",
        variants[variant],
        className,
      )}
      {...props}
    >
      <AppText
        variant="caption"
        tone={
          variant === "success" || variant === "new"
            ? "success"
            : variant === "discount"
              ? "danger"
              : variant === "superhost"
                ? "accent"
                : "default"
        }
      >
        {label}
      </AppText>
    </View>
  );
}
