$(document).ready(function(){
	
	/*	Fichier qui permet d'initialiser les tutoriaux si disponibles
	 * 	L'etat du tutoriel est dans public/firsttime.txt sous forme de tableau [1,1,1,1]
	 * 	les '1', indiquent que l'utilisateur n'a pas fait ce tutoriel, un '0' l'utilisateur est passe par la.
	 * 
	 * 	Dans l'ordre des entrees du tableau
	 * 	- page d'accueil
	 * 	- parcours predef
	 * 	- parcours perso
	 * 	- map (commune aux deux parcours)
	 * 
	 */
	
	//Un tableau interne au fichier contiendra pour chaque langue la traduction associee
	//Declaration des variables globales
	currentLang = localStorage.getItem("0");
	
	
	//On recupere le tableau des etats d'avancement du tutoriel
	var filename = Rho.RhoFile.join(Rho.Application.publicFolder, 'firsttime.txt');
	tutoState = JSON.parse(Rho.RhoFile.read(filename));
	
	var pageName = location.pathname.split('/').slice(-1)[0]
	if(pageName == "index_erb.iseq") pageName = "index.erb";
	//Le Switch des operations a effectuer pour le deroulement du tuto
	switch(pageName)
	{
		
		case "index.erb":
			if (tutoState[0] == 1)
			{
				showTutorialMain();
			}
			break;
		
		
		case "sous_categories":
			if (tutoState[2] == 1)
			{
				showTutorialPerso();
			}
			break;
			
		case "parcours_predef":
			if (tutoState[1] == 1)
			{
				showTutorialPredef();
			}
			break;
			 
			
		default:
			console.log("Pas de tutoriel pour cette page: "+pageName);
		
		
	}


});

//Les fonction qui vont afficher le tutoriel a l'ecran
function showTutorialMain()
{	
	$("body").append("<div id='sampleWindow' style='bottom:70px; z-index:20;'><div class='persoW'>"
	+"</div></div>");
	if($("#grisement").length == 0)
	{
		$("body").append("#grisement");
	}
	$("#grisement").css("height","100%");
	$("#grisement").show();
	var elem = document.getElementsByClassName("persoW");
	elem[0].innerHTML = tutoTrad[currentLang].footer;
	$("#sampleWindow").css("height","auto");
	$("#grisement").on("mousedown",function(){
		$("#sampleWindow").hide(500);
		tutoState[0] = 0;
		writeCurrentState(tutoState);
	});
	$("#sampleWindow").on("mousedown",function(){
		$("#grisement").hide();
		$("#sampleWindow").hide(500);
		tutoState[0] = 0;
		writeCurrentState(tutoState);
	});
	
}

function showTutorialPerso()
{
	$("body").append("<div id='sampleWindow' style='top:70px; z-index:20;'><div class='persoW'>"
	+"</div></div>");
	var elem = document.getElementsByClassName("persoW");
	elem[0].innerHTML = tutoTrad[currentLang].persoTop;
	$("#grisement").show();
	$("#sampleWindow").css("height","auto");
	$("#grisement").on("mousedown",function(){
		$("#sampleWindow").hide(500);
		tutoState[2] = 0;
		writeCurrentState(tutoState);
	});
	$("#sampleWindow").on("mousedown",function(){
		$("#grisement").hide();
		$("#sampleWindow").hide(500);
		tutoState[2] = 0;
		writeCurrentState(tutoState);
	});
	
}

function showTutorialPredef()
{
	$("body").append("<div id='sampleWindow' style='top:70px; z-index:20;'><div class='persoW'>"
	+"</div></div>");
	var elem = document.getElementsByClassName("persoW");
	$("#grisement").show();
	elem[0].innerHTML = tutoTrad[currentLang].description;
	$("#sampleWindow").css("height","auto");
	$("#grisement").on("mousedown",function(){
		$("#sampleWindow").hide(500);
		tutoState[1] = 0;
		writeCurrentState(tutoState);
	});
	$("#sampleWindow").on("mousedown",function(){
		$("#grisement").hide();
		$("#sampleWindow").hide(500);
		tutoState[1] = 0;
		writeCurrentState(tutoState);
	});
	
}

function writeCurrentState(state)
{
	//On sauvegarde l'état du tutoriel
	var fichier = new Rho.RhoFile(Rho.RhoFile.join(Rho.Application.publicFolder, "firsttime.txt"), Rho.RhoFile.OPEN_FOR_READ_WRITE);
	
	//Penser a decommenter en dessous pour que les modifs de tutos soient prises en compte
	fichier.write(JSON.stringify(tutoState));
	
	fichier.close();
}



















