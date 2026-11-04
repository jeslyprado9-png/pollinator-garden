# Change log

## Version 5 — Grow & explore · 2026-11-04

- Built from latest main (`050d536`), adding independent `v5/` assets and a landing-page link to complete the five-version navigation. Preserved all files in `v1/` through `v4/`.
- Added a compact live summary directly above the garden: challenge totals, flower types, plot counts, both visitor requirements and current counts, and completion checkmarks. Full instructions and progress bars remain in an expandable panel.
- Reworked typography, contrast, spacing, and responsive layouts; phone flower controls remain available while scrolling within the garden. Buttons have at least 48px targets, keyboard focus has a contrasting outline, and arrow keys move between plots.
- Added a labeled Planted/Replaced highlight on the most recently changed plot and brief feedback for newly completed challenges. Reduced-motion preferences disable animation while keeping labels, checkmarks, and highlights.
- Added a native Reset confirmation dialog for nonempty gardens, with Keep my garden focused by default, Escape/cancel support, contained keyboard focus, and focus returned to Reset. Confirming clears this version’s saved garden.
- Preserved browser saving, save validation and failure messages, individual replacement, and recalculated visitor/challenge progress. V5 has its own save key and does not modify older saves.

### Version 5 validation

- Passed JavaScript syntax and staged Git whitespace checks.
- Passed local Chromium suites for all five versions under `/pollinator-garden/` at 320, 390, 768, and 1280 pixels, with phone touch and desktop keyboard input.
- V5 checks cover save/restore, full-garden replacement, increasing/decreasing visitor and challenge progress, summary updates, version/browser isolation, invalid saves, blocked storage, and error-free page/resource loading.
- Verified Reset cancellation and Escape preserve the save, confirmation clears it across reload, safe default focus, return focus, and Tab containment. Verified arrow navigation, visible focus, at least 48px visible button targets, no horizontal overflow, reduced-motion animation suppression with persistent action labels, expandable full goals, and all five landing-page links.
- Measured first-plot position on an empty 390px-wide local viewport: v4 at 1290px, v5 at 888px (402px less scrolling). Inspected initial mobile/desktop layouts and the mobile confirmation dialog.
- Preserved `v1/`–`v4/` and `REFLECTION.md` unchanged; no personal reflection or unreported user testing observations were added.
- These checks used local Chromium, not physical devices or the live v5 Pages site. Final live testing remains pending merge/publication and user feedback.

## Version 4 — Save & replant · 2026-11-04

- Responds to the user’s successful GitHub Pages test of version 3. Built from latest main (`1801aae`); added independent `v4/` assets and a landing-page link while preserving `v1/`, `v2/`, and `v3/`.
- Automatically saves nine plot positions and the selected flower in browser local storage, using a version-specific key; restores valid saves on reload. Visitor and challenge progress are recalculated from flowers rather than trusted from saved counters.
- Choose a flower, then select an occupied plot to replace only that flower, including in full gardens. Counts stay capped and planted totals stay accurate. Visitors and challenges can lose or regain completion when flowers change, with accessible status updates.
- Explains that saves belong to the current browser and site, do not sync across browsers/devices, and can be lost when site data is cleared or private browsing ends.
- Reset clears the version 4 save and all progress without removing unrelated browser data. Invalid saves and blocked/full storage show honest messages while the game stays playable.
- Version 5 remains deferred pending live version 4 testing feedback.

### Version 4 validation

- Passed JavaScript syntax and Git whitespace checks.
- Passed local Chromium tests under `/pollinator-garden/` at 320, 390, 768, and 1280 pixels, with mobile touch and desktop keyboard input.
- Verified partial and completed garden restore, exact flower positions, selected-flower restore, continued planting, replacement in a full garden, visitor and challenge progress increasing and decreasing, same-flower no-op, Reset followed by reload, replay, and independence from older versions and separate browser contexts.
- Verified malformed/unsupported saves, blocked storage, playable fallback messages, 44px targets, no horizontal overflow, and no page/resource errors. Inspected mobile and desktop screenshots.
- Passed v1, v2, and v3 browser regression suites; their files are unchanged from latest main.
- These are local tests, not live Pages or physical-device tests. User subsequently tested version 4 on GitHub Pages: flowers remained after refresh, individual replacement worked, and the garden stayed empty after Reset and another refresh. Device/browser details were not provided.

## Version 3 — Garden challenges · 2026-11-04

- Responds to successful live version 2 testing and the request for short challenges and less scrolling. No earlier v3 branch, PR, or local implementation was found.
- Added independent `v3/` assets and a landing-page link; preserved all files in `v1/` and `v2/`.
- Added Flower sampler (one of each flower), Welcome both visitors, and Nine blooms (nine planted plots), with labeled progress bars, completion states, a total completed count, and screen-reader completion announcements.
- All three can be completed in one nine-plot garden; visitor rules stay the same. Reset clears all challenge and visitor progress, and reload starts fresh.
- Moved all challenge instructions and visitor goals ahead of flower choices and plots; compacted headers, cards, and spacing for less scrolling.
- Versions 4–5, saving, and plant replacement remain deferred until feedback and further authorization.

### Version 3 validation

- Passed JavaScript syntax and Git whitespace checks.
- Passed local Chromium tests under `/pollinator-garden/` at 320, 390, 768, and 1280 pixels, with touch and keyboard input.
- Verified challenge progress/completion, shared nine-plot completion, full gardens with unmet goals, reset/replay, reload, occupied-plot protection, visitor thresholds and both arrival orders, progress caps, navigation, 44px button targets, no horizontal overflow, and no page/resource errors.
- Verified all challenge instructions and visitor goals precede planting controls and fit within the first 900 vertical pixels at all four widths. Inspected mobile and desktop screenshots.
- Passed version 1 and version 2 browser regression suites; their assets are unchanged from latest main.
- Checks used a local static server, not physical devices or live Pages. User subsequently tested version 3 on GitHub Pages: all three challenges completed within nine plots, both visitors arrived, Reset cleared the garden, and goals appeared above planting. Device/browser details were not provided.

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
- User-reported GitHub Pages test: version 2 was merged, published, and tested; both visitors arrived correctly and Reset cleared the garden and visitor progress. Device/browser details were not provided.

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

## Final live testing

Version 5 awaits final user testing on GitHub Pages. No further revision is being built.
