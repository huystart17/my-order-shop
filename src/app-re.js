'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const primus = require('feathers-primus');
const middleware = require('./middleware');
const services = require('./services');
const session = require('express-session');
const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon(path.join(app.get('public'), 'favicon.ico')))
  .use('/', serveStatic(app.get('public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .configure(hooks())
  .configure(rest())
  .use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}))
  .use(function (req, res, next) {
    req.feathers.session = req.session;
    req.feathers.mySid = req.sessionID;
    next();
  })
  .configure(primus({transformer: 'websockets'}))
  .configure(services)
  .configure(middleware)

;

module.exports = app;
