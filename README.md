# Playwright Test Automation Framework for Amazon.in

A comprehensive test automation framework built with Playwright and JavaScript using Page Object Model pattern for testing Amazon.in functionality.

## Features

- 🎭 **Playwright with JavaScript** - Modern, fast, and reliable test automation
- 📄 **Page Object Model** - Maintainable and scalable test architecture
- 🔧 **Configuration Management** - Environment-specific configurations
- 📊 **Comprehensive Reporting** - HTML, JSON, and JUnit reports
- 🔄 **Cross-Browser Testing** - Chrome, Firefox, Safari, and mobile browsers
- 📱 **Mobile Testing** - Responsive design testing on mobile devices
- 🛡️ **Robust Error Handling** - Screenshots and videos on failures
- 🔍 **Advanced Selectors** - Reliable element identification strategies

## Project Structure

```
├── config/                 # Configuration files
│   ├── environment.config.js
│   └── test.config.js
├── pages/                  # Page Object Model classes
│   ├── home-page.js
│   ├── search-results-page.js
│   ├── product-page.js
│   └── cart-page.js
├── tests/                  # Test specification files
│   ├── base-test.js
│   ├── home-page.spec.js
│   ├── search-functionality.spec.js
│   ├── product-page.spec.js
│   └── cart-functionality.spec.js
├── utils/                  # Utility functions and helpers
│   ├── base-page.js
│   ├── test-helpers.js
│   └── logger.js
├── test-data/             # Test data files
│   ├── search-terms.json
│   └── user-credentials.json
├── scripts/               # Test execution scripts
│   └── run-tests.js
├── reports/               # Test reports (generated)
├── screenshots/           # Screenshots on failures (generated)
├── logs/                  # Test execution logs (generated)
├── playwright.config.js   # Playwright configuration
├── .env                   # Environment variables
└── package.json
```

## Setup and Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd amazon-playwright-automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run setup
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env file with your configurations
```

## Configuration

### Environment Configuration

The framework supports multiple environments (dev, staging, prod) through the `environment.config.js` file:

```javascript
const config = {
  dev: {
    baseUrl: 'https://www.amazon.in',
    timeout: 30000,
    retries: 1,
    workers: 2,
    headless: false
  }
  // ... other environments
};
```

### Test Configuration

Test-specific configurations are managed in `test.config.js`:

```javascript
const testConfig = {
  defaultTimeout: 30000,
  testData: {
    searchTerms: ['laptop', 'mobile phone', 'books'],
    // ... more test data
  }
};
```

## Page Objects

### Base Page
All page objects extend the `BasePage` class which provides common functionality:

```javascript
class BasePage {
  async clickElement(selector, options = {})
  async fillText(selector, text, options = {})
  async waitForElement(selector, options = {})
  async isElementVisible(selector, timeout = 5000)
  // ... more methods
}
```

### Page Object Example

```javascript
class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchBox = '#twotabsearchtextbox';
    this.searchButton = '#nav-search-submit-button';
  }

  async searchForProduct(searchTerm) {
    await this.fillText(this.searchBox, searchTerm);
    await this.clickElement(this.searchButton);
  }
}
```

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run specific test file
npm run test:home

# Run tests with debug mode
npm run test:debug
```

### Test Suites

```bash
# Run smoke tests
npm run test:smoke

# Run full regression suite
npm run test:regression

# Run mobile tests
npm run test:mobile

# Run cross-browser tests
npm run test:cross-browser
```

### Custom Test Execution

```bash
# Run tests with specific browser
npx playwright test --project=firefox

# Run tests with specific grep pattern
npx playwright test --grep="search"

# Run tests with custom workers
npx playwright test --workers=4

# Run tests with retries
npx playwright test --retries=2
```

## Test Scenarios Covered

### Home Page Tests
- ✅ Page loading verification
- ✅ Search functionality (click and Enter key)
- ✅ Search suggestions
- ✅ Navigation elements
- ✅ Cart functionality
- ✅ Mobile responsiveness

### Search Functionality Tests
- ✅ Product search with results verification
- ✅ Search result navigation
- ✅ Sorting and filtering
- ✅ Pagination
- ✅ No results handling
- ✅ Sponsored products
- ✅ Advanced filters (price, brand, rating)

### Product Page Tests
- ✅ Product information display
- ✅ Add to cart functionality
- ✅ Product variations (size, color)
- ✅ Product reviews and ratings
- ✅ Image gallery
- ✅ Delivery information
- ✅ Prime eligibility
- ✅ Wishlist functionality

### Cart Functionality Tests
- ✅ Empty cart handling
- ✅ Add/remove items
- ✅ Quantity updates
- ✅ Save for later
- ✅ Subtotal calculations
- ✅ Checkout process
- ✅ Multiple items management
- ✅ Recommended products

## Reporting

### HTML Reports
```bash
npm run report
```

### Custom Reports
The framework generates multiple report formats:
- **HTML Report**: Interactive report with screenshots
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD integration compatible
- **Custom Summary**: Test execution summary

### Screenshots and Videos
- Screenshots are captured on test failures
- Videos are recorded for failed tests
- Files are organized by test name and timestamp

## Best Practices

### Test Writing Guidelines

1. **Use Page Objects**: Always interact with pages through page objects
2. **Explicit Waits**: Use explicit waits instead of hard-coded delays
3. **Descriptive Names**: Use clear, descriptive test and method names
4. **Independent Tests**: Each test should be independent and isolated
5. **Data Management**: Use external data files for test data

### Example Test Structure

```javascript
test.describe('Feature Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('should perform specific action', async ({ homePage, page }) => {
    // Arrange
    const testData = 'test input';
    
    // Act
    await homePage.performAction(testData);
    
    // Assert
    expect(await homePage.getResult()).toBe('expected result');
  });
});
```

### Debugging

1. **Debug Mode**:
```bash
npm run test:debug
```

2. **Headed Mode**:
```bash
npm run test:headed
```

3. **Pause on Failure**:
```javascript
await page.pause(); // Add this line to pause execution
```

4. **Screenshots**:
```javascript
await page.screenshot({ path: 'debug-screenshot.png' });
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: reports/
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
                sh 'npx playwright install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Report') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report'
                ])
            }
        }
    }
}
```

## Troubleshooting

### Common Issues

1. **Browser Installation**:
```bash
npx playwright install
```

2. **Permission Issues**:
```bash
sudo npx playwright install-deps
```

3. **Timeout Issues**: Increase timeout in config files

4. **Element Not Found**: Verify selectors and wait conditions

### Logging

Enable debug logging:
```bash
DEBUG=pw:api npm test
```

### Performance

- Use `networkidle` wait condition for dynamic content
- Implement proper wait strategies
- Use parallel execution with appropriate worker count
- Optimize selectors for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Code Style

- Follow ESLint configuration
- Use async/await for asynchronous operations
- Maintain consistent naming conventions
- Add JSDoc comments for public methods

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions and support:
- Create an issue in the repository
- Contact the test automation team
- Review the documentation and examples