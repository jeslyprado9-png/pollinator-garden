// Run against a local static server with Playwright and Chromium available.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:8000';
const key = 'pollinator-garden:v5';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 768, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 768, isMobile: width < 768 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
      await page.goto(base + '/');
      for (let n = 1; n <= 5; n++) assert.equal(await page.getByRole('link', { name: new RegExp(`Play version ${n}`) }).count(), 1);
      await page.getByRole('link', { name: /Play version 5/ }).click();
      await page.waitForURL('**/v5/');
      const progress = async (id, value) => assert.equal(await page.locator(`#${id}-progress`).evaluate(el => el.value), value, id);
      const visitors = async value => assert.equal(await page.locator('#visitor-count').textContent(), `${value} / 2 arrived`);
      const choose = async flower => {
        const choice = page.locator(`[data-flower="${flower}"]`);
        if (width < 768) await choice.tap();
        else { await choice.focus(); await page.keyboard.press('Enter'); }
      };
      const plot = async index => {
        const button = page.locator('.plot').nth(index);
        if (width < 768) await button.tap();
        else { await button.focus(); await page.keyboard.press('Space'); }
      };
      const plant = async (flower, index) => { await choose(flower); await plot(index); };
      const reset = async () => {
        await page.getByRole('button', { name: 'Reset garden' }).click();
        if (await page.locator('#reset-dialog').isVisible()) await page.getByRole('button', { name: 'Clear garden & save' }).click();
        await page.waitForFunction(key => localStorage.getItem(key) === null, key);
      };
      const saved = () => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
      assert.equal(await page.locator('.plot').count(), 9);
      assert.match(await page.locator('.save-note').textContent(), /current browser.*does not sync/s);
      assert.equal(await page.locator('#goal-details').getAttribute('open'), null);
      assert.ok(await page.locator('.progress-summary').evaluate(el => el.getBoundingClientRect().bottom <= document.querySelector('#garden').getBoundingClientRect().top));
      assert.ok(await page.locator('#garden').evaluate(el => el.getBoundingClientRect().top) < 1100, 'Garden reachable with less scrolling');
      // The saved flower positions and selection survive reload, then continue planting.
      await plant('coneflower', 0); await plant('susan', 1); await plant('balm', 2);
      await visitors(0); await progress('mix', 3); await progress('nine', 3);
      assert.deepEqual((await saved()).slots, ['coneflower', 'susan', 'balm', null, null, null, null, null, null]);
      assert.match(await page.locator('.plot').nth(2).getAttribute('data-feedback'), /Planted/);
      assert.match(await page.locator('#summary-types').textContent(), /3 \/ 3/);
      await page.reload();
      assert.equal(await page.locator('.plot').nth(1).getAttribute('data-planted'), 'susan');
      assert.equal(await page.locator('[data-flower="balm"]').getAttribute('aria-pressed'), 'true');
      await progress('mix', 3); await visitors(0);
      assert.match(await page.locator('#save-status').textContent(), /restored/);
      await plot(3); await plant('coneflower', 4);
      await visitors(2); await progress('welcome', 2);
      for (let i = 5; i < 9; i++) await plant('coneflower', i);
      assert.equal(await page.locator('#challenge-count').textContent(), '3 / 3 complete');
      await page.reload(); await visitors(2); await progress('nine', 9);
      assert.equal(await page.locator('#challenge-count').textContent(), '3 / 3 complete');
      // Replace the only Susan: lose sampler but preserve visitors and nine planted plots.
      await plant('coneflower', 1);
      assert.equal(await page.locator('.plot').nth(1).getAttribute('data-feedback'), 'Replaced');
      assert.equal(await page.locator('#summary-mix').evaluate(el => el.classList.contains('done')), false);
      await progress('mix', 2); await progress('nine', 9); await visitors(2);
      assert.equal(await page.locator('#mix-state').textContent(), 'In progress');
      assert.match(await page.locator('#status').textContent(), /replaced.*back in progress/);
      await plant('balm', 1); await progress('mix', 2);
      // Lose the butterfly by replacing its balms, then regain it.
      await plant('susan', 2); await visitors(2);
      await plant('susan', 3); await visitors(1); await progress('balm', 1); await progress('welcome', 1);
      assert.equal(await page.locator('#butterfly-card').evaluate(el => el.classList.contains('arrived')), false);
      assert.equal(await page.locator('#welcome-state').textContent(), 'In progress');
      assert.match(await page.locator('#status').textContent(), /Butterfly goal no longer met/);
      await page.reload(); await visitors(1); await progress('welcome', 1);
      await plant('balm', 3); await visitors(2);
      // Replacing all eligible flowers with balm revokes both visitors, never adds plots.
      for (const i of [0, 2, 4, 5, 6, 7, 8]) await plant('balm', i);
      await visitors(0); await progress('bee', 0); await progress('cone', 0);
      await progress('mix', 1); await progress('welcome', 0); await progress('nine', 9);
      assert.equal(await page.locator('#counter').textContent(), '9 / 9 planted');
      assert.equal(await page.locator('#challenge-count').textContent(), '1 / 3 complete');
      const before = await saved();
      await plot(0); assert.deepEqual(await saved(), before);
      assert.match(await page.locator('#status').textContent(), /already has/);
      // Cancel and Escape preserve the exact save; focus returns to Reset.
      const unchanged = await saved();
      await page.getByRole('button', { name: 'Reset garden' }).click();
      assert.equal(await page.locator('#reset-dialog').isVisible(), true);
      assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Keep my garden');
      await page.getByRole('button', { name: 'Keep my garden' }).click();
      assert.deepEqual(await saved(), unchanged);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'reset');
      await page.getByRole('button', { name: 'Reset garden' }).click();
      await page.keyboard.press('Escape');
      assert.deepEqual(await saved(), unchanged);
      assert.equal(await page.locator('#reset-dialog').isVisible(), false);
      await page.reload();
      assert.equal(await page.locator('[data-planted]').count(), 9);
      // Reset removes only this version's save and never restores old plants.
      await page.evaluate(() => localStorage.setItem('unrelated-test', 'keep'));
      await reset();
      assert.equal(await saved(), null);
      assert.equal(await page.evaluate(() => localStorage.getItem('unrelated-test')), 'keep');
      await page.reload();
      assert.equal(await page.locator('[data-planted]').count(), 0);
      for (const id of ['bee', 'balm', 'cone', 'mix', 'welcome', 'nine']) await progress(id, 0);
      await visitors(0);
      await plant('susan', 8); await page.reload();
      assert.equal(await page.locator('.plot').nth(8).getAttribute('data-planted'), 'susan');
      // Older versions have independent behavior and do not change the v5 save.
      const replay = await saved();
      await page.goto(base + '/v4/');
      assert.equal(await page.locator('[data-planted]').count(), 0);
      await page.locator('.plot').first().click();
      assert.deepEqual(await saved(), replay);
      await page.goto(base + '/v5/');
      assert.equal(await page.locator('.plot').nth(8).getAttribute('data-planted'), 'susan');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      assert.ok(await page.locator('button').evaluateAll(buttons => buttons.filter(el => el.getClientRects().length).every(el => { const r = el.getBoundingClientRect(); return r.width >= 48 && r.height >= 48; })), '48px visible button targets');
      assert.equal(await page.locator('.plot[aria-disabled="true"]').count(), 0);
      if (width === 390 || width === 1280) await page.screenshot({ path: `/tmp/pollinator-v5-${width}.png`, fullPage: true });
      // A separate browser context has no garden from this one.
      const isolated = await browser.newContext();
      const other = await isolated.newPage(); await other.goto(base + '/v5/');
      assert.equal(await other.locator('[data-planted]').count(), 0);
      await isolated.close();
      assert.deepEqual(errors, []);
      console.log(`PASS v5 ${width}px: save/restore, full-garden replacement, progress increases/decreases, reset/reload, version/browser isolation, ${width < 768 ? 'touch' : 'keyboard'}, layout and errors`);
      await context.close();
    }
    const page = await browser.newPage();
    await page.goto(base + '/v5/');
    // Malformed or unsupported saves cannot inject flowers or crash rendering.
    const badSaves = ['{', 'null', JSON.stringify({ version: 5, slots: Array(9).fill(['balm']), selected: 'balm' }), JSON.stringify({ version: 3, slots: Array(9).fill('balm'), selected: 'balm' }), JSON.stringify({ version: 5, slots: ['balm'], selected: 'balm' }), JSON.stringify({ version: 5, slots: Array(9).fill('unknown'), selected: 'balm' }), JSON.stringify({ version: 5, slots: Array(9).fill(null), selected: 'toString' })];
    for (const raw of badSaves) {
      await page.evaluate(({key, raw}) => localStorage.setItem(key, raw), {key, raw});
      await page.reload();
      assert.equal(await page.locator('[data-planted]').count(), 0);
      assert.match(await page.locator('#save-status').textContent(), /could not be loaded/);
      await page.locator('.plot').first().click();
      assert.equal(await page.locator('[data-planted]').count(), 1);
    }
    await page.close();
    // Storage denial leaves the game playable and reports failure honestly.
    const blocked = await browser.newContext();
    await blocked.addInitScript(() => { for (const method of ['getItem', 'setItem', 'removeItem']) Storage.prototype[method] = () => { throw new Error('Storage blocked'); }; });
    const denied = await blocked.newPage();
    const errors = []; denied.on('pageerror', e => errors.push(e.message));
    await denied.goto(base + '/v5/');
    await denied.locator('.plot').first().click();
    assert.equal(await denied.locator('[data-planted]').count(), 1);
    assert.match(await denied.locator('#save-status').textContent(), /Saving unavailable/);
    await denied.getByRole('button', { name: 'Reset garden' }).click();
    await denied.getByRole('button', { name: 'Clear garden & save' }).click();
    await denied.waitForFunction(() => document.querySelector('#save-status').textContent.includes('Could not clear browser storage'));
    assert.equal(await denied.locator('[data-planted]').count(), 0);
    assert.match(await denied.locator('#save-status').textContent(), /Could not clear browser storage/);
    assert.deepEqual(errors, []);
    await blocked.close();
    // Reduced motion removes animations while retaining visible action feedback.
    const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    const motion = await reduced.newPage(); await motion.goto(base + '/v5/');
    await motion.locator('.plot').first().click();
    assert.equal(await motion.locator('.plot').first().getAttribute('data-feedback'), 'Planted');
    assert.equal(await motion.locator('.plot').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    await motion.locator('.plot').first().focus();
    await motion.keyboard.press('ArrowRight');
    assert.equal(await motion.evaluate(() => document.activeElement.dataset.index), '1');
    await motion.keyboard.press('ArrowDown');
    assert.equal(await motion.evaluate(() => document.activeElement.dataset.index), '4');
    assert.equal(await motion.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
    await motion.getByRole('button', { name: 'Reset garden' }).click();
    for (let i = 0; i < 4; i++) { await motion.keyboard.press('Tab'); assert.ok(await motion.evaluate(() => document.querySelector('#reset-dialog').contains(document.activeElement))); }
    await motion.keyboard.press('Escape');
    // Detailed rules stay available; the compact summary updates beside the plots.
    await motion.locator('#goal-details > summary').click();
    assert.equal(await motion.locator('#bee-progress').isVisible(), true);
    await reduced.close();
    console.log('PASS v5: reduced motion, persistent labels, arrow navigation, visible focus, modal focus containment and expandable rules');
    console.log('PASS v5: malformed saves, invalid schema, denied storage, playable fallback and reset failure message');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
