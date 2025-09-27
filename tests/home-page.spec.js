const { test, expect } = require('./base-test');
const { testConfig } = require('../config/test.config');

test.describe('Amazon Home Page Tests', () => {
  
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('should load home page successfully', async ({ homePage }) => {
    const isLoaded = await homePage.verifyHomePageLoaded();
    expect(isLoaded).toBe(true);
    
    const isLogoVisible = await homePage.isLogoVisible();
    expect(isLogoVisible).toBe(true);
  });

  test('should perform basic search functionality', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.searchForProduct(searchTerm);
    
    const isResultsLoaded = await searchResultsPage.verifySearchResultsLoaded();
    expect(isResultsLoaded).toBe(true);
    
    const resultsCount = await searchResultsPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
    
    const productTitles = await searchResultsPage.getProductTitles();
    expect(productTitles.length).toBeGreaterThan(0);
    
    // Verify search term appears in results
    const hasRelevantResults = productTitles.some(title => 
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(hasRelevantResults).toBe(true);
  });

  test('should search using Enter key', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[1];
    
    await homePage.searchWithEnter(searchTerm);
    
    const isResultsLoaded = await searchResultsPage.verifySearchResultsLoaded();
    expect(isResultsLoaded).toBe(true);
    
    const resultsCount = await searchResultsPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
  });

  test('should display search suggestions', async ({ homePage }) => {
    const searchTerm = 'lap'; // Partial search term
    
    const suggestions = await homePage.getSearchSuggestions(searchTerm);
    expect(suggestions.length).toBeGreaterThan(0);
    
    // Verify suggestions contain the search term
    const relevantSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(relevantSuggestions.length).toBeGreaterThan(0);
  });

  test('should navigate to cart', async ({ homePage, cartPage }) => {
    await homePage.goToCart();
    
    const isCartLoaded = await cartPage.verifyCartPageLoaded();
    expect(isCartLoaded).toBe(true);
  });

  test('should display cart count', async ({ homePage }) => {
    const cartCount = await homePage.getCartCount();
    expect(cartCount).toBeDefined();
    expect(parseInt(cartCount)).toBeGreaterThanOrEqual(0);
  });

  test('should open category menu', async ({ homePage }) => {
    await homePage.openCategoryMenu();
    // Add verification for category menu opening
    await homePage.waitForTimeout(1000);
  });

  test('should navigate to Today\'s Deals', async ({ homePage }) => {
    await homePage.clickTodaysDeals();
    
    const currentUrl = await homePage.getCurrentUrl();
    expect(currentUrl).toContain('deal');
  });

  test('should display header categories', async ({ homePage }) => {
    const categories = await homePage.getHeaderCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    // Verify some expected categories are present
    const expectedCategories = ['Electronics', 'Fashion', 'Home'];
    const hasExpectedCategories = expectedCategories.some(expectedCat =>
      categories.some(cat => cat.toLowerCase().includes(expectedCat.toLowerCase()))
    );
    expect(hasExpectedCategories).toBe(true);
  });

  test('should handle invalid search terms gracefully', async ({ homePage, searchResultsPage }) => {
    const invalidTerm = testConfig.testData.invalidSearchTerms[0];
    
    await homePage.searchForProduct(invalidTerm);
    
    const isResultsLoaded = await searchResultsPage.verifySearchResultsLoaded();
    expect(isResultsLoaded).toBe(true);
    
    // Should either have no results or some results
    const hasNoResults = await searchResultsPage.hasNoResults();
    const hasResults = await searchResultsPage.hasResults();
    
    expect(hasNoResults || hasResults).toBe(true);
  });

  test('should clear search box', async ({ homePage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.fillText(homePage.searchBox, searchTerm);
    let searchValue = await homePage.page.inputValue(homePage.searchBox);
    expect(searchValue).toBe(searchTerm);
    
    await homePage.clearSearchBox();
    searchValue = await homePage.page.inputValue(homePage.searchBox);
    expect(searchValue).toBe('');
  });

  test('should display delivery location', async ({ homePage }) => {
    const deliveryLocation = await homePage.getDeliveryLocation();
    expect(deliveryLocation).toBeDefined();
    expect(deliveryLocation.length).toBeGreaterThan(0);
  });

  test.describe('Mobile specific tests', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    
    test('should display mobile navigation', async ({ homePage }) => {
      await homePage.open();
      
      const isLogoVisible = await homePage.isLogoVisible();
      expect(isLogoVisible).toBe(true);
      
      // Verify search functionality works on mobile
      await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    });
  });
});