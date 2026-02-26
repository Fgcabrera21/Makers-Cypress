/**
 * Page Object Model - Checkout Paso 2 (Overview) de SauceDemo
 */
class CheckoutStepTwoPage {
  constructor() {
    this.selectors = {
      cartList: '.cart_list',
      cartItem: '.cart_item',
      itemName: '.inventory_item_name',
      itemPrice: '.inventory_item_price',
      itemQuantity: '.cart_quantity',
      summarySubtotal: '.summary_subtotal_label',
      summaryTax: '.summary_tax_label',
      summaryTotal: '.summary_total_label',
      finishButton: '#finish',
      cancelButton: '#cancel',
      paymentInfo: '.summary_info_label:first',
      shippingInfo: '.summary_info_label'
    };
  }

  getCartItems() {
    return cy.get(this.selectors.cartItem);
  }

  getFinishButton() {
    return cy.get(this.selectors.finishButton);
  }

  getCancelButton() {
    return cy.get(this.selectors.cancelButton);
  }

  clickFinish() {
    this.getFinishButton().click();
    return this;
  }

  clickCancel() {
    this.getCancelButton().click();
    return this;
  }

  getSummaryTotal() {
    return cy.get(this.selectors.summaryTotal);
  }

  getItemName(index) {
    return cy.get(this.selectors.cartItem).eq(index).find(this.selectors.itemName);
  }

  verifyCheckoutOverviewDisplayed() {
    cy.url().should('include', '/checkout-step-two');
    cy.get('.title').should('contain', 'Checkout: Overview');
    return this;
  }

  verifyProductInSummary(productName) {
    cy.get(this.selectors.cartList).should('contain', productName);
    return this;
  }
}

module.exports = CheckoutStepTwoPage;
