// cypress/e2e/inputs.cy.js
const InputsPage = require('../support/page-objects/inputs');

describe('Input Fields @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#inputs');
  });

  it('@smoke — all input fields are visible', () => {
    InputsPage.getTextInput().should('be.visible');
    InputsPage.getNumberInput().should('be.visible');
    InputsPage.getDateInput().should('be.visible');
    InputsPage.getSearchInput().should('be.visible');
    InputsPage.getUrlInput().should('be.visible');
  });

  it('@smoke — should accept text input', () => {
    InputsPage.fillText('Hello World');
    InputsPage.getTextInput().should('have.value', 'Hello World');
  });

  it('should accept number input', () => {
    InputsPage.fillNumber(42);
    InputsPage.getNumberInput().should('have.value', '42');
  });

  it('should accept date input', () => {
    InputsPage.fillDate('2026-01-15');
    InputsPage.getDateInput().should('have.value', '2026-01-15');
  });

  it('should accept search input', () => {
    InputsPage.fillSearch('cypress automation');
    InputsPage.getSearchInput().should('have.value', 'cypress automation');
  });

  it('should accept URL input', () => {
    InputsPage.fillUrl('https://example.com');
    InputsPage.getUrlInput().should('have.value', 'https://example.com');
  });

});
