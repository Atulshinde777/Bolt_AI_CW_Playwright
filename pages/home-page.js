const { BasePage } = require('../utils/base-page');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.searchBox = '#twotabsearchtextbox';
    this.searchButton = '#nav-search-submit-button';
    this.logo = '#nav-logo-sprites';
    this.accountMenu = '#nav-link-accountList';
    this.signInButton = '#nav-link-accountList';
    this.cartButton = '#nav-cart';
    this.cartCount = '#nav-cart-count';
    this.categoryMenu = '#nav-hamburger-menu';
    this.todaysDeals = '[data-csa-c-slot-id="nav_cs_0"]';
    this.primeMenu = '#nav-link-prime';
    this.deliverToSection = '#glow-ingress-line1';
    this.languageSelector = '#icp-nav-flyout';
    this.headerCategories = '#nav-xshop-container a';
    this.searchSuggestions = '[data-suggestion-index]';
    this.footer = '#navFooter';
  }

  async open() {
    await this.navigateTo('/');
    await this.waitForElement(this.logo);
  }

  async searchForProduct(searchTerm) {
    await this.fillText(this.searchBox, searchTerm);
    await this.clickElement(this.searchButton);
    await this.waitForTimeout(2000); // Wait for results to load
  }

  async searchWithEnter(searchTerm) {
    await this.fillText(this.searchBox, searchTerm);
    await this.pressKey('Enter');
    await this.waitForTimeout(2000);
  }

  async getSearchSuggestions(searchTerm) {
    await this.fillText(this.searchBox, searchTerm);
    await this.waitForElement(this.searchSuggestions);
    return await this.getTexts(this.searchSuggestions);
  }

  async clickOnAccount() {
    await this.clickElement(this.accountMenu);
  }

  async goToCart() {
    await this.clickElement(this.cartButton);
  }

  async getCartCount() {
    if (await this.isElementVisible(this.cartCount)) {
      return await this.getText(this.cartCount);
    }
    return '0';
  }

  async openCategoryMenu() {
    await this.clickElement(this.categoryMenu);
    await this.waitForTimeout(1000);
  }

  async clickTodaysDeals() {
    await this.clickElement(this.todaysDeals);
  }

  async getHeaderCategories() {
    return await this.getTexts(this.headerCategories);
  }

  async isLogoVisible() {
    return await this.isElementVisible(this.logo);
  }

  async getDeliveryLocation() {
    return await this.getText(this.deliverToSection);
  }

  async clearSearchBox() {
    await this.page.fill(this.searchBox, '');
  }

  async verifyHomePageLoaded() {
    await this.waitForElement(this.logo);
    await this.waitForElement(this.searchBox);
    await this.waitForElement(this.searchButton);
    const title = await this.getTitle();
    return title.includes('Amazon');
  }
}

module.exports = { HomePage };