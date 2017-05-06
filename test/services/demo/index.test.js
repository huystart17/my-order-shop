'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('demo service', function() {
  it('registered the demos service', () => {
    assert.ok(app.service('demos'));
  });
});
