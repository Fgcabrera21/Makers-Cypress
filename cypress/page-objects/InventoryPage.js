/**
 * Page Object Model - Página de Inventario/Productos de SauceDemo
 */
class InventoryPage {
  constructor() {
    this.url = '/inventory.html';
    this.selectors = {
      inventoryContainer: '.inventory_container',
      inventoryList: '.inventory_list',
      inventoryItem: '.inventory_item',
      inventoryItemName: '.inventory_item_name',
      inventoryItemDesc: '.inventory_item_desc',
      inventoryItemPrice: '.inventory_item_price',
      addToCartButton: (productName) => `button[id^="add-to-cart"]`,
      removeFromCartButton: (productName) => `button[id^="remove"]`,
      productLink: '.inventory_item_name',
      sortDropdown: '.product_sort_container',
      shoppingCartLink: '.shopping_cart_link',
      shoppingCartBadge: '.shopping_cart_badge',
      menuButton: '#react-burger-menu-btn',
      menuList: '.bm-menu-wrap',
      logoutLink: '#logout_sidebar_link',
      appLogo: '.app_logo',
      title: '.title'
    };
  }

  visit() {
    cy.visit(this.url);
  }

  getInventoryItems() {
    return cy.get(this.selectors.inventoryItem);
  }

  getAddToCartButton(productId) {
    return cy.get(`#add-to-cart-${productId}`);
  }

  getRemoveButton(productId) {
    return cy.get(`#remove-${productId}`);
  }

  addProductToCart(productId) {
    this.getAddToCartButton(productId).click();
    return this;
  }

  removeProductFromCart(productId) {
    this.getRemoveButton(productId).click();
    return this;
  }

  addProductByIndex(index) {
    cy.get(this.selectors.inventoryItem).eq(index).find('button').click();
    return this;
  }

  getProductName(index) {
    return cy.get(this.selectors.inventoryItem).eq(index).find(this.selectors.inventoryItemName);
  }

  getProductPrice(index) {
    return cy.get(this.selectors.inventoryItem).eq(index).find(this.selectors.inventoryItemPrice);
  }

  clickProductLink(productName) {
    cy.get(this.selectors.inventoryItemName).contains(productName).click();
    return this;
  }

  selectSort(sortValue) {
    cy.get(this.selectors.sortDropdown).select(sortValue);
    return this;
  }

  goToCart() {
    cy.get(this.selectors.shoppingCartLink).click();
    return this;
  }

  openMenu() {
    cy.get(this.selectors.menuButton).click();
    return this;
  }

  logout() {
    this.openMenu();
    cy.get(this.selectors.logoutLink).click();
    return this;
  }

  getCartBadgeCount() {
    return cy.get(this.selectors.shoppingCartBadge);
  }

  verifyInventoryPageDisplayed() {
    cy.url().should('include', '/inventory');
    cy.get(this.selectors.inventoryContainer).should('be.visible');
    return this;
  }

  verifyProductsDisplayed() {
    this.getInventoryItems().should('have.length.at.least', 1);
    return this;
  }

  verifyCartBadgeCount(count) {
    this.getCartBadgeCount().should('have.text', count.toString());
    return this;
  }

  // Productos conocidos de SauceDemo
  static get ProductIds() {
    return {
      BACKPACK: 'sauce-labs-backpack',
      BIKE_LIGHT: 'sauce-labs-bike-light',
      BOLT_TSHIRT: 'sauce-labs-bolt-t-shirt',
      FLEECE_JACKET: 'sauce-labs-fleece-jacket',
      ONESIE: 'sauce-labs-onesie',
      TSHIRT_RED: 'test.allthethings()-t-shirt-(red)'
    };
  }

  static get SortOptions() {
    return {
      NAME_A_Z: 'az',
      NAME_Z_A: 'za',
      PRICE_LOW_HIGH: 'lohi',
      PRICE_HIGH_LOW: 'hilo'
    };
  }
}

module.exports = InventoryPage;
