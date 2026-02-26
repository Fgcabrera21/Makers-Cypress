/**
 * Casos de prueba EXHAUSTIVOS para el Carrito de SauceDemo
 */
const InventoryPage = require('../page-objects/InventoryPage');
const CartPage = require('../page-objects/CartPage');

describe('SauceDemo - Carrito', () => {
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.login();
  });

  describe('Carrito vacío', () => {
    // SauceDemo es SPA: no se puede visitar /cart.html directamente (404).
    // Navegamos al carrito mediante el icono del header.
    it('debe mostrar carrito vacío al acceder sin productos', () => {
      inventoryPage.goToCart();
      cartPage.verifyCartPageDisplayed();
      cy.get('.cart_item').should('have.length', 0);
    });

    it('debe mostrar botón Checkout en carrito vacío', () => {
      inventoryPage.goToCart();
      cartPage.getCheckoutButton().should('be.visible');
    });

    it('debe mostrar botón Continue Shopping', () => {
      inventoryPage.goToCart();
      cartPage.getContinueShoppingButton().should('be.visible');
    });

    it('debe volver al inventario con Continue Shopping', () => {
      inventoryPage.goToCart();
      cartPage.clickContinueShopping();
      inventoryPage.verifyInventoryPageDisplayed();
    });
  });

  describe('Carrito con productos', () => {
    beforeEach(() => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BIKE_LIGHT);
      inventoryPage.goToCart();
    });

    it('debe mostrar los productos agregados', () => {
      cartPage.verifyCartItemCount(2);
      cartPage.verifyProductInCart('Sauce Labs Backpack');
      cartPage.verifyProductInCart('Sauce Labs Bike Light');
    });

    it('debe mostrar el precio de cada producto', () => {
      cartPage.getCartItems().each(($el) => {
        cy.wrap($el).find('.inventory_item_price').should('exist').and('contain', '$');
      });
    });

    it('debe mostrar botón Remove para cada producto', () => {
      cartPage.getCartItems().each(($el) => {
        cy.wrap($el).find('button').should('contain', 'Remove');
      });
    });
  });

  describe('Quitar productos del carrito', () => {
    it('debe quitar producto desde la página del carrito', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BIKE_LIGHT);
      inventoryPage.goToCart();
      cartPage.removeItem(0);
      cartPage.verifyCartItemCount(1);
    });

    it('debe vaciar el carrito quitando todos los productos', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.removeItem(0);
      cy.get('.cart_item').should('have.length', 0);
    });
  });

  describe('Checkout desde carrito', () => {
    it('debe navegar a checkout al hacer click en Checkout', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      cy.url().should('include', '/checkout-step-one');
    });
  });

  describe('Persistencia', () => {
    it('los productos deben persistir al navegar entre páginas', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.verifyProductInCart('Sauce Labs Backpack');
      cartPage.clickContinueShopping();
      cy.get('.shopping_cart_badge').should('have.text', '1');
      inventoryPage.goToCart();
      cartPage.verifyProductInCart('Sauce Labs Backpack');
    });
  });
});
