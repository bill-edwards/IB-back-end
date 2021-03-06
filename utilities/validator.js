// Validator

"use strict"; 

var path = require('path'),
	AppError = require(path.join(__dirname, '../app_error.js')); 

var validator = function(model, required){

	// Define validation types, with regex and formatting function. 
	var validationTypes = {
		text : {
			regex : /^[\w\.&\'\-,; \?\!()$"]{1,40}$/,
			format : function(raw){
				return raw.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/, ' ');
			}
		},
		username : {
			regex : /^[\w\.~\-]{1,40}$/,
			format : function(raw){
				return raw.replace(/^\s+/, '').replace(/\s+$/, ''); 
			}
		},
		password : {
			regex : /^\S{8,}$/,
			format : function(raw){
				return raw; 
			}
		}
	};

	// Define the fields (and their validation types) associated with each type of resource. 
	var models = {
		user : {
			username : validationTypes.username,
			password : validationTypes.password
		}
	};

	// The middleware function. 
	return function(req, res, next){

		var thisModel = models[model];

		var errorMessage = "";

		// Ensure that all required fields have been supplied. 
		required.forEach(function(requiredField){
			if (!req.body.hasOwnProperty(requiredField)) errorMessage += (requiredField + " ");
		});

		// Loop through POSTed data. 
		for (var data in req.body){
			if (req.body.hasOwnProperty(data)){

				// Delete any non-allowed POSTed fields from req.body. 
				if (!thisModel.hasOwnProperty(data)){
					delete req.body[data]; 
					continue; 
				}

				// Format data if necessary. 
				req.body[data] = thisModel[data].format(req.body[data]); 

				// Check against regex. 
				if(!thisModel[data].regex.test(req.body[data])) errorMessage += (data + " ");
			}
		}

		if (errorMessage) next(new AppError(400, errorMessage));
		else next(); 
	};
};

module.exports = validator;

