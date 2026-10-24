import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StayoraWordmark } from "@/components/brand/stayora-wordmark";
import {
  AppText,
  Button,
  Chip,
  Icon,
  ListingCard,
  SafeAreaView,
  TextField,
} from "@/components/ui";
import { useSession } from "@/lib/auth/session";

const categories = ["All stays", "Cabins", "Beach", "City", "Villas"] as const;

export default function Home() {
  const { signOut } = useSession();
  const [category, setCategory] = useState<(typeof categories)[number]>("All stays");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const showCabin =
    (category === "All stays" || category === "Cabins") &&
    "modern cabin with hot tub lake arrowhead".includes(normalizedQuery);

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-7 px-6 pb-10 pt-4">
          <View className="flex-row items-center justify-between">
            <StayoraWordmark />
            {__DEV__ ? (
              <Link href="/design-system" asChild>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel="Open design system gallery"
                  className="h-12 w-12 items-center justify-center rounded-full border border-line bg-surface active:opacity-75"
                >
                  <Icon name="sliders" />
                </Pressable>
              </Link>
            ) : (
              <View className="h-3 w-3 rounded-full bg-brand-yellow" />
            )}
          </View>

          <View className="gap-3">
            <AppText variant="display">Find your next unforgettable stay.</AppText>
            <AppText variant="body" tone="secondary">
              Thoughtful places for every kind of trip.
            </AppText>
          </View>

          <View className="gap-4">
            <TextField
              label="Search stays"
              onChangeText={setQuery}
              placeholder="Where do you want to go?"
              returnKeyType="search"
              value={query}
            />
            <ScrollView
              horizontal
              contentContainerClassName="gap-2"
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onPress={() => setCategory(item)}
                  selected={category === item}
                />
              ))}
            </ScrollView>
          </View>

          <View className="gap-4">
            <View className="gap-1">
              <AppText variant="heading">A stay worth the trip</AppText>
              <AppText variant="body" tone="secondary">
                Picked for a slower kind of weekend.
              </AppText>
            </View>

            {showCabin ? (
              <ListingCard
                title="Modern Cabin with Hot Tub"
                location="Lake Arrowhead, California"
                price="$280"
                features={["Hot tub", "Pet friendly"]}
              />
            ) : (
              <View className="rounded-card bg-surface-muted p-4">
                <AppText variant="body">
                  No stays match those filters yet. Try another destination or category.
                </AppText>
              </View>
            )}
          </View>

          <Button
            onPress={() => {
              setCategory("All stays");
              setQuery("");
            }}
            title="Show all stays"
            variant="primary"
          />

          <Button onPress={() => signOut()} title="Sign out" variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
