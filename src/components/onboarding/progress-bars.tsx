import { View } from "react-native";
import { cn } from "@/lib/cn";

export function ProgressBars({ count, index }: { count: number; index: number }) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Page ${index + 1} of ${count}`}
      className="flex-row gap-2"
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className={cn("h-1.5 w-8 rounded-pill", i === index ? "bg-accent/60" : "bg-surface-muted")}
        />
      ))}
    </View>
  );
}
