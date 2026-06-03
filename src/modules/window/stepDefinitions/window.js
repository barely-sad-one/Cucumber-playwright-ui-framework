const { Given, When } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');


Given('The user navigate to window page', async function () {
  await this.pageFixture.bridge.windowPage.navigate();
  expect(await this.pageFixture.bridge.windowPage.isWindowPage()).toBeTruthy();
});

When('Click on the button redirect', async function () {
  await this.switchToNewTab(
    () => this.pageFixture.bridge.windowPage.clickNewPageBtn()
  );
  expect(await this.pageFixture.bridge.windowPage.isNewPage()).toBeTruthy();
});
