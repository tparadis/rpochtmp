$(document).ready(function(e){
	
	userlat = 0.0;
	userlong = 0.0;
	
	//On teste si le navigateur supporte les Geolocation
	if(navigator.geolocation) {

		//Utile pour maintenir � jour la position par un appel r�current � la fonction getPos
	  var userID = navigator.geolocation.watchPosition(getPos);
	  
	} else {
	  // Pas de support, on met l'utilisateur sur l'op�ra de Rennes
	  alert("Geolocalisation impossible...");
	  userlat = 48.111232;
	  userlong = -1.678671;
	  
	}
	
});

//Actualise nos variables globales
function getPos(position)
{
    userlat = position.coords.latitude;
    userlong = position.coords.longitude;
}