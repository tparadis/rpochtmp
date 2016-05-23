
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
	$("body").append("<div id='loaderDescr'><img src='/public/images/loading.gif' /></div>");
	
	$("body").append("<div id='pageSpec'>"
		+ "<div id='close'></div>"
		+ "<div id='topSpec'><div id='cadreImg'><img src='' /></div><div id='sscat'></div></div>"
		+ "<div id='midSpec'></div>"
		+ "<div id='botSpec'></div>"
		+ "</div>");
	$("#loaderDescr").hide();
	$("#contact-us").css({"width" : "50px", "margin-left": "70%"});
		
	}
}

function afficheSpecificationMagasin()
{
	
	//Récupère les parametres de l'URL
	$("#loaderDescr").show(400, function(){
		id = sessionStorage.getItem("currentMagasin");
		sessionStorage.removeItem("currentMagasin");
		
		//On cache la page active 
		$(".ui-page-active").hide();
		//On vire les anciens résultats:
		$("#cadreImg").html("");
		$("#midSpec").html("");
		$("#botSpec").html("");
		$("#sscat").html("");
		
		//On check que les boutons "boutonsParcours" soient bien jartés
		$("#boutonsParcours").hide();
		var data = api.getCommDetail(id);
		
		//Faire un truc
		var url = "http://rpoch.istic.univ-rennes1.fr/static/images/";
		
		//Si l'image est à null
		try
		{
			$("#cadreImg").append("<img src='"+url+data.commerce.image+"' />");
			
		}
		catch(err)
		{
			$("#cadreImg").append("<img src='"+url+"noimage.jpg' />");
			console.log("Erreur: "+err);
		}
		
		//Si le tag0 n'est pas renseigné
		var icon = "";
		try
		{
			icon = findSSCat(data.commerce.tag0,0) + "_256.png";
		}
		catch(err)
		{
			icon = "cat13_256.png";
			console.log("Erreur: "+err);
		}
		
		//Si le texte de description n'est pas renseigné
		var descr = "";
		try
		{
			descr = data.commerce.description;
			if(descr == null || descr == "" || descr == "null" || descr == " ")
			{
				descr = "(Aucune description disponible)";
				console.log("champ de description non renseigné");
			}
		}
		catch(err)
		{
			descr = "(Aucune description disponible)";
			console.log("Erreur: "+err);
		}
		
		$("#sscat").append("<img src='/public/images/"+icon+"' />");
		
		$("#midSpec").append("<div class='titre' >"+convertirEnLisible(data.commerce.enseigne)+"</div>");
		$("#midSpec").append("<div class='addresse' >"+(data.commerce.street_number+" "+data.commerce.route).toUpperCase()+"</div>");
		$("#midSpec").append("<div class='bordureBot'></div>");
		$("#midSpec").append("<div class='description'>"+descr+"</div>");
		$("#botSpec").append("<div class='horaires' style='text-shadow:none;'>DU LUNDI AU VENDREDI<br/>8.30 - 15.30</div>");
		$("#botSpec").append("<div class='bordureBot'></div>");
		$("#botSpec").append("<div class='telephone'><img src='/public/images/svg/phone.svg' /> <span><a style='color:white;text-shadow:none;' title='Call' href='tel:"+data.commerce.phone_num+"'>"+data.commerce.phone_num+"</a></span></div>");
		$("#botSpec").append("<div class='bordureBot'></div>");
		$("#botSpec").append("<div class='website' style='text-shadow:none;'>www.nowhere.net</div>");
		$("#botSpec").append("<div class='socialNetworks'></div>");
		
		//Ajouter dynamiquement les affiliations aux liens
		//des réseaux sociaux ci-dessous
		//Modifier le comportement des boutons en fonction de l'action voulue !
		
		
		if(data.commerce.facebook != null){
			if(data.commerce.facebook != "")	
			$(".socialNetworks").append("<a onclick='Rho.System.openUrl(\""+data.commerce.facebook+"\")'><img src='/public/images/svg/fb.svg'/></a>");
			
		}
		if(data.commerce.instagram != null){
			if(data.commerce.instagram != "")
			$(".socialNetworks").append("<a href='Rho.System.openUrl(\""+data.commerce.instagram+"\")'> <img src='/public/images/svg/instagram.svg'/></a>");
		}
		if(data.commerce.email != null){
			if(data.commerce.email != "")
			$(".socialNetworks").append("<a href='mailto:'"+data.commerce.email+"> <img src='/public/images/svg/email.svg'/></a>");
		}
		if(data.commerce.website != null){
			if(data.commerce.website != "")
			$(".socialNetworks").append("<a href='Rho.System.openUrl(\""+data.commerce.website+"\")'> <img src='/public/images/svg/oeil.svg'/></a>");
		}
		
		
		
		$(".socialNetworks").append("<img id='contact-us' src='/public/images/svg/warning.svg' />");
		
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
		
		//Ajustement pour le bas de la page
		//$("#pageSpec").css("height", $("#pageSpec").height() + 50 + "px");
		$("#pageSpec").show(0);  
		$("#loaderDescr").hide(300);
		
		$("#close").on("click",function(e){
				$("#pageSpec").hide(0);
				$("#boutonsParcours").show(0);
				//On reaffiche la page active
				$(".ui-page-active").show();			
		});
		
		
		
		
	});
	
}


//Converti un id de tag en nom  de catégorie (ex: cat7)
function findSSCat(id,t){
	
	var nbSS = parseInt(localStorage.getItem("nbSsCat"));
	var i = 0;
	var tmp;
	while(i < nbSS)
	{
		tmp = JSON.parse(localStorage.getItem("sscat"+i));
		if(tmp[0] == id)
		{

			return "cat"+tmp[2];
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


function convertirEnLisible(texte)
{
	var words = texte.split(" ")
	var i = 0;
	var res = "";
	for(i = 0; i < words.length; i++)
	{
		res += words[i].substring(0,1).toUpperCase();
		res += words[i].substring(1).toLowerCase();
		res += " ";
	}
	
	return res;
	
}
	  
