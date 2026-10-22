import {
  Switch,
  View,
  type StyleProp,
  type SwitchProps,
  type ViewStyle,
} from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";

type ToggleProps = Omit<SwitchProps, "value" | "onValueChange" | "style"> & {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Toggle({
  label,
  description,
  value,
  onValueChange,
  className,
  style,
  ...props
}: ToggleProps) {
  return (
    <View
      className={cn("min-h-14 flex-row items-center justify-between gap-4", className)}
      style={style}
    >
      <View className="flex-1 gap-1">
        <AppText variant="label">{label}</AppText>
        {description ? <AppText variant="caption">{description}</AppText> : null}
      </View>
      <Switch
        accessibilityLabel={label}
        trackColor={{
          false: "var(--color-line)",
          true: "var(--color-brand-yellow)",
        }}
        thumbColor="var(--color-surface)"
        value={value}
        onValueChange={onValueChange}
        {...props}
      />
    </View>
  );
}
