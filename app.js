"use strict";

// Load required modules. 
var express = require('express'),
	path = require('path'),
	fs = require('fs');

// Start express. 
var app = express(); 

// Set port. 
var port = process.env.PORT || 3001; 


// Set up public directory for serving static resources. 
app.use(express.static(path.join(__dirname, '../public'), { maxAge: '28d' }));

// Homepage
app.route('*').get(function(req, res, next){
	res.send("It's working!");
});

// Start server. 
app.listen(port);
console.log("server running on port 3001");  

