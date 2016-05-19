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
	tutoTrad = 
	{
		"fr" : 
		{	
			"persoTop" : "Cliquez sur une categorie ci-dessous pour en afficher les tags.<br/> "
				+"Ajoutez en plusieurs.<br/>Lorsque vous avez fini, cliquez sur l'icone en haut sur la droite pour continuer."
				+"<br/><span style='font-size:12px'>(Cliquez n'importe o&ugrave; pour fermer cette fenetre.)</span>",
				
			"description" : "Ici, vous pouvez choisir un parcours predefinis par la CCI de Rennes."
				+"<br/><span style='font-size:12px'>(Cliquez n'importe o&ugrave; pour fermer cette fenetre.)</span>",
				
			"footer" : "Bienvenue. Cette barre en bas vous permet de naviguer dans l'application. De gauche &agrave; droite : 'Les parcours pr&eacute;definis', 'Les parcours personnalis&eacute;s', 'rechercher', 'changer de langue', 'options'"
				+"<br/><span style='font-size:12px'>(Cliquez n'importe o&ugrave; pour fermer cette fenetre.)</span>"
		},
		
		"en" :
		{
			"persoTop" : "Click on a category below to view tags. <br/> "
				+ " Add several. <br/> When finished , click the icon at the top on the right to continue. "
				+ " <br/><span style='font-size:12px'> ( Click anywhere to close this window. ) </span>",
				
			"description" : "Here you can choose a course predefined by the CCI of Rennes."
				+ " <br/><span style='font-size:12px'> ( Click anywhere to close this window. ) </span>",
				
			"footer" : "Welcome. This bottom bar allows you to navigate through the application. From left to right: 'The predefined path', 'Custom path', 'search', 'change language', 'options'"
				+ " <br/><span style='font-size:12px'> ( Click anywhere to close this window. ) </span>"
		},
		
		"esp" :
		{
			"persoTop" : "Haga clic en una categoria abajo para ver las etiquetas. <br/> "
				+ " Anadir varios. <br/> Cuando haya terminado, haga clic en el icono en la parte superior a la derecha para continuar. "
				+ " <br/><span style='font-size:12px'>( Haga clic en cualquier lugar y para cerrar esta ventana . ) </span >",
			
			"description" : "Aqui se puede elegir un curso predefinido por el CCI de Rennes."
				+ " <br/><span style='font-size:12px'>( Haga clic en cualquier lugar y para cerrar esta ventana . ) </span >",
				
			"footer" : "Bienvenido. Esta barra inferior le permite navegar a traves de la aplicacion. De izquierda a derecha: 'La ruta predefinida', 'Ruta personalizada ',' buscar ',' cambiar el idioma', 'Opciones'"
				+ " <br/><span style='font-size:12px'>( Haga clic en cualquier lugar y para cerrar esta ventana . ) </span >"
				
		},
		
		"de" : 
		{
			"persoTop" :"Klicken Sie auf eine der Kategorien -Tags anzuzeigen. <br/> "
				+ "Add mehrere. <br/> Wenn Sie fertig sind , klicken Sie auf das Symbol an der Spitze auf der rechten Seite , um fortzufahren. "
				+ " <br/><span style='font-size:12px'>(Klicken Sie irgendwo dieses Fenster zu schlieBen.) </span>",
				
			"description" : "Hier konnen Sie einen Kurs von der IHK von Rennes vorgegeben wahlen."
				+ " <br/><span style='font-size:12px'>(Klicken Sie irgendwo dieses Fenster zu schlieBen.) </span>",
				
			"footer" : "Willkommen. Diese unteren Leiste konnen Sie durch die Anwendung zu navigieren. Von links nach rechts: 'Die vordefinierten Pfad ',' Custom Weg', 'suchen', 'Sprache andern', 'Optionen'"
				+ " <br/><span style='font-size:12px'>(Klicken Sie irgendwo dieses Fenster zu schlieBen.) </span>"
		}
		
	};
	

	
	//On recupere le tableau des etats d'avancement du tutoriel
	var filename = Rho.RhoFile.join(Rho.Application.publicFolder, 'firsttime.txt');
	tutoState = JSON.parse(Rho.RhoFile.read(filename));
	
	var pageName = location.pathname.split('/').slice(-1)[0]
	
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
	$("#grisement").show();
	var heightNew = $("body").height() - 100 ;
	$("#grisement").css({"height":heightNew+"px", "margin-top":"52px"});
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



















