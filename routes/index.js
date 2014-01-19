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


exports.tweet = function(db, user_id) {
	return function(req, res) {
		var user_id = req.session.oauth.user_id;
		var collection = db.get('users');
		collection.findOne({user_id: user_id}, function(err, user) {
		  if( err || !user || user.length === 0) {
		  	console.log('Cannot find User')
		  } else {
		    console.log(user.access_token_secret);
		    var Twit = require("twit");

		    var T = new Twit({
					consumer_key: 				'cCw9Tm99H3rEwfpxODQ',
					consumer_secret: 			'OHx2mlYa7LmRUFF3fTEeFCPDwyet74qy62MtlV6zU',
					access_token: 				user.access_token,
					access_token_secret: 	user.access_token_secret
				})

				var stream = T.stream('user');

				stream.on('user_event', function (tweet) {
					console.log('got user_event:', tweet);
				});

				res.send('Twitter stream is opened for user id: ' + user_id);

		  }
		});

	}
}