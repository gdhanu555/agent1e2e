import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model for SauceDemo
 * URL: https://www.saucedemo.com
 */
export class LoginPage extends BasePage {
  // Page locators for SauceDemo
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // SauceDemo specific selectors
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('h3[data-test="error"]');
  }

  /**
   * Navigate to login page (SauceDemo root is login)
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if login was successful (redirected to inventory)
   */
  async isLoginSuccessful(): Promise<boolean> {
    return this.page.url().includes('inventory.html');
  }
}
