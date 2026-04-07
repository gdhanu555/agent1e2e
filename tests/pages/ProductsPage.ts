import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Products Page Object Model
 */
export class ProductsPage extends BasePage {
  // Page locators
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly cartIcon: Locator;
  readonly cartCount: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators - will be updated after exploratory testing
    this.productGrid = page.locator('.product-grid, .products, [data-testid="product-list"]').first();
    this.productCards = page.locator('.product, .product-item, [data-testid="product"]');
    this.cartIcon = page.locator('.cart, [data-testid="cart"], a[href*="cart"], .cart-icon').first();
    this.cartCount = page.locator('.cart-count, [data-testid="cart-count"], .badge').first();
    this.addToCartButtons = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), .add-to-cart');
  }

  /**
   * Navigate to products page
   */
  async goto(): Promise<void> {
    await this.page.goto('/products');
  }

  /**
   * Get all product cards
   */
  async getProductCards(): Promise<Locator[]> {
    await this.waitForVisible(this.productGrid);
    return await this.productCards.all();
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    const cards = await this.getProductCards();
    return cards.length;
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(index: number = 0): Promise<void> {
    const buttons = await this.addToCartButtons.all();
    if (index < buttons.length) {
      await buttons[index].click();
      await this.wait(500); // Wait for cart update
    }
  }

  /**
   * Add multiple products to cart
   */
  async addMultipleProductsToCart(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addProductToCart(i);
    }
  }

  /**
   * Get cart item count
   */
  async getCartCount(): Promise<string> {
    const text = await this.getText(this.cartCount);
    return text.trim();
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
    const cards = await this.getProductCards();
    if (index < cards.length) {
      const name = cards[index].locator('.product-name, .name, h3, h4').first();
      return await this.getText(name);
    }
    return '';
  }

  /**
   * Get product price by index
   */
  async getProductPrice(index: number): Promise<string> {
    const cards = await this.getProductCards();
    if (index < cards.length) {
      const price = cards[index].locator('.price, .product-price, [data-testid="price"]').first();
      return await this.getText(price);
    }
    return '';
  }
}
