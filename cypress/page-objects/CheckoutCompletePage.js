/**
 * Page Object Model - Checkout Completado de SauceDemo
 */
class CheckoutCompletePage {
  constructor() {
    this.selectors = {
      completeHeader: '.complete-header',
      completeText: '.complete-text',
      backHomeButton: '#back-to-products',
      ponyExpressImage: '.pony_express'
    };
  }

  getCompleteHeader() {
    return cy.get(this.selectors.completeHeader);
  }

  getBackHomeButton() {
    return cy.get(this.selectors.backHomeButton);
  }

  clickBackHome() {
    this.getBackHomeButton().click();
    return this;
  }

  verifyOrderComplete() {
    this.getCompleteHeader().should('contain', 'Thank you for your order');
    cy.get(this.selectors.completeText).should('contain', 'Your order has been dispatched');
    return this;
  }

  verifyCheckoutCompleteDisplayed() {
    cy.url().should('include', '/checkout-complete');
    return this;
  }
}

module.exports = CheckoutCompletePage;
