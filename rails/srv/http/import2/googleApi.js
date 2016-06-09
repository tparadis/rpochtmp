var key = "AIzaSyDjlC7esfbkHehjTfUsZ1aL4G7PJQchxns";
var pays = "FR";
var label_pays = "France";
var ville = "Rennes";
var resStats = [0,0,0,0,0]; //stats
var coordpart = {"LES HALLES CENTRALES" : {"lat" : "48.108049","lng" : "-1.679626"} };
var currentC = "";



//Fonction qui retourne dans le tableau current les vraies coordonnées
//pour chaque nouveau commerce envoyé en parametres et retourne
//à nouveau le tableau current mis à jour
function getAllCoords(current, newCom)
{
	
	var i = 0;
	//console.log(current)
	//console.log(newCom)
	while( i < newCom.length)
	{
		//Recupère l'adresse
		var address = newCom[i].street_name;
		var num = newCom[i].street_num;
		//alert(num, newCom[i].line);
		var returned;
		currentC = newCom[i].enseigne;
		if(address == "LES HALLES CENTRALES")
		{
			//On insère juste les coordonnees des Halles dans celles du magasin
			current[newCom[i].num_line].location_lat = coordpart[address].lat;
			current[newCom[i].num_line].location_lng = coordpart[address].lng;
		}
		else
		{

			//console.log(num+" "+address);
			returned = getCoords(num, address,newCom[i].num_line);

			//On met à jour les champs concernés
			current = metAJourCoords(i, returned, newCom, current);

		}
		//On affiche le %age dans la div
		$("#purcent").html((i/newCom.length).toFixed(2) * 100 +1+ " %");

		i++;

	}

	//On vérifie que les magasins ont bien tous des coordonnées
	checkifok(current)

	console.log(resStats[0] + " magasins traités avec succès");	
	if(resStats[i] < newCom.length )
	{
		console.warn("Certains magasins n'ont pu être traités ! ");	
	}

	return current;
}


