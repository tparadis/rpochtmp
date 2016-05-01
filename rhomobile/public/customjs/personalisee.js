var waypointsArray =[];
 var i = 0;
 var lat=0;
 var lng = 0;
 var markerArray = [];
 var infowindowArray = [];
 var L = [];
 idArray = [];
 listPos = [];
 listPosBis = [];
 magParcouruMax = -1; // Le magasin le plus loin dans le parcours qui a été parcouru.
 var currentInfoWindow;
   
  function initialize() {    
     magasins=[];
      
    if(sessionStorage.getItem("currentMagasin") != null) {
          sessionStorage.removeItem("currentMagasin");
        }
    if(sessionStorage.getItem("posRecuperer") != null) {
          var valeurPosRecup = sessionStorage.getItem("posRecuperer");
           sessionStorage.removeItem("posRecuperer");
        }
    for (var i = 0 ; i < sessionStorage.length ; i++) {
        var magasin = JSON.parse(sessionStorage.getItem(i));
        var image = {url:localStorage.getItem("sscatimg"+magasin[0]),
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 16)
        };         
        magasins.push({"image":image,"latitude":magasin[4],"longitude":magasin[5],"name":magasin[3],"id":magasin[2]});
        idArray.push(magasin[2]);
        if(valeurPosRecup != 1){
          listPos.push(magasin[4]);
          listPos.push(magasin[5]);
          listPosBis.push(magasin[4]);
          listPosBis.push(magasin[5]);
          }
          else{
            listPos.push(0);
            listPos.push(0);
            listPosBis.push(0);
            listPosBis.push(0);
            }
      }

     sessionStorage.setItem("posRecuperer", 1);
     
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

     //Comment to test on rhosimulator
     userMarker = new google.maps.Marker({
            position: {lat: userlat, lng: userlong},
            map: map,
            icon: "http://rpoch.istic.univ-rennes1.fr/static/images/googlePos.png"
          });
          
          window.setInterval(function()
          {
            userMarker.setPosition({lat: userlat, lng: userlong});
           },2000); 
     //Comment to test on rhosimulator
     var infowindow = new google.maps.InfoWindow();
     for(i=0;i<magasins.length;i++)
     {
               lat = magasins[i].latitude;
               lng = magasins[i].longitude;
               if(i!=magasins.length-1)
                 {waypointsArray.push({
                                    location:new google.maps.LatLng(lat, lng),
                                    stopover:false
                                  }); 
                 }      
                 var marker =new google.maps.Marker({
                                      position: new google.maps.LatLng(magasins[i].latitude, magasins[i].longitude),
                                      map: map,
                                      icon: magasins[i].image
                                      });   
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                          
                          infowindow.setContent(magasins[i].name+'<div id="marker" name="'+magasins[i].id+'" ><button>information</button></div>');
                          infowindow.open(map, marker);
                          $("#marker").find("button").on("click",function(e){
                            if(currentInfoWindow!= undefined){
                                           currentInfoWindow.close();
                                           }
                                           currentInfoWindow = infowindow;
                            sessionStorage.setItem("currentMagasin",magasins[i].id);
                
                            //window.location.replace("/app/DetailsCommerce/details_commerce");
                            afficheSpecificationMagasin();
                            currentInfoWindow.close();
                          });
                        }
                      })(marker, i));
                 //attachMessage(marker, magasins[i].name);
};
    
    if(magasins.length>1)
     { var request = {
       origin:new google.maps.LatLng(userlat, userlong),
           /*FIXME si le parcours a moins de deux points l'application va planter*/
         destination:new google.maps.LatLng(magasins[magasins.length-1].latitude,magasins[magasins.length-1].longitude),
         optimizeWaypoints: true,
         waypoints: waypointsArray,
         travelMode: google.maps.TravelMode.WALKING
       };
       directionsService.route(request, function(result, status) {
         if (status == google.maps.DirectionsStatus.OK) {
           directionsDisplay.setDirections(result);
         }
       });
         directionsDisplay.setMap(map);
       directionsDisplay.setOptions( { suppressMarkers: true } );  } 
         
       setInterval("passerDevant()", 5000); 
       }  
       
       function passerDevant(){
    	       if(navigator.geolocation){
    	         
    	         navigator.geolocation.getCurrentPosition(showPosition);
    	                function showPosition(position) {
    	         
    	        
    	         
    	         for(x=0; x < listPos.length; x += 2){ 
    	          if (position.coords.latitude > listPos[x] - 0.0003 && position.coords.latitude < listPos[x] + 0.0003 && position.coords.longitude > listPos[x+1] - 0.0003 && position.coords.longitude < listPos[x+1] + 0.0003){
    	               
    	               //Statistiques
    	               api.send2({data : {"req":"stats","id":idArray[x/2],"parcours":"personalise","format":"json"}});
    	               listPos[x]=0;
    	              listPos[x+1]=0;
    	               var x = 2;
    	               //Grisement du chemin parcouru
    	               if (x > magParcouruMax) { // si on repasse devant un magasin déjà parcouru, rien ne se passe.
    	             	  directionsDisplay.setMap(null);
    	             	     var waypointsArray1 = []
    	             	     var waypointsArray2 = []
    	             	     var k = 0
    	             		 var l = 0
    	 					 // on construit le chemin parcouru
    	             	     while (k < x)
    	             	     { 
    	             	    	 lat = listPosBis[k];
    	             	         lng = listPosBis[k+1];
    	             	         if(k!=magasins.length-1)
    	             	           {waypointsArray1.push({
    	             	                              location:new google.maps.LatLng(lat, lng),
    	             	                              stopover:false
    	             	                            }); 
    	             	           }
    	             	         k = k+2;
    	             	     }
    	             	     l = k
    	 					 
    	             	     // on construit le reste du chemin à parcourir
    	             	     while (l < listPosBis.length) {
    	             	    	 lat = listPosBis[l];
    	             	         lng = listPosBis[l+1];
    	             	         if(l!=magasins.length-1)
    	             	           {waypointsArray2.push({
    	             	                              location:new google.maps.LatLng(lat, lng),
    	             	                              stopover:false
    	             	                            }); 
    	             	           }
    	             	         l = l+2;
    	             	     }
    	             	   
    	             	     
    	             	     //affichage du premier parcours
    	             	     request = {
    	             	         origin:new google.maps.LatLng(userlat, userlong),
    	             	           destination:new google.maps.LatLng(listPosBis[k],listPosBis[k+1]),
    	             	           optimizeWaypoints: true,
    	             	           waypoints: waypointsArray1,
    	             	           travelMode: google.maps.TravelMode.WALKING
    	             	         };
    	             	         directionsService.route(request, function(result, status) {
    	             	           if (status == google.maps.DirectionsStatus.OK) {
    	             	             directionsDisplay.setDirections(result);
    	             	           }
    	             	         });
    	             	        
    	             	           
    	             	         directionsDisplay.setOptions( { suppressMarkers: true, preserveViewport: true } );  
    	             	     directionsDisplay.setOptions({
    	             	     	 polylineOptions: {
    	             	    	      strokeColor: "grey"
    	             	    	    }
    	             	     });
    	             	     
    	             	     
    	             	   //affichage du second parcours
    	             	     directionsService2 = new google.maps.DirectionsService;
    	             	     directionsDisplay2 = new google.maps.DirectionsRenderer;
    	             	     
    	             	     request = {
    	             	         origin:new google.maps.LatLng(listPosBis[k],listPosBis[k+1]),
    	             	           destination:new google.maps.LatLng(magasins[magasins.length-1].latitude,magasins[magasins.length-1].longitude),
    	             	           optimizeWaypoints: true,
    	             	           waypoints: waypointsArray2,
    	             	           travelMode: google.maps.TravelMode.WALKING
    	             	         };
    	             	         directionsService2.route(request, function(result, status) {
    	             	           if (status == google.maps.DirectionsStatus.OK) {
    	             	             directionsDisplay2.setDirections(result);
    	             	           }
    	             	         });
    	             	        
    	             	           
    	             	         directionsDisplay2.setOptions( { suppressMarkers: true, preserveViewport: true } );  
    	             	    
    	             	     
    	             	     
    	             	    directionsDisplay.setMap(map);
    	             	    directionsDisplay2.setMap(map);
    	             	    magParcouruMax = x;
    	               }
    	      
    	            }
    	           }
    	         }
    	       } 
    	     }