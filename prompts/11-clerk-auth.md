# 11 · Real Clerk auth behind the custom screens

Status: done

## Goal
Guests create an account (name, email, password) and confirm it with a 6-digit email code. They sign in with email and password, plus an email code on a new device. Sessions survive app restarts, `(app)` is reachable only when signed in, and Sign out returns to onboarding. All of it runs on Clerk through the existing custom screens, and the in-memory mock is deleted.

## Decisions
- **Clerk MCP** is installed at project scope (`.mcp.json` → `https://mcp.clerk.com/mcp`, HTTP). The user authenticates it once with `/mcp`. Code is written against the installed `@clerk/expo` 4.14 types (`node_modules/@clerk/shared/dist/types/sign{In,Up}Future.d.ts`), not memory.
- **Instance state (checked from `/v1/environment`):** email + password enabled, email verified with `email_code` at sign-up, Google on, Apple off, Native API on, test mode on, no MFA, single-session mode. Captcha is off now, but `<View nativeID="clerk-captcha" />` is still mounted on sign-up and sign-in.
- **Password minimum stays 8** (user choice). The user lowers the Dashboard minimum from 15 to 8, and `validate.ts` is unchanged.
- **Names are sent to Clerk** (user choice). The user enables First and Last name (optional) in the Dashboard. Sign-up splits "Full name" on the first space: `firstName` = first word, `lastName` = the rest (omitted when empty).
- **Google is real and Apple is hidden** (user choice). `SocialButtons` renders one Google button driven by `useGoogleSso`, and the Apple button is removed. `apple-logo.tsx` stays for later.
- **Current method API only:** `useSignUp()` / `useSignIn()` from `@clerk/expo` (`{ signUp|signIn, errors, fetchStatus }`), methods returning `{ error }`, `finalize()` to activate. No `@clerk/expo/legacy`, no `setActive` except in SSO.
- **Sign-up:** `signUp.password({ emailAddress, password, firstName, lastName })` → `signUp.verifications.sendEmailCode()` → push `/verify?flow=sign-up`.
- **Sign-in:** `signIn.password({ emailAddress, password })`, then by status:
  - `complete` → `finalize`.
  - `needs_client_trust`, or `needs_second_factor` offering `email_code` → `signIn.mfa.sendEmailCode()` → push `/verify?flow=sign-in`.
  - Any other status (including `needs_protect_check`) → generic error. That's not expected on this instance.
- **Verify** reads the in-progress attempt from the hooks instead of mock state. Sign-up is valid while `status === "missing_requirements"` and `unverifiedFields` includes `email_address`. Sign-in is valid while `needs_client_trust` / `needs_second_factor`. Otherwise it redirects to the form, as today. The email address shown is `signUp.emailAddress` / `signIn.identifier`, captured on the first render.
  - Code check: `signUp.verifications.verifyEmailCode({ code })` / `signIn.mfa.verifyEmailCode({ code })`, then `finalize`.
  - Resend: `sendEmailCode()` / `mfa.sendEmailCode()`, with the same 30 s timer.
- **Screens never navigate after success.** `finalize({ navigate })` gets a no-op `navigate`, and `Stack.Protected` moves the guest once `useAuth().isSignedIn` flips. Session tasks aren't enabled on this instance, so they aren't handled (see Out of scope).
- **`useSession()`** (`src/lib/auth/session.ts`) stays the one auth seam for the guard, `index` and Sign out. It's backed by `useAuth()` + `useUser()` and returns `{ isLoaded, isSignedIn, user: { name, email } | null, signOut }`. The implementation is chosen at module scope from `clerkEnabled`, so there are no conditional hook calls.
- **Persistent sessions:** `tokenCache` from `@clerk/expo/token-cache` stays on `ClerkProvider`. The splash stays up until `isLoaded`, so a cold start never flashes onboarding.
- **No key in development:** the app still runs signed out (onboarding, design system). `(auth)/_layout.tsx` shows an `EmptyState` with `missingClerkKeyMessage` instead of the forms, because Clerk hooks throw without a provider. Release builds still throw.
- **Error copy:** `clerkErrorMessage(error, fallback)` in `errors.ts` maps Clerk codes to existing copy and is shared by sign-up, sign-in, verify and SSO:
  - `form_identifier_exists` → `emailTaken`, under the email field.
  - `form_password_incorrect` and `form_identifier_not_found` → `wrongCredentials`. The copy doesn't reveal whether the email exists.
  - `form_password_pwned` → new `passwordPwned` ("This password has appeared in a data breach. Choose a different one."), under the password field.
  - `form_password_length_too_short` → `passwordTooShort`.
  - `form_code_incorrect` → `wrongCode`.
  - `verification_expired` → `verificationExpired`.
  - `too_many_requests` → new `tooManyAttempts` ("Too many attempts. Wait a minute and try again.").
  - Network errors → `network`.
  - Anything else → Clerk's `longMessage`, else new `somethingWrong`.
- **Dev hint on verify:** in `__DEV__`, and only when the email contains `+clerk_test`, verify shows "Test email: use code 424242". The mock caption goes away.
- **Buttons** show loading from the screen's own `loading` flag, as today, to keep one source for haptics and double-tap protection. `fetchStatus` is not used.
- **Sign out** stays the temporary button on Home, calling `useSession().signOut()` (Clerk `signOut`, which clears the token cache).

## Out of scope
- Forgot password: still the "coming soon" info Alert.
- Apple sign-in, MFA/TOTP, session tasks, and organizations.
- API route session checks (`requireSession`): there are no API routes yet.
- The Profile screen and reading the name in UI. Only `useSession().user` exposes it.
- Removing `ios/`/`android/` or changing the build type. Custom flows run in Expo Go.

