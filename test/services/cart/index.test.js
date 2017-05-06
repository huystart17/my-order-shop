'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('cart service', function() {
  it('registered the carts service', () => {
    assert.ok(app.service('carts'));
  });
});
