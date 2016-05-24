$(document).ready(function(){
	
	//Affichage des options pour le formulaire de signalement
	
	var nbOptions = signalementLang["fr"].length;
	var i = 0;
	var currentLang = localStorage.getItem("0");
	
	
	for(i = 0; i < nbOptions; i++)
	{
		$("select#contact-topic").append("<option value='"+signalementLang["fr"][i]+"'>"+signalementLang[currentLang][i]+"</option>");

	}
	
	var btn1 = "";
	var btn2 = "";
	var titre = "";
	
	switch(currentLang)
	{
		
		case "fr":
			
			btn1 = "Annuler";
			btn2 = "Envoyer";
			titre = "Signalement";
		
		break;
		
		case "en":
			
			btn1 = "Cancel";
			btn2 = "Send";
			titre = "Report";
		
		break;
		
		case "esp":
			
			btn1 = "Cancelar";
			btn2 = "Enviar";
			titre = "Alerta";
		
		break;
		
		case "de":
			
			btn1 = "Stornieren";
			btn2 = "Senden";
			titre = "Berichterstattung";
		
		break;
		
		
	}
	$("h1").html("<font color='clack'>"+titre+"</font>");
	$("button:first").text(btn1);
	$("button:last").text(btn2);
	
});