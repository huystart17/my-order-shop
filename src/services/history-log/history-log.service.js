'use strict';

// Initializes the `historyLog` service on path `/history-log`
const createService = require('feathers-mongoose');
const createModel = require('../../models/history-log.model');
const hooks = require('./history-log.hooks');
const filters = require('./history-log.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'history-log',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/history-log', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('history-log');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
