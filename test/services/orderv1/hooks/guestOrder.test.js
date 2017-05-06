'use strict';

const assert = require('assert');
const guestOrder = require('../../../../src/services/orderv1/hooks/guestOrder.js');

describe('orderv1 guestOrder hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    guestOrder()(mockHook);

    assert.ok(mockHook.guestOrder);
  });
});
