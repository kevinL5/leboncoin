var express = require('express')
var bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var mongoose = require('mongoose')

var find = require('lodash.find');

var app = express()
mongoose.connect("mongodb://localhost:27017/leboncoin")

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

var productSchema = new mongoose.Schema({
    user: String,
    title: String,
    city: String,
    price: Number,
    description: String,
    photos: [String],
    show: Boolean
})

var userSchema = new mongoose.Schema({
    pseudo: String,
    email: String,
    phone: String,
    products: [String]
})

var Product = mongoose.model("Product", productSchema)
var User = mongoose.model("User", userSchema)

// app.get('/annonce/:id/edit', function(req, res) {
//     var id = req.params.id

//     Product.findById(id, function(err, product) {
//         if (!err) { 
            
//         }
//     })
// })

app.post('/annonce/:id/delete', function(req, res) {
    var id = req.params.id

    Product.findById(id, function(err, product) {
        if (!err) { 
            product.show = false
            product.save(function(err, obj) {
                res.redirect('/')
            })   
        }
    })
})

app.get('/annonce/:id', function(req, res) {
    var id = req.params.id

    Product.findById(id, function(err, product) {
        if (!err) { 
            User.findById(product.user, function(err, user) {
                if (!err) {
                    res.render('detailsProduct.ejs', { product, user })
                }
            })
        }
    })
})

app.get('/deposer', function(req, res) {
    res.render('publishProduct.ejs')
})

app.post('/deposer', upload.single("photo"), function(req, res) {
    var product = new Product({
        title: req.body.title,
        city: req.body.city,
        price: req.body.price,
        pseudo: req.body.pseudo,
        description: req.body.description,
        show: true
    })
    if (req.file) product.photos = [req.file.filename]

    var user = new User({
        pseudo: req.body.pseudo,
        email: req.body.email,
        phone: req.body.phone,
        products: [product._id]
    })

    product.user = user._id

    user.save(function(err, obj) {
        if(!err) {
            product.save(function(err, obj) {
                if(!err) {
                    res.redirect('/annonce/' + product._id)
                }
            })
        }
    })

    
})

app.get('/', function(req,res) {
    Product.find({ show: true }, function(err, products) {
        if(!err) {
            res.render('home.ejs', { products })
        }
    }) 
})

app.listen(3000, function() {
    console.log("Listenning on port 3000")
})