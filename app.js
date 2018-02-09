var express = require('express')
var bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var passport = require('passport');
var LocalStrategy = require('passport-local')
var passportLocalMongoose = require('passport-local-mongoose')

/* Models */
var User = require('./models/user')
var Product = require('./models/product')

var app = express()
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nom-du-projet")

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// Activer la gestion de la session
app.use(session({
    secret: 'leboncoin-app',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// Activer `passport`
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser()) // JSON.stringify
passport.deserializeUser(User.deserializeUser()) // JSON.parse


var resultsPerPage = 3

app.get("/deconnexion", function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/connexion', (req,res) => {
    var user = (req.user) ? req.user : {}
    res.render('login.ejs', { user }) 
})

app.post('/connexion', passport.authenticate('local', {
    successRedirect: '/moncompte',
    failureRedirect: '/connexion'
  }));

app.get('/moncompte', (req,res) => {
    if(req.user) {
        var user = req.user

        Product.find({user: req.user._id}, (err, products) => {
            res.render('myAccount.ejs', { products, user })
        })
    }
})

app.get('/demandes', (req, res) => {
    var user = (req.user) ? req.user : {}
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
                    f,
                    user
                })
            }
        })

    })
})

app.post('/annonce/:id/edit', upload.array('photos', 3), (req, res) => {
    var id = req.params.id

    if (req.user) {
        Product.findById(id, (err, product) => {
            if (!err) {
                if ( !req.user._id == product.user ) { 
                    return res.send('Biatch') 
                }

                product.title = req.body.title
                product.title = req.body.title
                product.city = req.body.city
                product.price = req.body.price
                product.pseudo = req.body.pseudo
                product.description = req.body.description
                
                if (req.files) {
                    var filenamePhotos = []
                    for (photo of req.files) filenamePhotos.push(photo.filename)
                    product.photos = filenamePhotos
                }

                product.save(function(err, obj) {
                    res.redirect('/annonce/' + obj._id)
                })
            }
        })
    }

})

app.get('/annonce/:id/edit', (req, res) => {
    var user = (req.user) ? req.user : {}
    var id = req.params.id

    Product.findById(id, (err, product) => {
        if (!err) {
            res.render('publishProduct.ejs', { product, user })
        }
    })
})

app.post('/annonce/:id/delete', (req, res) => {
    var id = req.params.id

    if (req.user) {
        Product.findById(id, (err, product) => {
            if (!err) {
                if ( !req.user._id == product.user ) { 
                    return res.send('Biatch') 
                }
    
                product.show = false
                product.save((err, obj) => {
                    res.redirect('/')
                })   
            }
        })
    } 
    
})

app.get('/annonce/:id', (req, res) => {
    var user = (req.user) ? req.user : {}
    var id = req.params.id

    Product.findById(id, (err, product) => {
        if (!err) { 
            User.findById(product.user, (err, depositor) => {
                if (!err) {
                    res.render('detailsProduct.ejs', 
                    { product, depositor, user })
                }
            })
        }
    })
})

app.get('/deposer', (req, res) => {
    var user = (req.user) ? req.user : {}
    res.render('publishProduct.ejs', { product: null, user })
})

app.post('/deposer', upload.array('photos', 3), (req, res) => {

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

    if (req.user) {
        saveAndRedirect(req.user._id)
    } else {
        User.register(
            new User({
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                products: [product._id]
            }),
            req.body.password, // password will be hashed
            function(err, user) {
                if (err) {
                    console.log(err)
                    return res.redirect('/deposer')
                } else {
                    passport.authenticate('local')(req, res, function() {
                        saveAndRedirect(req.user._id)
                    })
                }
            }
        )
    }
   
    function saveAndRedirect(userid) {
        product.user = userid
        product.save( (err, product) => {
            if(!err) {
                return res.redirect('/annonce/' + product._id)
            }
        })
    }
    
})

app.get('/', (req, res) => {
    var user = (req.user) ? req.user : {}
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
                    f,
                    user
                })
            }
        })

    })

})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started")
})