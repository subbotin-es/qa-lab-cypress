// cypress/support/page-objects/dropdowns.js

const DropdownsPage = {
  selectors: {
    countrySelect:  '#select-country',
    multipleSelect: '#select-multiple',
  },

  selectCountry(value) {
    cy.get(this.selectors.countrySelect).select(value);
  },

  selectMultiple(values) {
    cy.get(this.selectors.multipleSelect).select(values);
  },

  getCountrySelect() {
    return cy.get(this.selectors.countrySelect);
  },

  getMultipleSelect() {
    return cy.get(this.selectors.multipleSelect);
  },
};

module.exports = DropdownsPage;
