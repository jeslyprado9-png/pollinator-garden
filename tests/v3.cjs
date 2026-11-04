// Start a static server; run with Playwright and Chromium available separately.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 768, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: width < 768, isMobile: width < 768 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(base + '/');
      await page.getByRole('link', { name: /Play version 3/ }).click();
      await page.waitForURL('**/v3/');
      assert.equal(await page.locator('.plot').count(), 9);
      assert.equal(await page.locator('#visitor-count').textContent(), '0 / 2 arrived');
      assert.match(await page.locator('.rules-note').textContent(), /not real-world planting requirements/);
      assert.match(await page.locator('#nature-heading').textContent(), /Real ecological facts/);
      const plant = async (flower, index) => {
        const choice = page.locator(`[data-flower="${flower}"]`);
        const plot = page.locator('.plot').nth(index);
        if (width < 768) { await choice.tap(); await plot.tap(); }
        else { await choice.focus(); await page.keyboard.press('Enter'); await plot.focus(); await page.keyboard.press('Space'); }
      };
      const reset = () => page.getByRole('button', { name: 'Reset garden' }).click();
      const progress = async (id, value) => assert.equal(await page.locator(`#${id}-progress`).evaluate(progress => progress.value), value);
      const arrived = async (who, expected) => assert.equal(await page.locator(`#${who}-card`).evaluate(card => card.classList.contains('arrived')), expected);
      assert.equal(await page.locator('.challenge-card').count(), 3);
      assert.equal(await page.locator('#challenge-count').textContent(), '0 / 3 complete');
      // Every instruction is visible in reading order before flower choice and plots.
      assert.ok(await page.evaluate(() => {
        const controls = document.querySelector('.flower-choices').getBoundingClientRect().top;
        return [...document.querySelectorAll('.challenge-card, .visitor-card')].every(card => card.getBoundingClientRect().bottom <= controls);
      }));
      const goalsBottom = await page.locator('.goals').evaluate(el => el.getBoundingClientRect().bottom);
      assert.ok(goalsBottom < 900, 'All challenge and visitor goals fit before planting within a 900px viewport');
      // Bee needs three eligible flowers. Bee balm does not count.
      await plant('susan', 0); await progress('bee', 1); await arrived('bee', false);
      await plant('balm', 1); await progress('bee', 1); await progress('balm', 1);
      await plant('susan', 2); await progress('bee', 2); await arrived('bee', false);
      await plant('coneflower', 3); await arrived('bee', true); await arrived('butterfly', false);
      assert.match(await page.locator('#status').textContent(), /Bee arrived!/);
      await plant('balm', 4); await arrived('butterfly', true);
      assert.match(await page.locator('#status').textContent(), /Butterfly arrived!.*Both visitors/);
      assert.equal(await page.locator('#visitor-count').textContent(), '2 / 2 arrived');
      await progress('mix', 3); await progress('welcome', 2); await progress('nine', 5);
      assert.equal(await page.locator('#challenge-count').textContent(), '2 / 3 complete');
      // Repeat clicks cannot increase counts or overwrite flowers.
      await page.locator('.plot').first().evaluate(button => button.click());
      assert.equal(await page.locator('#counter').textContent(), '5 / 9 planted');
      assert.equal(await page.locator('.plot').first().getAttribute('data-planted'), 'susan');
      for (let i = 5; i < 9; i++) await plant('susan', i);
      await progress('bee', 3); await progress('balm', 2); await progress('cone', 1);
      assert.match(await page.locator('#status').textContent(), /All three challenges complete/);
      await progress('nine', 9);
      assert.equal(await page.locator('#challenge-count').textContent(), '3 / 3 complete');
      assert.equal(await page.locator('.challenge-card.complete').count(), 3);
      await reset();
      for (const id of ['mix', 'welcome', 'nine']) await progress(id, 0);
      assert.equal(await page.locator('.challenge-card.complete').count(), 0);
      assert.equal(await page.locator('#challenge-count').textContent(), '0 / 3 complete');
      await progress('bee', 0); await progress('balm', 0); await progress('cone', 0);
      await arrived('bee', false); await arrived('butterfly', false);
      assert.equal(await page.locator('#visitor-count').textContent(), '0 / 2 arrived');
      assert.equal(await page.locator('[data-planted]').count(), 0);
      // Butterfly can arrive first; both of its conditions must be met.
      await plant('balm', 0); await plant('balm', 1);
      await arrived('butterfly', false); await progress('cone', 0);
      await plant('coneflower', 2); await arrived('butterfly', true); await arrived('bee', false);
      await plant('coneflower', 3); await plant('coneflower', 4); await arrived('bee', true);
      await reset();
      // Full garden with wrong mix does not grant unearned visitors.
      for (let i = 0; i < 9; i++) await plant('balm', i);
      await arrived('bee', false); await arrived('butterfly', false);
      await progress('bee', 0); await progress('balm', 2); await progress('cone', 0);
      assert.match(await page.locator('#status').textContent(), /goals are still unmet.*Reset/);
      await progress('mix', 1); await progress('welcome', 0); await progress('nine', 9);
      assert.equal(await page.locator('#challenge-count').textContent(), '1 / 3 complete');
      await reset();
      for (let i = 0; i < 9; i++) await plant('susan', i);
      await arrived('bee', true); await arrived('butterfly', false);
      await page.reload(); await progress('bee', 0);
      assert.equal(await page.locator('#counter').textContent(), '0 / 9 planted');
      assert.equal(await page.locator('#challenge-count').textContent(), '0 / 3 complete');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      assert.ok(await page.locator('button').evaluateAll(buttons => buttons.every(button => { const r = button.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; })), '44px button targets');
      if (width === 390 || width === 1280) {
        await plant('coneflower', 0); await plant('susan', 1); await plant('susan', 2); await plant('balm', 3); await plant('balm', 4);
        await page.screenshot({ path: `/tmp/pollinator-v3-${width}.png`, fullPage: true });
      }
      await page.getByRole('link', { name: 'All versions' }).click();
      await page.getByRole('link', { name: /Play version 1/ }).click();
      await page.waitForURL('**/v1/');
      assert.equal(await page.locator('.plot').count(), 9);
      assert.deepEqual(errors, []);
      console.log(`PASS v3 ${width}px: thresholds, both arrival orders, progress caps, full gardens, reset/replay, reload, ${width < 768 ? 'touch' : 'keyboard'}, layout, navigation, no page/resource errors`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
