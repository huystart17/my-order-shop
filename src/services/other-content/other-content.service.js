'use strict';

// Initializes the `otherContent` service on path `/other-content`
const createService = require('./other-content.class.js');
const hooks = require('./other-content.hooks');
const filters = require('./other-content.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'other-content',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/other-content', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('other-content');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
