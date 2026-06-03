const { expect } = require('@playwright/test');

class SoftExpect {
  #world;
  #matchers;

  constructor(world, value) {
    this.#world = world;
    this.#matchers = expect(value);

    return new Proxy(this, {
      get(target, prop) {
        const matcher = target.#matchers[prop];
        if (typeof matcher === 'function') {
          return (...args) => {
            try {
              return matcher.apply(target.#matchers, args);
            } catch (e) {
              target.#world.softErrors.push(e);
            }
          };
        }
        return matcher;
      }
    });
  }
}

module.exports = { SoftExpect };
