import { useUnstableNativeVariable } from "react-native-css/native";
import { SheetCapBase } from "./sheet-cap-base";

export function SheetCap({ width }: { width: number }) {
  const surface = useUnstableNativeVariable("--color-surface");

  return <SheetCapBase width={width} fill={surface} />;
}
