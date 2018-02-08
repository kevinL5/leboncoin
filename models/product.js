var mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    user: String,
    who: String,
    type: String,
    title: String,
    city: String,
    price: Number,
    description: String,
    photos: [String],
    show: Boolean
})

module.exports = mongoose.model("Product", productSchema)