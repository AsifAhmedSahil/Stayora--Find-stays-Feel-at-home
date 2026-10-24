import { useUnstableNativeVariable } from "react-native-css/native";
import { GoogleLogoBase } from "./google-logo-base";

export function GoogleLogo({ size }: { size?: number }) {
  const blue = useUnstableNativeVariable("--color-google-blue");
  const red = useUnstableNativeVariable("--color-google-red");
  const yellow = useUnstableNativeVariable("--color-google-yellow");
  const green = useUnstableNativeVariable("--color-google-green");

  return <GoogleLogoBase size={size} colors={{ blue, red, yellow, green }} />;
}
