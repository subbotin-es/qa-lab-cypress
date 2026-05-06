// cypress/e2e/dynamic-visibility.cy.js
const DynamicVisibilityPage = require('../support/page-objects/dynamic-visibility');

describe('Dynamic Visibility @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#dynamic-visibility');
  });

  it('@smoke — secret panel is hidden before checkbox is checked', () => {
    DynamicVisibilityPage.getSecretPanel().should('not.be.visible');
  });

  it('@smoke — checking the checkbox reveals the secret panel', () => {
    DynamicVisibilityPage.toggle();

    DynamicVisibilityPage.getSecretPanel().should('be.visible');
    DynamicVisibilityPage.getSecretText().should('be.visible');
    DynamicVisibilityPage.getSecretButton().should('be.visible');
  });

  it('unchecking hides the panel again', () => {
    DynamicVisibilityPage.toggle();
    DynamicVisibilityPage.getSecretPanel().should('be.visible');

    DynamicVisibilityPage.toggle();
    DynamicVisibilityPage.getSecretPanel().should('not.be.visible');
  });

  it('secret button click increments counter', () => {
    DynamicVisibilityPage.toggle();
    DynamicVisibilityPage.clickSecretButton();

    DynamicVisibilityPage.getCounter().should('contain.text', '1');
  });

});
