let User = require('../models/user')
let bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');

signup_post = [
    //need to validate the user input.
    body('first_name', 'first name must be between 2 and 50 characters')
        .trim().isLength({ min:2, max:50 }).escape(),
    body('last_name', 'last name must be between 2 and 5- characters')
        .trim().isLength({min:2, max:50}).escape(),
    body('email').custom(value => {
        return User.find({email:value}).then(user => {
            if (user) {
                return Promise.reject('Email already in use')
            }
        })
    }).escape(),
    body('password').isLength({min:5}).escape(),
    body('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }

        return true
    }).escape(),

     
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            //There are errors. Rerender the form with
            //inputted values.
            res.render('signup', {
                title:'Sign up to the Domino Club!',
                user:req.body,
                errors:errors.array()
            })
            return
        }
        else {
            //validation successful, so hash the password then 
            //save the user.
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {return next(err); }
                const user = new User({
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    email:req.body.last_name,
                    password:hashedPassword,
                    member_status:false,
                    isAdmin:false
                }).save(err => {
                    if (err) {return next(err); }
                    res.redirect('/')
                })
            })

        }
    
    }

]

module.exports = {signup_post}