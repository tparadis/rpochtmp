
//La magasin appelable de partout. Elle va permettre d'afficher un magasin
//sans avoir � rediriger l'utilisateur en le for�ant � refaire une requete GOOGLE API
//Sur le long terme on passe d'environ 10 requetes api google � ... une !

$(document).ready(function(e){
	
	checkIfImplemented();
	$("#pageSpec").hide(0);
	
});

function checkIfImplemented()
{
	if($("#pageSpec").length == 0)
	{
		//S'il n'y a pas les balises pour le rendu de notre page, on l'ajoute directement.
		$("body").append("<div id='pageSpec'><div id='imageCommerce'></div><div id='descrCommerce'><div id='contenu'></div><br/><br/><img src='/public/images/backButton2.png' /></div></div>");
	}
}

function afficheSpecificationMagasin()
{
	//R�cup�re les parametres de l'URL
	
	var id = sessionStorage.getItem("currentMagasin");
	sessionStorage.removeItem("currentMagasin");
	
	
	
	//On vire les anciens r�sultats:
	$("#imageCommerce").html("");
	$("#descrCommerce #contenu").html("");
	
	//On check que les boutons "boutonsParcours" soient bien jart�s
	$("#boutonsParcours").hide();
	
	var data = api.getCommDetail(id);
	
	//Faire un truc
	var url = "http://rpoch.istic.univ-rennes1.fr/static/images/";
	$("#imageCommerce").append("<img src='"+url+data.commerce.image+"' />")
	$("#descrCommerce #contenu").append("<span class='titre' >\""+data.commerce.enseigne+"\"</span><br/>");
	afficheTags(data.tag0, data.tag1, data.tag2);
		
	$("#descrCommerce #contenu").append("<br/><br/>");
	$("#descrCommerce #contenu").append("<span class='others'>"+data.commerce.street_number+" "+data.commerce.route+"</span><br/>");
	$("#descrCommerce #contenu").append("<span class='others'>Tel. "+data.commerce.phone_num+"</span><br/>");
	
	$("#pageSpec").show(200);  
	
	$("#descrCommerce").find("img").on("click",function(e){
			$("#pageSpec").hide(400);
			$("#boutonsParcours").show(200);
	});
}


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