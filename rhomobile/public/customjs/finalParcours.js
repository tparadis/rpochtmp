var coord_dep_lat = 48.110003;
var coord_dep_lng = -1.679201;
var coord_arr_lat = 48.110003;
var coord_arr_lng = -1.679201;
var dist_max = 0.5;
var res ="";

$(document).ready(function() {
	refresh();
});

function refresh() {
	$("tbody").html("");
    for (var i=0 ; i < parcours.length; i++)
    {
    	var magasin = JSON.parse(parcours.getItem(i));
    	$("tbody").append("<tr><td>"+magasin[1]+"</td><td></td><td><button onclick='supprimerSsCat("+i+")'>X</button></td></tr>");
    }
}

function supprimerSsCat(numLigne) {
	var boucle = false;
	parcours.removeItem(numLigne);
	for(var i=numLigne ; i < parcours.length ; i++) {
		parcours.setItem(i, parcours.getItem(i+1));
		boucle = true;
	}
	if(boucle) {
		parcours.removeItem(parcours.length-1);
	}
	refresh();
}

function genererParcours(){
	var tags = [];
	for (var i = 0 ; i < parcours.length ; i++) {
		var mag = JSON.parse(parcours.getItem(i));
		tags.push("\""+mag[1]+"\"");
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
			var i = 0;
			$("tbody").html("");
			for (var i = 1 ; i <= tags.length ; i++)
		    {// remplacer la catégorie parent par l'id magasin
		    	$("tbody").append("<tr class='mag"+i+"'><td>"+data.tags[i].enseigne.toLowerCase()+"</td><td><a href=\"/app/DetailsCommerce/details_commerce\"><button>i</button><a></td><td><button onclick='newMag("+i+")'>New mag</button></td></tr>");
		    	res = res.concat(data.tags[i].location_lat,",", data.tags[i].location_lng,",", data.tags[i].enseigne,",");
		    }
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
	alert(i);
	$.ajax({
	    dataType: "json",
	    contentType: "application/json",
		url : "http://rpoch.istic.univ-rennes1.fr/api/",
		data : {"req":"yolo","format":"json","coord_dep_lat":coord_dep_lat,"coord_dep_lng":coord_dep_lng,"coord_arr_lat":coord_arr_lat,"coord_arr_lng":coord_arr_lng,"dist_max":dist_max,"commerces":"[\"Boulangerie\"]"},
		type : "GET",
		async: false,
		success: function(data) {
			$(".mag"+i).html("");
			$(".mag"+i).append("<td>"+data.tags[1].enseigne.toLowerCase()+"</td><td>test</td><td><button onclick='newMag("+i+")'>New mag</button></td>");
		}
	})
}