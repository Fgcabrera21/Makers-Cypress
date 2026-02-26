/**
 * Page Object Model - Página del Carrito de SauceDemo
 */
class CartPage {
  constructor() {
    this.url = '/cart.html';
    this.selectors = {
      cartList: '.cart_list',
      cartItem: '.cart_item',
      cartItemName: '.inventory_item_name',
      cartItemPrice: '.inventory_item_price',
      removeButton: 'button[class*="cart_button"]',
      checkoutButton: '#checkout',
      continueShoppingButton: '#continue-shopping',
      quantityLabel: '.cart_quantity',
      cartBadge: '.shopping_cart_badge'
    };
  }

  visit() {
    cy.visit(this.url);
  }

  /**
   * Navega al carrito desde la app (clic en icono).
   * Usar en lugar de visit() cuando /cart.html devuelve 404 (SPA).
   */
  navigateFromInventory() {
    cy.get('.shopping_cart_link').click();
    return this;
  }

  getCartItems() {
    return cy.get(this.selectors.cartItem);
  }

  getCheckoutButton() {
    return cy.get(this.selectors.checkoutButton);
  }

  getContinueShoppingButton() {
    return cy.get(this.selectors.continueShoppingButton);
  }

  clickCheckout() {
    this.getCheckoutButton().click();
    return this;
  }

  clickContinueShopping() {
    this.getContinueShoppingButton().click();
    return this;
  }

  removeItem(index) {
    cy.get(this.selectors.cartItem).eq(index).find(this.selectors.removeButton).click();
    return this;
  }

  getItemName(index) {
    return cy.get(this.selectors.cartItem).eq(index).find(this.selectors.cartItemName);
  }

  getItemPrice(index) {
    return cy.get(this.selectors.cartItem).eq(index).find(this.selectors.cartItemPrice);
  }

  verifyCartPageDisplayed() {
    cy.url().should('match', /cart|cart\.html/);
    cy.get(this.selectors.cartList, { timeout: 10000 }).should('be.visible');
    return this;
  }

  verifyCartEmpty() {
    this.getCartItems().should('have.length', 0);
    cy.get(this.selectors.checkoutButton).should('be.visible');
    return this;
  }

  verifyCartItemCount(count) {
    this.getCartItems().should('have.length', count);
    return this;
  }

  verifyProductInCart(productName) {
    cy.get(this.selectors.cartList).should('contain', productName);
    return this;
  }
}

module.exports = CartPage;
