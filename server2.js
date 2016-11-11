var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var rootUrl = "http://www.w3.org/TR/CSS22/propidx.html";
var result = {};

superagent
	.get(rootUrl)
	.end(function(err,res){
		if(err){
			throw err;
		}

		var $ = cheerio.load(res.text);

		$("span").each(function(index, item){
			var $item = $(item);
			
			if($item.attr("class").indexOf("xref")>-1){
				var className = $item.attr("class").replace(/propinst-/g,"").replace(/ xref/g,"");
				result[className] = 1;
				console.log(className);
				
				fs.writeFile( 'css.json', JSON.stringify( result, null, 2 ), 'utf8' );
			}
		});
	});

