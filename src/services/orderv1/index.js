'use strict';

const service = require('feathers-mongoose');
const orderv1 = require('./orderv1-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: orderv1,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/orderv1s', service(options));

  // Get our initialize service to that we can bind hooks
  const orderv1Service = app.service('/orderv1s');

  // Set up our before hooks
  orderv1Service.before(hooks.before);

  // Set up our after hooks
  orderv1Service.after(hooks.after);
};
