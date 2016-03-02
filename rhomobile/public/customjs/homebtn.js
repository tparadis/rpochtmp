$("geolatitude").after("<div id='homeBtn' style='position:absolute;bottom:10px;left:10px;width:30px;height:30px;background-color:black;'><img src='http://rpoch.istic.univ-rennes1.fr/static/images/homebtn.png' /></div>");
$("#homeBtn").on('click',function(){
	window.location.href = "/app/index.erb";
});