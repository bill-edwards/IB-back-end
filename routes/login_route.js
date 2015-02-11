// Middleware calls for /login and /logout

"use strict"; 

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	validator = require('../utilities/validator.js'),
	User = require(path.join(__dirname, '../models/user_model.js')),
	AppError = require(path.join(__dirname, '../app_error.js'));


var router = express.Router(); 


// Logging in... 
router.route('/login')

	.post(bodyParser.json(), validator("user", ["username", "password"]), function(req, res, next){

		User.findOne({username:req.body.username}, function(err, user){
			if (err) return next(err); 

			// Incorrect username. 
			if (!user) return next(new AppError(404, "Username/Password incorrect")); 

			// Check if user is currently locked out. 
			if (user.loginAttempts>4) {
				if (user.timeout>Date.now()) return next(new AppError(401, "locked-out"));
				else user.loginAttempts = 0; // Still need to save this to the database. 
			}

			// Check if password is correct. 
			user.authenticate(req.body.password, function(err, match){
				if (err) return next(err); 

				// Incorrect password. 
				if (!match) {
					// Update throttle status. 
					user.loginAttempts++;  
					user.timeout = Date.now() + (1*60*1000); // 1 minutes from now. 
					user.save(function(err){
						if (err) return next(err);
						return next(new AppError(404, "Username/Password incorrect"));
					}); 
				}
				// Login details correct: 
				else {
					// Update some user information. 
					user.loginAttempts = 0; 
					user.lastLogin = Date.now(); 
					user.save(function(err){
						if (err) return next(err); 
						// Set session data. 
						req.session.regenerate(function(){
							req.session.userId = user._id; 

							// Return data to client. 
							res.json(user.dataForClient()); 
						});
					});
				}
			});
		});
	});


// ... and logging out. 
router.route('/logout')

	.post(function(req, res, next){
		req.session.destroy(function(){
			res.json({}); 
		});
		// Currently seems like session cookie is not deleted, only data in store. Is this a problem? 
	});


module.exports = router; 

