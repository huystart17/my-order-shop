'use strict';

const assert = require('assert');
const convertCartRequest = require('../../../../src/services/cart/hooks/convert_cartRequest.js');

describe('cart convertCartRequest hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    convertCartRequest()(mockHook);

    assert.ok(mockHook.convertCartRequest);
  });
});
