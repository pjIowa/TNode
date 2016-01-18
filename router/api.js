//Dependencies
var express = require('express');
var router = express.Router();

//Model
var Tweet = require('../models/tweet');

Tweet.methods(['get','put','post','delete']);
Tweet.register(router, '/tweets')

//Define the home page route
router.get('/', function (req, res) {
  res.render('index');
});

//Define the about route
router.get('/about', function(req, res) {
  res.send('About this view nephew');
});

//Provide router
module.exports = router;