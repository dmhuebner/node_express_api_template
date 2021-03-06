const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      chalk = require('chalk'),
      debug = require('debug')('app'),
      logger = require('morgan'),
      config = require('./config');

let db;
if (config.envName === 'unit-test') {
  db = mongoose.connect('mongodb://localhost/REPLACE_THIS_WITH_DB_NAME_UNIT_TESTS', { useNewUrlParser: true });  // TODO replace with unit test DB name
} else if (config.envName === 'prod') {
  db = mongoose.connect('mongodb://localhost/REPLACE_THIS_WITH_PROD_DB_NAME', { useNewUrlParser: true }); // TODO replace with prod DB name
} else {
  db = mongoose.connect('mongodb://localhost/REPLACE_THIS_WITH_DEV_DB_NAME', { useNewUrlParser: true }); // TODO replace with Test DB name
}

const app = express(),
  port = config.port || 3000;

// Middleware
app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*========================
* Enable CORS Middleware
*========================*/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // TODO localhost port may need to be changed
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

/*======================
* Model dependencies
*======================*/
const Foo = require('./src/models/Foo');

/*======================
* Router Dependencies
*======================*/
const fooRouter = require('./src/routes/fooRoutes')(Foo);

/*======================
* Main routes
*======================*/
// TODO Add your routes
app.use('/api/foo', fooRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the [API_NAME] API!'); // TODO replace welcome text
});

/*======================
* Listen to the server
*======================*/

app.listen(port, () => {
  console.log(`${chalk.cyan('[API_NAME] is running on PORT:')} ${chalk.green(port)}`); // TODO replace listening text
});

module.exports = app;