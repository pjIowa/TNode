//Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var tweetSchema = new mongoose.Schema({
    text : String,
    unixtime: Number,
    latitude: Number,
    longitude: Number,
    countyId: Number,
    stateId: Number,
    userId: String
});

//Provide model
module.exports = restful.model('Tweets', tweetSchema);