var nombreNouveauxCommerces = 0;
var nbElements = 0;
var commercesNew;
var champs = ["num_line", "siret", "enseigne", "rasoc", "date_debut_act", "date_rad", "code_ape", "label_ape", "zone_ape", "label_zone_ape", "street_num", "street_name", "city_code", "city_label", "phone_num", "email", "activite"];
var champsA = ["id", "sort_street_name", "epci2014", "street_number", "route", "city", "dptmt", "region", "country", "postal_code", "location_lat", "location_lng", "google_place_id", "vp_ne_lat", "vp_ne_lng", "vp_sw_lat", "vp_sw_lng", "description", "website", "email", "facebook", "instagram", "fax_num", "tag0", "tag1", "tag2", "tag3", "image", "db_add_date"];
var champsHits = ["tag0","tag1","tag2","tag3","email","website", "description", "website", "fax_num"];
var nouveauxCommerces = []; //liste des nouveaux commerces
var toRemoveCommerces = []; //liste des commerces à supprimer
var blacklist; //La Blacklist
var blackListNew = []; //La liste des nouveaux commerces blacklistés
var infoUpdate = {};

function lancerParse(evt)
{
	var file = evt.target.files[0];	
	console.log("---- Lancement du Parseur ------");
	var reader= new FileReader();
	var name = evt.name;
	var commercesBDD;

	//Attention, le onload est executé apres le readAsBinaryString
	//et ce, à un moment random
	reader.onload = function(e)
	{

		var data = e.target.result;
		var workbook = XLSX.read(data, {type: 'binary'});
		commercesNew = commercesFichierCourrant(workbook);
		
	}
	reader.readAsBinaryString(file); //execute le onload


	//Après le parse du Document xlsx
	reader.onloadend = function(e)
	{
		console.log("Recupération des infos des commerces");	
		$("#purcent span").text("0%");
		$("#etape").text("Récupération des informations serveur")
		var start = new Date().getTime();
		$.ajax({
			url:"/api/bo/commerces.json",
			dataType: "json",
			async:false,
			methode:"GET",
			success:function(data, textstatus, request){
				commercesBDD = data;
			},
			error:function(request, status, error)
			{
				showError("Une erreur s'est produite pendant la récuperation des informations de la BDD. <br/>Etes-vous bien connecté au Back-Office en mode administateur ?");
				throw new Error("Erreur "+error);
			}

		});
		var end = new Date().getTime();
	
		//On prépare le serveur pour l'ajout de nouvelles images
		$.ajax({
		
			url:"/uploadImages/init.php"
			
		})



		//Ici, on récupère la blacklist des commerces
		console.log("Récupération de la BlackList")
		$.ajax({
			url:"/api/bo/blacklists.json",
			dataType: "json",
			async:false,
			methode:"GET",
			success:function(data, textstatus, request){
				blacklist = data;
			},
			error:function(request, status, error)
			{
				showError("Une erreur s'est produite pendant la récuperation des informations de la BDD. <br/>Etes-vous bien connecté au Back-Office en mode administateur ?");
				throw new Error("Erreur "+error);
			}

		});
		$("#purcent span").text("100%");
		console.log ("Requete executée en "+(end - start)+" ms");

		//A partir d'ici nous avons dans commercesBDD tous les commeres
		//présent dans la BDD actuelle, et dans commercesNew 
		//les commerces présents dans le fichier xlsx
		toRemoveCommerces = getCommercesToRemove(commercesBDD, commercesNew); //Liste des commerces à supprimer
		
		infoUpdate.lxlsx = commercesNew.length;

		commercesNew = addNewValuesToCurrentObjectBDD(commercesBDD, commercesNew); //Liste des commerces existants mise à jour		
			
		console.log(toRemoveCommerces.length+" magasins marqués à supprimer")

		//Appel à Google maps
		commercesNew = getAllCoords(commercesNew, nouveauxCommerces); //Permet de mettre à jour les nouveaux commerces
		
		//Ajout d'infos pretes à etre affichées
		infoUpdate.toRemove = toRemoveCommerces.length;
		infoUpdate.lbdd = commercesBDD.length

		//Affichage
		displayTable(nouveauxCommerces); //Permet la modification des nouveaux commerces

		//Test pour l'ajout d'un nouveau commerce
		$("body").prepend("<div id='validation'><input type='submit' value='Valider les modifications' name='validation' /></div>");
		
		//On ajoute l'action lorsque les modifications sont effectuées
		$("#validation input[name='validation']").on("mouseup", function()
		{
			var c = confirm("Ces données vont être ajoutées à la base de donnée");
	
			if(c)
			{
				//Attention à bien respecter cet ordre : modification, creation, suppression
				var old = extractVieuxMagasins(commercesNew, nouveauxCommerces);	
				modifyAll(old);
				createAllNew(nouveauxCommerces);
				supprimerCommerces(toRemoveCommerces);

				//TODO Suppression des magasins dans les parcours predefinis + en informer l'utilisateur
				console.log("----- Suppression des magasins inexistants dans les Parcours Predefinis -----")
				supprimerDansPredef(toRemoveCommerces, nouveauxCommerces);

				//On demande au serveur d'ajouter les images (on contourne la gem carrierwave)

				$.ajax({
					
					url:"/uploadImages/update.php"
					
				})



				
			}
			else
			{	
				console.log("L'utilisateur souhaite continuer les modifications");	
			}


		});
		
		//createAllNew(nouveauxCommerces);


	}//fin onloadend



	
}

