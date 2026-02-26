/**
 * Casos de prueba EXHAUSTIVOS para el proceso de Checkout de SauceDemo
 */
const InventoryPage = require('../page-objects/InventoryPage');
const CartPage = require('../page-objects/CartPage');
const CheckoutStepOnePage = require('../page-objects/CheckoutStepOnePage');
const CheckoutStepTwoPage = require('../page-objects/CheckoutStepTwoPage');
const CheckoutCompletePage = require('../page-objects/CheckoutCompletePage');

describe('SauceDemo - Checkout', () => {
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutOne = new CheckoutStepOnePage();
  const checkoutTwo = new CheckoutStepTwoPage();
  const checkoutComplete = new CheckoutCompletePage();

  const validUser = { firstName: 'Juan', lastName: 'Pérez', postalCode: '28001' };

  beforeEach(() => {
    cy.login();
  });

  describe('Checkout Step 1 - Información', () => {
    beforeEach(() => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
    });

    it('debe mostrar el formulario de checkout', () => {
      checkoutOne.verifyCheckoutStepOneDisplayed();
    });

    it('debe tener campos First Name, Last Name, Postal Code', () => {
      cy.get('#first-name').should('be.visible');
      cy.get('#last-name').should('be.visible');
      cy.get('#postal-code').should('be.visible');
    });

    it('debe tener botones Continue y Cancel', () => {
      cy.get('#continue').should('be.visible');
      cy.get('#cancel').should('be.visible');
    });

    it('debe validar campos vacíos', () => {
      checkoutOne.clickContinue();
      checkoutOne.verifyErrorDisplayed();
    });

    it('debe mostrar error con First Name vacío', () => {
      checkoutOne.fillLastName(validUser.lastName);
      checkoutOne.fillPostalCode(validUser.postalCode);
      checkoutOne.clickContinue();
      checkoutOne.getErrorMessage().should('be.visible');
    });

    it('debe mostrar error con Last Name vacío', () => {
      checkoutOne.fillFirstName(validUser.firstName);
      checkoutOne.fillPostalCode(validUser.postalCode);
      checkoutOne.clickContinue();
      checkoutOne.getErrorMessage().should('be.visible');
    });

    it('debe mostrar error con Postal Code vacío', () => {
      checkoutOne.fillFirstName(validUser.firstName);
      checkoutOne.fillLastName(validUser.lastName);
      checkoutOne.clickContinue();
      checkoutOne.getErrorMessage().should('be.visible');
    });

    it('debe continuar con datos válidos', () => {
      checkoutOne.completeCheckoutInfo(
        validUser.firstName,
        validUser.lastName,
        validUser.postalCode
      );
      checkoutTwo.verifyCheckoutOverviewDisplayed();
    });

    it('debe volver al carrito con Cancel', () => {
      checkoutOne.clickCancel();
      cartPage.verifyCartPageDisplayed();
    });

    it('debe aceptar caracteres especiales en el nombre', () => {
      checkoutOne.completeCheckoutInfo('María', 'García-López', '08001');
      checkoutTwo.verifyCheckoutOverviewDisplayed();
    });

    it('debe aceptar códigos postales internacionales', () => {
      checkoutOne.completeCheckoutInfo('John', 'Doe', '90210');
      checkoutTwo.verifyCheckoutOverviewDisplayed();
    });
  });

  describe('Checkout Step 2 - Overview', () => {
    beforeEach(() => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BIKE_LIGHT);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo(
        validUser.firstName,
        validUser.lastName,
        validUser.postalCode
      );
    });

    it('debe mostrar resumen de la orden', () => {
      checkoutTwo.verifyCheckoutOverviewDisplayed();
    });

    it('debe mostrar los productos en el resumen', () => {
      checkoutTwo.verifyProductInSummary('Sauce Labs Backpack');
      checkoutTwo.verifyProductInSummary('Sauce Labs Bike Light');
    });

    it('debe mostrar total de la compra', () => {
      checkoutTwo.getSummaryTotal().should('be.visible').and('contain', '$');
    });

    it('debe tener botón Finish', () => {
      checkoutTwo.getFinishButton().should('be.visible');
    });

    it('debe permitir cancelar y volver al inventario', () => {
      checkoutTwo.clickCancel();
      inventoryPage.verifyInventoryPageDisplayed();
    });
  });

  describe('Checkout completo', () => {
    it('debe completar la compra exitosamente', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo(
        validUser.firstName,
        validUser.lastName,
        validUser.postalCode
      );
      checkoutTwo.clickFinish();
      checkoutComplete.verifyOrderComplete();
    });

    it('debe mostrar mensaje de confirmación', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo(
        validUser.firstName,
        validUser.lastName,
        validUser.postalCode
      );
      checkoutTwo.clickFinish();
      checkoutComplete.getCompleteHeader().should('contain', 'Thank you for your order');
    });

    it('debe tener botón Back Home', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo(
        validUser.firstName,
        validUser.lastName,
        validUser.postalCode
      );
      checkoutTwo.clickFinish();
      checkoutComplete.getBackHomeButton().should('be.visible');
    });

    it('debe volver al inventario con Back Home', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo(
        validUser.firstName,
        validUser.lastName,
        validUser.postalCode
      );
      checkoutTwo.clickFinish();
      checkoutComplete.clickBackHome();
      inventoryPage.verifyInventoryPageDisplayed();
    });
  });

  describe('Flujo completo con múltiples productos', () => {
    it('debe completar checkout con 3 productos', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.FLEECE_JACKET);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.ONESIE);
      inventoryPage.goToCart();
      cartPage.clickCheckout();
      checkoutOne.completeCheckoutInfo(
        validUser.firstName,
        validUser.lastName,
        validUser.postalCode
      );
      checkoutTwo.verifyProductInSummary('Sauce Labs Backpack');
      checkoutTwo.verifyProductInSummary('Sauce Labs Fleece Jacket');
      checkoutTwo.verifyProductInSummary('Sauce Labs Onesie');
      checkoutTwo.clickFinish();
      checkoutComplete.verifyOrderComplete();
    });
  });
});
