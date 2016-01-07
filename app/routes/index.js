'use strict';

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');

module.exports = function (app, db) {
	var bodyParser = require('body-parser');
	app.use( bodyParser.json() );       // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  		extended: true
	})); 
    var clickHandler = new ClickHandler(db);

    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });

    app.route('/api/clicks')
        .get(clickHandler.getClicks)
        //.post(clickHandler.addClick)
        .delete(clickHandler.resetClicks);
        
    app.route('/login')
    	.get(function (req, res) {
            res.sendFile(process.cwd() + '/public/login.html');
        })
        .post(clickHandler.loginCheck);
        
    app.route('/signup')
    	.get(function (req, res) {
            res.sendFile(process.cwd() + '/public/signup.html');
        })
        .post(clickHandler.addUser, function (req, res) {
            res.redirect('/login/');
        });
        
    app.route('/logout')
        .get(function (req, res) {
        	res.clearCookie('username');
        	res.redirect('/login/');
        });
        
    app.route('/newpoll')
    	.get(clickHandler.isLogged, clickHandler.createPoll, function (req, res) {
        	//res.redirect('/poll/');
        });
    	
    app.route('/poll/:name/:ptitle')
    	.get(function (req, res) {
            res.sendFile(process.cwd() + '/public/poll.html');
        })
    	.post(clickHandler.displayPoll);
        
    app.route('/api/polls')
        .get(clickHandler.getPolls);
        
    app.route('/poll/:name/:ptitle/postpoll')
    	.post(clickHandler.pollVote);
    	
  	app.route('/poll/:name/:ptitle/view')
  		.get(clickHandler.isLogged, function (req, res) {
            res.sendFile(process.cwd() + '/public/view.html');
        })
        .post(clickHandler.viewPoll);
        
    app.route('/api/delete')
    	.get (clickHandler.deletePoll);
    	
    app.route('/yelping')
        .get(clickHandler.yelpMe);
    	
};