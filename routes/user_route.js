// Middleware calls for /user. 

"use strict"; 

var express = require('express'),
	path = require('path'),
	User = require(path.join(__dirname, '../models/user_model.js')),
	AppError = require(path.join(__dirname, '../app_error.js')); 

var router = express.Router(); 

router.route('/user/:user_id')

	// Get details on some user. 
	.get(function(req, res, next){

		User.findById(req.params.user_id, function(err, user){
			if (err) res.send(err);
			res.json(user.dataForClient()); 
		});

	}); 

module.exports = router; 

