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
