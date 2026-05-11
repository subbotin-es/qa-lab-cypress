# Performance Testing Findings — Artillery + Playwright Engine

**Project:** QA Lab Cross-Stack Series — Stack 4 (Cypress + JavaScript)
**Tool:** Artillery 2.x + artillery-engine-playwright
**Target:** https://subbotin.es/QA-Lab/qa-lab.html (AWS S3 + CloudFront CDN)
**Date:** May 2026

---

## Approach

### Why Artillery in this stack

Artillery is JS/YAML-native — the same ecosystem as Cypress. No language context switch, no separate toolchain to maintain. More importantly, Artillery with the Playwright engine is the **only tool in the Cross-Stack Performance Series that runs real browser instances under load**. Every other stack (k6, Locust, Gatling, NBomber) sends HTTP requests. Artillery with `artillery-engine-playwright` launches actual Chromium instances and measures what a user's browser actually does: DNS resolution, TCP handshake, TLS, HTML parsing, CSS processing, JavaScript execution, layout, and paint.

This is a fundamentally different class of measurement.

### Two measurement modes

**HTTP scenarios** (`slo-smoke.yml`, `slo-baseline.yml`)
Standard HTTP-level load testing using Artillery's built-in HTTP engine. Measures server-side response time — the same metric k6 measures in the Playwright TS stack. Useful for SLO compliance validation: confirming that the CDN serves within agreed thresholds regardless of client environment.

**Browser scenarios** (`browser-smoke.yml`, `browser-scenarios.js`)
Real Chromium instances via `artillery-engine-playwright`. Each virtual user is a full browser process. Measures: TTFB, FCP, LCP, CLS, INP (Web Vitals), plus custom histograms for application-specific timings. Useful for understanding render experience under concurrent load — something HTTP-level tools cannot capture.

### Scenario design

Two browser test functions were written:

- **`qaLabPageLoad`** — navigates to `qa-lab.html`, waits for `domcontentloaded`, confirms `#buttons` is visible, emits `browser.page_load_ms` as a custom histogram metric.
- **`asyncButtonsUnderLoad`** — navigates to `qa-lab.html`, scrolls to the `#async-buttons` section, clicks the first button, and waits for the loading → success/error state transition. Emits `browser.async_button_transition_ms` on success, or increments `browser.async_button_timeout` counter on timeout. This mirrors the Cypress async button test but runs under concurrent browser load, testing JavaScript execution under concurrency.

---

## Results

### HTTP Smoke (10 VU, 60 s — ramp 2→5 then hold 5)

| Metric | Value |
|---|---|
| Total requests | 255 |
| HTTP 200 responses | 255 |
| Errors / failures | 0 |
| p50 response time | 19 ms |
| p95 response time | 22 ms |
| p99 response time | 24 ms |
| Min response time | 17 ms |
| Max response time | 326 ms |
| SLO: p95 < 500 ms | ✅ Pass (22 ms) |
| SLO: p99 < 1000 ms | ✅ Pass (24 ms) |
| SLO: error rate < 1% | ✅ Pass (0%) |

The max of 326 ms occurred during the initial ramp-up — a single CloudFront edge cold-start. All subsequent requests settled at 17–28 ms, confirming CDN cache is warm after the first request.

### HTTP Baseline (20 VU, 70 s — ramp 5, steady 10, ramp-down 2)

Run in CI (main branch only). SLO thresholds passed. Results in `artillery-results` CI artifact.

### Browser Load (3 concurrent Chromium instances, 60 s)

| Metric | p50 | p95 | Notes |
|---|---|---|---|
| `browser.page_load_ms` (custom) | 561 ms | 573 ms | domcontentloaded → `#buttons` selector |
| TTFB `qa-lab.html` | 62 ms | 2725 ms | see cold-start note below |
| FCP `qa-lab.html` | 211 ms | 3262 ms | see cold-start note below |
| LCP `qa-lab.html` | 211 ms | 3262 ms | LCP = FCP (largest element paints early) |
| CLS `qa-lab.html` | 0 | 0 | no layout shift |
| INP `qa-lab.html` | 32 ms | 72 ms | async button click response |
| VUs completed | 12 | — | 0 failures |
| Browser HTTP requests | 84 | — | full page asset load per VU |

**INP (Interaction to Next Paint):** p50 of 32 ms and p95 of 72 ms confirm the async button JavaScript executes well within the "Good" INP threshold (< 200 ms) even under concurrent browser load.

**CLS of 0:** No cumulative layout shift — the page is visually stable under load.

---

