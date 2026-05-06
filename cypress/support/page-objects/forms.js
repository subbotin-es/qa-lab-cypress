// cypress/support/page-objects/forms.js

const FormsPage = {
  selectors: {
    fullNameInput:   '#reg-name',
    emailInput:      '#reg-email',
    ageInput:        '#reg-age',
    phoneInput:      '#reg-phone',
    registerButton:  '#reg-submit',
    feedbackMessage: '#reg-feedback',
  },

  fillForm({ fullName, email, age, phone }) {
    cy.get(this.selectors.fullNameInput).clear();
    if (fullName) cy.get(this.selectors.fullNameInput).type(fullName);
    cy.get(this.selectors.emailInput).clear();
    if (email) cy.get(this.selectors.emailInput).type(email);
    cy.get(this.selectors.ageInput).clear();
    if (age !== undefined && age !== null && age !== '') cy.get(this.selectors.ageInput).type(String(age));
    cy.get(this.selectors.phoneInput).clear();
    if (phone) cy.get(this.selectors.phoneInput).type(phone);
  },

  submit() {
    cy.get(this.selectors.registerButton).click();
  },

  clearForm() {
    cy.get(this.selectors.fullNameInput).clear();
    cy.get(this.selectors.emailInput).clear();
    cy.get(this.selectors.ageInput).clear();
    cy.get(this.selectors.phoneInput).clear();
  },

  getRegisterButton() {
    return cy.get(this.selectors.registerButton);
  },

  getFeedback() {
    return cy.get(this.selectors.feedbackMessage);
  },
};

module.exports = FormsPage;
