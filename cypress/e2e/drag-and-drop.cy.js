// cypress/e2e/drag-and-drop.cy.js
const DragDropPage = require('../support/page-objects/drag-drop');

describe('Drag and Drop @regression', () => {

  beforeEach(() => {
    cy.visit('/QA-Lab/qa-lab.html');
    cy.scrollToSection('#drag-drop');
  });

  it('@smoke — source items are visible in drag zone', () => {
    DragDropPage.getItemAlpha().should('be.visible');
    DragDropPage.getItemBeta().should('be.visible');
    DragDropPage.getItemGamma().should('be.visible');
  });

  it('@smoke — target drop zone is visible', () => {
    DragDropPage.getTargetZone().should('be.visible');
  });

  it('dragging Item Alpha updates the drop log', () => {
    DragDropPage.dragItemToTarget(DragDropPage.selectors.itemAlpha);
    DragDropPage.getDropLog().should('contain.text', 'Item Alpha');
  });

  it('dragging Item Beta updates the drop log', () => {
    DragDropPage.dragItemToTarget(DragDropPage.selectors.itemBeta);
    DragDropPage.getDropLog().should('contain.text', 'Item Beta');
  });

  it('dragging Item Gamma updates the drop log', () => {
    DragDropPage.dragItemToTarget(DragDropPage.selectors.itemGamma);
    DragDropPage.getDropLog().should('contain.text', 'Item Gamma');
  });

});
