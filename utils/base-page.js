const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
    this.timeout = 30000;
  }

  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async waitForElement(selector, options = {}) {
    return await this.page.waitForSelector(selector, {
      timeout: options.timeout || this.timeout,
      state: options.state || 'visible'
    });
  }

  async clickElement(selector, options = {}) {
    await this.waitForElement(selector);
    await this.page.click(selector, options);
  }

  async fillText(selector, text, options = {}) {
    await this.waitForElement(selector);
    await this.page.fill(selector, text, options);
  }

  async getText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  async getTexts(selector) {
    await this.page.waitForSelector(selector);
    return await this.page.$$eval(selector, elements => 
      elements.map(el => el.textContent.trim())
    );
  }

  async isElementVisible(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { 
        timeout, 
        state: 'visible' 
      });
      return true;
    } catch {
      return false;
    }
  }

  async isElementHidden(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { 
        timeout, 
        state: 'hidden' 
      });
      return true;
    } catch {
      return false;
    }
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true
    });
  }

  async scrollToElement(selector) {
    await this.waitForElement(selector);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async getTitle() {
    return await this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async waitForNavigation(options = {}) {
    await this.page.waitForNavigation({
      waitUntil: options.waitUntil || 'networkidle',
      timeout: options.timeout || this.timeout
    });
  }

  async selectFromDropdown(selector, value) {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, value);
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  async waitForTimeout(milliseconds) {
    await this.page.waitForTimeout(milliseconds);
  }
}

module.exports = { BasePage };