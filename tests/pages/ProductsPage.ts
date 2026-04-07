import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Products Page Object Model for SauceDemo
 * URL: https://www.saucedemo.com/inventory.html
 */
export class ProductsPage extends BasePage {
  // Page locators for SauceDemo
  readonly productList: Locator;
  readonly addToCartButtons: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);

    // SauceDemo specific selectors
    this.productList = page.locator('.inventory_list');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
    this.cartIcon = page.locator('a.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  /**
   * Navigate to products page
   */
  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<Locator[]> {
    await this.waitForVisible(this.productList);
    const items = this.page.locator('.inventory_item');
    return await items.all();
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    const products = await this.getProducts();
    return products.length;
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(index: number = 0): Promise<void> {
    const buttons = await this.addToCartButtons.all();
    if (index < buttons.length) {
      await buttons[index].click();
      await this.wait(500);
    }
  }

  /**
   * Add multiple products to cart
   */
  async addMultipleProductsToCart(count: number): Promise<void> {
    for (let i = 0; i < count && i < 6; i++) {
      await this.addProductToCart(i);
    }
  }

  /**
   * Get cart badge count
   */
  async getCartCount(): Promise<string> {
    const badge = this.cartBadge.first();
    if (await badge.isVisible()) {
      return await this.getText(badge);
    }
    return '0';
  }

  /**
   * Click on cart icon
   */
  async goToCart(): Promise<void> {
    await this.click(this.cartIcon);
  }

  /**
   * Get product name by index
   */
  async getProductName(index: number): Promise<string> {
    const names = await this.productNames.all();
    if (index < names.length) {
      return await this.getText(names[index]);
    }
    return '';
  }

  /**
   * Get product price by index
   */
  async getProductPrice(index: number): Promise<string> {
    const prices = await this.productPrices.all();
    if (index < prices.length) {
      return await this.getText(prices[index]);
    }
    return '';
  }
}
