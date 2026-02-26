// ***********************************************
// Comandos personalizados para SauceDemo
// ***********************************************

const LoginPage = require('../page-objects/LoginPage');
const credentials = require('../fixtures/credentials');

/**
 * Login con credenciales válidas (standard_user por defecto)
 * @param {string} username - Usuario (default: standard_user)
 * @param {string} password - Contraseña (default: secret_sauce)
 */
Cypress.Commands.add('login', (username = credentials.users.standard, password = credentials.password) => {
  const loginPage = new LoginPage();
  loginPage.visit();
  loginPage.fillUsername(username);
  loginPage.fillPassword(password);
  loginPage.clickLogin();
});

/**
 * Login con credenciales inválidas
 */
Cypress.Commands.add('loginInvalid', (username, password) => {
  const loginPage = new LoginPage();
  loginPage.visit();
  loginPage.fillUsername(username);
  loginPage.fillPassword(password);
  loginPage.clickLogin();
});

/**
 * Documenta un paso del test con captura de pantalla para el reporte PDF.
 * @param {string} stepName - Nombre del paso (ej: 01_pagina_login)
 * @param {string} [description] - Descripción legible para no-QA
 */
Cypress.Commands.add('step', (stepName, description) => {
  const specRelative = (Cypress.spec?.relative || 'cypress/e2e/smoke-login.cy.js').replace(/\\/g, '/');
  const testTitle = Cypress.currentTest?.title || 'Test';
  cy.task('recordStep', { specRelative, testTitle, stepName, description }).then(({ screenshotName }) => {
    cy.screenshot(screenshotName.replace('.png', ''), { overwrite: true });
  });
});

/**
 * Ejecuta petición API y la registra para el reporte PDF.
 * @param {string} stepName - Nombre del paso (ej: POST /users)
 * @param {object} options - Opciones de cy.request (method, url, body, etc.)
 * @returns {Cypress.Chainable} - Respuesta de la petición
 */
Cypress.Commands.add('requestAndRecord', (stepName, options) => {
  const specRelative = (Cypress.spec?.relative || '').replace(/\\/g, '/');
  const testTitle = Cypress.currentTest?.title || 'Test';
  return cy.request(options).then((response) => {
    return cy.task('recordApiStep', {
      specRelative,
      testTitle,
      stepName,
      method: options.method || 'GET',
      url: options.url,
      requestBody: options.body,
      status: response.status,
      responseBody: response.body
    }).then(() => response);
  });
});
