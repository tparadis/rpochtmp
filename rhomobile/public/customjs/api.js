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
		data = data.substring(0, data.length - 1);
		console.log("url = ", protocol + "://" + address + "?" + data);

		var response = Rho.Network.get({
			url : protocol + "://" + address + "?" + data,
			headers: { "Content-Type": "application/json" },
			authType: "basic",
			authUser : "application",
			authPassword : "app404", 
			verifyPeerCertificate : false
		});
		
		try {
			var json_res = JSON.parse(response.body);			
		} catch (err) {
			console.error("JSON parse error : ", response);
		}
		console.log("Response body = ", json_res);		
		return json_res;
	};
	
	api.send2=function (params) {// requete vers le serveur de test deva
		var protocol = "https";
		var address = "rpoch.istic.univ-rennes1.fr/deva/";
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
			authUser : "application",
			authPassword : "app404", 
			verifyPeerCertificate : false
		});
		
		try {
			var json_res = JSON.parse(response.body);			
		} catch (err) {
			console.error("JSON parse error : ", response);
		}
		console.log("Response body = ", json_res);		
		return json_res;
	};
	
api.send_simple=function (params) {// requete vers l'api
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
				authUser : "application",
				authPassword : "app404", 
				verifyPeerCertificate : false
			});
			
			console.log("Response body = ", response.body);		
			return response.body;
		};
		
api.testNetwork = function() {
	var protocol = "https";
	var address = "rpoch.istic.univ-rennes1.fr/api/categories";	
	var response = Rho.Network.get({
		url : protocol + "://" + address,
		headers: { "Content-Type": "application/json" },
		authType: "basic",
		authUser : "application",
		authPassword : "app404", 
		verifyPeerCertificate : false
	});
	
	return response.http_error == "200";
}

api.signaler = function(id, sel, text) { return api.send_simple({ data: {"req":"signaler","format":"json","magasin":id,"objet":sel,"message":text} }) }	
	
api.getAllcat=function () { return api.send({ data: {"req":"allcat","format":"json"} }) }

api.getCommDetail= function(id){ return api.send({ data: {"req":"spec","format":"json", "id":id} }) }

api.getPredef= function(typeP){ return api.send({data : {"req":"predef","format":"json","nom":typeP}}) }

api.getAllPredef= function(typeP){ return api.send({data : {"req":"predef","format":"json"}}) }

api.getAleatoire= function(tag,uuid){ return api.send({data : {"req":"aleatoire","format":"json", "tag":tag, "uuid":uuid}}) }

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


