import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { VALID_USER, URLS } from '../fixtures/test-data';

/**
 * Checkout Flow Tests for SauceDemo
 * Tests TC-CHK-001 through TC-CHK-006 and form validation tests
 */

test.describe('Checkout Flow - SauceDemo', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await page.waitForLoadState('networkidle');

    // Initialize pages
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Add products to cart
    await productsPage.goto();
    await productsPage.addMultipleProductsToCart(2);
    await page.waitForTimeout(1000);
  });

  /**
   * TC-CHK-001: Navigate to Checkout
   * Priority: Critical | Type: Happy Path
   */
  test('should navigate to checkout from cart', async ({ page }) => {
    // Act
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Assert
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  /**
   * TC-CHK-002: Complete Full Checkout Flow
   * Priority: Critical | Type: Happy Path
   */
  test('should complete full checkout flow successfully', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Fill form and complete checkout
    await checkoutPage.completeCheckout({
      firstName: 'Test',
      lastName: 'User',
      zip: '12345'
    });

    // Assert - Order confirmation
    expect(await checkoutPage.isComplete()).toBeTruthy();
    const message = await checkoutPage.getCompleteMessage();
    expect(message.toLowerCase()).toContain('thank you');
  });

  /**
   * TC-CHK-003: Checkout with Single Item
   * Priority: High | Type: Happy Path
   */
  test('should complete checkout with single item', async ({ page }) => {
    // Arrange - Ensure only 1 item in cart
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    for (let i = 1; i < itemCount; i++) {
      await cartPage.removeItem(1);
      await page.waitForTimeout(500);
    }
    await cartPage.proceedToCheckout();

    // Act
    await checkoutPage.completeCheckout({
      firstName: 'Test',
      lastName: 'User',
      zip: '12345'
    });

    // Assert
    expect(await checkoutPage.isComplete()).toBeTruthy();
  });

  /**
   * TC-CHK-004: Checkout with Multiple Items
   * Priority: High | Type: Happy Path
   */
  test('should complete checkout with multiple items', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act
    await checkoutPage.completeCheckout({
      firstName: 'Test',
      lastName: 'User',
      zip: '12345'
    });

    // Assert
    expect(await checkoutPage.isComplete()).toBeTruthy();
  });

  /**
   * TC-VAL-001: Empty Required Fields Validation
   * Priority: High | Type: Negative
   */
  test('should validate empty required fields', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Try to continue without filling
    await checkoutPage.clickContinue();

    // Assert
    expect(await checkoutPage.hasError()).toBeTruthy();
    const errorMsg = await checkoutPage.getErrorMessage();
    expect(errorMsg.toLowerCase()).toMatch(/first name|last name|postal code/);
  });

  /**
   * TC-VAL-002: Empty First Name
   * Priority: High | Type: Negative
   */
  test('should validate empty first name', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Fill only last name and zip
    await checkoutPage.fillCheckoutForm({
      firstName: '',
      lastName: 'User',
      zip: '12345'
    });
    await checkoutPage.clickContinue();

    // Assert
    expect(await checkoutPage.hasError()).toBeTruthy();
    const errorMsg = await checkoutPage.getErrorMessage();
    expect(errorMsg.toLowerCase()).toContain('first name');
  });

  /**
   * TC-VAL-003: Empty Last Name
   * Priority: High | Type: Negative
   */
  test('should validate empty last name', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Fill only first name and zip
    await checkoutPage.fillCheckoutForm({
      firstName: 'Test',
      lastName: '',
      zip: '12345'
    });
    await checkoutPage.clickContinue();

    // Assert
    expect(await checkoutPage.hasError()).toBeTruthy();
    const errorMsg = await checkoutPage.getErrorMessage();
    expect(errorMsg.toLowerCase()).toContain('last name');
  });

  /**
   * TC-VAL-004: Empty Postal Code
   * Priority: High | Type: Negative
   */
  test('should validate empty postal code', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Fill only first and last name
    await checkoutPage.fillCheckoutForm({
      firstName: 'Test',
      lastName: 'User',
      zip: ''
    });
    await checkoutPage.clickContinue();

    // Assert
    expect(await checkoutPage.hasError()).toBeTruthy();
    const errorMsg = await checkoutPage.getErrorMessage();
    expect(errorMsg.toLowerCase()).toContain('postal code');
  });

  /**
   * TC-NAV-001: Products to Cart Navigation
   * Priority: Medium | Type: Happy Path
   */
  test('should navigate from products to cart', async ({ page }) => {
    // Arrange
    await productsPage.goto();

    // Act
    await productsPage.goToCart();

    // Assert
    await expect(page).toHaveURL(/cart\.html/);
  });

  /**
   * TC-NAV-002: Cart to Checkout Navigation
   * Priority: Medium | Type: Happy Path
   */
  test('should navigate from cart to checkout', async ({ page }) => {
    // Arrange
    await cartPage.goto();

    // Act
    await cartPage.proceedToCheckout();

    // Assert
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  /**
   * TC-CHK-005: Order Summary
   * Priority: High | Type: Happy Path
   */
  test('should display order summary before final confirmation', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act
    await checkoutPage.fillCheckoutForm({
      firstName: 'Test',
      lastName: 'User',
      zip: '12345'
    });
    await checkoutPage.clickContinue();

    // Assert - Should be on overview page
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    expect(await checkoutPage.getOrderItemCount()).toBeGreaterThan(0);
  });

  /**
   * TC-CHK-006: Cancel Checkout
   * Priority: Medium | Type: Happy Path
   */
  test('should allow canceling checkout', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Cancel should return to cart page
    await page.locator('#cancel').click();

    // Assert - Should return to cart page
    await expect(page).toHaveURL(/cart\.html/);
  });

  /**
   * TC-CHK-007: Back to Products After Complete
   * Priority: Low | Type: Happy Path
   */
  test('should navigate back to products after checkout complete', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Complete checkout
    await checkoutPage.completeCheckout({
      firstName: 'Test',
      lastName: 'User',
      zip: '12345'
    });

    // Go back to products
    await checkoutPage.backToProducts();

    // Assert
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
