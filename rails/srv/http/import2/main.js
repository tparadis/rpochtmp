$(document).ready(function(){

	/*  Ce fichier contient toutes les actions et animations pour l'index
	 *  C'est ici que sera initié la fonction de Parse du document
	 */

	document.getElementById("files").addEventListener("change", readFile, false);
	$("#error").hide();
	$("#fondNoir").hide();
	$("#askDiv").hide();
	
})

//Fonction qui valide si le fichier a l'extension .xlsx
function validExtension (str)
{
	var size = str.length;
	var extension = str.substring(size - 4, size);

	if(extension != "xlsx"){
		console.log("extension non conforme :"+extension);
		return false;
	}

	return true;
}

function readFile(file)	{
			console.log("debut");

			var fichier;
			
			try{
				fichier = file.target.files[0].name;
				if (fichier == "")
				{
					console.log("Aucun fichier choisi");
					return false;

				}
				console.log(fichier);
				
				
			}catch(err)
			{
				console.log("Aucun fichier choisi");
				fichier = "";
				return false;

			}

			if (validExtension(fichier))
				//On apelle la fonction qui va lancer le processus de PARSE
				lancerParse(file);
			

			return false;
	}


