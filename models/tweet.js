//Dependencies
var pg = require('pg');

//Start DB
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tweets';
var client = new pg.Client(connectionString);
client.connect();

//Create Table
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(140), unixtime BIGINT, latitude NUMERIC, longitude NUMERIC, countyId SMALLINT, stateId SMALLINT, userId TEXT)');
query.on('end', function() { client.end(); });