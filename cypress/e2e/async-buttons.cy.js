// cypress/e2e/async-buttons.cy.js
const AsyncButtonsPage = require('../support/page-objects/async-buttons');

describe('Async Button States @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#async-buttons');
  });

  it('@smoke — submit button transitions idle → loading → success', () => {
    AsyncButtonsPage.getSubmitButton().should('contain.text', 'Submit Order');

    AsyncButtonsPage.clickSubmit();

    AsyncButtonsPage.getSubmitButton().should('contain.text', 'Processing...');
    cy.waitForButtonState(AsyncButtonsPage.selectors.submitButton, '✓ Order Confirmed');
  });

  it('@smoke — delete button transitions idle → loading → error', () => {
    AsyncButtonsPage.getDeleteButton().should('contain.text', 'Delete Record');

    AsyncButtonsPage.clickDelete();

    AsyncButtonsPage.getDeleteButton().should('contain.text', 'Deleting...');
    cy.waitForButtonState(AsyncButtonsPage.selectors.deleteButton, '✗ Server Error 500');
  });

  it('reset restores both buttons to initial state', () => {
    AsyncButtonsPage.clickSubmit();
    cy.waitForButtonState(AsyncButtonsPage.selectors.submitButton, '✓ Order Confirmed');

    AsyncButtonsPage.clickReset();

    AsyncButtonsPage.getSubmitButton().should('contain.text', 'Submit Order');
    AsyncButtonsPage.getDeleteButton().should('contain.text', 'Delete Record');
  });

  it('submit button is disabled during loading state', () => {
    AsyncButtonsPage.clickSubmit();
    AsyncButtonsPage.getSubmitButton().should('be.disabled');
    cy.waitForButtonState(AsyncButtonsPage.selectors.submitButton, '✓ Order Confirmed');
  });

});
