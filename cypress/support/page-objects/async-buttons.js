// cypress/support/page-objects/async-buttons.js

const AsyncButtonsPage = {
  selectors: {
    submitButton: '#btn-async-success',
    deleteButton: '#btn-async-error',
    resetButton:  '#btn-async-reset',
    statusText:   '#async-status',
  },

  clickSubmit() {
    cy.get(this.selectors.submitButton).click();
  },

  clickDelete() {
    cy.get(this.selectors.deleteButton).click();
  },

  clickReset() {
    cy.get(this.selectors.resetButton).click();
  },

  getSubmitButton() {
    return cy.get(this.selectors.submitButton);
  },

  getDeleteButton() {
    return cy.get(this.selectors.deleteButton);
  },

  getResetButton() {
    return cy.get(this.selectors.resetButton);
  },

  getStatusText() {
    return cy.get(this.selectors.statusText);
  },
};

module.exports = AsyncButtonsPage;
