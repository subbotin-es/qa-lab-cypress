// performance/artillery/browser/browser-scenarios.js

/**
 * Browser scenario functions for Artillery + Playwright plugin.
 * These run inside real Chromium instances — measuring render experience,
 * not just HTTP response time.
 *
 * Key difference from HTTP scenarios:
 * - Measures: DNS + TCP + TLS + HTML parse + CSS + JS execution + render
 * - HTTP scenarios measure: DNS + TCP + TLS + server response time only
 */

/**
 * Full QA Lab page load — measures browser render time
 */
async function qaLabPageLoad(page, userVars, events) {
  // Navigate and wait for full page load
  const startTime = Date.now();

  await page.goto('https://subbotin.es/QA-Lab/qa-lab.html', {
    waitUntil: 'domcontentloaded',
  });

  // Verify page content loaded (consistent with Cypress test assertions)
  await page.waitForSelector('#buttons', { timeout: 10000 });

  const loadTime = Date.now() - startTime;

  // Emit custom metric — visible in Artillery report
  events.emit('histogram', 'browser.page_load_ms', loadTime);

  // Think time — browsers need breathing room
  await page.waitForTimeout(2000);
}

/**
 * Async buttons under concurrent browser load
 * Tests JS execution under concurrency — unique to browser-level testing
 * Note: does NOT test iframes — consistent with Cypress stack limitation
 */
async function asyncButtonsUnderLoad(page, userVars, events) {
  await page.goto('https://subbotin.es/QA-Lab/qa-lab.html', {
    waitUntil: 'domcontentloaded',
  });

  // Scroll to async buttons section
  await page.locator('#async-buttons').scrollIntoViewIfNeeded();

  // Click submit order button — triggers loading → success/error cycle
  const submitBtn = page.locator('#async-buttons button').first();
  await submitBtn.click();

  const startTime = Date.now();

  // Wait for state transition — same pattern as Cypress tests
  try {
    await page.waitForFunction(
      () => {
        const btn = document.querySelector('#async-buttons button');
        return btn && (
          btn.textContent.includes('Success') ||
          btn.textContent.includes('Error')
        );
      },
      { timeout: 10000 }
    );

    const transitionTime = Date.now() - startTime;
    events.emit('histogram', 'browser.async_button_transition_ms', transitionTime);
  } catch {
    events.emit('counter', 'browser.async_button_timeout', 1);
  }

  await page.waitForTimeout(1000);
}

module.exports = { qaLabPageLoad, asyncButtonsUnderLoad };
