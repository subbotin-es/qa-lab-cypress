# CLAUDE.md — Performance / Artillery (Embedded)
# File location: qa-lab-cypress/performance/CLAUDE.md

> **This file is the authoritative specification for Claude Code.**
> Read it completely before writing any script, any config, any CI step.
> This is an augmentation of the existing Cypress + JavaScript framework — not a standalone project.
> When in doubt — ask. Do not invent scenarios. Do not add npm packages outside this spec.

**Author:** Evgenii Subbotin
**Parent project:** qa-lab-cypress (Stack 4 — Cross-Stack Series)
**Performance tool:** Artillery + @artillery/plugin-playwright
**Target:** https://subbotin.es/QA-Lab/qa-lab.html (S3 + CloudFront)
**Language:** JavaScript / YAML — natively consistent with the Cypress ecosystem of this repo
**Version:** 1.0 | May 2026

---

## 1. What This Augmentation Does

Adds performance testing to the existing Cypress + JavaScript framework using Artillery —
the only tool in the entire performance series that supports **browser-level load testing**
via `@artillery/plugin-playwright`. This is not just HTTP-level SLO compliance (like k6) —
this is real Chromium instances under concurrent load, measuring what users actually experience.

**This closes the Cypress ecosystem symmetry and adds a unique capability:**

```
Playwright TS  → k6           HTTP load, JS-native
Pytest Python  → Locust       HTTP load, Python-native
Selenium Java  → Gatling      HTTP load, Java-native
Playwright C#  → NBomber      HTTP load, .NET-native
Cypress JS     → Artillery    Browser-level load, JS-native  ← unique in series
```

**Narrative for portfolio / interviews:**
> "Artillery lives in the Cypress repo because it's JS-native — same ecosystem,
> same pipeline, no context switch. But the more interesting point is that Artillery
> with the Playwright plugin is the only tool in my performance series that runs
> real browser instances under load — not HTTP requests, but actual Chromium.
> That's a different class of measurement: render time, JS execution, layout shifts
> under concurrency. No other tool in the series does this."

**What this tests:**
```
✅ HTTP SLO compliance (YAML scenarios — same as k6 but YAML-native)
✅ Browser-level load via @artillery/plugin-playwright
✅ Real Chromium instances under concurrent load
✅ Page render time, not just HTTP response time
✅ JS execution under concurrency (relevant for QA Lab's async buttons)
✅ Artillery HTML report as CI artifact
❌ Capacity testing — CDN target does not degrade
❌ iframe scenarios — consistent with Cypress stack's known limitation
```

**Honest scope note:**
The target is S3 + CloudFront — it does not degrade under portfolio-scale load.
HTTP scenarios measure SLO compliance. Browser scenarios measure render experience.
Both are documented honestly — no fake capacity claims.

---

## 2. Absolute Rules

```
NEVER use require() — use ES module imports in JS processor files
NEVER exceed 10 concurrent browser instances in CI — Chromium is RAM-heavy
NEVER exceed 30 virtual users for HTTP scenarios in CI
NEVER add npm packages outside the approved list in Section 3
NEVER test iframe scenarios — consistent with Cypress stack documented limitation
ALWAYS use think time between browser actions — browsers need breathing room
ALWAYS document browser vs HTTP distinction in README — they measure different things
ALWAYS keep Artillery configs in performance/artillery/ — never mix with Cypress tests
ALWAYS run npm run perf:smoke locally before pushing
ALWAYS document CDN limitation — no fake capacity claims
```

---

## 3. Tech Stack + npm Packages

| Layer | Technology | Version | Why |
|---|---|---|---|
| Load tool | Artillery | 2.0+ | JS/YAML native, browser plugin, CI-ready |
| Browser plugin | @artillery/plugin-playwright | 2.0+ | Real Chromium under load — unique capability |
| Language | JavaScript | ES2022 | Native to this repo's ecosystem |
| Report | Artillery HTML report | built-in | `--output report.json` + `artillery report` |
| CI | GitHub Actions | current | Existing pipeline — add one job |

**Add to `package.json` devDependencies in parent repo:**
```json
"artillery": "^2.0.0",
"@artillery/plugin-playwright": "^2.0.0"
```

**Install:**
```bash
npm install --save-dev artillery @artillery/plugin-playwright
npx playwright install chromium   # already installed in parent repo
```

---

