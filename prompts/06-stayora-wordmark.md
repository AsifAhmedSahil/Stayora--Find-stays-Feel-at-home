# 06 · Stayora wordmark

Status: done

## Goal

Create a distinctive, reusable Stayora wordmark, update the visible app identity, and show the mark in the development design-system gallery.

## Design plan

### Palette

- Brand yellow `#ffc629`: the wordmark's doorway `o`.
- Brand lavender `#c9b4ff`: secondary specimen background.
- Ink `#0b0b1a`: primary lettering and mark detail.
- Canvas `#f4f5f7`: quiet display field.
- Surface `#ffffff`: alternate specimen field.

These are existing brand tokens; no new palette values are proposed.

### Type

Use the existing Plus Jakarta Sans Bold in title case, in the established wordmark scale. Make the first `o` a custom vector glyph: a rounded, welcoming doorway with a continuous outer `o` silhouette and a small dark opening, picked out in Stayora yellow. Keep `Stay`, `ra`, and the final `a` typographic so the name remains immediately legible and aligned with the app.

### Layout

Compare the standalone inline lockup with a quiet specimen treatment:

```text
Standalone:   Stay [doorway-o] ra

Gallery:
+----------------------------------+
|   Stay [doorway-o] ra            |
|   Stayora wordmark               |
|   On canvas / yellow doorway-o   |
+----------------------------------+
```

Use left alignment and ample clear space. Keep the specimen unboxed or on a single calm surface; do not add a destination tagline, decorative travel illustration, gradient, or additional icon.

### Principles

- Make the doorway `o` the single memorable move: a small nod to feeling at home, contained inside the name rather than appended as a generic house badge.
- Use the correct Stayora name in visible app branding; preserve the existing font, scale, palette, and readable contrast.
- Implement the vector mark with the already-installed `react-native-svg`, expose it as a reusable component, and document its clear-space and contrast rules.
- Add it to the Brand section of `/design-system`, replace the plain-text home header, and update the Expo display name. Preserve the existing URL scheme and slug to avoid breaking links.

### Critique and revision

The earlier open route-loop `o` was a travel cue better suited to the old Roam name than to Stayora. A roof emblem beside the name would be generic lodging iconography. The selected doorway-shaped `o` connects to Stayora's promise of a stay that feels like home while keeping the memorable mark inside the name.

## Out of scope

- Rebranding the app palette or typeface, changing the URL scheme/package identifier, adding dependencies, or creating a full logo suite.

## Steps

### 1. Build the vector wordmark

Create a reusable, accessible `StayoraWordmark` component under `src/components/brand/`. Use Plus Jakarta Sans for the typographic letters and a scale-matched vector doorway glyph for the first `o`, using existing brand tokens. Keep the accessible label as “Stayora”. Export it through an appropriate component barrel only if that barrel already exists. Replace visible Roam branding in the home header and gallery, and update `expo.name` in `app.json`; leave the slug and URL scheme unchanged.

### 2. Add the brand specimen

Update the Brand section in `src/app/design-system.tsx` to show the wordmark on its neutral canvas and demonstrate the yellow doorway glyph alongside the brand description. Keep the current hero sample, but ensure it remains readable and the layout works on mobile and wide screens.

### 3. Document and verify

Update the design-system rules in `AGENTS.md`, mark this plan approved after approval and done after implementation, and verify TypeScript, lint, web export, and a screenshot of the gallery.

## Verification

- `npx tsc --noEmit`
- `npx expo lint`
- `npx expo export --platform web`
- Open `/design-system` at mobile and desktop widths; inspect the wordmark's lettering alignment, SVG rendering, token colors, accessibility label, and spacing in the Brand section.

## AGENTS.md updates

Document the vector wordmark and custom doorway `o` as the established Stayora lockup; keep title-case Plus Jakarta Sans lettering and existing brand tokens. State clear-space guidance and that the doorway glyph uses the yellow brand token on neutral fields.

## Result

Added the accessible Stayora lockup with a yellow doorway-shaped `o`, used it in the home header and design-system gallery, and changed the Expo display name to Stayora without changing the `roam` slug or URL scheme. TypeScript, lint, and static web export passed. Browser screenshots verified the mark in the gallery at mobile and desktop widths and on the home screen.
