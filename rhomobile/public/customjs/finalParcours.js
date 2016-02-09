var coord_dep_lat = 48.110003;
var coord_dep_lng = -1.679201;
var coord_arr_lat = 48.110003;
var coord_arr_lng = -1.679201;
var dist_max = 10;
var res ="";

$(document).ready(function() {
	refresh();
});

function refresh() {
	$("tbody").html("");
    for (var i=0 ; i < sessionStorage.length; i++)
    {
    	var magasin = JSON.parse(sessionStorage.getItem(i));
    	var id = magasin[2];
    	if (magasin.length == 3) {
        	$("tbody").append("<tr><td>"+magasin[1]+"</td><td></td><td><a class='ui-btn' onclick='supprimerSsCat("+i+")'><span class='ui-btn-text'>X</span></a></td></tr>");
    	} else {
    		$("tbody").append("<tr><td>"+magasin[3]+"</td><td><a class='detailButton' name='"+id+"' href='/app/DetailsCommerce/details_commerce'><button>i</button></a></td><td><button onclick='newMag("+i+")'>New mag</button></td></tr>");
    		ajoutDansRes();
		    $('a.detailButton').on('click',function(e){
	    		sessionStorage.setItem("currentMagasin", $(this).attr('name'));
	    	});
    	}
    }
}

function supprimerSsCat(numLigne) {
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

	$.ajax({
	    dataType: "json",
	    contentType: "application/json",
		url : "http://rpoch.istic.univ-rennes1.fr/api/",
		data : {"req":"yolo","format":"json","coord_dep_lat":coord_dep_lat,"coord_dep_lng":coord_dep_lng,"coord_arr_lat":coord_arr_lat,"coord_arr_lng":coord_arr_lng,"dist_max":dist_max,"commerces":"["+tags+"]"},
		type : "GET",
		async: false,
		success: function(data){
			res = "";
			$("tbody").html("");
			for (var i = 1 ; i <= tags.length ; i++)
		    {// remplacer la catégorie parent par l'id magasin
		    	var tagCourant = data.tags[i];
		    	//On ajoute la valeur id  de l'enseigne dans la sessionStorage
		    	var elem = sessionStorage.getItem(i-1);
		    	elem = JSON.parse(elem);
		    	//Obligatoire si l'utilisateur a deja clique sur Generer un sessionStorage et qu'il veut remettre un autre magasin après
		    	//Sinon les id s'ajoutent indéfiniments à la suite dans le meme tableau !
		    	var id = tagCourant.id;
		    	elem[2] = id;
		    	elem.push(tagCourant.enseigne.toLowerCase());
		    	elem.push(tagCourant.location_lat);
		    	elem.push(tagCourant.location_lng);
		    	sessionStorage.setItem(i-1, JSON.stringify(elem));
	    	
		    	//On affiche sur la page
		    	//On ajoute la classe (non utilisée en CSS) detailsButton pour distinguer les bouttons par l'action onclick()
		    	$("tbody").append("<tr class='mag"+(i-1)+"'><td>"+tagCourant.enseigne.toLowerCase()+"</td><td><a class='detailButton' name='"+id+"' href='/app/DetailsCommerce/details_commerce'><button>i</button></a></td><td><button onclick='newMag("+(i-1)+")'>New mag</button></td></tr>");
		    	ajoutDansRes();
		    	
		    	//Ajout d'une action qui va ajouter à la sessionStorage
		    	// currentMagasin => id
		    	//Ceci est utile pour la transition de cette page à la page de Magasin spécifique
		    	
		    	
		    }
			
		    //On récupère l'attribut nom (qui contient l'id du magasin) et on le stock dans la sessionStorage "currentMagasin"
		    //Dans la page detailsCommerce.js, on enverra en Ajax la requete avec comme id la valeur de la sessionStorage 
		    //Astucieux hein ? :p
		    //En vrai ça marchait pas avec un passage de parametres classiques ?id= et tout...
		    $('a.detailButton').on('click',function(e){
	    		sessionStorage.setItem("currentMagasin", $(this).attr('name'));
	    	});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			alert(textStatus +", " +errorThrown);
		}
	});
}

function afficherParcours() {
	   $.get('/app/Personalisee/get_callback',{ parcours_perso: res });
}

function newMag (i) {
	var elem = JSON.parse(sessionStorage.getItem(i));
	var tag = elem[0];
	$.ajax({
	    dataType: "json",
	    contentType: "application/json",
		url : "http://rpoch.istic.univ-rennes1.fr/api/",
		data : {"req":"yolo","format":"json","coord_dep_lat":coord_dep_lat,"coord_dep_lng":coord_dep_lng,"coord_arr_lat":coord_arr_lat,"coord_arr_lng":coord_arr_lng,"dist_max":dist_max,"commerces":"["+tag+"]"},
		type : "GET",
		async: false,
		success: function(data) {
			var id = data.tags[1].id;
			elem[2] = id;
			elem[3] = data.tags[1].enseigne.toLowerCase();
			elem[4] = data.tags[1].location_lat;
			elem[5] = data.tags[1].location_lng;
			sessionStorage.setItem(i, JSON.stringify(elem));
			$(".mag"+i).html("");
			$(".mag"+i).append("<td>"+data.tags[1].enseigne.toLowerCase()+"</td><td><a class='detailButton' name='"+id+"' href='/app/DetailsCommerce/details_commerce'><button>i</button></a></td><td><button onclick='newMag("+i+")'>New mag</button></td>");
		    $('a.detailButton').on('click',function(e){
	    		sessionStorage.setItem("currentMagasin", $(this).attr('name'));
	    	});
		    refresh();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			alert(textStatus +", " +errorThrown);
		}
	})
}

function ajoutDansRes() {
	for (var i = 0 ; i < sessionStorage.length ; i++) {
		var magasin = JSON.parse(sessionStorage.getItem(i));
		res=res.concat(magasin[4],",",magasin[5],",",magasin[3],",");
	}
}