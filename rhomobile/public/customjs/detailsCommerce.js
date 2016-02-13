
//La magasin appelable de partout. Elle va permettre d'afficher un magasin
//sans avoir à rediriger l'utilisateur en le forçant à refaire une requete GOOGLE API
//Sur le long terme on passe d'environ 10 requetes api google à ... une !

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
	//Récupère les parametres de l'URL
	
	var id = sessionStorage.getItem("currentMagasin");
	sessionStorage.removeItem("currentMagasin");
	
	
	
	//On vire les anciens résultats:
	$("#imageCommerce").html("");
	$("#descrCommerce #contenu").html("");
	
	//On check que les boutons "boutonsParcours" soient bien jartés
	$("#boutonsParcours").hide();
	
	var data = api.getCommDetail(id);
	
	//Faire un truc
	var url = "http://rpoch.istic.univ-rennes1.fr/static/images/";
	$("#imageCommerce").append("<img src='"+url+data.commerce.image+"' />")
	$("#descrCommerce #contenu").append("<span class='titre' >\""+data.commerce.enseigne+"\"</span><br/>");
	afficheTags(data.commerce.tag0, data.commerce.tag1, data.commerce.tag2);
	
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
		t0 = findSSCat(tag0,0);
	}
	
	if(tag1 != null && tag1 >= 0)
	{
		t1 = findSSCat(tag1,1);
	}
	if(tag2 != null && tag2 >= 0)
	{
		t2 = findSSCat(tag2,2);
	}
	
	
	$("#descrCommerce #contenu").append("<span class='descr'>"+t0+t1+t2+"</span>");
	
}

//Converti un id de tag en nom !
function findSSCat(id,t){
	
	var nbSS = parseInt(localStorage.getItem("nbSsCat"));
	var i = 0;
	var tmp;
	while(i < nbSS)
	{
		tmp = JSON.parse(localStorage.getItem("sscat"+i));
		if(tmp[0] == id)
		{
			if(t >0)
				tmp[1] = ", "+tmp[1];
			return tmp[1];
		}
		i++;
	}
	return "";
	
	
}










