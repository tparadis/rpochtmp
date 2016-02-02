var readline = require('linebyline'),
	r1 = readline('./frsscats');

var http = require('https');
var from = "fr";
var dest = "de";

r1.on('line',function(line,lineCount,byteCount)
{
	if(line != "")
	{
		
		var tab = line.split(" | ");
		var url = "https://glosbe.com/gapi/translate?from="+from+"&dest="+dest+"&format=json&phrase="+(tab[1]).toLowerCase();
		var toen ="";
		var toesp ="";

		http.get(url,function(res){
			
			//var resp = JSON.parse(res);
			var body = '';

			res.on('data',function(chunk){
				body += chunk;	
			});
			
			res.on('end',function(){
				var resp = JSON.parse(body);
				try{
					
					toen = resp.tuc[0].phrase.text;
				}catch(ex){
						
				}
				console.log(
					"update sscategories set de = '"+toen+"' where id="+tab[0]+";"
				);
			});


		});
		
		

		//process.stdout.write("update sscategories set fr = ");
		//process.stdout.write("'"+tab[1]+"'");
		//process.stdout.write("\n");

	}

});