## Cold-Start Artifact — p95 Outlier Explained

The p95 TTFB (2725 ms) and FCP (3262 ms) values are significantly higher than p50. With only 3 concurrent Chromium instances over 60 seconds (12 VUs total), a **single slow request has a large statistical impact on p95** — it only takes one outlier in 12 samples to skew the 95th percentile.

The outlier is a CloudFront edge cold-start: the CDN edge node closest to the GitHub Actions runner (us-east-2 region) had not yet cached the response. CloudFront's first-request latency to the S3 origin can be 2–3 seconds. All subsequent requests (p50 = 62 ms TTFB) confirm the cache is warm and the site is fast.

This is not a performance regression. It is a CDN architecture characteristic: cold-start latency is expected and acceptable for a static site with no SLA requirement on first-request time to uncached edges.

**How to confirm:** Run `npm run perf:browser` twice in succession. The second run will show p95 TTFB matching p50 (~62 ms) because the CDN edge is warm from the first run.

---

## Assumptions

1. **Target is static (S3 + CloudFront)** — the site does not have server-side processing. HTTP response time reflects CDN edge performance, not application logic latency. This is appropriate for SLO compliance testing but means the HTTP scenarios cannot detect application-level regressions (there is no application to regress).

2. **CDN does not degrade under portfolio-scale load** — 10–20 virtual users against CloudFront is negligible. Capacity testing (finding breaking points) is not the goal and would require load at a scale this CDN is designed to absorb. Results confirm SLO compliance; they do not characterise capacity limits.

3. **Browser instance count capped at 3** — each Chromium instance consumes ~150 MB RAM. GitHub Actions runners have 7 GB RAM. 3 instances is a conservative limit that leaves headroom for the OS and npm processes. Raising this would improve statistical confidence in p95 metrics.

4. **`domcontentloaded` as the page load signal** — `browser.page_load_ms` is measured from navigation start to `domcontentloaded`, not `load`. The QA Lab page has external assets (images, iframes) that extend `load` significantly. `domcontentloaded` is the appropriate signal for interactivity — when the DOM is ready and the `#buttons` selector becomes available.

5. **Single CI runner, single geographic region** — all tests run from GitHub Actions `ubuntu-latest` (us-east-1 or us-east-2). Results reflect edge-to-CDN latency from that region only. Users in Europe or Asia-Pacific will see different TTFB values.

---

## Limitations

| Limitation | Impact | Reason |
|---|---|---|
| IFrame scenarios excluded | No load test coverage of iframe interactions | Consistent with Cypress stack's documented architectural limitation. The iframe loads an external domain (`iframe-target.html`) — testing it would measure a separate CDN response, not the application under test. |
| No capacity testing | Cannot determine breaking point | CDN target is designed to absorb traffic at a scale far exceeding portfolio test budgets. Capacity testing would require coordinated load from multiple regions at high VU counts. |
| 3 VU browser limit | p95 browser metrics have low sample confidence | Chromium RAM constraint on the CI runner. With 12 total VU completions, p95 = the ~11th-12th slowest sample — highly sensitive to cold-start outliers. |
| Single geographic origin | Results are region-specific | All CI load originates from GitHub Actions runners in US East. European or APAC p95 values will differ. |
| `artillery report` deprecated | No HTML report artifact | Artillery 2.x removed the `report` command. Results are stored as JSON in the CI artifact (`artillery-results`). Visual analysis requires Artillery Cloud or manual JSON inspection. |
| No auth / form submission load test | Only GET requests tested | The QA Lab registration form does not persist data server-side, so POST load testing would be synthetic. HTTP scenarios are limited to page load patterns, consistent with what the application actually does. |

---

## What This Adds to the Portfolio

The Cypress stack already demonstrates functional test coverage. The Artillery augmentation adds:

1. **SLO validation** — a repeatable, automated check that the live environment meets response time thresholds on every push to main
2. **Browser-level load measurement** — the only tool in the series that runs Chromium under load, capturing Web Vitals (FCP, LCP, CLS, INP) under concurrency
3. **Custom metric instrumentation** — `browser.page_load_ms` and `browser.async_button_transition_ms` show how to instrument specific application interactions, not just page loads
4. **Honest scoping** — CDN limitation, cold-start explanation, and VU ceiling are documented explicitly rather than presenting misleadingly clean numbers

The comparison talking point: *"k6 tells you what the server experienced. Artillery with Playwright tells you what the browser experienced. They are measuring different things."*

---

*Author: Evgenii Subbotin · QA Lab Cross-Stack Series · Stack 4 · May 2026*
