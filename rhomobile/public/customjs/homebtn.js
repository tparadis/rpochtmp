$("body").append("<div id='homeBtn' style='position:absolute;bottom:10px;left:10px;width:30px;height:30px;background-color:black;z-index:9999;'><img src='http://rpoch.istic.univ-rennes1.fr/static/images/homebtn.png' /></div>");
$("#homeBtn").on('click',function(){
	//Rho.WebView.navigate("/app/");
	//Ca marche pas, corriger
	window.location.replace("/app");
});