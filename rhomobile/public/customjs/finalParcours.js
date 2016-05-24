var dist_max = 1000;
var res ="";

$(document).ready(function() {
	refresh();
});


function refresh() {
	$("tbody").html("");
	dist_max = getDistMax();
	sessionStorage.removeItem("posRecuperer");
    for (var i=0 ; i < sessionStorage.length; i++)
    {
    	var magasin = JSON.parse(sessionStorage.getItem(i));
    	var id = magasin[2];
    	
    	try
    	{
    		$("tbody").append("<tr class='detailButton'name='"+id+"' ><td class='listeItem' >"+magasin[3].toUpperCase()+"</td><td><img class='ImgBtnInfo' ></img></td><td><img class='ImgBtnRemplacer' onclick='newMag("+i+")'></img></td><td><img class='ImgBtnSupprimer' onclick='supprimerMag("+i+")'></img></td></tr>");
    		ajoutDansRes();
    	}
    	catch(err)
    	{
    		console.error("ERREUR : "+err);
    		$("tbody").append("<tr><td>Aucun parcours disponible pour votre demande...<br><a href='/app/SousCategories/sous_categories' onclick='sessionStorage.clear();'>Recommencer</a></td></tr>");
    		break;
    	}
		   
    }
    $('tr.detailButton').on('click',function(e){
		sessionStorage.setItem("currentMagasin", $(this).attr('name'));
		afficheSpecificationMagasin();
	});
}

function supprimerMag(numLigne) {
	for(var i=numLigne ; i < sessionStorage.length ; i++) {
		sessionStorage.setItem(i, sessionStorage.getItem(i+1));
	}
	sessionStorage.removeItem(sessionStorage.length-1);
	refresh();
}

function genererParcours(){
	var tags = [];
	for (var i = 0 ; i < sessionStorage.length ; i++) {
		var mag = JSON.parse(sessionStorage.getItem(i));
		tags.push(mag[0]);
	}

	var coord_dep_lat = localStorage.getItem("userlat");
	var coord_dep_lng = localStorage.getItem("userlng");
	
	console.log("lat = "+coord_dep_lat+", long = "+coord_dep_lng);
	
	var coord_arr_lat = localStorage.getItem("userlat");
	var coord_arr_lng = localStorage.getItem("userlng");
	dist_max = getDistMax();
	
	var data = api.genParcours(coord_dep_lat, coord_dep_lng, coord_arr_lat, coord_arr_lng, dist_max, tags);
		res = "";
		$("tbody").html("");
		for (var i = 1 ; i <= tags.length ; i++)
	    {// remplacer la cat�gorie parent par l'id magasin
	    	var tagCourant = data.tags[i];
	    	//On ajoute la valeur id  de l'enseigne dans la sessionStorage
	    	var elem = sessionStorage.getItem(i-1);
	    	elem = JSON.parse(elem);
	    	//Obligatoire si l'utilisateur a deja clique sur Generer un sessionStorage et qu'il veut remettre un autre magasin apr�s
	    	//Sinon les id s'ajoutent ind�finiments � la suite dans le meme tableau !
	    	var id = tagCourant.id;
	    	elem[2] = id;
	    	elem.push(tagCourant.enseigne.toLowerCase());
	    	elem.push(tagCourant.location_lat);
	    	elem.push(tagCourant.location_lng);
	    	sessionStorage.setItem(i-1, JSON.stringify(elem));
    	
	    	//On affiche sur la page
	    	//On ajoute la classe (non utilis�e en CSS) detailsButton pour distinguer les bouttons par l'action onclick()
	    	$("tbody").append("<tr class='mag"+(i-1)+"'><td class='listeItem' >"+tagCourant.enseigne.toUpperCase()+"</td><td><img class=' detailButton ImgBtnInfo' name='"+id+"'></img></td><td><img class='ImgBtnRemplacer' onclick='newMag("+i+")'></img></td><td><img class='ImgBtnSupprimer' onclick='supprimerMag("+i+")'></img></td></tr>");
	    	ajoutDansRes();
	    	
	    	//Ajout d'une action qui va ajouter � la sessionStorage
	    	// currentMagasin => id
	    	//Ceci est utile pour la transition de cette page � la page de Magasin sp�cifique
	    	
	    	
	    }
		

}

function afficherParcours() {
	   $.get('/app/Personalisee/get_callback',{ parcours_perso: res });
}

function newMag (i) {
	var elem = JSON.parse(sessionStorage.getItem(i));
	var tag = elem[0];
	
	var coord_dep_lat = localStorage.getItem("userlat");
	var coord_dep_lng = localStorage.getItem("userlng");
	var coord_arr_lat = localStorage.getItem("userlat");
	var coord_arr_lng = localStorage.getItem("userlng");
	
	var data = api.genParcours(coord_dep_lat, coord_dep_lng, coord_arr_lat, coord_arr_lng, dist_max, tag);

			var id = data.tags[1].id;
			elem[2] = id;
			elem[3] = data.tags[1].enseigne.toLowerCase();
			elem[4] = data.tags[1].location_lat;
			elem[5] = data.tags[1].location_lng;
			sessionStorage.setItem(i, JSON.stringify(elem));
			$(".mag"+i).html("");
			$(".mag"+i).append("<td>"+data.tags[1].enseigne.toLowerCase()+"</td><td><button class='detailButton ui-btn' name='"+id+"'><span class='ui-btn-text'>i</span></button></td><td><button class='ui-btn' onclick='newMag("+i+")'><span class='ui-btn-text'>X</span></button></td>");
		    $('img.detailButton').on('click',function(e){
	    		sessionStorage.setItem("currentMagasin", $(this).attr('name'));
	    	});
		    refresh();
		
}

function ajoutDansRes() {
	for (var i = 0 ; i < sessionStorage.length ; i++) {
		var magasin = JSON.parse(sessionStorage.getItem(i));
		res=res.concat(magasin[4],",",magasin[5],",",magasin[3],",");
	}
}