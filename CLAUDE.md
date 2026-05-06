# CLAUDE.md — QA Lab: Cypress + JavaScript + Mochawesome

> **This file is the authoritative specification for Claude Code.**
> Read it completely before writing any test, any command, any config.
> Every architectural decision documented here has a rationale — don't override without explicit instruction.
> When in doubt — ask. Do not invent test cases. Do not add iframe tests.

**Author:** Evgenii Subbotin
**Project:** QA Lab Cross-Stack Series — Stack 4: Cypress + JavaScript
**Target:** https://subbotin.es/QA-Lab/qa-lab.html
**Stack:** Cypress · JavaScript (ES2022) · Mochawesome · GitHub Actions · GitHub Pages
**Version:** 1.0 | April 2026

---

## 1. What This Project Does

Isolated Cypress + JavaScript test framework targeting the QA Lab live environment.
Demonstrates Cypress-native patterns: custom commands, cy.session(), Mochawesome reporting, and the known constraint around iframe testing documented as an engineering decision — not hidden.

**This is portfolio artefact #4 in the Cross-Stack Series:**
```
Same target (qa-lab.html) → different stacks → comparative analysis
Stack 1: Playwright + TS
Stack 2: Pytest + Python
Stack 3: Selenium + Java + TestNG
Stack 4: Cypress + JS                ← this project
```

**Key differentiator from Stack 1 (Playwright TS):**
Cypress runs inside the browser — same event loop as the app under test.
Real-time test runner with time-travel debugging.
`cy.intercept()` for network stubbing without external mock servers.
`cy.session()` for efficient auth state caching across tests.

**⚠️ Known Limitation — IFrames:**
Cypress has architectural limitations with cross-origin iframes.
The QA Lab iframe section is intentionally **excluded** from this stack's coverage.
This is documented in Section 15 as an engineering trade-off, not concealed.
The exclusion is marked in tests with `it.skip()` and a clear comment.

**Test coverage scope:**
```
Buttons          → click states, disabled state assertion       ✅
Forms            → validation, field interaction, submit        ✅
Input Fields     → text, number, date, search, URL types       ✅
Checkboxes       → check/uncheck, disabled state               ✅
Radio Buttons    → selection, mutual exclusivity                ✅
Dropdowns        → select(), multiple selection                 ✅
Tables           → cell content, row count, edit action        ✅
Alerts/Modals    → open, confirm, cancel, dismiss               ✅
Dynamic Visibility → checkbox-triggered panel reveal           ✅
Async Buttons    → loading → success/error state transitions   ✅
IFrames          → SKIPPED — documented in Section 15          ⏭️
Drag & Drop      → cy.drag() via plugin                        ✅
Slider           → value change via trigger()                  ✅
```

---

## 2. Absolute Rules — Read Before Every Task

```
NEVER use cy.wait(number) for arbitrary delays — use cy.intercept() or retry-ability
NEVER hardcode base URLs — always use Cypress.env('BASE_URL') or cypress.config.js
NEVER use jQuery selectors ($ prefix) — use cy.get() with CSS selectors or data-cy
NEVER write assertions inside Page Object commands — return cy chains, test asserts
NEVER add iframe test cases — this is a documented known limitation (Section 15)
NEVER use synchronous code to access Cypress command values — use .then()
ALWAYS use cy.session() for state that can be reused across tests
ALWAYS use cy.intercept() to assert network calls, not arbitrary timeouts
ALWAYS write custom commands in cypress/support/commands.js — not inline in tests
ALWAYS tag smoke tests with @smoke in test title for grep filtering
ALWAYS document any cy.wait() with a comment explaining why it's necessary
KEEP page objects as plain objects with chainable cy commands — not ES6 classes
```

---

## 3. Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| Test framework | Cypress | 13.x | Browser-native, time-travel debug, cy.intercept |
| Language | JavaScript | ES2022 | Cypress-native, no TS compilation overhead for portfolio |
| Reporting | Mochawesome + merge | 7.x | Standard Cypress HTML reporter, free |
| Mocha | Built into Cypress | — | describe/it/hooks — no separate install |
| CI/CD | GitHub Actions | current | Free 2000 min/month |
| Report hosting | GitHub Pages | current | Free |
| Grep plugin | @cypress/grep | 4.x | @smoke tag filtering without testng.xml |

**No Playwright. No Jest standalone. No Allure (Mochawesome is the Cypress standard).**
Budget target: $0/month (all free tiers).

---

## 4. Repository Structure

