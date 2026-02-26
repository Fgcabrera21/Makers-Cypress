/**
 * Page Object Model - Checkout Paso 1 (Información) de SauceDemo
 */
class CheckoutStepOnePage {
  constructor() {
    this.url = '/checkout-step-one.html';
    this.selectors = {
      firstNameInput: '#first-name',
      lastNameInput: '#last-name',
      postalCodeInput: '#postal-code',
      continueButton: '#continue',
      cancelButton: '#cancel',
      errorMessage: '[data-test="error"]',
      checkoutInfo: '.checkout_info'
    };
  }

  visit() {
    cy.visit(this.url);
  }

  fillFirstName(firstName) {
    cy.get(this.selectors.firstNameInput).clear().type(firstName);
    return this;
  }

  fillLastName(lastName) {
    cy.get(this.selectors.lastNameInput).clear().type(lastName);
    return this;
  }

  fillPostalCode(postalCode) {
    cy.get(this.selectors.postalCodeInput).clear().type(postalCode);
    return this;
  }

  fillCheckoutInfo(firstName, lastName, postalCode) {
    this.fillFirstName(firstName);
    this.fillLastName(lastName);
    this.fillPostalCode(postalCode);
    return this;
  }

  clickContinue() {
    cy.get(this.selectors.continueButton).click();
    return this;
  }

  clickCancel() {
    cy.get(this.selectors.cancelButton).click();
    return this;
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  completeCheckoutInfo(firstName, lastName, postalCode) {
    this.fillCheckoutInfo(firstName, lastName, postalCode);
    this.clickContinue();
    return this;
  }

  verifyCheckoutStepOneDisplayed() {
    cy.url().should('include', '/checkout-step-one');
    cy.get(this.selectors.firstNameInput).should('be.visible');
    return this;
  }

  verifyErrorDisplayed() {
    this.getErrorMessage().should('be.visible');
    return this;
  }
}

module.exports = CheckoutStepOnePage;
