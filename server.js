var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var rootUrl = "http://developer.mozilla.org/zh-CN/docs/Web/HTML/Element";
var result = {};

for(var i=1;i<7;i++){
	result["h"+i] = {};
}

superagent
	.get(rootUrl)
	.end(function(err, res){
		if(err){
			throw err;
		}

		var $ = cheerio.load(res.text);
		$(".standard-table tbody tr").each(function(index, ele){
			$(ele).each(function(i, item){
				var $item = $(item).find("td").eq(0).children("a");
				var itemUrl = "http://developer.mozilla.org"+$item.attr("href");
				var tagName = $item.find("code").html().replace(/&lt;/g,"").replace(/&gt;/g,"");
				// console.log(itemUrl, tagName);

				superagent
					.get(itemUrl)
					.end(function(err, response){
						if(err){
							throw err;
						}

						var $$;
						if(response.text){
							$$ = cheerio.load(response.text);
						}
						
						var obj = result[tagName] = {};
						$$("strong").each(function(index, item){
							if($(item).attr("id")){
								var attr = $$(item).attr("id").replace(/attr-/g,"");
								obj[attr] = 1;
								result[tagName] = obj;

								console.log(tagName, obj);
								fs.writeFile( 'html.json', JSON.stringify( result, null, 2 ), 'utf8' );
							}
						});

					});
			});
		});

		//获取全局属性
		superagent
			.get("http://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes")
			.end(function(err, res){
				if(err){
					throw err;
				}

				var $ = cheerio.load(res.text);
				var obj = result["_"] = {};
				$("dt").each(function(index, item){
					var $item = $(item);

					if($item.attr("id")){
						var attr = $(item).attr("id").replace(/attr-/g,"");						
						obj[attr] = 1;
						result["_"] = obj;

						console.log("_: ", obj);
						fs.writeFile( 'html.json', JSON.stringify( result, null, 2 ), 'utf8' );
					}
				});
			});

	});