```
qa-lab-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── buttons.cy.js
│   │   ├── forms.cy.js
│   │   ├── inputs.cy.js
│   │   ├── checkboxes.cy.js
│   │   ├── dropdowns.cy.js
│   │   ├── tables.cy.js
│   │   ├── modals.cy.js
│   │   ├── dynamic-visibility.cy.js
│   │   ├── async-buttons.cy.js
│   │   ├── iframes.cy.js               # Contains only it.skip() with documented reason
│   │   ├── drag-and-drop.cy.js
│   │   └── slider.cy.js
│   ├── support/
│   │   ├── commands.js                  # Custom cy commands
│   │   ├── e2e.js                       # Global before/after hooks
│   │   └── page-objects/
│   │       ├── buttons.js
│   │       ├── forms.js
│   │       ├── inputs.js
│   │       ├── checkboxes.js
│   │       ├── dropdowns.js
│   │       ├── tables.js
│   │       ├── modals.js
│   │       ├── dynamic-visibility.js
│   │       ├── async-buttons.js
│   │       └── drag-drop.js
│   └── fixtures/
│       └── form-data.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── cypress.config.js
├── package.json
├── .eslintrc.json
├── .env.example
└── README.md
```

---

## 5. cypress.config.js — Exact Configuration

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL ?? 'https://subbotin.es',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    retries: {
      runMode: 2,      // Retry twice in CI
      openMode: 0,     // No retry in interactive mode
    },
    video: true,
    screenshotOnRunFailure: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      overwrite: false,
      html: false,      // Generate JSON only — merge step creates HTML
      json: true,
    },
    setupNodeEvents(on, config) {
      // require('@cypress/grep/src/plugin')(config);  // uncomment if using grep plugin
      return config;
    },
  },
});
```

---

## 6. Page Object Pattern — Cypress Style

Cypress page objects are plain JS objects (not classes) that return cy chains.
No assertions inside page objects.

```javascript
// cypress/support/page-objects/forms.js

const FormsPage = {
  selectors: {
    fullNameInput: 'input[placeholder="Full Name"]',
    emailInput: 'input[type="email"]',
    ageInput: 'input[type="number"]',
    phoneInput: 'input[type="tel"]',
    registerButton: 'button:contains("Register")',
  },

  // Returns cy chain — no assertions inside
  fillForm({ fullName, email, age, phone }) {
    cy.get(this.selectors.fullNameInput).clear().type(fullName);
    cy.get(this.selectors.emailInput).first().clear().type(email);
    cy.get(this.selectors.ageInput).first().clear().type(String(age));
    cy.get(this.selectors.phoneInput).clear().type(phone);
  },

  submit() {
    cy.get(this.selectors.registerButton).click();
  },

  // Returns cy chain so tests can chain assertions
  getRegisterButton() {
    return cy.get(this.selectors.registerButton);
  },
};

module.exports = FormsPage;
```

---

## 7. Test File Pattern — With Mocha Structure

```javascript
// cypress/e2e/forms.cy.js
import FormsPage from '../support/page-objects/forms';

describe('Registration Form @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.get('#forms').scrollIntoView();
  });

  it('@smoke — should submit form with valid data', () => {
    const validData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      age: 30,
      phone: '+1234567890',
    };

    FormsPage.fillForm(validData);
    FormsPage.submit();

    // Assertion in test, not in page object
    FormsPage.getRegisterButton().should('be.visible');
  });

  it('should validate required field on empty submit', () => {
    FormsPage.submit();
    cy.get('input[placeholder="Full Name"]').should('be.focused');
  });

  it('should accept valid email formats', () => {
    const emails = ['user@example.com', 'user+tag@domain.co.uk'];
    emails.forEach((email) => {
      FormsPage.fillForm({ fullName: 'Test', email, age: 25, phone: '+1234567890' });
      cy.get('input[type="email"]').first().should('have.value', email);
    });
  });
});
```

---

## 8. IFrames — Documented Skip

```javascript
// cypress/e2e/iframes.cy.js

/**
 * IFrame tests — KNOWN LIMITATION
 *
 * Cypress has architectural constraints with cross-origin iframes:
 * - cy.origin() requires the target domain to be explicitly allow-listed
 * - Same-origin iframes work but require cy.iframe() plugin
 *
 * Decision: Skip iframe tests in this stack.
 * Reason: Playwright (Stack 1) covers iframes fully — this stack demonstrates
 *         Cypress strengths (cy.intercept, time-travel, cy.session) without
 *         fighting its known weaknesses.
 *
 * Reference: https://docs.cypress.io/guides/guides/web-security#Cross-origin-iframes
 *
 * This skip is intentional and documented — not an oversight.
 */

