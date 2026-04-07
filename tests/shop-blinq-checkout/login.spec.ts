import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VALID_USER, INVALID_USER, URLS } from '../fixtures/test-data';

/**
 * Authentication Tests for SauceDemo
 * Tests TC-AUTH-001 through TC-AUTH-004
 */

test.describe('Authentication - SauceDemo', () => {
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
    await expect(page).toHaveURL(/inventory\.html/);
    expect(await loginPage.isLoginSuccessful()).toBeTruthy();
  });

  /**
   * TC-AUTH-002: Invalid Username
   * Priority: High | Type: Negative
   */
  test('should show error for invalid username', async ({ page }) => {
    // Act
    await loginPage.login('invalid_user', VALID_USER.password);

    // Assert
    expect(await loginPage.hasError()).toBeTruthy();
    expect(page.url()).toContain(URLS.login);

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.toLowerCase()).toContain('username');
  });

  /**
   * TC-AUTH-003: Invalid Password
   * Priority: High | Type: Negative
   */
  test('should show error for invalid password', async ({ page }) => {
    // Act
    await loginPage.login(VALID_USER.username, 'wrong_password');

    // Assert
    expect(await loginPage.hasError()).toBeTruthy();
    expect(page.url()).toContain(URLS.login);

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.toLowerCase()).toContain('password');
  });

  /**
   * TC-AUTH-004: Empty Fields Validation
   * Priority: High | Type: Negative
   */
  test('should validate empty required fields', async ({ page }) => {
    // Act
    await loginPage.login('', '');

    // Assert
    expect(await loginPage.hasError()).toBeTruthy();
    expect(page.url()).toContain(URLS.login);
  });

  /**
   * TC-AUTH-005: Locked Out User
   * Priority: Medium | Type: Negative
   */
  test('should show error for locked out user', async ({ page }) => {
    // Act
    await loginPage.login('locked_out_user', VALID_USER.password);

    // Assert
    expect(await loginPage.hasError()).toBeTruthy();
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.toLowerCase()).toContain('locked');
  });
});
