const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const indexRouter = require('./routes/index');

const app = express();
require('dotenv').config();

// Setting up Mongoose and MongoDB
const mongoose = require('mongoose');                                                                                             //Import the mongoose module
const dbUserName = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME;
const mongoDB = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.t5chb.mongodb.net/${dbName}?retryWrites=true&w=majority`;     // Store the DB origin
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});                                                     //Set up default mongoose connection
const db = mongoose.connection;                                                                                                   //Get the default connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));                                                         //Bind connection to error event (to get notification of connection errors)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

module.exports = app;
