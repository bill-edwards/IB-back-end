"use strict"; 

var mongoose = require('mongoose'),
	bcrypt = require('bcrypt');

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

// Hash password. 
userSchema.pre('save',function(next){

	var user = this; 

	// If password is not being updated, skip to next middleware. 
	if (!user.isModified('password')) next(); // Ben does {return next()} !! 

	// Apply cryptographic hash function to password. 
	bcrypt.hash(user.password, 10, function(err, hash){
		if (err) next(err); // Ben does {return next()} !! 
		user.password = hash; 
		next(); 
	});
});

// Compare supplied cleartext and stored hashed passwords
// Arguably the body of this could just be included directly in the login_route code. 
// I suppose it means we (1) only require bcrypt once; (2) can potentially reuse elswhere. 
userSchema.methods.authenticate = function(cleartextPw, callback) {
    bcrypt.compare(cleartextPw, this.password, function(err, match) {
        if (err) callback(err); // Ben does { return callback(err); }
        callback(null, match);
    });
};

// Remove sensitive data from user object for return to client. 
userSchema.methods.dataForClient = function() {
	var userClone = JSON.parse(JSON.stringify(this)); // Clone the user object. 
	delete userClone.password; 
	delete userClone.loginAttempts;
	delete userClone.timeout; 
	return userClone; 
};

// Check availability of username. 
userSchema.statics.isUsernameTaken = function(suppliedUsername, callback) {
	this.findOne({username: suppliedUsername}, function(err, user){
		if (err) return callback(err); 
		if (!user) return callback(null, false); 
		return callback(null, true); 
	});
};


// Export model from schema. 
module.exports = mongoose.model('User', userSchema); 

