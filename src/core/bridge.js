const { LoginPage } = require('../pages/loginPage');
const { WindowPage } = require('../pages/windowPage');

/**
 * Registry that holds instantiated page objects for a given Playwright page.
 * Acts as a central access point so tests don't construct page objects directly.
 */
class Bridge {
  /**
   * @param {import('@playwright/test').Page} page - The Playwright page instance shared across all page objects.
   */
  constructor(page) {
    this.page = page;
    /** @type {Object.<string, object>} */
    this.pageObjs = {};
    this.loginPage = new LoginPage(page);
    this.windowPage = new WindowPage(page);
  }
}

module.exports = { Bridge };