//Fonction qui va extraire les commerces et leurs infomations
//du fichier XLSX ci-joint
//Retourne un tableau d'objets commerces au format JSON
//

function commercesFichierCourrant(workbook)
{
	var feuille = workbook.Sheets["Feuil1"];
	var commerces = [];
	var i = 1;
	var l = 0;
	var offset = 0;

	//On ajuste l'indice i pour qu'il tombe sur le premier siret réel
	while(true)
	{
		if(typeof feuille['A'+i] != "undefined")
		{
			if(feuille['A'+i].v != "Siret")
			{
				break;	
			}
		}
		i++;	
	}
	offset = i;
	l = 0;
	console.log("Le fichier commence à l'indice "+i);


	//On recupere les informations du fichier xlsx
	//et on les ajoutent dans une variable commerce que l'on ajoutera
	//à un tableau de commerces contenant tous ces "commerce" 
	//si le champ enseigne n'est pas rempli, on met la RASOC (Raison Sociale)
	try
	{
		while(typeof feuille['A'+i] != "undefined")
		{
			if(typeof feuille["E"+i] == "undefined")
			{
				var commerceCourrant = {};
				var num_line = l;
				var siret          = typeof feuille["A"+i] == "undefined" ? "" : feuille["A"+i].v;
				var rasoc          = typeof feuille["C"+i] == "undefined" ? "" : feuille["C"+i].v;
				var enseigne       = typeof feuille["B"+i] == "undefined" ? "" : feuille["B"+i].v;
				var date_debut_act = typeof feuille["D"+i] == "undefined" ? "" : convertToDate(feuille["D"+i].v);;
				var date_rad       = typeof feuille["E"+i] == "undefined" ? "" : convertToDate(feuille["E"+i].v);
				var code_ape       = typeof feuille["F"+i] == "undefined" ? "" : feuille["F"+i].v;
				var label_ape      = typeof feuille["G"+i] == "undefined" ? "" : feuille["G"+i].v;
				var zone_ape       = typeof feuille["H"+i] == "undefined" ? "" : feuille["H"+i].v;
				var label_zone_ape = typeof feuille["I"+i] == "undefined" ? "" : feuille["I"+i].v;
				var street_num     = typeof feuille["J"+i] == "undefined" ? "" : feuille["J"+i].v;
				var type_voie      = typeof feuille["K"+i] == "undefined" ? "" : feuille["K"+i].v;
				var street_name    = typeof feuille["L"+i] == "undefined" ? "" : feuille["L"+i].v;
				var city_code      = typeof feuille["M"+i] == "undefined" ? "" : feuille["M"+i].v;
				var city_label     = typeof feuille["N"+i] == "undefined" ? "" : feuille["N"+i].v;
				var phone_num      = typeof feuille["O"+i] == "undefined" ? "" : feuille["O"+i].v;
				var email          = typeof feuille["P"+i] == "undefined" ? "" : feuille["P"+i].v; 
				var activite       = typeof feuille["Q"+i] == "undefined" ? "" : feuille["Q"+i].v;


				//On complete notre tableau associative pour le commerce
				//des valeurs nouvellement crées
				commerceCourrant["num_line"] = l;
				commerceCourrant["siret"] = siret;
				commerceCourrant["enseigne"] = enseigne;
				commerceCourrant["rasoc"] = rasoc;
				commerceCourrant["date_debut_act"] = date_debut_act;
				commerceCourrant["date_rad"] = date_rad;
				commerceCourrant["code_ape"] = code_ape;
				commerceCourrant["label_ape"] = label_ape;
				commerceCourrant["zone_ape"] = zone_ape;
				commerceCourrant["label_zone_ape"] = label_zone_ape;
				commerceCourrant["street_num"] = street_num;
				commerceCourrant["street_name"] = type_voie +" "+street_name;
				commerceCourrant["city_code"] = city_code;
				commerceCourrant["city_label"] = city_label;
				commerceCourrant["phone_num"] = phone_num;
				commerceCourrant["email"] = email;
				commerceCourrant["activite"] = activite;
				var k = 0;
				while(k < champsA.length)
				{
					commerceCourrant[champsA[k]] = "";
					k++;
				}
				commerces.push(commerceCourrant);
				l++;
			}
			
			i++	
			
		}
			
		
	}
	catch(err)
	{
		
		console.log("Erreur : "+ err);
		
		
	}
	
	console.log("Fin de la lecture du fichier, en "+ i +" iteractions");	
	nbElements = i - offset;
	return commerces;
	


}

	
//Converti la date du format 13/1/2010 en une date 2010-1-13
function convertToDate(date)
{

	if(date == "null" || date == "") return "";
	var _date = "";
	
	var _dateret = ""; //La date effective à retourner
	try
	{
		_date = XLSX.SSF.parse_date_code(date);		
		_dateret = _date.y + '-' + convertToTwoNumbersDate(_date.m) + '-' + convertToTwoNumbersDate(_date.d);
	}
	catch(err)
	{
		console.log("Erreur "+err);	
		return _date;
	}

	return _dateret;
	
}
//Permet de convertir un jour ou un mois de 1 à 9 en 01 à 09
function convertToTwoNumbersDate(d)
{
	if(d <= 9) return '0'+d;	
	else return d;
}

