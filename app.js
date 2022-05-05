var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let compression = require('compression')
require('dotenv').config()
global.decode = require('./helpers').decode
let mongoDB = process.env.DB_URL
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
let User = require('./models/user')
var indexRouter = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'), {
  extension: 'pug',
  options: {
    globals:['decode']
  }
});
app.set('view engine', 'pug', {});


passport.use(
  new LocalStrategy({usernameField:'username', passwordField:'password'},
  (username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          console.log('success')
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    });
  })
);


passport.serializeUser(function(user, done) {
  done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

app.use(compression())
app.use(helmet())
app.use(session({secret:'cats', resave:false, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:false}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next()
})

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
