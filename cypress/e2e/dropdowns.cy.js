// cypress/e2e/dropdowns.cy.js
const DropdownsPage = require('../support/page-objects/dropdowns');

describe('Dropdowns @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#dropdowns');
  });

  it('@smoke — should select a country from single select', () => {
    DropdownsPage.selectCountry('usa');
    DropdownsPage.getCountrySelect().should('have.value', 'usa');
  });

  it('@smoke — should select multiple options', () => {
    DropdownsPage.selectMultiple(['programming', 'testing']);
    DropdownsPage.getMultipleSelect()
      .find('option:selected')
      .should('have.length', 2);
  });

  it('country select defaults to empty', () => {
    DropdownsPage.getCountrySelect().should('have.value', '');
  });

  it('should reflect selected country value after selection', () => {
    DropdownsPage.selectCountry('uk');
    DropdownsPage.getCountrySelect().should('have.value', 'uk');
  });

  it('should select all four multi-select options', () => {
    DropdownsPage.selectMultiple(['programming', 'testing', 'design', 'marketing']);
    DropdownsPage.getMultipleSelect()
      .find('option:selected')
      .should('have.length', 4);
  });

});
