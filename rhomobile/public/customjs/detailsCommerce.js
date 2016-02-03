$(document).ready(function() {

	$.ajax({
		dataType: "json",
		contentType: "application/json",
		url: "http://rpoch.istic.univ-rennes1.fr/api/",
		data: { "req": "spec", "format": "json", "id":"a24614d0-da2d-4916-a29f-c2fabc8a1264" },
		type: "GET",
		async: false,
		success: function(data) {
			//Faire un truc
			var url = "http://rpoch.istic.univ-rennes1.fr/static/images/";
			$("#imageCommerce").append("<img src='"+url+data.commerce.image+"' />")
			$("#descrCommerce").append("<span class='titre'>"+data.commerce.enseigne+"</span><br/>");
			$("#descrCommerce").append("<span class='descr'>"+(data.commerce.label_ape).toLowerCase()+"</span><br/>");
			$("#descrCommerce").append("<br/><br/>");
			$("#descrCommerce").append("<span class='others'>"+data.commerce.street_number+" "+data.commerce.route+"</span><br/>");
			$("#descrCommerce").append("<span class='others'>Tel. "+data.commerce.phone_num+"</span><br/>");
			
			if(data.commerce.tag0 != null && data.commerce.tag1 != null && data.commerce.tag2 != 0)
			{
				$("#descrCommerce").append("<span class='others'>"+data.commerce.tag0+" "+data.commerce.tag1+" "+data.commerce.tag2+"</span><br/>");
			}
			else
			{
				$("#descrCommerce").append("<span class='others'>(magasin non class&eacute;)</span><br/>");
			}
			$("#descrCommerce").append("<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>");
			
			
			//Action
			$("#imageCommerce").find('img').delay(300).animate({"opacity":"1"},700);
			$("#descrCommerce span.titre").delay(300).animate({"margin-left":"0px","opacity":"1"},1000);
			$("#descrCommerce span.descr").delay(700).animate({"margin-left":"0px","opacity":"1"},1000);
			$("#descrCommerce span.others").delay(900).animate({"margin-left":"0px","opacity":"1"},1000);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus + ", " + errorThrown);
		}
	});
	
	

});
