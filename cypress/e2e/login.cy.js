/**
 * Casos de prueba EXHAUSTIVOS para la página de Login de SauceDemo
 */
const LoginPage = require('../page-objects/LoginPage');
const credentials = require('../fixtures/credentials');

describe('SauceDemo - Login', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  describe('Visualización de la página de login', () => {
    it('debe mostrar la página de login correctamente', () => {
      loginPage.verifyLoginPageDisplayed();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('debe mostrar el logo de Swag Labs', () => {
      cy.get('.login_logo').should('be.visible').and('contain', 'Swag Labs');
    });

    it('debe mostrar el campo de usuario', () => {
      loginPage.getUsernameInput().should('be.visible').and('have.attr', 'placeholder');
    });

    it('debe mostrar el campo de contraseña', () => {
      loginPage.getPasswordInput().should('be.visible').and('have.attr', 'type', 'password');
    });

    it('debe mostrar el botón de login', () => {
      loginPage.getLoginButton().should('be.visible').and('have.value', 'Login');
    });

    it('debe mostrar el bloque de credenciales de ejemplo', () => {
      cy.get('#login_credentials').should('be.visible');
    });

    it('debe mostrar la contraseña para todos los usuarios', () => {
      cy.get('.login_password').should('be.visible').and('contain', 'secret_sauce');
    });
  });

  describe('Login con credenciales válidas', () => {
    it('debe permitir login con standard_user', () => {
      loginPage.login(credentials.users.standard, credentials.password);
      cy.url().should('include', '/inventory');
      cy.get('.title').should('contain', 'Products');
    });

    it('debe permitir login con problem_user', () => {
      loginPage.login(credentials.users.problem, credentials.password);
      cy.url().should('include', '/inventory');
    });

    it('debe permitir login con performance_glitch_user', () => {
      loginPage.login(credentials.users.performance, credentials.password);
      cy.url().should('include', '/inventory');
    });

    it('debe permitir login con error_user', () => {
      loginPage.login(credentials.users.error, credentials.password);
      cy.url().should('include', '/inventory');
    });

    it('debe permitir login con visual_user', () => {
      loginPage.login(credentials.users.visual, credentials.password);
      cy.url().should('include', '/inventory');
    });
  });

  describe('Login con usuario bloqueado', () => {
    it('debe mostrar error al intentar login con locked_out_user', () => {
      loginPage.login(credentials.users.locked, credentials.password);
      loginPage.verifyErrorDisplayed('Sorry, this user has been locked out');
    });

    it('debe permanecer en la página de login con locked_out_user', () => {
      loginPage.login(credentials.users.locked, credentials.password);
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });
  });

  describe('Login con credenciales inválidas', () => {
    it('debe mostrar error con usuario incorrecto', () => {
      loginPage.login('usuario_inexistente', credentials.password);
      loginPage.verifyErrorDisplayed('Username and password do not match');
    });

    it('debe mostrar error con contraseña incorrecta', () => {
      loginPage.login(credentials.users.standard, 'password_incorrecta');
      loginPage.verifyErrorDisplayed('Username and password do not match');
    });

    it('debe mostrar error con ambos campos incorrectos', () => {
      loginPage.login('wrong_user', 'wrong_pass');
      loginPage.verifyErrorDisplayed('Username and password do not match');
    });

    it('debe permanecer en login con credenciales inválidas', () => {
      loginPage.login('invalid', 'invalid');
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });
  });

  describe('Campos vacíos', () => {
    it('debe mostrar error con usuario vacío', () => {
      loginPage.fillPassword(credentials.password);
      loginPage.clickLogin();
      loginPage.verifyErrorDisplayed('Username is required');
    });

    it('debe mostrar error con contraseña vacía', () => {
      loginPage.fillUsername(credentials.users.standard);
      loginPage.clickLogin();
      loginPage.verifyErrorDisplayed('Password is required');
    });

    it('debe mostrar error con ambos campos vacíos', () => {
      loginPage.clickLogin();
      loginPage.getErrorMessage().should('be.visible');
    });
  });

  describe('Validación de entrada', () => {
    it('debe permitir ingresar texto en el campo usuario', () => {
      loginPage.fillUsername('test_user');
      loginPage.getUsernameInput().should('have.value', 'test_user');
    });

    it('debe permitir ingresar texto en el campo contraseña', () => {
      loginPage.fillPassword('test_pass');
      loginPage.getPasswordInput().should('have.value', 'test_pass');
    });

    it('debe limpiar campos correctamente con clear', () => {
      loginPage.fillUsername('user');
      loginPage.fillPassword('pass');
      loginPage.getUsernameInput().clear();
      loginPage.getPasswordInput().clear();
      loginPage.getUsernameInput().should('have.value', '');
      loginPage.getPasswordInput().should('have.value', '');
    });
  });

  describe('Seguridad y UX', () => {
    it('no debe exponer la contraseña en el DOM', () => {
      loginPage.getPasswordInput().should('have.attr', 'type', 'password');
    });

    it('debe poder hacer login después de un intento fallido', () => {
      loginPage.login('wrong', 'wrong');
      loginPage.getErrorMessage().should('be.visible');
      loginPage.login(credentials.users.standard, credentials.password);
      cy.url().should('include', '/inventory');
    });
  });
});
