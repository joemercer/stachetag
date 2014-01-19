exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });
    };
};

exports.newuser = function(req, res){
  res.render('newuser', { title: 'Add New User' });
};

exports.adduser = function(db) {
	return function(req, res) {
		var name 	= req.body.username;
		var email = req.body.useremail;

		var collection = db.get('usercollection');

		collection.insert({
			"username": name,
			"email" : email
		}, function (err, dot) {
			res.send("tada, it worked");
			// if (err) {
			// 	res.send("There was a problem adding the information to the database.");
			// } else {
			// 	res.send("tada, it worked");
			// }
		});
	}
}


exports.tweet = function(req, res) {
	var Twit = require("twit");

	var T = new Twit({
		consumer_key: 				'cCw9Tm99H3rEwfpxODQ',
		consumer_secret: 			'OHx2mlYa7LmRUFF3fTEeFCPDwyet74qy62MtlV6zU',
		access_token: 				'17828953-z6VIudrcSia55FflgOYnQN68jIpaQM0BASoA6bE5Z',
		access_token_secret: 	'iubwPQ4FTRXjNd06ciOQkvmMVANuyVhyKs0PmxD4gdKtg'
	})

	var stream = T.stream('user');

	stream.on('user_event', function (tweet) {
	  console.log('got user_event:', tweet);
	});

	res.send("hi");
}