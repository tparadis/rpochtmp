var datar ="";

$(document).ready(function() {
	var nbCat = localStorage.getItem('nbCat');
	var nbSsCat = localStorage.getItem('nbSsCat');
	for (var i = 0 ; i < nbCat ; i++) {
		var keyCat = "cat"+i;
		var categorie = JSON.parse(localStorage.getItem(keyCat));
		var catimg = localStorage.getItem("catimg"+i);
		var listeSsCat = "listeSsCat"+i;
		$("#navmenu").append("<div data-role='collapsible' class='categorie'>"+"<h3><img src="+catimg+"  width=\"32\" height=\"32\">"+categorie[1]+"</h3>"+"<ul class='"+listeSsCat+"' data-role='listview' data-inset='true' data-icon='plus'></ul></div>");
		for (var j = 0 ; j < nbSsCat ; j++) {
			var keySsCat = 'sscat'+j;
			var ssCategorie = JSON.parse(localStorage.getItem(keySsCat));
			if (ssCategorie[2] == categorie[0]) {
				var filename;
				var fullpath;
				filename = localStorage.getItem("sscatimg"+ssCategorie[0]) ;
				$("."+listeSsCat).append("<li>"+"<img src= "+filename+"  width=\"32\" height=\"32\">"+"<a onclick=\"addSsCat('"+keySsCat+"')\">"+ssCategorie[1].replace(/\\/, "")+"</a></li>");
				}
		}
	}
	actualiserMagasins();
})

//Call ruby method via ajax
function call_ruby_method_via_ajax(method_name,nCommerce){
	//$.ajax({url:'/app/DetailsCommerce/'+method_name,type : "post",data:{ magasin_id: datar.commerces[nCommerce].id }});
	$.get('/app/DetailsCommerce/'+method_name,{ magasin_id: datar.commerces[nCommerce].id });
}
function addSsCat(sscat) { 	
	var tmp = JSON.parse(localStorage.getItem(sscat));
	sessionStorage.setItem(sessionStorage.length, JSON.stringify(tmp));
	
	
	  Rho.Notification.vibrate(500);
	 
	//toast message 
	  $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' > Magasin Ajout&eacute</div>").css({ "display": "block", "opacity": 0.96, "": $(window).scrollTop() })
	  .appendTo( $.mobile.pageContainer )
	  .delay( 1000 )
	  .fadeOut( 400, function(){
	    $(this).remove();
	  });
	
	actualiserMagasins();
}



function actualiserMagasins(){
	$(".cart #nb_magasins").text(sessionStorage.length);
}
