import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object Model
 */
export class CartPage extends BasePage {
  // Page locators
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartTotal: Locator;
  readonly subtotal: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly quantityInputs: Locator;
  readonly removeButtons: Locator;
  readonly increaseButtons: Locator;
  readonly decreaseButtons: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators - will be updated after exploratory testing
    this.cartItems = page.locator('.cart-item, [data-testid="cart-item"], tr.cart-item');
    this.emptyCartMessage = page.locator(':text("Your cart is empty"), .empty-cart, [data-testid="empty-cart"]');
    this.cartTotal = page.locator('.cart-total, [data-testid="cart-total"], .total');
    this.subtotal = page.locator('.subtotal, [data-testid="subtotal"]');
    this.checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Proceed to Checkout"), [data-testid="checkout"]');
    this.continueShoppingButton = page.locator('a:has-text("Continue Shopping"), button:has-text("Continue")');
    this.quantityInputs = page.locator('.quantity input, input[type="number"], [data-testid="quantity"]');
    this.removeButtons = page.locator('button:has-text("Remove"), .remove-item, [data-testid="remove"]');
    this.increaseButtons = page.locator('.quantity-plus, button:has-text("+"), [data-testid="increase"]');
    this.decreaseButtons = page.locator('.quantity-minus, button:has-text("-"), [data-testid="decrease"]');
  }

  /**
   * Navigate to cart page
   */
  async goto(): Promise<void> {
    await this.page.goto('/cart');
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
    return await this.isVisible(this.emptyCartMessage);
  }

  /**
   * Get cart total amount
   */
  async getCartTotal(): Promise<string> {
    await this.waitForVisible(this.cartTotal);
    return await this.getText(this.cartTotal);
  }

  /**
   * Get subtotal amount
   */
  async getSubtotal(): Promise<string> {
    return await this.getText(this.subtotal);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  /**
   * Set quantity for item by index
   */
  async setQuantity(itemIndex: number, quantity: number): Promise<void> {
    const inputs = await this.quantityInputs.all();
    if (itemIndex < inputs.length) {
      await inputs[itemIndex].fill(quantity.toString());
      await this.wait(500); // Wait for price update
    }
  }

  /**
   * Increase quantity for item by index
   */
  async increaseQuantity(itemIndex: number): Promise<void> {
    const buttons = await this.increaseButtons.all();
    if (itemIndex < buttons.length) {
      await buttons[itemIndex].click();
      await this.wait(500); // Wait for price update
    }
  }

  /**
   * Decrease quantity for item by index
   */
  async decreaseQuantity(itemIndex: number): Promise<void> {
    const buttons = await this.decreaseButtons.all();
    if (itemIndex < buttons.length) {
      await buttons[itemIndex].click();
      await this.wait(500); // Wait for price update
    }
  }

  /**
   * Remove item by index
   */
  async removeItem(itemIndex: number): Promise<void> {
    const buttons = await this.removeButtons.all();
    if (itemIndex < buttons.length) {
      await buttons[itemIndex].click();
      await this.wait(500); // Wait for cart update
    }
  }

  /**
   * Get item name by index
   */
  async getItemName(index: number): Promise<string> {
    const items = await this.getCartItems();
    if (index < items.length) {
      const name = items[index].locator('.item-name, .product-name, .name').first();
      return await this.getText(name);
    }
    return '';
  }

  /**
   * Get item price by index
   */
  async getItemPrice(index: number): Promise<string> {
    const items = await this.getCartItems();
    if (index < items.length) {
      const price = items[index].locator('.item-price, .price, [data-testid="price"]').first();
      return await this.getText(price);
    }
    return '';
  }

  /**
   * Get item quantity by index
   */
  async getItemQuantity(index: number): Promise<string> {
    const items = await this.getCartItems();
    if (index < items.length) {
      const qty = items[index].locator('.item-quantity, .quantity, [data-testid="quantity"]').first();
      return await this.getText(qty);
    }
    return '';
  }

  /**
   * Get item subtotal by index
   */
  async getItemSubtotal(index: number): Promise<string> {
    const items = await this.getCartItems();
    if (index < items.length) {
      const subtotal = items[index].locator('.item-subtotal, .subtotal').first();
      return await this.getText(subtotal);
    }
    return '';
  }
}
