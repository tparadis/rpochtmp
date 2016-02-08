$(document).ready(function() {
	refresh();
});

var res = "";

function refresh() {
	$("tbody").html("");
    for (var i=0 ; i < parcours.length; i++)
    {
    	$("tbody").append("<tr><td>"+parcours.getItem(i)+"</td><td>test</td><td>test</td><td><a class='ui-btn' onclick='supprimerSsCat("+i+")'><span class='ui-btn-text'>X</span></a></td></tr>");
    	
    }
}

function supprimerSsCat(numLigne) {
	for(var i=numLigne ; i < parcours.length ; i++) {
		parcours.setItem(i, parcours.getItem(i+1));
	}
	parcours.removeItem(parcours.length-1);
	refresh();
}

function genererParcours(){
	var coord_dep_lat = 48.110003;
	var coord_dep_lng = -1.679201;
	var coord_arr_lat = 48.110003;
	var coord_arr_lng = -1.679201;
	var dist_max = 10;
	var tags = [];
	for (var i = 0 ; i < parcours.length ; i++) {
		tags.push("\""+parcours[i]+"\"");
	}

	$.ajax({
	    dataType: "json",
	    contentType: "application/json",
		url : "http://rpoch.istic.univ-rennes1.fr/api/",
		data : {"req":"yolo","format":"json","coord_dep_lat":coord_dep_lat,"coord_dep_lng":coord_dep_lng,"coord_arr_lat":coord_arr_lat,"coord_arr_lng":coord_arr_lng,"dist_max":dist_max,"commerces":"["+tags+"]"},
		type : "GET",
		async: false,
		success: function(data){
			var i = 0;
			$("tbody").html("");
			for (var i = 1 ; i <= tags.length ; i++)
		    {
		    	$("tbody").append("<tr><td>"+data.tags[i].enseigne.toLowerCase()+"</td><td>test</td><td>test</td><td>test</td></tr>");
		    	res = res.concat(data.tags[i].location_lat,",", data.tags[i].location_lng,",", data.tags[i].enseigne,",");
		    }
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			alert(textStatus +", " +errorThrown);
		}
	});
}

function afficherCarte(){
	$.get('/app/Personalisee/get_callback',{ parcours_perso: res });	
}