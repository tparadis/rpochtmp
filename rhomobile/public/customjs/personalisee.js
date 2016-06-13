var waypointsArray = [];
var i = 0;
var lat = 0;
var lng = 0;
var markerArray = [];
var infowindowArray = [];
var L = [];
idArray = [];
listPos = [];
listPosBis = [];
magParcouruMax = -1; // Le magasin le plus loin dans le parcours qui a ete parcouru.
var currentInfoWindow;
var isPredef = false;
ssCatCache = [];

function backButton()
{
	if($("#parcours_predef").attr("name") != "null")
	{
		window.location.replace("/app/ParcoursPredef/parcours_predef");
	}
	else
	{
		window.location.replace("/app/SousCategories/sous_categories");
	}

}


function initialize() {

	
	//Prevent screen to sleep on this page
	Rho.System.screenSleeping = false;
	
	currentLang = localStorage.getItem("0");
	
	//On cleane la sessionStorage d'elements indesirables
	if (sessionStorage.getItem("currentMagasin") != null) {
		sessionStorage.removeItem("currentMagasin");
	}
	//if (sessionStorage.getItem("posRecuperer") != null) {
	//	var valeurPosRecup = sessionStorage.getItem("posRecuperer");
		var valeurPosRecup = 1;
		sessionStorage.removeItem("posRecuperer");
	//}
	
	magasins = [];
	if(!navigator.geolocation){
		$("body").append("<div id='warningWindow' style='top:70px; z-index:20;'><div class='activgeo'>"
	+"</div></div>");
		var elem = document.getElementsByClassName("activgeo");
		elem[0].innerHTML = lang[currentLang].activgeo;
		$("#warningWindow").css("height","auto");
		$("#warningWindow").on("mousedown",function(){
			$("#warningWindow").hide(500);
		});	
	}

	
	if( (navigator.geolocation) && (localStorage.getItem("userlat") == "48.1113531") && (localStorage.getItem("userlng")=="-1.6786842999999863")){
		$("body").append("<div id='warningWindow' style='top:70px; z-index:20;'><div class='probgeo'>"
	+"</div></div>");
		var elem = document.getElementsByClassName("probgeo");
		elem[0].innerHTML = lang[currentLang].probgeo;
		$("#warningWindow").css("height","auto");
		$("#warningWindow").on("mousedown",function(){
			$("#warningWindow").hide(500);
		});	
	}
	
	
	//Si le parcours demande est un parcours predefinis
	//On ajoute simplement les magasins de la requete dans la session_Storage
	if($("#parcours_predef").attr("name") != "null")
	{
		isPredef = true;
		var parcoursChoisi = $("#parcours_predef").attr("name");
		var data = api.getPredef(parcoursChoisi);
		
		console.log("Parcours predef :"+parcoursChoisi);  
        
		var i = 0;
        var magasins_size = data.size;
        
        sessionStorage.clear();
        while (i < magasins_size)
        {
        	var infos = [];
        	var currentMG = data.magasins[i];
        	var infosAdditionnelle = api.getCommDetail(currentMG.id);
        	
        	
        	if(infosAdditionnelle != null)
        	{
        		var retFind = findCatSubCat(currentMG.id);
        		ssCatCache.push(retFind);
        		infos.push(Number(infosAdditionnelle.commerce.tag0));
        		infos.push(retFind.subcat);
        		infos.push(currentMG.id);

        		infos.push(infosAdditionnelle.commerce.enseigne);
        		infos.push(currentMG.location_lat);
        		infos.push(currentMG.location_lng);
        		sessionStorage.setItem(i, JSON.stringify(infos));
        	}

            i++;
        }
        
	}
	
	
	
	for (var i = 0; i < sessionStorage.length; i++) {
		var magasin = JSON.parse(sessionStorage.getItem(i));
		var categories;
		
		//On gardait en memoire dans ssCatCache au lieu de faire la requete 2 fois
		//si le parcours etait en predef
		if(isPredef)
		{
			categories = ssCatCache[i];
		}
		else
		{
			categories = findCatSubCat(magasin[2]);
		}
		
		var urlimg = "/public/images/cat" + categories.cat + "_256.svg";
		var image = {

			url: urlimg,
			// url:localStorage.getItem("sscatimg"+magasin[0]),
			scaledSize: new google.maps.Size(30, 30),
			size: new google.maps.Size(30, 30),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(16, 16)
		};
		magasins.push({ "image": image, "latitude": magasin[4], "longitude": magasin[5], "name": magasin[3], "id": magasin[2] });
		idArray.push(magasin[2]);
		if (valeurPosRecup != 1) {
			listPos.push(magasin[4]);
			listPos.push(magasin[5]);
			listPosBis.push(magasin[4]);
			listPosBis.push(magasin[5]);
		} else {
			listPos.push(0);
			listPos.push(0);
			listPosBis.push(0);
			listPosBis.push(0);
		}
	}

	//sessionStorage.setItem("posRecuperer", 1);

	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;
	var mapCanvas = document.getElementById('map');
	var position;

	var mapOptions = {
		center: new google.maps.LatLng(48.112739, -1.681489),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(mapCanvas, mapOptions);
	directionsDisplay.setMap(map);
	//Comment to test on rhosimulator
	
	var image = {

		url: "http://rpoch.istic.univ-rennes1.fr/static/images/googlePos.png",
		// url:localStorage.getItem("sscatimg"+magasin[0]),
		scaledSize: new google.maps.Size(50, 50),
		size: new google.maps.Size(50, 50),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(25,25)
	};
	
	
	
	userMarker = new google.maps.Marker({
		position: { lat: Number(localStorage.getItem("userlat")), lng: Number(localStorage.getItem("userlng")) },
		map: map,
		icon: image
	});

	window.setInterval(function() {
			userMarker.setPosition({ lat: Number(localStorage.getItem("userlat")), lng: Number(localStorage.getItem("userlng")) });
		}, 2000);
	//Comment to test on rhosimulator
	var infowindow = new google.maps.InfoWindow();
	for (i = 0; i < magasins.length; i++) {
		lat = magasins[i].latitude;
		lng = magasins[i].longitude;
		if (i != magasins.length - 1) {
			waypointsArray.push({
				location: new google.maps.LatLng(lat, lng),
				stopover: false
			});
		}

		var marker = new google.maps.Marker({
				position: new google.maps.LatLng(magasins[i].latitude, magasins[i].longitude),
				map: map,
				animation: google.maps.Animation.DROP,
				icon: magasins[i].image,
				
			});
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {

					infowindow.setContent(magasins[i].name + '<div id="marker" name="' + magasins[i].id + '" > <img class= "ImgBtnInfo" ></img></div>');
					infowindow.open(map, marker);
					$("#marker").on("click", function(e) {
							if (currentInfoWindow != undefined) {
								currentInfoWindow.close();
							}
							currentInfoWindow = infowindow;
							sessionStorage.setItem("currentMagasin", magasins[i].id);

							//window.location.replace("/app/DetailsCommerce/details_commerce");
							afficheSpecificationMagasin();
							currentInfoWindow.close();
						});
				}
			})(marker, i));
		//attachMessage(marker, magasins[i].name);
	}
	;

	if ((magasins.length > 1) && (magasin.length < 9)) {
		var request = {
			origin: new google.maps.LatLng(Number(localStorage.getItem("userlat")), Number(localStorage.getItem("userlng"))),
			destination: new google.maps.LatLng(magasins[magasins.length - 1].latitude, magasins[magasins.length - 1].longitude),
			optimizeWaypoints: true,
			waypoints: waypointsArray,
			travelMode: google.maps.TravelMode.WALKING
		};
		directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(result);
				}
			});
		
		directionsDisplay.setOptions({ suppressMarkers: true });
	}
	else if (magasins.length == 1 ) {
		var request = {
			origin: new google.maps.LatLng(Number(localStorage.getItem("userlat")), Number(localStorage.getItem("userlng"))),
			destination: new google.maps.LatLng(magasins[0].latitude, magasins[0].longitude),
			optimizeWaypoints: true,
			waypoints: waypointsArray,
			travelMode: google.maps.TravelMode.WALKING
		};
		directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(result);
				}
			});
		
		directionsDisplay.setOptions({ suppressMarkers: true });
	}

	setInterval("passerDevant()", 5000);
	
}

