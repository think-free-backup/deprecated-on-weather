        
/* **************************************************************** 
 *
 *  Description : Ownode weather server
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2013
 *
 ****************************************************************** */

// Includes

var restify = require('restify');
var sqlite = require("sqlite3");
var child = require('child_process');
var fs = require('fs');

// Reading configuration

var filecontent = fs.readFileSync ('config/config.js');
var config = JSON.parse(filecontent);
var api = [];

// Loading api methods

require("fs").readdirSync("./api/").forEach(function(file) {
    
    api[file.slice(0,-3)] = require("./api/" + file.slice(0,-3));
});

// Creating server

var server = restify.createServer();
server.get('/', version);
server.get('/version', version);
server.get('/api/:module/:function', apiCall);

server.listen(8080, function() {
    
  console.log('%s listening at %s', server.name, server.url);
});

// Starting backend

console.log("Staring backend : " + config.backend);
process.chdir('./databases');
child.spawn('../backend/' + config.backend, config.backendOptions);


// Function handler

function version(req, res, next) {
    
  res.json(config);
}

function apiCall(req, res, next){
    
    var module = api[req.params.module];

    if (module !== undefined){
        var fct = module[req.params.function];
        if (fct !== undefined){
            fct(req,res,next);
        }
        else{
            sendError(req,res,next, "function not found");
        }
    }
    else{
        sendError(req,res,next, "module not found");
    }
}

function sendError(req,res,next, message){
    
    res.json({type : "error", body : "Api error, " + message});
}
