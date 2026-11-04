// Run with Node.js and Playwright installed; serve the repository first.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 768, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(base + '/');
      await page.getByRole('link', { name: /Play version 1/ }).click();
      await page.waitForURL('**/v1/');
      assert.equal(await page.locator('.plot').count(), 9);
      assert.equal(await page.locator('.flower-choice[aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('#visitor').isVisible(), false);
      const names = ['coneflower', 'susan', 'balm'];
      for (let i = 0; i < 9; i++) {
        await page.locator(`[data-flower="${names[i % 3]}"]`).click();
        const plot = page.locator('.plot').nth(i);
        // Use touch on mobile and keyboard activation on desktop.
        if (width >= 768) { await plot.focus(); await page.keyboard.press(i % 2 ? 'Space' : 'Enter'); }
        else { await plot.click(); }
        assert.equal(await plot.getAttribute('data-planted'), names[i % 3]);
        assert.equal(await page.locator('#counter').textContent(), `${i + 1} / 9 planted`);
        assert.equal(await page.locator('#visitor').isVisible(), i === 8);
      }
      // A filled plot cannot be overwritten or counted twice.
      await page.locator('.plot').first().evaluate(button => button.click());
      assert.equal(await page.locator('#counter').textContent(), '9 / 9 planted');
      assert.equal(await page.locator('.plot').first().getAttribute('data-planted'), 'coneflower');
      await page.getByRole('button', { name: 'Reset garden' }).click();
      assert.equal(await page.locator('[data-planted]').count(), 0);
      assert.equal(await page.locator('#visitor').isVisible(), false);
      assert.equal(await page.locator('#counter').textContent(), '0 / 9 planted');
      await page.locator('.plot').first().click();
      assert.equal(await page.locator('.plot').first().getAttribute('data-planted'), 'balm');
      await page.reload();
      assert.equal(await page.locator('#counter').textContent(), '0 / 9 planted');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      const targets = await page.locator('button').evaluateAll(buttons => buttons.map(button => ({w: button.getBoundingClientRect().width, h: button.getBoundingClientRect().height})));
      assert.ok(targets.every(target => target.w >= 44 && target.h >= 44), 'Buttons meet 44px target size');
      await page.getByRole('link', { name: 'All versions' }).click();
      await page.getByRole('link', { name: 'Read the change log' }).waitFor();
      assert.deepEqual(errors, []);
      console.log(`PASS: ${width}px — navigation, planting, completion, reset, replay, reload, keyboard (desktop), layout, console/network`);
      if (width === 390) {
        await page.goto(base + '/v1/');
        await page.screenshot({ path: '/tmp/pollinator-v1-mobile.png', fullPage: true });
      }
      await page.close();
    }
    const touchPage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await touchPage.goto(base + '/v1/');
    await touchPage.locator('[data-flower="susan"]').tap();
    await touchPage.locator('.plot').first().tap();
    assert.equal(await touchPage.locator('.plot').first().getAttribute('data-planted'), 'susan');
    console.log('PASS: mobile touch selection and planting');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
