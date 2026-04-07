import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { VALID_USER, URLS } from '../fixtures/test-data';

/**
 * Product Browsing Tests for SauceDemo
 * Tests TC-PROD-001 through TC-PROD-005
 */

test.describe('Products - SauceDemo', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await page.waitForLoadState('networkidle');

    // Initialize products page
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  /**
   * TC-PROD-001: View Product List
   * Priority: Medium | Type: Happy Path
   */
  test('should display product list', async () => {
    // Act
    const productCount = await productsPage.getProductCount();

    // Assert
    expect(productCount).toBeGreaterThan(0);
    await productsPage.waitForVisible(productsPage.productList);
  });

  /**
   * TC-PROD-002: Add Single Product to Cart
   * Priority: Medium | Type: Happy Path
   */
  test('should add single product to cart', async ({ page }) => {
    // Arrange
    const initialCount = await productsPage.getCartCount();

    // Act
    await productsPage.addProductToCart(0);
    await page.waitForTimeout(1000);

    // Assert
    const newCount = await productsPage.getCartCount();
    const initialNum = parseInt(initialCount) || 0;
    const newNum = parseInt(newCount) || 0;
    expect(newNum).toBeGreaterThan(initialNum);
  });

  /**
   * TC-PROD-003: Add Multiple Products to Cart
   * Priority: Medium | Type: Happy Path
   */
  test('should add multiple products to cart', async ({ page }) => {
    // Arrange
    const productsToAdd = 3;

    // Act
    await productsPage.addMultipleProductsToCart(productsToAdd);
    await page.waitForTimeout(1000);

    // Assert
    const cartCount = await productsPage.getCartCount();
    const countNum = parseInt(cartCount) || 0;
    expect(countNum).toBeGreaterThanOrEqual(productsToAdd);
  });

  /**
   * TC-PROD-004: Navigate to Cart from Products
   * Priority: Medium | Type: Happy Path
   */
  test('should navigate to cart page', async ({ page }) => {
    // Act
    await productsPage.goToCart();

    // Assert
    await expect(page).toHaveURL(/cart\.html/);
  });

  /**
   * TC-PROD-005: Product Information Display
   * Priority: Low | Type: Happy Path
   */
  test('should display product information correctly', async () => {
    // Arrange
    const productIndex = 0;

    // Act
    const productName = await productsPage.getProductName(productIndex);
    const productPrice = await productsPage.getProductPrice(productIndex);

    // Assert
    expect(productName).toBeTruthy();
    expect(productName.length).toBeGreaterThan(0);
    expect(productPrice).toBeTruthy();
    expect(productPrice).toContain('$');
  });
});
