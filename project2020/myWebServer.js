// definition of all required modules and services
var express = require('express');		//  used to build the web server

var bodyParser = require('body-parser');
var request = require('request');
var basicAuth = require('express-basic-auth');

//----------------------------------------------------------------------------
// create a new express based Web Server
// ---------------------------------------------------------------------------
var app = express();

// set the directory and what will be displayed when localhost is opened
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set port and display message in console
var server = app.listen(420, function() {
  console.log('***********************************');
  console.log('listening:', 420);
  console.log('***********************************');
});
