# 05 · Design-system readiness

Status: done

## Goal

Make shared interactive controls meet platform touch-target guidance, ensure foreground contrast on solid brand surfaces in light and dark appearances, and verify the gallery renders after the changes.

## Decisions

- Set shared button, chip, segmented-control, alert-dismiss, listing-save, stepper, and gallery-link controls to at least 48px on both platforms. This meets the 44pt iOS and 48dp Android guidance without platform-specific sizing branches.
- Add a semantic on-brand foreground token/tone with dark ink, and apply it to text and icons over solid yellow or lavender surfaces. Keep existing surfaces and appearance behavior unchanged.
- Keep `userInterfaceStyle: "light"` and the existing dark token overrides. The light native appearance and CSS dark overrides are established project decisions, not a reason to change theme behavior in this fix.
- Add the ESLint and Expo ESLint configuration packages after user approval. Do not change npm's script policy unless explicitly required and approved.

## Out of scope

- Redesigning the starter home screen, adding production routes/data, adding a theme switch, or changing app appearance settings.
- Adding dependencies, changing surface colors, or changing the established appearance behavior.

## Steps

### 1. Normalize shared touch targets

Update the affected primitives in `src/components/ui/` so all undersized interactive controls have at least 48px width and height, including the small Button size, Chip, SegmentedControl, alert dismiss action, ListingCard save action, Stepper icon actions, and gallery links. Keep platform adapters and accessibility/disabled behavior consistent. Add the minimum touch-target rule to the design-system guidance in `AGENTS.md`.

### 2. Fix foreground contrast on brand surfaces

Add one fixed dark-ink on-brand token and a matching `AppText`/`Icon` tone. Apply it to text and icons displayed on solid yellow/lavender brand surfaces, including primary and lavender buttons, selected chips/tabs, and the gallery brand sample. Add the token/tone convention to `AGENTS.md`.

### 3. Validate the gallery and app

Run TypeScript and lint checks, export or open the Expo web gallery when the existing setup permits, and inspect the rendered gallery for regressions. Do not change unrelated setup or add packages just to make lint available.

## Verification

- `npx tsc --noEmit`
- `npx expo lint`
- `npx expo export --platform web` if supported by the current installed dependencies.
- Inspect the `/design-system` gallery and confirm affected controls remain functional, disabled states still block actions, and interactive targets are at least 48px.
- Inspect in both light and dark system appearances and verify readable contrast on solid brand surfaces.

## AGENTS.md updates

Add the minimum 44pt iOS/48dp Android touch-target rule for custom interactive primitives and document the semantic on-brand foreground tone for text/icons on solid brand surfaces. Keep existing appearance decisions unchanged.

## Result

Raised shared touch targets to 48px and added an `onBrand` foreground tone for solid yellow/lavender surfaces. The gallery passed light/dark checks with 12.41:1 yellow and 10.64:1 lavender contrast, measured 48px interactive targets, verified alert dismissal, and confirmed the disabled button stays disabled. TypeScript, Expo lint, and web export passed.

ESLint was added after approval because the repository had no lint configuration. The initial Expo package install was blocked by npm's script-policy gate; installation succeeded through the approved direct `npm install --ignore-scripts` fallback. npm reported 26 audit advisories (6 moderate, 20 high); they were not auto-fixed as part of this task.
