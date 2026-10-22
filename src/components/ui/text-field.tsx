import { useState } from "react";
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
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  leadingIcon,
  trailingIcon,
  className,
  style,
  editable = true,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-2" style={style}>
      <AppText variant="caption" tone="secondary">
        {label}
      </AppText>
      <View
        className={cn(
          "min-h-12 flex-row items-center gap-3 rounded-field border px-4",
          focused
            ? "border-2 border-brand-lavender bg-surface"
            : "border-line bg-surface",
          editable ? "" : "bg-surface-muted opacity-60",
          className,
        )}
      >
        {leadingIcon ? <Icon name={leadingIcon} /> : null}
        <TextInput
          accessibilityLabel={label}
          className="min-h-12 flex-1 py-3 font-jakarta-regular text-input text-ink placeholder:text-muted"
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
        {trailingIcon ? <Icon name={trailingIcon} /> : null}
      </View>
    </View>
  );
}
