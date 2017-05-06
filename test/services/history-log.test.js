'use strict';

const assert = require('assert');
const app = require('../../src/app');

describe('\'historyLog\' service', () => {
  it('registered the service', () => {
    const service = app.service('history-log');

    assert.ok(service, 'Registered the service');
  });
});