## Steps
### 1. Error mapping
`src/lib/auth/errors.ts`: add `passwordPwned`, `tooManyAttempts` and `somethingWrong`. Add `clerkErrorMessage(error, fallback)` returning `{ message, field?: "email" | "password" | "code" }` from the first Clerk error's `code`, using the mapping in Decisions. Keep `ssoErrorMessage`, delegating to the new function with `googleFailed` as the fallback. Done: lint and tsc pass.

### 2. Session seam on Clerk
`src/lib/auth/clerk-config.ts`: export `clerkEnabled`. `src/lib/auth/session.ts`: implement `useSession` with `useAuth`/`useUser` when enabled, and with a signed-out stub (`isLoaded: true`, no-op `signOut`) otherwise. `src/app/_layout.tsx`: drop the "mocked" comment, keep the provider and `tokenCache`. `(auth)/_layout.tsx`: show the missing-key `EmptyState` when `!clerkEnabled`. Done: the app boots signed out to onboarding with a key, and without one in dev.

### 3. Sign-up
`src/app/(auth)/sign-up.tsx`: replace `mockAuth.signUp.create` with `signUp.password({...names})` + `sendEmailCode()`. Route errors through `clerkErrorMessage` to the field or the form Alert. Mount `<View nativeID="clerk-captcha" />` under the button. Push `/verify?flow=sign-up` on success. Done: a new `+clerk_test` email reaches verify, and a used email shows `emailTaken` under the email field.

### 4. Sign-in
`src/app/(auth)/sign-in.tsx`: replace the mock with `signIn.password`, branch on `signIn.status` as in Decisions, call `finalize` with a no-op navigate, and mount the captcha view. Done: the account from step 3 signs in and lands on Home through the guard, and a wrong password shows `wrongCredentials`.

### 5. Verify
`src/app/(auth)/verify.tsx`: derive the flow state from `useSignUp`/`useSignIn` (Decisions), verify, resend and finalize. Keep the redirect when there's no attempt, the 30 s resend timer and the haptics. Replace the mock caption with the `+clerk_test` hint. Done: `424242` completes sign-up and the guard shows Home, and `111111` shows `wrongCode` and clears the boxes.

### 6. Google, and delete the mock
`src/components/auth/social-buttons.tsx`: render one Google button from `useGoogleSso()` (loading, error Alert, haptics once), drop Apple and the `only` prop if nothing uses it. Delete `src/lib/auth/mock-auth.ts`. `grep -r mockAuth src` returns nothing. Done: Google opens the browser and signs in, and cancelling shows no error.

### 7. Docs
Update AGENTS.md per the section below. Update `.env.example` only if a name changed (none expected).

## Verification
- `npx expo lint` and `npx tsc --noEmit` pass.
- Run on the iPhone development build (`npm run start:dev-client`, see plan 07) with the Dashboard changes made:
  1. Sign up `stayora+clerk_test@example.com` / an 8+ char password / "Ada Lovelace" → verify → `424242` → Home. The Clerk Dashboard shows the user with first name Ada, last name Lovelace.
  2. Sign up again with the same email → "That email is already in use…".
  3. Verify with `111111` → `wrongCode`. Resend unlocks after 30 s and sends a new code.
  4. Kill and relaunch the app → it opens on Home with no onboarding flash (persistent session).
  5. Sign out → onboarding. Relaunch → still onboarding.
  6. Sign in with a wrong password → `wrongCredentials`. Sign in correctly → Home.
  7. Deep link `exp://127.0.0.1:8081/--/home` while signed out → onboarding (protected route).
  8. Google → browser → Home, or cancel → back on the form with no error.
  9. Airplane mode on submit → `network` copy.
- If new-device trust triggers on a sign-in, confirm verify says "Confirm it's you" and `424242` completes it.
- Report Dashboard-dependent results as ❌ with the reason if the settings aren't changed yet.

## AGENTS.md updates
- **Auth (Who owns what):** replace the "Auth is mocked for now…" sentences and the mock rules with: real Clerk custom flows (`signUp.password` with names → `verifications.sendEmailCode`; `signIn.password` → `finalize`, or `mfa.sendEmailCode` on `needs_client_trust`); `useSession()` backed by `useAuth`/`useUser`; Clerk codes mapped by `clerkErrorMessage`; no-key dev shows a missing-key `EmptyState` in `(auth)`; Google live and Apple hidden until enabled in Clerk; `useGoogleSso` is used by `SocialButtons`; test with `+clerk_test` emails and `424242`; the MCP lives in `.mcp.json`.
- **Design system:** replace "the Apple button is iOS only" with "Apple is hidden until enabled in Clerk; `AppleLogo` (SF Symbol) is kept for it."
- **Rules:** keep "Clerk's password minimum (Dashboard) and `validate.ts` are both 8 characters."

## Result
Built as planned. Deviations:
- `ui` has no `EmptyState`, so without a key `(auth)/_layout.tsx` shows `AuthScreen` with an error `Alert`.
- Onboarding also renders `SocialButtons`, so Google is a `GoogleButton` chosen at module scope (Clerk SSO, or a missing-key explainer).
- `useGoogleSso().start()` now returns `"signed-in" | "cancelled" | "failed"`, so haptics fire once and never on cancel.

Checks: `tsc --noEmit` passes, ESLint on `src` passes, and `expo export --platform ios` builds. `expo lint` doesn't actually lint: a stray `yarn.lock` makes it call yarn. The simulator flows weren't run from this Windows machine, and the Dashboard still has a 15-character minimum and names off when this closed.
