var express = require('express');
var path = require('path');
var createError = require('http-errors');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var plantRouter = require('./routes/plant');
var createRouter = require('./routes/create');
var updateRouter = require('./routes/update');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/plant/', plantRouter);
app.use('/create/', createRouter);
app.use('/update/', updateRouter);
app.use('/public/images/uploads', express.static(path
    .join(__dirname, '/public/images/uploads')));

app.use('/sw.js', express.static(path.join(__dirname, 'public/index')));

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
  res.render('error', { title: 'Error' });
});

module.exports = app;
