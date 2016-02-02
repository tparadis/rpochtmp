var xlsx = require('node-xlsx');
var pg = require('pg');
var https =  https = require('https');
var qs = require("querystring");
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var abandon = [];

//clé google 
//https://console.developers.google.com/project/nth-pier-107017/apiui/apiview/geocoding_backend/quotas


var key = "YOUR GOOGLE API KEY",
	db_user = "YOUR USER NAME",
	db_user_passwd = "YOUR DATABASE PASS",
	db_database = "YOUR DATABASE NAME";


var obj = xlsx.parse(__dirname + "/ETS_Commerciaux_Rennes_2015.xlsx"); // parses a file 
var dbUrl = 'tcp://'+db_user+':'+db_user_passwd+'@localhost:5432/'+db_database;
//Premiere ligne du tableau, contenant les libélés
//var labels = obj[0].data[0];
//console.log(labels);
/*
 * Définition de l'objet/la table d'une ligne du document de la cci
	var labelsObj = {
		siret; 				//Siret
	 	enseigne; 			//Enseigne
	 	rasoc; 				//Raison sociale
	 	date_debut_act; 	//Date début activité
	 	date_rad;			//Date radiation
	 	code_ape;			//Code APE
	 	label_ape;			//Libellé code APE
	 	zone_ape; 			//Zone appartenance APE
	 	label_zone_ape;		//Libellé zone appartenance APE
	 	street_num;			//Numéro de voie
	 	street_name;		//Nom de voie
	 	sort_street_name;	//Tri Nom de voie
	 	city;				//Commune
	 	city_label;			//Libellé commune
	 	epci_2014;			//EPCI 2014
	 	phone_num;			//Téléphone
	 	fax;				//Fax
	 	email;				//Email
	};
*/
//... donc il faut commencer ligne 2 :

pg.connect(dbUrl, function(err, client, done) {
	if(err){
		console.log(err);
	}
	else{
		getInfo(obj[0].data, 803, client);
	}
});


function getNextInfo(data, i, db_client){
    var limit = data.length;
    i++;
    if(i < limit) setTimeout(getInfo, 300, data, i, db_client);
    else {
        //db_client.end();
        console.log("Terminé");
        console.log("lignes ommises : ", abandon);
    }
}


