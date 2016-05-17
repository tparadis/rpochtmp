function updateFooter()
{
	var filename = $("#path:first").attr('name');
	console.log(filename);
	if (filename == "sscat") {
		$("#footer a[name='perso'] img").attr('src', '/public/images/svg/parcoursHover.svg');

	}

	if (filename == "parcours_predef") {
		$("#footer a[name='predef'] img").attr('src', '/public/images/svg/mapHover.svg');

	}

}
function afficheTout()
{
	//Affichage des panneaux du footer
	var nb = $(".languageSelect").length;
	var afficheLoupe = false;
	var afficheTrad = false;
	var afficheParams = false;
	
	$("body").append("<div id='grisement'></div>");
	$('body').append('<div class="languageSelect"></div>');
	$("#grisement").css("height", $("page").height - $("#footer").height() - $("header").height() +"px");
	
	//Menu du rouage
	$("body").append('<div id="parametres">'
	+'<div class="imgTop"></div>'

	+'<div class="item" text="options"></div>'
	+'<div class="item" text="credits"></div>'
	+'</div>');
	
	
	$("#parametres .item").on("click",function(){
		
		switch($(this).attr("text"))
		{
			case "credits" :
				window.location.replace("/app/Credit");
				break;
				
			case "options" :
			window.location.replace("/app/Parametres");
				break;
			
		}
		
	});
	
	
	//Truc pour les langues du languageSelect
	var box = $(".languageSelect");
	var langs = ["fr", "en", "esp", "de"];
	var equiv = ["FRANCAIS", "ENGLISH", "SPANISH", "DEUTSCH"];
	var i = 0;
	var bordure = "";

		for(i = 0; i < langs.length; i++)
		{
			if(i != langs.length -1 )
			{	
				bordure = '<div class="bordureBottom"></div>';
			}
			else
			{
				bordure = "";
			}
			
			box.append('<div class="elem" name="'+langs[i]+'">'+equiv[i] + bordure + '</div>');
			
		}

	//Fin du truc pour les langues
	
	$(".elem").on("click", function(){
		changeLanguage($(this).attr('name'));
	});
	
	$(box).css("bottom", $("body").find("div[id='footer']").height() +"px");
	
	$("#grisement").hide();
	$("#parametres").hide();
	$(".languageSelect").hide();
	$("#grisement").on('click',function(){
			$("#grisement").hide();
			$(".languageSelect").hide();
			afficheLoupe = false;
			afficheTrad = false;
			afficheParams = false;
			$("#parametres").hide();
			$("#searchbar").hide();
			$("a[name='btn4']").css("background-color", "#F6F7F6");
	});
	
	var box = $("body").find(".languageSelect");
	$(box).css("bottom", $("body").find("div[id='footer']").height() +"px");

	//Ajout d'une barre de recherche si elle n'existe pas deja
	if($("#searchbar").length == 0)
	{
		$("body").append("<div id='searchbar'><span><form action='#' method='post'><input type='text' value='Rechercher un lieu' /></form></span></div>");
	}

	$("#searchbar").hide();
	$("#grisement").hide();
	$('a[name="search"]').on("click",function(){
		
		if(afficheLoupe == false)
		{
			$("#searchbar form").html("");
			$("#searchbar form").append("<input type='text' value='Rechercher un lieu' />");
			$("#searchbar").show();
			$("#grisement").show();
			afficheLoupe = true;
			afficheTrad = false;
			afficheParams = false;
			$(".languageSelect").hide();
			$("#parametres").hide();
			$("a[name='btn4']").css("background-color", "#F6F7F6");
			
		}
		else
		{
			
			$("#grisement").hide();
			$("#searchbar").hide();
			afficheLoupe = false;
		}
		
		
	});
	
	//Le bouton des parametres
	$('a[name="params"]').on("click",function(){
			
			if(afficheParams == false)
			{
				$("#searchbar").hide();
				$("#parametres").show();
				$("#grisement").show();
				afficheParams = true;
				afficheTrad = false;
				afficheLoupe = false;
				$(".languageSelect").hide();
				$("a[name='btn4']").css("background-color", "#F6F7F6");
				
			}
			else
			{
				
				$("#grisement").hide();
				$("#searchbar").hide();
				$("#parametres").hide();
				afficheParams = false;
			}
			
			
	});
	
	//Le bouton de traduction
	$('a[name="btn4"]').on('click',function(){
		if(afficheTrad == false)
		{
			
			$("#grisement").show();
			$(".languageSelect").show();
			$("a[name='btn4']").css("background-color", "#008b87");
			afficheTrad = true;
			$("#searchbar").hide();
			$("#parametres").hide();
			afficheLoupe = false;
			afficheParams = false;
		}
		else
		{
			afficheTrad = false;
			$("#grisement").hide();
			$(".languageSelect").hide();
			$("a[name='btn4']").css("background-color", "#F6F7F6");
		}
	});	
	
}

window.onload = afficheTout();
$(document).ready(updateFooter);