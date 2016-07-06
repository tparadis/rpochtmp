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
		
api.testNetwork = function() {
	var protocol = "https";
	var address = "rpoch.istic.univ-rennes1.fr/static/";	
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
//signalement
api.signaler = function(id, sel, text) { return api.send_simple({ data: {"req":"signaler","format":"json","magasin":id,"objet":sel,"message":text} }) }	
	
api.statMag = function(id){ return api.send({ data: { "req": "stats", "id": id, "format": "json" } })}

api.getTextTuto = function(page){ return api.send({ data: { "req": "tutos", "page": page, "format": "json" } })}

api.statSSCat = function(idcat){ return api.send({ data: { "req": "statSSCat", "idcat": idcat, "format": "json" } })}

api.statCat = function(idcat){ return api.send({ data: { "req": "statCat", "idcat": idcat, "format": "json" } })}

api.getAllcat=function () { return api.send({ data: {"req":"allcat","format":"json"} }) }

api.getCommDetail= function(id){ return api.send({ data: {"req":"spec","format":"json", "id":id} }) }

api.getPredef= function(typeP){ return api.send({data : {"req":"predef","format":"json","nom":typeP}}) }

api.getAllPredef= function(typeP){ return api.send({data : {"req":"predef","format":"json"}}) }

api.getAleatoire= function(tag,uuid){ return api.send({data : {"req":"aleatoire","format":"json", "tag":tag, "uuid":uuid}}) }

//pour la loupe
api.getSuggestion = function(txt){ return api.send({data: {"req":"suggestion", "format":"json", "deb":txt}})}

api.getHorraires = function(id){return api.send({data: {"req":"ouvert", "format":"json", "id":id}})}

api.nouveau = function(){return api.send({data: {"req":"new", "format":"json"}})}

api.userExists = function(id){return api.send({data: {"req":"userExists", "format":"json", "id":id}})}

api.addNote =  function(com,idtel,idshop,note){return api.send({data: {"req":"addNote", "format":"json", "commentaire":com ,"idtel":idtel, "commerce": idshop, "note": note}})}

api.getAllTutos = function(){return api.send({data: {"req":"tutos", "format":"json"}})}

//accueil predef select perso
api.getTuto = function(page){return api.send({data: {"req":"tutos", "format":"json", "page":page}})}

api.statParcours =function(typeP){return api.send({data: {"req":"incpredef","format":"json","nom":typeP}})}

api.randomNew = function(ids){return api.send({data: {"req":"randomNew","format":"json","tags":ids}})}

api.getAleatoireR= function(tag,uuid){
	var tabTag = parseTags(tag,"alea");
	return api.send({data : {
	"req":"aleatoireR",
	"format":"json",
	"tags":tabTag,
	"uuid":uuid
	}}) }


//commerces est un tableau et tags un tableau de tableau
api.genParcours2 = function (coord_dep_lat, coord_dep_lng, coord_arr_lat, coord_arr_lng, dist_max, commerces,tags) { 
	var tabTag = parseTags(tags,"gen");
	return api.send({ data: {
		"req":"yoloR",
		"format":"json",
		"coord_dep_lat":coord_dep_lat,
		"coord_dep_lng":coord_dep_lng,
		"coord_arr_lat":coord_arr_lat,
		"coord_arr_lng":coord_arr_lng,
		"dist_max":dist_max,
		"commerces":"["+commerces+"]",
		"tags":tabTag
	} }) }


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

function parseTags(tags,type){
	var res ="";	
	var tmp;
	console.log(tags.length);
	
	for (var i = 0 ; i < tags.length  ; i++){
		if(type == "alea"){
			console.log("ici");
			tmp = JSON.parse(tags[i]);
			res += "["+tmp+"]";
		}else{
			if(tags[i].length == 1){
				console.log("ici");
				tmp = JSON.parse(tags[i]);
				res += "["+tmp+"]";
			}else{
				console.log("here");
				tmp = JSON.parse(tags[i][0]);
				tmp2 = JSON.parse(tags[i][1]);
				res += "["+tmp+","+ tmp2 + "]";
			}
		}
		if(i != tags.length-1){
			res += ",";
		}
		
		console.log("done " + res);
	}
	res = "["+res+"]";
	return res
}


