import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
// import configured_passoprt from './global_objects/configured_passport';

dotenv.config();

import session from './config/session_config.mjs';
import bodyParser from 'body-parser';
import { promises as fs } from 'fs';

import indexRouter from './routes/index.mjs';
import registerRouter from './routes/register.mjs';
import apiRouter from './routes/api.mjs';
import rateLimiterUsingThirdParty from './config/rateLimiter.mjs';

var app = express();

// view engine setup

app.set('views', path.resolve("./views"));
app.set('view engine', 'ejs');

app.use(logger('dev'));//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join('./public')));
app.use(session);
app.use(rateLimiterUsingThirdParty);
// app.use(configured_passoprt.initialize());
// app.use(configured_passoprt.session());
// app.use(bodyParser.urlencoded())

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/api', apiRouter);


/** app.use("/admin/:admin_key", (req, res, next) => {

})*/

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



export default app;
