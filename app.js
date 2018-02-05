var express = require('express')
var bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

var find = require('lodash.find');

var app = express()
var generalid = 3

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))


var products = [
    {
        id: 0,
        title: "Divers tupperware",
        city: "Rive-de-Gier",
        price: "15",
        photo: "8dae02fdde5f257a8d159d59a59cbf69"
    },
    {
        id: 1,
        title: "Divers tupperware 2",
        city: "Rive-de-Gier",
        price: "15",
        pseudo: "jeandu74",
        photo: "8dae02fdde5f257a8d159d59a59cbf69",
        description: "Un super tupperware"
    },
    {
        id: 2,
        title: "Divers tupperware 3",
        city: "Rive-de-Gier",
        price: "15",
        photo: "8dae02fdde5f257a8d159d59a59cbf69"
    }
]

app.get('/annonce/:id', function(req, res) {
    var id = req.params.id

    var product = find(products, ['id', parseInt(id)])

    console.log("id " + id)
    console.log(product)

    res.render('detailsProduct.ejs', { product })
    //res.send('coucou')
})

app.get('/deposer', function(req, res) {
    res.render('publishProduct.ejs')
})

app.post('/deposer', upload.single("photo"), function(req, res) {
    var newProduct = {
        id: generalid++,
        title: req.body.title,
        city: req.body.city,
        price: req.body.price,
        pseudo: req.body.pseudo,
        description: req.body.description,
        photo: req.file.filename
    }

    products = [...products, newProduct]

    res.redirect('/')
})

app.get('/', function(req,res) {
    console.log(products)
    res.render('home.ejs', { products })
})

app.listen(3000, function() {
    console.log("Listenning on port 3000")
})