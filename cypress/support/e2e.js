// ***********************************************************
// This file is processed and loaded automatically before test files.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js and mochawesome reporter
require('./commands');
require('cypress-mochawesome-reporter/register');

// Ocultar errores no críticos en los tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false evita que Cypress falle el test por errores no capturados
  if (err.message.includes('ResizeObserver') || err.message.includes('Script error')) {
    return false;
  }
  return true;
});
