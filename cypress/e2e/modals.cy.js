// cypress/e2e/modals.cy.js
const ModalsPage = require('../support/page-objects/modals');

describe('Alerts & Modals @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#alerts');
  });

  it('@smoke — modal is hidden before opening', () => {
    ModalsPage.getModal().should('not.be.visible');
  });

  it('@smoke — should open modal on button click', () => {
    ModalsPage.openModal();
    ModalsPage.getModal().should('be.visible');
    ModalsPage.getConfirmButton().should('be.visible');
    ModalsPage.getCancelButton().should('be.visible');
  });

  it('@smoke — alert banners are visible on page', () => {
    ModalsPage.getAlertSuccess().should('be.visible');
    ModalsPage.getAlertWarning().should('be.visible');
    ModalsPage.getAlertError().should('be.visible');
    ModalsPage.getAlertInfo().should('be.visible');
  });

  it('should close modal on Cancel click', () => {
    ModalsPage.openModal();
    ModalsPage.getModal().should('be.visible');
    ModalsPage.cancelModal();
    ModalsPage.getModal().should('not.be.visible');
  });

  it('should close modal via X button', () => {
    ModalsPage.openModal();
    ModalsPage.closeModal();
    ModalsPage.getModal().should('not.be.visible');
  });

  it('Confirm button is visible and clickable inside modal', () => {
    ModalsPage.openModal();
    ModalsPage.getConfirmButton()
      .should('be.visible')
      .should('be.enabled');
    ModalsPage.confirmModal();
    ModalsPage.getModal().should('be.visible');
  });

});
