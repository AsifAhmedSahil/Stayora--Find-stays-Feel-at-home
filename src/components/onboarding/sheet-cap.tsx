import { SheetCapBase } from "./sheet-cap-base";

export function SheetCap({ width }: { width: number }) {
  return <SheetCapBase width={width} fill="var(--color-surface)" />;
}
