let User = require('../models/user')
let bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
let Message = require('../models/message'); 
const helper = require('../helpers')

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
            //inputted values, and pass errors to display.
            res.render('signup', {
                title:'Sign up to the Domino Club!',
                user:req.body,
                errors:errors.array()
            })
            return
        }
        else {
            //validation successful, so we hash the password then 
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
        if (req.body.answer.toLowerCase() !== 'martini') {
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
            User.findOneAndUpdate({
                email:res.locals.currentUser.email
            }, {member_status:true}).exec()
            res.redirect('/')
        }
    }
]

exports.new_message_post = [
    body('title', 'Title must be between 5 and 50 characters').trim().isLength({min:5, max:50}).escape(),
    body('messageContent', 'Message must be between 2 and 100 characters').trim().isLength({min:2, max:100}).escape(),

    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            //There are errors. We need to re-render the form with previous values and show the errors.
            const messages = helper.getAllMessages()
            messages.then(message_list => {
              res.render('index', {
                  user:res.locals.currentUser, message_list:message_list,
                  title:req.body.title,
                  messageContent:req.body.messageContent,
                  user:res.locals.currentUser,
                  newMessageErrors:errors.array()
                })
            })
        } else {
            message = new Message({
                title:req.body.title,
                message:req.body.messageContent,
                user:res.locals.currentUser.full_name,
                timestamp: new Date()
            }).save(err => {
                if (err) {return next(err); }
                res.redirect('/')
            })
            
        }
    }
]

exports.message_delete = function(req, res, next) {
    console.log('hi')
    console.log(req.body)
    Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
        if (err) {return next(err); }
        //Success - redirect to main page
        res.redirect('/')
    })
}