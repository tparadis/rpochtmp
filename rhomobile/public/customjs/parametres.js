$(document).ready(function() {

	var currentDist = localStorage.getItem("distMax");
	if (currentDist != null) {
		document.getElementById("slider").value = currentDist;
	} else {
		var fichier = new Rho.RhoFile(Rho.RhoFile.join(Rho.Application.publicFolder, "save.txt"), Rho.RhoFile.OPEN_FOR_READ_WRITE);
		var filename = Rho.RhoFile.join(Rho.Application.publicFolder, 'save.txt'); // build the path
		var contents = Rho.RhoFile.read(filename); // read the file into a variable

		var debut = contents.split('\n');
		var nouvelleVal = debut.split(":");
		localStorage.setItem("distMax", nouvelleVal[1]);
		document.getElementById("slider").value = nouvelleVal[1];
		document.getElementById("slider").defaultValue = nouvelleVal[1];
	}
	//INIT
	var offsetBarre = Number(localStorage.getItem("distMax"));
	var max = 50;
	var res = (offsetBarre / max) * 100;
	$("a[role='slider']").css("left", res + "%");

	//Reinitialiser le tutorial
	var msgFinal = "";
	switch(localStorage.getItem("0"))
	{
		case "fr": msgFinal = "Relancer le tutoriel"; break;
		case "en": msgFinal = "Restart tutorial"; break;
		case "esp": msgFinal = "Tutorial de reinicio"; break;
		case "de": msgFinal = "starten Sie das Tutorial"; break;
				
	}
	$("a[name='reinittuto']").html(msgFinal);
	
	$("a[name='reinittuto']").on("click", function(){
		var ret = reinitTutorial();
		var msgFinal = "";
		console.log("LOG "+ret)
		switch(ret)
		{
			case "ok":
				switch(localStorage.getItem("0"))
				{
					case "fr": msgFinal = "tutoriel actif"; break;
					case "en": msgFinal = "active tutorial"; break;
					case "esp": msgFinal = "tutorial activo"; break;
					case "de": msgFinal = "aktiv Tutorial"; break;
					
				}
				break;
				
			case "pasok":
				switch(localStorage.getItem("0"))
				{
					case "fr": msgFinal = "impossible d'activer le tutoriel"; break;
					case "en": msgFinal = "Could not activate tutorial"; break;
					case "esp": msgFinal = "No se pudo activar el tutorial"; break;
					case "de": msgFinal = "Konnte nicht Tutorial aktivieren"; break;
					
				}
				break;
		}
		$("span.feedback").html(msgFinal);
		
	});
	
	
	
	$("a[role='slider']").on("mouseup",function(){
		
		
		showValue(Number(document.getElementById("slider").value))
		
	})

});

function showValue(newValue) {
	sauvegardeEnFichier(Math.round(newValue));
}

function sauvegardeEnFichier(newValue) {
	var fichier = new Rho.RhoFile(Rho.RhoFile.join(Rho.Application.publicFolder, "save.txt"), Rho.RhoFile.OPEN_FOR_READ_WRITE);
	var filename = Rho.RhoFile.join(Rho.Application.publicFolder, 'save.txt'); // build the path
	var contents = Rho.RhoFile.read(filename); // read the file into a variable

	var debut = contents.split('\n');
	var reecrire = "distMax:" + newValue;
	var final = "";
	var i = 1;
	final += reecrire;

	for (i = 1; i < debut.size; i++) {
		final += debut[i];
	}

	fichier.write(final);

	fichier.close();

	localStorage.setItem("distMax", Number(newValue));

}

function reinitTutorial()
{
	try
	{
		var fichier = new Rho.RhoFile(Rho.RhoFile.join(Rho.Application.publicFolder, "firsttime.txt"), Rho.RhoFile.OPEN_FOR_READ_WRITE);
		fichier.write("[1,1,1,1]");
		fichier.close();
		return "ok";
	}
	catch(err)
	{
		return "pasok";
	}
	
	
	return "ok";
}
