const fs = require('fs');
const path = require('path');

class TestHelpers {
  static async takeScreenshotOnFailure(page, testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testName}-${timestamp}.png`;
    const screenshotPath = path.join('screenshots', filename);
    
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  static async waitForPageLoad(page, timeout = 30000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async getRandomSearchTerm(category = 'electronics') {
    const searchTerms = require('../test-data/search-terms.json');
    const categoryTerms = searchTerms[category] || searchTerms.electronics;
    const randomIndex = Math.floor(Math.random() * categoryTerms.length);
    return categoryTerms[randomIndex];
  }

  static async generateTestReport(results) {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      results: results
    };

    const reportPath = path.join('reports', 'test-summary.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    return reportPath;
  }

  static async retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  static async clearBrowserData(context) {
    await context.clearCookies();
    await context.clearPermissions();
  }

  static generateRandomString(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static formatPrice(price) {
    return price.replace(/[^\d.]/g, '');
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async scrollToBottom(page) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  static async scrollToTop(page) {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  static async getElementCount(page, selector) {
    return await page.$$eval(selector, elements => elements.length);
  }

  static async isElementInViewport(page, selector) {
    return await page.$eval(selector, el => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });
  }
}

module.exports = { TestHelpers };