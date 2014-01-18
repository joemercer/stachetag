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