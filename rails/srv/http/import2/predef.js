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

		while( k < predef.parcourspredefs[i].commerces.length)
		{
			var id = predef.parcourspredefs[i].commerces[k];
			var c;
			var newTab = [];
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
						console.log("!!! Parcours : "+predef.parcourspredefs[i].name+", uuid: "+id)
						//On cherche l'indice dans le tableaux de commerces à supprimer
						while(j < rm.length)
						{
							if (rm[j].siret == id)
							{
								console.log("Le commerce : "+rm[j].enseigne +" est supprimé");
								break;
							}
							j++
						}
						//On a notre indice dans la suppression des magasins
						//On regarde s'il y a un commerce avec cette adresse dans les nouveaux
						
						if(j < rm.length)
						{
							while(l < toAdd.length)
							{
								if(rm[j].street_num == toAdd[l].street_num && rm[j].street_label == toAdd[l].street_label)
								{
									console.log("... et est remplacé par "+toAdd[l].enseigne);
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
		
		i++;
	}
	console.log("Fin de la mise a jour des parcours prédefinis")	
}
