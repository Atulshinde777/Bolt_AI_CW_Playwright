const { BasePage } = require('../utils/base-page');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.productTitle = '#productTitle';
    this.productPrice = '.a-price-whole';
    this.productImage = '#landingImage';
    this.addToCartButton = '#add-to-cart-button';
    this.buyNowButton = '#buy-now-button';
    this.quantityDropdown = '#quantity';
    this.productDescription = '#feature-bullets';
    this.customerReviews = '#reviews-medley-footer';
    this.ratingStars = '#acrPopover';
    this.ratingCount = '#acrCustomerReviewText';
    this.availabilityMessage = '#availability span';
    this.deliveryInfo = '#mir-layout-DELIVERY_BLOCK';
    this.returnPolicy = '#mir-layout-RETURNS_POLICY';
    this.productVariations = '#variation_color_name ul li, #variation_size_name ul li';
    this.addToWishlistButton = '#add-to-wishlist-button';
    this.shareButton = '#share-button';
    this.productSpecifications = '#productDetails_detailBullets_sections1';
    this.imageGallery = '#altImages ul li';
    this.zoomView = '#magnifierLens';
    this.breadcrumb = '#wayfinding-breadcrumbs_feature_div';
    this.sellerInfo = '#merchant-info';
    this.primeEligible = '#primeEligiblePopover';
    this.compareButton = '#compare-add-button';
    this.recommendedProducts = '#similarities_feature_div';
    this.frequentlyBoughtTogether = '#sims-fbt';
  }

  async getProductTitle() {
    await this.waitForElement(this.productTitle);
    return await this.getText(this.productTitle);
  }

  async getProductPrice() {
    if (await this.isElementVisible(this.productPrice)) {
      return await this.getText(this.productPrice);
    }
    return 'Price not available';
  }

  async addToCart(quantity = 1) {
    // Select quantity if different from 1
    if (quantity > 1 && await this.isElementVisible(this.quantityDropdown)) {
      await this.selectFromDropdown(this.quantityDropdown, quantity.toString());
    }
    
    await this.clickElement(this.addToCartButton);
    await this.waitForTimeout(2000); // Wait for cart update
  }

  async buyNow() {
    await this.clickElement(this.buyNowButton);
  }

  async getAvailabilityStatus() {
    if (await this.isElementVisible(this.availabilityMessage)) {
      return await this.getText(this.availabilityMessage);
    }
    return 'Availability not shown';
  }

  async getProductRating() {
    if (await this.isElementVisible(this.ratingStars)) {
      const rating = await this.page.getAttribute(this.ratingStars, 'title');
      return rating;
    }
    return null;
  }

  async getReviewCount() {
    if (await this.isElementVisible(this.ratingCount)) {
      return await this.getText(this.ratingCount);
    }
    return '0';
  }

  async selectProductVariation(variationType, value) {
    const variationSelector = `#variation_${variationType} ul li[data-defaultasin]:has-text("${value}")`;
    if (await this.isElementVisible(variationSelector)) {
      await this.clickElement(variationSelector);
      await this.waitForTimeout(1000);
      return true;
    }
    return false;
  }

  async addToWishlist() {
    if (await this.isElementVisible(this.addToWishlistButton)) {
      await this.clickElement(this.addToWishlistButton);
      return true;
    }
    return false;
  }

  async shareProduct() {
    await this.clickElement(this.shareButton);
  }

  async getDeliveryInfo() {
    if (await this.isElementVisible(this.deliveryInfo)) {
      return await this.getText(this.deliveryInfo);
    }
    return 'Delivery info not available';
  }

  async getProductDescription() {
    if (await this.isElementVisible(this.productDescription)) {
      return await this.getText(this.productDescription);
    }
    return 'Description not available';
  }

  async viewCustomerReviews() {
    if (await this.isElementVisible(this.customerReviews)) {
      await this.clickElement(this.customerReviews);
      return true;
    }
    return false;
  }

  async isAddToCartEnabled() {
    const button = await this.page.$(this.addToCartButton);
    if (button) {
      const isDisabled = await button.getAttribute('disabled');
      return isDisabled === null;
    }
    return false;
  }

  async isPrimeEligible() {
    return await this.isElementVisible(this.primeEligible);
  }

  async getBreadcrumb() {
    if (await this.isElementVisible(this.breadcrumb)) {
      return await this.getText(this.breadcrumb);
    }
    return '';
  }

  async getSellerInfo() {
    if (await this.isElementVisible(this.sellerInfo)) {
      return await this.getText(this.sellerInfo);
    }
    return 'Seller info not available';
  }

  async verifyProductPageLoaded() {
    await this.waitForElement(this.productTitle);
    await this.waitForElement(this.productImage);
    const title = await this.getProductTitle();
    return title.length > 0;
  }

  async getImageGalleryCount() {
    const images = await this.page.$$(this.imageGallery);
    return images.length;
  }

  async clickImageByIndex(index) {
    const imageSelector = `${this.imageGallery}:nth-child(${index + 1})`;
    await this.clickElement(imageSelector);
    await this.waitForTimeout(500);
  }
}

module.exports = { ProductPage };