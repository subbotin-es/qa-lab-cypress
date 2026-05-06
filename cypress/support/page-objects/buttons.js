// cypress/support/page-objects/buttons.js

const ButtonsPage = {
  selectors: {
    primary:   '#button-primary',
    secondary: '#button-secondary',
    success:   '#button-success',
    danger:    '#button-danger',
    disabled:  '#button-disabled',
  },

  clickPrimary() {
    cy.get(this.selectors.primary).click();
  },

  clickSecondary() {
    cy.get(this.selectors.secondary).click();
  },

  clickSuccess() {
    cy.get(this.selectors.success).click();
  },

  clickDanger() {
    cy.get(this.selectors.danger).click();
  },

  getPrimary() {
    return cy.get(this.selectors.primary);
  },

  getSecondary() {
    return cy.get(this.selectors.secondary);
  },

  getSuccess() {
    return cy.get(this.selectors.success);
  },

  getDanger() {
    return cy.get(this.selectors.danger);
  },

  getDisabled() {
    return cy.get(this.selectors.disabled);
  },
};

module.exports = ButtonsPage;
