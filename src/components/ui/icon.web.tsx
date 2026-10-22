import { icons, type IconName, type IconTone } from "./icons";

type IconProps = {
  name: IconName;
  size?: "sm" | "md" | "lg";
  tone?: IconTone;
  strokeWidth?: number;
};

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

const colorTokens = {
  default: "ink",
  onBrand: "on-brand",
  secondary: "muted",
  accent: "accent",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
} as const;

export function Icon({
  name,
  size = "md",
  tone = "default",
  strokeWidth = 2,
}: IconProps) {
  const IconComponent = icons[name];

  return (
    <IconComponent
      color={`var(--color-${colorTokens[tone]})`}
      size={sizes[size]}
      strokeWidth={strokeWidth}
    />
  );
}
