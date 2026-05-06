// cypress/e2e/buttons.cy.js
const ButtonsPage = require('../support/page-objects/buttons');

describe('Buttons @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#buttons');
  });

  it('@smoke — primary button is visible and enabled', () => {
    ButtonsPage.getPrimary()
      .should('be.visible')
      .should('be.enabled');
  });

  it('@smoke — secondary button is visible and enabled', () => {
    ButtonsPage.getSecondary()
      .should('be.visible')
      .should('be.enabled');
  });

  it('success button is visible and enabled', () => {
    ButtonsPage.getSuccess()
      .should('be.visible')
      .should('be.enabled');
  });

  it('danger button is visible and enabled', () => {
    ButtonsPage.getDanger()
      .should('be.visible')
      .should('be.enabled');
  });

  it('disabled button is visible and not interactive', () => {
    ButtonsPage.getDisabled()
      .should('be.visible')
      .should('be.disabled');
  });

  it('primary button click does not throw', () => {
    ButtonsPage.clickPrimary();
    ButtonsPage.getPrimary().should('be.visible');
  });

});
