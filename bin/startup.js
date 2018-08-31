var PORT = 3004;

var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

//const WORK_PATH = "app";
const WORK_PATH = "master";

// Serve up public/ftp folder
var serve = serveStatic(WORK_PATH, {'index': ['index.html', 'index.htm']})

// Create server
var server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");