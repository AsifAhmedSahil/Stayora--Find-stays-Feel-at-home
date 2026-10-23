import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from "react-native";
import { StayoraWordmark } from "@/components/brand/stayora-wordmark";
import {
  Alert,
  AppText,
  Badge,
  Button,
  Chip,
  Icon,
  IconButton,
  ListGroup,
  ListRow,
  ListingCard,
  PolicyCard,
  SafeAreaView,
  SegmentedControl,
  Stepper,
  Surface,
  TabBar,
  TextField,
  Toggle,
  icons,
  type IconName,
} from "@/components/ui";

type SectionDefinition = {
  id: string;
  title: string;
};

const SectionWidthContext = createContext<number | undefined>(undefined);

const sectionDefinitions: SectionDefinition[] = [
  { id: "01-brand", title: "Brand" },
  { id: "02-palette", title: "Color palette" },
  { id: "03-typography", title: "Typography" },
  { id: "04-rhythm", title: "Spacing and shape" },
  { id: "05-buttons", title: "Buttons" },
  { id: "06-fields", title: "Input fields" },
  { id: "07-chips", title: "Filter chips" },
  { id: "08-badges", title: "Badges" },
  { id: "09-alerts", title: "Status and alerts" },
  { id: "10-listing", title: "Listing card" },
  { id: "11-policy", title: "Policy card" },
  { id: "12-lists", title: "List rows" },
  { id: "13-tabs", title: "Bottom navigation" },
  { id: "14-icons", title: "Iconography" },
  { id: "15-segments", title: "Segmented control" },
  { id: "16-controls", title: "Toggles and stepper" },
];

const swatches = [
  { name: "Brand yellow", token: "--color-brand-yellow", className: "bg-brand-yellow" },
  { name: "Brand lavender", token: "--color-brand-lavender", className: "bg-brand-lavender" },
  { name: "Ink", token: "--color-ink", className: "bg-ink" },
  { name: "Canvas", token: "--color-canvas", className: "bg-canvas" },
  { name: "Surface", token: "--color-surface", className: "bg-surface" },
  { name: "Lavender tint", token: "--color-lavender-soft", className: "bg-lavender-soft" },
  { name: "Success", token: "--color-success", className: "bg-success" },
  { name: "Signal", token: "--color-danger", className: "bg-danger" },
] as const;

const tabs = [
  { key: "explore", label: "Explore", icon: "search" },
  { key: "saved", label: "Saved", icon: "heart" },
  { key: "trips", label: "Trips", icon: "calendar" },
  { key: "profile", label: "Profile", icon: "user" },
] as const;

const iconNames = Object.keys(icons) as IconName[];

function SectionCard({
  id,
  title,
  onLayout,
  children,
}: {
  id: string;
  title: string;
  onLayout: (event: LayoutChangeEvent) => void;
  children: ReactNode;
}) {
  const width = useContext(SectionWidthContext);

  return (
    <Surface
      nativeID={id}
      variant="card"
      className="gap-4 shadow-surface"
      style={width ? { width } : undefined}
      onLayout={onLayout}
    >
      <AppText variant="heading">{title}</AppText>
      {children}
    </Surface>
  );
}

export default function DesignSystemScreen() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return <DesignSystemGallery />;
}

