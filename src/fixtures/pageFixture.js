const { Bridge } = require('../core/bridge');

class PageFixture {
  constructor(page) {
    this.page = page;
    this.bridge = new Bridge(page);
  }
};


module.exports = { PageFixture };
