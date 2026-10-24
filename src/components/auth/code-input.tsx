import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { AppText } from "@/components/ui";
import { cn } from "@/lib/cn";

export const CODE_LENGTH = 6;

type CodeInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onComplete?: (code: string) => void;
  error?: string;
  editable?: boolean;
};

/** Six boxes over one hidden input, so paste and iOS one-time-code autofill work. */
export function CodeInput({ value, onChangeText, onComplete, error, editable = true }: CodeInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, CODE_LENGTH - 1);

  return (
    <View className="gap-2">
      <Pressable
        accessible={false}
        onPress={() => inputRef.current?.focus()}
        className="flex-row gap-2"
      >
        {Array.from({ length: CODE_LENGTH }, (_, i) => (
          <View
            key={i}
            className={cn(
              "h-15 flex-1 items-center justify-center rounded-field border-2 bg-surface-muted",
              error
                ? "border-danger"
                : focused && i === activeIndex
                  ? "border-brand-lavender"
                  : "border-surface-muted",
            )}
          >
            <AppText variant="title">{value[i] ?? ""}</AppText>
          </View>
        ))}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
            onChangeText(digits);
            if (digits.length === CODE_LENGTH) onComplete?.(digits);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          autoFocus
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={CODE_LENGTH}
          accessibilityLabel="Verification code"
          accessibilityHint={error ?? `Enter the ${CODE_LENGTH}-digit code`}
          caretHidden
          className="absolute inset-0 text-input opacity-0"
        />
      </Pressable>
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
