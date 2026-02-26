/**
 * Casos de prueba E2E - Flujo completo de usuario
 */
const LoginPage = require('../page-objects/LoginPage');
const credentials = require('../fixtures/credentials');
const InventoryPage = require('../page-objects/InventoryPage');
const CartPage = require('../page-objects/CartPage');
const CheckoutStepOnePage = require('../page-objects/CheckoutStepOnePage');
const CheckoutStepTwoPage = require('../page-objects/CheckoutStepTwoPage');
const CheckoutCompletePage = require('../page-objects/CheckoutCompletePage');

describe('SauceDemo - Flujos E2E Completos', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutOne = new CheckoutStepOnePage();
  const checkoutTwo = new CheckoutStepTwoPage();
  const checkoutComplete = new CheckoutCompletePage();

  describe('Flujo completo: Login -> Agregar -> Checkout -> Confirmación', () => {
    it('debe completar todo el flujo de compra desde cero', () => {
      // 1. Login
      loginPage.visit();
      loginPage.login(credentials.users.standard, credentials.password);
      inventoryPage.verifyInventoryPageDisplayed();

      // 2. Agregar producto al carrito
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.verifyCartBadgeCount(1);

      // 3. Ir al carrito
      inventoryPage.goToCart();
      cartPage.verifyProductInCart('Sauce Labs Backpack');

      // 4. Checkout
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo('Ana', 'García', '28001');
      checkoutTwo.verifyProductInSummary('Sauce Labs Backpack');

      // 5. Finalizar compra
      checkoutTwo.clickFinish();
      checkoutComplete.verifyOrderComplete();
      checkoutComplete.verifyCheckoutCompleteDisplayed();

      // 6. Volver al inventario
      checkoutComplete.clickBackHome();
      inventoryPage.verifyInventoryPageDisplayed();
    });
  });

  describe('Flujo: Compra múltiple + Logout', () => {
    it('debe agregar varios productos, completar compra y cerrar sesión', () => {
      cy.login();
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BIKE_LIGHT);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.FLEECE_JACKET);
      inventoryPage.verifyCartBadgeCount(3);

      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo('Carlos', 'Ruiz', '08015');
      checkoutTwo.clickFinish();
      checkoutComplete.verifyOrderComplete();

      checkoutComplete.clickBackHome();
      inventoryPage.logout();
      loginPage.verifyLoginPageDisplayed();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });
  });

  describe('Flujo: Ver detalle de producto antes de comprar', () => {
    it('debe ver detalle del producto, agregar y comprar', () => {
      cy.login();
      inventoryPage.clickProductLink('Sauce Labs Fleece Jacket');
      cy.url().should('include', 'inventory-item');
      cy.get('.inventory_details_name').should('contain', 'Sauce Labs Fleece Jacket');

      cy.get('button[id^="add-to-cart"]').click();
      cy.get('[data-test="back-to-products"], #back-to-products').first().click();

      inventoryPage.verifyCartBadgeCount(1);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo('Pedro', 'Sánchez', '41001');
      checkoutTwo.clickFinish();
      checkoutComplete.verifyOrderComplete();
    });
  });

  describe('Flujo: Ordenar productos y comprar el más barato', () => {
    it('debe ordenar por precio bajo-alto y comprar el primero', () => {
      cy.login();
      inventoryPage.selectSort(InventoryPage.SortOptions.PRICE_LOW_HIGH);

      // Agregar el primer producto (más barato)
      inventoryPage.addProductByIndex(0);
      cy.get('.inventory_item_name').first().invoke('text').then((productName) => {
        inventoryPage.goToCart();
        cartPage.verifyProductInCart(productName.trim());
        cartPage.clickCheckout();
        checkoutOne.completeCheckoutInfo('Laura', 'Martín', '46001');
        checkoutTwo.verifyProductInSummary(productName.trim());
        checkoutTwo.clickFinish();
        checkoutComplete.verifyOrderComplete();
      });
    });
  });

  describe('Flujo: Carrito vacío - intentar checkout', () => {
    it('debe poder acceder a checkout con carrito vacío (comportamiento de la app)', () => {
      cy.login();
      inventoryPage.goToCart();
      cartPage.getCheckoutButton().should('be.visible');
      cartPage.clickCheckout();
      // La app permite ir a checkout con carrito vacío
      checkoutOne.verifyCheckoutStepOneDisplayed();
    });
  });
});
