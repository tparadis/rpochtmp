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
	var nbAdd = 0;
	var commerce = tabNew[0];
	var i = 0;
	
	console.log("AJOUT DES NOUVEAUX MAGASINS");
	
	while (i < tabNew.length)
	{
			for(key in formObj.commerce)
			{
				if(key != "db_add_date") //On garde la valeur du formulaire
					formObj.commerce[key] = tabNew[i][key];	
			}
			formObj.commerce.line = tabNew[i].num_line;
			formObj.commerce.enseigne = tabNew[i].enseigne.toUpperCase();
			formObj.commerce.date_deb_act = tabNew[i].date_debut_act;
			formObj.commerce.location_type = "ROOFTOP";
			formObj._method = "POST";
			if(!dansArray(blackListNew, tabNew[i].siret))
			{
				
				$.ajax({
			
					url:"/api/bo/commerces",
					async:false,
					method:"POST",
					data:formObj,
					dataType:"json",
					complete:function()
					{
						console.log(tabNew[i].enseigne+" crée ("+tabNew[i].siret+")");
						nbAdd++;
					}
			
			
				})
			}
			else
			{
				console.log("omission d'un commerce blacklisté...")	
			}
		i++;
	}
	console.log(nbAdd+" commerces ajoutés");

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
	var nbModif = 0;

	//On récupère la structure du formulaire edit

	$.ajax
	({
		url:"/api/bo/commerces/"+old[0].id+"/edit",		
		async:false,
		method:"GET",
		dataType:"HTML",
		success: function(data)
		{
			pageFull = data;
			console.log("Recupération de la page EDIT Réussie");
		},
		error: function(err)
		{
			console.log("Erreur lors de la récupération de la page EDIT: "+err);
			throw new Error("Impossible de relever la page EDIT")
		}
		
	});

	//On crée un formulaire temporaire sur la page
	var domPage = document.createElement("div");
	domPage.innerHTML = pageFull;
	var domForm = domPage.getElementsByTagName("form");
	var formObj = jQuery(domForm).serializeObject();
	
	//Boucle de mise à jours
	var i = 0;
	var requests = [];
	while(i < old.length)
	{
			for(key in formObj.commerce)
			{
				//Petites modifications d'alias + ajout dans l'objet formObj des propriétés
				formObj.commerce[key] = old[i][key];	
			}

			formObj.commerce.line = old[i].num_line;
			formObj.commerce.date_deb_act = old[i].date_debut_act;
			formObj.commerce.location_type = "ROOFTOP";


			//console.log(formObj)
			var url = "/api/bo/commerces/"+old[i].id; //adresse complete
			if(!dansArrayJSON(blacklist, old[i].siret) && !dansArray(blackListNew, old[i].siret))	
			requests.push($.ajax({
				url:url,
				method:"PATCH",
				data:formObj,
				async:true,
				dataType:"json",
				error:function(XMLHttpRequest, textStatus, errorThrown)
				{
					console.log("Erreur: "+errorThrown+", "+textStatus)		
				},
				complete:function()
				{
					//console.log(i+": "+old[i].enseigne+" modifié");	
					nbModif++;
				}

			}))
		console.log( Math.round(((i / old.length) * 100))+"%"  )
		i++;
	}
	console.info("Les modifications sont en cours, le resultat arrive un peu apres...")
	$.when.apply($,requests).done(function(res){
		console.log(nbModif+" magasins ont bien été édités")	;
		return true;
	});

	
}



//Permet la suppression de commerces depuis un tableau
function supprimerCommerces(tab)
{
	console.log("SUPPRESSION DES COMMERCES INEXISTANTS")	
	var i = 0;
	var k = 0;
	while(i < tab.length)
	{


		$.ajax(
		{
		url:"/api/bo/commerces/"+tab[i].id,	
		method:"DELETE",
		dataType:"json",
		async:false,
		success:function(data)
		{
			k++;
		},
		error:function(err)
		{
			k++;	
		}
		
		})

		i++;
	}
	if(i == 0) {
		i = 1; 
		k = 1; //On évite la division par zéro
		console.log(0+" commerces supprimés ("+ ((k/i).toFixed(2)*100) +")%");
	}
	else
	{
		console.log(k+" commerces supprimés ("+ ((k/i).toFixed(2)*100) +")%");
	}
	

	



}


function dansArray(tab, siret)
{

	for(k = 0; k < tab.length; k++)
	{
		if(tab[k] == siret)
		{
			return true;	
		}
	}

	return false;	
}
function dansArrayJSON(tab, siret)
{

	for(k = 0; k < tab.length; k++)
	{
		if(tab[k].siret == siret)
		{
			return true;	
		}
	}

	return false;

	
	
}







































