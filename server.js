var express = require('express');
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

//GET
app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/joe', function(req, res){
  res.send('Hello Joe');
});
app.get('/userlist', routes.userlist(db));

app.listen(3000);
console.log('Listening on port 3000');