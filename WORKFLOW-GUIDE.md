# Shop-Blinq Test Automation Workflow Guide

## Quick Start

### 1. Setup (First Time)
```bash
# Clone repository
git clone https://github.com/gdhanu555/agent1e2e.git
cd agent1e2e

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### 2. Run All Tests
```bash
npm test
```

### 3. Run Specific Test Suite
```bash
# Authentication tests only
npx playwright test tests/shop-blinq-checkout/login.spec.ts

# Checkout tests only
npx playwright test tests/shop-blinq-checkout/checkout.spec.ts
```

---

## Development Workflow

### Adding New Tests

1. **Create test file** in `tests/shop-blinq-checkout/`
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('My New Tests', () => {
  test('should do something', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // Add test logic
  });
});
```

2. **Run the test** to verify
```bash
npx playwright test tests/shop-blinq-checkout/my-new-test.spec.ts --headed
```

3. **Debug with Playwright Inspector**
```bash
npx playwright codegen https://shop-blinq.com
```

---

## Test Execution Phases

### Phase 1: Smoke Tests (Critical Path)
```bash
# Run high-priority tests first
npx playwright test --grep "@high"
```

### Phase 2: Full Regression
```bash
# Run all tests across browsers
npm test
```

### Phase 3: Mobile Testing
```bash
# Run on mobile viewport
npx playwright test --project="Mobile Chrome"
```

---

## Page Object Model Usage

### Example: Login Test
```typescript
import { LoginPage } from '../pages/LoginPage';

const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('username', 'password');
```

### Example: Cart Operations
```typescript
import { CartPage } from '../pages/CartPage';

const cartPage = new CartPage(page);
await cartPage.goto();
await cartPage.increaseQuantity(0);
await cartPage.removeItem(1);
```

---

## Test Data Management

### Using Fixtures
```typescript
import { VALID_USER, VALID_SHIPPING } from '../fixtures/test-data';

// Use predefined test data
await loginPage.login(VALID_USER.username, VALID_USER.password);
await checkoutPage.fillShippingForm(VALID_SHIPPING);
```

### Generating Random Data
```typescript
import { TestDataGenerator } from '../fixtures/test-data';

const randomUser = TestDataGenerator.randomUser();
const randomShipping = TestDataGenerator.randomShipping();
```

---

## Debugging Failed Tests

### 1. Run in Headed Mode
```bash
npx playwright test --headed
```

### 2. Run in Debug Mode
```bash
npx playwright test --debug
```

### 3. Run with More Timeouts
```bash
npx playwright test --timeout=60000
```

### 4. View Screenshots
```bash
# Screenshots are saved to test-results/screenshots/
open test-results/screenshots/
```

### 5. View Videos
```bash
# Videos are saved to test-results/videos/
open test-results/videos/
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-report
          path: test-results/
```

### GitLab CI Example
```yaml
test:
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - test-results/
```

---

## Troubleshooting Guide

### Issue: Browser Not Found
```bash
# Solution: Install browsers
npx playwright install
```

### Issue: Selector Not Found
```bash
# Solution: Use Playwright Inspector to find correct selector
npx playwright codegen https://shop-blinq.com

# Update the locator in the page object class
readonly myButton = page.locator('button[data-testid="my-btn"]');
```

### Issue: Test Timeout
```bash
# Solution: Increase timeout in playwright.config.ts
use: {
  actionTimeout: 10000,
  navigationTimeout: 30000,
}

# Or in test
test.setTimeout(60000);
```

### Issue: Flaky Tests
```bash
# Solution: Add proper waits
await page.waitForLoadState('networkidle');
await page.waitForSelector('.my-element');
```

---

## Test Reports

### HTML Report
```bash
npm run test:report
# Opens interactive HTML report in browser
```

### JSON Report
```bash
# Results saved to test-results/results.json
# Use for custom reporting or CI integrations
```

### JUnit Report
```bash
# Results saved to test-results/results.xml
# Use for Jenkins, GitLab, etc.
```

---

## Best Practices

1. **Use Page Objects** - Don't duplicate selectors across tests
2. **Wait Properly** - Use waitForLoadState, waitForSelector, waitForTimeout
3. **Use Descriptive Names** - Test names should describe what they test
4. **Test Independence** - Each test should work independently
5. **Clean Up** - Reset state between tests
6. **Assertions** - Use meaningful assertions with clear messages
7. **Screenshots** - Take screenshots at key points for debugging
8. **Test Data** - Use fixtures, don't hardcode values

---

## Selector Strategies

### Preferred (Stable)
```typescript
// By data-testid
page.locator('[data-testid="submit-button"]')

// By aria-label
page.locator('button[aria-label="Submit"]')

// By role
page.getByRole('button', { name: 'Submit' })
```

### Acceptable
```typescript
// By id
page.locator('#submit-button')

// By class (use specific classes)
page.locator('.btn-primary')
```

### Avoid (Fragile)
```typescript
// By text content alone
page.locator('text=Submit')

// By nth index
page.locator('button').nth(3)

// By complex CSS/XPath
page.locator('div > div > button[type="submit"]')
```

---

## Environment Variables

Create `.env` file:
```
BASE_URL=https://shop-blinq.com
TEST_USERNAME=blinq_user
TEST_PASSWORD=let_me_in
HEADLESS=false
```

Use in tests:
```typescript
const baseURL = process.env.BASE_URL || 'https://shop-blinq.com';
```

---

## Mobile Testing

### Run on Mobile Devices
```bash
# Mobile Chrome
npx playwright test --project="Mobile Chrome"

# Mobile Safari
npx playwright test --project="Mobile Safari"
```

### Add Mobile Project
```typescript
// playwright.config.ts
projects: [
  {
    name: 'Mobile iPhone',
    use: { ...devices['iPhone 14 Pro'] },
  },
]
```

---

## API Testing (Optional Extension)

```typescript
test('API: Create order', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: {
      items: [{ productId: 1, quantity: 2 }],
      shipping: VALID_SHIPPING,
      payment: VALID_PAYMENT
    }
  });

  expect(response.ok()).toBeTruthy();
  const order = await response.json();
  expect(order.orderNumber).toBeTruthy();
});
```

---

## Visual Regression Testing (Optional)

```bash
npm install -D @playwright/visual-regression
```

```typescript
test('visual: checkout page', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page).toHaveScreenshot('checkout.png');
});
```

---

## Performance Testing (Optional)

```typescript
test('performance: page load time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/products');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;

  expect(loadTime).toBeLessThan(3000); // 3 seconds
});
```

---

## Network Testing (Optional)

```typescript
test('network: handle slow response', async ({ page, context }) => {
  // Slow down network
  await context.route('**/*', async route => {
    await new Promise(f => setTimeout(f, 1000));
    route.continue();
  });

  await page.goto('/products');
  // Test should still pass
});
```
