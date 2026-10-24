import { useState, type ReactNode, type Ref } from "react";
import {
  TextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
  View,
} from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";
import { Icon } from "./icon";
import type { IconName } from "./icons";

type TextFieldProps = Omit<TextInputProps, "accessibilityLabel" | "style"> & {
  label: string;
  /** `outlined`: label above a bordered box. `filled`: two-line label and input inside a muted box. */
  variant?: "outlined" | "filled";
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  trailing?: ReactNode;
  error?: string;
  ref?: Ref<TextInput>;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  variant = "outlined",
  leadingIcon,
  trailingIcon,
  trailing,
  error,
  ref,
  className,
  style,
  editable = true,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = variant === "filled";

  const input = (
    <TextInput
      ref={ref}
      accessibilityLabel={label}
      accessibilityHint={error}
      className={cn(
        "font-jakarta-regular text-input text-ink placeholder:text-muted",
        filled ? "py-0" : "min-h-12 flex-1 py-3",
      )}
      editable={editable}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      {...props}
    />
  );

  return (
    <View className="gap-2" style={style}>
      {filled ? null : (
        <AppText variant="caption" tone="secondary">
          {label}
        </AppText>
      )}
      <View
        className={cn(
          "flex-row items-center rounded-field",
          filled
            ? "min-h-15 gap-6 border-2 bg-surface-muted px-5 py-2.5"
            : "min-h-12 gap-3 border bg-surface px-4",
          filled && !focused && !error && "border-surface-muted",
          !filled && !focused && !error && "border-line",
          focused && "border-2 border-brand-lavender",
          error && "border-2 border-danger",
          !filled && focused && "bg-surface",
          editable ? "" : "opacity-60",
          !editable && !filled && "bg-surface-muted",
          className,
        )}
      >
        {leadingIcon ? <Icon name={leadingIcon} /> : null}
        {filled ? (
          <View className="flex-1 gap-0.5">
            <AppText variant="label">{label}</AppText>
            {input}
          </View>
        ) : (
          input
        )}
        {trailingIcon ? <Icon name={trailingIcon} /> : null}
        {trailing}
      </View>
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
