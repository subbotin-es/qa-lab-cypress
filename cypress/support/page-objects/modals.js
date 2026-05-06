// cypress/support/page-objects/modals.js

const ModalsPage = {
  selectors: {
    openModalButton: '#open-modal',
    modal:           '#test-modal',
    closeButton:     '#close-modal',
    confirmButton:   '#modal-confirm',
    cancelButton:    '#modal-cancel',
    alertSuccess:    '#alert-success',
    alertWarning:    '#alert-warning',
    alertError:      '#alert-error',
    alertInfo:       '#alert-info',
  },

  openModal() {
    cy.get(this.selectors.openModalButton).click();
  },

  confirmModal() {
    cy.get(this.selectors.confirmButton).click();
  },

  cancelModal() {
    cy.get(this.selectors.cancelButton).click();
  },

  closeModal() {
    cy.get(this.selectors.closeButton).click();
  },

  getModal() {
    return cy.get(this.selectors.modal);
  },

  getAlertSuccess() {
    return cy.get(this.selectors.alertSuccess);
  },

  getAlertWarning() {
    return cy.get(this.selectors.alertWarning);
  },

  getAlertError() {
    return cy.get(this.selectors.alertError);
  },

  getAlertInfo() {
    return cy.get(this.selectors.alertInfo);
  },

  getConfirmButton() {
    return cy.get(this.selectors.confirmButton);
  },

  getCancelButton() {
    return cy.get(this.selectors.cancelButton);
  },
};

module.exports = ModalsPage;
