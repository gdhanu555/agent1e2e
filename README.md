# Shop-Blinq E2E Test Automation Framework

Complete end-to-end test automation framework for Shop-Blinq e-commerce checkout workflow, built with Playwright and TypeScript.

## Overview

This framework tests the complete checkout flow of Shop-Blinq (https://shop-blinq.com), covering:
- User authentication
- Product browsing and selection
- Cart management
- Checkout process
- Form validation

## Project Structure

```
1005/
├── user-stories/
│   └── SCRUM-101-ecommerce-checkout.md    # User story documentation
├── specs/
│   └── shop-blinq-checkout-test-plan.md    # Comprehensive test plan
├── tests/
│   ├── pages/                              # Page Object Model
│   │   ├── BasePage.ts                     # Base page class
│   │   ├── LoginPage.ts                    # Login page object
│   │   ├── ProductsPage.ts                 # Products page object
│   │   ├── CartPage.ts                     # Cart page object
│   │   └── CheckoutPage.ts                 # Checkout page object
│   ├── fixtures/
│   │   └── test-data.ts                    # Test data fixtures
│   └── shop-blinq-checkout/
│       ├── login.spec.ts                   # Authentication tests
│       ├── products.spec.ts                # Product browsing tests
│       ├── cart.spec.ts                    # Cart management tests
│       └── checkout.spec.ts                # Checkout flow tests
├── test-results/                           # Test execution results
├── playwright.config.ts                    # Playwright configuration
├── tsconfig.json                           # TypeScript configuration
└── package.json                            # Project dependencies
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/shop-blinq-checkout/login.spec.ts
```

### Run specific test
```bash
npx playwright test --grep "should login successfully"
```

## Test Credentials

```
Username: blinq_user
Password: let_me_in
```

## Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Authentication | 5 | ✅ |
| Product Browsing | 5 | ✅ |
| Cart Management | 8 | ✅ |
| Checkout Flow | 12 | ✅ |
| **Total** | **30** | - |

## Page Object Model

The framework uses the Page Object Model pattern for maintainable test automation:

### BasePage
Common methods for all pages (click, fill, wait, etc.)

### LoginPage
Login form interactions and validation

### ProductsPage
Product listing, browsing, and add to cart

### CartPage
Cart item management, quantity updates, removal

### CheckoutPage
Shipping form, payment form, order placement

## Test Data

Test data is centralized in `tests/fixtures/test-data.ts`:
- Valid user credentials
- Invalid user credentials (for negative testing)
- Shipping information
- Payment information (test card)
- Error messages
- Success messages

## Configuration

Playwright configuration is in `playwright.config.ts`:
- Multi-browser support (Chrome, Firefox, Safari)
- Mobile device testing
- Automatic retries on CI
- Screenshot on failure
- Video recording on failure
- HTML, JSON, and JUnit reports

## Reports

Test reports are generated in `test-results/`:
- `report/` - HTML report
- `results.json` - JSON format
- `results.xml` - JUnit format
- `screenshots/` - Failure screenshots
- `videos/` - Failure videos

## Development

### Adding new tests
1. Create a new `.spec.ts` file in `tests/shop-blinq-checkout/`
2. Import required page objects
3. Write test using Playwright test API
4. Run tests to verify

### Adding new page objects
1. Create a new class in `tests/pages/`
2. Extend `BasePage`
3. Add locators and methods
4. Use in test files

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/
```

## Troubleshooting

### Tests fail with "browser not found"
```bash
npm run test:install
```

### Tests timeout
- Increase timeout in `playwright.config.ts`
- Check network connectivity

### Selector issues
- Update locators in page objects
- Use Playwright Inspector: `npx playwright codegen https://shop-blinq.com`

## License

ISC

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Submit pull request
