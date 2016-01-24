var listData = ['Coiffeur' , 'Magasins de chaussure' , 'Salle de massage' , 'Parfumerie' , 'Opticien'];
var tabCoord;        
var datar ="";

function genererParcours(){
	$.ajax({
	    dataType: "json",
	    contentType: "application/json",
		url : "http://rpoch.istic.univ-rennes1.fr/api/",
		data : {"req":"path","format":"json","nombreMagasins":5}, //req = path indique que vous formulez une requete pour creer un parcours au backend
		type : "GET",
		async:false,
		success: function(data){
			datar = data;
			var i = 0;
			$("tbody").html("");
			while (i < data.size)
		    {
		    	$("tbody").append("<tr><td>"+data.commerces[i].enseigne+"</td><td>test</td><td>test</td><td><a href=\"\#\" data-role=\"button\" onclick=\"call_ruby_method_via_ajax('requette',"+i+")\">D&eacutetails</a> </td></tr>");
		    	i++;
		    	// tabCoord[i] = new Array(data["commerces"][i]["location_lat"], data["commerces"][i]["location_lat"]);
		    }
			setCookie(tabCoord, tabCoord, 2);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			alert(textStatus +", " +errorThrown);
		}
	});
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue.toString() + "; " + expires;
}

function afficherTags(nomMagasin){
	document.write("je suis ici");
}

function addTags(){
	
}

//Call ruby method via ajax
function call_ruby_method_via_ajax(method_name,nCommerce){
	//$.ajax({url:'/app/DetailsCommerce/'+method_name,type : "post",data:{ magasin_id: datar.commerces[nCommerce].id }});
	$.get('/app/DetailsCommerce/'+method_name,{ magasin_id: datar.commerces[nCommerce].id });
}
function addSsCat(sscat) {
   	parcours.setItem(parcours.length, sscat);
}