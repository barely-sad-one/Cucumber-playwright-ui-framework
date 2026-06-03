const { BasePage } = require('./basePage');

class WindowPage extends BasePage {
  constructor(page) {
    super(page);

    this.txtHeader = this.page.locator(`//h3[text()='Opening a new window']`);
    this.btnNewWindow = this.page.locator(`//a[text()='Click Here' and @target='_blank']`);
    this.txtNewPageHeader = this.page.locator(`//h3[text()='New Window']`);
  }

  async navigate() {
    const url = new URL("/windows", this.baseURL);
    await this.page.goto(url.href);
  }

  async isWindowPage() {
    return await this.txtHeader.waitFor({ state: 'visible' })
      .then(() => true)
      .catch(() => false);
  }

  async clickNewPageBtn() {
    await this.btnNewWindow.click();
  }

  async isNewPage() {
    return await this.txtNewPageHeader.waitFor({ state: 'visible' })
      .then(() => true)
      .catch(() => false);
  }
};

module.exports = { WindowPage };
