const { World, setWorldConstructor } = require('@cucumber/cucumber');
const { Browser } = require('./browser');
const { PageFixture } = require('../fixtures/pageFixture');
const { Utils } = require('../utils/utils');
const { SoftExpect } = require('../utils/softExpect');


class TestWorld extends World {
  #tabs;

  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    /** @type {import('@playwright/test').Page} */
    this.page = null;
    this.pageFixture = null;
    this.utils = null;
    this.softErrors = [];
    this.#tabs = [];
  }

  #buildTab(page) {
    return { 
      page,
      pageFixture: new PageFixture(page),
      utils: new Utils(page) 
    };
  }

  #applyTab(tab) {
    this.page = tab.page;
    this.pageFixture = tab.pageFixture;
    this.utils = tab.utils;
  }

  /**
   * @param {object} [options]
   * @param {'chromium'|'firefox'} [options.browserType='chromium']
   * @param {{ width: number, height: number }} [options.viewport]
   * @param {{ username: string, password: string }} [options.httpCredentials]
   */
  async init({ browserType = 'chromium', viewport, httpCredentials } = {}) {
    this.browser = new Browser(browserType, viewport, httpCredentials);
    this.context = await this.browser.getBrowserContext();
    const page = await this.context.newPage();
    const tab = this.#buildTab(page);
    this.#tabs.push(tab);
    this.#applyTab(tab);
  }

  async cleanup() {
    await this.context?.close();
    await this.browser?.close();
  }

  async switchToNewTab(clickFn) {
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      clickFn(),
    ]);
    await newPage.waitForLoadState();
    const tab = this.#buildTab(newPage);
    this.#tabs.push(tab);
    this.#applyTab(tab);
  }

  async switchToTab(index) {
    if (index < 0 || index >= this.#tabs.length) {
      throw new Error(`Tab index ${index} out of range (${this.#tabs.length} tabs open).`);
    }
    this.#applyTab(this.#tabs[index]);
  }

  async switchToPreviousTab() {
    if (this.#tabs.length <= 1) {
      throw new Error('No previous tab to switch to.');
    }
    this.#applyTab(this.#tabs[this.#tabs.length - 2]);
  }

  async switchToLastTab() {
    this.#applyTab(this.#tabs[this.#tabs.length - 1]);
  }

  /**
   * @param {*} value - The value to assert against.
   * @returns {SoftExpect}
   */
  softExpect(value) {
    return new SoftExpect(this, value);
  }

  /**
   * Takes a screenshot of every open tab and attaches them to the Cucumber report.
   */
  async screenshotAllTabs() {
    for (let i = 0; i < this.#tabs.length; i++) {
      const screenshot = await this.#tabs[i].page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    }
  }
};

setWorldConstructor(TestWorld);
