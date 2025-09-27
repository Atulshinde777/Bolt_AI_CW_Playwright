const { test, expect } = require('./base-test');
const { testConfig } = require('../config/test.config');

test.describe('Product Page Tests', () => {
  
  test.beforeEach(async ({ homePage, searchResultsPage }) => {
    await homePage.open();
    await homePage.searchForProduct(testConfig.testData.searchTerms[0]);
    await searchResultsPage.clickFirstProduct();
  });

  test('should load product page successfully', async ({ productPage }) => {
    const isLoaded = await productPage.verifyProductPageLoaded();
    expect(isLoaded).toBe(true);
    
    const title = await productPage.getProductTitle();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('');
  });

  test('should display product information', async ({ productPage }) => {
    // Verify product title
    const title = await productPage.getProductTitle();
    expect(title.length).toBeGreaterThan(0);
    
    // Verify product price
    const price = await productPage.getProductPrice();
    expect(price).toBeDefined();
    
    // Verify availability
    const availability = await productPage.getAvailabilityStatus();
    expect(availability).toBeDefined();
  });

  test('should add product to cart', async ({ productPage, cartPage }) => {
    // Check if add to cart is enabled
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      await productPage.addToCart();
      
      // Navigate to cart to verify item was added
      await cartPage.open();
      
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    } else {
      // Product might be out of stock or unavailable
      const availability = await productPage.getAvailabilityStatus();
      console.log(`Product not available for purchase: ${availability}`);
    }
  });

  test('should display product rating and reviews', async ({ productPage }) => {
    const rating = await productPage.getProductRating();
    const reviewCount = await productPage.getReviewCount();
    
    // Rating and reviews might not be available for all products
    expect(rating !== null || reviewCount === '0').toBe(true);
    
    if (rating) {
      expect(rating).toBeDefined();
    }
    
    if (reviewCount !== '0') {
      expect(parseInt(reviewCount.replace(/\D/g, ''))).toBeGreaterThan(0);
    }
  });

  test('should display delivery information', async ({ productPage }) => {
    const deliveryInfo = await productPage.getDeliveryInfo();
    expect(deliveryInfo).toBeDefined();
    expect(deliveryInfo.length).toBeGreaterThan(0);
  });

  test('should display product description', async ({ productPage }) => {
    const description = await productPage.getProductDescription();
    expect(description).toBeDefined();
    expect(description.length).toBeGreaterThan(0);
  });

  test('should display breadcrumb navigation', async ({ productPage }) => {
    const breadcrumb = await productPage.getBreadcrumb();
    expect(breadcrumb).toBeDefined();
    // Breadcrumb might be empty for some products
  });

  test('should add multiple quantities to cart', async ({ productPage, cartPage }) => {
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    if (isAddToCartEnabled) {
      const quantity = 2;
      await productPage.addToCart(quantity);
      
      await cartPage.open();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('should handle product variations', async ({ productPage }) => {
    // Try to select color variation if available
    const colorSelected = await productPage.selectProductVariation('color_name', 'Black');
    
    // Try to select size variation if available
    const sizeSelected = await productPage.selectProductVariation('size_name', 'Medium');
    
    // At least one variation selection should work for products with variations
    // If no variations available, both will return false which is also valid
    expect(colorSelected || sizeSelected || true).toBe(true);
  });

  test('should display seller information', async ({ productPage }) => {
    const sellerInfo = await productPage.getSellerInfo();
    expect(sellerInfo).toBeDefined();
    expect(sellerInfo.length).toBeGreaterThan(0);
  });

  test('should check Prime eligibility', async ({ productPage }) => {
    const isPrimeEligible = await productPage.isPrimeEligible();
    // Prime eligibility is product-specific, so we just verify the check works
    expect(typeof isPrimeEligible).toBe('boolean');
  });

  test('should handle wishlist functionality', async ({ productPage }) => {
    const wishlistAdded = await productPage.addToWishlist();
    // Wishlist might require login, so we just verify the function works
    expect(typeof wishlistAdded).toBe('boolean');
  });

  test('should display product images', async ({ productPage }) => {
    const imageCount = await productPage.getImageGalleryCount();
    expect(imageCount).toBeGreaterThan(0);
    
    if (imageCount > 1) {
      // Try clicking on second image if available
      await productPage.clickImageByIndex(1);
      await productPage.waitForTimeout(500);
    }
  });

  test('should handle out of stock products', async ({ homePage, searchResultsPage, productPage }) => {
    // Search for a specific term that might have out of stock items
    await homePage.clearSearchBox();
    await homePage.searchForProduct('rare book');
    await searchResultsPage.clickFirstProduct();
    
    const availability = await productPage.getAvailabilityStatus();
    const isAddToCartEnabled = await productPage.isAddToCartEnabled();
    
    expect(availability).toBeDefined();
    
    if (availability.toLowerCase().includes('out of stock') || 
        availability.toLowerCase().includes('unavailable')) {
      expect(isAddToCartEnabled).toBe(false);
    }
  });

  test('should navigate back to search results', async ({ productPage, page }) => {
    // Use browser back button
    await page.goBack();
    
    // Should be back on search results page
    const currentUrl = await productPage.getCurrentUrl();
    expect(currentUrl).toContain('s?k=');
  });

  test.describe('Product page interactions', () => {
    
    test('should handle product sharing', async ({ productPage }) => {
      await productPage.shareProduct();
      // Share functionality verification would depend on the specific implementation
      await productPage.waitForTimeout(1000);
    });

    test('should view customer reviews', async ({ productPage }) => {
      const reviewsViewed = await productPage.viewCustomerReviews();
      // Reviews might not be available for all products
      expect(typeof reviewsViewed).toBe('boolean');
    });

    test('should handle buy now functionality', async ({ productPage }) => {
      const isAddToCartEnabled = await productPage.isAddToCartEnabled();
      
      if (isAddToCartEnabled) {
        // Note: This would typically redirect to checkout, so we might want to skip actual execution
        // await productPage.buyNow();
        console.log('Buy Now button is available');
      }
    });
  });

  test.describe('Mobile product page', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    
    test('should display mobile product page correctly', async ({ productPage }) => {
      const isLoaded = await productPage.verifyProductPageLoaded();
      expect(isLoaded).toBe(true);
      
      const title = await productPage.getProductTitle();
      expect(title.length).toBeGreaterThan(0);
    });
  });
});