function findCatSubCat(id) {
	var data = api.getCommDetail(id);
	var nbSS = parseInt(localStorage.getItem("nbSsCat"));
	var i = 0;
	var tmp = "";
	while (i < nbSS) {
		tmp = JSON.parse(localStorage.getItem("sscat" + i));
		if (data.commerce.tag0 == tmp[0]) {
			return {
				"cat": tmp[2],
				"subcat": tmp[0]
			};
		}
		i++;
	}
	return {
		"cat": "",
		"subcat": ""
	};

}

function passerDevant() {
	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(showPosition);
		function showPosition(position) {

			for (x = 0; x < listPos.length; x += 2) {
				if (position.coords.latitude > listPos[x] - 0.0003 && position.coords.latitude < listPos[x] + 0.0003 && position.coords.longitude > listPos[x + 1] - 0.0003 && position.coords.longitude < listPos[x + 1] + 0.0003) {

					//Statistiques
					api.send({ data: { "req": "stats", "id": idArray[x / 2], "parcours": "personalise", "format": "json" } });
					listPos[x] = 0;
					listPos[x + 1] = 0;
					var x = 2;
					//Grisement du chemin parcouru
					if (x > magParcouruMax) { // si on repasse devant un magasin deja parcouru, rien ne se passe.
						directionsDisplay.setMap(null);
						var waypointsArray1 = []
						var waypointsArray2 = []
						var k = 0
						var l = 0
						// on construit le chemin parcouru
						while (k < x) {
							lat = listPosBis[k];
							lng = listPosBis[k + 1];
							if (k != magasins.length - 1) {
								waypointsArray1.push({
									location: new google.maps.LatLng(lat, lng),
									stopover: false
								});
							}
							k = k + 2;
						}
						l = k

						// on construit le reste du chemin a parcourir
						while (l < listPosBis.length) {
							lat = listPosBis[l];
							lng = listPosBis[l + 1];
							if (l != magasins.length - 1) {
								waypointsArray2.push({
									location: new google.maps.LatLng(lat, lng),
									stopover: false
								});
							}
							l = l + 2;
						}

						//affichage du premier parcours
						request = {
							origin: new google.maps.LatLng(Number(localStorage.getItem("userlat")), Number(localStorage.getItem("userlng"))),
							destination: new google.maps.LatLng(listPosBis[k], listPosBis[k + 1]),
							optimizeWaypoints: true,
							waypoints: waypointsArray1,
							travelMode: google.maps.TravelMode.WALKING
						};
						directionsService.route(request, function(result, status) {
								if (status == google.maps.DirectionsStatus.OK) {
									directionsDisplay.setDirections(result);
								}
							});

						directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true });
						directionsDisplay.setOptions({
							polylineOptions: {
								strokeColor: "grey"
							}
						});

						//affichage du second parcours
						directionsService2 = new google.maps.DirectionsService;
						directionsDisplay2 = new google.maps.DirectionsRenderer;

						request = {
							origin: new google.maps.LatLng(listPosBis[k], listPosBis[k + 1]),
							destination: new google.maps.LatLng(magasins[magasins.length - 1].latitude, magasins[magasins.length - 1].longitude),
							optimizeWaypoints: true,
							waypoints: waypointsArray2,
							travelMode: google.maps.TravelMode.WALKING
						};
						directionsService2.route(request, function(result, status) {
								if (status == google.maps.DirectionsStatus.OK) {
									directionsDisplay2.setDirections(result);
								}
							});

						directionsDisplay2.setOptions({ suppressMarkers: true, preserveViewport: true });

						directionsDisplay.setMap(map);
						directionsDisplay2.setMap(map);
						magParcouruMax = x;
					}

				}
			}
		}
	}
}
