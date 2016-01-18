//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');

//MongoDB database
mongoose.connect('mongodb://localhost/rest_test');

var app = express();

//IDK
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//View Engine Setup
app.set('views', './views');
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./router/api'));

//Start Server
app.listen(3000);
console.log('api running');