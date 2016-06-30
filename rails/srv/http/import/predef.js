//Fichier qui va traiter avec les Parcours Predefinis


//Fonction principale
function supprimerDansPredef(rm,toAdd)
{
	var predef;
	//On Récupère la liste des parcours
	$.ajax({
		url:"/api/?req=predef&format=json",
		method:"GET",
		dataType:"json",
		async:false,
		success:function(data)
		{
			predef = data;		
		}	
	});
	
	var i = 0;
	var k = 0;
	var j = 0;
	var l = 0;
	//On parcourt tous les magasins des parcours predefs. 
	//Pour chaque, on regarde s'il existe toujours. Si ce n'est pas le cas, on change la valeur du tableau
	//de ses commerces, et on informe l'utilisateur si ce dernier commerce a été remplacé ou non.
	while( i < predef.size)
	{
		k = 0;
		j = 0;
		l = 0;
		var newTab = [];
		var formObj = getPredefForm(predef.parcourspredefs[i].id);
		
		while( k < predef.parcourspredefs[i].commerces.length)
		{

			var id = predef.parcourspredefs[i].commerces[k];
			var c;
			$.ajax({
				url:"/api/?req=spec&format=json&id="+id,
				method:"GET",
				dataType:"json",
				async:false,
				success:function(data)
				{
					//S'il n'existe plus, on regarde comment il s'appelait dans la BDD
					if(data.commerce == null)
					{
						console.log("!!! Magasin qui disparait pendant la mise à jour => Parcours : "+predef.parcourspredefs[i].name+", uuid: "+id)
						//On cherche l'indice dans le tableaux de commerces à supprimer
						while(j < rm.length)
						{
							if (rm[j].id == id)
							{
								console.log("...Le commerce : "+rm[j].enseigne +" est supprimé");
								break;
							}
							j++
						}
						//On a notre indice dans la suppression des magasins
						//On regarde s'il y a un commerce avec cette adresse dans les nouveaux
						
						if(j < rm.length)
						{
							l = 0;
							while(l < toAdd.length)
							{
								if(rm[j].street_num == toAdd[l].street_num && rm[j].street_name == toAdd[l].street_name)
								{
									console.log("... et est remplacé physiquement par "+toAdd[l].enseigne);
									break;
								}
								
							
								l++;
							}	
						}
					
					}
					else
					{
						//on l'ajoute à newTab
						newTab.push(id);
						
					}
					
				}
				
				
			})


			k++;
		}	
		//On le met au format Postgresql
 		var tabStr ="{";
		newTab.forEach(function(e, p){
			tabStr += (p == (newTab.length - 1) ? e : e+",");
		})
		tabStr += "}";
		formObj.parcours_predefini.commerces = tabStr;			

		$.ajax
		({
			url:"/api/bo/parcours_predefinis/"+predef.parcourspredefs[i].id,
			method:"PATCH",
			data:formObj,
			async:false,
			dataType:"json",
			error:function(err)
			{
				console.log("Erreur");	
			},
			complete:function()
			{
				console.info("Parcours "+predef.parcourspredefs[i].name+" mis à jour !")	
			}
			
			
		})	



		i++;
	}
	console.log("Fin de la mise a jour des parcours prédefinis")	
}

//Permet de récupérer le formulaire des parcours predefinis
function getPredefForm(id)
{
	var pageFull;	
	$.ajax
	({
		url:"/api/bo/parcours_predefinis/"+id+"/edit",		
		async:false,
		method:"GET",
		dataType:"html",
		success: function(data)
		{
			pageFull = data;
			//console.log("Recupération de la page EDIT Réussie");
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
	

	return formObj;
	
}






















