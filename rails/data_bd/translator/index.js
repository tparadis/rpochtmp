var readline = require('linebyline'),
	r1 = readline('./frsscats');

var http = require('http');
var from = "fr";
var to = "br";

r1.on('line',function(line,lineCount,byteCount)
{
	if(line != "")
	{
		
		var tab = line.split(" | ");
		tab[1] = tab[1].replace("\\'", " ");
		tab[1] = tab[1].replace("'", " ");
		tab[1] = tab[1].replace("\\", " ");
		tab[1] = tab[1].replace("/", " ");
		tab[1] = tab[1].replace('\/', ' ');
		tab[1] = tab[1].replace(" d ", " ");
		tab[1] = tab[1].replace("ô","o");
		tab[1] = tab[1].replace("é","e");
		tab[1] = tab[1].replace("ê", "e");
		tab[1] = tab[1].replace("è", "e");
		tab[1] = tab[1].replace(" ", "%20");
		var url = "http://mymemory.translated.net/api/get?q="+tab[1].toLowerCase()+"&langpair="+from+"|"+to;
		var toen ="";
		http.get(url,function(res){
			
			var body = '';

			res.on('data',function(chunk){
				body += chunk;	
			});
			
			res.on('end',function(){
			console.log(url);
				var resp = JSON.parse(body);
				toen = resp.responseData.translatedText;
				var result = "";
			    if(toen != null)
				{
					result = toen.charAt(0).toUpperCase() + toen.slice(1).toLowerCase();
				}
				console.log("update sscategories set br = '"+result+"' where id="+tab[0]+";");
			});
			

		 }).on('error',function(e){
			 
			 console.log("Erreur");
		 });
		
	}

});
