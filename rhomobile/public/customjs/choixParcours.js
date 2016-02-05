var datar ="";

$(document).ready(function() {
	var nbCat = localStorage.getItem('nbCat');
	var nbSsCat = localStorage.getItem('nbSsCat');
	var lien = "href='/app/FinalParcours/final_parcours'";
	for (var i = 0 ; i < nbCat ; i++) {
		var keyCat = "cat"+i;
		var categorie = JSON.parse(localStorage.getItem(keyCat));
		var listeSsCat = "listeSsCat"+i;
		$("#navmenu").append("<div data-role='collapsible' class='categorie'><h3>"+categorie[1]+"</h3><ul class='"+listeSsCat+"' data-role='listview' data-inset='true' data-icon='plus'></ul></div>");
		for (var j = 0 ; j < nbSsCat ; j++) {
			var keySsCat = 'sscat'+j;
			var ssCategorie = JSON.parse(localStorage.getItem(keySsCat));
			if (ssCategorie[2] == categorie[0]) {
				$("."+listeSsCat).append("<li><a "+lien+" onclick=\"addSsCat('"+keySsCat+"')\">"+ssCategorie[1].replace(/\\/, "")+"</a></li>");
			}
		}
	}
})

//Call ruby method via ajax
function call_ruby_method_via_ajax(method_name,nCommerce){
	//$.ajax({url:'/app/DetailsCommerce/'+method_name,type : "post",data:{ magasin_id: datar.commerces[nCommerce].id }});
	$.get('/app/DetailsCommerce/'+method_name,{ magasin_id: datar.commerces[nCommerce].id });
}
function addSsCat(sscat) { 	
	var tmp = JSON.parse(localStorage.getItem(sscat));
	parcours.setItem(parcours.length, JSON.stringify(tmp));
}