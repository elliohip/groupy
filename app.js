require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var configured_passoprt = require('./global_objects/configured_passport');
var session = require('./config/session_config');
var bodyParser = require('body-parser')

// const MemoryStore = require('memorystore')(session)
const mongoose = require('mongoose');

// const MongoStore = require('connect-mongo');

console.log(process.env.MONGO_URL);

var connection = mongoose.connect(process.env.MONGO_URL);

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);
// app.use(configured_passoprt.initialize());
// app.use(configured_passoprt.session());
// app.use(bodyParser.urlencoded())

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(1);
});

module.exports = app;
