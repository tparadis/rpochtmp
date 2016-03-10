$(document).ready(function(e){
	
	//On crée l'élément qui va "tout cacher" si le reseau n'est pas disponible
	//le z-index élevé permet de mettre en premier plan cette page
	balise = "<div id='noNetwork' style='position:absolute;top:0;left:0;width:100%;height:100%;background-color:black;z-index:1000;'>";
	balise += "<div class='img-noInternet' style='position:relative;width:150px;height:150px;left:50%;margin-left:-75px;top:50%;margin-top:-75px;'>";
	balise += "<img src='/public/images/noInternet.png' style='width150px;height:150px;' />";
	balise += "<br/><span style='color:white; font-size:12px;' >RPOCH a besoin d'internet...</span>"
	balise += "</div></div>";
	
	appendOnce = false;
	
	//On initialise un timer qui va vérifier le reseau toutes les 200ms 
	networkTimer = setTimeout(detectNetwork, 500);
	detectNetwork();
	
	
	
});

//Va detecter si le reseau est disponible ou non
function detectNetwork(){

	var cell_network = Rho.Network.hasCellNetwork()
    // Wi-Fi network
    var wifi_network = Rho.Network.hasWifiNetwork()
    // Any network
    var network = Rho.Network.hasNetwork()

    alert("Cell network: "+cell_network+"\nWi-Fi network: "+wifi_network+"\nNetwork: "+network);
	
	if(Rho.Network.hasCellNetwork() == true || Rho.Network.hasWifiNetwork() == true){
		//Connection disponible, on supprime le timer
		$("#noNetwork").hide(200);
		appendOnce = false;
		//clearTimeout(networkTimer);
	}
	else
	{
		if(appendOnce == false)
		{
			//Afficher un truc genre "pas internet"
			$('body').append(balise);
			appendOnce = true;
			$("#noNetwork").show(200);
		}	
	}
}

