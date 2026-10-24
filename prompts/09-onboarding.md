# 09 · Onboarding

Status: done

## Goal
A signed-out guest opens the app and sees a 3-page onboarding carousel matching the attached design. "Get started" walks through the pages and then opens sign-up, "Skip" jumps straight to sign-up, and "Continue with Google" signs in with Clerk Google SSO. Once signed in, the guard moves them to Home.

## Decisions
- Scope: onboarding, plus the Clerk plumbing the guard needs (`ClerkProvider`, `tokenCache`, `Stack.Protected`, splash gating) and **placeholder** `(auth)/sign-up` and `(auth)/sign-in` screens. The real email/password/verify forms come in the next plan. (User choice.)
- 3 swipeable pages. The design's page is page 1; I wrote the copy for pages 2 and 3. "Get started" advances one page, and on the last page it opens `/sign-up`. "Skip" opens `/sign-up` from any page. (User choice.)
- "Continue with Google" is real Clerk SSO: `useSSO` from `@clerk/expo`, `strategy: "oauth_google"`, then `setActive({ session: createdSessionId })`. The guard navigates. (User choice.) Note: `@clerk/expo` 4.14 recommends `useSSO` from `@clerk/expo/experimental` for Core 3 flows, which activates the session itself. AGENTS.md says `@clerk/expo`, so I follow AGENTS.md. Switching would be a small, separate change.
- Brand: the design's "roam" wordmark becomes `<StayoraWordmark />`, and "roam helps you…" becomes "Stayora helps you…" (AGENTS.md: the brand is Stayora).
- Photos are remote Unsplash images via `expo-image` (`styled`, `contentFit="cover"`). All three URLs returned HTTP 200 when checked:
  1. `https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80&auto=format&fit=crop`: lit lakeside cabin, pines, mountains (closest to the design)
  2. `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop`: tropical resort pool, limestone peaks
  3. `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop`: beach at sunset
- The Google "G" is the official multi-color mark, drawn with `react-native-svg` from Google's published path data in `src/components/brand/google-logo.tsx`, with fills from new tokens (no hex outside `global.css`). It is not traced from the screenshot.
- Route layout: `index.tsx` becomes the anchor (redirects to `/home` or `/onboarding`). The current demo home moves to `(app)/home.tsx` and gains a temporary "Sign out" button so the flow can be retested. `(app)` is a plain `Stack` for now; NativeTabs come with the tabs plan. `/design-system` stays outside the guards.
- Fonts are not loaded anywhere today: the root layout lost `useFonts`. I'm restoring it, and the splash stays up until fonts and Clerk have loaded (AGENTS.md rule).
- Press feedback uses `active:opacity-80` like the existing primitives. `PressableScale`/`motion.ts` don't exist yet, and adding them is out of scope.
- Page change from "Get started" uses `scrollToIndex({ animated: !reduceMotion })` (`useReducedMotion` from reanimated).
- SSO error copy lives in `src/lib/auth/errors.ts`. If the guest cancels or dismisses, nothing is shown. Network failures show "Can't connect. Check your connection and try again." Anything else shows "Couldn't continue with Google. Please try again." These appear in a danger `Alert` above the buttons. If SSO returns no session (sign-up needs more fields), the guest is routed to `/sign-up`.

### Design spec (page 1, from the image; values estimated at about 1.6 px/pt on a 393 × 852 pt screen)
- **Photo**: full-bleed from the top of the screen (under the status bar) to about 62% of the window height. Status bar text is dark.
- **Header overlay** (fixed, above the pages): safe area top + `pt-2`, `px-6`, row with space-between. Left: `<StayoraWordmark />`. Right: "Skip" pill, `min-h-12 px-5 rounded-pill bg-glass`, `label` text in `default` tone.
- **Location pill**: bottom-left of the photo, `left-6`, sitting about 20pt above where the sheet starts. `min-h-10 px-4 gap-2 rounded-pill bg-scrim border border-on-media/40`, `mapPin` icon (sm) and `label` text, both in the `onMedia` tone. Content: "Whistler, BC".
- **Sheet**: `bg-surface`, overlaps the photo by about 48pt. The top edge is an SVG cap 56pt tall: a small (about 24pt) rounded corner top-left, an edge that slopes gently down toward the right (about 24pt drop), and a large (about 48pt) rounded corner top-right into the side. The fill comes from the `fill-surface` token class (`nativeStyleMapping: { color: "fill" }`).
- **Progress**: 3 bars, `gap-2`, `h-1.5 rounded-pill`. Active: `w-8 bg-brand-lavender`. Inactive: `w-8 bg-line`. Each page shows its own index.
- **Headline**: `hero` variant (new), ink color, `mt-6`. Page 1 reads "Find a stay that fits your story" (2 lines).
- **Body**: `lead` variant (new), `secondary` tone, `mt-3`.
- **Buttons** (fixed at the bottom, `px-6`, `gap-3`, safe area bottom + `pb-2`, on `bg-surface`):
  - "Get started": `Button size="pill"` primary (yellow), title centered, `arrowRight` icon pinned to the right edge (`iconPosition="end"`).
  - "Continue with Google": `Button size="pill" variant="secondary"` (white, `border-line`), with the Google G on the left of the centered title. This uses a `leading` slot that accepts a node, so `GoogleButton` passes `<GoogleLogo />`.

