import { useUnstableNativeVariable } from "react-native-css/native";
import { StayoraWordmarkBase } from "./stayora-wordmark-base";

export function StayoraWordmark() {
  const yellow = useUnstableNativeVariable("--color-brand-yellow");

  return <StayoraWordmarkBase yellow={yellow} />;
}
