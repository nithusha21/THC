var mongoose = require('mongoose');
var schema = mongoose.Schema;

var clueSchema = new schema({number: String, clue: String});
var xwordSchema = new schema({
	grid: [[String]], 
	across: [clueSchema],
	down: [clueSchema],
	date: {
		type: String, 
		unique: true
	}
}, {
	timestamps: true
});

var xwords = mongoose.model('xword', xwordSchema);

module.exports = xwords;

