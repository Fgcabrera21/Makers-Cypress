/**
 * Page Object Model - Página de Detalle de Producto de SauceDemo
 */
class ProductDetailPage {
  constructor() {
    this.selectors = {
      backButton: '[data-test="back-to-products"], #back-to-products',
      productName: '.inventory_details_name',
      productDesc: '.inventory_details_desc',
      productPrice: '.inventory_details_price',
      addToCartButton: 'button[id^="add-to-cart"], [data-test^="add-to-cart"]',
      removeButton: 'button[id^="remove"], [data-test^="remove"]',
      productImage: '.inventory_details_img'
    };
  }

  getProductName() {
    return cy.get(this.selectors.productName);
  }

  getProductPrice() {
    return cy.get(this.selectors.productPrice);
  }

  getAddToCartButton() {
    return cy.get(this.selectors.addToCartButton);
  }

  getRemoveButton() {
    return cy.get(this.selectors.removeButton);
  }

  addToCart() {
    this.getAddToCartButton().click();
    return this;
  }

  removeFromCart() {
    this.getRemoveButton().click();
    return this;
  }

  backToProducts() {
    cy.get(this.selectors.backButton).click();
    return this;
  }

  verifyProductDetailDisplayed() {
    cy.url().should('include', '/inventory-item.html');
    cy.get(this.selectors.productName).should('be.visible');
    return this;
  }
}

module.exports = ProductDetailPage;
