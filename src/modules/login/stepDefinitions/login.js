const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('I should able to login through dialouge', async function () {
  await this.pageFixture.bridge.loginPage.navigate();
  expect(await this.pageFixture.bridge.loginPage.isLoginPage()).toBeTruthy();
});
