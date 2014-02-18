var express = require('express');

var app = express();

// # DB stuff
// __________

var mongo = require('mongoskin');

// format: mongodb://user:pass@host:port/dbnam
var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/stachetag';

var db = mongo.db(mongoUri, {native_parser:true});

var users = db.collection('users');
var tweets = db.collection('tweets');

var me = users.insert({
	screen_name: 'jomrcr'
});

// twitter
// _______

var twit = require("twit");

// I think that access token stuff is supposed to be specific to user
var T = new twit({
	consumer_key: 				'75fPUk1t4ftDZ6byJRsJ0A',
	consumer_secret: 			'sDGqUXEAiPkGoxlP9NpqyzpnsQ0fFpLxFrUdgbY2bU',
	access_token: 				'54261089-q9gdWGvhcHAnW348z59xjo75ynyGXXjpgP46HsBYe',
	access_token_secret: 	'38GVTtgNS3uO9Kj8cqrJiRzXOet2AUHeDtrtci1WjeMaD'
});

var stream = T.stream('user');

var streamOwnersScreenName = 'jomrcr';

stream.on('tweet', function (tweet) {

	// find sender
	users.findOne({
		screen_name: tweet.user.screen_name
	}, function(err, user){
		if (err) return 'Error: ' + err;

		// if not sender's stream then return
		if (user.screen_name !== streamOwnersScreenName) return;

		var start = tweet.text.indexOf('{');
		var end = tweet.text.indexOf('}');
		var thing = tweet.text.substr(start+1, start-end-1);

		var logs = [];




		// extract things
		// things into things

		// insert event(s) into events

		// delete tweet if necessary

		// set deleted timeout if necessary

		// insert tweet into tweets
		tweets.insert({
			userId: user._id,
			tweet: tweet
		}, {safe: true}, function(err){
			if (err) return 'Error: ' + err;
		});

	});

});

// routes
// ______

app.get('/', function(req, res) {

	res.send('Homepage and stuff');

	// tweets.findOne({}).on('success', function(tweet){
	// 	res.send(tweet);
	// }).on('error', function(err){
	// 	res.send('Nothing in the database yet');
	// });

});

app.get('/users', function(req, res) {

	users.find({}).toArray(function(err, allUsers){
		if (err) return 'Error: ' + err;
		console.log(allUsers[0]);
		res.send(allUsers);
	});

});

app.get('/users/:name', function(req, res) {
	// return data for a specific user

	users.findOne({
		name: 'testjomrcr2'
	}, function(err, user){
		if (err) return 'Error: ' + err;
		tweets.find({userId: user._id}).toArray(function(err, allTweets){
			if (err) return 'Error: ' + err;
			res.send(allTweets);
		});
	});

});

app.get('/users/:name/tweets', function(req, res) {
	// return tweets for a specific user

	users.findOne({
		name: req.params.name
	}, function(err, user){
		if (err) return 'Error: ' + err;
		tweets.find({userId: user._id}, { tweet: 1}).toArray(function(err, allTweets){
			if (err) return 'Error: ' + err;
			res.send(allTweets);
		});
	});

});

app.get('/users/:name/tags/:tag', function(req, res) {
	// returns compiled logs with a given tag for a given user

	users.findOne({
		name: req.params.name
	}, function(err, user){
		if (err) return 'Error: ' + err;
		tweets.find({userId: user._id}, { tweet: 1}).toArray(function(err, allTweets){
			if (err) return 'Error: ' + err;
			res.send(allTweets);
		});
	});

});

// start the server
// ________________

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
