const { Before, BeforeAll, After, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(120000);

function getHttpCredentials() {
  const options = {
    httpCredentials: {
      'username': process.env.USERNAME,
      'password': process.env.USERNAME,
    },
  };
  return options;
}

BeforeAll(async () => {
  process.loadEnvFile('.env');
});

Before(async function() {
  await this.init(getHttpCredentials());
});

After(async function({ result }) {
  if (result.status === 'FAILED') {
    await this.screenshotAllTabs();
  }
  await this.cleanup();
});