function getInfo(data, i, db_client){
	var ligne = {
		siret 			: data[i][0], 	//Siret
	 	Enseigne 		: data[i][1], 	//Enseigne
	 	rasoc			: data[i][2],	//Raison sociale
	 	date_debut_act 	: data[i][3], 	//Date début activité
	 	date_rad 		: data[i][4],	//Date radiation
	 	code_ape		: data[i][5],	//Code APE
	 	label_ape 		: data[i][6],	//Libellé code APE
	 	zone_ape 		: data[i][7], 	//Zone appartenance APE
	 	label_zone_ape 	: data[i][8],	//Libellé zone appartenance APE
	 	street_num  	: data[i][9],	//Numéro de voie
	 	street_name 	: data[i][10],	//Nom de voie
	 	sort_street_name: data[i][11],	//Tri Nom de voie
	 	city 			: data[i][12],	//Commune
	 	city_label  	: data[i][13] || "Rennes",	//Libellé commune
	 	epci_2014   	: data[i][14],	//EPCI 2014
	 	phone_num 		: data[i][15],	//Téléphone
	 	fax 			: data[i][16],	//Fax
	 	email  			: data[i][17]	//Email
	 };

    if(ligne.street_num && ligne.street_name){
        console.log('\x1b[33m', 'Ligne',i,' :','\x1b[0m');
        //console.log("Données CCI tableau : ");
        //console.log(data[i]);

        console.log("Données CCI objet : ");
        console.log(ligne);
        var adresse = ligne.street_num + " rue " + ligne.street_name + ", " + ligne.city_label;
        console.log('Demande d\'information pour l\' adresse : ','\033[33m', adresse,'\033[0m');

        googleGeoRequest(adresse, function(res){

            var response = JSON.parse(res);
            var info = response.results[0];
            if(response.status == "OVER_QUERY_LIMIT") throw new Error("Limite de requete vers l'API atteinte");
            var n = response.results.length;
            console.log("Resultats : " + n);
            if( n > 1) {
                console.log("ATTENTION : " + n + "resultats possibles");
                console.error("Abandon pour la ligne " + i + " : information ambigue");
                abandon.push(i);
                getNextInfo(data, i, db_client);
            }
            else if( n < 1) {
                console.log("ATTENTION : aucun resultat");
                console.error("Abandon pour la ligne " + i + " : informations manquantes");
                abandon.push(i);
                getNextInfo(data, i, db_client)
            }
            else if (n == 1) {
                //console.log(info);
                /**
                 * TODO : verifier d'eventuels composants manquants
                 */
                console.log("Google adresse : ",'\033[33m', info.formatted_address,'\033[0m');
                console.log("ADD COMP LENGTH " + info.address_components.length);
                console.log("Google address_components :\n",'\033[33m', adresse,'\033[0m');
                //console.log("Google geometry: ", info.geometry);
                console.log("Google info: :\n",'\033[33m', info,'\033[0m');
                var adresse = {};
                var ac = info.address_components;

                for(var j = 0; j < ac.length; j++){
                    switch (ac[j].types[0]){
                        case "street_number" :
                            adresse.num = ac[j].long_name;
                            break;
                        case "route" :
                            adresse.rue = ac[j].long_name;
                            break;
                        case "locality" :
                            adresse.ville = ac[j].long_name;
                            break;
                        case "administrative_area_level_2" :
                            adresse.dept = ac[j].long_name;
                            break;
                        case "administrative_area_level_1" :
                            adresse.region = ac[j].long_name;
                            break;
                        case "country" :
                            adresse.pays = ac[j].long_name;
                            break;
                        case "postal_code" :
                            adresse.postcode = ac[j].long_name;
                            break;
                    }
                }

                var adresse_q_ok = true;

                if( !adresse.num ) {
                    //throw new Error("adresse.num missing");
                    adresse_q_ok = false;
                }
                if( !adresse.rue ) {
                    //throw new Error("adresse.rue missing");
                    adresse_q_ok = false;
                }
                if( !adresse.ville) {
                    //throw new Error("adresse.ville missing");
                    adresse_q_ok = false;
                }
                if( !adresse.dept) {
                    console.warn("adresse.dept defini implicitement");
                    adresse.dept = "Ille-et-Vilaine";
                }
                if( !adresse.region) {
                    console.warn("adresse.region defini implicitement");
                    adresse.region = "Bretagne";
                }
                if( !adresse.pays) {
                    //throw new Error("adresse.pays missing");
                    adresse_q_ok = false;
                }
                if( !adresse.postcode) {
                    //throw new Error("adresse.postcode missing");
                    adresse_q_ok = false;
                }

                if(adresse_q_ok) {
                    //
                    var q = 'INSERT into "public"."Commerce" ('
                            //+"id" + ', '
                        + "line" + ','
                        + "siret" + ', '
                        + "enseigne" + ', '
                        + "rasoc" + ', '
                        + "date_deb_act" + ', '
                        + "date_rad" + ', '
                        + "code_ape" + ', '
                        + "label_ape" + ', '
                        + "zone_ape" + ', '
                        + "label_zone_ape" + ', '
                        + "street_num" + ', '
                        + "street_name" + ', '
                        + "sort_street_name" + ', '
                        + "city_code" + ', '
                        + "city_label" + ', '
                        + "epci2014" + ', '
                        + "phone_num" + ', '
                        + "fax_num" + ', '
                        + "email" + ', '

                        + "street_number" + ', '
                        + "route" + ', '
                        + "city" + ', '
                        + "dptmt" + ', '
                        + "region" + ', '
                        + "country" + ', '
                        + "postal_code" + ', '
                        + "location_lat" + ', '
                        + "location_lng" + ', '
                        + "location_type" + ', '
                        + "google_place_id" + ', '
                        + "vp_ne_lat" + ', '
                        + "vp_ne_lng" + ', '
                        + "vp_sw_lat" + ', '
                        + "vp_sw_lng"
                        + ') '
                        + 'VALUES('
                        + '$1, $2, $3, $4, $5, $6, $7, $8, $9, '
                        + '$10, $11, $12, $13, $14, $15, $16, $17, $18, $19, '
                        + '$20, $21, $22, $23, $24, $25, $26, $27, $28, $29, '
                        + '$30, $31, $32, $33, $34'
                        + ') RETURNING id';
                    var d = [
                        i,              //Numero ligne
                        data[i][0], 	//Siret
                        data[i][1],  	//Enseigne
                        data[i][2], 	//Raison sociale
                        exelDate(data[i][3]),  	//Date début activité
                        exelDate(data[i][4]), 	//Date radiation
                        data[i][5], 	//Code APE
                        data[i][6], 	//Libellé code APE
                        data[i][7],  	//Zone appartenance APE
                        data[i][8], 	//Libellé zone appartenance APE
                        data[i][9], 	//Numéro de voie
                        data[i][10], 	//Nom de voie
                        data[i][11], 	//Tri Nom de voie
                        data[i][12], 	//Commune
                        data[i][13], 	//Libellé commune
                        data[i][14], 	//EPCI 2014
                        data[i][15], 	//Téléphone
                        data[i][16], 	//Fax
                        data[i][17],	//Email

                        adresse.num, //num
                        adresse.rue, //rue
                        adresse.ville, //ville
                        adresse.dept, //dept
                        adresse.region, //region
                        adresse.pays, //pays
                        adresse.postcode, //postcode

                        info.geometry.location.lat, //
                        info.geometry.location.lng, //
                        info.geometry.location_type, //
                        info.place_id, //
                        info.geometry.viewport.northeast.lat, //
                        info.geometry.viewport.northeast.lng, //
                        info.geometry.viewport.southwest.lat, //
                        info.geometry.viewport.southwest.lng //

                    ];
                    //enregistrement bdd
                    db_client.query(
                        q,
                        d,
                        function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('row inserted with id: ' + result.rows[0].id);
                            }
                        });
                    //appel recursif e la fonction
                    /*
                     rl.question("Continuer ? (y/n) : ", function(answer) {
                     //var limit = 10;
                     var limit = data.length;
                     i++;
                     if(answer == "n") {
                     db_client.end();
                     rl.close();
                     }
                     else {
                     if(i < limit) getInfo(data, i, db_client);
                     else {
                     db_client.end();
                     console.log("Terminé");
                     }
                     }
                     });*/
                    getNextInfo(data, i, db_client);
                }
                else{
                    console.error("Abandon pour la ligne " + i + " : informations d'adresse manquantes");
                    abandon.push(i);
                    getNextInfo(data, i, db_client);
                }
            }


        })

    }
    else{
        console.error("Abandon pour la ligne " + i + " : informations manquantes");
        abandon.push(i);
        var limit = data.length;
        i++;
        if(i < limit) setTimeout(getInfo, 300, data, i, db_client)
        else {
            //db_client.end();
            console.log("Terminé");
            console.log("lignes ommises : ", abandon);
        }
    }
}



function exelDate(date){
    if (date){
        var d = (new Date(Math.round((date - 25569)*86400*1000))) ;
        return d.toISOString();
    }
    else return undefined;
}
function googleGeoRequest( adresse, reponse_callback ) {
    var parameters = {
        address:adresse,
        key:key,
        language:"fr",
        region:"fr"
    };
    var chaine_requete = qs.stringify(parameters);
    console.log("Chaine requete : " + chaine_requete);
    var options = {
        host: 'maps.googleapis.com',
        port: 443,
        path: '/maps/api/geocode/json?' + chaine_requete
    };
    var requete_google = https.request(options, function(reponse_google) {
        console.log("Status header : " + reponse_google.statusCode);
        var buffer_reponse_google_json = "";
        reponse_google.on('data', function(data) {
            buffer_reponse_google_json += data;
        });
        reponse_google.on('end', function () {
            //console.log(buffer_reponse_google_json);
            reponse_callback(
                buffer_reponse_google_json
            );
        });
    });
    requete_google.end();
}