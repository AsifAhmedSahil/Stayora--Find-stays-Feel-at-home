import { Pressable, View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";
import { Icon } from "./icon";

const variants = {
  success: {
    container: "bg-success/10",
    tone: "success",
    icon: "check",
  },
  error: {
    container: "bg-danger/10",
    tone: "danger",
    icon: "warning",
  },
  info: {
    container: "bg-info/10",
    tone: "info",
    icon: "info",
  },
} as const;

type AlertProps = ViewProps & {
  title?: string;
  message: string;
  variant?: keyof typeof variants;
  onDismiss?: () => void;
};

export function Alert({
  title,
  message,
  variant = "info",
  onDismiss,
  className,
  ...props
}: AlertProps) {
  const appearance = variants[variant];

  return (
    <View
      accessibilityRole="alert"
      className={cn(
        "min-h-12 flex-row items-center gap-3 rounded-field px-4 py-3",
        appearance.container,
        className,
      )}
      {...props}
    >
      <Icon name={appearance.icon} tone={appearance.tone} />
      <View className="flex-1 gap-1">
        {title ? (
          <AppText variant="label" tone={appearance.tone}>
            {title}
          </AppText>
        ) : null}
        <AppText variant="caption" tone={appearance.tone}>
          {message}
        </AppText>
      </View>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss alert"
          className="min-h-12 min-w-12 items-center justify-center rounded-full active:opacity-60"
          onPress={onDismiss}
        >
          <Icon name="close" size="sm" tone={appearance.tone} />
        </Pressable>
      ) : null}
    </View>
  );
}
