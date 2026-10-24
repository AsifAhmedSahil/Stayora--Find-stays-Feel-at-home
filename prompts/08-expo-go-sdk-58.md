# 08 · Expo Go SDK 58 compatibility

Status: done

## Goal
Run Stayora, including the new Clerk sign-up, sign-in and sign-out, in the current App Store Expo Go on the user's iPhone by moving the project from SDK 57 to SDK 58.

## Decisions
- **Upgrade to SDK 58** (user choice on 2026-10-24, reversing the earlier decline). The development build from plan 07 couldn't connect to the dev server, and App Store Expo Go only runs SDK 58. On SDK 57, Expo Go crashes at launch with "Cannot find native module 'ExpoAsset'".
- **Upgrade with Expo's tool:** `npx expo install expo@^58.0.0 --fix --npm`. `--npm` is needed because the stray `yarn.lock` otherwise makes Expo pick yarn. If the npm spawn fails in Git Bash, finish with `npm install` from PowerShell. Then run `npx expo-doctor@latest`.
- **Pinned packages are re-pinned, not floated.** `nativewind`/`react-native-css` stay a matching RC pair. `tailwindcss`, `@tailwindcss/postcss` and `lightningcss` (and its `overrides` entry) stay exact. `ai`/`@ai-sdk/typesafe-ai` stay exact if present. They change only if `--fix` or Doctor reports them as incompatible, and only to exact versions.
- **Clerk needs no change:** `@clerk/expo` 4.14 declares `expo >=54 <59`.
- **Audit results (2026-10-24):** Node 24.20 is supported. `src` has no `react-native/Libraries` deep imports, no `InteractionManager`/`Touchable`/`NativeMethods`/`ImageBackground`, no removed `StatusBar` props, no `withLayoutContext` and no `@expo/ui` usage yet. `web.output` is already `"static"`, and there are no API routes.
- **RN 0.88 strict TypeScript types:** fix any `tsc` errors at the source, for example `useRef<TextInput>` becoming the instance types (`TextInputInstance`). Use the `react-native-legacy-deep-imports` opt-out only if a dependency (not our code) breaks.
- **Keep the dev-client setup from plan 07** (`expo-dev-client`, `eas.json`, bundle ID, config plugins). Expo Go ignores it, and it stays available for a future development build, which would need rebuilding on SDK 58.
- **`.env.local` and Metro:** SDK 58 records `EXPO_PUBLIC_*` values in the transform cache, so after a key change one `--clear` restart is enough.

## Out of scope
- New features or UI changes, and adopting new SDK 58 APIs.
- Removing `yarn.lock` (still the user's decision).
- Starting an EAS build.

## Steps
### 1. Upgrade the SDK and its dependency set
Run the upgrade command from Decisions, then `npx expo install --check` and `npx expo-doctor@latest`. Re-pin the pinned packages as described. Done: `package.json` shows `expo` ~58, React Native 0.88, all Expo packages on 58, and Doctor reports only the lockfile warning.

### 2. Fix migration issues
Run `npx tsc --noEmit` and `npx eslint src`, and fix only errors caused by the upgrade. Check the Expo Router SDK 57→58 migration guide (`docs.expo.dev/router/migrate/sdk-57-to-58/`) against `Stack.Protected`, `Redirect` and `useLocalSearchParams`. Done: both pass, and `npx expo export --platform ios` builds.

### 3. Update project guidance
`AGENTS.md`, `## Expo`: SDK 58 runs in App Store Expo Go, started with `npx expo start --go --clear` or `npm start`. The development build is optional and needs a rebuild on SDK 58. Replace the "SDK 57 needs the development build" bullet and the `NativeTabs`/SDK 57 `apiRoutes` note ("SDK 57 has no `apiRoutes` flag" becomes the SDK 58 rule: keep `web.output: "static"` plus the `apiRoutes` option, or `"server"`, once API routes exist).

## Verification
- `npx expo install --check`, `npx expo-doctor@latest`, `npx tsc --noEmit`, `npx eslint src`, `npx expo export --platform ios`.
- `npx expo start --go --clear` starts and serves an SDK 58 manifest.
- On the user's iPhone in the updated Expo Go: the app opens to onboarding with no red screen, sign-up shows the form, and the plan 11 flows run (sign-up with a `+clerk_test` email and code `424242` → Home, restart keeps the session, Sign out → onboarding). The device steps are the user's to run.

## AGENTS.md updates
- `## Expo`: replace the SDK 57 development-build bullet with the SDK 58 Expo Go workflow, keeping the dev-client details as optional. Update the SDK note in the API-routes rule (`SDK 57 has no apiRoutes flag`).

## Result
- SDK 58: `expo` ~58.0.19, React Native 0.88.0, React 19.3.0, and every Expo package at the version `expo install --check` expects. That includes `react-native-gesture-handler` 3.3 (not imported directly), Reanimated 4.7.1 and Worklets 0.13.0. The pinned NativeWind, Tailwind, lightningcss and AI packages are unchanged.
- Install deviation: npm 12 rejected Expo CLI's `--allow-scripts`, and then reported a false `expo-symbols` peer conflict (the published ranges agree). Versions were written to `package.json` and installed with `npm install --legacy-peer-deps`. `npm ls` shows nothing invalid or missing.
- Code fixes from RN 0.88's strict types:
  - `useRef<TextInput>` → `TextInputInstance` (sign-in, sign-up, code input, `TextField`'s `ref`).
  - `useRef<ScrollView>` → `ScrollViewInstance` (design system).
  - `tab-bar.tsx` styles a ref-less `GlassView` type, because the new typed `ref` overflowed TypeScript's union limit.
- Router guide checked: `Stack.Protected` now redirects instead of unregistering, and the guard still lands signed-out guests on onboarding and signed-in guests on `(app)`. No `initialParams`, `redirect` props or visible headers.
- Checks: `expo install --check` up to date; Doctor 19/20 (duplicate lockfile only); `tsc` and `eslint src` pass; `expo export --platform ios --clear` builds 8.3 MB with the Clerk key; `expo start --go` serves an `exposdk:58.0.0` manifest. iPhone checks are the user's.
- Found on the iPhone after the upgrade: a blank white screen. `react-native-css` 3.1.0-rc.0 redirects `react-native` imports to a wrapper whose fixed export list lacks RN 0.88's new `AssetRegistry`, so `expo-asset` failed with "Cannot read property 'getAssetByID' of undefined" and fonts never loaded. Fixed with `src/lib/react-native-css-compat.ts`, which patches both wrapper copies (checked in the served bundle: `expo-asset` uses wrapper 277 and the shim patches 277 and 1244). The root layout now also falls back to system fonts on a font error instead of staying blank.
