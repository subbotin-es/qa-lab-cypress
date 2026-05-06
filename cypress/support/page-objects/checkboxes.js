// cypress/support/page-objects/checkboxes.js

const CheckboxesPage = {
  selectors: {
    checkbox1:  '#checkbox-1',
    checkbox2:  '#checkbox-2',
    checkbox3:  '#checkbox-3',
    checkbox4:  '#checkbox-4',
    radioYes:   '#radio-1',
    radioNo:    '#radio-2',
    radioMaybe: '#radio-3',
  },

  checkOption1() {
    cy.get(this.selectors.checkbox1).check();
  },

  uncheckOption1() {
    cy.get(this.selectors.checkbox1).uncheck();
  },

  checkOption2() {
    cy.get(this.selectors.checkbox2).check();
  },

  uncheckOption2() {
    cy.get(this.selectors.checkbox2).uncheck();
  },

  checkOption3() {
    cy.get(this.selectors.checkbox3).check();
  },

  uncheckOption3() {
    cy.get(this.selectors.checkbox3).uncheck();
  },

  selectRadioYes() {
    cy.get(this.selectors.radioYes).check();
  },

  selectRadioNo() {
    cy.get(this.selectors.radioNo).check();
  },

  selectRadioMaybe() {
    cy.get(this.selectors.radioMaybe).check();
  },

  getCheckbox1() {
    return cy.get(this.selectors.checkbox1);
  },

  getCheckbox2() {
    return cy.get(this.selectors.checkbox2);
  },

  getCheckbox3() {
    return cy.get(this.selectors.checkbox3);
  },

  getCheckbox4() {
    return cy.get(this.selectors.checkbox4);
  },

  getRadioYes() {
    return cy.get(this.selectors.radioYes);
  },

  getRadioNo() {
    return cy.get(this.selectors.radioNo);
  },

  getRadioMaybe() {
    return cy.get(this.selectors.radioMaybe);
  },
};

module.exports = CheckboxesPage;