## 4. Directory Structure

```
qa-lab-cypress/              ← existing repo root
└── performance/
    └── artillery/
        ├── http/
        │   ├── slo-smoke.yml         # HTTP: 10 VU, 30s — SLO compliance
        │   └── slo-baseline.yml      # HTTP: 20 VU, 60s — baseline
        ├── browser/
        │   ├── browser-smoke.yml     # Browser: 3 instances, real Chromium
        │   └── browser-scenarios.js  # Playwright scenario functions
        └── README.md
```

---

## 5. HTTP Scenarios — YAML Config

### slo-smoke.yml
```yaml
# performance/artillery/http/slo-smoke.yml
config:
  target: "https://subbotin.es"
  phases:
    - duration: 30
      arrivalRate: 2
      rampTo: 5
      name: "Ramp up"
    - duration: 30
      arrivalRate: 5
      name: "Hold"
  defaults:
    headers:
      Accept: "text/html"
  ensure:
    p95: 500
    p99: 1000
    maxErrorRate: 1

scenarios:
  - name: "QA Lab page load"
    weight: 70
    flow:
      - get:
          url: "/QA-Lab/qa-lab.html"
          expect:
            - statusCode: 200
      - think: 1

  - name: "QA Lab index"
    weight: 30
    flow:
      - get:
          url: "/QA-Lab/index.html"
          expect:
            - statusCode: 200
      - think: 1
```

### slo-baseline.yml
```yaml
# performance/artillery/http/slo-baseline.yml
config:
  target: "https://subbotin.es"
  phases:
    - duration: 20
      arrivalRate: 5
      name: "Ramp up"
    - duration: 40
      arrivalRate: 10
      name: "Steady state"
    - duration: 10
      arrivalRate: 2
      name: "Ramp down"
  ensure:
    p95: 500
    p99: 1000
    maxErrorRate: 1

scenarios:
  - name: "QA Lab pages"
    flow:
      - get:
          url: "/QA-Lab/qa-lab.html"
          expect:
            - statusCode: 200
      - think: 1
      - get:
          url: "/QA-Lab/index.html"
          expect:
            - statusCode: 200
      - think: 1
```

---

## 6. Browser Scenarios — Playwright Plugin

### browser-smoke.yml
```yaml
# performance/artillery/browser/browser-smoke.yml
config:
  target: "https://subbotin.es"
  # Browser plugin — real Chromium instances
  plugins:
    playwright:
      launchOptions:
        headless: true
        args:
          - "--no-sandbox"
          - "--disable-dev-shm-usage"
  phases:
    - duration: 60
      arrivalRate: 1
      maxVusers: 3    # Max 3 concurrent Chromium instances — RAM constraint
      name: "Browser load"
  processor: "./browser-scenarios.js"

scenarios:
  - name: "QA Lab browser experience"
    engine: playwright
    testFunction: "qaLabPageLoad"

  - name: "QA Lab async buttons under concurrency"
    engine: playwright
    testFunction: "asyncButtonsUnderLoad"
```

### browser-scenarios.js
```javascript
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
```

---

## 7. package.json Scripts — Add to Parent

```json
{
  "scripts": {
    "perf:smoke": "artillery run performance/artillery/http/slo-smoke.yml --output performance/artillery/results/smoke.json && artillery report performance/artillery/results/smoke.json --output performance/artillery/results/smoke.html",
    "perf:baseline": "artillery run performance/artillery/http/slo-baseline.yml --output performance/artillery/results/baseline.json && artillery report performance/artillery/results/baseline.json --output performance/artillery/results/baseline.html",
    "perf:browser": "artillery run performance/artillery/browser/browser-smoke.yml --output performance/artillery/results/browser.json && artillery report performance/artillery/results/browser.json --output performance/artillery/results/browser.html"
  }
}
```

---

## 8. CI Integration — Add to Existing Pipeline

Add a new job to `.github/workflows/ci.yml` in the parent repo.
Do NOT modify existing Cypress jobs.

```yaml
  performance:
    name: Artillery SLO + Browser Load
    runs-on: ubuntu-latest
    needs: test          # run after Cypress tests pass
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers (for browser scenarios)
        run: npx playwright install --with-deps chromium

      - name: Run HTTP smoke test
        run: npm run perf:smoke

      - name: Run HTTP baseline (main only)
        if: github.ref == 'refs/heads/main'
        run: npm run perf:baseline

      - name: Run browser load test (main only)
        if: github.ref == 'refs/heads/main'
        run: npm run perf:browser

      - name: Upload Artillery reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: artillery-reports
          path: performance/artillery/results/
          retention-days: 14
```

