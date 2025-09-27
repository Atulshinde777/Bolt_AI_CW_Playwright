const { BasePage } = require('../utils/base-page');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.cartItems = '[data-name="Active Items"] [data-item-index]';
    this.cartItemTitles = '[data-name="Active Items"] .sc-product-title';
    this.cartItemPrices = '[data-name="Active Items"] .sc-price';
    this.quantityDropdowns = '[data-name="Active Items"] select[name="quantity"]';
    this.deleteButtons = '[data-name="Active Items"] [data-action="delete"]';
    this.saveForLaterButtons = '[data-name="Active Items"] [data-action="save-for-later"]';
    this.emptyCartMessage = '#sc-active-cart h2';
    this.proceedToCheckoutButton = '[name="proceedToRetailCheckout"]';
    this.continueShoppingLink = '#continue-shopping-link';
    this.subtotal = '#sc-subtotal-amount-activecart';
    this.cartCount = '#nav-cart-count';
    this.cartHeader = '#sc-active-cart h1';
    this.recommendedItems = '#sims-consolidated-1';
    this.savedItemsSection = '#sc-saved-cart';
    this.moveToCartButtons = '[data-action="move-to-cart"]';
    this.cartItemImages = '[data-name="Active Items"] img';
    this.editButton = '[data-action="edit"]';
  }

  async open() {
    await this.navigateTo('/gp/cart/view.html');
    await this.waitForElement(this.cartHeader, { timeout: 10000 });
  }

  async getCartItemCount() {
    const items = await this.page.$$(this.cartItems);
    return items.length;
  }

  async getCartItemTitles() {
    return await this.getTexts(this.cartItemTitles);
  }

  async getCartItemPrices() {
    return await this.getTexts(this.cartItemPrices);
  }

  async updateQuantity(itemIndex, newQuantity) {
    const quantitySelector = `${this.quantityDropdowns}:nth-of-type(${itemIndex + 1})`;
    await this.selectFromDropdown(quantitySelector, newQuantity.toString());
    await this.waitForTimeout(2000); // Wait for cart to update
  }

  async deleteItem(itemIndex) {
    const deleteSelector = `${this.deleteButtons}:nth-of-type(${itemIndex + 1})`;
    await this.clickElement(deleteSelector);
    await this.waitForTimeout(2000);
  }

  async deleteAllItems() {
    const itemCount = await this.getCartItemCount();
    for (let i = 0; i < itemCount; i++) {
      await this.deleteItem(0); // Always delete the first item
    }
  }

  async saveForLater(itemIndex) {
    const saveSelector = `${this.saveForLaterButtons}:nth-of-type(${itemIndex + 1})`;
    await this.clickElement(saveSelector);
    await this.waitForTimeout(2000);
  }

  async moveToCart(itemIndex) {
    const moveSelector = `${this.moveToCartButtons}:nth-of-type(${itemIndex + 1})`;
    await this.clickElement(moveSelector);
    await this.waitForTimeout(2000);
  }

  async proceedToCheckout() {
    await this.clickElement(this.proceedToCheckoutButton);
  }

  async continueShopping() {
    await this.clickElement(this.continueShoppingLink);
  }

  async getSubtotal() {
    if (await this.isElementVisible(this.subtotal)) {
      return await this.getText(this.subtotal);
    }
    return '0';
  }

  async isCartEmpty() {
    return await this.isElementVisible(this.emptyCartMessage);
  }

  async getEmptyCartMessage() {
    if (await this.isCartEmpty()) {
      return await this.getText(this.emptyCartMessage);
    }
    return '';
  }

  async hasSavedItems() {
    return await this.isElementVisible(this.savedItemsSection);
  }

  async getSavedItemsCount() {
    if (await this.hasSavedItems()) {
      const savedItems = await this.page.$$(`${this.savedItemsSection} [data-item-index]`);
      return savedItems.length;
    }
    return 0;
  }

  async verifyCartPageLoaded() {
    await this.waitForElement(this.cartHeader);
    const title = await this.getTitle();
    return title.includes('Cart') || title.includes('Shopping Cart');
  }

  async getRecommendedItemsCount() {
    if (await this.isElementVisible(this.recommendedItems)) {
      const items = await this.page.$$(`${this.recommendedItems} [data-item-index]`);
      return items.length;
    }
    return 0;
  }

  async isProceedToCheckoutEnabled() {
    if (await this.isElementVisible(this.proceedToCheckoutButton)) {
      const button = await this.page.$(this.proceedToCheckoutButton);
      const isDisabled = await button.getAttribute('disabled');
      return isDisabled === null;
    }
    return false;
  }

  async getCartItemByTitle(title) {
    const titles = await this.getCartItemTitles();
    const index = titles.findIndex(t => t.includes(title));
    return index !== -1 ? index : null;
  }

  async clearCart() {
    if (!(await this.isCartEmpty())) {
      await this.deleteAllItems();
    }
  }
}

module.exports = { CartPage };