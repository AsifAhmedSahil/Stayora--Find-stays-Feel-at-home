import { SymbolView } from "expo-symbols";
import { useUnstableNativeVariable } from "react-native-css/native";

/** Apple's logo from the system SF Symbols set (iOS only). */
export function AppleLogo() {
  const ink = useUnstableNativeVariable("--color-ink");

  return <SymbolView name="apple.logo" size={24} tintColor={ink} accessibilityElementsHidden />;
}