---

## 9. Infrastructure Setup — Step by Step

### Step 1: Add packages to parent repo

```bash
# From qa-lab-cypress repo root
npm install --save-dev artillery @artillery/plugin-playwright
```

### Step 2: Verify Playwright browsers already installed

```bash
# Should already be installed from Cypress setup
npx playwright install chromium
```

### Step 3: Create directory structure

```bash
mkdir -p performance/artillery/http
mkdir -p performance/artillery/browser
mkdir -p performance/artillery/results
```

### Step 4: Add results to .gitignore

```bash
echo "performance/artillery/results/" >> .gitignore
```

### Step 5: Create files per Sections 5, 6, 7

### Step 6: Run locally

```bash
# HTTP smoke
npm run perf:smoke

# Browser scenarios (opens real Chromium headlessly)
npm run perf:browser

# Verify report HTML generated
open performance/artillery/results/smoke.html
open performance/artillery/results/browser.html
```

---

## 10. README.md for performance/artillery/

```markdown
# QA Lab — Artillery Performance Tests

HTTP SLO compliance + browser-level load testing for the QA Lab static site.

## Two measurement modes

### HTTP scenarios (slo-smoke.yml, slo-baseline.yml)
Standard HTTP-level load testing. Measures server response time.
Same target, same SLO thresholds as k6 in the Playwright TS stack.
Different tool, same ecosystem principle: JS-native.

### Browser scenarios (browser-smoke.yml)
Real Chromium instances under concurrent load via @artillery/plugin-playwright.
Measures what users actually experience: DNS + TCP + TLS + HTML parse +
CSS + JS execution + render. No other tool in the Cross-Stack Performance
Series does this.

Custom metrics:
- browser.page_load_ms — full render time per virtual user
- browser.async_button_transition_ms — JS state machine under concurrency

## Run locally

    npm run perf:smoke      # HTTP smoke
    npm run perf:baseline   # HTTP baseline
    npm run perf:browser    # Browser load (real Chromium)

## Why Artillery here

Artillery is JS/YAML native — same ecosystem as Cypress.
The Playwright plugin adds browser-level load capability that no other
tool in this performance series provides. This closes the Cypress ecosystem
symmetry and adds a unique measurement class.

## Known limitations

- IFrame scenarios excluded — consistent with Cypress stack documented limitation
- Max 3 concurrent browser instances in CI — Chromium RAM constraint
- CDN target does not degrade under portfolio-scale load — SLO compliance only
```

---

## 11. HTTP vs Browser Metrics — Portfolio Talking Point

Document in README to frame the unique value:

| Metric | HTTP scenario | Browser scenario |
|---|---|---|
| DNS resolution | ✅ | ✅ |
| TCP handshake | ✅ | ✅ |
| TLS negotiation | ✅ | ✅ |
| Server response | ✅ | ✅ |
| HTML parsing | ❌ | ✅ |
| CSS processing | ❌ | ✅ |
| JavaScript execution | ❌ | ✅ |
| Layout / render | ❌ | ✅ |
| Async state transitions | ❌ | ✅ |
| RAM per VU | ~1MB | ~150MB |
| Max practical VU (CI) | 50+ | 3–5 |

*HTTP load = what the server experiences. Browser load = what the user experiences.*

---

## 12. Definition of Done

```
□ npm install succeeds with artillery and @artillery/plugin-playwright
□ npm run perf:smoke runs locally — HTTP report generated
□ npm run perf:browser runs locally — real Chromium visible in process list
□ browser-scenarios.js exports qaLabPageLoad and asyncButtonsUnderLoad
□ Artillery reports contain browser.page_load_ms custom metric
□ performance/artillery/README.md written — HTTP vs browser distinction explained
□ CI job added — does not break existing Cypress jobs
□ results/ directory is git-ignored
□ Commit message: perf(artillery): add HTTP SLO + browser load tests for QA Lab
```

---

*End of CLAUDE.md*
*Version: 1.0 | Author: Evgenii Subbotin | Augmentation: Artillery → qa-lab-cypress*
*May 2026*
