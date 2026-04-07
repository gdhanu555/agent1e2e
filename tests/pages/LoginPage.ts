import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * URL: https://shop-blinq.com/login
 */
export class LoginPage extends BasePage {
  // Page locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators - will be updated after exploratory testing
    this.usernameInput = page.locator('input[name="username"], input[type="text"], input[id*="user"], input[id*="email"]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), input[type="submit"]').first();
    this.errorMessage = page.locator('.error, .alert-danger, [role="alert"], .message-error').first();
    this.successMessage = page.locator('.success, .alert-success, .message-success').first();
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
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
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForVisible(this.successMessage);
    return await this.getText(this.successMessage);
  }
}
