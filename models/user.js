let mongoose = require('mongoose')
let Schema = mongoose.Schema

let UserSchema = new Schema({
    first_name:{type:String, required:true},
    last_name:{type:String, required:true}, 
    email:{type:String, required:true},
    password:{type:String, required:true},
    member_status:{type:Boolean, required:false},
    isAdmin:{type:Boolean, required:false},
})

module.exports = mongoose.model('User', UserSchema)