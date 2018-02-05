var express = require('express')
var bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

var app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
    res.render('publishProduct.ejs')
})

app.listen(3000, function() {
    console.log("Listenning on port 3000")
})