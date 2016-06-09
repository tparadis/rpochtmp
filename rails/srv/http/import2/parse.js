var nombreNouveauxCommerces = 0;
var nbElements = 0;
var commercesNew;
var champs = ["num_line", "siret", "enseigne", "rasoc", "date_debut_act", "date_rad", "code_ape", "label_ape", "zone_ape", "label_zone_ape", "street_num", "street_name", "city_code", "city_label", "phone_num", "email", "activite"];
var champsA = ["id", "sort_street_name", "epci2014", "street_number", "route", "city", "dptmt", "region", "country", "postal_code", "location_lat", "location_lng", "google_place_id", "vp_ne_lat", "vp_ne_lng", "vp_sw_lat", "vp_sw_lng", "description", "website", "email", "facebook", "instagram", "fax_num", "tag0", "tag1", "tag2", "tag3", "image", "db_add_date"];
var nouveauxCommerces = []; //liste des nouveaux commerces
var toRemoveCommerces = []; //liste des commerces à supprimer


function lancerParse(evt)
{
	var file = evt.target.files[0];	
	console.log("---- Lancement du Parseur ------");
	var reader= new FileReader();
	var name = evt.name;
	var commercesBDD;

	//Attention, le onload est executé apres le readAsBinaryString
	//et ce, à un moment random
	reader.onload = function(e)
	{

		var data = e.target.result;
		var workbook = XLSX.read(data, {type: 'binary'});
		commercesNew = commercesFichierCourrant(workbook);
		
	}
	reader.readAsBinaryString(file); //execute le onload


	//Après le parse du Document xlsx
	reader.onloadend = function(e)
	{
		console.log("Recupération des infos des commerces");	
		var start = new Date().getTime();
		$.ajax({
			url:"/api/bo/commerces.json",
			dataType: "json",
			async:false,
			methode:"GET",
			success:function(data, textstatus, request){
				commercesBDD = data;
			},
			error:function(request, status, error)
			{
				showError("Une erreur s'est produite pendant la récuperation des informations de la BDD. <br/>Etes-vous bien connecté au Back-Office en mode administateur ?");
				throw new Error("Erreur "+error);
			}

		});
		var end = new Date().getTime();
		console.log ("Requete executée en "+(end - start)+" ms");

		//A partir d'ici nous avons dans commercesBDD tous les commeres
		//présent dans la BDD actuelle, et dans commercesNew 
		//les commerces présents dans le fichier xlsx
		toRemoveCommerces = getCommercesToRemove(commercesBDD, commercesNew); //Liste des commerces à supprimer

		commercesNew = addNewValuesToCurrentObjectBDD(commercesBDD, commercesNew); //Liste des commerces existants mise à jour		
		
		console.log(toRemoveCommerces.length+" magasins marqués à supprimer")

		//Appel à Google maps
		commercesNew = getAllCoords(commercesNew, nouveauxCommerces); //Permet de mettre à jour les nouveaux commerces

		//Affichage
		displayTable(nouveauxCommerces); //Permet la modification des nouveaux commerces

		//Test pour l'ajout d'un nouveau commerce
		//TODO faire ceci lorsque l'utilisateur VALIDE
		//LEs MODIFICATIONS :D
		//createAllNew(nouveauxCommerces);



	}//fin onloadend



	
}

//Fonction qui va extraire les commerces et leurs infomations
//du fichier XLSX ci-joint
//Retourne un tableau d'objets commerces au format JSON
//

