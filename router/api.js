//Dependencies
var express = require('express');
var router = express.Router();
var pg = require('pg');

//Model
//var Tweet = require('../models/tweet');
//
//Tweet.methods(['get','put','post','delete']);
//Tweet.register(router, '/tweets')

//Database
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

//Define the home page route
router.get('/', function (req, res) {
  res.render('index');
});

//Define the about route
router.get('/about', function(req, res) {
  res.send('About this view nephew');
});

router.post('/tweets', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

//Provide router
module.exports = router;