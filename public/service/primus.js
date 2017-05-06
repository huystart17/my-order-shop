/**
 * Created by huy on 4/6/17.
 */
const feathers = require('feathers');
const primus = require('feathers-primus/client');
const Primus = require('primus');
const Emitter = require('primus-emitter');
const hooks = require('feathers-hooks');
const Socket = Primus.createSocket({
  transformer: 'websockets',
  plugin: {
    'emitter': Emitter
  }
});
const socket = new Socket('http://api.feathersjs.com');
const app = feathers()
  .configure(hooks())
  // Configure and change the default timeout to one second
  .configure(primus(socket, { timeout: 1000 }));

module.exports = app;
