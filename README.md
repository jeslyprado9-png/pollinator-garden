# Build a Pollinator Garden

A mobile-friendly class project made with HTML, CSS, and JavaScript, developed with Codex through five planned, feedback-driven revisions. Only version 1 is implemented.

## Play

Open the landing page and choose **Play version 1**, or open `v1/index.html` directly. Choose one of three flowers, then click or tap empty plots in the 3×3 garden. Fill all nine to welcome a bee. **Reset garden** clears the plots and visitor while keeping the selected flower. Keyboard users can Tab to buttons and activate them with Enter or Space.

There are no external assets, dependencies, accounts, or build steps. Version 1 does not save progress; reloading starts an empty garden. The bee is a simplified reward, not an ecological simulation.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open the local server in your browser. Alternatively, open `index.html` directly.

## Publish on GitHub Pages

1. Push the version 1 commit to the public GitHub repository. If this environment's branch is `work`, merge it into `main` through a pull request, or push the approved commit to `main` using your normal Git workflow.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select **main** and **/ (root)**, then click **Save**. Keep the root selected so both the landing page and `v1/` are published.
5. Wait for the Pages deployment to succeed in **Actions** or **Settings → Pages**.
6. Visit `https://jeslyprado9-png.github.io/pollinator-garden/` and follow the version 1 link. The direct game URL is `https://jeslyprado9-png.github.io/pollinator-garden/v1/`.
7. On the deployed site, test flower selection, all nine plots, the bee reward, reset, and both navigation links. Test on a phone and desktop; try keyboard controls too. Record the date, device/browser, outcome, and any confusing behavior in your reflection notes.

These URLs are expected publication addresses, not proof that deployment has happened. Local testing does not replace the required GitHub Pages testing for each revision.

## Validation

`node --check v1/game.js` checks JavaScript syntax. `tests/v1.cjs` runs browser checks with Playwright and Chromium available separately; no test dependencies are shipped with the game. Start the local server first, then run:

```sh
node tests/v1.cjs
```

Set `CHROMIUM_PATH` if your Chromium executable is elsewhere; set `BASE_URL` to test a different server, a project subpath, or the published Pages URL. The tests cover desktop keyboard and mobile touch input, planting all flowers, completion, occupied-plot protection, reset/replay, reload behavior, navigation, button sizes, horizontal overflow, and page errors at four widths. Screenshots are temporary local artifacts.

## Five revisions and reflection

See [CHANGELOG.md](CHANGELOG.md) for completed work and checks, and [REFLECTION.md](REFLECTION.md) for a reflection template. Preserve commit history. Future versions can live in `v2/` through `v5/`, with links added to the landing page as they are completed. Versions 2–5 require testing feedback and further approval; they are not implemented.

Submit the public repository link, the working Pages link demonstrating completed iterations, and your reflection. Repository: https://github.com/jeslyprado9-png/pollinator-garden
