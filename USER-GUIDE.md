# Shop-Blinq E2E Test Automation — User Guide

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Running Tests](#running-tests)
7. [Test Suite Details](#test-suite-details)
8. [Page Object Model](#page-object-model)
9. [Test Data Management](#test-data-management)
10. [Writing New Tests](#writing-new-tests)
11. [Debugging & Troubleshooting](#debugging--troubleshooting)
12. [CI/CD Integration](#cicd-integration)
13. [FAQ](#faq)

---

## Overview

**Shop-Blinq E2E Checkout** is an end-to-end test automation framework built with [Playwright](https://playwright.dev/) and TypeScript. It validates the complete e-commerce checkout workflow on the [Shop Blinq](https://shop.blinq.com) web application, covering:

- **User Login** — Authentication with valid and invalid credentials
- **Product Browsing** — Searching, filtering, and viewing products
- **Shopping Cart** — Adding, removing, and updating cart items
- **Checkout Flow** — Complete end-to-end purchase process

The framework follows the **Page Object Model (POM)** design pattern for maintainability and reusability, and is driven by a natural-language QA workflow (see `prompt-End-to-EndQAWorkflowwithNaturalLanguage.md`).

---

## Prerequisites

| Requirement | Minimum Version | How to Check |
|---|---|---|
| **Node.js** | 18.x or later | `node --version` |
| **npm** | 9.x or later | `npm --version` |
| **Git** | 2.x | `git --version` |
| **OS** | Linux, macOS, or Windows (WSL2) | — |

> **Note:** Playwright downloads browser binaries automatically during `npm install`. Ensure you have network access and sufficient disk space (~500 MB for all three browsers).

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/gdhanu555/agent1e2e.git
cd agent1e2e
```

### 2. Install Dependencies

```bash
npm install
```

This installs all Node.js dependencies (Playwright, TypeScript, etc.) and downloads the Chromium, Firefox, and WebKit browser binaries.

### 3. Verify Installation

```bash
npx playwright --version
```

You should see the Playwright version printed (currently **1.52.0**).

---

## Project Structure

```
agent1e2e/
├── .gitignore                          # Git ignore rules
├── package.json                        # Project manifest & scripts
├── package-lock.json                   # Dependency lock file
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
├── README.md                           # Quick-start README
├── WORKFLOW-GUIDE.md                   # AI-driven workflow guide
├── USER-GUIDE.md                       # ← This file
├── prompt-End-to-EndQAWorkflowwithNaturalLanguage.md
│                                       # Natural-language QA prompt
├── specs/
│   └── shop-blinq-checkout-test-plan.md   # Detailed test plan
├── user-stories/
│   └── SCRUM-101-ecommerce-checkout.md     # Scrum user story
├── tests/
│   ├── fixtures/
│   │   └── test-data.ts                # Centralised test data
│   ├── pages/                          # Page Object Model classes
│   │   ├── BasePage.ts                 # Abstract base page
│   │   ├── CartPage.ts                  # Cart page interactions
│   │   ├── CheckoutPage.ts             # Checkout page interactions
│   │   ├── LoginPage.ts                # Login page interactions
│   │   └── ProductsPage.ts             # Products page interactions
│   ├── shop-blinq-checkout/            # Test spec files
│   │   ├── cart.spec.ts                # Cart feature tests
│   │   ├── checkout.spec.ts            # Checkout feature tests
│   │   ├── login.spec.ts               # Login feature tests
│   │   └── products.spec.ts            # Products feature tests
│   └── utils/                          # Utility helpers
├── test-results/                       # Generated test reports & traces
```

---

## Configuration

### Playwright Configuration (`playwright.config.ts`)

Key settings and their defaults:

| Setting | Value | Description |
|---|---|---|
| `baseURL` | `https://shop.blinq.com` | Target application URL |
| `timeout` | 60 000 ms | Maximum time per test |
| `expect.timeout` | 10 000 ms | Default assertion timeout |
| `retries` | 0 | Number of retries on failure |
| `workers` | `default` (auto-detected) | Parallel test workers |
| `reporter` | `html` | HTML report in `test-results/` |
| `browsers` | Chromium | Single browser by default |
| `trace` | `on-first-retry` | Captures trace on first retry |
| `screenshot` | `only-on-failure` | Screenshots on failure |
| `video` | `retain-on-failure` | Video retained only on failure |

### Customising the Run

You can override configuration from the command line:

```bash
# Run against a different base URL
npx playwright test --base-url=https://staging.blinq.com

# Run with more workers
npx playwright test --workers=4

# Run with retries
npx playwright test --retries=2

# Run in headed mode (visible browser)
npx playwright test --headed
```

---

## Running Tests

### Run All Tests

```bash
npm test
# or
npx playwright test
```

### Run a Specific Test File

```bash
npx playwright test tests/shop-blinq-checkout/login.spec.ts
```

### Run Tests by Keyword

```bash
npx playwright test -g "should log in successfully"
```

### Run Tests by Tag / Project

```bash
npx playwright test --project=chromium
```

### Run in Headed Mode

```bash
npx playwright test --headed
```

### Run in Debug Mode

```bash
npx playwright test --debug
```

### Run with UI Mode (Interactive)

```bash
npx playwright test --ui
```

### View HTML Report

After a test run, open the generated report:

```bash
npx playwright show-report
```

---

## Test Suite Details

The test suite covers the complete Shop Blinq e-commerce checkout workflow. Tests are organised by feature area:

### 🔐 Login Tests (`login.spec.ts`)

| Test | Description |
|---|---|
| `should log in successfully with valid credentials` | Logs in with a valid account and verifies successful authentication |
| `should show error for invalid credentials` | Enters incorrect credentials and validates the error message |
| `should show validation errors for empty fields` | Submits the login form with empty fields and checks for validation messages |

### 🛍️ Products Tests (`products.spec.ts`)

| Test | Description |
|---|---|
| `should display products after login` | Navigates to the products page and verifies product listings are visible |
| `should search for a product` | Uses the search functionality and confirms matching results are shown |
| `should add a product to the cart` | Clicks "Add to Cart" on a product and verifies the cart is updated |

### 🛒 Cart Tests (`cart.spec.ts`)

| Test | Description |
|---|---|
| `should display cart items correctly` | Opens the cart and verifies items, quantities, and prices are displayed |
| `should update item quantity` | Changes a cart item's quantity and confirms the total updates |
| `should remove an item from the cart` | Removes an item and verifies it no longer appears in the cart |

### 💳 Checkout Tests (`checkout.spec.ts`)

| Test | Description |
|---|---|
| `should proceed to checkout` | Initiates checkout from the cart and verifies the checkout page loads |
| `should fill in shipping information` | Enters shipping details and validates form acceptance |
| `should complete the full checkout flow` | Goes through the entire checkout process end-to-end, including payment |

> **Tip:** Tests within a spec file run sequentially. Each test starts with a fresh browser context via the built-in `test` fixture, ensuring test isolation.

---

## Page Object Model

The framework uses the **Page Object Model (POM)** pattern. Each page of the Shop Blinq application is represented by a TypeScript class that encapsulates:

- **Locators** — CSS/XPath selectors for page elements
- **Actions** — Methods like `click()`, `fill()`, `navigate()`
- **Assertions** — Methods that return values for test assertions

### BasePage (Abstract)

`tests/pages/BasePage.ts` provides shared functionality for all page objects:

| Method | Purpose |
|---|---|
| `navigate(path)` | Navigate to a relative URL |
| `waitForPageLoad()` | Wait for the page to fully load |

All page objects extend `BasePage`.

### Page Object Summary

| Page Object | File | Key Methods |
|---|---|---|
| `LoginPage` | `tests/pages/LoginPage.ts` | `login(email, password)`, `getErrorMessage()`, `waitForLoginForm()` |
| `ProductsPage` | `tests/pages/ProductsPage.ts` | `searchProduct(query)`, `addProductToCart(name)`, `getProductNames()` |
| `CartPage` | `tests/pages/CartPage.ts` | `getCartItems()`, `updateQuantity(item, qty)`, `removeItem(item)`, `proceedToCheckout()` |
| `CheckoutPage` | `tests/pages/CheckoutPage.ts` | `fillShippingInfo(info)`, `fillPaymentInfo(info)`, `placeOrder()`, `getOrderConfirmation()` |

### Example: Using a Page Object in a Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('should log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate('/login');
  await loginPage.login('user@example.com', 'password123');
  // Assert we're on the products page
  await expect(page).toHaveURL(/.*products/);
});
```

---

## Test Data Management

All test data is centralised in **`tests/fixtures/test-data.ts`**. This single-source-of-truth approach makes it easy to:

- Update credentials or product names in one place
- Swap between environments (dev/staging/prod)
- Keep tests DRY and maintainable

### Data Categories

| Category | Example Fields |
|---|---|
| **Valid User** | `validUser.email`, `validUser.password` |
| **Invalid User** | `invalidUser.email`, `invalidUser.password` |
| **Search Queries** | `searchQueries.headphones`, `searchQueries.laptop` |
| **Shipping Info** | `shippingInfo.firstName`, `shippingInfo.address`, `shippingInfo.city` |
| **Payment Info** | `paymentInfo.cardNumber`, `paymentInfo.expiry` |
| **Product Data** | `products.defaultProductName`, `products.defaultQuantity` |

### Using Test Data in Tests

```typescript
import { test, expect } from '@playwright/test';
import { testData } from '../fixtures/test-data';

test('should log in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(testData.validUser.email, testData.validUser.password);
});
```

> **⚠️ Security Note:** Never commit real production credentials to the repository. Use environment variables or a secrets manager for sensitive data in CI/CD pipelines.

---

## Writing New Tests

Follow these steps to add a new test:

### 1. Create or Update a Page Object

If you're testing a new page, create a new class in `tests/pages/` that extends `BasePage`:

```typescript
// tests/pages/WishlistPage.ts
import { BasePage } from './BasePage';
import { Page, Locator } from '@playwright/test';

export class WishlistPage extends BasePage {
  readonly wishlistItems: Locator;

  constructor(page: Page) {
    super(page);
    this.wishlistItems = page.locator('.wishlist-item');
  }

  async addItemToWishlist(itemName: string): Promise<void> {
    // implementation
  }

  async getWishlistCount(): Promise<number> {
    return this.wishlistItems.count();
  }
}
```

### 2. Add Test Data

Add any required data to `tests/fixtures/test-data.ts`:

```typescript
export const testData = {
  // ... existing data ...
  wishlist: {
    defaultItem: 'Wireless Headphones',
  },
};
```

### 3. Write the Test

Create a new spec file or add to an existing one in `tests/shop-blinq-checkout/`:

```typescript
// tests/shop-blinq-checkout/wishlist.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { WishlistPage } from '../pages/WishlistPage';
import { testData } from '../fixtures/test-data';

test.describe('Wishlist', () => {
  test('should add item to wishlist', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate('/login');
    await loginPage.login(testData.validUser.email, testData.validUser.password);

    const wishlistPage = new WishlistPage(page);
    await wishlistPage.navigate('/wishlist');
    await wishlistPage.addItemToWishlist(testData.wishlist.defaultItem);

    const count = await wishlistPage.getWishlistCount();
    expect(count).toBeGreaterThan(0);
  });
});
```

### 4. Run & Verify

```bash
npx playwright test tests/shop-blinq-checkout/wishlist.spec.ts
```

---

## Debugging & Troubleshooting

### Common Issues

| Issue | Solution |
|---|---|
| **Browser not downloading** | Run `npx playwright install` manually |
| **Timeout errors** | Increase timeout in `playwright.config.ts` or use `--timeout=120000` |
| **Flaky tests** | Enable traces with `--trace on` and review in the HTML report |
| **Element not found** | Use `page.pause()` in debug mode to inspect the DOM |
| **SSL/Certificate errors** | Set `ignoreHTTPSErrors: true` in config |

### Debugging Tools

#### 1. Playwright Inspector (Step-through Debug)

```bash
npx playwright test --debug
```

Opens the Playwright Inspector where you can step through each action.

#### 2. Trace Viewer

If traces are captured (configured with `trace: 'on-first-retry'`):

```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

#### 3. UI Mode

```bash
npx playwright test --ui
```

Interactive mode with time-travel debugging, live watch, and filtering.

#### 4. Screenshots & Videos

Failed tests automatically capture:
- **Screenshots** — saved in `test-results/` (enabled via `screenshot: 'only-on-failure'`)
- **Videos** — saved in `test-results/` (enabled via `video: 'retain-on-failure'`)

#### 5. Console Logs

Add `console.log` statements in your page objects or tests. To capture browser console output:

```typescript
page.on('console', msg => console.log('BROWSER:', msg.text()));
```

---

## CI/CD Integration

### GitHub Actions

Here is a sample GitHub Actions workflow to run the tests on every push:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - name: Run tests
        run: npx playwright test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: test-results/
          retention-days: 14
```

### Environment Variables for CI

Set these as GitHub Secrets or CI environment variables:

| Variable | Purpose |
|---|---|
| `BASE_URL` | Override the target URL (e.g., staging environment) |
| `CI` | Set to `true` to enable CI-specific settings (Playwright sets this automatically) |

### Docker-based Execution

```bash
# Build and run inside Docker
docker run -it --rm --name playwright-test \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.52.0-noble \
  npx playwright test
```

---

## FAQ

### Q: How do I run tests on a specific browser?

```bash
npx playwright test --project=firefox
npx playwright test --project=webkit
```

> **Note:** By default only `chromium` is configured. Add Firefox and WebKit browser projects in `playwright.config.ts` to enable them.

### Q: How do I run a single test within a file?

Use the `-g` (grep) flag to match a specific test title:

```bash
npx playwright test -g "should add a product to the cart"
```

### Q: How do I generate a test trace for every run (not just failures)?

Update `playwright.config.ts`:

```typescript
use: {
  trace: 'on',
}
```

### Q: How do I update test credentials without modifying the code?

Set environment variables and reference them in `test-data.ts`:

```typescript
export const testData = {
  validUser: {
    email: process.env.TEST_USER_EMAIL || 'default@example.com',
    password: process.env.TEST_USER_PASSWORD || 'defaultPassword',
  },
  // ...
};
```

Then run:

```bash
TEST_USER_EMAIL=real@email.com TEST_USER_PASSWORD=realPass npx playwright test
```

### Q: Where are test reports stored?

By default, the HTML report and all artifacts (traces, screenshots, videos) are stored in:

```
test-results/
```

### Q: How do I skip a test temporarily?

```typescript
test.skip('should be skipped for now', async ({ page }) => {
  // ...
});
```

Or mark as fixme:

```typescript
test.fixme('needs investigation', async ({ page }) => {
  // ...
});
```

### Q: How do I generate test code by recording actions?

```bash
npx playwright codegen https://shop.blinq.com
```

This opens the Playwright Codegen tool, which records your browser interactions and generates TypeScript test code.

---

## Additional Resources

- **[Playwright Documentation](https://playwright.dev/docs/intro)** — Official Playwright docs
- **[Test Plan](./specs/shop-blinq-checkout-test-plan.md)** — Detailed test plan for Shop Blinq checkout
- **[User Story](./user-stories/SCRUM-101-ecommerce-checkout.md)** — Scrum user story for the e-commerce checkout flow
- **[Workflow Guide](./WORKFLOW-GUIDE.md)** — AI-driven QA workflow documentation
- **[QA Workflow Prompt](./prompt-End-to-EndQAWorkflowwithNaturalLanguage.md)** — Natural-language prompt for end-to-end QA workflow

---

*Last updated: April 2026*