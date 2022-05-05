var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController')
const authController = require('../controllers/authController')
const helper = require('../helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  const messages = helper.getAllMessages()
  messages.then(message_list => {
    res.render('index', {user:res.locals.currentUser, message_list:message_list})
  })
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

router.get("/signout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.post('/new-message', indexController.new_message_post)

router.post('/delete-message/:id', indexController.message_delete)

module.exports = router;
