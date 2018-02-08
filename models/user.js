var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
    pseudo: String,
    email: String,
    phone: String,
    products: []
})

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' })

module.exports = mongoose.model('User', userSchema)