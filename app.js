"use strict";

// Load required modules. 
var express = require('express'),
	mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
	path = require('path'),
	fs = require('fs'),
	AppError = require(__dirname + '/app_error.js');

// Start express. 
var app = express(); 

// Set port. 
var port = process.env.PORT || 3000; 

// Connect to database. 
mongoose.connect('mongodb://localhost:27017/icebreakr');

// Set up public directory for serving static resources. 
app.use(express.static(path.join(__dirname, '../public'), { maxAge: '28d' }));

// Parse supplied cookies and retrieve session data. 
app.use(cookieParser("mySecret"));
app.use(session({secret:"mySecret", saveUninitialized:false, resave:false})); 

// API routes 
app.use('/api', require(__dirname + '/routes/user_route.js'));
app.use('/api', require(__dirname + '/routes/login_route.js'));

// Homepage
app.route('*').get(function(req, res, next){
	res.send("It's working!");
});

// Handle any errors thrown earlier. 
app.use(function(err, req, res, next){
	if (err instanceof AppError) {
		res.status(err.statusCode).send(err.message); 
	}
	else {
		res.status(500).send("Internal server error"); 
	}
});

// Start server. 
app.listen(port);
console.log("server running on port 3000");  

