import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Page Object Model for SauceDemo
 * URL: https://www.saucedemo.com/checkout-step-one.html
 */
export class CheckoutPage extends BasePage {
  // Checkout Step 1 - Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  // Checkout Step 2 - Overview
  readonly finishButton: Locator;
  readonly cartItems: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  // Checkout Complete
  readonly completeHeader: Locator;
  readonly completeMessage: Locator;
  readonly backHomeButton: Locator;

  // Errors
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Checkout Step 1 locators
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.zipInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');

    // Checkout Step 2 locators
    this.finishButton = page.locator('#finish');
    this.cartItems = page.locator('.cart_item');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');

    // Checkout Complete locators
    this.completeHeader = page.locator('h2.complete-header');
    this.completeMessage = page.locator('.complete-text');
    this.backHomeButton = page.locator('#back-to-products');

    // Error locator
    this.errorMessage = page.locator('h3[data-test="error"]');
  }

  /**
   * Navigate to checkout page
   */
  async goto(): Promise<void> {
    await this.page.goto('/checkout-step-one.html');
  }

  /**
   * Fill checkout form (SauceDemo only needs: first name, last name, zip)
   */
  async fillCheckoutForm(data: {
    firstName: string;
    lastName: string;
    zip: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.zipInput.fill(data.zip);
  }

  /**
   * Click continue to go to checkout overview
   */
  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  /**
   * Click finish to complete order
   */
  async clickFinish(): Promise<void> {
    await this.click(this.finishButton);
  }

  /**
   * Complete full checkout flow
   */
  async completeCheckout(data: {
    firstName: string;
    lastName: string;
    zip: string;
  }): Promise<void> {
    await this.fillCheckoutForm(data);
    await this.clickContinue();
    await this.wait(500);
    await this.clickFinish();
    await this.wait(1000);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if there are errors
   */
  async hasError(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get order total
   */
  async getOrderTotal(): Promise<string> {
    return await this.getText(this.total);
  }

  /**
   * Get item subtotal
   */
  async getItemSubtotal(): Promise<string> {
    return await this.getText(this.itemTotal);
  }

  /**
   * Get order item count
   */
  async getOrderItemCount(): Promise<number> {
    const items = await this.cartItems.all();
    return items.length;
  }

  /**
   * Check if checkout is complete
   */
  async isComplete(): Promise<boolean> {
    return await this.isVisible(this.completeHeader);
  }

  /**
   * Get complete message
   */
  async getCompleteMessage(): Promise<string> {
    if (await this.isVisible(this.completeHeader)) {
      return await this.getText(this.completeHeader);
    }
    return '';
  }

  /**
   * Go back to products
   */
  async backToProducts(): Promise<void> {
    await this.click(this.backHomeButton);
  }
}
