'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('orderv1 service', function() {
  it('registered the orderv1s service', () => {
    assert.ok(app.service('orderv1s'));
  });
});
