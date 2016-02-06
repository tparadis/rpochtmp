$(document).ready(function() {

	//Récupère les parametres de l'URL
	var id = sessionStorage.getItem("currentMagasin");
	
	$.ajax({
		dataType: "json",
		contentType: "application/json",
		url: "http://rpoch.istic.univ-rennes1.fr/api/",
		data: { "req": "spec", "format": "json", "id":id },
		type: "GET",
		async: false,
		success: function(data) {
			//Faire un truc
			var url = "http://rpoch.istic.univ-rennes1.fr/static/images/";
			$("#imageCommerce").append("<img src='"+url+data.commerce.image+"' />")
			$("#descrCommerce #contenu").append("<span class='titre' >\""+data.commerce.enseigne+"\"</span><br/>");
			if(data.commerce.tag0 != null) 
			{
				var tag0 = getTextForIdTag(data.commerce.tag0)
				$("#descrCommerce #contenu").append("<span class='descr'>"+tag0+"</span>");
			}
			if(data.commerce.tag1 != null) 
			{
				var tag1 = getTextForIdTag(data.commerce.tag1)
				$("#descrCommerce #contenu").append("<span class='descr'>, "+tag1+"</span>");
			}
			if(data.commerce.tag2 != null) 
			{
				var tag2 = getTextForIdTag(data.commerce.tag2)
				$("#descrCommerce #contenu").append("<span class='descr'>, "+tag2+"</span>");
			}
			
			$("#descrCommerce #contenu").append("<br/><br/>");
			$("#descrCommerce #contenu").append("<span class='others'>"+data.commerce.street_number+" "+data.commerce.route+"</span><br/>");
			$("#descrCommerce #contenu").append("<span class='others'>Tel. "+data.commerce.phone_num+"</span><br/>");
			
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus + ", " + errorThrown);
		}
	});
	
	

});

function getTextForIdTag(id)
{
	var res = "";
	$.ajax({
		dataType: "json",
		contentType: "application/json",
		url: "http://rpoch.istic.univ-rennes1.fr/api/",
		data: { "req": "sscat", "format": "json", "id":id },
		type: "GET",
		async: false,
		success: function(data) {
			var lang = localStorage.getItem(0);
			
			switch (lang)
			{
				case "fr": 
					res =  data.tag.nom;
					break;
				case "en":
					res =  data.tag.en;
					break;
				case "de":
					res = data.tag.de;
					break;
				case "ko":
					res = data.tag.ko;
					break;
				case "ja":
					res = data.tag.jap;
					break;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus + ", " + errorThrown);
		}
	});
	
	return res;
}

