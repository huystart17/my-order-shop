'use strict';

const assert = require('assert');
const setProductInfo = require('../../../../src/services/guestOrderIn/hooks/setProductInfo.js');

describe('guestOrderIn setProductInfo hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    setProductInfo()(mockHook);

    assert.ok(mockHook.setProductInfo);
  });
});
