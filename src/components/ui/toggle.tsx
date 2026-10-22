import {
  Switch,
  View,
  type StyleProp,
  type SwitchProps,
  type ViewStyle,
} from "react-native";
import { useUnstableNativeVariable } from "react-native-css/native";
import { AppText } from "./app-text";
import { cn } from "@/lib/cn";

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
  const lineColor = useUnstableNativeVariable("--color-line");
  const selectedColor = useUnstableNativeVariable("--color-brand-yellow");
  const thumbColor = useUnstableNativeVariable("--color-surface");

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
        trackColor={{ false: lineColor, true: selectedColor }}
        thumbColor={thumbColor}
        value={value}
        onValueChange={onValueChange}
        {...props}
      />
    </View>
  );
}