function commercesFichierCourrant(workbook)
{
	var feuille = workbook.Sheets["Feuil1"];
	var commerces = [];
	var i = 1;
	var offset = 0;

	//On ajuste l'indice i pour qu'il tombe sur le premier siret réel
	while(true)
	{
		if(typeof feuille['A'+i] != "undefined")
		{
			if(feuille['A'+i].v != "Siret")
			{
				break;	
			}
		}
		i++;	
	}
	offset = i;
	console.log("Le fichier commence à l'indice "+i);


	//On recupere les informations du fichier xlsx
	//et on les ajoutent dans une variable commerce que l'on ajoutera
	//à un tableau de commerces contenant tous ces "commerce" 
	//si le champ enseigne n'est pas rempli, on met la RASOC (Raison Sociale)
	try
	{
		while(typeof feuille['A'+i] != "undefined")
		{

			var commerceCourrant = {};
			var num_line = i;
			var siret          = typeof feuille["A"+i] == "undefined" ? "" : feuille["A"+i].v;
			var rasoc          = typeof feuille["C"+i] == "undefined" ? "" : feuille["C"+i].v;
			var enseigne       = typeof feuille["B"+i] == "undefined" ? rasoc : feuille["B"+i].v;
		    var date_debut_act = typeof feuille["D"+i] == "undefined" ? "" : convertToDate(feuille["D"+i].v);;
			var date_rad       = typeof feuille["E"+i] == "undefined" ? "" : convertToDate(feuille["E"+i].v);
			var code_ape       = typeof feuille["F"+i] == "undefined" ? "" : feuille["F"+i].v;
			var label_ape      = typeof feuille["G"+i] == "undefined" ? "" : feuille["G"+i].v;
			var zone_ape       = typeof feuille["H"+i] == "undefined" ? "" : feuille["H"+i].v;
			var label_zone_ape = typeof feuille["I"+i] == "undefined" ? "" : feuille["I"+i].v;
			var street_num     = typeof feuille["J"+i] == "undefined" ? "" : feuille["J"+i].v;
			var street_name    = typeof feuille["K"+i] == "undefined" ? "" : feuille["K"+i].v;
			var city_code           = typeof feuille["L"+i] == "undefined" ? "" : feuille["L"+i].v;
			var city_label     = typeof feuille["M"+i] == "undefined" ? "" : feuille["M"+i].v;
			var phone_num      = typeof feuille["N"+i] == "undefined" ? "" : feuille["N"+i].v;
			var email          = typeof feuille["O"+i] == "undefined" ? "" : feuille["O"+i].v; 
			var activite       = typeof feuille["P"+i] == "undefined" ? "" : feuille["P"+i].v;


			//On complete notre tableau associative pour le commerce
			//des valeurs nouvellement crées
			commerceCourrant["num_line"] = num_line - offset;
			commerceCourrant["siret"] = siret;
			commerceCourrant["enseigne"] = enseigne;
			commerceCourrant["rasoc"] = rasoc;
			commerceCourrant["date_debut_act"] = date_debut_act;
			commerceCourrant["date_rad"] = date_rad;
			commerceCourrant["code_ape"] = code_ape;
			commerceCourrant["label_ape"] = label_ape;
			commerceCourrant["zone_ape"] = zone_ape;
			commerceCourrant["label_zone_ape"] = label_zone_ape;
			commerceCourrant["street_num"] = street_num;
			commerceCourrant["street_name"] = street_name;
			commerceCourrant["city_code"] = city_code;
			commerceCourrant["city_label"] = city_label;
			commerceCourrant["phone_num"] = phone_num;
			commerceCourrant["email"] = email;
			commerceCourrant["activite"] = activite;
			var k = 0;
			while(k < champsA.length)
			{
				commerceCourrant[champsA[k]] = "";
				k++;
			}
			commerces.push(commerceCourrant);
			i++	
			
		}
			
		
	}
	catch(err)
	{
		
		console.log("Erreur : "+ err);
		
		
	}
	
	console.log("Fin de la lecture du fichier, en "+ i +" iteractions");	
	nbElements = i - offset;
	return commerces;
	


}

	
//Converti la date du format 13/1/2010 en une date 2010-1-13
function convertToDate(date)
{

	if(date == "null" || date == "") return "";
	var _date = "";
	
	var _dateret = ""; //La date effective à retourner
	try
	{
		_date = XLSX.SSF.parse_date_code(date);		
		_dateret = _date.y + '-' + convertToTwoNumbersDate(_date.m) + '-' + convertToTwoNumbersDate(_date.d);
	}
	catch(err)
	{
		console.log("Erreur "+err);	
		return _date;
	}

	return _dateret;
	
}
//Permet de convertir un jour ou un mois de 1 à 9 en 01 à 09
function convertToTwoNumbersDate(d)
{
	if(d <= 9) return '0'+d;	
	else return d;
}

//Fonction qui va ajouter les nouveaux elements dans l'Objet de BDD courrant si les champs
//ne sont pas nulls, on se base sur le siret
//Mets également à jour le tableau nouceauxCommerces
function addNewValuesToCurrentObjectBDD(bdd,current)
{
	
	console.log( "Il y a : "+(current.length - bdd.length) + " lignes différentes" );

	var i = 0;
	var j = 0;
	var k = 0;

	console.log("Debut de la mise a jour dans l'object BDD ");
	var start = new Date().getTime();


	while(i < current.length)
	{
		var siret = current[i].siret;
		var trouve = false;
		j = 0;
		k = 0;
		if(current[i].date_dat != null)
		{
			//on le supprime de la base s'il a une date_rad
			current.splice(i, 1);	
		}
		else
		{
			
			while(j < bdd.length)
			{
				//Si on l'a trouvé dans les anciens :
				if(siret == bdd[j].siret)	
				{
					trouve = true;
					while(k < champs.length)
					{
						var champsCurrent = champs[k]
						if(current[i][champsCurrent] == "")
						{
							//Si le champ de la nouvelle base est nul, on met l'ancien 	
							if(bdd[j][champsCurrent] != "" && bdd[j][champsCurrent] != null) current[i][champsCurrent] = bdd[j][champsCurrent];
							
						}
					
						k++;
					}
					k = 0;
					//on ajoute les champs non "basiques"
					while(k < champsA.length)
					{
						if ( bdd[j][champsA[k]] != null && bdd[j][champsA[k]] != "")
						{
							current[i][champsA[k]]	= bdd[j][champsA[k]]
						}
						k++;
					}
				}
				
				j++;
				if(!trouve && j >=bdd.length)
				{
					nouveauxCommerces.push(current[i]);
				}
			}
		}
		
		i++;	
	}


	var end = new Date().getTime();
	var time = end - start;
	console.log("fini en : "+time+" ms");
		
	return current;	
}

