
//La magasin appelable de partout. Elle va permettre d'afficher un magasin
//sans avoir à rediriger l'utilisateur en le forçant à refaire une requete GOOGLE API
//Sur le long terme on passe d'environ 10 requetes api google à ... une !
var id;
var http = "http://"
var https = "https://"
var descraffiche = false;
var form_validate = {
	  required: function (value) {
	    return value.trim().length ? true : false;
	  }
};

$(document).ready(function(e){
	
	checkIfImplemented();
	$("#pageSpec").hide(0);
	
});

function checkIfImplemented()
{
	if($("#pageSpec").length == 0)
	{
	
	//S'il n'y a pas les balises pour le rendu de notre page, on l'ajoute directement.
	$("body").append("<div id='loaderDescr'><img src='/public/images/loading.gif' /></div>");
	
	$("body").append("<div id='pageSpec'>"
		+ "<div id='close'></div>"
		+ "<div id='topSpec'><div id='cadreImg'><img src='' /></div><div id='sscat'></div></div>"
		+ "<div id='midSpec'></div>"
		+ "<div id='botSpec'></div>"
		+ "</div>");
	$("#loaderDescr").hide();
	$("#contact-us").css({"width" : "50px", "margin-left": "70%"});
		
	}
}

function afficheSpecificationMagasin()
{
	
	//Récupère les parametres de l'URL
	if(descraffiche == false)
	{
		$("#loaderDescr").show(400, function(){
			id = sessionStorage.getItem("currentMagasin");
			sessionStorage.removeItem("currentMagasin");
			
			//On cache la page active 
			$(".ui-page-active").hide();
			//On vire les anciens résultats:
			$("#cadreImg").html("");
			$("#midSpec").html("");
			$("#botSpec").html("");
			$("#sscat").html("");
			
			//On check que les boutons "boutonsParcours" soient bien jartés
			$("#boutonsParcours").hide();
			var data = api.getCommDetail(id);
			
			//Faire un truc
			var url = "http://rpoch.istic.univ-rennes1.fr/static/images/";
			
			//Si l'image est à null
			try
			{
				$("#cadreImg").append("<img src='"+url+basename(data.commerce.image.url)+"' />");
				
			}
			catch(err)
			{
				$("#cadreImg").append("<img src='"+url+"noimage.jpg' />");
				console.log("Erreur: "+err);
			}
			
			//Si le tag0 n'est pas renseigné
			var icon = "";
			try
			{
				icon = findSSCat(data.commerce.tag0,0) + "_256.svg";
			}
			catch(err)
			{
				icon = "cat13_256.svg";
				console.log("Erreur: "+err);
			}
			
			//Si le texte de description n'est pas renseigné
			var descr = "";
			try
			{
				descr = data.commerce.description;
				if(descr == null || descr == "" || descr == "null" || descr == " ")
				{
					descr = "(Aucune description disponible)";
					console.log("champ de description non renseigné");
				}
			}
			catch(err)
			{
				descr = "(Aucune description disponible)";
				console.log("Erreur: "+err);
			}
			var hor = "";
			try{
				var time = api.getHorraires(data.commerce.id);
				if(time.horairesok){
					if(time.ouvert){
						if (time.continu){
							var min1 =((time.horaires[1]==0)? " - ": time.horaires[1]+" - ");
							var min2 =((time.horaires[3]==0)? "": time.horaires[3]+" ");
							hor = time.horaires[0] +"H "+ min1 +time.horaires[2] +"H " + min2; 
							console.log(hor);
						}else {
							var min1 =((time.horaires[1]==0)? "": time.horaires[1]+"  ");
							var min2 =((time.horaires[3]==0)? "": time.horaires[3]+" - ");
							var min3 =((time.horaires[5]==0)? "": time.horaires[5]+"  ");
							var min4 =((time.horaires[7]==0)? "": time.horaires[7]);
							hor = time.horaires[0] +"H "+min1 +" "+ time.horaires[2] +"H " +min2 + time.horaires[4] +"H "+min3 +" "+ time.horaires[6] +"H " +min4; 
						}
					}else{
						hor = "Fermé Aujourd'hui"
					}
				}else{
					hor ="Horaires non renseignes"
				}
			}catch(err){
				console.log("Erreur: "+err);
			}
			
			$("#sscat").append("<img src='/public/images/"+icon+"' />");
			
			$("#midSpec").append("<div class='titre' >"+convertirEnLisible(data.commerce.enseigne)+"</div>");
			$("#midSpec").append("<div class='addresse' >"+(data.commerce.street_number+" "+data.commerce.route).toUpperCase()+"</div>");
			$("#midSpec").append("<div class='bordureBot'></div>");
			$("#midSpec").append("<div class='description'>"+descr+"</div>");
			$("#botSpec").append("<div class='horaires' style='text-shadow:none;'>"+hor+"</div>");
			$("#botSpec").append("<div class='bordureBot'></div>");
			$("#botSpec").append("<div class='telephone'><img src='/public/images/svg/phone.svg' /> <span><a style='color:white;text-shadow:none;' title='Call' href='tel:"+data.commerce.phone_num+"'>"+data.commerce.phone_num+"</a></span></div>");
			$("#botSpec").append("<div class='bordureBot'></div>");
			
			
		

			
			if(data.commerce.website != null){
				if(data.commerce.website != "")
					if(data.commerce.website.indexOf(http) > -1 || data.commerce.website.indexOf(https) > -1 ){
						$("#botSpec").append("<div class='website' style='text-shadow:none;'><a onclick='Rho.System.openUrl(\""+data.commerce.website+"\")'>"+data.commerce.website+"</a></div>");
					}else{
						tmp = http+data.commerce.website;
						$("#botSpec").append("<div class='website' style='text-shadow:none;'><a onclick='Rho.System.openUrl(\""+tmp+"\")'>"+data.commerce.website+"</a></div>");

					}
					
				
			}
			
			$("#botSpec").append("<div class='bordureBot'></div>");
			
			
			//DEBUT "LAISSEZ UN COMMENTAIRE"
			$("#botSpec").append("<div id ='com' class='commentaire'>laissez un commentaire</div>");
			
			var comment = false;	
			
			$("#com").on("click", function () {
				if(!comment){
					comment = true;
					var note = 0;
				$("#pageSpec").append("<div id='commentWindow'></div>");
				$("#commentWindow").append("<div style='float:left;width:100%' ><ul>"
					+" <li class='comlist' ><div class='checkWrap'><input type='checkbox' name='selector' value='1'></div></li> "
					+" <li class='comlist' ><div class='checkWrap'><input type='checkbox' name='selector' value='2'></div></li>"
					+" <li class='comlist' ><div class='checkWrap'><input type='checkbox' name='selector' value='3'></div></li>"
					+" <li class='comlist' ><div class='checkWrap'><input type='checkbox' name='selector' value='4'></div></li>"
					+" <li class='comlist' ><div class='checkWrap'><input type='checkbox' name='selector' value='5'></div></li>"
					+"</ul>");
					
				$("#commentWindow").append("<textarea id='com-body' name='com-body' style='float:left;width:100%;margin-top:45px' placeholder='Commentaires' class='form-control' rows='5'></textarea>");
				
				$("#commentWindow").append("<div><button id='cancel' class='btn btn-default cancel' >Annuler</button>"
					+"<button id='send' class='btn btn-primary' >Envoyer</button></div>");
				
				//On ajuste le centre de la div
				var wdth = $("#commentWindow").width();
				$("#commentWindow").css("left", "50%");
				$("#commentWindow").css("margin-left", "-"+(wdth/2)+"px");
				
				//Actions sur les �toiles
				$(".checkWrap").on("click",function(e)
				{
					var index = $(this).closest("li").index();
					note = 0;
					
					
					
					if($(this).find("input[type='checkbox']").is(":checked") == false && index == 0)
					{
						note = 0;
						$(this).find("input[type='checkbox']").prop('checked',false);
						$(this).closest(".checkWrap").css('background-image','url("/public/images/starnot.png")');
						$("#commentWindow input[type='checkbox']").each(function(){
							$(this).prop('checked',false);
							$(this).closest(".checkWrap").css('background-image','url("/public/images/starnot.png")');
						})
					}
					else
					{
						//ANIMATION DE DISPARITION
						$("#commentWindow input[type='checkbox']").each(function(i){
							
							$(this).closest(".checkWrap").stop().delay(i * 100).animate({"opacity":"0","width":"32px","height":"32px"},300,'swing');
							
						});
						
						//ANIMATION D'APPARITION
						$(this).closest(".checkWrap").promise().done(function(){
							$("#commentWindow input[type='checkbox']").each(function(i){
								
								$(this).closest(".checkWrap").css({"opacity":"0"});
								
								if($(this).closest("li").index() <= index)
								{
									$(this).prop('checked',true);
									$(this).closest(".checkWrap").css('background-image','url("/public/images/star.png")');
								}
								else
								{
									$(this).prop('checked',false);
									$(this).closest(".checkWrap").css('background-image','url("/public/images/starnot.png")');
									
								}
								$(this).closest(".checkWrap").css({"width":"32px","height":"32px"});
								$(this).closest(".checkWrap").stop().delay(i * 150).animate({"opacity":"1","width":"64px","height":"64px"}, 300)
							})
						})
						note = index + 1;
					}
					
					console.log(note)

						
				})
			
				$("#send").on("click", function(){
					console.log("note" + note);
					if(note >= 0 ){
						var com = "" +document.getElementById("com-body").value.toString();
						var idtel = getPhoneid();
						var idshop = data.commerce.id;
						
						var res = api.addNote(com,idtel,idshop,note);
						
						
						removeElem("pageSpec","commentWindow");
						$("#pageSpec").append("<div id='commentWindow' style='top:70px; z-index:1000000; text-align:center;'></div>");
						$("#commentWindow").append(res.error);
						
						setTimeout(function(){removeElem("pageSpec","commentWindow")},2000);
						comment = false;
						}
					}	
				);
				
				$("#cancel").on("click", function(){
					removeElem("pageSpec","commentWindow");
					comment = false;
					}
				
					
				);
				
					$("#commentWindow").css("height","auto");
				}
				else{
					$("#commentWindow").show();
				}
			  });
			
			
$("#botSpec").append("<div class='socialNetworks'></div>");
			
			//Ajouter dynamiquement les affiliations aux liens
			//des réseaux sociaux ci-dessous
			//Modifier le comportement des boutons en fonction de l'action voulue !
			
			
			if(data.commerce.facebook != null){
				if(data.commerce.facebook != "")	
				$(".socialNetworks").append("<a onclick='Rho.System.openUrl(\""+data.commerce.facebook+"\")'><img src='/public/images/svg/fb.svg'/></a>");
				
			}
			if(data.commerce.instagram != null){
				if(data.commerce.instagram != "")
				$(".socialNetworks").append("<a onclick='Rho.System.openUrl(\""+data.commerce.instagram+"\")'> <img src='/public/images/svg/instagram.svg'/></a>");
			}
			if(data.commerce.email != null){
				if(data.commerce.email != "")
				$(".socialNetworks").append("<a href='mailto:"+data.commerce.email+"'> <img src='/public/images/svg/email.svg'/></a>");
			}
			
			$(".socialNetworks").append("<img id='contact-us' src='/public/images/svg/warning.svg' />");
			
			$("#contact-us").on("click", function (event) {
			    event.stopPropagation()
	
			    function onSubmit(event) {
			      event.preventDefault();
			      form = $(this);
	
			      var subject = form.find("#contact-topic").val(),
			      body = form.find("#contact-body").val();
	
			      form.find("input, button").blur();
			      if (!form_validate.required(subject)) {
			        $("#contact-form .error").removeClass("hidden").text("Please select an topic.");
			        form.find("select").focus();
			        return;
			      }
	
			      $.dialog.close("contact-form");
			      var resultats = api.signaler(id, subject, body);
			 	  if(resultats == "ok"){
			 		 $.dialog.alert("Thank you for contacting us.\nWe will get back to you soon.\n\nThis alert will automatically close in 2 seconds.").autoClose(2000);
			 	  }
			    }
	
			    function open(dialog) {
			      dialog.find("form").on("submit", onSubmit);
			    }
	
			    $.dialog.open("contact-form").onOpen(open);
			  });
			
			//Ajustement pour le bas de la page
			//$("#pageSpec").css("height", $("#pageSpec").height() + 50 + "px");
			$("#pageSpec").show(0);  
			$("#loaderDescr").hide(300);
			
			$("#close").on("click",function(e){
					$("#pageSpec").hide(0);
					$("#boutonsParcours").show(0);
					if(comment == true){
					removeElem("pageSpec","commentWindow");
					comment = false;
					}
					//On reaffiche la page active
					$(".ui-page-active").show();
					descraffiche = false;
					
			});
			
			
			
			
		});
		descraffiche = true;
	}
	
}


