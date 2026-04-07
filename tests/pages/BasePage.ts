import { Page, Locator } from '@playwright/test';

/**
 * Base page class containing common methods for all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Click an element
   */
  async click(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.click();
  }

  /**
   * Fill an input field
   */
  async fill(locator: Locator | string, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.fill(value);
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent() || '';
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'visible' });
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  /**
   * Wait for navigation to complete
   */
  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot
   */
  async screenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${filename}` });
  }

  /**
   * Get current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for timeout
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Select option from dropdown
   */
  async selectOption(locator: Locator | string, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.selectOption(value);
  }

  /**
   * Check checkbox
   */
  async check(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheck(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.uncheck();
  }
}
