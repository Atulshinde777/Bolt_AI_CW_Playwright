const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class TestRunner {
  constructor() {
    this.baseCommand = 'npx playwright test';
    this.reportsDir = './reports';
    this.screenshotsDir = './screenshots';
    this.logsDir = './logs';
  }

  createDirectories() {
    [this.reportsDir, this.screenshotsDir, this.logsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async runTests(options = {}) {
    this.createDirectories();

    const {
      testFile = '',
      browser = 'chromium',
      headed = false,
      workers = 1,
      retries = 0,
      timeout = 30000,
      grep = '',
      project = ''
    } = options;

    let command = this.baseCommand;

    if (testFile) command += ` ${testFile}`;
    if (browser && !project) command += ` --project=${browser}`;
    if (project) command += ` --project="${project}"`;
    if (headed) command += ` --headed`;
    if (workers) command += ` --workers=${workers}`;
    if (retries) command += ` --retries=${retries}`;
    if (timeout) command += ` --timeout=${timeout}`;
    if (grep) command += ` --grep="${grep}"`;

    console.log(`Running command: ${command}`);

    return new Promise((resolve, reject) => {
      const child = spawn('npx', command.split(' ').slice(1), {
        stdio: 'inherit',
        shell: true
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log('Tests completed successfully');
          resolve(code);
        } else {
          console.log(`Tests failed with exit code ${code}`);
          resolve(code);
        }
      });

      child.on('error', (error) => {
        console.error('Failed to start test process:', error);
        reject(error);
      });
    });
  }

  async runSmoke() {
    return this.runTests({
      grep: '@smoke',
      workers: 1,
      retries: 1
    });
  }

  async runRegression() {
    return this.runTests({
      workers: 2,
      retries: 2
    });
  }

  async runMobile() {
    return this.runTests({
      project: 'Mobile Chrome',
      workers: 1
    });
  }

  async runCrosssBrowser() {
    const browsers = ['chromium', 'firefox', 'webkit'];
    const results = [];

    for (const browser of browsers) {
      console.log(`\n Running tests on ${browser}...`);
      const result = await this.runTests({ browser, workers: 1 });
      results.push({ browser, exitCode: result });
    }

    return results;
  }

  generateReport() {
    console.log('\n Generating HTML report...');
    spawn('npx', ['playwright', 'show-report'], {
      stdio: 'inherit',
      shell: true
    });
  }
}

// CLI interface
if (require.main === module) {
  const runner = new TestRunner();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'smoke':
      runner.runSmoke();
      break;
    case 'regression':
      runner.runRegression();
      break;
    case 'mobile':
      runner.runMobile();
      break;
    case 'cross-browser':
      runner.runCrosssBrowser();
      break;
    case 'report':
      runner.generateReport();
      break;
    default:
      runner.runTests();
  }
}

module.exports = { TestRunner };