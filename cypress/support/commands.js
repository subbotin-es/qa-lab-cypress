// cypress/support/commands.js

// Scroll to a section by anchor ID
Cypress.Commands.add('scrollToSection', (sectionId) => {
  cy.get(sectionId).scrollIntoView({ block: 'start' });
  cy.get(sectionId).should('be.visible');
});

// Wait for async button to reach a specific state
Cypress.Commands.add('waitForButtonState', (selector, expectedText) => {
  cy.get(selector).should('contain.text', expectedText);
});

// Get table row by index (1-based)
Cypress.Commands.add('getTableRow', (tableSelector, rowIndex) => {
  return cy.get(`${tableSelector} tbody tr`).eq(rowIndex - 1);
});
