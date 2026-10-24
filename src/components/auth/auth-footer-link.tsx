import { Link, type Href } from "expo-router";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/ui";

type AuthFooterLinkProps = {
  prompt: string;
  label: string;
  href: Href;
};

/** "Already have an account? Sign in". Replaces the screen so the back stack doesn't grow. */
export function AuthFooterLink({ prompt, label, href }: AuthFooterLinkProps) {
  return (
    <View className="flex-row flex-wrap items-center justify-center gap-x-2">
      <AppText variant="body" tone="secondary">
        {prompt}
      </AppText>
      <Link href={href} replace asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={label}
          className="min-h-12 justify-center active:opacity-60"
        >
          <AppText variant="body" className="underline">
            {label}
          </AppText>
        </Pressable>
      </Link>
    </View>
  );
}
