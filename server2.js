var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var rootUrl = "https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference";
var result = {};

superagent
	.get(rootUrl)
	.end(function(err,res){
		if(err){
			throw err;
		}

		var $ = cheerio.load(res.text);

		$("ul li a code").each(function(index, item){
			var $item = $(item);
			result[$item.html()] = 1;

			console.log($item.html());
			fs.writeFile( 'css.json', JSON.stringify( result, null, 2 ), 'utf8' );
		});
	});

