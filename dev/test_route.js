// Testing urls

"use strict"; 

var path = require('path'),
	express = require('express'), 
	validator = require(path.join(__dirname, '../utilities/validator')),
	bodyParser = require('body-parser');

var router = express.Router(); 

router.route('/validator_test')

	.post(bodyParser.json(), validator("user",["username", "password"]), function(req, res, next){

		res.json(req.body); 

	});

module.exports = router; 