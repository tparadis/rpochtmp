$(document).ready(function() {

	//Récupère les parametres de l'URL
	var id = sessionStorage.getItem("currentMagasin");
	sessionStorage.removeItem("currentMagasin");
	
	var data = api.getCommDetail(id);
	
	//Faire un truc
	var url = "http://rpoch.istic.univ-rennes1.fr/static/images/";
	$("#imageCommerce").append("<img src='"+url+data.commerce.image+"' />")
	$("#descrCommerce #contenu").append("<span class='titre' >\""+data.commerce.enseigne+"\"</span><br/>");
	afficheTags(data.tag0, data.tag1, data.tag2);
		
	$("#descrCommerce #contenu").append("<br/><br/>");
	$("#descrCommerce #contenu").append("<span class='others'>"+data.commerce.street_number+" "+data.commerce.route+"</span><br/>");
	$("#descrCommerce #contenu").append("<span class='others'>Tel. "+data.commerce.phone_num+"</span><br/>");
	
});

function afficheTags(tag0, tag1, tag2)
{
	var t0 = "";
	var t1 = "";
	var t2 = ""; 
	var temp;
	
	if(tag0 != null && tag0 >= 0)
	{
		temp = JSON.parse(localStorage["sscat"+tag0]);
		t0 = temp[1];
	}
	
	if(tag1 != null && tag1 >= 0)
	{
		temp = JSON.parse(localStorage["sscat"+tag1]);
		t1 = temp[1];
	}
	if(tag2 != null && tag2 >= 0)
	{
		temp = JSON.parse(localStorage["sscat"+tag2]);
		t2 = temp[1];
	}
	
	$("#descrCommerce #contenu").append("<span class='descr'>"+t0+t1+t2+"</span>");
	
}