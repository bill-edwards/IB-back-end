// Middleware calls for /user. 

"use strict"; 

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	gatekeeper = require(path.join(__dirname, '../utilities/gatekeeper')),
	validator = require(path.join(__dirname, '../utilities/validator')),
	User = require(path.join(__dirname, '../models/user_model.js')),
	AppError = require(path.join(__dirname, '../app_error.js')); 

var router = express.Router(); 

router.route('/user/new')

	// Create new user
	.post(bodyParser.json(), validator("user", ["username", "password"]), function(req, res, next){

		// Check whether username is available. 
		User.isUsernameTaken(req.body.username, function(err, taken){
			if (err) return next(err); 
			// Username already in use. 
			if (taken) return next (new AppError(400, "Username in use"));
			
			// Username is available... we proceed. 
			if (!taken) {
				var user = User();
				user.username = req.body.username; 
				user.password = req.body.password; 
				user.createDate = Date.now(); 
				user.lastLogin = Date.now(); 
				user.loginAttempts = 0; 
				user.timeout = 0; 

				// Save new user's details in DB. 
				user.save(function(err){
					if (err) res.send(err);

					// Set up new session
					req.session.regenerate(function(){
						req.session.userId = user._id; 

						// Return data to client. 
						res.json(user.dataForClient()); 
					});
				});
			}
		});
	}); 

router.route('/user/me')

	// Get own user details. 
	.get(gatekeeper, function(req, res, next){

		User.findById(req.session.userId, function(err, user){
			if (err) res.send(err);
			res.json(user.dataForClient()); 
		});

	})

	// Edit own user details. 
	.put(gatekeeper, validator("user", []), function(req, res, next){

	})

	// Delete own user details. 
	.delete(gatekeeper, function(req, res, next){
		User.remove({_id:req.session.userId}, function(err){
			if (err) return next(err); 
			req.session.destroy(function(){
				res.json({}); 
			});
		});
	}); 

router.route('/user/:user_id')

	// Get details on some user. 
	.get(function(req, res, next){

		User.findById(req.params.user_id, function(err, user){
			if (err) res.send(err);
			res.json(user.dataForClient()); 
		});

	}); 

module.exports = router; 