//Fonction qui va ajouter les nouveaux elements dans l'Objet de BDD courrant si les champs
//ne sont pas nulls, on se base sur le siret
//Mets également à jour le tableau nouceauxCommerces
function addNewValuesToCurrentObjectBDD(bdd,current)
{
	
	console.log( "Il y a : "+(current.length + 1 - bdd.length) + " lignes différentes" );

	var i = 0;
	var j = 0;
	var k = 0;
	var nbBl = 0;

	console.log("Debut de la mise a jour dans l'object BDD ");
	var start = new Date().getTime();


	while(i < current.length)
	{
		var siret = current[i].siret;
		var trouve = false;
		j = 0;
		k = 0;
		if(current[i].date_dat != null)
		{
			//on le supprime de la base s'il a une date_rad
			current.splice(i, 1);	
		}
		else
		{
			
			while(j < bdd.length && !trouve)
			{
				//Si on l'a trouvé dans les anciens :
				if(siret == bdd[j].siret)	
				{
					trouve = true;
					while(k < champs.length)
					{
						var champsCurrent = champs[k]
						if(current[i][champsCurrent] == "")
						{
							//Si le champ de la nouvelle base est nul, on met l'ancien 	
							if(bdd[j][champsCurrent] != "" && bdd[j][champsCurrent] != null) current[i][champsCurrent] = bdd[j][champsCurrent];
							
						}
					
						k++;
					}
					k = 0;

					//on ajoute les champs non "basiques"
					while(k < champsA.length)
					{
							
						if ( bdd[j][champsA[k]] != null && bdd[j][champsA[k]] != "")
						{
							current[i][champsA[k]]	= bdd[j][champsA[k]]
						}
						k++;
					}
				}
				
				j++	
			}
			if(!trouve)
			{
				//On teste s'il n'est pas dans la blacklist
				var bl = false;
				for(var b = 0; b < blacklist.length; b++)
				{
					if (blacklist[b].siret == current[i].siret)
					{
						console.log("(blacklisté)")
						nbBl++;
						bl = true;
					}
				}
				if(!bl)
					nouveauxCommerces.push(current[i]);
				trouve = false;
			}
		}
		
		i++;	
	}


	var end = new Date().getTime();
	var time = end - start;
	infoUpdate.bl = nbBl;
	console.log("fini en : "+time+" ms");
	return current;	
}

//Permet d'afficher les resultats de certaines erreurs dans la petite balise prévue à cet effet
function showError(str)
{
	$("#error").html(str);
	$("#error").show(200);
	
}

