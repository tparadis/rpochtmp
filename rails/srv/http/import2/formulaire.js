/* Fichier qui va permettre d'aller creer/editer
 * des models directement en URL
*/

var champs = ["num_line", "siret", "enseigne", "rasoc", "date_debut_act", "date_rad", "code_ape", "label_ape", "zone_ape", "label_zone_ape", "street_num", "street_name", "city_code", "city_label", "phone_num", "email", "activite"];
var champsA = ["id","sort_street_name", "epci2014", "street_number", "route", "city", "dptmt", "region", "country", "postal_code", "location_lat", "location_lng", "google_place_id", "vp_ne_lat", "vp_ne_lng", "vp_sw_lat", "vp_sw_lng", "description", "website", "email", "facebook", "instagram", "fax_num", "tag0", "tag1", "tag2", "tag3", "image", "db_add_date"];

var champsNew = ["city", "city_code", "city_label", "code_ape", "country", "date_deb_act", "date_rad", "db_add_date", "description", "dptmt", "email", "enseigne", "epci2014", "facebook", "fax_num", "google_place_id", "id", "instagram", "label_ape", "label_zone_ape", "line", "location_lat", "location_lng", "location_type", "phone_num", "postal_code", "rasoc", "region", "route", "siret", "sort_street_name", "street_name", "street_num", "street_number", "tag0", "tag1", "tag2", "tag3", "vp_ne_lat", "vp_ne_lng", "vp_sw_lat", "vp_sw_lng", "website", "zone_ape"];

//Fonction qui va créer tous les nouveaux éléments
function createAllNew(tabNew)
{
	
	var formObj = recupereFormNew();
	var champsForm = formObj.commerce;

	var commerce = tabNew[0];
	//console.log(tabNew[0]);
	//console.log(champsForm);	
	var i = 0;
	for(i = 0; i < champsNew.length; i++)
	{
		champsForm[champsNew[i]] = commerce[champsNew[i]];
	}
	console.log(commerce)
	console.log(champsForm)
	
}


//Recupere le formulaire 'NEW' de l'api
//L'utilisateur doit être connecté en ADMIN sur le Back-office
function recupereFormNew()
{
	var pageFull = "";
	$.ajax
	({
		url:"/api/bo/commerces/new",		
		async:false,
		method:"GET",
		dataType:"HTML",
		success: function(data)
		{
			pageFull = data;
			console.log("Recupération de la page NEW Réussie");
		},
		error: function(err)
		{
			console.log("Erreur lors de la récupération de la page NEW: "+err);
			throw new Error("Impossible de relever la page NEW")
		}
		
	});

	//On crée un formulaire temporaire sur la page
	var domPage = document.createElement("div");
	domPage.innerHTML = pageFull;
	var domForm = domPage.getElementsByTagName("form");
	var formObj = jQuery(domForm).serializeObject();
	
	return formObj;
	
}

//Permet de modifier les commerces que nous avions deja
function modifyAll(old)
{
	
	console.log(old[0]);
	
	
	
}

//Permet la suppression de commerces depuis un tableau
function supprimerCommerces(tab)
{
	
	var i = tab.length - 2;
/*
	$.ajax(
	{
		url:"/api/bo/commerces/"+tab[i].id,	
		method:"DELETE",
		success:function(data)
		{
			console.log("supprimé")	
		}
		
	})
	
*/
	console.log(i+": "+tab[i].enseigne+", "+tab[i].id)

	



}











































