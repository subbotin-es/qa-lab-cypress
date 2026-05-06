// cypress/support/page-objects/inputs.js

const InputsPage = {
  selectors: {
    textInput:   '#text-input',
    numberInput: '#number-input',
    dateInput:   '#date-input',
    searchInput: '#search-input',
    urlInput:    '#url-input',
  },

  fillText(value) {
    cy.get(this.selectors.textInput).clear();
    cy.get(this.selectors.textInput).type(value);
  },

  fillNumber(value) {
    cy.get(this.selectors.numberInput).clear();
    cy.get(this.selectors.numberInput).type(String(value));
  },

  fillDate(value) {
    cy.get(this.selectors.dateInput).clear();
    cy.get(this.selectors.dateInput).type(value);
  },

  fillSearch(value) {
    cy.get(this.selectors.searchInput).clear();
    cy.get(this.selectors.searchInput).type(value);
  },

  fillUrl(value) {
    cy.get(this.selectors.urlInput).clear();
    cy.get(this.selectors.urlInput).type(value);
  },

  getTextInput() {
    return cy.get(this.selectors.textInput);
  },

  getNumberInput() {
    return cy.get(this.selectors.numberInput);
  },

  getDateInput() {
    return cy.get(this.selectors.dateInput);
  },

  getSearchInput() {
    return cy.get(this.selectors.searchInput);
  },

  getUrlInput() {
    return cy.get(this.selectors.urlInput);
  },
};

module.exports = InputsPage;
