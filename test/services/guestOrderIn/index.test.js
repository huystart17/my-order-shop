'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('guestOrderIn service', function() {
  it('registered the guestOrderIns service', () => {
    assert.ok(app.service('guestOrderIns'));
  });
});
