/**
 * Page Object Model - Página de Login de SauceDemo
 */
class LoginPage {
  constructor() {
    this.url = '/';
    this.selectors = {
      usernameInput: '#user-name',
      passwordInput: '#password',
      loginButton: '#login-button',
      errorMessage: '[data-test="error"]',
      loginLogo: '.login_logo',
      botImage: '.bot_column',
      credentialBlock: '#login_credentials',
      passwordBlock: '.login_password'
    };
  }

  visit() {
    cy.visit(this.url);
  }

  fillUsername(username) {
    cy.get(this.selectors.usernameInput).clear().type(username);
    return this;
  }

  fillPassword(password) {
    cy.get(this.selectors.passwordInput).clear().type(password);
    return this;
  }

  clickLogin() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
    return this;
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  getUsernameInput() {
    return cy.get(this.selectors.usernameInput);
  }

  getPasswordInput() {
    return cy.get(this.selectors.passwordInput);
  }

  getLoginButton() {
    return cy.get(this.selectors.loginButton);
  }

  verifyLoginPageDisplayed() {
    cy.get(this.selectors.loginButton).should('be.visible');
    cy.get(this.selectors.usernameInput).should('be.visible');
    cy.get(this.selectors.passwordInput).should('be.visible');
    return this;
  }

  verifyErrorDisplayed(message) {
    this.getErrorMessage().should('be.visible');
    if (message) {
      this.getErrorMessage().should('contain.text', message);
    }
    return this;
  }
}

module.exports = LoginPage;
