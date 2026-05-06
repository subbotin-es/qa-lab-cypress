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
