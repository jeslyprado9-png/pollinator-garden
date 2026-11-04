# Build a Pollinator Garden

A mobile-friendly class project made with HTML, CSS, and JavaScript, developed with Codex through five planned, feedback-driven revisions. Versions 1, 2, and 3 are implemented; later rounds await testing feedback.

## Play

Open the landing page and choose **Play version 3**, or revisit versions 1 and 2. Choose one of three flowers, then click or tap empty plots in the 3×3 garden. In version 1, fill all nine to welcome a bee. In version 2, a bee arrives after 3 coneflowers or black-eyed Susans in any combination; a butterfly arrives after 2 bee balms AND 1 coneflower. Progress bars show each goal. Flowers can count toward both visitors, and visitors can arrive before the garden is full. If a full garden misses a goal, reset and try a new mix. **Reset garden** clears the plots and visitor while keeping the selected flower. Keyboard users can Tab to buttons and activate them with Enter or Space.

There are no external assets, dependencies, accounts, or build steps. No version saves progress; reloading starts an empty garden. Version 2 labels its exact flower counts as simplified game rules and separates them from real ecological facts. These counts do not predict visits in a real garden.

Version 3 adds three challenges: Flower sampler (at least one of each type), Welcome both visitors, and Nine blooms (fill all plots). All can be completed together: plant 2 coneflowers, 1 black-eyed Susan, 2 bee balms, and any 4 additional flowers. Challenge and visitor instructions appear before planting controls, with live progress and completion states. Reset clears garden, visitor, and challenge progress while keeping your selected flower. Version 3 lives at `v3/`; its browser checks also verify challenge thresholds, shared progress, and goal placement.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open the local server in your browser. Alternatively, open `index.html` directly.

## Publish on GitHub Pages

1. Push the revision branch to the public GitHub repository and merge its pull request into `main`, preserving commit history.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select **main** and **/ (root)**, then click **Save**. Keep the root selected so the landing page and all three version folders are published.
5. Wait for the Pages deployment to succeed in **Actions** or **Settings → Pages**.
6. Visit `https://jeslyprado9-png.github.io/pollinator-garden/` and choose a version. Version 2 is at `https://jeslyprado9-png.github.io/pollinator-garden/v2/`; version 1 remains at `https://jeslyprado9-png.github.io/pollinator-garden/v1/`.
7. On the deployed site, test flower selection, each visitor's exact arrival conditions, progress, reset, full gardens with unmet goals, and navigation. Test on a phone and desktop; try keyboard controls too. Record the date, device/browser, outcome, and any confusing behavior in your reflection notes.

Version 1 has been tested live by the user. Version 2 has also been merged, published, and tested by the user: both visitors arrived correctly and Reset cleared the garden and visitor progress. Version 3 awaits merge, publication, and user testing feedback. Local testing does not replace the required GitHub Pages testing for each revision.

## Validation

`node --check v1/game.js` and `node --check v2/game.js` check JavaScript syntax. `tests/v1.cjs` and `tests/v2.cjs` run browser checks with Playwright and Chromium available separately; no test dependencies are shipped with the game. Start the local server first, then run:

```sh
node tests/v1.cjs
node tests/v2.cjs
node tests/v3.cjs
```

Set `CHROMIUM_PATH` if your Chromium executable is elsewhere; set `BASE_URL` to test a different server, a project subpath, or the published Pages URL. The tests cover desktop keyboard and mobile touch input, planting all flowers, completion, occupied-plot protection, reset/replay, reload behavior, navigation, button sizes, horizontal overflow, and page errors at four widths. Version 2 also checks both visitor arrival orders, exact thresholds, progress caps, unmet goals, and independent reset of visitor progress. Screenshots are temporary local artifacts.

## Five revisions and reflection

See [CHANGELOG.md](CHANGELOG.md) for completed work and checks, and [REFLECTION.md](REFLECTION.md) for a reflection template. Preserve commit history. Future versions can live in `v4/` and `v5/`, with links added to the landing page as they are completed. Versions 4–5 require version 3 testing feedback and further approval; they are not implemented.

Submit the public repository link, the working Pages link demonstrating completed iterations, and your reflection. Repository: https://github.com/jeslyprado9-png/pollinator-garden
