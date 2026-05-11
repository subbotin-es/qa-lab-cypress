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

## HTTP vs Browser metrics

| Metric               | HTTP scenario | Browser scenario |
|----------------------|---------------|-----------------|
| DNS resolution       | ✅            | ✅              |
| TCP handshake        | ✅            | ✅              |
| TLS negotiation      | ✅            | ✅              |
| Server response      | ✅            | ✅              |
| HTML parsing         | ❌            | ✅              |
| CSS processing       | ❌            | ✅              |
| JavaScript execution | ❌            | ✅              |
| Layout / render      | ❌            | ✅              |
| Async state transitions | ❌         | ✅              |
| RAM per VU           | ~1MB          | ~150MB          |
| Max practical VU (CI)| 50+           | 3–5             |

*HTTP load = what the server experiences. Browser load = what the user experiences.*

## Why Artillery here

Artillery is JS/YAML native — same ecosystem as Cypress.
The Playwright plugin adds browser-level load capability that no other
tool in this performance series provides. This closes the Cypress ecosystem
symmetry and adds a unique measurement class.

## Known limitations

- IFrame scenarios excluded — consistent with Cypress stack documented limitation
- Max 3 concurrent browser instances in CI — Chromium RAM constraint
- CDN target does not degrade under portfolio-scale load — SLO compliance only
- `artillery report` HTML generation is deprecated in Artillery 2.x — results are saved as JSON artifacts in CI. Use Artillery Cloud (https://app.artillery.io) for visual reports.
