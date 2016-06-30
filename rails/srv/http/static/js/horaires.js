//Permet d'ajouter les balises d'horaires dans un string
	//et on l'affiche à la fin
	//Ceci est effectif pour le premier affichage, si l'utilisateur n'a encore jamais rentré ses horaires
	//Par la suite on récupérera aisément ses horaires
	
	console.log($("#commerce_horaires").attr("value"))	
		var jours = ["lundi", "mardi","mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
		var i = 0;
		var j = 0;
		var k = 0;
		var objH = $("#commerce_horaires").attr("value");
		var hasHoraires = (objH != '{}' && typeof objH != "undefined");
		objH = (hasHoraires ? JSON.parse(objH.replace(/=>/g, ':')) : '{}');
		var horStr = "<table>";
		horStr    += "<tr><th>Jour</th><th>Ouverture</th><th>Fin matinée</th><th>Début midi</th><th>Fermeture</th></tr>";

		while ( i < jours.length)
		{
			j = 0;
			k = 0;
			horStr += "<tr><td style='text-align:left'>"+jours[i]+"</td>";
			while ( j < 4 )
			{
				//On ajoute les 4 champs
				horStr += "<td style='white-space:nowrap'>"
				var color;
				k = 0;
				(j == 1 || j == 2 ?  color = "rgb(200,200,200)" : color="black");
				horStr += "<select style='color:"+color+"' name='"+jours[i]+j+"'>";
				
				//Ajout des heures
				while(k < 24)
				{
					horStr += "<option value='"+k+"' "+(j == 0 && k == 9 && i<jours.length -2 && !hasHoraires? "selected" : "")+(j == 3 && k == 18 && i<jours.length -2 && !hasHoraires? "selected" : "")+(hasHoraires && objH[jours[i]+j] == k ? "selected" :"")+">"+k+"</option>";
						k++;
				}
				horStr += "</select>";
				horStr += "<span style='color:"+color+"'>:</span><select name='"+jours[i]+j+"mn' style='color:"+color+"'>";
				//Ajout des minutes
				for(var p = 0; p < 4; p++)
				{

					var mn = ["00","15","30","45"];
					var val2 = (hasHoraires ? objH[jours[i]+j+"mn"] : "00");

					horStr += "<option value='"+mn[p]+"' "+(val2 == mn[p] ? "selected" : "")+">"+mn[p]+"</option>"
				}
				j++;	
			}
			horStr += "</select></td></tr>";
			i++;
		}


		$("#horaires").append(horStr);
		$("#commerce_horaires").attr("value",JSON.stringify(parseHoraires()));
		
		
		
		

	//On affiche les changements dans la console de l'objet JSON
	$("select").on("change",function(e){
		jsonHoraires = JSON.stringify(parseHoraires());	
		$("#commerce_horaires").attr("value",jsonHoraires);
	})	


function parseHoraires()
{
	var jours =  ["lundi", "mardi","mercredi", "jeudi", "vendredi", "samedi", "dimanche"];	

	var i = 0;
	var j = 0;
	var ret = {};
	while(i < jours.length)
	{
		j = 0;
		while ( j < 4)
		{
			var cle = jours[i]+j;
			var sscle = cle+"mn";
			ret[cle] = $("select[name='"+cle+"'] option:selected").attr("value");
			ret[sscle] = $("select[name='"+sscle+"'] option:selected").attr("value");
			
			
			
			j++;	
		}
		
		
			
		i++;	
	}


	return ret;

}






