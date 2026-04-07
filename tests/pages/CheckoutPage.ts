import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Page Object Model
 * URL: https://shop-blinq.com/checkout
 */
export class CheckoutPage extends BasePage {
  // Shipping form locators
  readonly fullNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly countryInput: Locator;
  readonly emailInput: Locator;

  // Payment form locators
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvvInput: Locator;
  readonly cardholderNameInput: Locator;

  // Order summary locators
  readonly orderSummary: Locator;
  readonly orderItems: Locator;
  readonly orderTotal: Locator;

  // Action buttons
  readonly placeOrderButton: Locator;
  readonly reviewOrderButton: Locator;
  readonly continueButton: Locator;

  // Confirmation locators
  readonly orderConfirmation: Locator;
  readonly orderNumber: Locator;

  // Error locators
  readonly validationErrors: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Shipping form locators
    this.fullNameInput = page.locator('input[name*="name"], input[name*="full"], #fullName, #shippingName').first();
    this.addressInput = page.locator('input[name*="address"], #address, #shippingAddress').first();
    this.cityInput = page.locator('input[name*="city"], #city').first();
    this.stateInput = page.locator('input[name*="state"], select[name*="state"], #state').first();
    this.zipInput = page.locator('input[name*="zip"], input[name*="postal"], #zip, #postalCode').first();
    this.countryInput = page.locator('select[name*="country"], #country').first();
    this.emailInput = page.locator('input[name*="email"], input[type="email"]').first();

    // Payment form locators
    this.cardNumberInput = page.locator('input[name*="card"], input[name*="number"], #cardNumber').first();
    this.expiryInput = page.locator('input[name*="expiry"], input[name*="exp"], #expiry').first();
    this.cvvInput = page.locator('input[name*="cvv"], input[name*="cvc"], #cvv').first();
    this.cardholderNameInput = page.locator('input[name*="holder"], #cardName').first();

    // Order summary
    this.orderSummary = page.locator('.order-summary, [data-testid="order-summary"]');
    this.orderItems = page.locator('.order-item, [data-testid="order-item"]');
    this.orderTotal = page.locator('.order-total, [data-testid="order-total"], .total');

    // Action buttons
    this.placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Complete Order"), [data-testid="place-order"]');
    this.reviewOrderButton = page.locator('button:has-text("Review"), button:has-text("Review Order")');
    this.continueButton = page.locator('button:has-text("Continue"), button:has-text("Next")');

    // Confirmation
    this.orderConfirmation = page.locator('.order-confirmation, [data-testid="confirmation"], :text("Thank you")');
    this.orderNumber = page.locator('.order-number, [data-testid="order-number"]');

    // Errors
    this.validationErrors = page.locator('.error, .validation-error, [data-testid="error"]');
    this.errorMessage = page.locator('.error-message, [role="alert"]');
  }

  /**
   * Navigate to checkout page
   */
  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }

  /**
   * Fill shipping form
   */
  async fillShippingForm(data: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email?: string;
  }): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
    await this.countryInput.selectOption(data.country);
    if (data.email) {
      await this.emailInput.fill(data.email);
    }
  }

  /**
   * Fill payment form
   */
  async fillPaymentForm(data: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardholderName: string;
  }): Promise<void> {
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expiryInput.fill(data.expiry);
    await this.cvvInput.fill(data.cvv);
    await this.cardholderNameInput.fill(data.cardholderName);
  }

  /**
   * Fill all checkout forms
   */
  async fillCheckoutForm(shipping: any, payment: any): Promise<void> {
    await this.fillShippingForm(shipping);
    await this.fillPaymentForm(payment);
  }

  /**
   * Place order
   */
  async placeOrder(): Promise<void> {
    await this.click(this.placeOrderButton);
  }

  /**
   * Click continue button
   */
  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  /**
   * Click review order button
   */
  async clickReviewOrder(): Promise<void> {
    await this.click(this.reviewOrderButton);
  }

  /**
   * Get order confirmation text
   */
  async getOrderConfirmation(): Promise<string> {
    await this.waitForVisible(this.orderConfirmation);
    return await this.getText(this.orderConfirmation);
  }

  /**
   * Get order number
   */
  async getOrderNumber(): Promise<string> {
    await this.waitForVisible(this.orderNumber);
    return await this.getText(this.orderNumber);
  }

  /**
   * Get order total
   */
  async getOrderTotal(): Promise<string> {
    return await this.getText(this.orderTotal);
  }

  /**
   * Get all validation errors
   */
  async getValidationErrors(): Promise<string[]> {
    const errors = await this.validationErrors.all();
    const errorTexts: string[] = [];
    for (const error of errors) {
      if (await error.isVisible()) {
        errorTexts.push(await this.getText(error));
      }
    }
    return errorTexts;
  }

  /**
   * Check if there are validation errors
   */
  async hasValidationErrors(): Promise<boolean> {
    const errors = await this.getValidationErrors();
    return errors.length > 0;
  }

  /**
   * Get order item count
   */
  async getOrderItemCount(): Promise<number> {
    const items = await this.orderItems.all();
    return items.length;
  }
}
