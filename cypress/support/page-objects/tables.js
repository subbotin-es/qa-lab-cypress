// cypress/support/page-objects/tables.js

const TablesPage = {
  selectors: {
    table:    '#test-table',
    rows:     '#test-table tbody tr',
    editBtn:  'button',
  },

  getTable() {
    return cy.get(this.selectors.table);
  },

  getRows() {
    return cy.get(this.selectors.rows);
  },

  // rowIndex is 0-based
  getRow(rowIndex) {
    return cy.get(this.selectors.rows).eq(rowIndex);
  },

  // rowIndex and colIndex are 0-based
  getCellText(rowIndex, colIndex) {
    return cy.get(this.selectors.rows).eq(rowIndex).find('td').eq(colIndex);
  },

  // rowIndex is 0-based
  getEditButton(rowIndex) {
    return cy.get(this.selectors.rows).eq(rowIndex).find(this.selectors.editBtn).contains('Edit');
  },

  clickEdit(rowIndex) {
    this.getEditButton(rowIndex).click();
  },
};

module.exports = TablesPage;