//Converti un id de tag en nom  de catégorie (ex: cat7)
function findSSCat(id,t){
	
	var nbSS = parseInt(localStorage.getItem("nbSsCat"));
	var i = 0;
	var tmp;
	while(i < nbSS)
	{
		tmp = JSON.parse(localStorage.getItem("sscat"+i));
		if(tmp[0] == id)
		{

			return "cat"+tmp[2];
		}
		i++;
	}
	return "";
	
	
}

//Convertir en chaine de catégorie
function findSSCatString(id){
	
	var nbSS = parseInt(localStorage.getItem("nbSsCat"));
	var i = 0;
	var tmp;
	while(i < nbSS)
	{
		tmp = JSON.parse(localStorage.getItem("sscat"+i));
		if(tmp[0] == id)
		{

			return tmp[1];
		}
		i++;
	}
	return "";
	
	
}

//utilisé dans parcours etudiant
//A modifier apres pour rendre le code plus lisible.
function findCatSubCat(id){
	    var data = api.getCommDetail(id);
	     var nbSS = parseInt(localStorage.getItem("nbSsCat"));
	     var i = 0;
	     var tmp="";
	     while(i < nbSS)
	     {
	         tmp = JSON.parse(localStorage.getItem("sscat"+i));
	         if(data.commerce.tag0 == tmp[0])
	         {    return {
	             "cat":tmp[2],
	             "subcat":tmp[0]}; 
	         }
	         i++;
	     }
	     return {
	         "cat":"",
	         "subcat":""}; 
	         
}
function removeElem(container,elem){
	var child = document.getElementById(elem);
	var parent = document.getElementById(container);
	parent.removeChild(child);

}

function convertirEnLisible(texte)
{
	var words = texte.split(" ")
	var i = 0;
	var res = "";
	for(i = 0; i < words.length; i++)
	{
		res += words[i].substring(0,1).toUpperCase();
		res += words[i].substring(1).toLowerCase();
		res += " ";
	}
	
	return res;
	
}

//Retourne le nom de fichier et son extension associé à l'URL passée en paramètres
//Reutiliser la fonction avec les lignes commentées pour avoir le nom de fichier seulement
function basename(str)
{
	   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
	    //if(base.lastIndexOf(".") != -1)       
	    //    base = base.substring(0, base.lastIndexOf("."));
	   return base;
}



	  
