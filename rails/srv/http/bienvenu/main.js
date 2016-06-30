$(document).ready(function(){

	//INIT

	//TODO ajouter un scrollTop de départ
	$("html,body").animate({scrollTop:0});
	/*$("img.fond01").delay(2000).animate({"opacity":"1"},1500);

	$(".c01").on("mousemove",function(e){
		
		//mise à jour de l'image de fond de la page01
		var newMarge = (($("body").width() - e.pageX) / $("body").width()) * 5; 
		var newMargeTop = (($("body").height() - e.pageY) / $("body").height()) * 5; 
		$(".fond01").css("margin-left", '-'+newMarge+'%');
		$(".fond01").css("margin-top", '-'+newMargeTop+'%');
	})

	*/

	animateFond();

	


	//Scrolltop en appuyant sur le h4
	$("#container[name='container1']").find("h4").on("click", function()
	{
		$("html, body").animate({scrollTop: $("#container[name='container2']").offset().top}, 500)	
	})

	//Actions sur le formulaire
	$("input#uuid").on("blur",function()
	{
		if($(this).val() == "")
		{
			$(this).val("Identifiant");
			$(this).css("color","gray");
		}
	})
	$("input#uuid").on("focus",function()
	{
		$(this).css("color","black");
		if($(this).val() == "Identifiant")
		{
			$(this).val("");	
		}
	})
	
		
	//LOADER + VALIDATION FORM
	$("#loader").hide();
	var uuid_current = "";
	var mail = "";
	var pass1 = "";
	var pass2 = "";

	$("form[name='step1']").on("submit",function()
	{

		result = "";
		var str = "";
		var uuid = $("input#uuid").val();
		uuid_current = uuid;

		if(uuid == "" || uuid == "Identifiant")
		{
			console.log("uuid vide")
			str += "Le champs identifiant ne peut pas être vide.\n"
			$("input#uuid").css("border","2px solid red");
		}		
	
		//Actions si tout est ok
		//on cache tout + Ajax
		$("#loader").show();
		$("form[name='step1']").hide();	
		
		//createCommercant(mail,pass1,pass2,uuid);
		var retuuid = verifyuuid(uuid);
		if(retuuid != "ok")
		{
			$("#loader").hide();
			$("form").show()
			$("input#uuid").css("border","2px solid red");
			alert(retuuid);
			return false;
		}
		else
		{
			//On affiche le second formulaire	
			$("#loader").hide(200);	
			$("#forms").html('<form action="#" method="POST" name="step2"><input type="text" name="mail" id="mail" value="Votre e-mail"/><br/><input type="password" name="pass1" id="pass1"/><br/><input type="password" name="pass2" id="pass2"/><br/><input type="submit" value="Continuer"></form>');
		
		$("input#mail").on("blur",function()
		{
			if($(this).val() == "")
			{
				$(this).val("Votre e-mail");
				$(this).css("color","gray");
			}
			
		})
		$("input#mail").on("focus",function()
		{
			$(this).css("color","black");
			if($(this).val() == "Votre e-mail")
			{
				$(this).val("");	
			}
		})
				

			$("#forms form[name='step2']").on("submit",function(){
				//Validation du second formulaire	
				//On teste les parametres	
				var str = "";
				mail = $("input#mail").val();
				pass1 = $("input#pass1").val();
				pass2 = $("input#pass2").val();

				$("input#mail, input#pass1, input#pass2, input#uuid").css("border","none");
				if(!isValidEmailAddress(mail))
				{
					console.log("not valid email")
					$("input#mail").css("border","2px solid red");
					str += "Le mail n'est pas valide. \n"
				}
				if(pass1 != pass2 || pass1.length < 7)
				{
					console.log("password not valid");
					$("input#pass1").css("border","2px solid red");
					$("input#pass2").css("border","2px solid red");
					str += "Les mots de passes sont inférieurs à 7 caractères ou sont différents. \n"
				}
				if (str != "")
				{
					alert(str);	
					return false;
				}
				else
				{
					$("#form").hide();
					$("#loader").show();
					var retmail = ""
					//On regarde si un utilisateur existe deja pour ce mail ou non
					$.ajax(
					{
						url:"/api/?req=verifyemail&format=json&email="+mail,
						method:"GET",
						async:false,
						dataType:"JSON",
						success:function(data)
						{
							retmail = data.err
						}
						
					})

					if(retmail != "ok")
					{
						alert(retmail);
						$("#loader").hide();
						$("form").show();
						return false;
					}
					else
					{
						$("#loader").show();
						$("#forms").hide();
						var tokensent = "";
						$.ajax(
						{
							url:"/bienvenu/sendtoken.php",
							data:{mail:mail},
							method:"POST",
							async:false,
							dataType:"html",
							success:function(data)
							{
								tokensent = data;
							}

						})
						if(tokensent == "ok")
						{
							alert("Un mail de confirmation vous a été envoyé. veuillez y inscrire le petit identifiant afin de pouvoir finaliser votre inscription");	

							var strtoken = "";
							strtoken += "<form action ='#' name='step3' >";
							strtoken += "<input type='text' style='color:gray' value='token' name='token' id='token' /><br/>";
							strtoken += "<input type='submit' value='Continuer' />";
							strtoken += "</form>";

							$("#loader").hide(200);
							$("#forms").show();
							$("#forms").html(strtoken);

							$("input#token").on("focus",function(){
							
								$(this).css("color","black");
								if($(this).val() == "token") $(this).val("");
								
							})
							$("input#token").on("blur",function(){
							
								$(this).css("color","gray");
								if($(this).val() == "") $(this).val("token");
								
							})


							$("form[name='step3']").on("submit",function()
							{

								//On va devoir valider le token et inscrire notre utilisateur
								var token = $("input#token").val();
								var retToken = "";
								$.ajax(
								{
									//TODO VERIFIER LES TOKENS + INSCRIPTION
									url:"/bienvenu/checktoken.php",
									method:"POST",
									data:{token:token,mail:mail},
									async:false,
									dataType:"html",
									success:function(data)
									{
										console.log(data);
										retToken = data;
										
									}
								
								})


								//En cas de succès
								if(retToken == "ok")
								{
									//On crée le commerçant
									createCommercant(mail,pass1,pass2,uuid);					
									$("forms").html("Votre compte a bien été crée, ")


								}
								else
								{
									
									alert("Une erreur est survenue lors de la récupération du Token... Le token, est-il bon ?");
									
									return false;	
								}

								return false;
							})

						}
						else
						{
							$("#forms").show();
							$("#loader").hide();
							alert("Une erreure inconnue s'est produite, merci de réessayer plus tard");	
							return false;
						}
					}
					
				}
			
				return false;
				
			})
			
		}
		
		
		return false;

	
	})






});
function animateFond()
{
		$("img.fond01").animate({"margin-left":"0%"},10000).animate({"margin-left":"-10%"},10000, animateFond);
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

function verifyuuid(uuid)
{
	var msg = "";
	//On vérifie que l'uuid est disponible
	$.ajax({
		
		url:"/api/?req=verifyuuid&format=json&uuid="+uuid,
		dataType:"JSON",
		method:"GET",
		async:false,
		success:function(data)
		{
			msg = data.err;	
		},
		error:function(err,er,e)
		{
			console.log("Erreur : "+er+", "+e);
			
		}

	})
	
		
	return msg;	
	
	
	
	
}

function createCommercant(mail,pass1,pass2,uuid){
	
	
	//récupération du formulaire new pour les commercants	
	var formObj = recupereFormNew();
	
	//On remplis les champs
	formObj.user.username = mail.substr(0, mail.indexOf('@'));
	formObj.user.password = pass1;
	formObj.user.password_confirmation = pass2;
	formObj.user.email = mail;
	formObj._method = "POST";
	formObj["uuid"] = uuid;
	console.log(formObj);

	//On envoie le résultat au serveur
	$.ajax
	({
		url:"/api/bo/createcomm",
		method:"POST",
		dataType:"JSON",
		data:formObj,
		success:function(data)
		{
			var str = "";
			$("#loader").hide();
			var err = 0;
			switch(data.status)
			{
				case "exist" :
					str = "Erreur, un utilisateur avec ces coordonnées existe déja.";
					err = 1;
					break;

				case "nouuid" :
					str = "Erreur, l'identifiant que vous avez indiqué n'existe pas.";
					err = 1;
					break;

				case "assigne" :
					str = "Erreur, le commerce que vous voulez est déja associé à quelqu'un d'autre.";
					err = 1;
					break;

				case "internerror" :
					str = "Erreur interne au serveur, réessayez plus tard s'il vous plait.";
					err = 1;
					break;

				case "ok" :
					str = "Vous êtes inscrit. Connectez-vous sur <a href='/api/bo/' > le Back-Office </a>.";
					err = 0;
					break;
			}
			if (err = 1)
			{
				str += "<br/>En cas de problème d'accès ou si vous avez besoin d'aide, <a href='mailto:contact@rennespoche.fr'>contactez-nous</a>";	
			}
			$("#forms").html(str);
			$("#forms").show();

		},
		error:function(err, er, e)
		{
			console.log("Erreur "+err+", "+er+", "+e);	
		}	
		
	});
	
	
	
	
}

function recupereFormNew()
{
	var pageFull = "";
	$.ajax
	({
		url:"/api/bo/newcomm",		
		async:false,
		data:'',
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
	
	return formObj;
	
}



















