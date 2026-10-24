# 07 · iPhone development build

Status: done

## Goal
Run Stayora on the user's physical iPhone with an SDK 57 development build instead of the incompatible App Store Expo Go.

## Decisions
- Keep Expo SDK 57; do not downgrade the app to match the SDK bundled in App Store Expo Go.
- Use an EAS cloud development build because this Windows environment does not have the local iOS toolchain.
- Add the SDK-compatible `expo-dev-client` using `npx expo install`.
- Add only an internal `development` profile to `eas.json`; do not add unrelated preview or production build workflows.
- Register the iPhone for internal iOS distribution through EAS when building. EAS account login, Apple signing, device registration, and starting a cloud build remain user-authenticated steps.
- After installation, connect with `npx expo start --dev-client`; the existing Expo Go QR/server is not the runtime for the development build.

## Out of scope
- Downgrading Expo SDK or changing unrelated Expo package patch versions.
- Creating a production or App Store build, setting up EAS Update, or changing application behavior.
- Handling or storing Expo, Apple, or other secrets.

## Steps
### 1. Install the development client
Use `npx expo install expo-dev-client` so Expo selects the version compatible with the project's SDK. Preserve unrelated worktree changes.

### 2. Configure an iPhone development profile
Create a minimal root `eas.json` with an internal `development` profile and `developmentClient: true`. Keep the existing app identity and URL scheme unchanged.

### 3. Document the supported iOS workflow
Update the Expo guidance in `AGENTS.md` to explain that SDK 57 on a physical iPhone requires a development build, and document the start command. Include the EAS/device registration prerequisites without recording credentials.

### 4. Verify setup
Check the EAS profile shape, run Expo dependency compatibility checks, TypeScript, and lint. Confirm the development server starts in dev-client mode. Do not launch a cloud build until the user confirms and completes any required Expo/Apple authentication and device registration.

## Verification
- `npx expo install --check`
- `npx tsc --noEmit`
- `npx expo lint`
- `npx expo start --dev-client --clear` starts the project for an installed development build.
- Validate EAS configuration with `npx eas-cli@latest config --platform ios --profile development` if the installed CLI supports the command; otherwise use the documented EAS config validation command and report the exact result.
- End-to-end iPhone installation and runtime require the user's Expo account, Apple signing access, and registered device; perform after the user authorizes the cloud build.

## AGENTS.md updates
In `## Expo`, replace the generic native-library Expo Go guidance with the SDK 57 physical-iPhone development-build requirement and the EAS dev-client start workflow. Preserve the existing rule to check version-specific Expo documentation.

## Result
Picked up again on 2026-10-24, after Expo Go (SDK 58) failed on the SDK 57 bundle with "Cannot find native module 'ExpoAsset'".
- Added `expo-dev-client` ~57.0.20 (`npx expo install --npm`; the stray `yarn.lock` makes the default pick yarn) and the `start:dev-client` script.
- `eas.json` already had the `development` profile (internal, `developmentClient: true`).
- `app.json`: bundle ID / package `com.asifahmedsahil.stayora` (user choice), plus the `expo-secure-store` and `@clerk/expo` config plugins Clerk's native setup expects.
- Checks: `expo install --check` up to date, `tsc` passes, `eslint src` passes, Expo Doctor 20/21 (duplicate lockfile only), `expo start --dev-client` starts Metro. `eas config` stops at "EAS project not configured": `eas init`, device registration and the cloud build are the user's steps.
