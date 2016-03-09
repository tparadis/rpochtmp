var readline = require('linebyline'),
	r1 = readline('./frsscats');

var http = require('https');
var from = "fr";
var to = "bre";

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
		var url = "https://glosbe.com/gapi/translate?from="+from+"&dest="+to+"&format=json&phrase="+tab[1].toLowerCase();
		var toen ="";
		http.get(url,function(res){
			
			var body = '';

			res.on('data',function(chunk){
				body += chunk;	
			});
			
			res.on('end',function(){
			console.log(url);
				var resp = JSON.parse(body);
				try{
					toen = resp.result;
					//var result = toen.charAt(0).toUpperCase() + toen.slice(1).toLowerCase();
				}catch(ex){
					console.log('ERREURRRR :'+ex)	
				}
				console.log("update sscategories set br = '"+toen+"' where id="+tab[0]+";");
			});
			

		 }).on('error',function(e){
			 
			 console.log("Erreur");
		 });
		
	}

});
