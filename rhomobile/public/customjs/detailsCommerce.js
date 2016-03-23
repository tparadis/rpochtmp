
//La magasin appelable de partout. Elle va permettre d'afficher un magasin
//sans avoir à rediriger l'utilisateur en le forçant à refaire une requete GOOGLE API
//Sur le long terme on passe d'environ 10 requetes api google à ... une !
var id;

var form_validate = {
	  required: function (value) {
	    return value.trim().length ? true : false;
	  }
};

$(document).ready(function(e){
	
	checkIfImplemented();
	$("#pageSpec").hide(0);
	
});

function checkIfImplemented()
{
	if($("#pageSpec").length == 0)
	{
		//S'il n'y a pas les balises pour le rendu de notre page, on l'ajoute directement.
		$("body").append("<div id='pageSpec'><div id='imageCommerce'></div><div id='descrCommerce'><div id='contenu'></div><br/><br/><img id='back' src='/public/images/backButton2.png' /><img id='contact-us' src='/public/images/signaler.png' /></div></div>");
		$("#contact-us").css({"width" : "50px", "margin-left": "70%"});
		$("#contact-us").on("click", function (event) {
		    event.stopPropagation()

		    function onSubmit(event) {
		      event.preventDefault();
		      form = $(this);

		      var subject = form.find("#contact-topic").val(),
		      body = form.find("#contact-body").val();

		      form.find("input, button").blur();
		      if (!form_validate.required(subject)) {
		        $("#contact-form .error").removeClass("hidden").text("Please select an topic.");
		        form.find("select").focus();
		        return;
		      }

		      $.dialog.close("contact-form");
		      var resultats = api.signaler(id, subject, body);
		 	  if(resultats == "ok"){
		 		 $.dialog.alert("Thank you for contacting us.\nWe will get back to you soon.\n\nThis alert will automatically close in 2 seconds.").autoClose(2000);
		 	  }
		    }

		    function open(dialog) {
		      dialog.find("form").on("submit", onSubmit);
		    }

		    $.dialog.open("contact-form").onOpen(open);
		  });
	}
}

function afficheSpecificationMagasin()
{
	//Récupère les parametres de l'URL
	
	id = sessionStorage.getItem("currentMagasin");
	sessionStorage.removeItem("currentMagasin");
	
	//On cache la page active 
	$(".ui-page-active").hide();
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
	
	$("#back").on("click",function(e){
			$("#pageSpec").hide(400);
			$("#boutonsParcours").show(200);
			//On reaffiche la page active
			$(".ui-page-active").show();			
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
//utilisé dans parcours etudiant
//A modifier apres pour rendre le code plus lisible.
function findCatSubCat(id){
	    var data = api.getCommDetail(id);
	     var nbSS = parseInt(localStorage.getItem("nbSsCat"));
	     var i = 0;
	     var tmp="";
	     while(i < nbSS)
	     {
	         tmp = JSON.parse(localStorage.getItem("sscat"+i));
	         if(data.commerce.tag0 == tmp[0])
	         {    return {
	             "cat":tmp[2],
	             "subcat":tmp[0]}; 
	         }
	         i++;
	     }
	     return {
	         "cat":"",
	         "subcat":""}; 
	         
}
	  











