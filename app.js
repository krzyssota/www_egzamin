var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session')
var connectSqlite = require('connect-sqlite3')
var SqliteStore = connectSqlite(session);
const secretString = '102101101108032116104101032098101114110'

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('baza.db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cookieParser(secretString));
app.use(session({
  secret: secretString,
  cookie: { maxAge: 15*60*1000, sameSite: 'strict' },
  resave: false,
  saveUninitialized: true,
  store: new SqliteStore()})
)

app.locals.db = db;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



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
