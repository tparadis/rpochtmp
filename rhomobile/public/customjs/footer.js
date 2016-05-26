var prevRecherche = "";
var timer;
function updateFooter()
{
	var filename = $("#path:first").attr('name');
	if (filename == "sscat") {
		$("#footer a[name='perso'] img").attr('src', '/public/images/svg/parcoursHover.svg');
	}

	if (filename == "parcours_predef") {
		$("#footer a[name='predef'] img").attr('src', '/public/images/svg/mapHover.svg');
		$("#footer a[name='perso']").on("click", function(){
			sessionStorage.clear();
		});
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
	});
	
	var box = $("body").find(".languageSelect");
	$(box).css("bottom", $("body").find("div[id='footer']").height() +"px");

	//Truc pour ne pas supprimer le Grisement si le tuto était active
	
	var pageName = location.pathname.split('/').slice(-1)[0];
	var grisVisible = getCurrentState(pageName);
	if(grisVisible)
	{
		$("#grisement").show();
	}
	console.log("Gris visible : "+grisVisible);
	
	
	//Ajout d'une barre de recherche si elle n'existe pas deja
	if($("#searchbar").length == 0)
	{
		$("body").append("<div id='searchbar'><span><form action='#' method='post'><input type='text' value='Rechercher un lieu' /></form></span></div>");
	}
	
	$("#searchbar").hide();
	$("#grisement").hide();
	$('a[name="search"]').on("click",function(){
		
		grisVisible = getCurrentState(pageName);
		$('a[name="btn4"] img').attr("src", "/public/images/svg/langue.svg");
		$('a[name="params"] img').attr("src", "/public/images/svg/parametres.svg");
		
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
			$('a[name="search"] img').attr("src", "/public/images/svg/searchHover.svg");
			
			//affichage de la box de la loupe pour les suggestions de magasins
			$("body").append("<div id='searchResult'></div>");
			$("#searchResult").html("<table><tr><td>Les magasins s'afficheront ici</td></tr></table>");
			//Ajout de condition si c'est la premiere fois qu'il clique
			$("#searchbar form input[type='text']").on("focus",function(){
					$(this).val("");
			});
			
			
			//Affichage des resultats s'il y en a
			$("#searchbar form input[type='text']").on("input", function(){
				clearInterval(timer);
				timer = setInterval('onChangeSearch()', 500);	
					
			});
				
		}
		else
		{
			if(!grisVisible)
			{
				$("#grisement").hide();
			}
			$('a[name="search"] img').attr("src", "/public/images/svg/search.svg");
			$("#searchbar").hide();
			afficheLoupe = false;
		}
		
		
	});
	
	
	//Le bouton des parametres
	$('a[name="params"]').on("click",function(){
		
		grisVisible = getCurrentState(pageName);
		$('a[name="search"] img').attr("src", "/public/images/svg/search.svg");
		$('a[name="btn4"] img').attr("src", "/public/images/svg/langue.svg");
		
			if(afficheParams == false)
			{
				$("#searchbar").hide();
				$("#parametres").show();
				$("#grisement").show();
				afficheParams = true;
				afficheTrad = false;
				afficheLoupe = false;
				$(".languageSelect").hide();
				$('a[name="params"] img').attr("src", "/public/images/svg/parametresHover.svg");
			}
			else
			{
			
				if(!grisVisible)
				{
					$("#grisement").hide();
				}
				
				$("#searchbar").hide();
				$("#parametres").hide();
				afficheParams = false;
				$('a[name="params"] img').attr("src", "/public/images/svg/parametres.svg");
			}
			
			
	});
	
	//Le bouton de traduction
	$('a[name="btn4"]').on('click',function(){
		
		grisVisible = getCurrentState(pageName);
		$('a[name="search"] img').attr("src", "/public/images/svg/search.svg");
		$('a[name="params"] img').attr("src", "/public/images/svg/parametres.svg");
		
		if(afficheTrad == false)
		{	
			$("#grisement").show();
			$(".languageSelect").show();
			afficheTrad = true;
			$("#searchbar").hide();
			$("#parametres").hide();
			afficheLoupe = false;
			afficheParams = false;
			$('a[name="btn4"] img').attr("src", "/public/images/svg/langueHover.svg");
			
		}
		else
		{
			afficheTrad = false;
			if(!grisVisible)
			{
				$("#grisement").hide();
			}
			$(".languageSelect").hide();
			$('a[name="btn4"] img').attr("src", "/public/images/svg/langue.svg");
		}
	});	
	
}

function getCurrentState(page)
{
	var filename = Rho.RhoFile.join(Rho.Application.publicFolder, 'firsttime.txt'); // build the path
	var contents = JSON.parse(Rho.RhoFile.read(filename)); // read the file into a variable
	switch(page)
	{
		case "index.erb" :
			if(contents[0] == 1) return true;
			if(contents[0] == 0) return false;
			break;
			
		case "parcours_predef" :
			if(contents[1] == 1) return true;
			if(contents[1] == 0) return false;
			break;
			
		case "sous_categories" :
			if(contents[2] == 1) return true;
			if(contents[2] == 0) return false;
			break;
		
		
	}
}


window.onload = afficheTout();
$(document).ready(updateFooter);

function showDescription(id)
{
	sessionStorage.removeItem("currentMagasin");
	sessionStorage.setItem("currentMagasin", id);
	afficheSpecificationMagasin();
}

function returnResults(request)
{
	//Si la requete est vide
	if(request != "")
	{
		request = request.replace('\'', ' ');
		var ret = api.getSuggestion(request);
		var i = 0;
		var toShow = "<table>";
		
		//Reinit l'affichage
		$("#searchResult").html("");
		
		if(ret.size > 0)
		{
			
			for(i = 0; i < ret.size; i++)
			{
				toShow += "<tr style='opacity:0' onclick='showDescription(\""+ret.magasins[i].id+"\")'><td colspan='3'>"+ret.magasins[i].enseigne+"</td><td style='text-align:center'><img width='20' height='20' src='/public/images/svg/oeil.svg' /></td></tr>";
			}
			
		}
		else
		{
			toShow += "<td>Aucun resultats.</td>"
		}
		
		toShow += "</table>";
		$("#searchResult").append(toShow);
		
	
		}
}

function onChangeSearch()
{
	var currentSearch = $("#searchbar form input[type='text']").val(); 
	if(prevRecherche == currentSearch)
	{
		clearInterval(timer);
		var request = $("#searchbar form input[type='text']").val();
		var start = new Date().getTime();
		
			//Affichage dynamique des resultats
			var base = 100;
			var temps = 300;
			
			returnResults(request);
			
			$("#searchResult table tr").each(function(i){
				
				$(this).delay(base + (i* temps)).animate({"opacity":"1"}, 500);
				
			});
			
			
			var end = new Date().getTime();
			var time = end - start;
			console.log('Execution time: ' + time);
			
	}
	
	prevRecherche = currentSearch;
	
}












