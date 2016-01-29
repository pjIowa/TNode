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
        var query = client.query("select text, countyid, stateid from tweet order by id asc");

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

router.get('/relStateAvg', function(req, res) {
    
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
        var query = client.query("select stateid, cast(count(*)*(select count(distinct stateid) from tweet) as float)/cast((select count(*) from tweet) as float) as relcount from tweet group by stateid order by relcount;");

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

router.get('/relCountyAvg', function(req, res) {
    
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
        var query = client.query("select countyid, cast(count(*)*(select count(distinct countyid) from tweet) as float)/cast((select count(*) from tweet) as float) as relcount from tweet group by countyid order by relcount;");

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