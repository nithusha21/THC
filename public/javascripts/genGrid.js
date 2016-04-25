var jimp = require('jimp');

// white is 4278124287
var white = "4278124287";
module.exports = function(url, next){

	jimp.read(url, function(err, xword){
		//so that the image size is a multiple of 15
		xword.resize(300,300).greyscale().opaque();

		//do not change this!
		var y = 13;
		var grid = [];
		while(y < 300){
			var row = [];
			var x = 13;
			while(x < 300){
	
				var color = xword.getPixelColor(x,y).toString();
				
				if(color == white)
					row.push("1");
				else
					row.push("0");
				x+=20;
			}
			grid.push(row);
			y+=20;
		}
		//console.log(grid);
		return next(null, grid);
	});

};