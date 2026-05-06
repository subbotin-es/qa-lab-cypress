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
