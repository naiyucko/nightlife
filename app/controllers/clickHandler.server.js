'use strict';

function clickHandler (db) {
   var Yelparunga = require('yelp');
   var yelp = new Yelparunga({
     consumer_key: 'WXtr_coXGKiiOmKa5xBaAg',
     consumer_secret: 'smizqL8j6hfkzUYwR-uomFzXnqA',
     token: 'bg5qMoUuYGuCkVyxlZOrm3hyGQpO5WMS',
     token_secret: 'eAOrzGiVCojE_stBogBZo3xKdiE',
   });
   var clicks = db.collection('clicks');
	var usernames = db.collection('usernames');
	var polls = db.collection('polls');
   this.getClicks = function (req, res) {

      var clickProjection = { '_id': false };

      usernames.findOne({'username': req.cookies.username}, clickProjection, function (err, result) {
         if (err) {
            throw err;
         }

         if (result) {
            res.json(result);
         } else {
            res.json({'Error' : 'unlogged'});
         }
      });
   };
   
   this.getPolls = function (req, res) {

      var clickProjection = { '_id': false };
      if (req.query.reallife == 'true')
      {
         polls.find({'title': req.query.barnum, 'user': req.cookies.username}, clickProjection, function (err, result) {
         if (err) {
            throw err;
         }

         if (result) {
         	result.toArray(function (err, result) {
         		if (err) {
            		throw err;
         		}
         		res.json(result);
         	})
            
         } else {
            
         }
      });
      }
      else {
      polls.find({'title': req.query.barnum}, clickProjection, function (err, result) {
         if (err) {
            throw err;
         }

         if (result) {
         	result.toArray(function (err, result) {
         		if (err) {
            		throw err;
         		}
         		res.json(result);
         	})
            
         } else {
            
         }
      });
      }
   };

   this.pollVote = function (req, res) {
   	var answer = req.body.poll.toString();
   	var rname = decodeURI(req.params.name).toString();
	var rtitle = decodeURI(req.params.ptitle).toString();
	if (req.params.ptitle.endsWith('?') && !rtitle.endsWith('?')) {
			rtitle += "?";
		}
   	var query = {};
   	query[answer] = parseInt(1);
      polls.findAndModify({'user': rname, 'title' : rtitle}, {}, { $inc:  query }, function (err, result) {
         if (err) {
            throw err;
         }

         res.redirect('/');
      });
   };

   this.resetClicks = function (req, res) {
      clicks.update({}, { 'clicks': 0 }, function (err, result) {
         if (err) {
            throw err;
         }
         res.json(result);
      });
   };
   
   this.addUser = function (req, res, next) {
   		usernames.insert({ 'username': req.body.login, 'password': req.body.password }, function (err) {
               if (err) {
                  throw err;
               }
            });
            next();
	};
	
	this.createPoll = function (req, res, next) {
		var rtitle = req.query.barid;
		var tempob = {'user' : req.cookies.username, 'title' : rtitle};
		polls.insert(tempob, function (err) {
               if (err) {
                  throw err;
               }
               var urlgo = "/";
               res.redirect(urlgo);
            });
	}
	
	this.loginCheck = function (req, res, next) {
   		usernames.find({ 'username': req.body.login, 'password': req.body.password }, function (err, result) {
               if (err) {
                  throw err;
               }
               result.toArray(function (err, result) {
               		if (err){
               			throw err;
               		}
               		
	               	if (result.length === 1) {
	               		res.cookie("username" , req.body.login);
	               		res.redirect('/');
	               }
	               else {
	               		res.redirect('/login');
	               }
               })
               
            });
	};
	
	this.isLogged = function (req, res, next) {
		if (req.cookies.username)
		{
			next();
		}
		else
		{
			res.redirect('/login');
		}
	};
	
	this.displayPoll = function (req, res, next) {
		var clickProjection = { '_id': false };
		var rname = decodeURI(req.params.name).toString();
		var rtitle = decodeURI(req.params.ptitle).toString();
		if (req.params.ptitle.endsWith('?') && !rtitle.endsWith('?')) {
			rtitle += "?";
		}
		polls.findOne({'user': rname, 'title' : rtitle}, clickProjection, function (err, result) {
         if (err) {
            throw err;
         }
         if (result) {
            res.json(result);
         } else {
         }
      });
	}
	
	this.viewPoll = function (req, res, next) {
		var clickProjection = { '_id': false };
		var rname = decodeURI(req.params.name).toString();
		var rtitle = decodeURI(req.params.ptitle).toString();
		if (req.params.ptitle.endsWith('?') && !rtitle.endsWith('?')) {
			rtitle += "?";
		}
		polls.findOne({'user': rname, 'title' : rtitle}, clickProjection, function (err, result) {
         if (err) {
            throw err;
         }

         if (result) {
            res.json(result);
         } else {
         }
      });
	}
	
	this.deletePoll = function (req, res, next) {
		var rname = req.cookies.username;
		var rtitle = req.query.barnum;
		polls.remove({'user': rname, 'title' : rtitle}, function (err, result) {
			if (err) {
            throw err;
         }
         res.redirect('/');
		});
	}
	
	this.yelpMe = function (req, res, next) {
	         var cityof = req.query.query123;
         	   yelp.search({ term: 'bar', location: cityof, category_filter: 'bars' }, function(err, data) {
                 if (err) {
                     throw err;
                  }
                 res.json(data);
               });
	         
	      
	   
	}

}

module.exports = clickHandler;