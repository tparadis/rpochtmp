var nombreNouveauxCommerces = 0;

function lancerParse(evt)
{
	var file = evt.target.files[0];	
	console.log("---- Lancement du Parseur ------");
	var reader= new FileReader();
	var name = evt.name;

	//Attention, le onload est executé apres le readAsBinaryString
	//et ce, à un moment random
	reader.onload = function(e)
	{

		var data = e.target.result;
		var workbook = XLSX.read(data, {type: 'binary'});
		var commercesNew = commercesFichierCourrant(workbook)	
		
	}
	reader.readAsBinaryString(file);
	
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
			var city           = typeof feuille["L"+i] == "undefined" ? "" : feuille["L"+i].v;
			var city_label     = typeof feuille["M"+i] == "undefined" ? "" : feuille["M"+i].v;
			var phone_num      = typeof feuille["N"+i] == "undefined" ? "" : feuille["N"+i].v;
			var email          = typeof feuille["O"+i] == "undefined" ? "" : feuille["O"+i].v; 
			var activite       = typeof feuille["P"+i] == "undefined" ? "" : feuille["P"+i].v;





			//On complete notre tableau associative pour le commerce
			//des valeurs nouvellement crées
			commerceCourrant["num_line"] = num_line;
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
			commerceCourrant["city"] = city;
			commerceCourrant["city_label"] = city_label;
			commerceCourrant["phone_num"] = phone_num;
			commerceCourrant["email"] = email;
			commerceCourrant["activite"] = activite;
			
			i++	
			
		}
			
		
		
	}
	catch(err)
	{
		
		console.log("Erreur : "+ err);
		
		
	}
	
	console.log("Fin de la lecture du fichier, en "+ i +" iteractions");	
	


}

//Converti la date du format 13/1/2010 en une date 2010-1-13
function convertToDate(date)
{
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