function DesignSystemGallery() {
  const { from, y } = useLocalSearchParams<{ from?: string; y?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const appliedQueryRef = useRef<string | null>(null);
  const queryLayoutReadyRef = useRef(false);
  const gridTop = useRef(0);
  const sectionTops = useRef<Record<string, number>>({});
  const { width: screenWidth } = useWindowDimensions();
  const [searchValue, setSearchValue] = useState("");
  const [selectedChip, setSelectedChip] = useState("All stays");
  const [favorite, setFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("explore");
  const [segment, setSegment] = useState("map");
  const [quietStay, setQuietStay] = useState(true);
  const [petFriendly, setPetFriendly] = useState(false);
  const [guests, setGuests] = useState(2);
  const [showSuccess, setShowSuccess] = useState(true);
  const [policyExpanded, setPolicyExpanded] = useState(false);
  const [rowExpanded, setRowExpanded] = useState(false);

  const columns = screenWidth >= 1360 ? 4 : screenWidth >= 760 ? 2 : 1;
  const contentWidth = Math.min(screenWidth - 40, 1440);
  const gap = 16;
  const sectionWidth = (contentWidth - gap * (columns - 1)) / columns;
  const selectedFrom = Array.isArray(from) ? from[0] : from;
  const selectedY = Array.isArray(y) ? y[0] : y;
  const sectionIndex = useMemo(() => {
    if (!selectedFrom) return -1;
    const normalized = selectedFrom.toLowerCase();
    return sectionDefinitions.findIndex(
      (section, index) =>
        section.id === normalized ||
        section.id.startsWith(`${normalized}-`) ||
        section.id.split("-").slice(1).join("-") === normalized ||
        `${index + 1}`.padStart(2, "0") === normalized,
    );
  }, [selectedFrom]);
  const queryKey = `${selectedY ?? ""}:${sectionIndex}:${screenWidth}`;

  const scrollToQuery = useCallback(() => {
    console.log("Scroll query", { queryKey, ready: queryLayoutReadyRef.current });
    if (!queryLayoutReadyRef.current) return;
    if (appliedQueryRef.current === queryKey) return;
    const scrollView = scrollRef.current;
    if (!scrollView) return;

    const offset = Number(selectedY);
    if (selectedY && Number.isFinite(offset) && offset >= 0) {
      scrollView.scrollTo({ y: offset, animated: false });
      appliedQueryRef.current = queryKey;
      return;
    }

    if (sectionIndex < 0) return;
    const sectionId = sectionDefinitions[sectionIndex].id;
    const sectionTop = sectionTops.current[sectionId];
    if (sectionTop !== undefined) {
      scrollView.scrollTo({
        y: Math.max(0, gridTop.current + sectionTop - 16),
        animated: false,
      });
      appliedQueryRef.current = queryKey;
    }
  }, [queryKey, sectionIndex, selectedY]);

  useEffect(() => {
    if (queryLayoutReadyRef.current && (selectedY || sectionIndex >= 0)) {
      requestAnimationFrame(() => requestAnimationFrame(scrollToQuery));
    }
  }, [queryKey, scrollToQuery, screenWidth, sectionIndex, selectedY]);

  const handleContentSizeChange = useCallback(() => {
    if (queryLayoutReadyRef.current) {
      requestAnimationFrame(scrollToQuery);
    }
  }, [scrollToQuery]);

  const recordSectionTop = useCallback(
    (id: string, event: LayoutChangeEvent) => {
      sectionTops.current[id] = event.nativeEvent.layout.y;
      console.log("Section layout", id);
      if (id === sectionDefinitions[sectionDefinitions.length - 1].id) {
        queryLayoutReadyRef.current = true;
        console.log("Query layout ready");
        requestAnimationFrame(scrollToQuery);
      }
    },
    [scrollToQuery],
  );

  const swatchRows = useMemo(
    () => Array.from({ length: 4 }, (_, index) => swatches.slice(index * 2, index * 2 + 2)),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="items-center px-5 pb-12 pt-5"
        onContentSizeChange={handleContentSizeChange}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full max-w-gallery gap-6"
        >
          <View className="flex-row flex-wrap items-center justify-between gap-4">
            <View className="flex-1 gap-2">
              <StayoraWordmark />
              <AppText variant="display">The Stayora design system</AppText>
              <AppText variant="body" tone="secondary">
                A shared visual language for finding a place that feels like yours.
              </AppText>
            </View>
            <Link href="/" asChild>
              <Pressable
                accessibilityRole="link"
                className="min-h-12 flex-row items-center gap-2 rounded-pill border border-line bg-surface px-4 py-2 active:opacity-75"
              >
                <Icon name="arrowLeft" size="sm" />
                <AppText variant="label">Back to home</AppText>
              </Pressable>
            </Link>
          </View>

          <View
            className="w-full flex-row flex-wrap"
            style={{ gap }}
            onLayout={(event) => {
              gridTop.current = event.nativeEvent.layout.y;
            }}
          >
            <SectionWidthContext.Provider value={sectionWidth}>
            <SectionCard
              id="01-brand"
              title="Stayora feels like home"
              onLayout={(event) => recordSectionTop("01-brand", event)}
            >
              <View className="gap-3 rounded-card border border-line bg-canvas p-4">
                <StayoraWordmark />
                <AppText variant="caption" tone="secondary">
                  The Stayora wordmark
                </AppText>
              </View>
              <View className="min-h-32 justify-center rounded-surface bg-brand-yellow p-5">
                <AppText variant="display" tone="onBrand">
                  Feel at home, wherever you stay.
                </AppText>
                <AppText variant="body" tone="onBrand">
                  Thoughtful stays chosen around you.
                </AppText>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="h-3 w-3 rounded-full bg-brand-yellow" />
                <AppText variant="caption" tone="secondary">
                  Thoughtful, welcoming, considered
                </AppText>
              </View>
            </SectionCard>

            <SectionCard
              id="02-palette"
              title="Color palette"
              onLayout={(event) => recordSectionTop("02-palette", event)}
            >
              {swatchRows.map((row, index) => (
                <View key={index} className="flex-row gap-3">
                  {row.map((swatch) => (
                    <View key={swatch.name} className="flex-1 gap-2">
                      <View className={`h-12 rounded-field border border-line ${swatch.className}`} />
                      <AppText variant="caption">{swatch.name}</AppText>
                      <AppText variant="caption" tone="secondary">
                        {swatch.token}
                      </AppText>
                    </View>
                  ))}
                </View>
              ))}
            </SectionCard>

            <SectionCard
              id="03-typography"
              title="Typography"
              onLayout={(event) => recordSectionTop("03-typography", event)}
            >
              <AppText variant="display">Make room for wonder</AppText>
              <AppText variant="title">A quieter kind of getaway</AppText>
              <AppText variant="heading">Find a place to land</AppText>
              <AppText variant="body">
                Places for slow mornings, open windows, and one more night away.
              </AppText>
              <AppText variant="label">Lake Arrowhead, California</AppText>
              <AppText variant="caption" tone="secondary">
                Plus Jakarta Sans · Regular, Medium, Bold
              </AppText>
            </SectionCard>

            <SectionCard
              id="04-rhythm"
              title="Spacing and shape"
              onLayout={(event) => recordSectionTop("04-rhythm", event)}
            >
              <AppText variant="caption" tone="secondary">
                4px spacing scale
              </AppText>
              <View className="gap-3">
                {[
                  ["w-1", "4"],
                  ["w-2", "8"],
                  ["w-3", "12"],
                  ["w-4", "16"],
                  ["w-6", "24"],
                  ["w-8", "32"],
                  ["w-12", "48"],
                ].map(([size, value]) => (
                  <View key={size} className="flex-row items-center gap-3">
                    <View className={`h-2 rounded-full bg-brand-lavender ${size}`} />
                    <AppText variant="caption" tone="secondary">
                      {value}px
                    </AppText>
                  </View>
                ))}
              </View>
              <View className="flex-row flex-wrap items-center gap-3">
                <View className="h-12 w-12 rounded-field bg-brand-lavender" />
                <View className="h-12 w-12 rounded-card bg-brand-lavender" />
                <View className="h-12 w-12 rounded-surface bg-brand-lavender" />
                <View className="h-12 w-12 rounded-full bg-brand-yellow" />
              </View>
              <Surface variant="elevated">
                <AppText variant="caption">Quiet, consistent elevation</AppText>
              </Surface>
            </SectionCard>

            <SectionCard
              id="05-buttons"
              title="Buttons"
              onLayout={(event) => recordSectionTop("05-buttons", event)}
            >
              <Button title="Find a stay" icon="arrowRight" />
              <Button title="See details" variant="secondary" icon="arrowRight" />
              <Button title="Add to saved" variant="lavender" icon="heart" iconPosition="leading" />
              <Button title="Searching" loading />
              <Button title="Unavailable" disabled />
              <View className="flex-row flex-wrap gap-3">
                <IconButton
                  icon="heart"
                  label={favorite ? "Remove from saved" : "Save stay"}
                  selected={favorite}
                  onPress={() => setFavorite(!favorite)}
                />
                <IconButton icon="share" label="Share stay" />
                <IconButton icon="bookmark" label="Bookmark stay" disabled />
              </View>
            </SectionCard>

            <SectionCard
              id="06-fields"
              title="Input fields"
              onLayout={(event) => recordSectionTop("06-fields", event)}
            >
              <TextField label="Destination" placeholder="Where to?" leadingIcon="search" />
              <TextField
                label="Dates"
                placeholder="Add your dates"
                leadingIcon="calendar"
                trailingIcon="chevronDown"
              />
              <TextField
                label="Password"
                placeholder="Your password"
                secureTextEntry
                editable={false}
              />
              <TextField
                label="Search by name"
                placeholder="Try ‘quiet cabin’"
                value={searchValue}
                onChangeText={setSearchValue}
              />
            </SectionCard>

            <SectionCard
              id="07-chips"
              title="Filter chips"
              onLayout={(event) => recordSectionTop("07-chips", event)}
            >
              <View className="flex-row flex-wrap gap-2">
                {["All stays", "Cabins", "Beach", "City"].map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    selected={selectedChip === label}
                    onPress={() => setSelectedChip(label)}
                  />
                ))}
              </View>
              <View className="flex-row flex-wrap gap-2">
                <Chip label="Hot tub" icon="sun" />
                <Chip label="Waterfront" icon="waves" />
                <Chip label="Pet friendly" icon="heart" />
              </View>
              <Chip label="Unavailable filter" disabled />
            </SectionCard>

            <SectionCard
              id="08-badges"
              title="Badges"
              onLayout={(event) => recordSectionTop("08-badges", event)}
            >
              <View className="flex-row flex-wrap gap-2">
                <Badge label="Guest favorite" variant="favorite" />
                <Badge label="Superhost" variant="superhost" />
                <Badge label="New" variant="new" />
                <Badge label="12% off" variant="discount" />
                <Badge label="Pet friendly" />
                <Badge label="Verified" variant="success" />
              </View>
            </SectionCard>

            <SectionCard
              id="09-alerts"
              title="Status and alerts"
              onLayout={(event) => recordSectionTop("09-alerts", event)}
            >
              {showSuccess ? (
                <Alert
                  title="Saved for later"
                  message="You can find this stay in your saved list."
                  variant="success"
                  onDismiss={() => setShowSuccess(false)}
                />
              ) : null}
              <Alert
                title="Dates are flexible"
                message="Choose your dates to see the full price."
                variant="info"
              />
              <Alert
                title="A small heads-up"
                message="This stay has a two-night minimum."
                variant="error"
              />
              {!showSuccess ? (
                <Button
                  title="Reset alerts"
                  variant="secondary"
                  onPress={() => {
                    setShowSuccess(true);
                  }}
                />
              ) : null}
            </SectionCard>

            <SectionCard
              id="10-listing"
              title="Listing card"
              onLayout={(event) => recordSectionTop("10-listing", event)}
            >
              <ListingCard
                title="Modern cabin with a hot tub"
                location="Lake Arrowhead, California"
                price="$280"
                features={["Hot tub", "Pet friendly"]}
                onPress={() => setFavorite(!favorite)}
              />
              <AppText variant="caption" tone="secondary">
                Photo placeholder is shown until a stay image is supplied.
              </AppText>
            </SectionCard>

            <SectionCard
              id="11-policy"
              title="Policy card"
              onLayout={(event) => recordSectionTop("11-policy", event)}
            >
              <PolicyCard
                title="Cancellation policy"
                description={
                  policyExpanded
                    ? "Cancel up to 5 days before check-in for a full refund."
                    : "Free cancellation up to 5 days before check-in."
                }
                icon="shield"
                onPress={() => setPolicyExpanded(!policyExpanded)}
              />
              <PolicyCard
                title="Payments are protected"
                description="Your booking details stay private and secure."
                icon="lock"
              />
            </SectionCard>

            <SectionCard
              id="12-lists"
              title="List rows"
              onLayout={(event) => recordSectionTop("12-lists", event)}
            >
              <ListGroup>
                <ListRow
                  title="Your saved stays"
                  subtitle={rowExpanded ? "3 places saved" : "Keep your favorites close"}
                  icon="heart"
                  onPress={() => setRowExpanded(!rowExpanded)}
                />
                <View className="mx-4 h-px bg-line" />
                <ListRow
                  title="Payment methods"
                  subtitle="Manage your cards"
                  icon="creditCard"
                />
                <View className="mx-4 h-px bg-line" />
                <ListRow title="Get help" icon="help" />
              </ListGroup>
            </SectionCard>

            <SectionCard
              id="13-tabs"
              title="Bottom navigation"
              onLayout={(event) => recordSectionTop("13-tabs", event)}
            >
              <View className="min-h-40 justify-end rounded-card bg-surface-muted p-3">
                <TabBar
                  items={[...tabs]}
                  selectedKey={activeTab}
                  onChange={setActiveTab}
                />
              </View>
            </SectionCard>

            <SectionCard
              id="14-icons"
              title="Iconography"
              onLayout={(event) => recordSectionTop("14-icons", event)}
            >
              <View className="flex-row flex-wrap gap-2">
                {iconNames.map((name) => (
                  <IconButton
                    key={name}
                    icon={name}
                    label={`${name} icon`}
                    className="h-11 w-11"
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard
              id="15-segments"
              title="Segmented control"
              onLayout={(event) => recordSectionTop("15-segments", event)}
            >
              <SegmentedControl
                options={[
                  { label: "Map", value: "map" },
                  { label: "List", value: "list" },
                ]}
                value={segment}
                onChange={setSegment}
              />
              <AppText variant="caption" tone="secondary">
                Showing {segment === "map" ? "the map" : "the list"} view
              </AppText>
            </SectionCard>

            <SectionCard
              id="16-controls"
              title="Toggles and stepper"
              onLayout={(event) => recordSectionTop("16-controls", event)}
            >
              <Toggle
                label="Quiet stays"
                description="Places away from the crowds"
                value={quietStay}
                onValueChange={setQuietStay}
              />
              <View className="h-px bg-line" />
              <Toggle
                label="Pet friendly"
                description="Bring your four-legged friend"
                value={petFriendly}
                onValueChange={setPetFriendly}
              />
              <View className="h-px bg-line" />
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 gap-1">
                  <AppText variant="label">Guests</AppText>
                  <AppText variant="caption" tone="secondary">
                    Choose the number of guests
                  </AppText>
                </View>
                <Stepper
                  label="Guests"
                  value={guests}
                  min={1}
                  max={8}
                  onChange={setGuests}
                />
              </View>
            </SectionCard>
            </SectionWidthContext.Provider>
          </View>
          <View className="items-center">
            <AppText variant="caption" tone="secondary">
              Stayora · A stay that feels like yours
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
