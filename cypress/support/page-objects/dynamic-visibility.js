// cypress/support/page-objects/dynamic-visibility.js

const DynamicVisibilityPage = {
  selectors: {
    toggleCheckbox: '#show-secret-panel',
    secretPanel:    '#secret-panel',
    secretButton:   '#secret-btn',
    secretText:     '#secret-text',
    counter:        '#secret-counter',
  },

  toggle() {
    cy.get(this.selectors.toggleCheckbox).click();
  },

  clickSecretButton() {
    cy.get(this.selectors.secretButton).click();
  },

  getToggleCheckbox() {
    return cy.get(this.selectors.toggleCheckbox);
  },

  getSecretPanel() {
    return cy.get(this.selectors.secretPanel);
  },

  getSecretText() {
    return cy.get(this.selectors.secretText);
  },

  getCounter() {
    return cy.get(this.selectors.counter);
  },
};

module.exports = DynamicVisibilityPage;
