//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//MongoDB database
mongoose.connect('mongodb://localhost/rest_test');

//Express
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'jade');

//Routes
app.use('/', require('./router/api'));

//Start Server
app.listen(3000);
console.log('api running');