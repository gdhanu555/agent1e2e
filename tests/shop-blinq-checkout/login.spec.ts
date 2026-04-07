import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VALID_USER, INVALID_USER, ERROR_MESSAGES, URLS } from '../fixtures/test-data';

/**
 * Authentication Tests for Shop-Blinq Checkout
 * Tests TC-AUTH-001 through TC-AUTH-004
 */

test.describe('Authentication - Shop-Blinq', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  /**
   * TC-AUTH-001: Successful Login
   * Priority: High | Type: Happy Path
   */
  test('should login successfully with valid credentials', async ({ page }) => {
    // Act
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await page.waitForLoadState('networkidle');

    // Assert
    await expect(page).toHaveURL(/\/(products|dashboard|home)/);
    const hasSuccess = await loginPage.isVisible(loginPage.successMessage);
    if (hasSuccess) {
      const successMsg = await loginPage.getSuccessMessage();
      expect(successMsg.toLowerCase()).toContain('success');
    }
  });

  /**
   * TC-AUTH-002: Invalid Username
   * Priority: High | Type: Negative
   */
  test('should show error for invalid username', async ({ page }) => {
    // Act
    await loginPage.login(INVALID_USER.username, VALID_USER.password);

    // Assert
    const hasError = await loginPage.hasError();
    expect(hasError).toBeTruthy();
    expect(page.url()).toContain(URLS.login);

    if (hasError) {
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg.toLowerCase()).toMatch(/invalid|incorrect|not found/);
    }
  });

  /**
   * TC-AUTH-003: Invalid Password
   * Priority: High | Type: Negative
   */
  test('should show error for invalid password', async ({ page }) => {
    // Act
    await loginPage.login(VALID_USER.username, INVALID_USER.password);

    // Assert
    const hasError = await loginPage.hasError();
    expect(hasError).toBeTruthy();
    expect(page.url()).toContain(URLS.login);

    if (hasError) {
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg.toLowerCase()).toMatch(/invalid|incorrect|password/);
    }
  });

  /**
   * TC-AUTH-004: Empty Fields Validation
   * Priority: High | Type: Negative
   */
  test('should validate empty required fields', async ({ page }) => {
    // Act
    await loginPage.login('', '');

    // Assert
    const hasError = await loginPage.hasError();
    expect(hasError).toBeTruthy();
    expect(page.url()).toContain(URLS.login);
  });

  /**
   * TC-AUTH-005: Session Persistence After Login
   * Priority: Medium | Type: Happy Path
   */
  test('should maintain session after navigation', async ({ page }) => {
    // Arrange - Login
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await page.waitForLoadState('networkidle');

    // Act - Navigate away and back
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Assert - Session should persist
    expect(page.url()).not.toContain(URLS.login);
  });
});
