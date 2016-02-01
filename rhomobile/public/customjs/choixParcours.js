var datar ="";

$(document).ready(function() {
	$.ajax({
		dataType: "json",
		contentType: "application/json",
		url: "http://rpoch.istic.univ-rennes1.fr/api/",
		data: {"req":"allcat","format":"json"},
		type: "GET",
		async: false,
		success: function(data) {
			for(var i = 0 ; i < data.sizecat ; i++) {
				var courantCat = data.cat[i];
				var langue = localStorage.getItem(0);
				if(langue == 'fr') {
					var courantCatNom = courantCat.nom;
				} else if(langue == 'en'){
					var courantCatNom = courantCat.en;
				} else {
					var courantCatNom = courantCat.esp;
				}
				var listeSsCat = "listeSsCat"+i;
				$("#navmenu").append("<div data-role='collapsible' class='categorie'><h3>"+courantCatNom+"</h3><ul class='"+listeSsCat+"' data-role='listview' data-inset='true' data-icon='plus'></ul></div>");
				for(var j = 0 ; j < data.sizesscat ; j++) {
					var courantSsCat = data.sscat[j];
					if(langue == 'fr') {
						var nomCourant = courantSsCat.nom;
					} else if(langue == 'en'){
						var nomCourant = courantSsCat.en;
					} else {
						var nomCourant = courantSsCat.esp;
					}
					var lien = "href='/app/FinalParcours/final_parcours'";
					if (courantSsCat.catparent == courantCat.id) {
						$("."+listeSsCat).append("<li><a "+lien+" onclick=\"addSsCat('"+/*nomCourant*/courantSsCat.nom+"')\">"+nomCourant.replace(/\\/, "")+"</a></li>");
					}
				}
			}
		},
	});
});

//Call ruby method via ajax
function call_ruby_method_via_ajax(method_name,nCommerce){
	//$.ajax({url:'/app/DetailsCommerce/'+method_name,type : "post",data:{ magasin_id: datar.commerces[nCommerce].id }});
	$.get('/app/DetailsCommerce/'+method_name,{ magasin_id: datar.commerces[nCommerce].id });
}
function addSsCat(sscat) {
   	parcours.setItem(parcours.length, sscat);
}