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
  const hasSoftFailures = this.softErrors.length > 0;

  if (result.status === 'FAILED' || hasSoftFailures) {
    await this.screenshotAllTabs();
  }

  await this.cleanup();

  if (hasSoftFailures) {
    const msg = this.softErrors.map((e, i) => `[${i + 1}] ${e.message}`).join('\n');
    throw new Error(`Soft assertion failures:\n${msg}`);
  }
});
