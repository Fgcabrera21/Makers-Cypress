/**
 * Casos de prueba EXHAUSTIVOS para la página de Inventario de SauceDemo
 */
const InventoryPage = require('../page-objects/InventoryPage');

describe('SauceDemo - Inventario de Productos', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    cy.login();
  });

  describe('Visualización del inventario', () => {
    it('debe mostrar la página de inventario', () => {
      inventoryPage.verifyInventoryPageDisplayed();
    });

    it('debe mostrar el título Products', () => {
      cy.get('.title').should('contain', 'Products');
    });

    it('debe mostrar la lista de productos', () => {
      inventoryPage.verifyProductsDisplayed();
    });

    it('debe mostrar al menos 6 productos', () => {
      inventoryPage.getInventoryItems().should('have.length', 6);
    });

    it('cada producto debe tener nombre, precio y botón Add to cart', () => {
      inventoryPage.getInventoryItems().each(($el) => {
        cy.wrap($el).find('.inventory_item_name').should('exist');
        cy.wrap($el).find('.inventory_item_price').should('exist');
        cy.wrap($el).find('button').should('exist');
      });
    });

    it('debe mostrar el carrito en el header', () => {
      cy.get(inventoryPage.selectors.shoppingCartLink).should('be.visible');
    });

    it('debe mostrar el menú hamburguesa', () => {
      cy.get(inventoryPage.selectors.menuButton).should('be.visible');
    });

    it('debe mostrar el dropdown de ordenamiento', () => {
      cy.get(inventoryPage.selectors.sortDropdown).should('be.visible');
    });
  });

  describe('Agregar productos al carrito', () => {
    it('debe agregar Sauce Labs Backpack al carrito', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.verifyCartBadgeCount(1);
      inventoryPage.getRemoveButton(InventoryPage.ProductIds.BACKPACK).should('be.visible');
    });

    it('debe agregar múltiples productos al carrito', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BIKE_LIGHT);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BOLT_TSHIRT);
      inventoryPage.verifyCartBadgeCount(3);
    });

    it('debe cambiar el botón a Remove después de agregar', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      cy.get('#remove-sauce-labs-backpack').should('contain', 'Remove');
    });

    it('debe poder agregar todos los productos disponibles', () => {
      for (let i = 0; i < 6; i++) {
        inventoryPage.addProductByIndex(i);
      }
      inventoryPage.verifyCartBadgeCount(6);
    });
  });

  describe('Quitar productos del carrito', () => {
    it('debe quitar producto del carrito', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.verifyCartBadgeCount(1);
      inventoryPage.removeProductFromCart(InventoryPage.ProductIds.BACKPACK);
      cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('debe actualizar el badge al quitar productos', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BIKE_LIGHT);
      inventoryPage.removeProductFromCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.verifyCartBadgeCount(1);
    });
  });

  describe('Navegación al carrito', () => {
    it('debe navegar al carrito al hacer click en el icono', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cy.url().should('include', '/cart');
    });

    it('el carrito debe mostrar los productos agregados', () => {
      inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
      inventoryPage.goToCart();
      cy.get('.cart_item').should('contain', 'Sauce Labs Backpack');
    });
  });

  describe('Nombres de productos', () => {
    it('debe contener los productos esperados de Sauce Labs', () => {
      const expectedProducts = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)'
      ];
      expectedProducts.forEach((productName) => {
        cy.get('.inventory_list').should('contain', productName);
      });
    });
  });
});
