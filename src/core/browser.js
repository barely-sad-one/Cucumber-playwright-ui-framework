const { chromium, firefox } = require('@playwright/test');

/**
 * Wraps a Playwright browser instance for a given browser type.
 */
class Browser {
  /**
   * @param {'chromium'|'firefox'} browserType - The browser engine to launch.
   * @param {{ width: number, height: number }} [viewport] - Browser window dimensions.
   * @param {{ username: string, password: string }} [httpCredentials] - Credentials for HTTP basic auth.
   */
  constructor(browserType, viewport, httpCredentials) {
    this.viewport = viewport;
    this.httpCredentials = httpCredentials;

    switch(browserType) {
      case 'chromium':
        this._browserPromise = chromium.launch({
          headless: this.#isHeadless(),
        });
        break;
      case 'firefox':
        this._browserPromise = firefox.launch();
        break;
      default:
        throw new Error(`Browser type is invalid: ${browserType}`);
    }
  }

  /**
   * Creates and returns a new isolated browser context with optional viewport and HTTP credentials.
   * @returns {Promise<import('@playwright/test').BrowserContext>}
   */
  async getBrowserContext() {
    this._browser = await this._browserPromise;
    return this._browser.newContext({
      ...(this.viewport && { viewport: this.viewport }),
      ...(this.httpCredentials && { httpCredentials: this.httpCredentials }),
    });
  }

  /**
   * Closes the underlying Playwright browser instance.
   * @returns {Promise<void>}
   */
  async close() {
    await this._browser?.close();
  }

  #isHeadless() {
    if (process.env.HEADLESS == "false") return false;
    return true;
  }
};

module.exports = { Browser };
