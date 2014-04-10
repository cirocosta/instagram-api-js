'use strict';
/**
 * Serves the static stuff and also a 404!
 */

var express = require('express');
var http = require('http');
var path = require('path');
var compression = require('compression');
var app = express();

app.set('port', process.env.PORT || 8888);

app.use(compression());
app.use(express.static(__dirname));

app.get('*', function (req, res) {
    res.send('404 error', 404);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server running on " + app.get('port'));
});
