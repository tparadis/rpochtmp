$(document).ready(function(e){
	
	var data = api.getAllPredef();
	var i =0;
	var lang = localStorage["0"];
	var txt = "";
	//On va récupérer et afficher dynamiquement les parcours sur la page
	
	while(i < data.size)
	{
		switch(lang){
			case "fr": txt = data.parcourspredefs[i].fr; break;
			case "en": txt = data.parcourspredefs[i].en; break;
			case "de": txt = data.parcourspredefs[i].de; break;
			case "esp": txt = data.parcourspredefs[i].esp; break;
			case "ko": txt = data.parcourspredefs[i].ko; break;
			case "jap": txt = data.parcourspredefs[i].jap; break;
		}
		$('ul').append('<li><a href="/app/ParcoursPredef/requette_etudiant?type_parcours='+data.parcourspredefs[i].name+'" ><img src="http://rpoch.istic.univ-rennes1.fr/static/images/'+data.parcourspredefs[i].image+'" alt="image" /></a><a href="/app/ParcoursPredef/requette_etudiant?type_parcours='+data.parcourspredefs[i].name+'" ><span class="lien">'+txt+'</span></li>');
		
		
		i++;
	}
	
});