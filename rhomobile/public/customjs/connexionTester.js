$(document).ready(function(e){

	
	//window.setInterval("beginTest()", 5000);
	window.setInterval(function(){
	var params = {};
		params.connectionInformation = (api.testNetwork() ? "Connected" : "Problem");
		calledBack(params);
	}, 3000);
	
	 appendOnce = false;
	 
	//On cree l'element qui va "tout cacher" si le reseau n'est pas disponible
	//le z-index eleve permet de mettre en premier plan cette page
	
	balise = "<div id='noNetwork' style='position:fixed;top:0;left:0;width:100%;height:100%;background-color:black;z-index:1000;'>";
	balise += "<div class='img-noInternet' style='position:relative;width:150px;height:150px;left:50%;margin-left:-75px;top:50%;margin-top:-75px;'>";
	balise += "<img src='/public/images/noInternet.png' style='width150px;height:150px;' />";
	balise += "<br/><div style='color:white; font-size:12px;' text='probconnect'>Un probleme est survenu.</div>";
	balise += "<br/><div style='color:white; font-size:12px' text='reessayer' >Appuyer pour réessayer.</div>";
	balise += "</div></div>";
	
	$('body').append(balise);
	$("#noNetwork").hide(0);
	
});

function beginTest()
{
	//Dans le hashmap {} ci dessous, nous aurions pu mettre l'adresse du serveur pour la cle 'host'
	//mais cela ne marche pas et renvoi toujours non connectŽ quelle que soit l'url!
	Rho.Network.detectConnection({host:"rpoch.istic.univ-rennes1.fr/static/",detectionTimeout:1000, port:443}, calledBack);
}

function calledBack(params)
{
	//console.log("polled");
	if((params.connectionInformation == "Problem") )
	{
		console.log("serveur down ou pas de connection");
		console.log("params : ", params);
		if(appendOnce == false)
		{
			//Afficher un truc genre "pas internet"
			appendOnce = true;
			$("#noNetwork").show(200);
			$("#page").hide(0);
			$('#noNetwork').on("click", function(e) {
				location.reload();	
				});
		}	
		
	}
	else
	{
		
		//console.log("connect");
		if(appendOnce == true)
		{
			appendOnce = false;
			Rho.Network.stopDetectingConnection(null);
		}
		
	
}



//Va detecter si le reseau est disponible ou non
function detectNetwork(){

	var cnetwork = Rho.Network.hasCellNetwork();
    var wnetwork = Rho.Network.hasWifiNetwork();

    //alert("Cell network: "+cnetwork+"\nWi-Fi network: "+wnetwork);
	console.log("Cell: "+cnetwork+", Wifi: "+wnetwork);
	if(cnetwork || wnetwork)
	{	
		$("#noNetwork").hide(200);
		appendOnce = false;
		//clearInterval(networkTimer);
	}
	else
	{
		//On cree l'element qui va "tout cacher" si le reseau n'est pas disponible
		//le z-index eleve permet de mettre en premier plan cette page
		balise = "<div id='noNetwork' style='position:fixed;top:0;left:0;width:100%;height:100%;background-color:black;z-index:1000;'>";
		balise += "<div class='img-noInternet' style='position:relative;width:150px;height:150px;left:50%;margin-left:-75px;top:50%;margin-top:-75px;'>";
		balise += "<img src='/public/images/noInternet.png' style='width150px;height:150px;' />";
		balise += "<br/><span style='color:white; font-size:12px;' onclick=''>RPOCH a besoin d'internet</span>";
		balise += "</div></div>";
		
		if(appendOnce == true)
		{
			//Afficher un truc genre "pas internet"
			$('body').append(balise);
			
			
			appendOnce = true;
			$("#noNetwork").show(200);
		}	
	}
}
}

