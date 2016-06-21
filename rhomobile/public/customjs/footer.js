var prevRecherche = "";
var timer;
var filename;
function updateFooter()
{
	filename = $("#path:first").attr('name');
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
			$("#searchResult").hide(300, function(){
				$(this).remove();
			});
			$("#searchbar").hide(300);
			$('a[name="btn4"] img').attr("src", "/public/images/svg/langue.svg");
			$('a[name="params"] img').attr("src", "/public/images/svg/parametres.svg");
			$('a[name="search"] img').attr("src", "/public/images/svg/search.svg");
			
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
		$("body").append("<div id='searchbar'><span style='top:5px'><form action='#' method='post'><input type='text' value='Rechercher un lieu' /></form></span></div>");
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
					if($(this).val() == "Rechercher un lieu") $(this).val("");
			});
			
			
			//Affichage des resultats s'il y en a
			$("#searchbar form input[type='text']").on("input", function(){
				clearInterval(timer);
				timer = setInterval('onChangeSearch()', 300);	
					
			});
				
			//Annuler la validation du formulaire
			$("#searchbar form").on("submit", function(){	
					return false;
			});
			
			
		}
		else
		{
			if(!grisVisible)
			{
				$("#grisement").hide();
			}
			$('#searchResult').remove();
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
				$('#searchResult').remove();
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
				$('#searchResult').remove();
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
			$('#searchResult').remove();
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
			$('#searchResult').remove();
			$('a[name="btn4"] img').attr("src", "/public/images/svg/langue.svg");
		}
	});	
	
}

function getCurrentState(page)
{
	var filename = Rho.RhoFile.join(Rho.Application.appBundleFolder, 'firsttime.txt'); // build the path
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
				toShow += "<tr style='opacity:0'>"
				+"<td colspan='3' onclick='showDescription(\""+ret.magasins[i].id+"\")' >"+ret.magasins[i].enseigne+"</td>"
				+"<td style='text-align:center' onclick='showDescription(\""+ret.magasins[i].id+"\")'><img width='20' height='20' src='/public/images/svg/oeil.svg' /></td>";
				
				if($("img.ImgAjoutMag").size() != 0)
				{
					toShow += "<td style='text-align:center' onclick='addMagasinParcours(\""+ret.magasins[i].id+"\", "+ i +")' ><img width='20' height='20' src='/public/images/add.png' /></td>";
				}
				toShow += "</tr>";
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
		if(request != "")
		{
			var start = new Date().getTime();
		
			//Affichage dynamique des resultats
			var base = 100;
			var temps = 300;
			request = request.replace(/  +/g, ' ');
			returnResults(request);
			
			$("#searchResult table tr").each(function(i){
				
				$(this).delay(base + (i* temps)).animate({"opacity":"1"}, 500);
				
			});
			
			
			var end = new Date().getTime();
			var time = end - start;
			console.log('Execution time: ' + time);
		}
			
	}
	
	prevRecherche = currentSearch;
	
}

function addMagasinParcours(id, i)
{
	
	if(sessionStorage.length < 8)
	{
	
		var ret = api.getCommDetail(id);
		var tab = [];
		try
		{
			var sscat = findSSCatString(ret.commerce.tag0);
			tab.push(ret.commerce.tag0);
			tab.push(sscat);
			tab.push(id);
			tab.push(ret.commerce.enseigne.toLowerCase());
			tab.push(ret.commerce.location_lat);
			tab.push(ret.commerce.location_lng);
			sessionStorage.setItem(sessionStorage.length, JSON.stringify(tab));
	
			//Si le magasin est bien ajouté, on ajoute une couleur de fond au <td>
			$("#searchResult tr:eq("+i+")").animate({"background-color": "#008b87"}, 1000);
			$("#searchResult tr:eq("+i+")").animate({"color": "white"}, 1000);
			
			refreshFinalParcours();
			
			
		}
		catch(err)
		{
			console.log("Le serveur a du renvoyer null...");
			console.warn("ERREUR: "+err);
		}
	}
	
}


function refreshFinalParcours()
{
	
		$("#example").html("");
		dist_max = getDistMax();
		sessionStorage.removeItem("posRecuperer");
	    for (var i=0 ; i < sessionStorage.length; i++)
	    {
	    	var magasin = JSON.parse(sessionStorage.getItem(i));
	    	var id = magasin[2];
	    	
	    	try
	    	{
	    		$("#example").append("<tr style='opacity:0' class='detailButton'name='"+id+"' ><td class='listeItem' >"+magasin[3].toUpperCase()+"</td><td><img class='ImgBtnInfo' ></img></td><td><img class='ImgBtnRemplacer' onclick='newMag("+i+")'></img></td><td><img class='ImgBtnSupprimer' onclick='supprimerMag("+i+")'></img></td></tr>");
	    		ajoutDansRes();
	    	}
	    	catch(err)
	    	{
	    		console.error("ERREUR : "+err);
	    		break;
	    	}
			   
	    }
	    $('#example tr.detailButton').on('click',function(e){
			sessionStorage.setItem("currentMagasin", $(this).attr('name'));
			afficheSpecificationMagasin();
		});
	    
	    $("tbody tr").each(function(i){
	    	
	    	$(this).delay(i * 300).animate({"opacity":"1"}, 500);

	    });
	    if((sessionStorage.length < 1)){
	    	  $('#carte').hide(0);
	    	  $('#flecheParcours').hide(0); 
	    	  $('#nbmag').show(200);
	    	 }else{
	    	   $('#nbmag').hide(0);
	    	   $('#carte').show(200);
	    	   $('#flecheParcours').show(200);
	    	   
	    	   
	    	 }
}







