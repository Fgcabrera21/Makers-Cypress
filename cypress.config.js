const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'test-results/html-report',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: 'SauceDemo - Reporte de Pruebas Cypress',
  },
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'test-results/step-screenshots',
    trashAssetsBeforeRuns: false,
    allowCypressEnv: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    retries: {
      runMode: 1,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      require('./cypress/plugins/report-plugin')(on, config);
    },
    supportFile: 'cypress/support/e2e.js',
    specPattern: ['cypress/e2e/smoke-login.cy.js', 'cypress/e2e/api/reqres-users.cy.js']
  }
});
