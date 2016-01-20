//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');

var app = express();

//Middleware for Request's Body Field
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//View Engine Setup
app.set('views', './views');
app.set('view engine', 'jade');

//Favicon
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

//Exposing Public Data
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./router/api'));

//Start Server
app.listen(3000);
console.log('api running');