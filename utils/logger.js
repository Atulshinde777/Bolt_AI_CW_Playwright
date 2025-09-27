const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logFile = path.join('logs', `test-${new Date().toISOString().split('T')[0]}.log`);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    // Console output
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }

    // File output
    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  debug(message, data = null) {
    if (this.logLevel === 'debug') {
      this.log('debug', message, data);
    }
  }

  testStart(testName) {
    this.info(`Test started: ${testName}`);
  }

  testEnd(testName, status, duration) {
    this.info(`Test completed: ${testName}`, {
      status,
      duration: `${duration}ms`
    });
  }

  testFailed(testName, error) {
    this.error(`Test failed: ${testName}`, {
      error: error.message,
      stack: error.stack
    });
  }
}

module.exports = { Logger };