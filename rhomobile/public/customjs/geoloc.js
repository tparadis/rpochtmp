$(document).ready(function(e){
	
	//Ces deux variables sont utilisables depuis partout
	userlat = 0; 
	userlong = 0;
	userRealCoords = false;
	defaultPos = [48.111232, -1.678671]; //L'opéra de Rennes
	
	timerId = setTimeout(validCoordinates, 1000);
	
	window.setInterval(function(){
		userlat = setLat();
		userlong = setLong();
		//alert("lat:"+$("geolatitude").html()+" || "+userlat+", long:"+$("geolongitude").html()+" || "+userlong);
	}, 2000);
})



//Fonctions de mise à jour automatiques
//Si on détecte que les valeurs sont fausses, dans ce cas on va remplacer par les coords de l'Opéra
function getLat()
{
	return userlat;
}

function getLong()
{
	return userlong;
}

function setLat()
{
			
	var v1 = $("geolatitude").html();
	if (v1 == "Unavailable" || v1 == "Reading") {
		v1 = defaultPos[0];
		userRealCoords = false;
	}
	
	return parseFloat(v1);
	
}
function setLong()
{
	var v1 = $("geolongitude").html();
	if (v1 == "Unavailable" || v1 == "Reading") {
		v1 = defaultPos[1];
		userRealCoords = false;
	}
	
	return parseFloat(v1);
}

function validCoordinates()
{
	userlat = setLat();
	userlong = setLong();
	if(userlat == defaultPos[0] || userlong == defaultPos[1])
	{
		userRealCoords = false;
		console.log("GEOLOCALISATION ERROR : Coordonnees non valides, on remplace!");
	}
	else
	{
		console.log("les coordonnees sont valides.");
		userRealCoords = true;
	}
	
	 clearTimeout(timerId);
}


