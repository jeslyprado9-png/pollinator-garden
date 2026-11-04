# Change log

## Version 1 — Plant a garden · 2026-11-04

- Added a landing page linking to the preserved `v1/` game.
- Added three flower choices, nine plantable plots, a selected-flower indicator, planting instructions, progress count, and a bee visitor when all plots are filled.
- Added reset/replay, occupied-plot protection, keyboard controls, screen-reader labels and status updates, visible focus indicators, and responsive mobile layouts.
- Kept the game dependency-free with relative URLs for GitHub Pages. No saving or later-version mechanics yet.
- Added publishing instructions, repeatable browser checks, and a reflection template.

### Validation

Local checks passed on 2026-11-04:

- JavaScript syntax and Git whitespace checks.
- Chromium browser checks at 320, 390, 768, and 1280 pixels: flower selection, all nine placements, bee completion, occupied-plot protection, reset, replay, reload behavior, navigation, 44-pixel button targets, and absence of horizontal overflow or page errors.
- Enter/Space activation at desktop/tablet widths and touch selection/planting in a mobile browser context.
- Full browser checks repeated under `/pollinator-garden/` to verify GitHub Pages-style project paths.
- Mobile screenshot visually inspected.

These are local browser checks, not a live Pages deployment or physical-device test.

- GitHub Pages deployment and real-device testing: pending user publication and testing feedback.

## Future rounds (proposals, not implemented)

2. Pollinator variety and preferences, adjusted using version 1 feedback.
3. Short garden challenges, adjusted using version 2 feedback.
4. Local saving and plant replacement, adjusted using version 3 feedback.
5. Final usability, accessibility, and educational refinements based on testing.
