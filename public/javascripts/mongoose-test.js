var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind('connection error: '));

db.once('open', function(){
	var kittySchema = mongoose.Schema({
   		name: String
	});

	var Kitten = mongoose.model('Kitten', kittySchema);
	var testKitten = new Kitten({name : "Fluffy"});

	testKitten.save(function(err, testKitten){
		if(err) return console.error(err);

		Kitten.find({}, function(err, kittens){
			if(err) return console.error(err);
			console.log(kittens);

			/*db.collection("kittens").drop(function(err){
				if(err) return console.error(err);
				db.close();
			})*/
			db.close();
		});
	});
});