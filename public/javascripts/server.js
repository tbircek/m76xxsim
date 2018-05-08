#!/usr/bin/env node
 // Initial idea from Getting Started With node.js and socket.io
// by Constantine Aaron Cois, Ph.D. (www.codehenge.net)
// http://codehenge.net/blog/2011/12/getting-started-with-node-js-and-socket-io-v0-7-part-2/
// This is a simple server for the various web frontends
'use strict';

var port = 9090, // Port on which to listen
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    sim = require('./m76xxsim.js'),
    location404 = __dirname + '/404.html';

var server = http.createServer(servePage); // <1>

server.listen(port); // <2>
console.log('Listening on ' + port);

function servePage(request, response) {
    var path = url.parse(request.url).pathname; // <3>

    // show main page.
    if (path === '/') {
        path = '/index.html';
    }

    console.log('Received request for ' + __dirname + path);
    fs.readFile(__dirname + path, function(err, data) {
        if (err) {
            console.log('Cannot find requested file.\nSending 404');
            return send404(response);
        }

        var contentType = '';
        var ext = path.split('.')[1];
        console.log('extension: ' + ext);
        switch (ext) {
            case 'css':
                contentType = 'text/css';
                break;
            case 'ico':
                contentType = 'image/x-icon';
                break;
            case 'js':
                contentType = 'application/javascript';
                break;
            case 'json':
                contentType = 'application/json';
                break;
            default:
                contentType = 'text/html';
                break;
        }
        response.writeHead(200, { 'Content-Type': contentType });
        response.write(data, 'utf8');
        response.end();
    });
}

function send404(response) {
    fs.readFile(location404, function(err, data) {
        if (err) {
            // return send404(res);
            console.log('404.html send failed.');
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data, 'utf8');
        response.end();
    });
}
