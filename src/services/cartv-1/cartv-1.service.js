'use strict';

// Initializes the `cartv1` service on path `/cartv-1`
const createService = require('./cartv-1.class.js');
const hooks = require('./cartv-1.hooks');
const filters = require('./cartv-1.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'cartv-1',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/cartv-1', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('cartv-1');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
