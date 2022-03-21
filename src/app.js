import 'dotenv/config';
import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import cors from 'cors';

import mongoConnect from './core/database/mongo';
import useRoutes from './routes';

var app = express();

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app middleware
app.use(logger('dev'));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

mongoConnect();

// all routes
app.disable('etag'); // 304 issue

useRoutes(app);

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
