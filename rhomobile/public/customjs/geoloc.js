$(document).ready(function(e){

	
	//On teste si le navigateur supporte les Geolocation
	if(navigator.geolocation) {

		//Utile pour maintenir à jour la position par un appel récurrent à la fonction getPos
	  var userID = navigator.geolocation.watchPosition(getPos);
	  
	} else {
	  // Pas de support, on met l'utilisateur sur l'opéra de Rennes
	  console.log("Geolocalisation impossible...");
	  localStorage.setItem("userlat", "48.110003");
	  localStorage.setItem("userlng", "-1.678671");
	  
	}
	
});

//Actualise nos variables globales
function getPos(position)
{
	if((position.coords.latitude != 0 && position.coords.longitude != 0) || (position.coords.latitude != -1 && position.coords.longitude != -1))
	{
		localStorage.setItem("userlat", JSON.stringify(position.coords.latitude));
		localStorage.setItem("userlng", JSON.stringify(position.coords.longitude));
	}
	else
	{
		localStorage.setItem("userlat", "48.110003");
		localStorage.setItem("userlng", "-1.678671");
	}
}










