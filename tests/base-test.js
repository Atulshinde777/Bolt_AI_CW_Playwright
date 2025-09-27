const { test as base, expect } = require('@playwright/test');
const { HomePage } = require('../pages/home-page');
const { SearchResultsPage } = require('../pages/search-results-page');
const { ProductPage } = require('../pages/product-page');
const { CartPage } = require('../pages/cart-page');
const { EnvironmentConfig } = require('../config/environment.config');
const { testConfig } = require('../config/test.config');

const test = base.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  
  searchResultsPage: async ({ page }, use) => {
    const searchResultsPage = new SearchResultsPage(page);
    await use(searchResultsPage);
  },
  
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  
  config: async ({}, use) => {
    const config = new EnvironmentConfig();
    await use(config);
  }
});

// Custom assertions
expect.extend({
  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max;
    return {
      message: () => `expected ${received} to be within range ${min} - ${max}`,
      pass
    };
  },
  
  toContainSearchTerm(received, searchTerm) {
    const pass = received.toLowerCase().includes(searchTerm.toLowerCase());
    return {
      message: () => `expected "${received}" to contain search term "${searchTerm}"`,
      pass
    };
  }
});

module.exports = { test, expect };