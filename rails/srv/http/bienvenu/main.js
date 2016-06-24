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

	//LOADER + VALIDATION FORM
	$("#loader").hide();

	$("form").on("submit",function()
	{

		result = "";
		var str = "";
		var mail = $("input#mail").val();
		var pass1 = $("input#pass1").val();
		var pass2 = $("input#pass2").val();
		var uuid = $("input#uuid").val();

		//On teste les parametres	
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
		if(uuid == "" || uuid == "Identifiant")
		{
			console.log("uuid vide")
			str += "Le champs identifiant ne peut pas être vide.\n"
			$("input#uuid").css("border","2px solid red");
		}

		if (str != "")
		{
			alert(str);	
			return false;
		}
		
	
		//Actions si tout est ok
		//on cache tout + Ajax
		$("#loader").show(200);
		$("form").hide();	
		
		//On fait les opérations nécessaires
		createCommercant(mail,pass1,pass2,uuid);
		
		
		
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
			$("form").html(str);
			$("form").show();

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



















