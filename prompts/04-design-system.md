# 04 · Roam design system

Status: approved

## Goal

Build a shared NativeWind design system for Roam from the attached reference. Provide reusable, accessible UI primitives and a development-only gallery that demonstrates their visual states and token use.

## Decisions

- Keep NativeWind v5 and Tailwind v4 as the styling source of truth. Put colors, typography, spacing, radii, and shadows in one `@theme` block in `src/global.css`; clear Tailwind's default palette, font-size ramp, radii, and shadows.
- Preserve the existing Roam yellow, lavender, ink, and neutral palette; use a 4px spacing scale and the reference's rounded, restrained surfaces.
- Bundle Plus Jakarta Sans Regular, Medium, and Bold static TTFs from the official Google Fonts repository under `assets/fonts/`, with its OFL license and filenames matching their PostScript names. Load them with `useFonts` in the root layout and keep the splash visible until loading finishes.
- Use `lucide-react-native` icons with `react-native-svg`; never use emoji as iconography.
- Put reusable primitives in `src/components/ui/` and shared class joining in `src/lib/cn.ts`. Components accept layout-only `className` and merge caller `style` last; interactive components expose accessible labels/states, disabled behavior, and press feedback.
- Build the gallery at `/design-system` with `__DEV__` access only. Support `?from=<section>` to jump to a named/numbered section and `?y=<offset>` for scroll restoration.
- Keep the app's default appearance light (`userInterfaceStyle: "light"`). Retain dark token overrides for the same semantic tokens, but do not add a manual theme toggle.
- Keep the existing app screen and add a gallery link only in development.

## Out of scope

- Rebuilding production booking/search flows or adding data integrations.
- A manual theme switch, new icon system, unrelated navigation or app configuration changes.
- Replacing NativeWind or adding a second token source.

## Steps

### 1. Establish tokens, fonts, and icon support

Update `src/global.css` to clear Tailwind defaults and define the Roam palette, Plus Jakarta Sans families, named type ramp, 4px spacing grid, radii, shadows, and dark overrides. Bundle the three licensed static font weights and OFL text in `assets/fonts/`; load fonts before the app renders in `src/app/_layout.tsx`. Add `lucide-react-native` and its Expo-compatible `react-native-svg` dependency.

### 2. Build the shared UI primitives

Create `src/lib/cn.ts` and a `src/components/ui/index.ts` barrel. Implement Text, Icon, Button, IconButton, TextField, Chip, Badge, Alert, ListingCard, PolicyCard, ListRow/ListGroup, TabBar with a glass appearance, SegmentedControl, Toggle, and Stepper. Reuse the existing button, surface, text, and chip APIs where possible. Include coherent variants, interaction states, accessibility, and token-based styles. Use an explicit placeholder when a property photo is not supplied.

### 3. Add the development design-system gallery

Create `src/app/design-system.tsx` with responsive, clearly grouped sections matching the attached sheet: brand/palette, typography, buttons, fields, chips, listing and policy cards, list rows, tab bar, icons, segmented control, toggles/stepper, alerts, and badges. Give sections stable identifiers for `?from=<section>` navigation and support `?y=<offset>`. Hide the route outside development by redirecting production visits to `/`.

### 4. Integrate and document

Update `src/app/index.tsx` to use the shared components/tokens and expose a development-only link to the gallery. Set `app.json` to light appearance. Update `AGENTS.md` with the settled design-system conventions and mark this prompt done with a Result after verification.

## Verification

- `npx tsc --noEmit`
- `npx expo lint`
- `npx expo export --platform web`
- Open `/design-system` in the Expo web preview; check all gallery sections render, `?from=typography` and `?y=<offset>` scroll to their targets, controls respond, and font assets load.
- Confirm production mode redirects `/design-system` to `/`, and that the development-only link is absent.
- Compare the rendered gallery with the attached reference and fix any visible layout or token inconsistencies.

## AGENTS.md updates

Update the existing Design system rules: retain single-source NativeWind tokens, Plus Jakarta Sans, light appearance, and primitives under `src/components/ui/`; document the chosen Lucide icons, component contracts, and development-only gallery query parameters. Do not disturb unrelated app architecture rules.
