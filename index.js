var express = require('express');

var util = require('util');
var chalk = require('chalk');
var apiKey = require('./config.json').apiKey;
var Crystalys = require('crystalys');
var crystalys = new Crystalys();
crystalys.setApiKey(apiKey);

function log(msg) {
    console.log(chalk.bold.red('CRIT:') + chalk.white(msg));
}

var api = crystalys.getApi();

var app = express();

var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.send('You\'ve reached a Daedalus API server. You shouldn\'t be seeing this... whoops! :^)');
});

app.use(function(req, res, next) {
    console.log(req.method, req.url);

    next();
});

// this is the general function that all endpoints will use
function requestFunction(schema, endpoint) { // all requests will take a json object of parameters that will be created by DemonEdge client-side
    return function(req, res) {
        if (req.params.parameters === undefined) { // no parameters passed and endpoint is requestable without parameters, then send request, otherwise error.
            if (!api[schema][endpoint].requestable) {
                log('Cannot send a request to this endpoint without parameters');
                res.send({ success: false, msg: 'Cannot send a request to this endpoint without parameters' });
            }

            res.send('yup this is a route');
        }
    };
}

app.post(`/api/match/getmatchhistory:parameters`, requestFunction(api.Match, api.Match.GetMatchHistory));

// generate routes for each endpoint
// for (var schema in api) {
//     if (typeof api[schema] === 'object') { // weed out functions exported by Crystalys
//         for (var endpoint in api[schema]) { // get all
//             router.post(`/api/${schema.toLowerCase()}/${endpoint.toLowerCase()}:parameters`, requestFunction);
//         }
//     }
// }

function logAllRoutes(routes) {
    var Table = require('cli-table');
   var table = new Table({ head: ["", "Path"] });

   for (var key in routes) {
       if (routes.hasOwnProperty(key)) {
           var val = routes[key];
           if(val.route) {
               val = val.route;
               var _o = {};
               _o[val.stack[0].method]  = [val.path];
               table.push(_o);
           }
       }
   }

   console.log(table.toString());
}

// app.use('/', router);

app.listen(port);
console.log('Waiting for requests on port ' + port);
logAllRoutes(app._router.stack);
