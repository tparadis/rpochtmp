var api = {}
	
api.send=function (params) {// requete vers l'api
		var protocol = "https";
		var address = "rpoch.istic.univ-rennes1.fr/api/";
		var data = (function(data){
			var _data = "";
			for(var prop in data) {// passage des parametres en string
				//console.log(prop,data[prop])
				_data += encodeURI(prop + "=" + data[prop] + "&");
				}return _data;
			}(params.data))

		console.log("url = ", protocol + "://" + address + "?" + data);

		var response = Rho.Network.get({
			url : protocol + "://" + address + "?" + data,
			headers: { "Content-Type": "application/json" },
			authType: "basic",
			authUser : "user",
			authPassword : "pwd",
			verifyPeerCertificate : false
		});
		return response;
	};

api.getAllcat=function () { return api.send({ data: {"req":"allcat","format":"json"} }) }

api.getCommDetail= function(id){ return api.send({ data: {"req":"spec","format":"json", "id":id} }) }

api.genParcours = function (coord_dep_lat, coord_dep_lng, coord_arr_lat, coord_arr_lng, dist_max, tags) { 
	return api.send({ data: {
		"req":"yolo",
		"format":"json",
		"coord_dep_lat":coord_dep_lat,
		"coord_dep_lng":coord_dep_lng,
		"coord_arr_lat":coord_arr_lat,
		"coord_arr_lng":coord_arr_lng,
		"dist_max":dist_max,
		"commerces":"["+tags+"]"
	} }) }