//Permet de recevoir les coordonnées Google
//depuis une adresse
function getCoords(num, adr, nb)
{
	if(adr == "") return [];	

	adr = exception(adr); //On ajoute des infos sur les adresses si besoin est !
	var addr = convertiEnAdresseGoogle(num, adr);
	
	var req = "https://maps.googleapis.com/maps/api/geocode/json?";
	req = req + "address="+addr;
	req = req + "&key=" +key;
	var currentData;

	//La requete
	$.ajax({
		async:false,
		url:req,
		dataType:"json",
		success:function(data)
		{
			
			
			//On teste le code status du resultat reçu
			if(data.status == "OK")
			{	
				//Si la réponse est OK, le résultat n'est pas forcément bon
				//par exemple Google retourne simplement "RENNES, FRANCE" dans
				//le champ formatted_adress

				var toTest = ville + ", " + label_pays;

				if(data.results.length > 1)
				{
					
					//Testons les cas particuliers

					//Premier cas, s'il y a plusieurs choix mais qu'un seul est viable
					//dans la liste des resultats
					var indices = [];
					var k = 0;

					while (k < data.results.length) //On ajoute les indices du tableau dont l'addresse est valide
					{
						var str = normalizeString(data.results[k].formatted_address);
				
						if( str.indexOf(normalizeString(ville)) > -1 && str.indexOf(normalizeString(adr)) > -1 )
						{
							indices.push(k);	
						}		
						k++;	
					}
					if(indices.length == 1)
					{
						//Faire quelque chose du resultat !
						resStats[0] += 1;
						currentData = data.results[indices[0]];
					}
					else if(indices.length == 2)
					{
						//il y a encore trop de choix, demander le resultat par une POP-UP ?	
						console.log("Adresse incertaine : "+ adr+" (on prend le resultat le plus pertinent parmis les choix de retour)");
						var ret = proposeChoix("placeRue", currentC);
						//On a reçu true pour Place, false pour Rue
						
						resStats[0] += 1;
						if(ret)
						{
							if(data.results[0].formatted_address.toLowerCase().indexOf("place") > -1)
								currentData = data.results[0];
							else
								currentData = data.results[1];
						}
						else
						{
							if(data.results[0].formatted_address.toLowerCase().indexOf("place") > -1)
								currentData = data.results[1];
							else
								currentData = data.results[0];

						}
						
						
						//console.log(data);
						resStats[1] += 1;

					}
					else
					{	
						console.log("Erreur sur l'adresse: "+adr)
						console.log(data)
					}
					
				}
				else if(toTest == data.results[0].formatted_address)
				{
					console.log("Impossible de relever l'adresse exacte pour l'adrese: "+num+", "+adr);
					resStats[2] += 1;
				}
				else
				{
					resStats[0] += 1;
					currentData = data.results[0];
					
				}


			}
			else if(data.status == "ZERO_RESULTS")
			{
				resStats[3] += 1;
				console.log("Aucun resultat");
				console.log("adr = "+adr);
			}
			else if(data.status == "INVALID_REQUEST")
			{
				resStats[4] += 1;
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

	return currentData;
		
	
}
//Permet de bien formater l'adresse pour l'inclure
//dans l'url de la requete Google
function convertiEnAdresseGoogle(num, rue)
{
	rue = rue.replace(/ +/g, '+');
	var str = num +"+"+ rue+",+"+ville+",+"+pays;
	return str;
		
}

//Propose un choix à l'utilsateur, notamment sur les Places et Rues
function proposeChoix(type, enseigne)
{
	var res = "";
	if(type == "placeRue") //Si Google Maps hésite entre place et rue
	{
	var msg = "Ambiguitié sur l'addresse qu'il y a dans le fichier. S'agit t'il d'une place ou d'une rue pour le commerce : "+enseigne+" ? Cliquez sur 'Ok' pour 'Place' et sur 'annuler' pour 'Rue ou Boulevard etc'";

		if(confirm(msg))
		{
		 	return true;	
		}
		else
		{
			return false;
		}

	}
}

//Fonction qui permet d'enlever les accents, espaces etc
function normalizeString(str)
{
	str = str.toLowerCase().replace(/ +/g, '').replace(/-/g, '').replace(/é/g, 'e').replace(/è/g, 'e').replace(/à/g, 'a').replace(/ç/g, 'c');
	return str;
}

//Met à jour les coordonnées dans le tableau pour un magasin
//en particulier, après réception des infos Google Maps
function metAJourCoords(i, d, current, newTab)
{
	var num = d.address_components[0].long_name;
	//On essaye de caster num en Int car Google 
	//net met pas au meme endroit les éléments de ses réponses !
	
	if(!isNaN(num)) //Si c'est un nombre
	{
		newTab[current[i].num_line].street_number    = num;
		newTab[current[i].num_line].sort_street_name = d.address_components[1].long_name;
		newTab[current[i].num_line].route            = d.address_components[1].long_name;
		newTab[current[i].num_line].city             = d.address_components[2].long_name; 
		newTab[current[i].num_line].dptmt            = d.address_components[3].long_name;
		newTab[current[i].num_line].region           = d.address_components[4].long_name;
		newTab[current[i].num_line].country          = d.address_components[5].long_name;
		newTab[current[i].num_line].postal_code      = d.address_components[6].long_name;
	}
	else
	{
		//On arrive ici si le premier element du tableau retourné par Google
		//n'est pas un int mais directement le nom de la rue
		newTab[current[i].num_line].street_number    = "";
		newTab[current[i].num_line].sort_street_name = d.address_components[0].long_name;
		newTab[current[i].num_line].route            = d.address_components[0].long_name;
		newTab[current[i].num_line].city             = d.address_components[1].long_name; 
		newTab[current[i].num_line].dptmt            = d.address_components[2].long_name;
		newTab[current[i].num_line].region           = d.address_components[3].long_name;
		newTab[current[i].num_line].country          = d.address_components[4].long_name;
		newTab[current[i].num_line].postal_code      = d.address_components[5].long_name;	
	}


	newTab[current[i].num_line].location_lat    = d.geometry.location.lat;
	newTab[current[i].num_line].location_lng    = d.geometry.location.lng;
	newTab[current[i].num_line].google_place_id = d.place_id;
	newTab[current[i].num_line].vp_ne_lat       = d.geometry.viewport.northeast.lat;
	newTab[current[i].num_line].vp_ne_lng       = d.geometry.viewport.northeast.lng;
	newTab[current[i].num_line].vp_sw_lat       = d.geometry.viewport.southwest.lat;
	newTab[current[i].num_line].vp_sw_lng       = d.geometry.viewport.southwest.lng;
	
	return newTab;
}

//Permet d'ajouter des exceptions aux Adresses
//car il arrive que Google retourne une formatted_address completement fausse
//si on fait sans
//Bien sur, on l'ajoute s'il n'existe QUE une place OU une rue, sinon ça ajouterait des ambiguité
function exception(adr)
{
	var except = false;
	if(adr == "DE BRETAGNE"){ adr = "PLACE DE BRETAGNE"; except = true;}
	if(adr == "SAINT HELIER"){ adr = "RUE SAINT HELIER"; except = true;}
	if(adr == "DU GUESCLIN"){ adr = "RUE DUGUESCLIN"; except = true;} //Du gueslin est en 1 seul mot ici, Google Maps préfère

	if(except) console.log("Exception d'adresse => modification")

	return adr;

	
}

//Fonction qui va tester si tous les commerces ont bien 
//des coordonnées GPS
function checkifok(current)
{
	var i = 0;
	var tab = []
	while( i < current.length )
	{
		if(current[i].location_lat == "" || typeof current[i].location_lat == "undefined" || current[i].location_lng == "" || typeof current[i].location_lng == "undefined")
		{
			tab.push(current[i]);	
		}
		
		
		i++;	
	}
	if(tab.length == 0){console.log("Tous les magasins ont des coordonnées GPS, gg"); return true;}
	else{console.log("Certains magasins n'ont pas pu avoir de coordonnées... En voici la liste");console.log(tab); return false};
	
}




























