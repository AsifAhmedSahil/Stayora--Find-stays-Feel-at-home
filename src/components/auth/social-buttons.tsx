import { GoogleButton } from "./google-button";

/**
 * Social sign-in. Only Google is enabled in Clerk; Apple (`AppleLogo`) returns once it is.
 * `only="google"` keeps the tighter spacing onboarding uses.
 */
export function SocialButtons({ only }: { only?: "google" }) {
  return <GoogleButton className={only ? "gap-2.5" : "gap-4"} />;
}
