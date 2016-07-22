/*
 * appelle les méthodes relatives a la gestion de parcours personnalisé
 * Creation / changer un magasin / supprimer un magasin du parcours
 * gère l'affichage de la liste de magasin pour la page finalParcours.erb 
 */
var dist_max = 1000;
var res ="";

$(document).ready(function() {
	refresh();
});
//affiche la liste des magasins et les boutons d'affichage de details, de remplacement et de suppresion
//si la liste ne contient pas de magasin on cache le bouton pour acceder carte 
function refresh() {
	$("#example tbody").html("");
	dist_max = getDistMax();
	sessionStorage.removeItem("posRecuperer");
	sessionStorage.removeItem("currentMagasin");
	var prob = true;
    for (var i = 0 ; i < sessionStorage.length; i++)
    {
    	var magasin = JSON.parse(sessionStorage.getItem(i));
    	if(magasin.length > 4)
    	{
	    	var id = magasin[2];
	    	
	    	try
	    	{
	    		$("#example tbody").append("<tr style='opacity:0' class='detailButton'name='"+id+"' ><td class='listeItem' >"+magasin[3].toUpperCase()+"</td><td><img class='ImgBtnInfo' ></img></td><td><img class='ImgBtnRemplacer' onclick='newMag("+i+")'></img></td><td><img class='ImgBtnSupprimer' onclick='supprimerMag("+i+")'></img></td></tr>");
	    		ajoutDansRes();
	    		prob = false;
 	    	}
	    	catch(err)
	    	{
	    		console.error("ERREUR : "+err);
	    		$("#example tbody").append("<tr><td>Aucun parcours disponible pour votre demande...<br><a href='/app/SousCategories/sous_categories' onclick='sessionStorage.clear();'>Recommencer</a></td></tr>");
	    		prob = true; 
	    		break;
	    	}
    	}else{
    		$("#example tbody").append("<tr><td>Aucun parcours disponible pour votre demande...<br><a href='/app/SousCategories/sous_categories' onclick='sessionStorage.clear();'>Recommencer</a></td></tr>");
    		prob = true; 
    		break;
    	}
    }
    
    
    $("#example tbody tr").each(function(i){
    	
    	$(this).delay(i * 300).animate({"opacity":"1"}, 500);

    });
    
    $('#example tbody tr.detailButton').on('click',function(e){
		sessionStorage.setItem("currentMagasin", $(this).attr('name'));
		afficheSpecificationMagasin();
	});
    if(prob){
    	  $('#carte').hide(0);
    	  $('#flecheParcours').hide(0);
    	 
    }
    if((sessionStorage.length > 1)){
		  $('#nbmag').hide(0);
	  }
}

//supprime un magasin et reaffiche la liste des commerces 
function supprimerMag(numLigne) {
	for(var i=numLigne ; i < sessionStorage.length ; i++) {
		sessionStorage.setItem(i, sessionStorage.getItem(i+1));
	}
	sessionStorage.removeItem(sessionStorage.length-1);
	refresh();
}

//genere le parcours avec les sous-categories dans la session storage et stock les magasins dans la session storage
//un magasin déjà present dans la session storage ne sera pas changé
function genererParcours(){
	var commerces = [];
	var tags = [];
	var idtags = [];
	for (var i = 0 ; i < sessionStorage.length ; i++) {
		var mag = JSON.parse(sessionStorage.getItem(i));
		if(mag.length == 5)
		{
			commerces.push(mag[0]);
			tags.push(mag[4]);
			console.log(mag[4]);
			idtags.push(i);
			var data =	api.statSSCat(mag[0]);
			var dataa = api.statCat(mag[2]);
		}
	}

	var coord_dep_lat = localStorage.getItem("userlat");
	var coord_dep_lng = localStorage.getItem("userlng");
	
	console.log("lat = "+coord_dep_lat+", long = "+coord_dep_lng);
	
	var coord_arr_lat = localStorage.getItem("userlat");
	var coord_arr_lng = localStorage.getItem("userlng");
	dist_max = getDistMax();
	
	var data = api.genParcours2(coord_dep_lat, coord_dep_lng, coord_arr_lat, coord_arr_lng, dist_max, commerces,tags);
	var data2 = api.genParcours(coord_dep_lat, coord_dep_lng, coord_arr_lat, coord_arr_lng, dist_max, commerces);
	
		res = "";
		$("tbody").html("");
		if (data.tags.length > 0){
			
		
		for (var i = 0 ; i < tags.length ; i++)
	    {
	    	
	    	var tagCourant
			//si genParcours2 n'a rien renvoyé pour un magasin  on prend celui de genParcours
	    	if(data.tags[i] != null){
	    		 tagCourant= data.tags[i];
	    	}else{
	    		tagCourant= data2.tags[i];
	    	}
	    	//On ajoute la valeur id  de l'enseigne dans la sessionStorage
	    	var elem = sessionStorage.getItem(idtags[i]);
	    	elem = JSON.parse(elem);

		    	var id = tagCourant.id;
		    	var tmp = elem.pop();
		    	elem.pop();
		    	elem[2] = id;
		    	
		    	elem.push(tagCourant.enseigne.toLowerCase());
		    	elem.push(tagCourant.location_lat);
		    	elem.push(tagCourant.location_lng);
		    	elem.push(tmp)
		    	sessionStorage.setItem(idtags[i], JSON.stringify(elem));
		    	
	    	}
	    }
	    window.location.replace("/app/FinalParcours/final_parcours");	    
	 }

//on redirige vers la carte
function afficherParcours() {
	   $.get('/app/Personalisee/get_callback',{ parcours_perso: res });
}

//remplace un magasin
function newMag(i) {
	var elem = JSON.parse(sessionStorage.getItem(i));
	var tag = elem[6];
	var uuid = elem[2];
	var data = api.getAleatoireR(tag,uuid)
	try
	{
		var id = data.magasin.id;
		elem[2] = id;
		elem[3] = data.magasin.enseigne.toLowerCase();
		elem[4] = data.magasin.location_lat;
		elem[5] = da.ta.magasin.location_lng;
		sessionStorage.setItem(i, JSON.stringify(elem));
	
	}
	catch(err)
	{
		console.log("Le serveur a du renvoyer null...");
		console.warn("ERREUR: "+err);
	}
	refresh();


}


function ajoutDansRes() {
	for (var i = 0 ; i < sessionStorage.length ; i++) {
		var magasin = JSON.parse(sessionStorage.getItem(i));
		res=res.concat(magasin[4],",",magasin[5],",",magasin[3],",");
	}
}