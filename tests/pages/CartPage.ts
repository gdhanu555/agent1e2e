import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object Model for SauceDemo
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage extends BasePage {
  // Page locators for SauceDemo
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);

    // SauceDemo specific selectors
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.removeButtons = page.locator('button[data-test^="remove"]');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
  }

  /**
   * Navigate to cart page
   */
  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  /**
   * Get all cart items
   */
  async getCartItems(): Promise<Locator[]> {
    return await this.cartItems.all();
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const items = await this.getCartItems();
    return items.length;
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  /**
   * Get item name by index
   */
  async getItemName(index: number): Promise<string> {
    const names = await this.cartItemNames.all();
    if (index < names.length) {
      return await this.getText(names[index]);
    }
    return '';
  }

  /**
   * Get item price by index
   */
  async getItemPrice(index: number): Promise<string> {
    const prices = await this.cartItemPrices.all();
    if (index < prices.length) {
      return await this.getText(prices[index]);
    }
    return '';
  }

  /**
   * Get item quantity by index
   */
  async getItemQuantity(index: number): Promise<string> {
    const qtys = await this.cartItemQuantities.all();
    if (index < qtys.length) {
      return await this.getText(qtys[index]);
    }
    return '';
  }

  /**
   * Remove item by index
   */
  async removeItem(itemIndex: number): Promise<void> {
    const buttons = await this.removeButtons.all();
    if (itemIndex < buttons.length) {
      await buttons[itemIndex].click();
      await this.wait(500);
    }
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }
}
