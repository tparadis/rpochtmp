$(document).ready(function(){

	
	$('form').on("submit",function(){
		$.ajax({
		    dataType: "json",
		    contentType: "application/json",
			url : $(this).attr("action"),
			data : {"req":"path","format":"json"}, //req = path indique que vous formulez une requete pour creer un parcours au backend
			type : "GET",
			async:false,
			success: function(data){
				/*	Cette fonction success va vous permettre de traiter l'objet contenant les données reçues par le backend : data.
				 *  Cet objet contient : { "size" => int, "magasins" => magasins:List}
				 *  J'ai mis un exemple en dessous pour montrer comment récupérer les champs des magasins
				 *  Size c'est le nombre de magasins renvoyés. Magasins est la liste des magasins qu'on renvoie avec pour chacun tous les champs nécessaire à Google MAPS.
				 *  Pour un magasin, vous trouverez les champs : "nom", "latitude", "longitude"
				 *  (Il y a des infos de la base de Rails comme la date d'ajout dans la bdd et autres mais on s'en moque)
				 *  
				 */
				$("#results").append("nombre :"+data["size"]+"<br/>");
				var i =0;
				while(i < data["size"])
				{
					$("#results").append(i+" : "+data["magasins"][i]["nom"]+"("+data["magasins"][i]["latitude"]+", "+data["magasins"][i]["longitude"]+")<br/>");
					i++;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{
				alert(textStatus +", " +errorThrown);
			}
		});
		
		
		
		return false;
	});
	
	
	
	
})