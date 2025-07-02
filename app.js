var createError = require('http-errors');
var express = require('express');
const fileUpload = require('express-fileupload');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require("connect-flash");
const { Pool } = require("pg");

const pool = new Pool({
  user: "riski",
  password: "todopassword",
  host: "localhost",
  port: 5432,
  database: "posdb",
});

var indexRouter = require('./routes/index')(pool);
var dashboardRouter = require('./routes/dashboard')(pool);
var usersRouter = require('./routes/users')(pool);
var goodUtilities = require('./routes/goods')(pool);
var units = require('./routes/units')(pool);
var suppliersRouter = require('./routes/suppliers')(pool);
var cunstomerRouter = require('./routes/customers')(pool);
var purchasesRouter = require('./routes/purchases')(pool);
var salesRouter = require('./routes/sales')(pool);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(fileUpload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "riski",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.locals.currentPath = req.path;
  next();
});

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/goods', goodUtilities);
app.use('/units', units)
app.use('/suppliers', suppliersRouter);
app.use('/customers', cunstomerRouter);
app.use('/purchases', purchasesRouter);
app.use('/sales', salesRouter);

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
