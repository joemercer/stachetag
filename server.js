var express = require('express');
var logfmt = require("logfmt");
var routes = require('./routes');
var http = require('http');
var path = require('path');
var OAuth= require('oauth').OAuth;

var app = express();
// Enabling Sessions
app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret"}));

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"cCw9Tm99H3rEwfpxODQ",
	"OHx2mlYa7LmRUFF3fTEeFCPDwyet74qy62MtlV6zU",
	"1.0",
	"http://127.0.0.1:3000/auth/twitter/callback",
	"HMAC-SHA1"
);

// # DB stuff
// __________

var mongo = require('mongodb');
var monk = require('monk');

// format: mongodb://user:pass@host:port/dbnam
var mongoUri = process.env.MONGOHQ_URL || 'localhost:27017/stachetag';

var db = monk(mongoUri);

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/bonnie', function(req, res) {
  res.send('Hello Bonnie!');
});

// sample app for using mongo

app.get('/userlist', routes.userlist(db));

//writing to the db
app.get('/newuser', routes.newuser);
app.post('/adduser', routes.adduser(db));

//twitter
app.get('/auth/twitter', function(req, res){
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.send("yeah no. didn't work.")
		}
		else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
		}
	});
});
app.get('/auth/twitter/callback', function(req, res, next){
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth,access_token_secret = oauth_access_token_secret;
				console.log(results);

				var collection = db.get('users');
				collection.find({user_id: results.user_id}, function(err, users) {
				  if( err || !users || users.length === 0) {
				  	collection.insert({
							"user_id": results.user_id,
							"access_token" : oauth_access_token,
							"access_token_secret" : oauth_access_token_secret
						}, function (err, dot) {
							if (err) {
								res.send("There was a problem adding the information to the database.");
							} else {
								res.send("tada, it worked");
							}
						});
				  } else {
				    console.log("User already exists");
				  }
				});
				res.send("worked. nice one.");
			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});
app.get('/twitter', routes.tweet);


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