describe('IFrame Elements', () => {

  it.skip('SKIPPED — Cypress iframe limitation: see comment above', () => {
    // This test is intentionally skipped.
    // Full iframe coverage is available in qa-lab-playwright (Stack 1).
    // Limitation documented in CLAUDE.md Section 15.
  });

});
```

---

## 9. Custom Commands

```javascript
// cypress/support/commands.js

// Scroll to a section by anchor ID
Cypress.Commands.add('scrollToSection', (sectionId) => {
  cy.get(sectionId).scrollIntoView({ block: 'start' });
  cy.get(sectionId).should('be.visible');
});

// Wait for async button to reach a specific state
Cypress.Commands.add('waitForButtonState', (selector, expectedText) => {
  cy.get(selector).should('contain.text', expectedText);
});

// Get table row by index (1-based)
Cypress.Commands.add('getTableRow', (tableSelector, rowIndex) => {
  return cy.get(`${tableSelector} tbody tr`).eq(rowIndex - 1);
});
```

---

## 10. Mochawesome Report — Merge + Generate

Cypress generates one JSON per spec file. The merge step combines them into a single HTML.

```json
// package.json scripts
{
  "scripts": {
    "cy:run": "cypress run",
    "cy:open": "cypress open",
    "cy:smoke": "cypress run --env grep=@smoke",
    "report:merge": "mochawesome-merge cypress/reports/mochawesome/*.json > cypress/reports/report.json",
    "report:generate": "marge cypress/reports/report.json -f report -o cypress/reports/html",
    "report": "npm run cy:run; npm run report:merge; npm run report:generate",
    "lint": "eslint cypress/"
  }
}
```

---

## 11. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: QA Lab — Cypress + Mochawesome

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 11 * * 1'   # Monday 11:00 UTC

jobs:
  test:
    name: Run Cypress Tests
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run smoke tests
        run: npx cypress run --env grep=@smoke
        env:
          BASE_URL: https://subbotin.es

      - name: Run full regression
        if: github.ref == 'refs/heads/main'
        run: npx cypress run
        env:
          BASE_URL: https://subbotin.es

      - name: Merge Mochawesome reports
        if: always()
        run: npm run report:merge

      - name: Generate HTML report
        if: always()
        run: npm run report:generate

      - name: Upload report artifact
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: mochawesome-report
          path: cypress/reports/html/
          retention-days: 30

      - name: Upload videos artifact
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: cypress-videos
          path: cypress/videos/
          retention-days: 7

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main' && always()
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./cypress/reports/html
          destination_dir: mochawesome
```

---

## 12. Infrastructure Setup — Step by Step

### Step 1: Prerequisites

```bash
# Node.js 20 LTS
node --version   # 20.x required
npm --version
```

### Step 2: Install Dependencies

```bash
mkdir qa-lab-cypress && cd qa-lab-cypress
npm init -y

npm install --save-dev \
  cypress \
  mochawesome \
  mochawesome-merge \
  mochawesome-report-generator \
  @cypress/grep \
  eslint \
  eslint-plugin-cypress
```

### Step 3: package.json — Full Configuration

```json
{
  "name": "qa-lab-cypress",
  "version": "1.0.0",
  "devDependencies": {
    "cypress": "^13.0.0",
    "mochawesome": "^7.1.3",
    "mochawesome-merge": "^4.3.0",
    "mochawesome-report-generator": "^6.2.0",
    "@cypress/grep": "^4.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-cypress": "^3.0.0"
  },
  "scripts": {
    "cy:run": "cypress run",
    "cy:open": "cypress open",
    "cy:smoke": "cypress run --env grep=@smoke",
    "report:merge": "mochawesome-merge cypress/reports/mochawesome/*.json > cypress/reports/report.json",
    "report:generate": "marge cypress/reports/report.json -f report -o cypress/reports/html",
    "report": "npm run cy:run; npm run report:merge; npm run report:generate",
    "lint": "eslint cypress/"
  }
}
```

### Step 4: GitHub Repository Setup

```bash
git init
cat > .gitignore << 'EOF'
node_modules/
cypress/videos/
cypress/screenshots/
cypress/reports/
.DS_Store
.env
EOF

git add .
git commit -m "chore: initial setup — Cypress + Mochawesome"
git remote add origin https://github.com/YOUR_USERNAME/qa-lab-cypress.git
git push -u origin main
```

### Step 5: Enable GitHub Pages

```
GitHub repo → Settings → Pages
Source: Deploy from branch → gh-pages / root
Report URL: https://YOUR_USERNAME.github.io/qa-lab-cypress/mochawesome/
```

### Step 6: Verify Local Run

