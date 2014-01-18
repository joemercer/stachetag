var express = require('express');
var logfmt = require("logfmt");
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// DB STUFF
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/stachetag');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// sample app from heroku

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/bonnie', function(req, res) {
  res.send('Hello Bonnie!');
});

app.get('/userlist', routes.userlist(db));

//writing to the db
app.get('/newuser', routes.newuser);
app.post('/adduser', routes.adduser(db));


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
