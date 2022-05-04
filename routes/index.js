var express = require('express');
const { route } = require('../app');
var router = express.Router();
let indexController = require('../controllers/indexController')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const authController = require('../controllers/authController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Domino Club', user:res.locals.currentUser });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title:'Signup to the Domino Club!'})
})

router.post('/signup', indexController.signup_post)

router.get('/jointheclub', function(req, res, next) {
  res.render('jointheclub', {title:'Join the club', user:res.locals.currentUser})
})

router.post('/jointheclub', indexController.jointheclub_post)

router.post('/login', authController.login_post)

router.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
