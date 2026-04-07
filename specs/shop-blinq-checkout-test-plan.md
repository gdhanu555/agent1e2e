# Shop-Blinq Checkout Test Plan
**User Story:** SCRUM-101 - E-Commerce Checkout Workflow
**Application:** https://shop-blinq.com
**Test Credentials:** blinq_user / let_me_in

---

## Test Summary

| Category | Test Cases | Priority |
|----------|-----------|----------|
| Authentication | 4 | High |
| Product Browsing | 3 | Medium |
| Cart Management | 5 | High |
| Checkout Flow | 6 | Critical |
| Form Validation | 5 | High |
| Navigation | 3 | Medium |
| Edge Cases | 4 | Medium |
| **Total** | **30** | - |

---

## 1. AUTHENTICATION TESTS

### TC-AUTH-001: Successful Login
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User is on login page (https://shop-blinq.com/login)
- User has valid credentials

**Test Steps:**
1. Navigate to https://shop-blinq.com/login
2. Enter username: `blinq_user`
3. Enter password: `let_me_in`
4. Click Login button

**Expected Results:**
- User is redirected to products/dashboard page
- Success message is displayed
- User session is established
- Cart icon is visible (if applicable)

**Test Data:**
- Username: blinq_user
- Password: let_me_in

---

### TC-AUTH-002: Invalid Username
**Priority:** High | **Type:** Negative

**Preconditions:**
- User is on login page

**Test Steps:**
1. Navigate to https://shop-blinq.com/login
2. Enter invalid username: `invalid_user`
3. Enter password: `let_me_in`
4. Click Login button

**Expected Results:**
- Error message: "Invalid username or password"
- User remains on login page
- Password field is cleared

---

### TC-AUTH-003: Invalid Password
**Priority:** High | **Type:** Negative

**Preconditions:**
- User is on login page

**Test Steps:**
1. Navigate to https://shop-blinq.com/login
2. Enter username: `blinq_user`
3. Enter invalid password: `wrong_password`
4. Click Login button

**Expected Results:**
- Error message: "Invalid username or password"
- User remains on login page

---

### TC-AUTH-004: Empty Fields Validation
**Priority:** High | **Type:** Negative

**Preconditions:**
- User is on login page

**Test Steps:**
1. Navigate to https://shop-blinq.com/login
2. Leave both fields empty
3. Click Login button

**Expected Results:**
- Validation error: "Username is required"
- Validation error: "Password is required"
- Form does not submit

---

## 2. PRODUCT BROWSING TESTS

### TC-PROD-001: View Product List
**Priority:** Medium | **Type:** Happy Path

**Preconditions:**
- User is logged in

**Test Steps:**
1. Login with valid credentials
2. Navigate to products page
3. Verify products are displayed

**Expected Results:**
- Product grid/list is visible
- Each product displays: name, price, image
- "Add to Cart" button is visible for each product

---

### TC-PROD-002: Add Single Product to Cart
**Priority:** Medium | **Type:** Happy Path

**Preconditions:**
- User is logged in
- User is viewing products

**Test Steps:**
1. Click "Add to Cart" on any product
2. Wait for cart update

**Expected Results:**
- Success notification appears
- Cart count increases by 1
- Product is added to cart

---

### TC-PROD-003: Add Multiple Products to Cart
**Priority:** Medium | **Type:** Happy Path

**Preconditions:**
- User is logged in
- User is viewing products

**Test Steps:**
1. Click "Add to Cart" on product A
2. Click "Add to Cart" on product B
3. Click "Add to Cart" on product C
4. Check cart count

**Expected Results:**
- Cart count shows 3 items
- All three products are in cart

---

## 3. CART MANAGEMENT TESTS

### TC-CART-001: View Cart Contents
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User is logged in
- User has items in cart

**Test Steps:**
1. Click on cart icon/link
2. Navigate to cart page

**Expected Results:**
- Cart page displays all added items
- Each item shows: name, quantity, price, subtotal
- Cart total is calculated correctly

---

### TC-CART-002: Increase Item Quantity
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User has items in cart

**Test Steps:**
1. Navigate to cart page
2. Locate an item with quantity 1
3. Increase quantity to 3
4. Wait for price update

**Expected Results:**
- Item quantity updates to 3
- Item subtotal updates correctly (price × 3)
- Cart total recalculates

---

### TC-CART-003: Decrease Item Quantity
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User has item with quantity > 1 in cart

**Test Steps:**
1. Navigate to cart page
2. Locate an item with quantity > 1
3. Decrease quantity by 1
4. Wait for price update

**Expected Results:**
- Item quantity decreases
- Item subtotal updates
- Cart total recalculates

---

### TC-CART-004: Remove Item from Cart
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User has multiple items in cart

**Test Steps:**
1. Navigate to cart page
2. Click "Remove" on any item
3. Confirm removal (if prompted)
4. Wait for cart update

**Expected Results:**
- Item is removed from cart
- Cart total updates
- Remaining items are still visible

---

### TC-CART-005: Empty Cart Display
**Priority:** Medium | **Type:** Edge Case

**Preconditions:**
- User has no items in cart

**Test Steps:**
1. Ensure cart is empty
2. Navigate to cart page

**Expected Results:**
- "Your cart is empty" message is displayed
- "Continue Shopping" button is visible
- No cart total is shown

---

## 4. CHECKOUT FLOW TESTS

### TC-CHK-001: Navigate to Checkout
**Priority:** Critical | **Type:** Happy Path

**Preconditions:**
- User is logged in
- User has items in cart

**Test Steps:**
1. Navigate to cart page
2. Click "Proceed to Checkout" button
3. Verify redirect to checkout page

**Expected Results:**
- User is redirected to https://shop-blinq.com/checkout
- Checkout form is displayed
- Cart summary is visible

---

### TC-CHK-002: Complete Full Checkout Flow
**Priority:** Critical | **Type:** Happy Path

**Preconditions:**
- User is logged in
- User has items in cart

**Test Steps:**
1. Navigate to checkout page
2. Fill shipping form:
   - Full Name: Test User
   - Address: 123 Test Street
   - City: Test City
   - State: TS
   - ZIP: 12345
   - Country: Test Country
3. Fill payment form:
   - Card Number: 4111111111111111
   - Expiry: 12/25
   - CVV: 123
   - Name: Test User
4. Review order summary
5. Click "Place Order"

**Expected Results:**
- Order is successfully placed
- Order confirmation page is displayed
- Order number is generated and shown
- Success message is displayed
- Cart is cleared

---

### TC-CHK-003: Checkout with Single Item
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User has exactly 1 item in cart

**Test Steps:**
1. Add single item to cart
2. Proceed to checkout
3. Complete checkout process
4. Verify order

**Expected Results:**
- Single item appears in order summary
- Order completes successfully
- Correct total is charged

---

### TC-CHK-004: Checkout with Multiple Items
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User has 3+ items in cart

**Test Steps:**
1. Add multiple items to cart
2. Proceed to checkout
3. Complete checkout process
4. Verify order

**Expected Results:**
- All items appear in order summary
- Order total is sum of all items
- Order completes successfully

---

### TC-CHK-005: Order Review Before Confirmation
**Priority:** High | **Type:** Happy Path

**Preconditions:**
- User is on checkout page
- User has filled all forms

**Test Steps:**
1. Fill all required forms
2. Click "Review Order"
3. Verify order details
4. Confirm order

**Expected Results:**
- Review page shows:
  - All items with quantities
  - Shipping address
  - Payment method
  - Final total
- User can edit before confirming

---

### TC-CHK-006: Empty Cart Checkout Prevention
**Priority:** High | **Type:** Negative

**Preconditions:**
- User has empty cart

**Test Steps:**
1. Ensure cart is empty
2. Try to access checkout page directly

**Expected Results:**
- User is redirected to cart/products page
- Message: "Your cart is empty"
- Cannot proceed to checkout

---

## 5. FORM VALIDATION TESTS

### TC-VAL-001: Shipping Form - Empty Required Fields
**Priority:** High | **Type:** Negative

**Preconditions:**
- User is on checkout page

**Test Steps:**
1. Navigate to checkout page
2. Leave all shipping fields empty
3. Click "Continue" or "Next"

**Expected Results:**
- Validation errors for all required fields
- Form does not submit
- Error messages: "This field is required"

---

### TC-VAL-002: Shipping Form - Invalid Email Format
**Priority:** High | **Type:** Negative

**Preconditions:**
- User is on checkout page

**Test Steps:**
1. Navigate to checkout page
2. Enter invalid email: "invalid-email"
3. Click "Continue"

**Expected Results:**
- Error: "Please enter a valid email address"
- Email field is highlighted

---

### TC-VAL-003: Payment Form - Invalid Card Number
**Priority:** High | **Type:** Negative

**Preconditions:**
- User is on payment step

**Test Steps:**
1. Fill shipping form
2. Enter invalid card number: "123"
3. Click "Continue"

**Expected Results:**
- Error: "Please enter a valid card number"
- Payment does not process

---

### TC-VAL-004: Payment Form - Expired Card
**Priority:** Medium | **Type:** Negative

**Preconditions:**
- User is on payment step

**Test Steps:**
1. Fill shipping form
2. Enter card with past expiry: "12/20"
3. Click "Place Order"

**Expected Results:**
- Error: "Card has expired"
- Order is not placed

---

### TC-VAL-005: ZIP Code Validation
**Priority:** Medium | **Type:** Negative

**Preconditions:**
- User is on checkout page

**Test Steps:**
1. Fill shipping form
2. Enter invalid ZIP: "12"
3. Click "Continue"

**Expected Results:**
- Error: "Please enter a valid ZIP code"
- Field is highlighted

---

## 6. NAVIGATION TESTS

### TC-NAV-001: Products to Cart Navigation
**Priority:** Medium | **Type:** Happy Path

**Preconditions:**
- User is logged in

**Test Steps:**
1. Browse products page
2. Click cart icon
3. Verify navigation to cart page

**Expected Results:**
- Smooth navigation to cart
- User session persists
- URL changes to cart page

---

### TC-NAV-002: Cart to Checkout Navigation
**Priority:** Medium | **Type:** Happy Path

**Preconditions:**
- User has items in cart

**Test Steps:**
1. Navigate to cart page
2. Click "Checkout" button
3. Verify navigation

**Expected Results:**
- Redirect to checkout page
- Cart items transfer to checkout
- Session persists

---

### TC-NAV-003: Browser Back Button Behavior
**Priority:** Medium | **Type:** Edge Case

**Preconditions:**
- User is in checkout flow

**Test Steps:**
1. Proceed to checkout
2. Fill some form data
3. Click browser back button
4. Click forward button

**Expected Results:**
- Form data is preserved (if possible)
- No session errors
- User can continue checkout

---

## 7. EDGE CASE TESTS

### TC-EDGE-001: Session Timeout During Checkout
**Priority:** Medium | **Type:** Edge Case

**Preconditions:**
- User is in checkout flow

**Test Steps:**
1. Start checkout process
2. Wait for session timeout (simulate)
3. Try to complete order

**Expected Results:**
- Session expired message
- Redirect to login page
- Cart contents preserved

---

### TC-EDGE-002: Maximum Quantity Per Item
**Priority:** Medium | **Type:** Edge Case

**Preconditions:**
- User is on cart page

**Test Steps:**
1. Try to set quantity to 9999
2. Update cart

**Expected Results:**
- Quantity is capped at maximum allowed
- Warning message if applicable

---

### TC-EDGE-003: Concurrent Cart Modifications
**Priority:** Low | **Type:** Edge Case

**Preconditions:**
- User has items in cart

**Test Steps:**
1. Open cart in two tabs/windows
2. Modify cart in one tab
3. Try to modify in other tab

**Expected Results:**
- Cart refreshes with latest state
- No data corruption
- Appropriate warning if conflicts exist

---

### TC-EDGE-004: Network Error During Order Placement
**Priority:** Medium | **Type:** Edge Case

**Preconditions:**
- User is submitting order

**Test Steps:**
1. Fill checkout form completely
2. Submit order
3. Simulate network failure

**Expected Results:**
- Error message displayed
- User can retry order
- Cart contents are not lost
- No duplicate orders placed

---

## Test Execution Priority

### Phase 1 - Critical Path (Must Pass)
1. TC-AUTH-001: Successful Login
2. TC-PROD-002: Add Single Product to Cart
3. TC-CART-001: View Cart Contents
4. TC-CHK-002: Complete Full Checkout Flow

### Phase 2 - High Priority
5. TC-AUTH-002, TC-AUTH-003, TC-AUTH-004: Auth validations
6. TC-CART-002, TC-CART-003, TC-CART-004: Cart operations
7. TC-CHK-001, TC-CHK-003, TC-CHK-004: Checkout variations
8. TC-VAL-001 through TC-VAL-005: Form validations

### Phase 3 - Medium Priority
9. TC-PROD-001, TC-PROD-003: Product browsing
10. TC-CART-005: Empty cart
11. TC-CHK-005, TC-CHK-006: Checkout edge cases
12. TC-NAV-001, TC-NAV-002, TC-NAV-003: Navigation

### Phase 4 - Low Priority
13. TC-EDGE-001 through TC-EDGE-004: Edge cases

---

## Test Data Matrix

| Test Case | Username | Password | Product | Quantity | Shipping Info | Payment Info |
|-----------|----------|----------|---------|----------|---------------|--------------|
| TC-AUTH-001 | blinq_user | let_me_in | - | - | - | - |
| TC-AUTH-002 | invalid_user | let_me_in | - | - | - | - |
| TC-AUTH-003 | blinq_user | wrong_pass | - | - | - | - |
| TC-CHK-002 | blinq_user | let_me_in | Any | 1-3 | Test Address | 4111...1111 |
| TC-VAL-003 | blinq_user | let_me_in | Any | 1 | Test Address | Invalid |

---

## Browser Coverage Matrix

| Test Category | Chrome | Firefox | Safari | Mobile Chrome | Mobile Safari |
|---------------|--------|---------|--------|---------------|---------------|
| Authentication | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cart Management | ✓ | ✓ | ✓ | ✓ | ✓ |
| Checkout Flow | ✓ | ✓ | ✓ | ✓ | ✓ |
| Form Validation | ✓ | ✓ | - | - | - |

---

## Success Criteria

- **Pass Rate Target:** 100% for Phase 1 & 2 tests
- **Browser Coverage:** All major browsers (Chrome, Firefox, Safari)
- **Mobile Coverage:** At least one mobile device
- **Automation:** All tests automated in Playwright
- **Execution Time:** Full suite < 15 minutes

---

## Notes

- Test application is https://shop-blinq.com
- Always use test credentials, never production credentials
- Test card number 4111111111111111 is a valid test card
- All tests should be idempotent (can run multiple times)
- Clean up test data after each test run
- Screenshots should be captured on failure
