const Message = require('./models/message')

exports.getAllMessages = function() {
    return Message.find({})
        .sort({timestamp:-1})
}