//Permet d'afficher les entrées du tableau sous forme de 'table' dans le code HTML
//Ceci permet d'editer les categories des nouveaux magasins en live avant l'envoi en BDD
//afin d'eviter d'avoir à les chercher par la suite pour le faire
function displayTable(current)
{
	var sscats;

	//Requete pour recuperer les sscategories
	$.ajax({
		url:"/api/?req=sscatAll&format=json",
		dataType:"json",
		async:false,
		success:function(data){sscats = data}
	});




	str = "<table style='table-layout:fixed'><tbody  style='position:abolute;left:0;top:0;width:100%'>";
	var tags = ["tag0", "tag1", "tag2", "tag3"];
	var champsEditables = ["description","website","email","facebook","instagram","fax_num"];
	var v = 0;
	var hits = 0;
	var miss = 0;
	var infos;
	var hit = false;

	
	for(i = 0; i < current.length; i++)
	{
		if(i % 2 == 0)
			str += "<tr>";
		else
			str += "<tr style='background-color:Bisque'>";
		hit = false;

		//On vérifie que nous n'avons pas déja des valeur prédefinies
		//Si par exemple le nom est le meme mais que seul le siret a changé...
		//En effet, ce dernier est marqué à supprimer et comme nouveau bien que des infos
		//peuvent le compléter
		
		$.ajax({
			url:"/api/?req=spec&nom="+current[i].enseigne+"&format=json",
			dataType:"json",
			async:false,
			success:function(data)
			{
				//On teste si data n'est pas null !
				if(data.commerce != null)
				{
					hits++;
					infos = data.commerce;
					hit = true;
				}
				else
				{
					miss++;	
				}
			}
			
		});

		//if(hit) console.log(infos)

		//Bouton de BlackList
		//Si on clique dessus, on ajoute son SIRET dans un tableau temporaire
		//et on ne l'uploadera pas par la suite
		str += "<td  style='border:1px solid black;font-size:12px' ><input name='blist' type='button' value ='Blacklister'/></td>"
		
		for(k = 0; k < champs.length; k ++)
		{
			if(champs[k] != 'enseigne')
			{
				str += "<td style='border:1px solid black;font-size:12px'>";	
				str += current[i][champs[k]];
				str+= "</td>";
			}
			else
			{
				str += "<td style='border:1px solid black;font-size:12px' > ";	
				str += "<input type='text' id='"+i+"' name='enseigne' value='"+(hit ? infos.enseigne.toUpperCase() : current[i].enseigne.toUpperCase())+"' />";
				str += "</td>";
			}
		}
		for(k = 0; k < champsA.length; k++)
		{
			str += "<td style='border:1px solid black;font-size:12px'>";	
			if(inArray(champsA[k], tags))
			{
				//Generation de champs pour les tags
				//C'est normal qu'il y ait des suggestions pour les nouveaux commerces !
				//en fait on va chercher s'il existait deja une enseigne du meme nom, on récupere les infos basiques (tags, mail, facebook, instagram...)
				//et on les ajoutent automatiquemnt au nouveau commerce de meme nom. C'est plus homogène par la suite mais il est
				//toujours possible de modifier ces champs, à la main !

				str += "<select id='"+i+"' name='"+champsA[k]+"'>"
				var strsscats = "";
				var sel = -1;
				if(hit)
				{
					sel = infos[champsA[k]];
				}
				else
				{
					sel = 0;	
				}
				for(v = 0; v < sscats.size; v++)
				{
					strsscats += "<option value='"+sscats.sscategories[v].id+"' "+(sel == sscats.sscategories[v].id ? 'selected' : '')+" >"+sscats.sscategories[v].nom+"</option>";			
				}
					str += strsscats+"</select>";
			}
			else if(inArray(champsA[k], champsEditables))
			{
				//Les champs input text
				var c = (hit ? infos[champsA[k]] : '');
				if(c == null || c == "null") c = ""
				str += champsA[k]+":<br/> <input type='text' id='"+i+"' name='"+champsA[k]+"' value='"+(hit ? infos[champsA[k]] : '')+"' /> "		
			}
			else if(champsA[k] == "image")
			{
				str += "image: <br/>";
				str += "<form methor='POST' action='#' enctype='multiplart/form-data' id='image'>";
				str += "<input type='hidden' name='titre' />";
				str += "<input type='hidden' name='num_line' />";
				str += "<input type='file' name='image' id='"+i+"' /><input type='submit' value='ok' />";
				str += "</form>";

			}
			else
			{
				str += champsA[k]+":<br/>"+current[i][champsA[k]];		
			}

			str+= "</td>";

		}

		str+="</tr>";
	}
	console.log("hits : "+hits+", miss : "+miss)
	str += "</tbody></table>";
	$("#proposeImport").hide();
	$("body").append(str);
	
	//Actions sur les images
	//Il n'y a pas trop de sécurité coté JS, tout est coté Serveur
	
	$("form[id='image'").on("submit",function(e){
		var index = $(this).closest("tr").index();
		var num_line = $("tr:eq("+index+") td:eq(1)").text();// En cas d'ajout de TD, merci de le faire après !
		var titre = $("tr:eq("+index+") td:eq(3)").find("input").val();// En cas d'ajout de TD, merci de le faire après !	
		e.preventDefault();
			
		if(titre == "")
		{
			alert("Veuillez renseigner un nom d'enseigne avant d'envoyer l'image !")	
		}
		else if($(this).find("input[name='image']").val() == "")
		{	
			alert("Il faut choisir une image en cliquant sur le bouton 'parcourir'");	
		}
		else
		{

			//On rempli les champs hidden du formulaire
			$(this).find("input[name='titre']").val(titre);
			$(this).find("input[name='num_line']").val(num_line);


			var formData = new FormData($(this)[0]);

			//On procède à l'envoi
			$.ajax({
				url:'/uploadImages/send.php',
				type:'POST',
				data:formData,
				async:false,
				success:function(data)
				{
					console.log("Le serveur a retourné: "+data)
					if(data == "pasok")
					{
						alert("une erreure interne est survenue...")	
					}
					else
					{
						nouveauxCommerces[index]["image"] = data;	
						console.log(nouveauxCommerces[index]);
					}
				},
				cache:false,
				contentType:false,
				processData:false
			
			})
			
		}

		return false;
			
	})



	$("select").on('change', function()
	{
		commercesNew[current[$(this).attr('id')].num_line][$(this).attr('name')] = $(this).find("option:selected").attr("value");	
		//On ajoute aux nouveaux commerces la modification
		var index = $(this).closest("tr").index();
		nouveauxCommerces[index][$(this).attr('name')] = $(this).find("option:selected").attr("value");

	});
	$("input[type='text']").on("keyup paste change click input",function(e){
		var val = $(this).val();
		commercesNew[current[$(this).attr('id')].num_line][$(this).attr('name')] = val;
		
		//On ajoute aux nouveaux commerces la modification
		var index = $(this).closest("tr").index();
		nouveauxCommerces[index][$(this).attr('name')] = val;
	})
	$("input[type='text']").each(function(e){
		if($(this).val() == "null" || $(this).val() == "undefined")
		{
			$(this).val("");	
		}
	})
	
	//Actions sur la blacklist
	$("tr input[name='blist']").on("click", function(e){
		toBlacklist($(this).closest("tr").index());	
	});	

	for(var j = 0; j < nouveauxCommerces.length; j++)
	{
		nouveauxCommerces[j]["tag0"] = $("tr:eq("+j+")").find("select[name='tag0'] option:selected").attr("value");
		nouveauxCommerces[j]["tag1"] = $("tr:eq("+j+")").find("select[name='tag1'] option:selected").attr("value");
		nouveauxCommerces[j]["tag2"] = $("tr:eq("+j+")").find("select[name='tag2'] option:selected").attr("value");
		nouveauxCommerces[j]["tag3"] = $("tr:eq("+j+")").find("select[name='tag3'] option:selected").attr("value");
	}

	//On prépare les informations à montrer à l'utilisateur
	var strinfos = "";
	strinfos += "<h4>Informations concernant la mise à jour :</h4><br/>";
	strinfos += "<table><tr><th>Infos</th><th>Nombre de commerces</th><th>Description</th></tr>";
	strinfos += "<tr><td>A supprimer</td><td>"+infoUpdate.toRemove+"</td><td>C'est le nombre de commerces qui vont disparaitre lors de la mise à jour</td></tr>";
	strinfos += "<tr><td>A ajouter</td><td>"+infoUpdate.toCreate+"</td><td>C'est le nombre de commerces qui vont être crées lors de la mise à jour</td></tr>";
	strinfos += "<tr><td>Taille de la BDD</td><td>"+infoUpdate.lbdd+"</td><td>C'est le nombre de commerces que vous possédez actuellement en base de donnée</td></tr>";
	strinfos += "<tr><td>Taille du fichier XLSX</td><td>"+infoUpdate.lxlsx+"</td><td>C'est le nombre de commerces que contient ce nouveau fichier</td></tr>";
	strinfos += "<tr><td>Nombre de commerces Blacklistés</td><td>"+infoUpdate.bl+"</td><td>C'est le nombre de commerces détéctés comme Blacklistés</td></tr></table>";
	strinfos += "<input type='submit' name='valideInfos' value=\"D'accord !\"/>";
	$("#fondNoir").show();
	$("#feedback").show();
	$("#feedback").html(strinfos);
	$("input[name='valideInfos']").on("click",function()
	{
		$("#fondNoir").hide();
		$("#feedback").hide();
	})

}

