import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";
import { IconButton } from "./icon-button";

type StepperProps = ViewProps & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
};

export function Stepper({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  label = "Quantity",
  className,
  ...props
}: StepperProps) {
  return (
    <View
      accessibilityLabel={label}
      className={cn(
        "min-h-12 flex-row items-center gap-3 rounded-pill border border-line bg-surface px-2",
        className,
      )}
      {...props}
    >
      <IconButton
        icon="minus"
        label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= min}
        className="h-12 w-12 border-0 bg-transparent"
        onPress={() => onChange(Math.max(min, value - step))}
      />
      <AppText variant="label" accessibilityLiveRegion="polite">
        {value}
      </AppText>
      <IconButton
        icon="plus"
        label={`Increase ${label.toLowerCase()}`}
        disabled={value >= max}
        className="h-12 w-12 border-0 bg-transparent"
        onPress={() => onChange(Math.min(max, value + step))}
      />
    </View>
  );
}
