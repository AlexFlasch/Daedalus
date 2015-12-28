var express = require('express');

var util = require('util');
var chalk = require('chalk');
var apiKey = require('./config.json').apiKey;
var Crystalys = require('crystalys');
var crystalys = new Crystalys();
crystalys.setApiKey(apiKey);

var api = crystalys.getApi();

var app = express();
//app.use('/api', router);

var port = process.env.PORT || 8080;

var router = express.Router();


router.get('/', function (req, res) {
    res.send('You\'ve reached a Daedalus API server. You shouldn\'t be seeing this... whoops! :^)');
});

function log(msg) {
    console.log(chalk.bold.red('CRIT:') + chalk.white(msg));
}

//console.log(`api: ${util.inspect(api)}`)

// generate routes for each endpoint
for (var schema in api) {
    if (typeof api[schema] === 'object') { // weed out functions exported by Crystalys
        for (var endpoint in api[schema]) { // get all 
            router.post(`/api/${schema}/${endpoint}:parameters`, requestFunction);
        }
    }
}

// this is the general function that all endpoints will use
function requestFunction(req, res) { // all requests will take a json object of parameters that will be handled by DemonEdge client-side
    if (req.params.parameters === undefined) { // no parameters passed and endpoint is requestable without parameters, then send request, otherwise error.
        if (!api[schema][endpoint].requestable) {
            log('Cannot send a request to this endpoint without parameters');
            res.send({ success: false, msg: 'Cannot send a request to this endpoint without parameters' });
        }

    }
}

app.listen(8080);