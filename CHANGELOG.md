# Change log

## Version 2 — Welcome pollinators · 2026-11-04

- Responds to the user’s successful live version 1 test by making flower choices affect visitors.
- Added independent `v2/` assets and a landing-page link; preserved every file in `v1/`.
- Bee goal: 3 coneflowers or black-eyed Susans in any mix. Butterfly goal: 2 bee balms AND 1 coneflower. Visitors arrive immediately when their own conditions are met.
- Added labeled progress bars, arrival states, visitor count, flower-choice hints, and guidance for full gardens with unmet goals. Reset clears all visitor progress and arrivals.
- Separated simplified game rules from real ecological facts, including butterfly host-plant needs and the limits of exact flower-count rules. Added US Forest Service learning links.
- Kept static, dependency-free publishing and deferred saving, challenges, and plant replacement.

### Version 2 validation

- Passed JavaScript syntax and Git whitespace checks.
- Passed Chromium browser tests under `/pollinator-garden/` at 320, 390, 768, and 1280 pixels, including mobile touch and keyboard input.
- Verified exact visitor thresholds, both arrival orders, both parts of the butterfly goal, nonqualifying flowers, capped progress, occupied-plot protection, full gardens with and without goals met, reset/replay, reload, navigation, button sizes, absence of horizontal overflow, and no page/resource errors.
- Inspected mobile and desktop screenshots.
- Re-ran all version 1 browser regression checks successfully; `v1/` has no changes against the merged version 1.
- These checks used a local static server, not the deployed version 2 site or physical devices.
- GitHub Pages testing: pending merge/deployment and user feedback.

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

- User-reported GitHub Pages test: planting all three flower types and filling all nine plots worked; the bee reward appeared. Device/browser details were not provided.

## Future rounds (proposals, not implemented)

3. Short garden challenges, adjusted using version 2 feedback.
4. Local saving and plant replacement, adjusted using version 3 feedback.
5. Final usability, accessibility, and educational refinements based on testing.
