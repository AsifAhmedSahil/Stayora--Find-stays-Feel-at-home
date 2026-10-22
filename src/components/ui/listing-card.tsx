import { useState } from "react";
import {
  Image,
  Pressable,
  View,
  type ImageSourcePropType,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cn } from "@/lib/cn";
import { AppText } from "./app-text";
import { Badge } from "./badge";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { Surface } from "./surface";

type ListingCardProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  location: string;
  price: string;
  rating?: string;
  reviewCount?: string;
  features?: string[];
  imageSource?: ImageSourcePropType;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function ListingCard({
  title,
  location,
  price,
  rating = "4.9",
  reviewCount = "342",
  features = ["Hot tub", "Pet friendly"],
  imageSource,
  className,
  style,
  ...props
}: ListingCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <Surface
      variant="elevated"
      className={cn("relative flex-row gap-3 p-3", className)}
      style={style}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${location}, ${price} per night`}
        className="flex-1 flex-row gap-3 active:opacity-90"
        {...props}
      >
        <View className="h-28 w-28 overflow-hidden rounded-field bg-lavender-soft">
          {imageSource ? (
            <Image
              source={imageSource}
              accessibilityLabel={`${title} stay`}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Icon name="trees" size="lg" tone="secondary" />
            </View>
          )}
        </View>

        <View className="min-w-0 flex-1 justify-between gap-2 py-1">
          <View className="gap-1">
            <AppText variant="label" numberOfLines={2}>
              {title}
            </AppText>
            <View className="flex-row items-center gap-1">
              <Icon name="mapPin" size="sm" tone="secondary" />
              <AppText variant="caption" numberOfLines={1}>
                {location}
              </AppText>
            </View>
          </View>

          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row items-center gap-1">
              <Icon name="star" size="sm" tone="warning" />
              <AppText variant="caption">{rating}</AppText>
              <AppText variant="caption" tone="secondary">
                ({reviewCount})
              </AppText>
            </View>
            {features.slice(0, 2).map((feature) => (
              <Badge key={feature} label={feature} />
            ))}
          </View>

          <View className="flex-row items-baseline gap-1">
            <AppText variant="label">{price}</AppText>
            <AppText variant="caption">/ night</AppText>
          </View>
        </View>
      </Pressable>
      <View className="absolute right-4 top-4">
        <IconButton
          icon="heart"
          label={saved ? "Remove from saved" : "Save stay"}
          selected={saved}
          className="h-12 w-12 border-0 bg-surface/90"
          onPress={() => setSaved(!saved)}
        />
      </View>
    </Surface>
  );
}
