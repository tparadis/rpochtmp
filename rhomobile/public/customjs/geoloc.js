$(document).ready(function(e){
	
	//Ces deux variables sont utilisables depuis partout
	userlat = 0; 
	userlong = 0;
	userRealCoords = false;
	defaultPos = [48.111232, -1.678671]; //L'op�ra de Rennes
	
	getLongLat();
	timerId = setTimeout(validCoordinates, 1000);
	window.setInterval(computeValues, 1200);
})



//Fonctions de mise � jour automatiques
//Si on d�tecte que les valeurs sont fausses, dans ce cas on va remplacer par les coords de l'Op�ra
function getLongLat()
{
			
	var v1 = $("geolatitude").html();
	if (v1 == "Unavailable") {
		userlat = defaultPos[0];
		userRealCoords = false;
	}

	var v1 = $("geolongitude").html();
	if (v1 == "Unavailable") {
		userlong = defaultPos[1];
		userRealCoords = false;
	}
}


function computeValues()
{
	getLongLat();
	console.log(userlat+", "+userlong);
}

function validCoordinates()
{
	getLongLat();
	if(userlat == 0 || userlong == 0)
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


