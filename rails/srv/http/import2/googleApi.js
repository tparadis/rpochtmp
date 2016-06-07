var key = "AIzaSyDjlC7esfbkHehjTfUsZ1aL4G7PJQchxns";
var pays = "FR";
var ville = "RENNES";
var resStats = [0,0,0]; //stats


//Permet de recevoir les coordonnées Google
//depuis une adresse
function getCoords(num, adr)
{
	if(adr == "") return [];	
	
	var addr = convertiEnAdresseGoogle(num, adr);

	var req = "https://maps.googleapis.com/maps/api/geocode/json?";
	req = req + "address="+addr;
	req = req + "&key=" +key;



	//La requete
	$.ajax({
		async:false,
		url:req,
		dataType:"json",
		success:function(data)
		{
			if(data.status == "OK")
			{	
				console.log(req);
				resStats[0] += 1;
				console.log("requete google OK")
				console.log(data);
			}
			else if(data.status == "ZERO_RESULTS")
			{
				resStats[1] += 1;
				console.log("Aucun resultat");
				console.log("adr = "+adr);
			}
			else if(data.status == "INVALID_REQUEST")
			{
				resStats[2] += 1;
				console.log("la requete est invalide !")	
				console.log("adr = "+adr);
			}
			else
			{
				console.log("Une erreur inconnue s'est produite");	
			}

		},
		error:function(err)
		{
			console.error("ERREUR : "+err)	
		}
		
		
	})
		
	
}
//Permet de bien formater l'adresse pour l'inclure
//dans l'url de la requete Google
function convertiEnAdresseGoogle(num, rue)
{
	rue = rue.replace(/ +/g, '+');
	var str = num +"+"+ rue+",+"+ville+",+"+pays;
	console.log(str);
	return str;
		
}








