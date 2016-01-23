//Dependencies
var express = require('express');
var pg = require('pg');
var path = require('path');
var fs = require('fs');

//Create Router
var router = express.Router();

//Load credentials for DB
var connectionString = 'postgres://'
fs.readFile(path.join(__dirname, 'credentialsDB.json'), function (error,data) {
    if (error){
        throw error;
    }
        
    if (data) {
        var jsonContent = JSON.parse(data);
        connectionString += jsonContent.username + ':' + jsonContent.password;
        connectionString += '@localhost/' + jsonContent.dbname;
    }
});

//Define the home page route
router.get('/', function (req, res) {
  res.render('index');
});

//Define the about route
router.get('/about', function(req, res) {
  res.send('About this view nephew');
});

router.get('/tweets', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM tweet ORDER BY id ASC");

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