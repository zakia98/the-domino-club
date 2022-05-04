let User = require('../models/user')
let bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');

exports.signup_post = [
    //need to validate the user input.
    body('first_name', 'first name must be between 2 and 50 characters')
        .trim().isLength({ min:2, max:50 }).escape(),
    body('last_name', 'last name must be between 2 and 5- characters')
        .trim().isLength({min:2, max:50}).escape(),
    body('email').custom(value => {
        return User.findOne({email:value}).then(user => {
            if (user) {
                throw new Error('Email already in use')
            }
        })
    }).escape(),
    body('password', 'Password must be longer than 5 characters').isLength({min:5}).escape(),
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
                    email:req.body.email,
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

exports.jointheclub_post = [
    //Sanitize the inputs
    body('answer').trim().escape(),
    (req, res, next) => {
        if (req.body.answer !== 'Martini') {
            res.render('jointheclub', {
                title:'Join the club!',
                error:`Sorry, that's the wrong answer.`
            })
        } else if (!res.locals.currentUser) {
            res.render('jointheclub', {
                title:'Join the club!',
                error:'Please log in first.'
            })
        } else {
            //Change user's membership status to true
            console.log(res.locals)
            User.findOneAndUpdate({
                email:res.locals.currentUser.email
            }, {member_status:true}).exec()
            res.redirect('/')
        }
    }
]

