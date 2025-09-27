const { BasePage } = require('../utils/base-page');

class SearchResultsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.searchResults = '[data-component-type="s-search-result"]';
    this.productTitles = '[data-cy="title-recipe-title"] h2 a span';
    this.productPrices = '.a-price-whole';
    this.productImages = '.s-image';
    this.productRatings = '.a-icon-alt';
    this.filterSection = '#s-refinements';
    this.sortDropdown = '#s-result-sort-select';
    this.paginationNext = '.s-pagination-next';
    this.paginationPrevious = '.s-pagination-previous';
    this.resultsCount = '[data-component-type="s-result-info-bar"]';
    this.noResultsMessage = '[data-component-type="s-no-results"]';
    this.brandFilters = '#brandsRefinements ul li';
    this.priceFilters = '#priceRefinements ul li';
    this.ratingFilters = '#reviewsRefinements ul li';
    this.categoryFilters = '#departmentRefinements ul li';
    this.addToCartButtons = '[data-action="add-to-cart"]';
    this.sponsoredLabels = '[data-component-type="s-sponsored-result"]';
    this.productLinks = '[data-component-type="s-search-result"] h2 a';
  }

  async getSearchResultsCount() {
    const elements = await this.page.$$(this.searchResults);
    return elements.length;
  }

  async getProductTitles() {
    await this.waitForElement(this.productTitles);
    return await this.getTexts(this.productTitles);
  }

  async getProductPrices() {
    const prices = [];
    const priceElements = await this.page.$$(this.productPrices);
    
    for (let element of priceElements) {
      const price = await element.textContent();
      if (price) {
        prices.push(price.trim());
      }
    }
    return prices;
  }

  async clickFirstProduct() {
    await this.waitForElement(this.productLinks);
    await this.page.click(`${this.productLinks}:first-child`);
  }

  async clickProductByIndex(index) {
    const productLink = `${this.productLinks}:nth-child(${index + 1})`;
    await this.clickElement(productLink);
  }

  async sortBy(sortOption) {
    await this.selectFromDropdown(this.sortDropdown, sortOption);
    await this.waitForTimeout(2000); // Wait for results to reload
  }

  async filterByBrand(brandName) {
    const brandFilter = `${this.brandFilters}:has-text("${brandName}")`;
    await this.clickElement(brandFilter);
    await this.waitForTimeout(2000);
  }

  async filterByPriceRange(priceRange) {
    const priceFilter = `${this.priceFilters}:has-text("${priceRange}")`;
    await this.clickElement(priceFilter);
    await this.waitForTimeout(2000);
  }

  async filterByRating(rating) {
    const ratingFilter = `${this.ratingFilters}:has-text("${rating}")`;
    await this.clickElement(ratingFilter);
    await this.waitForTimeout(2000);
  }

  async goToNextPage() {
    if (await this.isElementVisible(this.paginationNext)) {
      await this.clickElement(this.paginationNext);
      await this.waitForTimeout(2000);
      return true;
    }
    return false;
  }

  async goToPreviousPage() {
    if (await this.isElementVisible(this.paginationPrevious)) {
      await this.clickElement(this.paginationPrevious);
      await this.waitForTimeout(2000);
      return true;
    }
    return false;
  }

  async hasResults() {
    return await this.isElementVisible(this.searchResults);
  }

  async hasNoResults() {
    return await this.isElementVisible(this.noResultsMessage);
  }

  async getResultsInfo() {
    if (await this.isElementVisible(this.resultsCount)) {
      return await this.getText(this.resultsCount);
    }
    return '';
  }

  async getSponsoredProductsCount() {
    const elements = await this.page.$$(this.sponsoredLabels);
    return elements.length;
  }

  async verifySearchResultsLoaded() {
    const hasResults = await this.hasResults();
    const hasNoResults = await this.hasNoResults();
    return hasResults || hasNoResults;
  }

  async getAvailableFilters() {
    const filters = {};
    
    if (await this.isElementVisible(this.brandFilters)) {
      filters.brands = await this.getTexts(this.brandFilters);
    }
    
    if (await this.isElementVisible(this.priceFilters)) {
      filters.prices = await this.getTexts(this.priceFilters);
    }
    
    return filters;
  }
}

module.exports = { SearchResultsPage };