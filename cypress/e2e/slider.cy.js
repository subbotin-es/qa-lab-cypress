// cypress/e2e/slider.cy.js

describe('Slider @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#test-slider');
  });

  it('@smoke — slider has initial value of 50', () => {
    cy.get('#test-slider').should('have.value', '50');
    cy.get('#slider-value').should('have.text', '50');
  });

  it('slider value display updates when value changes', () => {
    cy.get('#test-slider').invoke('val', 75);
    cy.get('#test-slider').trigger('input');

    cy.get('#test-slider').should('have.value', '75');
    cy.get('#slider-value').should('have.text', '75');
  });

  it('slider minimum boundary value', () => {
    cy.get('#test-slider').invoke('val', 0);
    cy.get('#test-slider').trigger('input');

    cy.get('#test-slider').should('have.value', '0');
  });

  it('slider maximum boundary value', () => {
    cy.get('#test-slider').invoke('val', 100);
    cy.get('#test-slider').trigger('input');

    cy.get('#test-slider').should('have.value', '100');
  });

});
