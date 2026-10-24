import Svg, { Path } from "react-native-svg";

export const SHEET_CAP_HEIGHT = 72;

/**
 * Curved top edge of the onboarding sheet: a small rounded corner top-left,
 * an edge sloping down to the right, and a large rounded corner top-right.
 */
export function SheetCapBase({ width, fill }: { width: number; fill: string }) {
  const h = SHEET_CAP_HEIGHT;
  const d = [
    `M0 ${h}`,
    "V26",
    "Q0 0 26 0.6",
    `L${width - 36} 28`,
    `Q${width} 31 ${width} 66`,
    `V${h}`,
    "Z",
  ].join(" ");

  return (
    <Svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      <Path d={d} fill={fill} />
    </Svg>
  );
}
