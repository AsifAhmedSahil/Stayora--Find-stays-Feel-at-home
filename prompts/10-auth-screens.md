# 10 · Sign-up, verify and sign-in screens (mocked auth)

Status: done

## Goal
A signed-out guest can create an account (name, email, password), confirm it with a 6-digit email code, or sign in with email and password, all on screens matching the attached sign-up design. Authentication is mocked: a successful flow starts an in-memory mock session, the root guard moves the guest to Home, and Sign out on Home returns them to onboarding.

## Decisions
- **Mock session flips the guard** (user choice). `src/lib/auth/mock-auth.ts` keeps an in-memory session (lost on reload) and exposes methods shaped like Clerk's method-based `useSignUp`/`useSignIn`, each returning `{ error }`. Swapping in Clerk later only touches this module and `useSession`.
- **Google and Apple are mocked too** (user choice). They show a short loading state, then sign the guest in. `src/hooks/use-google-sso.ts` stays in the repo unused, ready for the Clerk plan.
- **Verify and sign-in are derived from the sign-up design** (user choice): same header, type, fields, buttons and spacing.
- **This temporarily contradicts AGENTS.md** ("Clerk is the source of truth"). While auth is mocked, the guard reads `useSession()` (`src/lib/auth/session.ts`), which reads the mock. `ClerkProvider` stays mounted when a key exists but decides nothing. AGENTS.md records this until the Clerk plan replaces it.
- Brand: "roam" becomes `<StayoraWordmark />`, and the copy says "Join Stayora…".
- **Apple button is iOS only.** The Apple logo is the system SF Symbol `apple.logo` (`expo-symbols` `SymbolView`, tinted with `--color-ink`), so it's never redrawn. Android has no official glyph in `assets/` and Apple sign-in there is rare, so Android shows Google only.
- **Screens never navigate after success.** The guard does. Sign-up and sign-in switch between each other with `router.replace` (the back stack doesn't grow). Sign-up and sign-in push `/verify?flow=…`. Back on verify returns to the form with its values kept.
- **Validation** (`src/lib/auth/validate.ts`) runs on submit, and a field's error clears when it's edited. Name must not be blank. Email uses a basic `x@y.z` check. Password needs at least 8 characters (matches Clerk's minimum).
- **Mock rules** (all with about 700 ms latency):
  - Sign-up with an email containing `taken` fails with "That email is already in use."
  - Any other valid sign-up goes to verify.
  - The code `424242` passes (same as Clerk's test code). Any other code fails with "That code isn't right. Check the email and try again."
  - Resend unlocks after 30 s.
  - Sign-in with password `wrongpassword` fails with "Incorrect email or password."
  - Sign-in with an email containing `+newdevice` goes to `/verify?flow=sign-in` (mirrors Clerk's `needs_client_trust`).
  - Any other valid sign-in starts a session.
  - In `__DEV__`, verify shows a caption: "Mock auth: use code 424242".
- **Error copy** lives in `src/lib/auth/errors.ts`. Form-level errors show in a danger `Alert` above the primary button. Field errors show as a `caption` in the `danger` tone under the field.
- "Forgot password?" on sign-in shows an info `Alert`: "Password reset is coming soon."
- **Haptics** (`expo-haptics`) fire once per submit: success on a session, error on failure. The visible message is always there too.
- The layout scrolls (`ScrollView` with `automaticallyAdjustKeyboardInsets`, `keyboardShouldPersistTaps="handled"`). Each field's return key moves to the next field, and the last one submits.

### Design spec (sign-up, estimated from the image at about 1.73 px/pt on a 393 pt wide screen)
- **Screen**: `bg-canvas`, `px-6`, safe area top and bottom.
- **Header row** (space-between): back `IconButton icon="chevronLeft" label="Back"` on the left (48pt; the design looks 44pt, so I'm keeping the 48 touch target), `<StayoraWordmark />` on the right. Back calls `router.back()`, or replaces with `/onboarding` if there's nowhere to go back to.
- **Title**: `hero`, `mt-8`, "Create your account" (2 lines). **Subtitle**: `lead` `secondary`, `mt-3`, "Join Stayora to save your stays, get personalized recommendations and access them across all your devices."
- **Fields** `mt-6`, `gap-3.5`. A new `TextField variant="filled"`:
  - Box: `min-h-15 rounded-field bg-surface-muted px-5 gap-5`. Leading icon `lg` (24).
  - Two lines inside the box: the label (`label` variant, ink) above the input (`text-input`, placeholder muted).
  - Optional `trailing` node. Focus adds `border-2 border-brand-lavender`; an error adds `border-2 border-danger` and the caption below.
  - Full name: icon `user`, placeholder "e.g. Adrian Hajdin", `textContentType="name"`.
  - Email address: icon `mail`, "you@example.com", `keyboardType="email-address"`, `autoCapitalize="none"`, `textContentType="emailAddress"`.
  - Password: icon `lock`, "At least 8 characters", `PasswordField` with a trailing eye toggle (`eyeOff` while hidden, `eye` while shown; 48pt `Pressable`, label "Show password" / "Hide password"), `textContentType="newPassword"`.
- **Primary**: `Button size="pill" icon="arrowRight" iconPosition="end"`, "Create account", `mt-6`, `loading` while submitting.
- **Divider** `my-5`: two `h-px flex-1 bg-line` lines around "or" (`label` `secondary`, `px-4`).
- **Social** `gap-4`: "Continue with Google" (secondary pill, `GoogleLogo`) and "Continue with Apple" (iOS only, `apple.logo` 20pt).
- **Footer** `mt-8`, centered: "Already have an account?" (`body` `secondary`) plus a "Sign in" link (`body`, ink, `underline`, 48pt hit area).

### Derived screens
- **Sign in**: same header.
  - Title "Welcome back". Subtitle "Sign in to pick up where you left off with your saved stays and trips."
  - Fields: Email and Password (`textContentType="password"`), then "Forgot password?" right-aligned (`label` `accent`).
  - Then "Sign in" (pill, end arrow), the divider, the social buttons, and the footer "New to Stayora? Create an account".
- **Verify** (`/verify?flow=sign-up|sign-in`): same header.
  - Title "Check your email" (sign-up) or "Confirm it's you" (sign-in).
  - Subtitle: "We sent a 6-digit code to {email}. Enter it below to finish creating your account." For sign-in: "You're signing in on a new device. Enter the 6-digit code we sent to {email}."
  - `CodeInput`: 6 boxes `h-15 flex-1 rounded-field bg-surface-muted`, digits in `title`. The active box gets `border-2 border-brand-lavender`, an error gets `border-danger`. A single hidden `TextInput` (`number-pad`, `textContentType="oneTimeCode"`, `autoComplete="one-time-code"`, `maxLength 6`) sits behind them, and the field submits automatically at 6 digits.
  - Then "Verify" (pill, end arrow), and the resend row "Didn't get a code? Resend in 0:30", which becomes a "Resend code" link.
  - Opening `/verify` with no pending flow redirects to `/sign-up`.

### Tokens
- New: `--spacing` already covers `min-h-15` (60pt) and `gap-3.5`. No new color, type or radius tokens are needed.
- New icon names: `chevronLeft`, `mail`, `eye`, `eyeOff` (lucide).

## Out of scope
- Real Clerk calls, password reset, persisting the mock session across reloads, and Android Apple sign-in.
- Saving the full name anywhere except the mock session.

## Steps
### 1. Primitives
- `icons.ts`: add `chevronLeft`, `mail`, `eye`, `eyeOff`.
- `text-field.tsx`: `variant: "outlined" (default, current) | "filled"`, plus `trailing?: ReactNode` and `error?: string` (both variants show the error). `inputRef` is passed through via `ref` (React 19).
- Add the filled field, its error state and the password toggle to `/design-system`.
- Done when `tsc` and ESLint over `src` pass.

### 2. Mock auth, session and validation
- `src/lib/auth/mock-auth.ts`: a store using `useSyncExternalStore`. State: `{ session: { name, email } | null, pending: { flow, name, email } | null }`. Methods: `signUp.create`, `signIn.password`, `verify.code`, `verify.resend`, `social(provider)` and `signOut`, all async and returning `{ error?: string, next?: "verify" }`.
- `src/lib/auth/session.ts`: `useSession()` returns `{ isLoaded: true, isSignedIn, user, signOut }`.
- `src/lib/auth/validate.ts`: `validateSignUp` and `validateSignIn` return per-field errors. Copy goes in `errors.ts`.
- Root layout: `RootNavigator` takes `isSignedIn` from `useSession()`. `index.tsx` redirects using it. Home's Sign out calls the session's `signOut`.

### 3. Auth components (`src/components/auth/`)
- `AuthScreen` (safe area, scroll, header, title, subtitle, children).
- `PasswordField`, `OrDivider`, `SocialButtons` (replaces `GoogleButton`; Google plus iOS Apple, both mocked), `AppleLogo` (`expo-symbols`), `CodeInput`, `AuthFooterLink`.
- Delete `AuthPlaceholder` and `GoogleButton`. Onboarding's Google button uses `SocialButtons only="google"`.

### 4. Screens
- `(auth)/sign-up.tsx`, `(auth)/sign-in.tsx`, `(auth)/verify.tsx` as specified. Form state stays local, and submit is disabled while loading.

### 5. Compare with the design
- On a device: screenshot sign-up, compare it with the design, fix the differences, and repeat. Report the estimated values.

## Verification
- `npx tsc --noEmit` passes, ESLint over `src` passes, and iOS and Android bundles export.
- Sign-up checks:
  - Empty submit shows three field errors.
  - A 7-character password is rejected.
  - `taken@example.com` shows the in-use alert.
  - A valid email goes to verify.
  - Code `111111` shows an error.
  - Code `424242` lands on Home.
- Sign out → onboarding.
- Sign-in checks:
  - `wrongpassword` shows an error.
  - `a+newdevice@example.com` goes to "Confirm it's you", and `424242` then lands on Home.
  - A valid sign-in lands on Home.
- Google/Apple from sign-up, sign-in and onboarding land on Home.
- Footer links switch screens without the back stack growing.
- Resend countdown runs, and back from verify keeps the form values.
- `/verify` with nothing pending redirects to sign-up.
- VoiceOver labels are present on the fields, the toggle, the code input and the back button.

## AGENTS.md updates
- Who owns what → Auth: auth is mocked (`src/lib/auth/mock-auth.ts`, the mock rules above) until the Clerk forms plan. The guard reads `useSession()` (`src/lib/auth/session.ts`). `ClerkProvider` stays mounted but decides nothing yet. This replaces the claim that Clerk currently decides the session.
- Design system: `TextField variant="filled"` is the two-line labelled field (label inside the box), with `trailing` and `error`. The auth pieces (`AuthScreen`, `SocialButtons`, `CodeInput`, `PasswordField`, `OrDivider`, `AuthFooterLink`) live in `src/components/auth/`. The Apple logo is SF Symbol `apple.logo`, and the Apple button is iOS only.

## Result
Built as planned. `TextField` gained `variant="filled"`, `trailing`, `error` and `ref`. The auth pieces are in `src/components/auth/` (`AuthScreen`, `PasswordField`, `OrDivider`, `SocialButtons`, `AppleLogo`, `CodeInput`, `AuthFooterLink`), and `AuthPlaceholder`/`GoogleButton` were removed.
Mock auth is `src/lib/auth/mock-auth.ts`, the guard reads `useSession()`, and validation is in `validate.ts`.
Verify keeps the pending flow from its first render, so clearing it on success doesn't redirect while the guard navigates.
Checks: `tsc` and ESLint over `src` pass, and iOS and Android bundles export. A Node script exercised every mock rule and validation case, and all matched the plan. Not verified: the on-device design comparison and the end-to-end taps (no simulator or emulator on this machine).
