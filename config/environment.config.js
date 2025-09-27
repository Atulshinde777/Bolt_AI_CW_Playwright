class EnvironmentConfig {
  constructor() {
    this.env = process.env.ENV || 'dev';
    this.config = this.getConfig();
  }

  getConfig() {
    const configs = {
      dev: {
        baseUrl: 'https://www.amazon.in',
        timeout: 30000,
        retries: 1,
        workers: 2,
        headless: false
      },
      staging: {
        baseUrl: 'https://www.amazon.in',
        timeout: 45000,
        retries: 2,
        workers: 3,
        headless: true
      },
      prod: {
        baseUrl: 'https://www.amazon.in',
        timeout: 60000,
        retries: 3,
        workers: 4,
        headless: true
      }
    };
    
    return configs[this.env] || configs.dev;
  }

  get baseUrl() {
    return this.config.baseUrl;
  }

  get timeout() {
    return this.config.timeout;
  }

  get retries() {
    return this.config.retries;
  }

  get workers() {
    return this.config.workers;
  }

  get headless() {
    return this.config.headless;
  }
}

module.exports = { EnvironmentConfig };