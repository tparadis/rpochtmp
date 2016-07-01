function afficheParcours(){
	
	
	var data = api.getAllPredef();
	var i =0;
	var lang = localStorage["0"];
	var txt = "";
	var coteElem = 0; //La dimension d'un coté du carré elem

	
	var moduloDataSize = 0;
	
	if(data.size % 2 == 1){
		moduloDataSize = 1;
	}

	//On va récupérer et afficher dynamiquement les parcours sur la page
	
		var newTop = $("#header").height() + $("#topPredef").height();
		$("#containerPredef").css("top", newTop+"px");
		coteElem = ($("#page").width()) /2 ;
		$("#containerPredef").css({"top":"250px","height":"auto"});
		//$("#page").css("width", $("#page").width() + 16 + "px");
		while(i < data.size)
		{
			switch(lang){
				case "fr": txt = data.parcourspredefs[i].fr; break;
				case "en": txt = data.parcourspredefs[i].en; break;
				case "de": txt = data.parcourspredefs[i].de; break;
				case "esp": txt = data.parcourspredefs[i].esp; break;
			}
			$("#containerPredef").append(
			'<div class="elem">'+
				'<a href="/app/Description/requette_description?type_parcours='+data.parcourspredefs[i].name+'">'+
					'<div class="container">'+
						'<img src="http://rpoch.istic.univ-rennes1.fr/static/images/icons/'+data.parcourspredefs[i].image+'" alt="image" />'+
						'<span>Rennes</span><br/>'+
						'<div class="nom">'+txt+'</div>'+
						'<div class="bordure"></div>'+
					'</div>'+
					
				'</a>'+
			'</div>');
			//$('#parcours').append('<li><a href="/app/Description/requette_description?type_parcours='+data.parcourspredefs[i].name+'" ><img src="http://rpoch.istic.univ-rennes1.fr/static/images/'+data.parcourspredefs[i].image+'" alt="image" /></a><a href="/app/Description/requette_description?type_parcours='+data.parcourspredefs[i].name+'" ><span class="lien">'+txt+'</span></li>');
			i++;
			$("#containerPredef .elem:last").css("height", coteElem+"px");
			//Affiche de la bordure en fonction du modulo
			if(i % 2 == 1) //impaire
			{
				$("#containerPredef .elem:last").append("<div class='bordureDroite'></div>");
			}
			
			if(data.size - i >1)
			{
				$("#containerPredef .elem:last").append("<div class='bordureBottom'></div>");
			}
			
	
		}
}
$(document).ready(function(){
	afficheParcours();
});