### Page copy
1. Whistler, BC · "Find a stay that fits your story" · "From mountain cabins to oceanfront villas, Stayora helps you find unforgettable stays for every kind of trip."
2. Krabi, Thailand · "Describe it, we'll find it" · "Tell Stayora what you're dreaming of in one sentence, like a quiet cabin with a hot tub, and get stays ranked for you."
3. Tulum, Mexico · "Answers before you book" · "Ask about check-in, pets or cancellations and get the exact policy text, straight from the stay."

### Proposed new tokens (`src/global.css` `@theme`)
- `--text-hero: 2.25rem; --text-hero--line-height: 1.1;`: the headline is about 36pt with tight leading, between `display` (48) and `title` (28).
- `--text-lead: 1.0625rem; --text-lead--line-height: 1.2;`: the body is about 17pt with about 20pt leading (`body` would be 16/24, which is too airy).
- `--color-on-media: #ffffff;`: text and icons over photos. Not overridden in dark mode, unlike `canvas`.
- `--color-scrim: rgba(11, 11, 26, 0.45);`: the dark translucent location pill.
- `--color-google-blue: #4285f4; --color-google-red: #ea4335; --color-google-yellow: #fbbc05; --color-google-green: #34a853;`: Google brand colors for the G mark.
- New `AppText` variants `hero` (font-heading text-hero) and `lead` (font-body text-lead). New `onMedia` tone in `AppText` and `Icon`.

## Out of scope
- Real email/password sign-up, verify and sign-in forms; Apple SSO; `needs_client_trust`.
- NativeTabs `(app)` group, Profile, and the real Home.
- `PressableScale` and `src/theme/motion.ts`; haptics; PostHog events.
- Persisting "onboarding seen". Every signed-out launch shows onboarding.

## Steps
### 1. Tokens and primitives
- `src/global.css`: add the tokens listed above.
- `app-text.tsx`: add the `hero` and `lead` variants and the `onMedia` tone (`text-on-media`). `icons.ts`/`icon.tsx`: add the `onMedia` tone (`--color-on-media`).
- `button.tsx`: add `size="pill"` (`min-h-14 gap-3 rounded-pill px-6 py-4`), `iconPosition="end"` (title centered, icon absolutely positioned at `right-6`), and an optional `leading?: ReactNode` rendered before the title.
- `src/components/brand/google-logo.tsx`: the official G (4 paths, 18 × 18 viewBox), styled `Path` with `fill-google-*` classes.
- Add new pieces to `/design-system` (Button pill and end-icon variants, the hero/lead text samples). Done when `npx tsc --noEmit` and `npx expo lint` pass.

