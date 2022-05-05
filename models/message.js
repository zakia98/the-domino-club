let mongoose = require('mongoose')
let Schema = mongoose.Schema
let {decode} = require('he')

let MessageSchema = new Schema({
    title:{type:String, required:true},
    message:{type:String, required:true},
    user:{type:String, required:true},
    timestamp:{type:Date, required:true}
})

MessageSchema
    //decode escaped characters
    .virtual('decoded_message')
    .get(function() {
        let decodedMessage = decode(this.message)
        return decodedMessage
    }) 

MessageSchema
.virtual('decoded_title')
.get(function() {
    let decodedTitle = decode(this.title)
    return decodedTitle
}) 


module.exports = mongoose.model('Message', MessageSchema)