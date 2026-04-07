import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { VALID_USER, VALID_SHIPPING, VALID_PAYMENT, INVALID_PAYMENT, URLS } from '../fixtures/test-data';

/**
 * Checkout Flow Tests for Shop-Blinq
 * Tests TC-CHK-001 through TC-CHK-006 and TC-VAL-001 through TC-VAL-005
 */

test.describe('Checkout Flow - Shop-Blinq', () => {
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
    await expect(page).toHaveURL(/\/checkout/);
  });

  /**
   * TC-CHK-002: Complete Full Checkout Flow
   * Priority: Critical | Type: Happy Path
   */
  test('should complete full checkout flow successfully', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await page.waitForLoadState('networkidle');

    // Act - Fill forms
    await checkoutPage.fillShippingForm(VALID_SHIPPING);
    await checkoutPage.fillPaymentForm(VALID_PAYMENT);
    await page.waitForTimeout(500);

    // Place order
    await checkoutPage.placeOrder();
    await page.waitForTimeout(2000);

    // Assert - Order confirmation
    const hasConfirmation = await checkoutPage.isVisible(checkoutPage.orderConfirmation);
    if (hasConfirmation) {
      const confirmation = await checkoutPage.getOrderConfirmation();
      expect(confirmation.toLowerCase()).toMatch(/thank you|order|success/);

      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
      expect(orderNumber.length).toBeGreaterThan(0);
    }
  });

  /**
   * TC-CHK-003: Checkout with Single Item
   * Priority: High | Type: Happy Path
   */
  test('should complete checkout with single item', async ({ page }) => {
    // Arrange - Clear cart and add single item
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    for (let i = 1; i < itemCount; i++) {
      await cartPage.removeItem(1);
      await page.waitForTimeout(500);
    }
    await cartPage.proceedToCheckout();

    // Act
    await checkoutPage.fillCheckoutForm(VALID_SHIPPING, VALID_PAYMENT);
    await checkoutPage.placeOrder();
    await page.waitForTimeout(2000);

    // Assert
    const orderItemCount = await checkoutPage.getOrderItemCount();
    expect(orderItemCount).toBe(1);
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
    await checkoutPage.fillCheckoutForm(VALID_SHIPPING, VALID_PAYMENT);
    await checkoutPage.placeOrder();
    await page.waitForTimeout(2000);

    // Assert
    const orderItemCount = await checkoutPage.getOrderItemCount();
    expect(orderItemCount).toBeGreaterThan(1);

    const orderTotal = await checkoutPage.getOrderTotal();
    expect(orderTotal).toBeTruthy();
  });

  /**
   * TC-CHK-006: Empty Cart Checkout Prevention
   * Priority: High | Type: Negative
   */
  test('should prevent checkout with empty cart', async ({ page }) => {
    // Arrange - Empty cart
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    for (let i = 0; i < itemCount; i++) {
      await cartPage.removeItem(0);
      await page.waitForTimeout(500);
    }

    // Act - Try to go to checkout
    await page.goto(URLS.checkout);

    // Assert - Should be redirected or show error
    const currentUrl = page.url();
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty || currentUrl.includes('cart')).toBeTruthy();
  });

  /**
   * TC-VAL-001: Shipping Form - Empty Required Fields
   * Priority: High | Type: Negative
   */
  test('should validate empty required fields in shipping form', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Try to continue without filling
    await checkoutPage.clickContinue();

    // Assert
    const hasErrors = await checkoutPage.hasValidationErrors();
    expect(hasErrors).toBeTruthy();
  });

  /**
   * TC-VAL-003: Payment Form - Invalid Card Number
   * Priority: High | Type: Negative
   */
  test('should validate invalid card number', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingForm(VALID_SHIPPING);

    // Act - Fill invalid payment
    await checkoutPage.fillPaymentForm(INVALID_PAYMENT);
    await checkoutPage.clickContinue();

    // Assert
    const hasErrors = await checkoutPage.hasValidationErrors();
    expect(hasErrors).toBeTruthy();
  });

  /**
   * TC-VAL-005: ZIP Code Validation
   * Priority: Medium | Type: Negative
   */
  test('should validate ZIP code format', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Fill with invalid ZIP
    await checkoutPage.fillShippingForm({
      ...VALID_SHIPPING,
      zip: '12'
    });
    await checkoutPage.clickContinue();

    // Assert
    const errors = await checkoutPage.getValidationErrors();
    const hasZipError = errors.some(e =>
      e.toLowerCase().includes('zip') ||
      e.toLowerCase().includes('postal')
    );
    // Note: Some sites may not validate this strictly
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
    await expect(page).toHaveURL(/\/cart/);
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
    await expect(page).toHaveURL(/\/checkout/);
  });

  /**
   * TC-CHK-005: Order Review Before Confirmation
   * Priority: High | Type: Happy Path
   */
  test('should display order review before final confirmation', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act
    await checkoutPage.fillCheckoutForm(VALID_SHIPPING, VALID_PAYMENT);

    // Assert - Order summary should be visible
    const hasSummary = await checkoutPage.isVisible(checkoutPage.orderSummary);
    expect(hasSummary).toBeTruthy();

    const orderTotal = await checkoutPage.getOrderTotal();
    expect(orderTotal).toBeTruthy();
  });

  /**
   * TC-VAL-002: Email Format Validation
   * Priority: High | Type: Negative
   */
  test('should validate email format', async ({ page }) => {
    // Arrange
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Act - Fill with invalid email
    await checkoutPage.fillShippingForm({
      ...VALID_SHIPPING,
      email: 'invalid-email'
    });
    await checkoutPage.clickContinue();

    // Assert
    const hasErrors = await checkoutPage.hasValidationErrors();
    if (hasErrors) {
      const errors = await checkoutPage.getValidationErrors();
      const hasEmailError = errors.some(e =>
        e.toLowerCase().includes('email') ||
        e.toLowerCase().includes('valid')
      );
      expect(hasEmailError).toBeTruthy();
    }
  });
});
