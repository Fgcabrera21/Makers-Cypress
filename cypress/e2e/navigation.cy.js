/**
 * Casos de prueba para navegación y menú de SauceDemo
 */
const LoginPage = require('../page-objects/LoginPage');
const InventoryPage = require('../page-objects/InventoryPage');
const CartPage = require('../page-objects/CartPage');

describe('SauceDemo - Navegación y Menú', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.login();
  });

  describe('Menú lateral', () => {
    it('debe abrir el menú al hacer click en el icono hamburguesa', () => {
      inventoryPage.openMenu();
      cy.get('.bm-menu-wrap').should('be.visible');
    });

    it('debe mostrar opción All Items en el menú', () => {
      inventoryPage.openMenu();
      cy.get('#inventory_sidebar_link').should('be.visible').and('contain', 'All Items');
    });

    it('debe mostrar opción About en el menú', () => {
      inventoryPage.openMenu();
      cy.get('#about_sidebar_link').should('be.visible').and('contain', 'About');
    });

    it('debe mostrar opción Logout en el menú', () => {
      inventoryPage.openMenu();
      cy.get('#logout_sidebar_link').should('be.visible').and('contain', 'Logout');
    });

    it('debe mostrar opción Reset App State', () => {
      inventoryPage.openMenu();
      cy.get('#reset_sidebar_link').should('be.visible');
    });

    it('debe cerrar sesión correctamente', () => {
      inventoryPage.logout();
      loginPage.verifyLoginPageDisplayed();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('debe navegar a All Items desde el menú', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.clickProductLink('Sauce Labs Bike Light');
      cy.url().should('include', 'inventory-item');
      inventoryPage.openMenu();
      cy.get('#inventory_sidebar_link').click();
      inventoryPage.verifyInventoryPageDisplayed();
    });
  });

  describe('Logo y header', () => {
    it('el logo debe estar visible en inventario', () => {
      cy.get('.app_logo').should('be.visible');
    });

    it('el logo debe contener "Swag Labs"', () => {
      cy.get('.app_logo').should('contain', 'Swag Labs');
    });
  });

  describe('Navegación por URL', () => {
    it('debe redirigir a login si se accede a inventario sin estar logueado', () => {
      inventoryPage.logout();
      cy.visit('/inventory.html', { failOnStatusCode: false });
      cy.get('#login-button').should('be.visible');
    });

    it('no debe permitir ver el carrito sin estar logueado', () => {
      inventoryPage.logout();
      cy.visit('/cart.html', { failOnStatusCode: false });
      cy.get('.cart_list').should('not.exist');
      cy.get('#login-button, .login_logo, body').should('exist');
    });

    it('no debe permitir ver checkout sin estar logueado', () => {
      inventoryPage.logout();
      cy.visit('/checkout-step-one.html', { failOnStatusCode: false });
      cy.get('#first-name').should('not.exist');
      cy.get('#login-button, .login_logo, body').should('exist');
    });
  });

  describe('Botón cerrar menú', () => {
    it('debe poder cerrar el menú con el botón X', () => {
      inventoryPage.openMenu();
      cy.get('.bm-menu-wrap').should('be.visible');
      cy.get('#react-burger-cross-btn').click();
      cy.get('.bm-menu-wrap').should('not.be.visible');
    });
  });
});
