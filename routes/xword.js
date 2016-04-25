var express = require('express');
var fs = require('fs');
var xwords = require('../public/javascripts/xword-schema.js');
var crosswordGetter = require('../public/javascripts/getData.js');
var mongoose = require('mongoose');

var router = express.Router();

router.get('/', function(req, res){
	
	var url = 'mongodb://localhost:27017/THC';
	mongoose.connect(url);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function(){
		
		var crossword = crosswordGetter(function(err, crossword){
			if(err)
				console.log(err);
			else{
				var xword = new xwords(crossword);
				xword.save(function(err, xword){
					if(err){
						db.close();
						res.end("Error" + err);
						return console.error(err);
					}
					console.log(xword);
					db.close();
					res.end(JSON.Stringify(xword, null, '\t'));
				});
			}
		})
	});
});

router.get('/test/', function(req, res){
	var url = 'mongodb://localhost:27017/THC';
	mongoose.connect(url);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function(){
		var date = new Date();
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var str = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
		var query = {};
		query["date"] = str;
		xwords.find(query, function(err, docs){
			if(err) console.log(err);
			else{
				if(docs.length == 0)
				{
					db.close();
					res.redirect('/xword');
				}
				else{
					db.close();
					res.end(JSON.Stringify(docs, null, '\t'));
				}
			}
		})

	})
});
module.exports = router;