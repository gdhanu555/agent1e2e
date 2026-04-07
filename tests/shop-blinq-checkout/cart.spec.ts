import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { VALID_USER, URLS } from '../fixtures/test-data';

/**
 * Cart Management Tests for Shop-Blinq
 * Tests TC-CART-001 through TC-CART-005
 */

test.describe('Cart Management - Shop-Blinq', () => {
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

    const cartTotal = await cartPage.getCartTotal();
    expect(cartTotal).toBeTruthy();
    expect(cartTotal.length).toBeGreaterThan(0);
  });

  /**
   * TC-CART-002: Increase Item Quantity
   * Priority: High | Type: Happy Path
   */
  test('should increase item quantity and update total', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    const initialTotal = await cartPage.getCartTotal();

    // Act
    await cartPage.increaseQuantity(0);
    await page.waitForTimeout(1000);

    // Assert
    const newTotal = await cartPage.getCartTotal();
    expect(newTotal).not.toBe(initialTotal);
  });

  /**
   * TC-CART-003: Decrease Item Quantity
   * Priority: High | Type: Happy Path
   */
  test('should decrease item quantity and update total', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    // First increase quantity
    await cartPage.increaseQuantity(0);
    await page.waitForTimeout(1000);
    const increasedTotal = await cartPage.getCartTotal();

    // Act
    await cartPage.decreaseQuantity(0);
    await page.waitForTimeout(1000);

    // Assert
    const decreasedTotal = await cartPage.getCartTotal();
    expect(decreasedTotal).not.toBe(increasedTotal);
  });

  /**
   * TC-CART-004: Remove Item from Cart
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
   * TC-CART-005: Empty Cart Display
   * Priority: Medium | Type: Edge Case
   */
  test('should show empty cart message when cart is empty', async ({ page }) => {
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
   * TC-CART-006: Cart Item Details
   * Priority: Medium | Type: Happy Path
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
    expect(itemQty).toBeTruthy();
  });

  /**
   * TC-CART-007: Navigate to Checkout from Cart
   * Priority: High | Type: Happy Path
   */
  test('should navigate to checkout from cart', async ({ page }) => {
    // Arrange
    await cartPage.goto();

    // Act
    await cartPage.proceedToCheckout();

    // Assert
    await expect(page).toHaveURL(/\/checkout/);
  });

  /**
   * TC-CART-008: Set Quantity Directly
   * Priority: Medium | Type: Happy Path
   */
  test('should set item quantity directly', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    const newQuantity = 5;

    // Act
    await cartPage.setQuantity(0, newQuantity);
    await page.waitForTimeout(1000);

    // Assert
    const itemQty = await cartPage.getItemQuantity(0);
    expect(itemQty).toContain(newQuantity.toString());
  });
});
