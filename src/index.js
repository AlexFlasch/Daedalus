"use strict";

const express = require('express');

const bodyParser = require('body-parser');

const util = require('util');
const chalk = require('chalk');
const rp = require('request-promise');
const config = require('./../config.json');
const Crystalys = require('crystalys');
var crystalys = new Crystalys();
crystalys.setApiKey(config.apiKey);

var domain = config.domain;
var port = config.port;

function log(msg) {
    console.log(chalk.bold.red('CRIT:') + chalk.white(msg));
}

var api = crystalys.getApi();

var app = express();

app.get('/', function (req, res) {
    res.send('You\'ve reached a Daedalus API server. You shouldn\'t be seeing this... whoops! :^)');
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(function(req, res, next) {
    console.log(req.method, req.url);

    next();
});

// construct request url based upon parameters
function constructUrl(params) {
    
    
    return requestUrl;   
}

// this is the general function that all endpoints will use
function requestFunction(schema, endpoint) { // all requests will take a json object of parameters that will be created by DemonEdge client-side
    return function(req, res) {
        let parameters = req.body.parameters;

        // no parameters passed and endpoint is requestable without parameters, then send request, otherwise error.
        if (Object.keys(parameters).length === 0) {
            if (!api[schema][endpoint].requestable) {
                log('Cannot send a request to this endpoint without parameters');
                res.send({ success: false, msg: 'Cannot send a request to this endpoint without parameters' });
            } else {
                let promise = api[schema][endpoint].sendRequest();
            
                promise.then(function(response) {
                    let data = response.result;
                    
                    res.send(data);
                });
            }
        } else { // parameters were sent, send request with specified parameters

            // parameters should be sent in a format like so:
            // {
            //      hero_id: <hero_id>,
            //      game_mode: <game_mode>,
            //      skill: <skill>,
            //      ... etc
            // }

            let urlParams = [];

            // put kv pairs into an array to eventually insert url query operators
            for(let key in parameters) {
                urlParams.push(key + '=' + parameters[key]);
            }

            for(let i = 0; i < urlParams.length; i++) {
                urlParams[i] = '&' + urlParams[i];
            }

            let apiKey = crystalys.getApiKey();
            let endpointUrl = api[schema][endpoint].urlSegments.join('/');

            endpointUrl += '/?key=' + apiKey; 

            let requestUrl = endpointUrl + urlParams.join('');
            let promise = rp(requestUrl);

            promise.then(function(response) {
                let data = response;

                res.send(data);
            });
        }
    };
}

// app.post('/api/match/getmatchhistory:parameters?', function(req, res) {
//     requestFunction(api.Match, api.Match.GetMatchHistory)(req, res);
// });

// generate routes for each endpoint
for (let schema in api) {
    if (typeof api[schema] === 'object') { // weed out functions exported by Crystalys
        for (let endpoint in api[schema]) { // get all
            app.post('/api/' + schema.toLowerCase() + '/' + endpoint.toLowerCase() + ':parameters?', function(req, res) {
                requestFunction(schema, endpoint)(req, res);
            });
        }
    }
}

function logAllRoutes(routes) {
   let Table = require('cli-table');
   let table = new Table({ head: ["", "Path"] });

   for (let key in routes) {
       if (routes.hasOwnProperty(key)) {
           let val = routes[key];
           if(val.route) {
               val = val.route;
               let _o = {};
               _o[val.stack[0].method]  = [val.path];
               table.push(_o);
           }
       }
   }

   console.log(table.toString());
}

// app.use('/', router);

app.listen(port, 'localhost', 256, function() {
    console.log('Waiting for requests on port ' + port);
    logAllRoutes(app._router.stack);
});
