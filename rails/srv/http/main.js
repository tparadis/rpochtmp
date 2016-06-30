$(window).on("load", function(){
	
	//Affichage de l'image de fond.
	$("#container1").animate({"opacity":"1"}, 1000);

	//Animation d'entree du panneau gauche Rennes en Poche
	$("#boxGauche").delay(1500).animate({"opacity":"1", "margin-left":"0px"}, 1000);
	$("#boxGauche #btnZone").delay(3000).animate({"opacity":"1", "margin-left":"-210px"}, 1000);

});

$(document).ready(function(){
	
	var menuAffiche = false;
	var premierAffichage = true;
	

	$("#menuTop").on("mouseover",function(){
	
		$(this).stop().animate({"margin-left": "10px"}, 200);
		
	});	
	$("#menuTop").on("mouseleave",function(){
	
		$(this).stop().animate({"margin-left": "0px"}, 200);
		
	});

	//Action sur le second bouton Actualites
	$("#BTN[name='actus']").on("click", function(){
		
			if(!menuAffiche)
			{	
				$("#actus").stop().animate({"margin-right":"0px"}, 1000);
				$(this).stop().animate({"margin-top":"10px"}, 200);
				menuAffiche = true;	

				//Affichage dynamique des news
				//au premier affichage
				if(premierAffichage)
				{
					var temps = 200; //delai
					var base = 1000;
					$("#actus #element").each(function(i){	
						
						$(this).delay(base + (i * temps)).animate({"opacity":"1"}, 1000);
						
					})
					
					premierAffichage = false;	
				}


			}
			else
			{
				$("#actus").stop().animate({"margin-right":"-520px"}, 1000);
				$(this).stop().animate({"margin-top":"0px"}, 200);
				menuAffiche = false;
				
			}
		
	});

	//Actions sur le bouton de login
	$("#BTN[name='login']").on("click", function(){
		
		window.location.replace("https://rpoch.istic.univ-rennes1.fr/api/bo");	
		
	});

	//Mise à jour de l'affichage des actualités #element
	var newW = 0;
	var newH = 0;

	newW = $("#actus").width() - $("#element #icon").width() - 20;
	newH = $("#element").height() - $("#element #titre").height() - 30;

	$("#element #texte").each(function(){
		
		$(this).css("width", newW+"px");
		
		$(this).css("left", $("#element #icon").width() + 10 +"px");
		
		$(this).css("height", newH + "px");
	})	




	
})






