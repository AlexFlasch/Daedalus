var express = require('express');

var apiKey = require('./config.json').apiKey;
var Crystalys = require('crystalys').setApiKey(apiKey);
var crystalys = new Crystalys();

var app = express();

app.get('/', function(req, re) {
    res.send('You\'ve reached a Daedalus API server. You shouldn\'t be seeing this... whoops! :^)');
});

for (var schema in crystalys) {
    console.log(schema);
}

app.listen(8080);