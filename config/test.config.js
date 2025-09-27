const testConfig = {
  // Timeouts
  defaultTimeout: 30000,
  shortTimeout: 5000,
  longTimeout: 60000,
  
  // Selectors timeout
  selectorTimeout: 10000,
  
  // Test data
  testData: {
    searchTerms: ['laptop', 'mobile phone', 'books', 'shoes'],
    invalidSearchTerms: ['xyz123', '!@#$%'],
    categories: ['Electronics', 'Fashion', 'Books', 'Home & Kitchen']
  },
  
  // Browser settings
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: 0,
    devtools: false
  },
  
  // Screenshot settings
  screenshot: {
    mode: 'only-on-failure',
    fullPage: true
  },
  
  // Video settings
  video: {
    mode: 'retain-on-failure',
    size: { width: 1280, height: 720 }
  }
};

module.exports = { testConfig };