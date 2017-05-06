'use strict';



const convertCartRequest = require('../../hooks/convert-cart-request');



module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [convertCartRequest()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