```bash
# Open Cypress Test Runner (interactive)
npm run cy:open

# Run smoke tests headlessly
npm run cy:smoke

# Full run + report
npm run report
open cypress/reports/html/report.html
```

---

## 13. Cypress vs Other Stacks — Portfolio Talking Point

Document in README to frame this project's purpose:

| Aspect | Cypress (Stack 4) | Playwright TS (Stack 1) |
|---|---|---|
| Architecture | Runs inside browser | Runs outside browser via CDP |
| IFrames | Problematic (see Section 15) | Full support via frameLocator |
| Network stubbing | Built-in cy.intercept() | Built-in route() / fulfill() |
| Time-travel debug | Yes — unique to Cypress | No |
| Parallelism | Via Cypress Cloud (paid) or free GitHub Actions matrix | Free fullyParallel |
| Multi-browser | Yes (Chrome, Firefox, Electron) | Yes (+ WebKit) |
| JS-only | Yes — no TypeScript required | TypeScript recommended |
| Dev experience | Best-in-class interactive runner | Best-in-class API |

---

## 14. Drag and Drop

```javascript
// cypress/e2e/drag-and-drop.cy.js
// Standard Cypress drag approach using trigger() events

describe('Drag and Drop @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.get('#drag-drop').scrollIntoView();
  });

  it('@smoke — should drag item to target zone', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-drag-item="Item Alpha"]')
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-drop-zone]')
      .trigger('drop', { dataTransfer })
      .trigger('dragend');

    cy.get('[data-drop-zone]').should('contain.text', 'Item Alpha');
  });
});
```

---

## 15. Known Limitations & Trade-offs

This section is deliberately prominent — engineering maturity means documenting constraints, not hiding them.

| Topic | Decision | Rationale |
|---|---|---|
| **IFrames** | **Intentionally skipped — it.skip() with comment** | Cypress architectural limitation with cross-origin frames. Playwright (Stack 1) covers iframes. This stack demonstrates cy.intercept(), cy.session(), and time-travel debugging — its genuine strengths. |
| Parallelism | GitHub Actions single-runner | Cypress Cloud parallelism is paid. Matrix strategy in GitHub Actions is the free alternative. |
| TypeScript | JavaScript only | Cypress supports TS but adds compilation overhead for minimal benefit in this portfolio context. |
| Mochawesome merge | Required extra step | Cypress generates per-spec JSON; merge step is mandatory for single HTML report. |
| Drag & Drop | trigger() simulation | Works for HTML5 drag events on QA Lab; may not work on all implementations. |

**IFrame decision rationale (expanded):**
The Cypress team acknowledges iframe support as a known limitation in their documentation.
Forcing iframe tests into this stack would require either:
a) a third-party plugin with maintenance risk, or
b) `cy.origin()` which requires allow-listing the target domain (not available for external domains).
The honest engineering decision is to skip this coverage in Stack 4 and direct the reader to Stack 1.
This demonstrates judgment — knowing when to use which tool is more valuable than forcing a tool to do what it was not designed for.

---

## 16. Definition of Done — Per Task

```
□ npm run lint — zero ESLint warnings
□ Test has describe() with @regression or @smoke in title
□ Test has at least one cy assertion (.should(), .contains(), etc.)
□ Page object method returns cy chain — no assertions inside
□ No cy.wait(number) without comment explaining why
□ IFrame file exists with it.skip() and documented reason (Section 8)
□ Smoke tests pass locally: npm run cy:smoke
□ Commit message: test(section-name): describe what is tested
```

---

## 17. Day-by-Day Prompts for Claude Code

### DAY 1 PROMPT — Infrastructure

```
Read CLAUDE.md Sections 12, 5 completely before starting.

Goal: Cypress installed, config complete, zero test code.

Tasks in order:
1. Verify node --version (20 required)
2. Create qa-lab-cypress directory, npm init -y
3. Install all dependencies from Section 12 Step 2
4. Create cypress.config.js (Section 5 — exact config)
5. Create package.json scripts (Section 12 Step 3)
6. Run: npx cypress open → verify Cypress opens (then close it)
7. Create directory structure: cypress/e2e/ cypress/support/page-objects/ cypress/fixtures/
8. Create cypress/support/e2e.js skeleton
9. Create cypress/support/commands.js (Section 9)
10. Create cypress/fixtures/form-data.json
11. Create .gitignore, .eslintrc.json

After completing:
- npx cypress verify → passes
- npm run lint → zero errors (no test files yet, OK)

Do NOT write any test files today.
```

---

### DAY 2 PROMPT — Page Objects

