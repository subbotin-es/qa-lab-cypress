// cypress/support/page-objects/drag-drop.js

const DragDropPage = {
  selectors: {
    sourceContainer: '#drag-source',
    targetZone:      '#drag-target',
    dropLog:         '#drag-drop-log',
    itemAlpha:       '#drag-1',
    itemBeta:        '#drag-2',
    itemGamma:       '#drag-3',
  },

  getItemAlpha() {
    return cy.get(this.selectors.itemAlpha);
  },

  getItemBeta() {
    return cy.get(this.selectors.itemBeta);
  },

  getItemGamma() {
    return cy.get(this.selectors.itemGamma);
  },

  getTargetZone() {
    return cy.get(this.selectors.targetZone);
  },

  getDropLog() {
    return cy.get(this.selectors.dropLog);
  },

  dragItemToTarget(itemSelector) {
    const dataTransfer = new DataTransfer();
    cy.get(itemSelector).trigger('dragstart', { dataTransfer });
    cy.get(this.selectors.targetZone).trigger('dragover', { dataTransfer });
    cy.get(this.selectors.targetZone).trigger('drop', { dataTransfer });
    cy.get(itemSelector).trigger('dragend');
  },
};

module.exports = DragDropPage;
