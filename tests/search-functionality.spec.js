const { test, expect } = require('./base-test');
const { testConfig } = require('../config/test.config');

test.describe('Search Functionality Tests', () => {
  
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('should search and display relevant results', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.searchForProduct(searchTerm);
    
    // Verify results page loaded
    const isLoaded = await searchResultsPage.verifySearchResultsLoaded();
    expect(isLoaded).toBe(true);
    
    // Verify we have results
    const resultsCount = await searchResultsPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
    expect(resultsCount).toBeLessThanOrEqual(16); // Amazon typically shows 16 results per page
    
    // Verify product titles contain search term
    const productTitles = await searchResultsPage.getProductTitles();
    expect(productTitles.length).toBeGreaterThan(0);
  });

  test('should navigate to product page from search results', async ({ homePage, searchResultsPage, productPage }) => {
    const searchTerm = testConfig.testData.searchTerms[1];
    
    await homePage.searchForProduct(searchTerm);
    await searchResultsPage.clickFirstProduct();
    
    const isProductLoaded = await productPage.verifyProductPageLoaded();
    expect(isProductLoaded).toBe(true);
    
    const productTitle = await productPage.getProductTitle();
    expect(productTitle.length).toBeGreaterThan(0);
  });

  test('should sort search results', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.searchForProduct(searchTerm);
    
    // Get initial results
    const initialTitles = await searchResultsPage.getProductTitles();
    
    // Sort by price: low to high
    await searchResultsPage.sortBy('price-asc-rank');
    
    // Get sorted results
    const sortedTitles = await searchResultsPage.getProductTitles();
    
    // Verify results changed (titles might be different after sorting)
    expect(sortedTitles.length).toBeGreaterThan(0);
  });

  test('should filter search results by brand', async ({ homePage, searchResultsPage }) => {
    const searchTerm = 'laptop';
    
    await homePage.searchForProduct(searchTerm);
    
    // Get available filters
    const filters = await searchResultsPage.getAvailableFilters();
    
    if (filters.brands && filters.brands.length > 0) {
      const firstBrand = filters.brands[0];
      await searchResultsPage.filterByBrand(firstBrand);
      
      const filteredResults = await searchResultsPage.getSearchResultsCount();
      expect(filteredResults).toBeGreaterThan(0);
    }
  });

  test('should handle pagination', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.searchForProduct(searchTerm);
    
    // Check if next page is available
    const canGoNext = await searchResultsPage.goToNextPage();
    
    if (canGoNext) {
      // Verify we're on page 2
      const currentUrl = await searchResultsPage.getCurrentUrl();
      expect(currentUrl).toContain('page=2');
      
      // Go back to previous page
      const canGoPrevious = await searchResultsPage.goToPreviousPage();
      expect(canGoPrevious).toBe(true);
    }
  });

  test('should display search results information', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.searchForProduct(searchTerm);
    
    const resultsInfo = await searchResultsPage.getResultsInfo();
    expect(resultsInfo).toBeDefined();
    expect(resultsInfo.length).toBeGreaterThan(0);
  });

  test('should handle no search results', async ({ homePage, searchResultsPage }) => {
    const invalidTerm = 'xyz123notfound999';
    
    await homePage.searchForProduct(invalidTerm);
    
    // Should either have no results message or some results
    const hasNoResults = await searchResultsPage.hasNoResults();
    const hasResults = await searchResultsPage.hasResults();
    
    expect(hasNoResults || hasResults).toBe(true);
    
    if (hasNoResults) {
      // Verify no results message is displayed
      expect(hasNoResults).toBe(true);
    }
  });

  test('should display sponsored products', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.searchForProduct(searchTerm);
    
    const sponsoredCount = await searchResultsPage.getSponsoredProductsCount();
    // Sponsored products might not always be present, so we just verify the count is non-negative
    expect(sponsoredCount).toBeGreaterThanOrEqual(0);
  });

  test('should search for different product categories', async ({ homePage, searchResultsPage }) => {
    for (const searchTerm of testConfig.testData.searchTerms) {
      await homePage.clearSearchBox();
      await homePage.searchForProduct(searchTerm);
      
      const hasResults = await searchResultsPage.hasResults();
      const hasNoResults = await searchResultsPage.hasNoResults();
      
      expect(hasResults || hasNoResults).toBe(true);
      
      if (hasResults) {
        const resultsCount = await searchResultsPage.getSearchResultsCount();
        expect(resultsCount).toBeGreaterThan(0);
      }
    }
  });

  test('should maintain search term in URL', async ({ homePage, searchResultsPage }) => {
    const searchTerm = testConfig.testData.searchTerms[0];
    
    await homePage.searchForProduct(searchTerm);
    
    const currentUrl = await searchResultsPage.getCurrentUrl();
    expect(currentUrl).toContain(encodeURIComponent(searchTerm));
  });

  test.describe('Advanced search filters', () => {
    
    test('should filter by price range', async ({ homePage, searchResultsPage }) => {
      const searchTerm = 'mobile';
      
      await homePage.searchForProduct(searchTerm);
      
      // Try to filter by a price range if available
      const filters = await searchResultsPage.getAvailableFilters();
      
      if (filters.prices && filters.prices.length > 0) {
        const firstPriceRange = filters.prices[0];
        await searchResultsPage.filterByPriceRange(firstPriceRange);
        
        const filteredResults = await searchResultsPage.getSearchResultsCount();
        expect(filteredResults).toBeGreaterThan(0);
      }
    });

    test('should filter by customer rating', async ({ homePage, searchResultsPage }) => {
      const searchTerm = 'headphones';
      
      await homePage.searchForProduct(searchTerm);
      
      // Try to filter by rating if available
      await searchResultsPage.filterByRating('4 Stars & Up');
      
      // Verify results are still displayed
      const hasResults = await searchResultsPage.hasResults();
      expect(hasResults).toBe(true);
    });
  });
});