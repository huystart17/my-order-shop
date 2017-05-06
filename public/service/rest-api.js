/**
 * Created by huy on 4/6/17.
 */
const feathers = require('feathers/client');
const rest = require('feathers-rest/client');
const superagent = require('superagent');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication-client');

const feathersClient = feathers();

feathersClient.configure(hooks())
  .configure(rest('http://localhost:3030').superagent(superagent))
  .configure(auth({ storage: localStorage }));


// This will now connect to the http://my-feathers-server.com/messages API
module.exports = feathersClient;
