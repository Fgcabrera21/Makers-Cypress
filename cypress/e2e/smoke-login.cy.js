/**
 * Smoke Test - Inicio de Sesión SauceDemo
 * Prueba Técnica Makers - Con reportes detallados (PDF + fotos por paso)
 */
const LoginPage = require('../page-objects/LoginPage');
const credentials = require('../fixtures/credentials');

describe('Smoke Test - Login SauceDemo', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('1. Login exitoso con credenciales válidas', () => {
    cy.step('01_pagina_login', 'Página de login de Sauce Demo cargada. Formulario con Username, Password y botón LOGIN visible.');

    loginPage.fillUsername(credentials.users.standard);
    loginPage.fillPassword(credentials.password);
    cy.step('02_credenciales_ingresadas', 'Credenciales válidas ingresadas (standard_user). Ambos campos completados.');

    loginPage.clickLogin();
    cy.url().should('include', '/inventory');
    cy.get('.title').should('contain', 'Products');
    cy.step('03_login_exitoso_inventario', 'Login exitoso. Redirigido al inventario. Título "Products" visible. Usuario autenticado.');
  });

  it('2. Login fallido con contraseña incorrecta', () => {
    loginPage.fillUsername(credentials.users.standard);
    loginPage.fillPassword('password_incorrecta');
    cy.step('04_login_form_contrasena_incorrecta', 'Credenciales ingresadas: usuario correcto, contraseña incorrecta. Listo para validar rechazo.');

    loginPage.clickLogin();
    loginPage.verifyErrorDisplayed('Username and password do not match');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    cy.step('05_error_contrasena_incorrecta', 'Error mostrado correctamente: "Username and password do not match". Login rechazado. Permanece en página de login.');
  });

  it('3. Validación de campos obligatorios', () => {
    cy.step('06_formulario_vacio', 'Formulario de login vacío. Sin usuario ni contraseña. Se validarán los campos obligatorios.');

    loginPage.clickLogin();
    loginPage.getErrorMessage().should('be.visible');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    cy.step('07_error_campos_obligatorios', 'Error de validación visible. La app requiere usuario y contraseña. Mensaje de error mostrado.');
  });
});
