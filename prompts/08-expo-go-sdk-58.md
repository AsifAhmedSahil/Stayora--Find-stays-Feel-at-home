# 08 · Expo Go SDK 58 compatibility

Status: declined

## Goal
Run Stayora in the current iPhone App Store version of Expo Go. Align the project with Expo SDK 58, which the App Store Expo Go release notes currently identify as supported.

## Decisions
- Keep Expo Go as the user's required test runtime.
- Upgrade the app from SDK 57 to SDK 58 rather than downgrading to SDK 54 or creating a development build.
- Preserve existing app identity, routes, and user-facing behavior.
- Use Expo's SDK 58 migration guidance and `npx expo install --fix` to align all Expo and React Native dependencies.
- Do not start EAS builds or change backend services.

## Out of scope
- Building or installing a custom development client.
- Unrelated UI, design-system, or product changes.
- Updating dependencies beyond what SDK 58 compatibility requires.

## Steps
### 1. Upgrade SDK and its dependency set
Update `expo` and all SDK-coupled Expo, React, React Native, and lint packages to versions compatible with SDK 58. Preserve unrelated user changes and existing package conventions.

### 2. Resolve SDK 58 migration issues
Review Expo's SDK 57-to-58 migration notes and the app's Expo API usage. Fix only incompatibilities caused by the upgrade, keeping existing behavior and routes.

### 3. Update project guidance
Update `AGENTS.md` to document the SDK 58 / App Store Expo Go workflow and remove the obsolete SDK 57 unsupported claim. Keep `npm start` using Expo Go and retain the separate development-client command if its dependencies remain compatible.

## Verification
- `npx expo install --check`
- `npx expo-doctor`
- `npx tsc --noEmit`
- `npx expo lint`
- `npx expo export --platform ios`
- Start with `npm start` and confirm Expo Go receives the SDK 58 manifest over LAN.
- End-to-end open on the user's iPhone; confirm Stayora renders and can navigate from the initial route. This last check requires the user's device.

## AGENTS.md updates
In `## Expo`, replace the statement that SDK 57 requires an EAS development build on physical iPhones with the verified SDK 58 Expo Go workflow. Preserve the distinction between Expo Go and the optional development client.
