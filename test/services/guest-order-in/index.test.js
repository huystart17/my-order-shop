'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('guest-order-in service', function() {
  it('registered the guest-order-ins service', () => {
    assert.ok(app.service('guest-order-ins'));
  });
});
