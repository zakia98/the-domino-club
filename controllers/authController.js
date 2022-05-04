const passport = require('passport')

exports.login_post = passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/',
    failureMessage:true
})