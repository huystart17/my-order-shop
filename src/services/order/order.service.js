'use strict';

// Initializes the `order` service on path `/order`
const createService = require('feathers-mongoose');
const createModel = require('../../models/order.model');
const hooks = require('./order.hooks');
const filters = require('./order.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'order',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/order', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('order');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
