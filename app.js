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

app.post('/annonce/:id/edit', upload.single("photos"), function(req, res) {
    var id = req.params.id

    console.log(req.body)

    Product.findById(id, function(err, product) {
        if (!err) {
            product.title = req.body.title
            product.title = req.body.title
            product.city = req.body.city
            product.price = req.body.price
            product.pseudo = req.body.pseudo
            product.description = req.body.description
            
            if (req.file) product.photos = [req.file.filename]

            product.save(function(err, obj) {
                res.redirect('/annonce/' + obj._id)
            })
        }
    })
})

app.get('/annonce/:id/edit', function(req, res) {
    var id = req.params.id

    Product.findById(id, function(err, product) {
        if (!err) {
            console.log('coucou')
            console.log(product)
            res.render('publishProduct.ejs', { product })
        }
    })
})

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
    res.render('publishProduct.ejs', { product: null })
})

app.post('/deposer', upload.single("photos"), function(req, res) {
    var product = new Product({
        title: req.body.title,
        city: req.body.city,
        price: req.body.price,
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