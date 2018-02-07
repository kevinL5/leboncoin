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

var resultsPerPage = 3

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

var userSchema = new mongoose.Schema({
    pseudo: String,
    email: String,
    phone: String,
    products: [String]
})

var Product = mongoose.model("Product", productSchema)
var User = mongoose.model("User", userSchema)

app.get('/demandes', (req, res) => {
    var currentPage = (req.query.page) ? req.query.page : 1
    var type = 'demandes'

    if (req.query.f) {
        var query = { who: req.query.f, type: 'request', show: true }
        var f = req.query.f
    }  else { 
        var query = { type: 'request', show: true }
        var f = null
    }

    Product.count(query, (err, count) => {
        var numberPages = Math.ceil(count/resultsPerPage)

        Product.find(query)
        .limit(resultsPerPage)
        .skip(currentPage * resultsPerPage - resultsPerPage)
        .exec(function(err, products) {
            if(!err) {
                res.render('home.ejs', { 
                    products, 
                    type, 
                    currentPage, 
                    numberPages,
                    f
                })
            }
        })

    })
})

app.post('/annonce/:id/edit', upload.single("photos"), (req, res) => {
    var id = req.params.id

    console.log(req.body)

    Product.findById(id, (err, product) => {
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

app.get('/annonce/:id/edit', (req, res) => {
    var id = req.params.id

    Product.findById(id, (err, product) => {
        if (!err) {
            console.log('coucou')
            console.log(product)
            res.render('publishProduct.ejs', { product })
        }
    })
})

app.post('/annonce/:id/delete', (req, res) => {
    var id = req.params.id

    Product.findById(id, (err, product) => {
        if (!err) { 
            product.show = false
            product.save((err, obj) => {
                res.redirect('/')
            })   
        }
    })
})

app.get('/annonce/:id', (req, res) => {
    var id = req.params.id

    Product.findById(id, (err, product) => {
        if (!err) { 
            User.findById(product.user, (err, user) => {
                if (!err) {
                    res.render('detailsProduct.ejs', { product, user })
                }
            })
        }
    })
})

app.get('/deposer', (req, res) => {
    res.render('publishProduct.ejs', { product: null })
})

app.post('/deposer', upload.array("photos", 3), (req, res) => {
    var product = new Product({
        who: req.body.who,
        type: req.body.type,
        title: req.body.title,
        city: req.body.city,
        price: req.body.price,
        description: req.body.description,
        show: true
    })

    if (req.files) {
        var filenamePhotos = []
        for (photo of req.files) filenamePhotos.push(photo.filename)
        product.photos = filenamePhotos
    }

    var user = new User({
        pseudo: req.body.pseudo,
        email: req.body.email,
        phone: req.body.phone,
        products: [product._id]
    })

    product.user = user._id

    user.save(function(err, obj) {
        if(!err) {
            product.save((err, obj) => {
                if(!err) {
                    res.redirect('/annonce/' + product._id)
                }
            })
        }
    })

    
})

app.get('/', (req, res) => {
    var currentPage = (req.query.page) ? req.query.page : 1
    var type = null

    if (req.query.f) {
        var query = { who: req.query.f, type: 'offer', show: true }
        var f = req.query.f
    }  else { 
        var query = { type: 'offer', show: true }
        var f = null
    }

    Product.count(query, (err, count) => {
        var numberPages = Math.ceil(count/resultsPerPage)

        Product.find(query)
        .limit(resultsPerPage)
        .skip(currentPage * resultsPerPage - resultsPerPage)
        .exec(function(err, products) {
            if(!err) {
                res.render('home.ejs', { 
                    products, 
                    type, 
                    currentPage, 
                    numberPages,
                    f
                })
            }
        })

    })

})

app.listen(3000, () => {
    console.log("Listenning on port 3000")
})