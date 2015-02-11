"use strict"; 

var mongoose = require('mongoose');

// Define schema. 
var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createDate: {
		type: Number,
		required: true
	}, 
	lastLogin: {
		type: Number,
		required: true
	},
	loginAttempts: {
		type: Number,
		required: true
	},
	timeout: {
		type: Number,
		required: true
	},
	interests: {
		type: Object
	}
});



// Remove sensitive data from user object for return to client. 
userSchema.methods.dataForClient = function() {
	var userClone = JSON.parse(JSON.stringify(this)); // Clone the user object. 
	delete userClone.password; 
	delete userClone.loginAttempts;
	delete userClone.timeout; 
	return userClone; 
};


// Export model from schema. 
module.exports = mongoose.model('User', userSchema); 

