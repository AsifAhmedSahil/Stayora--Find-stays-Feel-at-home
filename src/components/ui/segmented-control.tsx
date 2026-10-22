import { Pressable, View, type ViewProps } from "react-native";
import { AppText } from "./app-text";
import { cn } from "@/lib/cn";

export type SegmentOption<Value extends string = string> = {
  label: string;
  value: Value;
};

type SegmentedControlProps<Value extends string> = ViewProps & {
  options: readonly SegmentOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export function SegmentedControl<Value extends string>({
  options,
  value,
  onChange,
  className,
  ...props
}: SegmentedControlProps<Value>) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        "flex-row gap-1 rounded-pill bg-surface-muted p-1",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            className={cn(
              "min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-pill px-4 py-2 active:opacity-80",
              selected && "bg-ink",
            )}
            onPress={() => onChange(option.value)}
          >
            <AppText
              variant="label"
              tone={selected ? "inverted" : "secondary"}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
