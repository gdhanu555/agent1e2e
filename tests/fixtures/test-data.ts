/**
 * Test data fixtures for Shop-Blinq checkout tests
 */

export interface User {
  username: string;
  password: string;
  email?: string;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}

export interface Product {
  name: string;
  price: string;
}

/**
 * Valid user credentials (SauceDemo demo site)
 */
export const VALID_USER: User = {
  username: 'standard_user',
  password: 'secret_sauce',
  email: 'standard_user@example.com'
};

/**
 * Invalid user credentials for negative testing
 */
export const INVALID_USER: User = {
  username: 'invalid_user',
  password: 'wrong_password',
  email: 'invalid@example.com'
};

/**
 * Valid shipping information
 */
export const VALID_SHIPPING: ShippingInfo = {
  fullName: 'Test User',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TS',
  zip: '12345',
  country: 'United States',
  email: 'test@example.com'
};

/**
 * Valid payment information (test card)
 */
export const VALID_PAYMENT: PaymentInfo = {
  cardNumber: '4111111111111111',
  expiry: '12/25',
  cvv: '123',
  cardholderName: 'Test User'
};

/**
 * Invalid payment information for negative testing
 */
export const INVALID_PAYMENT = {
  cardNumber: '123',
  expiry: '12/20', // Expired
  cvv: '12', // Too short
  cardholderName: ''
};

/**
 * Empty form data for validation testing
 */
export const EMPTY_SHIPPING: ShippingInfo = {
  fullName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  email: ''
};

/**
 * Invalid email formats for validation testing
 */
export const INVALID_EMAILS = [
  'invalid-email',
  'notanemail',
  '@example.com',
  'test@',
  'test..test@example.com'
];

/**
 * Application URLs
 */
export const URLS = {
  base: 'https://www.saucedemo.com',
  login: 'https://www.saucedemo.com',
  products: 'https://www.saucedemo.com/inventory.html',
  cart: 'https://www.saucedemo.com/cart.html',
  checkout: 'https://www.saucedemo.com/checkout-step-one.html'
} as const;

/**
 * Test data generator functions
 */
export const TestDataGenerator = {
  /**
   * Generate a random user
   */
  randomUser(): User {
    const timestamp = Date.now();
    return {
      username: `user_${timestamp}`,
      password: `Pass_${timestamp}!`,
      email: `user_${timestamp}@example.com`
    };
  },

  /**
   * Generate random shipping info
   */
  randomShipping(): ShippingInfo {
    const timestamp = Date.now();
    return {
      fullName: `Test User ${timestamp}`,
      address: `${timestamp} Test Street`,
      city: 'Test City',
      state: 'TS',
      zip: timestamp.toString().slice(-5),
      country: 'United States',
      email: `test${timestamp}@example.com`
    };
  },

  /**
   * Generate a large quantity for edge case testing
   */
  largeQuantity(): number {
    return 9999;
  },

  /**
   * Generate a negative quantity for edge case testing
   */
  negativeQuantity(): number {
    return -1;
  },

  /**
   * Generate zero quantity for edge case testing
   */
  zeroQuantity(): number {
    return 0;
  }
};

/**
 * Expected error messages
 */
export const ERROR_MESSAGES = {
  invalidCredentials: 'Invalid username or password',
  requiredField: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidCard: 'Please enter a valid card number',
  cardExpired: 'Card has expired',
  invalidZip: 'Please enter a valid ZIP code',
  emptyCart: 'Your cart is empty',
  sessionExpired: 'Your session has expired'
} as const;

/**
 * Expected success messages
 */
export const SUCCESS_MESSAGES = {
  loginSuccess: 'Login successful',
  addedToCart: 'Added to cart',
  orderPlaced: 'Order placed successfully',
  itemRemoved: 'Item removed from cart'
} as const;
