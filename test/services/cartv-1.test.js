'use strict';

const assert = require('assert');
const app = require('../../src/app');

describe('\'cartv1\' service', () => {
  it('registered the service', () => {
    const service = app.service('cartv-1');

    assert.ok(service, 'Registered the service');
  });
});
