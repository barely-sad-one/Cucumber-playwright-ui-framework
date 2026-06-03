class BasePage {
  constructor(page) {
    this.page = page;
  }

  get baseURL() {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL is not set in environment');
    }
    return process.env.BASE_URL;
  }

  async navigate() {
    throw new Error(`${this.constructor.name} must implement navigate()`);
  }
}

module.exports = { BasePage };
