$(document).ready(function(){
	
	
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

