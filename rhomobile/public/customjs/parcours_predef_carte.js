  //initialize();
      function initialize() {
      
      $("#pageSpec").hide(200);  
        
      var locations = [];
      
      //On r�cup�re le nom du parcours predefinis (il est cach� dans la page dans le nom d une div ;) ). On fait appel � la requete traditionnelle. 
      
      parcoursChoisi = $("#parcours_predef").attr("name"); // variable globale pour pouvoir la r�cuperer dans la fonction passerDevant()
      var data = api.getPredef(parcoursChoisi);
      
                      var i = 0;
                      var magasins_size = data.size;
                      
                      while (i < magasins_size)
                      {
                          locations.push([data.magasins[i].enseigne+"  "+i, data.magasins[i].location_lat,data.magasins[i].location_lng, i+1, data.magasins[i].id]);
                          i++;
                      }
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(48.112739, -1.681489),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
     
    for (i = 0; i < locations.length; i++) {
      var ipath= findCatSubCat(locations[i][4]);
      var image = {url:localStorage.getItem("sscatimg"+ipath.subcat),
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 16)
        };
      marker = new google.maps.Marker({
        icon: image,
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]+'<div id="marker" name="'+locations[i][4]+'" ><button>information</button></div>');
          infowindow.open(map, marker);
          $("#marker").find("button").on("click",function(e){
            sessionStorage.setItem("currentMagasin",locations[i][4]);

            //window.location.replace("/app/DetailsCommerce/details_commerce");
            afficheSpecificationMagasin();
          });
        }
      })(marker, i));
      }
      
    userMarker = new google.maps.Marker({
     position: {lat: userlat, lng: userlong},
     map: map,
     icon: "http://rpoch.istic.univ-rennes1.fr/static/images/googlePos.png"
   });
   
   window.setInterval(function()
   {
     userMarker.setPosition({lat: userlat, lng: userlong});
    },2000); 
    
    setInterval("passerDevant()", 5000); 
}
    
    function passerDevant(){
    
  
        if(navigator.geolocation){
        
        navigator.geolocation.getCurrentPosition(showPosition);
        function showPosition(position) {
         
        
        
        
          for(x=0; x < listPos.length; x += 2){ 
         if ((position.coords.latitude > listPos[x] - 0.0003 && position.coords.latitude < listPos[x] + 0.0003 && position.coords.longitude > listPos[x+1] - 0.0003 && position.coords.longitude < listPos[x+1] + 0.0003)){
              
              
              // requ�te vers le serveur de test
              api.send2({data : {"req":"stats","id":data.magasins[x/2].id,"parcours":parcoursChoisi,"format":"json"}});
              
              listPos[x]=0;
              listPos[x+1]=0;
              
             }
          }
        } 
      }
    }