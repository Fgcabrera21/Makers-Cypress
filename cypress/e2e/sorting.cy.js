/**
 * Casos de prueba para el ordenamiento de productos en SauceDemo
 */
const InventoryPage = require('../page-objects/InventoryPage');

describe('SauceDemo - Ordenamiento de Productos', () => {
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    cy.login();
  });

  describe('Ordenar por nombre', () => {
    it('debe ordenar A-Z (alfabéticamente ascendente)', () => {
      inventoryPage.selectSort(InventoryPage.SortOptions.NAME_A_Z);
      cy.get('.inventory_item_name').then(($els) => {
        const names = Cypress.$.makeArray($els).map((el) => Cypress.$(el).text().trim());
        const sorted = [...names].sort();
        expect(names).to.deep.equal(sorted);
      });
    });

    it('debe ordenar Z-A (alfabéticamente descendente)', () => {
      inventoryPage.selectSort(InventoryPage.SortOptions.NAME_Z_A);
      cy.get('.inventory_item_name').then(($els) => {
        const names = Cypress.$.makeArray($els).map((el) => Cypress.$(el).text().trim());
        const sorted = [...names].sort().reverse();
        expect(names).to.deep.equal(sorted);
      });
    });
  });

  describe('Ordenar por precio', () => {
    it('debe ordenar precio de bajo a alto', () => {
      inventoryPage.selectSort(InventoryPage.SortOptions.PRICE_LOW_HIGH);
      cy.get('.inventory_item_price').then(($els) => {
        const prices = Cypress.$.makeArray($els).map((el) =>
          parseFloat(Cypress.$(el).text().replace('$', ''))
        );
        const sorted = [...prices].sort((a, b) => a - b);
        expect(prices).to.deep.equal(sorted);
      });
    });

    it('debe ordenar precio de alto a bajo', () => {
      inventoryPage.selectSort(InventoryPage.SortOptions.PRICE_HIGH_LOW);
      cy.get('.inventory_item_price').then(($els) => {
        const prices = Cypress.$.makeArray($els).map((el) =>
          parseFloat(Cypress.$(el).text().replace('$', ''))
        );
        const sorted = [...prices].sort((a, b) => b - a);
        expect(prices).to.deep.equal(sorted);
      });
    });
  });

  describe('Persistencia del orden', () => {
    it('el orden debe mantenerse al agregar producto al carrito', () => {
      inventoryPage.selectSort(InventoryPage.SortOptions.PRICE_LOW_HIGH);
      cy.get('.inventory_item_name').first().invoke('text').then((firstProductBefore) => {
        inventoryPage.addProductToCart(InventoryPage.ProductIds.BACKPACK);
        cy.get('.inventory_item_name').first().invoke('text').then((firstProductAfter) => {
          expect(firstProductBefore.trim()).to.equal(firstProductAfter.trim());
        });
      });
    });
  });
});
