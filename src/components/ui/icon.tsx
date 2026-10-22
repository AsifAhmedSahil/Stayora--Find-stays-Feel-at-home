import { useUnstableNativeVariable } from "react-native-css/native";
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

export function Icon({
  name,
  size = "md",
  tone = "default",
  strokeWidth = 2,
}: IconProps) {
  const ink = useUnstableNativeVariable("--color-ink");
  const onBrand = useUnstableNativeVariable("--color-on-brand");
  const muted = useUnstableNativeVariable("--color-muted");
  const accent = useUnstableNativeVariable("--color-accent");
  const success = useUnstableNativeVariable("--color-success");
  const danger = useUnstableNativeVariable("--color-danger");
  const warning = useUnstableNativeVariable("--color-warning");
  const info = useUnstableNativeVariable("--color-info");
  const IconComponent = icons[name];
  const colors = {
    default: ink,
    onBrand,
    secondary: muted,
    accent,
    success,
    danger,
    warning,
    info,
  };

  return (
    <IconComponent
      color={colors[tone]}
      size={sizes[size]}
      strokeWidth={strokeWidth}
    />
  );
}
