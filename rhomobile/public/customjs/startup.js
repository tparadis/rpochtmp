$(document).ready(function(){
	
	//On récupère si besoin un identifiant (uuid) unique pour l'utilisateur
	getUUID();
	getPhoneid();
	
	
	//On recupere la distance maximale
	if(localStorage.getItem("distMax") == null)
	{
		//Pas besoin de fermer le fichier
		if(!Rho.RhoFile.exists(Rho.RhoFile.join(Rho.Application.userFolder, 'save.txt')))
		{
			var fichier = new Rho.RhoFile(Rho.RhoFile.join(Rho.Application.userFolder, 'save.txt'), Rho.RhoFile.OPEN_FOR_READ_WRITE);
			fichier.write("distMax:6")
			fichier.close();
		}
		if(!Rho.RhoFile.exists(Rho.RhoFile.join(Rho.Application.userFolder, 'firsttime.txt')))
		{
			var fichier = new Rho.RhoFile(Rho.RhoFile.join(Rho.Application.userFolder, 'firsttime.txt'), Rho.RhoFile.OPEN_FOR_READ_WRITE);
			fichier.write("[1,1,1,1]")
			fichier.close();
		}
		var filename = Rho.RhoFile.join(Rho.Application.userFolder, 'save.txt') // build the path
		var contents = Rho.RhoFile.read(filename) // read the file into a variable
		
		var distMax = contents.split(":");
		
		localStorage.setItem("distMax", Number(distMax[1]));
		
	}
	
});

function getDistMax()
{
	var ret = Number(localStorage.getItem("distMax"));
	console.log("Distance max = "+ret+"km");
	return ret;
	
}

function getUUID()
{
	var file = Rho.RhoFile.join(Rho.Application.userFolder, "phoneid.txt");
	var uuidExist = Rho.RhoFile.exists(file);
	var fichierVide = false;
	
	if(!uuidExist) //S'il est nouveau, on crée le fichier + les opérations
	{
		
		var data = api.nouveau();
		if (data.id != null)
		{
			var fichier = Rho.R
			
			try
			{
				var fichier = new Rho.RhoFile(file, Rho.RhoFile.OPEN_FOR_WRITE);
				fichier.write(data.id);
				fichier.close();
				return Rho.RhoFile.read(file);
			}
			catch(err)
			{
				alert(err)
				return "pasok";
			}				
		}	
	}
	
	return "pasok";
}

function getPhoneid()
{
	//On vérifie que l'utilisateur existe toujours dans la bdd
	try
	{
		var file = Rho.RhoFile.join(Rho.Application.userFolder, "phoneid.txt");
		var phoneid = Rho.RhoFile.read(file);
		if (api.userExists(phoneid) == true)
		{
			return phoneid;
		}
		else
		{
			var file = Rho.RhoFile.join(Rho.Application.userFolder, "phoneid.txt");
			var data = api.nouveau();
			var fichier = new Rho.RhoFile(file, Rho.RhoFile.OPEN_FOR_WRITE);
			fichier.write(data.id);
			fichier.close();
			console.log("l'utilisateur n'était plus dans la BDD !!")
			var uuid = Rho.RhoFile.read(file);
			console.log(uuid)
			return uuid;
		}
	}
	catch(err)
	{
		return "";
	}		

}