//vérifie si le needle est dans le tableau arr
function inArray(needle, arr)
{
	var i = 0;

	while (i < arr.length)
	{
		if (arr[i] == needle) return true;
		i++;	
	}
	return false;
	
}

//Récupère la liste des commerces qui sont à supprimer
function getCommercesToRemove(commercesBDD, commercesNew)
{
	var ret = [];
	var i = 0;
	var j = 0;
	
	while(i < commercesBDD.length)
	{
	    var	trouve = false;
		var daterad = false;
		j = 0;
		if(commercesBDD[i].enseigne != "LES HALLES")
		{
			while(j < commercesNew.length)
			{
				
				if(commercesBDD[i].siret == commercesNew[j].siret)
				{
					//Le magasin existe dans la nouvelle base, on passe
					trouve = true;
					break;
				}
				else if(commercesBDD[i].date_rad != null)
				{
					daterad = true;
					break;
				}
				j++;
				
			}
			if(trouve == false || daterad)
			{
				//Si c'est à faux, on l'ajoute à notre tableau de retour	
				ret.push(commercesBDD[i]);
			}
		}
		
		i++;	
	}
	
	return ret;
	
}


//Récupère les anciens magasins déja présent dans la bdd
function extractVieuxMagasins(commercesNew, nouveauxCommerces)
{
	var i = 0;
	var j = 0;
	var ret = commercesNew;

	while (i < nouveauxCommerces.length)
	{
		j = 0;
		
		while(j < commercesNew.length)
		{
			if(nouveauxCommerces[i].siret == commercesNew[j].siret)
			{
				ret.splice(j,1);
				break;
				
			}
		
			j++
		}
		
		i++;
	}
	
	
	return ret;	
	
}

