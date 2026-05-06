// cypress/e2e/checkboxes.cy.js
const CheckboxesPage = require('../support/page-objects/checkboxes');

describe('Checkboxes & Radio Buttons @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#checkboxes');
  });

  it('@smoke — should check an unchecked checkbox', () => {
    CheckboxesPage.checkOption1();
    CheckboxesPage.getCheckbox1().should('be.checked');
  });

  it('@smoke — radio buttons are mutually exclusive', () => {
    CheckboxesPage.selectRadioYes();
    CheckboxesPage.getRadioYes().should('be.checked');
    CheckboxesPage.getRadioNo().should('not.be.checked');

    CheckboxesPage.selectRadioMaybe();
    CheckboxesPage.getRadioMaybe().should('be.checked');
    CheckboxesPage.getRadioYes().should('not.be.checked');
  });

  it('should uncheck a pre-checked checkbox', () => {
    CheckboxesPage.getCheckbox3().should('be.checked');
    CheckboxesPage.uncheckOption3();
    CheckboxesPage.getCheckbox3().should('not.be.checked');
  });

  it('disabled checkbox is not interactive', () => {
    CheckboxesPage.getCheckbox4()
      .should('be.disabled')
      .should('not.be.checked');
  });

  it('radio No is checked by default', () => {
    CheckboxesPage.getRadioNo().should('be.checked');
  });

  it('checkbox 2 is unchecked by default', () => {
    CheckboxesPage.getCheckbox2().should('not.be.checked');
  });

});
