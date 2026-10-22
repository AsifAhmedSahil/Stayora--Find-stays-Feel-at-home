import { View, type ViewProps, type ViewStyle, type StyleProp } from "react-native";
import { cn } from "@/lib/cn";

const variants = {
  card: "rounded-card border border-line bg-surface p-4",
  elevated: "rounded-card bg-surface p-4 shadow-surface",
  muted: "rounded-card bg-surface-muted p-4",
  glass: "rounded-surface border border-line bg-glass p-4",
} as const;

type SurfaceProps = ViewProps & {
  variant?: keyof typeof variants;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Surface({
  variant = "card",
  className,
  style,
  ...props
}: SurfaceProps) {
  return (
    <View
      className={cn(variants[variant], className)}
      style={[{ borderCurve: "continuous" }, style]}
      {...props}
    />
  );
}
