import { useUnstableNativeVariable } from "react-native-css/native";
import { StayoraWordmarkBase, type WordmarkSize } from "./stayora-wordmark-base";

export function StayoraWordmark({ size }: { size?: WordmarkSize }) {
  const yellow = useUnstableNativeVariable("--color-brand-yellow");

  return <StayoraWordmarkBase yellow={yellow} size={size} />;
}
