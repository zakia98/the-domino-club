var express = require('express');
const { route } = require('../app');
var router = express.Router();
let indexController = require('../controllers/indexController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title:'Signup to the Domino Club!'})
})

router.post('/signup', indexController.signup_post)

module.exports = router;