```
Read CLAUDE.md Sections 6, 14 before starting.

Goal: All page objects written as plain JS objects.

Implement in order:
1. cypress/support/page-objects/buttons.js
2. cypress/support/page-objects/forms.js — exact pattern from Section 6
3. cypress/support/page-objects/inputs.js
4. cypress/support/page-objects/checkboxes.js
5. cypress/support/page-objects/dropdowns.js
6. cypress/support/page-objects/tables.js — getRow(), getCellText()
7. cypress/support/page-objects/modals.js
8. cypress/support/page-objects/dynamic-visibility.js
9. cypress/support/page-objects/async-buttons.js
10. cypress/support/page-objects/drag-drop.js

Rule: Every method returns a cy chain or calls cy commands only.
No assertions in page objects.
```

---

### DAY 3 PROMPT — Test Files

```
Read CLAUDE.md Sections 7, 8, 15, 16 before starting.

Goal: All test files written, smoke tests pass locally.

Write in order:
1. cypress/e2e/buttons.cy.js — @smoke tag on primary button test
2. cypress/e2e/forms.cy.js — pattern from Section 7
3. cypress/e2e/inputs.cy.js
4. cypress/e2e/checkboxes.cy.js
5. cypress/e2e/dropdowns.cy.js
6. cypress/e2e/tables.cy.js
7. cypress/e2e/modals.cy.js
8. cypress/e2e/dynamic-visibility.cy.js
9. cypress/e2e/async-buttons.cy.js
10. cypress/e2e/iframes.cy.js — ONLY it.skip() with exact comment from Section 8
11. cypress/e2e/drag-and-drop.cy.js — pattern from Section 14
12. cypress/e2e/slider.cy.js

Run after each: npx cypress run --spec cypress/e2e/that-file.cy.js
All smoke tests: npm run cy:smoke
```

---

### DAY 4 PROMPT — CI + README

```
Goal: CI green, Mochawesome published to GitHub Pages, README portfolio-ready.

Tasks:
1. Create .github/workflows/ci.yml (Section 11)
2. Push, verify Actions run
3. Check Mochawesome report at GitHub Pages URL
4. Write README.md:
   - What this demonstrates (Cypress strengths, not iframe)
   - Live Mochawesome Report link
   - Stack table
   - Run locally (3 commands)
   - Cypress vs Playwright comparison (Section 13)
   - Known limitations — prominent, not buried (Section 15)
   - Cross-Stack Series links

Final checklist:
□ CI badge green
□ Mochawesome report live at GitHub Pages URL
□ iframes.cy.js contains only it.skip() — no fake passing test
□ npm run lint zero warnings in CI
```

---

## 18. Common Errors and How to Fix Them

**`cy.get() failed — not found after 10000ms`**
→ Selector doesn't match. Inspect QA Lab in browser DevTools. Try broader selector first, then narrow down. Check `defaultCommandTimeout` in config.

**`CypressError: cy.visit() failed — CORS blocked`**
→ Cypress uses `baseUrl` from config. Ensure `BASE_URL` env var is correct. The QA Lab is public — no CORS issue expected.

**`cy.wait(number)` lint error**
→ Correct — this is banned without a comment. If truly needed (e.g., animation), add `// necessary: animation completes in 300ms` comment.

**`Mochawesome: no JSON files found to merge`**
→ Test run failed before writing JSON, or `reporterOptions.json: true` missing from config. Check `cypress.config.js` reporter options match Section 5.

**`cy.origin() required for iframe`**
→ Expected — this is the documented limitation. Do not attempt to fix. Use `it.skip()` pattern from Section 8.

**`drag and drop not working`**
→ Try `trigger('dragstart')` / `trigger('drop')` pattern from Section 14. If QA Lab uses a different drag library, document the approach that works.

**`GitHub Pages shows old report`**
→ gh-pages branch not updated. Verify workflow `destination_dir` matches what Pages is configured to serve.

**`ESLint: no-unused-vars on page object import`**
→ Page object is imported but method not yet called. Add a test that uses it, or add `/* eslint-disable */` temporarily during development only.

---

## 19. Branching Strategy

```
main      → production (triggers CI + report deploy)
feat/     → new test sections
fix/      → broken test fixes
chore/    → config, dependency updates
```

Commit message format: `type(scope): description`
Examples:
- `test(forms): add empty submit validation`
- `fix(tables): update row selector after QA Lab DOM change`
- `chore(deps): bump cypress to 13.10`
- `docs(iframes): update skip comment with Cypress issue link`

---

*End of CLAUDE.md*
*Version: 1.0 | Author: Evgenii Subbotin | Project: QA Lab Cross-Stack Series — Stack 4*
*April 2026*