//Permet d'afficher les resultats de certaines erreurs dans la petite balise prévue à cet effet
function showError(str)
{
	$("#error").html(str);
	$("#error").show(200);
	
}

//Permet d'afficher les entrées du tableau sous forme de 'table' dans le code HTML
//Ceci permet d'editer les categories des nouveaux magasins en live avant l'envoi en BDD
//afin d'eviter d'avoir à les chercher par la suite pour le faire
function displayTable(current)
{
	var sscats;

	//Requete pour recuperer les sscategories
	$.ajax({
		url:"/api/?req=sscat&format=json",
		dataType:"json",
		async:false,
		success:function(data){sscats = data}
	});




	str = "<table style='table-layout:fixed'><tbody  style='position:abolute;left:0;top:0;width:100%'>";
	var tags = ["tag0", "tag1", "tag2", "tag3"];
	var champsEditables = ["description","website","email","facebook","instagram","fax_num"];
	var v = 0;
	var strsscats = "";

	//preparation de l'affichage des sscategories (c'est plus rapide de le garder 
	//dans un string que de le refaire à chaque fois
	for(v = 0; v < sscats.size; v++)
	{
		strsscats += "<option value='"+sscats.sscategories[v].id+"'>"+sscats.sscategories[v].nom+"</option>";
					
	}

	for(i = 0; i < current.length; i++)
	{
		str += "<tr>";
		for(k = 0; k < champs.length; k ++)
		{
			str += "<td style='border:1px solid black;font-size:12px'>";	
			str += current[i][champs[k]];
			str+= "</td>";
		}
		for(k = 0; k < champsA.length; k++)
		{
			str += "<td style='border:1px solid black;font-size:12px'>";	
			if(inArray(champsA[k], tags))
			{
				str += "<select id='"+i+"' name='"+champsA[k]+"'>"
				str += strsscats;	
				str += "</select>";
			}
			else if(inArray(champsA[k], champsEditables))
			{
				str += champsA[k]+":<br/> <input type='text' id='"+i+"' name='"+champsA[k]+"' /> "		
			}
			else
			{
				str += champsA[k]+":<br/>"+current[i][champsA[k]];		
			}

			str+= "</td>";

		}

		str+="</tr>";
	}
	str += "</tbody></table>";
	$("#proposeImport").hide();
	$("body").append(str);
	$("select").on('change', function()
	{
		commercesNew[current[$(this).attr('id')].num_line][$(this).attr('name')] = $(this).find("option:selected").attr("value");	
		console.log(current[$(this).attr('id')]);

	});
	$("input[type='text']").on("keyup paste change click input",function(e){
		var val = $(this).val();
		console.log(current[$(this).attr('id')])
		commercesNew[current[$(this).attr('id')].num_line][$(this).attr('name')] = val;
		console.log(commercesNew)
	})

}

//vérifie si le needle est dans le tableau arr
function inArray(needle, arr)
{
	var i = 0;

	while (i < arr.length)
	{
		if (arr[i] == needle) return true;
		i++;	
	}
	return false;
	
}

//Récupère la liste des commerces qui sont à supprimer
function getCommercesToRemove(commercesBDD, commercesNew)
{
	var ret = [];
	var i = 0;
	var j = 0;
	
	while(i < commercesBDD.length)
	{
	    var	trouve = false;
		var daterad = false;
		j = 0;
		while(j < commercesNew.length)
		{
			
			if(commercesBDD[i].siret == commercesNew[j].siret)
			{
				//Le magasin existe dans la nouvelle base, on passe
				trouve = true;
				break;
			}
			else if(commercesBDD[i].date_rad != null)
			{
				daterad = true;
				break;
			}
			j++;
			
		}
		if(trouve == false || daterad)
		{
			//Si c'est à faux, on l'ajoute à notre tableau de retour	
			ret.push(commercesBDD[i]);
		}
		
		i++;	
	}
	
	return ret;
	
}



























