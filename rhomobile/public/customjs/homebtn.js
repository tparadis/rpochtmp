$("body").append("<div id='homeBtn' style='position:absolute;bottom:10px;left:10px;width:50px;height:50px;z-index:9999;'><img style='height:100%;width:100%;' src='/public/images/home.png' /></div>");
$("#homeBtn").on('click',function(){
	//Rho.WebView.navigate("/app/");
	//Ca marche pas, corriger
	window.location.replace("/app");
});