### 2. Clerk provider, fonts, splash and guard
- `.env.example`: add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=`.
- `src/app/_layout.tsx`: `SplashScreen.preventAutoHideAsync()` at module scope. `useFonts` loads the 3 Plus Jakarta TTFs under their PostScript names. `<ClerkProvider publishableKey tokenCache>` (`tokenCache` from `@clerk/expo/token-cache`) wraps an inner `RootNavigator`, which reads `useAuth()` and calls `SplashScreen.hide()` once fonts are loaded and `isLoaded` is true (it renders `null` before then). The stack has `Stack.Protected guard={isSignedIn}` → `(app)`, `Stack.Protected guard={!isSignedIn}` → `onboarding`, `(auth)`, and `index` and `design-system` stay unguarded.
- Move the current `src/app/index.tsx` body to `src/app/(app)/home.tsx`, plus a "Sign out" `Button variant="secondary"` (`useClerk().signOut()`). `src/app/(app)/_layout.tsx` is a header-less `Stack`.
- New `src/app/index.tsx`: `<Redirect href={isSignedIn ? "/home" : "/onboarding"} />`.

### 3. Auth placeholders and the Google button
- `src/lib/auth/errors.ts`: `ssoErrorMessage(error): string | null`, with the copy listed in Decisions (uses `isClerkAPIResponseError` and network checks).
- `src/hooks/use-google-sso.ts`: `WebBrowser.maybeCompleteAuthSession()` at module scope, plus `warmUpAsync`/`coolDownAsync` on Android. It returns `{ start, loading, error }`. `start` calls `startSSOFlow({ strategy: "oauth_google", redirectUrl: AuthSession.makeRedirectUri() })`. With a `createdSessionId` it calls `setActive`; without one it calls `router.push("/sign-up")`.
- `src/components/auth/google-button.tsx`: `Button size="pill" variant="secondary" title="Continue with Google" leading={<GoogleLogo />} loading=…`, plus a danger `Alert` when `error` is set.
- `src/app/(auth)/_layout.tsx` (header-less Stack). `sign-up.tsx` and `sign-in.tsx`: `SafeAreaView` with the wordmark, a `title` ("Create your account" / "Welcome back"), a secondary line ("Email sign-up is coming soon. Continue with Google for now." / the sign-in equivalent), `GoogleButton`, a quiet link between the two screens, and `<View nativeID="clerk-captcha" />`.

### 4. Onboarding screen
- `src/components/onboarding/`: `onboarding-slides.ts` (the 3 pages: `image`, `location`, `title`, `body`), `onboarding-page.tsx` (photo, location pill, sheet cap, progress, headline, body; width equals the window width), `sheet-cap.tsx` (the SVG top edge), `progress-bars.tsx`.
- `src/app/onboarding.tsx`: `StatusBar style="dark"`. A horizontal `FlatList` (`pagingEnabled`, `onMomentumScrollEnd` sets the index, `getItemLayout`). Header overlay (wordmark, Skip). Fixed bottom stack (Get started, GoogleButton). It prefetches all three images (`Image.prefetch`). "Get started" advances the page or, on the last page, calls `router.push("/sign-up")`. "Skip" calls `router.push("/sign-up")`. Accessibility: the pager has `accessibilityLabel` "Onboarding, page n of 3", and each photo has `accessibilityIgnoresInvertColors` and is hidden from screen readers.

### 5. Compare with the design
- Run on a device or simulator, screenshot page 1, compare with the design, list the differences, fix them, and repeat.

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass. `npx expo-doctor` reports no new issues.
- `npx expo export --platform ios` bundles without errors.
- Signed out: launch → onboarding page 1 matches the design. Swipe → pages 2 and 3 and their bars update. Get started ×2 → page 3, then once more → sign-up. Skip → sign-up. Sign-up ↔ sign-in links work. Back from sign-up returns to onboarding.
- Google: tap → browser sheet → cancel → no error shown. Complete with a Google account → lands on Home. Relaunch → still Home (token cache). Sign out → onboarding.
- No Clerk key → the provider throws a clear error at startup (documented in the steps the user needs to take).
- Visual: on Windows there is no iOS simulator, so the design comparison has to be done on a device (Expo Go) or an Android emulator, and is reported as such.

## AGENTS.md updates
- Design system: add the `hero`/`lead` text variants, the `onMedia` tone, `Button size="pill"` + `iconPosition="end"` + `leading`, the Google color tokens and `GoogleLogo` (`src/components/brand/`).
- Who owns what → Auth: Google SSO lives in `useGoogleSso` (`src/hooks/use-google-sso.ts`), and `GoogleButton` is in `src/components/auth/`. `(auth)` sign-up and sign-in are placeholders until the forms plan.
- Design system → routes: onboarding is a 3-page pager (`src/components/onboarding/`). Skip and the last "Get started" open `/sign-up`. `(app)` is a plain Stack with `home` until tabs exist.

## Result
Built as planned. Build-time adjustments to estimated values: `lead` line height 1.2 (not 1.3), the pill button is `min-h-13` (52pt, the design's ~50pt) with `gap-2.5` between the two buttons, the active progress bar is `bg-accent/60` (closer to the design's mid-lavender than `brand-lavender`), inactive bars are `bg-surface-muted`, and the headline sits `mt-4` below the bars. The sheet top is `min(57.5% of height, space left after the content and buttons)`, so small phones get a shorter photo instead of overlapping text.
Checks: `tsc` passes, ESLint over `src` is clean, and iOS and Android bundles export. Not verified: the visual comparison with the design and a live Google SSO run. This Windows machine has no simulator or emulator, and there is no Clerk key in `.env.local`. `npx expo lint` can't start here (it calls `yarnpkg`, which isn't installed), so ESLint was run directly.
