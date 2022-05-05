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

UserSchema
    .virtual('full_name')
    .get(function() {
        let fullname = this.first_name + ' ' + this.last_name
        return fullname
    }) 

module.exports = mongoose.model('User', UserSchema)