// cypress/e2e/tables.cy.js
const TablesPage = require('../support/page-objects/tables');

describe('Tables @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#tables');
  });

  it('@smoke — table has exactly 3 data rows', () => {
    TablesPage.getRows().should('have.length', 3);
  });

  it('@smoke — each row has an Edit button', () => {
    TablesPage.getEditButton(0).should('be.visible');
    TablesPage.getEditButton(1).should('be.visible');
    TablesPage.getEditButton(2).should('be.visible');
  });

  it('first row contains correct ID and name', () => {
    TablesPage.getCellText(0, 0).should('have.text', '1');
    TablesPage.getCellText(0, 1).should('have.text', 'John Doe');
    TablesPage.getCellText(0, 2).should('have.text', 'john@example.com');
  });

  it('second row contains correct data', () => {
    TablesPage.getCellText(1, 0).should('have.text', '2');
    TablesPage.getCellText(1, 1).should('have.text', 'Jane Smith');
  });

  it('first row status is Active', () => {
    TablesPage.getCellText(0, 3).should('have.text', 'Active');
  });

  it('second row status is Inactive', () => {
    TablesPage.getCellText(1, 3).should('have.text', 'Inactive');
  });

});
