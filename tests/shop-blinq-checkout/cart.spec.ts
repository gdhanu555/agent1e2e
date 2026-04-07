import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { VALID_USER, URLS } from '../fixtures/test-data';

/**
 * Cart Management Tests for SauceDemo
 * Tests TC-CART-001 through TC-CART-008
 */

test.describe('Cart Management - SauceDemo', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await page.waitForLoadState('networkidle');

    // Initialize pages
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    // Add products to cart for testing
    await productsPage.goto();
    await productsPage.addMultipleProductsToCart(2);
    await page.waitForTimeout(1000);
  });

  /**
   * TC-CART-001: View Cart Contents
   * Priority: High | Type: Happy Path
   */
  test('should display cart contents', async ({ page }) => {
    // Act
    await cartPage.goto();

    // Assert
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  /**
   * TC-CART-002: View Cart Item Details
   * Priority: High | Type: Happy Path
   */
  test('should display correct item details in cart', async ({ page }) => {
    // Act
    await cartPage.goto();

    // Assert
    const itemName = await cartPage.getItemName(0);
    const itemPrice = await cartPage.getItemPrice(0);
    const itemQty = await cartPage.getItemQuantity(0);

    expect(itemName).toBeTruthy();
    expect(itemName.length).toBeGreaterThan(0);
    expect(itemPrice).toBeTruthy();
    expect(itemPrice).toContain('$');
    expect(itemQty).toBe('1');
  });

  /**
   * TC-CART-003: Remove Item from Cart
   * Priority: High | Type: Happy Path
   */
  test('should remove item from cart', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    const initialCount = await cartPage.getCartItemCount();

    // Act
    await cartPage.removeItem(0);
    await page.waitForTimeout(1000);

    // Assert
    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBeLessThan(initialCount);
  });

  /**
   * TC-CART-004: Empty Cart Display
   * Priority: Medium | Type: Edge Case
   */
  test('should show empty cart when all items removed', async ({ page }) => {
    // Arrange
    await cartPage.goto();

    // Act - Remove all items
    const itemCount = await cartPage.getCartItemCount();
    for (let i = 0; i < itemCount; i++) {
      await cartPage.removeItem(0);
      await page.waitForTimeout(500);
    }

    // Assert
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });

  /**
   * TC-CART-005: Navigate to Checkout from Cart
   * Priority: High | Type: Happy Path
   */
  test('should navigate to checkout from cart', async ({ page }) => {
    // Arrange
    await cartPage.goto();

    // Act
    await cartPage.proceedToCheckout();

    // Assert
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  /**
   * TC-CART-006: Continue Shopping from Cart
   * Priority: Medium | Type: Happy Path
   */
  test('should navigate back to products when continuing shopping', async ({ page }) => {
    // Arrange
    await cartPage.goto();

    // Act
    await cartPage.continueShopping();

    // Assert
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * TC-CART-007: Multiple Items in Cart
   * Priority: Medium | Type: Happy Path
   */
  test('should display multiple items correctly', async ({ page }) => {
    // Arrange
    await productsPage.goto();
    await productsPage.addMultipleProductsToCart(3);
    await page.waitForTimeout(1000);

    // Act
    await cartPage.goto();

    // Assert
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(3);
  });
});
