import { Pressable, View, type PressableProps, type ViewProps } from "react-native";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { IconName } from "./icons";
import { AppText } from "./app-text";
import { Icon } from "./icon";

type ListRowProps = Omit<PressableProps, "children"> & {
  title: string;
  subtitle?: string;
  icon?: IconName;
  trailingIcon?: IconName;
  showChevron?: boolean;
  className?: string;
};

export function ListRow({
  title,
  subtitle,
  icon,
  trailingIcon,
  showChevron = true,
  className,
  ...props
}: ListRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      className={cn(
        "min-h-14 flex-row items-center gap-3 px-4 py-3 active:bg-surface-muted",
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} /> : null}
      <View className="flex-1 gap-1">
        <AppText variant="label">{title}</AppText>
        {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
      </View>
      {trailingIcon ? (
        <Icon name={trailingIcon} size="sm" />
      ) : showChevron ? (
        <Icon name="chevronRight" size="sm" tone="secondary" />
      ) : null}
    </Pressable>
  );
}

type ListGroupProps = ViewProps & {
  children: ReactNode;
};

export function ListGroup({ children, className, ...props }: ListGroupProps) {
  return (
    <View
      className={cn(
        "overflow-hidden rounded-card border border-line bg-surface",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
