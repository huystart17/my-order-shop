'use strict';

const assert = require('assert');
const convertCartRequest = require('../../src/hooks/convert-cart-request');

describe('\'convert_cartRequest\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = convertCartRequest();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
