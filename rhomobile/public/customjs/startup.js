$(document).ready(function(){
	
	
	//On recupere la distance maximale
	if(localStorage.getItem("distMax") == null)
	{
		//Pas besoin de fermer le fichier
		var filename = Rho.RhoFile.join(Rho.Application.appBundleFolder, 'save.txt') // build the path
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

