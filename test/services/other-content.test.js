'use strict';

const assert = require('assert');
const app = require('../../src/app');

describe('\'otherContent\' service', () => {
  it('registered the service', () => {
    const service = app.service('other-content');

    assert.ok(service, 'Registered the service');
  });
});
