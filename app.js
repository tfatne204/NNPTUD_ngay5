var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/products', require('./routes/products'))
app.use('/api/v1/categories', require('./routes/categories'))

mongoose.connect('mongodb+srv://ttp1321102004_db_user:xN8ubiRe5uESbNtW@cluster0.9ydcldo.mongodb.net/?appName=Cluster0&retryWrites=false').catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('connected', function () {
  console.log("✓ MongoDB connected successfully");
})
mongoose.connection.on('disconnecting', function () {
  console.log("⚠ MongoDB disconnected");
})
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error:', err);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
