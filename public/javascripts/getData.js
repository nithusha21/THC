var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var gengrid = require('./gengrid.js');

module.exports = function(next){

	url = 'http://www.thehindu.com/entertainment/article6294544.ece';
	request(url, function(error, response, html){

		if(!error){
			// Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

			var $ = cheerio.load(html);

			//getting the crossword page of the first crossword
			$('.stdArtpage').filter(function (){
				url = $(this).find('.stdArtpageCt h3 a')['0']['attribs']['href'];
				url = url + '?css=print';
			});
			
			//the template of my crossword object
			var crossword = {grid: [], across: [], down: [], date: ""};
	 
			request(url, function(error, response, html){
				
				$ = cheerio.load(html);
				//getting image of todays crossword 
				
				//getting the image url for todays crossword
				$('.jcarousel-wrapper').filter(function(){
					var imageURL = $(this).find('.jCarouselHolder ul li #pic img')['0']['attribs']['src'];
					
					//getting the grid in the form of 0s and 1s using the image processing script.
					gengrid(imageURL, function(err, grid){
						crossword['grid'] = grid;

						//getting clues
						$('.article-text').filter(function(){

							var clues = $(this).find('p').text();
							var flag = 0;
							var s = "";
							for(item in clues){
								if(s == 'Across' || s == 'Down'){
									if(s == 'Down')
										flag = 1; 
									s = "";
								}
								if(clues[item] == ')')
								{
									s += clues[item];
									var index = s.indexOf(' ');

									//to get clue number and clue seperately
									var clue = {number:s.substr(0,Number(index)), clue: s.substr(Number(index))};
									if(flag == 0)
										crossword['across'].push(clue);
									else
										crossword['down'].push(clue);
									
									s = "";
								}
								else{
									s += clues[item];
								}
							}

							//getting date of crossword

							$('.dateline').filter(function(){

								crossword['date'] = $(this).text().trim();

								return next(null, crossword);
							});
						});
					});
				});
			});	
		}
		else{
			return next(new Error("Unable to reach hindu.com"))
		}
	});
};
