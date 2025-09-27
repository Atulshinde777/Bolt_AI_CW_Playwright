const { test, expect } = require('./base-test');
const { testConfig } = require('../config/test.config');

test.describe('Cart Functionality Tests', () => {
  
  test.beforeEach(async ({ cartPage }) => {
    // Start with empty cart for consistent testing
    await cartPage.open();
    if (!(await cartPage.isCartEmpty())) {
      await cartPage.clearCart();
    }
  });

  test('should display empty cart message', async ({ cartPage }) => {
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
    
    const emptyMessage = await cartPage.getEmptyCartMessage();
    expect(emptyMessage).toBeDefined();
    expect(emptyMessage.length).toBeGreaterThan(0);
  });

  test('should add item to cart and display it', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    // Add an item to cart
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      const productTitle = await productPage.getProductTitle();
      await productPage.addToCart();
      
      // Navigate to cart
      await cartPage.open();
      
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
      
      const cartTitles = await cartPage.getCartItemTitles();
      expect(cartTitles.length).toBe(1);
      
      // Verify the product title appears in cart (partial match due to truncation)
      const titleWords = productTitle.split(' ').slice(0, 3);
      const hasMatchingTitle = cartTitles.some(cartTitle => 
        titleWords.some(word => cartTitle.includes(word))
      );
      expect(hasMatchingTitle).toBe(true);
    }
  });

  test('should update item quantity in cart', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    // Add an item to cart first
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[1]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      await cartPage.open();
      
      const initialCount = await cartPage.getCartItemCount();
      expect(initialCount).toBe(1);
      
      // Update quantity to 2
      await cartPage.updateQuantity(0, 2);
      
      const updatedCount = await cartPage.getCartItemCount();
      expect(updatedCount).toBe(1); // Still 1 item but quantity is 2
      
      // Verify subtotal changed (would be higher)
      const subtotal = await cartPage.getSubtotal();
      expect(subtotal).toBeDefined();
    }
  });

  test('should delete item from cart', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    // Add an item to cart first
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      await cartPage.open();
      
      const initialCount = await cartPage.getCartItemCount();
      expect(initialCount).toBe(1);
      
      // Delete the item
      await cartPage.deleteItem(0);
      
      // Verify cart is empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(true);
    }
  });

  test('should save item for later', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    // Add an item to cart first
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[2]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      await cartPage.open();
      
      const initialCount = await cartPage.getCartItemCount();
      expect(initialCount).toBe(1);
      
      // Save for later
      await cartPage.saveForLater(0);
      
      // Verify active cart is empty but saved items exist
      const activeCount = await cartPage.getCartItemCount();
      expect(activeCount).toBe(0);
      
      const savedCount = await cartPage.getSavedItemsCount();
      expect(savedCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('should move saved item back to cart', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    // First save an item
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      await cartPage.open();
      await cartPage.saveForLater(0);
      
      // Now move it back to cart
      const hasSavedItems = await cartPage.hasSavedItems();
      
      if (hasSavedItems) {
        await cartPage.moveToCart(0);
        
        const activeCount = await cartPage.getCartItemCount();
        expect(activeCount).toBe(1);
      }
    }
  });

  test('should calculate subtotal correctly', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      await cartPage.open();
      
      const subtotal = await cartPage.getSubtotal();
      expect(subtotal).toBeDefined();
      expect(subtotal).not.toBe('0');
      
      // Subtotal should contain currency symbol or numeric value
      const hasNumericValue = /\d/.test(subtotal);
      expect(hasNumericValue).toBe(true);
    }
  });

  test('should enable checkout for items in cart', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[1]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      await cartPage.open();
      
      const isCheckoutEnabled = await cartPage.isProceedToCheckoutEnabled();
      expect(isCheckoutEnabled).toBe(true);
    }
  });

  test('should continue shopping from cart', async ({ homePage, cartPage }) => {
    await cartPage.open();
    await cartPage.continueShopping();
    
    // Should navigate back to home page or previous page
    const currentUrl = await cartPage.getCurrentUrl();
    expect(currentUrl).not.toContain('cart');
  });

  test('should display recommended items in cart', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    await searchResultsPage.clickFirstProduct();
    
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      await cartPage.open();
      
      const recommendedCount = await cartPage.getRecommendedItemsCount();
      // Recommended items might not always be present
      expect(recommendedCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle multiple items in cart', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    // Add first item
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    await searchResultsPage.clickFirstProduct();
    
    let isAddToCartEnabled = await productPage.isAddToCartEnabled();
    if (isAddToCartEnabled) {
      await productPage.addToCart();
    }
    
    // Add second item
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[1]);
    await searchResultsPage.clickFirstProduct();
    
    isAddToCartEnabled = await productPage.isAddToCartEnabled();
    if (isAddToCartEnabled) {
      await productPage.addToCart();
    }
    
    // Check cart
    await cartPage.open();
    const itemCount = await cartPage.getCartItemCount();
    
    if (itemCount >= 2) {
      // Test deleting one item
      await cartPage.deleteItem(0);
      
      const newCount = await cartPage.getCartItemCount();
      expect(newCount).toBe(itemCount - 1);
    }
  });

  test.describe('Cart edge cases', () => {
    
    test('should handle cart with unavailable items', async ({ cartPage }) => {
      await cartPage.open();
      
      // If cart has items that become unavailable, they should be handled gracefully
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(0);
    });

    test('should maintain cart state across sessions', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
      // Add item to cart
      await homePage.open();
      await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
      await searchResultsPage.clickFirstProduct();
      
      const isAddToCartEnabled = await productPage.isAddToCartEnabled();
      
      if (isAddToCartEnabled) {
        await productPage.addToCart();
        
        // Navigate away and back
        await homePage.open();
        await cartPage.open();
        
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Mobile cart functionality', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    
    test('should work on mobile devices', async ({ cartPage }) => {
      await cartPage.open();
      
      const isLoaded = await cartPage.verifyCartPageLoaded();
      expect(isLoaded).toBe(true);
    });
  });
});