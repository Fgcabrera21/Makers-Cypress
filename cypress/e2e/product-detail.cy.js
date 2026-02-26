/**
 * Casos de prueba para la página de detalle de producto
 */
const InventoryPage = require('../page-objects/InventoryPage');
const ProductDetailPage = require('../page-objects/ProductDetailPage');

describe('SauceDemo - Detalle de Producto', () => {
  const inventoryPage = new InventoryPage();
  const productDetailPage = new ProductDetailPage();

  beforeEach(() => {
    cy.login();
  });

  describe('Navegación al detalle', () => {
    it('debe navegar al detalle al hacer click en un producto', () => {
      inventoryPage.clickProductLink('Sauce Labs Backpack');
      productDetailPage.verifyProductDetailDisplayed();
    });

    it('debe mostrar el nombre del producto correcto', () => {
      inventoryPage.clickProductLink('Sauce Labs Backpack');
      productDetailPage.getProductName().should('contain', 'Sauce Labs Backpack');
    });

    it('debe mostrar el precio del producto', () => {
      inventoryPage.clickProductLink('Sauce Labs Backpack');
      productDetailPage.getProductPrice().should('be.visible').and('contain', '$');
    });
  });

  describe('Agregar al carrito desde detalle', () => {
    it('debe agregar producto al carrito desde la página de detalle', () => {
      inventoryPage.clickProductLink('Sauce Labs Backpack');
      productDetailPage.addToCart();
      productDetailPage.getRemoveButton().should('be.visible');
    });

    it('debe actualizar el badge del carrito desde detalle', () => {
      inventoryPage.clickProductLink('Sauce Labs Bike Light');
      productDetailPage.addToCart();
      cy.get('.shopping_cart_badge').should('have.text', '1');
    });
  });

  describe('Botón Back to products', () => {
    it('debe volver al inventario al hacer click en Back to products', () => {
      inventoryPage.clickProductLink('Sauce Labs Onesie');
      productDetailPage.backToProducts();
      inventoryPage.verifyInventoryPageDisplayed();
    });
  });

  describe('Múltiples productos', () => {
    it('debe mostrar detalles correctos para diferentes productos', () => {
      const products = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket'];
      products.forEach((productName) => {
        inventoryPage.visit();
        inventoryPage.clickProductLink(productName);
        productDetailPage.getProductName().should('contain', productName);
        productDetailPage.backToProducts();
      });
    });
  });
});
