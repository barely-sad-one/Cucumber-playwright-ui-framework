const { BasePage } = require('./basePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.txtHeader = this.page.locator(`//h3[text()='Basic Auth']`);
  }

  async navigate() {
    const url = new URL("/basic_auth", this.baseURL);
    await this.page.goto(url.href);
  }

  async isLoginPage() {
    return await this.txtHeader.waitFor({ state: 'visible' })
      .then(() => true)
      .catch(() => false);
  }
};

module.exports = { LoginPage };
