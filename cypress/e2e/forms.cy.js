// cypress/e2e/forms.cy.js
const FormsPage = require('../support/page-objects/forms');

describe('Registration Form @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#forms');
  });

  it('@smoke — should submit form with valid data and show success', () => {
    FormsPage.fillForm({
      fullName: 'John Doe',
      email: 'john@example.com',
      age: 30,
      phone: '+1234567890',
    });
    FormsPage.submit();

    FormsPage.getFeedback()
      .should('have.class', 'success')
      .should('contain.text', 'Registration successful! (demo)');
  });

  it('@smoke — register button is visible and enabled', () => {
    FormsPage.getRegisterButton()
      .should('be.visible')
      .should('be.enabled');
  });

  it('should show validation errors on empty submit', () => {
    FormsPage.submit();

    FormsPage.getFeedback()
      .should('have.class', 'error')
      .should('contain.text', 'Name must be at least 2 characters')
      .should('contain.text', 'Invalid email format')
      .should('contain.text', 'Age must be between 18 and 99');
  });

  it('should show error for invalid email format', () => {
    FormsPage.fillForm({
      fullName: 'Jane Smith',
      email: 'not-an-email',
      age: 25,
      phone: '',
    });
    FormsPage.submit();

    FormsPage.getFeedback()
      .should('have.class', 'error')
      .should('contain.text', 'Invalid email format');
  });

  it('should show error when age is below minimum', () => {
    FormsPage.fillForm({
      fullName: 'Young User',
      email: 'user@example.com',
      age: 16,
      phone: '',
    });
    FormsPage.submit();

    FormsPage.getFeedback()
      .should('have.class', 'error')
      .should('contain.text', 'Age must be between 18 and 99');
  });

});
