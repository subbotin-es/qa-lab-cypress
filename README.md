# QA Lab — Cypress + JavaScript

![Tests](https://github.com/subbotin-es/qa-lab-cypress/actions/workflows/ci.yml/badge.svg)
[![Mochawesome Report](https://img.shields.io/badge/Mochawesome-Report-brightgreen)](https://subbotin-es.github.io/qa-lab-cypress/mochawesome/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Cypress](https://img.shields.io/badge/Cypress-13.x-04C38E)](https://www.cypress.io/)

End-to-end test suite for the [QA Lab](https://subbotin.es/QA-Lab/qa-lab.html) live UI environment, demonstrating Cypress-native patterns: Page Object Model (plain objects), `cy.intercept()` network stubbing, `cy.session()` state caching, custom commands, and Mochawesome reports published to GitHub Pages via CI. This is **Stack 4** of the Cross-Stack Series — the same target application covered by four separate frameworks for comparative analysis.

---

## Live Mochawesome Report

**[View published report →](https://subbotin-es.github.io/qa-lab-cypress/mochawesome/)**

The report includes per-spec results, pass/fail status, test duration, and failure screenshots captured by Cypress automatically on run failure.

---

## What This Demonstrates

This project showcases Cypress strengths intentionally — not a generic E2E setup:

- **Browser-native execution** — Cypress runs inside the same event loop as the application under test, enabling real-time DOM access without the CDP boundary
- **Time-travel debugging** — every command is snapshotted in the Cypress runner; step through test execution after the fact
- **`cy.intercept()`** — stub and assert network requests without external mock servers
- **`cy.session()`** — cache authentication state across tests, eliminating repeated login flows
- **Custom commands** — `cy.scrollToSection()`, `cy.waitForButtonState()`, `cy.getTableRow()` encapsulate reusable patterns
- **Plain-object Page Objects** — no ES6 classes, no constructor boilerplate; cy chains compose naturally
- **`@smoke` grep filtering** — `npm run cy:smoke` runs only tagged tests in under 60 seconds
- **Mochawesome HTML reports** — per-spec JSON merged into a single report, deployed to GitHub Pages on every push to `main`

### What is intentionally excluded

**IFrames are skipped** (`it.skip()`) — this is a documented engineering decision, not an oversight. Cypress has architectural constraints with cross-origin iframes. Stack 1 (Playwright) covers iframes fully. Forcing iframe support here would require a third-party plugin or `cy.origin()` allow-listing for an external domain — neither is appropriate for this scope. See the [Known Limitations](#known-limitations) section.

---

## Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| Test framework | Cypress | 13.x | Browser-native, time-travel debug, `cy.intercept` |
| Language | JavaScript | ES2022 | Cypress-native, no TS compilation overhead |
| Reporting | Mochawesome + merge | 7.x | Standard Cypress HTML reporter, free |
| CI/CD | GitHub Actions | current | Free 2000 min/month |
| Report hosting | GitHub Pages | current | Free |
| Grep plugin | @cypress/grep | 4.x | `@smoke` tag filtering |

---

## Run Locally

```bash
npm ci
npm run cy:smoke          # smoke suite only (~60s)
npm run cy:open           # interactive Cypress Test Runner
```

Full run with Mochawesome report:

```bash
npm run report
open cypress/reports/html/report.html
```

---

## Coverage

| Section | Tests | @smoke | Notes |
|---|---|---|---|
| Buttons | 6 | 2 | click states, disabled assertion |
| Registration Form | 5 | 2 | validation, submit, feedback message |
| Input Fields | 6 | 2 | text, number, date, search, URL types |
| Checkboxes & Radio Buttons | 6 | 2 | check/uncheck, disabled, mutual exclusivity |
| Dropdowns | 5 | 2 | single select, multiple select |
| Tables | 6 | 2 | cell content, row count, Edit action |
| Alerts & Modals | 6 | 3 | open, confirm, cancel, close, alert banners |
| Dynamic Visibility | 4 | 2 | checkbox-triggered panel reveal, counter |
| Async Button States | 4 | 2 | loading → success/error transitions |
| IFrames | — | — | `it.skip()` — see Known Limitations |
| Drag & Drop | 5 | 2 | HTML5 drag events via `trigger()` |
| Slider | 4 | 1 | value change via `invoke('val').trigger('input')` |
| **Total** | **57** | **22** | |

---

## Architecture

```
cypress/
  e2e/             — one spec file per UI section
  support/
    commands.js    — custom cy commands (scrollToSection, waitForButtonState, getTableRow)
    e2e.js         — global hooks entry point
    page-objects/  — plain JS objects, selectors + cy actions, no assertions
  fixtures/
    form-data.json — shared test data
cypress.config.js  — baseUrl, reporter config, retry strategy
eslint.config.js   — ESLint 9 flat config with eslint-plugin-cypress
```

Key constraints enforced throughout:

- No `cy.wait(number)` — all waiting via Cypress retry-ability and `.should()` assertions
- No assertions inside Page Objects — objects expose cy commands and return cy chains only
- Page Objects as plain objects, not ES6 classes — no `new`, no constructor
- `npm run lint` is zero-error gated in CI before tests run
- `@smoke` tests can run in isolation via `npm run cy:smoke`

---

## Cypress vs Playwright

This project sits alongside the Playwright stack (Stack 1) targeting the same application. The comparison is a deliberate portfolio talking point:

| Aspect | Cypress (this project) | Playwright (Stack 1) |
|---|---|---|
| Architecture | Runs inside browser — same event loop as app | Runs outside browser via Chrome DevTools Protocol |
| IFrames | Architectural limitation — `cy.origin()` requires allow-listing | Full support via `frameLocator()` |
| Network stubbing | Built-in `cy.intercept()` | Built-in `route()` / `fulfill()` |
| Time-travel debug | Yes — unique to Cypress | No |
| Parallelism | Cypress Cloud (paid) or GitHub Actions matrix | Free `fullyParallel` |
| Multi-browser | Chrome, Firefox, Electron | Chromium, Firefox, WebKit |
| Language | JavaScript (no TS required) | TypeScript recommended |
| Reporting | Mochawesome (free) | Allure (free) |
| Dev experience | Best-in-class interactive runner | Best-in-class API |

**Verdict:** Neither is universally better. Cypress wins on developer experience and time-travel debugging. Playwright wins on cross-browser parity, iframe support, and parallelism without a paid service. This series demonstrates both strengths honestly.

---

## Known Limitations

These are documented prominently — engineering maturity means naming constraints, not hiding them.

| Topic | Decision | Rationale |
|---|---|---|
| **IFrames** | **`it.skip()` with comment — intentionally excluded** | Cypress architectural limitation with cross-origin frames. `cy.origin()` requires allow-listing the target domain, which is not available for the QA Lab's external iframe. Stack 1 (Playwright) covers iframes. This stack demonstrates Cypress strengths instead of fighting its weaknesses. |
| Parallelism | GitHub Actions single-runner | Cypress Cloud parallelism is paid. GitHub Actions matrix strategy is the free alternative. |
| TypeScript | JavaScript only | Cypress supports TS but adds compilation overhead for minimal benefit in this portfolio context. |
| Mochawesome merge | Required extra step | Cypress generates one JSON per spec file; `mochawesome-merge` combines them before `marge` generates HTML. |
| Drag & Drop | `trigger()` simulation | Works for HTML5 drag events on QA Lab. May not work on implementations using mouse-event-based drag libraries. |
| Slider | `invoke('val').trigger('input')` | Cypress `.type()` does not work on `input[type=range]`; direct value injection + event dispatch is the correct approach. |

---

## CI Pipeline

```
push / PR to main
  └─ npm ci
  └─ eslint (zero errors required)
  └─ cypress run --env grep=@smoke   (smoke gate)
  └─ cypress run                     (full regression, main branch only)
  └─ mochawesome-merge + marge       (always, even on failure)
  └─ upload artifact (30-day retention)
  └─ upload videos (on failure only, 7-day retention)
  └─ deploy to gh-pages → /mochawesome/   (main branch only)
```

Weekly regression runs every Monday at 11:00 UTC.

---

## Cross-Stack Series

This project is **Stack 4** of five parallel implementations targeting the same QA Lab UI.  
Testing playground: [https://subbotin.es/QA-Lab/qa-lab.html](https://subbotin.es/QA-Lab/qa-lab.html)

| Stack | Framework | Repo |
|---|---|---|
| 1 | Playwright + TypeScript + Allure | [qa-lab-playwright](https://github.com/subbotin-es/qa-lab-playwright) |
| 2 | Pytest + Python + Allure | [qa-lab-pytest-python](https://github.com/subbotin-es/qa-lab-pytest-python) |
| 3 | Selenium + Java + TestNG | [qa-lab-selenium-java](https://github.com/subbotin-es/qa-lab-selenium-java) |
| 4 | **Cypress + JavaScript + Mochawesome** ← this project | [qa-lab-cypress](https://github.com/subbotin-es/qa-lab-cypress) |
| 5 | Playwright + C# + NUnit | [qa-lab-playwright-csharp](https://github.com/subbotin-es/qa-lab-playwright-csharp) |

The series is designed for comparative analysis: same target, same UI sections, different toolchains. Each project documents its own trade-offs and known limitations.

---

*Author: [Evgenii Subbotin](https://subbotin.es) · QA Lab Cross-Stack Series · Stack 4*