//La fonction qui va blacklister les nouveaux commerces
function toBlacklist(i)
{
	var nom = $("table tr:eq("+i+") td:eq(3)").find("input").val()
	var siret = $("table tr:eq("+i+") td:eq(2)").text()
	var rasoc = $("table tr:eq("+i+") td:eq(4)").text()
	var c = confirm("Voulez-vous vraiment Mettre en liste noire le commerce : "+nom+" ?");
	
	if(c) //Si l'utilisateur a choisi oui
	{
		var pageFull;
		//La sentence est prononcée	
		$.ajax
		({
			url:"/api/bo/blacklists/new",		
			async:false,
			method:"GET",
			dataType:"HTML",
			success: function(data)
			{
				pageFull = data;
			},
			error: function(err)
			{
				console.log("Erreur lors de la récupération de la page NEW: "+err);
				throw new Error("Impossible de relever la page NEW")
			}
			
		});

		//On crée un formulaire temporaire sur la page
		var domPage = document.createElement("div");
		domPage.innerHTML = pageFull;
		var domForm = domPage.getElementsByTagName("form");
		var formObj = jQuery(domForm).serializeObject();

		formObj._method = "POST"
		formObj.blacklist.enseigne = nom;
		formObj.blacklist.siret = siret;
		formObj.blacklist.rasoc = rasoc;

		$.ajax
		({
			url:"/api/bo/blacklists",
			method:"POST",
			data:formObj,
			async:false,
			dataType:"json",
			success:function()
			{
				alert("Commerce ajouté à la liste noire.")
				console.info("commerce Blacklisté")	
			},
			error:function()
			{
				console.log("Erreur, impossible de l'ajouter !")	
			}
			
		})

		
		blackListNew.push(siret);
		$("table tr:eq("+i+") input[name='blist']").attr("disabled", "disabled")
		$("table tr:eq("+i+") ").animate({"background-color":"rgb(100,100,100)"}, 400);

	}
}





















