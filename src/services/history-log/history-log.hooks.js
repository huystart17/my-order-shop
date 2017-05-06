'use strict';

const { authenticate } = require('feathers-authentication').hooks;

const getSenderForHistoryLog = require('../../hooks/get-sender-for-history-log');

module.exports = {
  before: {
    all: [ ],
    find: [],
    get: [],
    create: [getSenderForHistoryLog()],
    update: [authenticate('jwt')],
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
