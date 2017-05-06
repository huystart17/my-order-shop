'use strict';

const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');

const primus = require('feathers-primus');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const mongodb = require('./mongodb');

//express session
const session = require('express-session');


const authentication = require('./authentication');


const app = feathers();


// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(mongodb);
app.configure(rest());

app.configure(primus({transformer: 'websockets'}));

//config session
app.use(session({secret: 'helloo', resave: false, saveUninitialized: true, cookie:{maxAge : 10*24*60*60*1000}}));
app.use(function (req, res, next) {
  req.feathers.session = req.session;
  req.feathers.mySid = req.sessionID;
  next();
});



app.configure(authentication);



// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);

//

app.hooks(appHooks);

module.exports = app;
