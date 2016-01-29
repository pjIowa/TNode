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
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        
        //goal: get all tweets
        //structure: array of tweet dictionaries
        var query = client.query("select text, countyid, stateid from tweet order by id asc");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

router.get('/relStateAvg', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        
        //goal: get tweet count by state relative to the state average
        //structure: dictionary of stateid (FIPS code) to relative count
        var query = client.query("select stateid, cast(count(*)*(select count(distinct stateid) from tweet) as float)/cast((select count(*) from tweet) as float) as relcount from tweet group by stateid order by relcount;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

router.get('/relCountyAvg', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        
        //goal: get tweet count by county relative to the county average
        //structure: dictionary of countyid (FIPS code) to relative count
        var query = client.query("select countyid, cast(count(*)*(select count(distinct countyid) from tweet) as float)/cast((select count(*) from tweet) as float) as relcount from tweet group by countyid order by relcount;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

//Provide router
module.exports = router;