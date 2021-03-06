/*
 * Charge toutes les catégorie et les textes selon la langue sélectionné
 */
var defaultLanguage;
langageCourant = "";
function getAllElementsWithAttribute(attribute)
{
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute) !== null)
    {
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

function getLanguage(){	
	if(localStorage.getItem(0)!=null){
		defaultLanguage = localStorage.getItem(0);
		$("div.ui-page-active #lang").parent().find(".ui-btn-text > span").text(defaultLanguage.toUpperCase());
		$("div.ui-page-active #lang").val(defaultLanguage.toLowerCase());
	}
	else{
		defaultLanguage = "fr";
		localStorage.setItem(0, defaultLanguage);
		chargementCategories();		
	}
}

function chargementCategories() {
	localStorage.clear();
	localStorage.setItem(0, defaultLanguage);
	
	var data = api.getAllcat();
	
	var langue = localStorage.getItem(0);
	
	if(data != null)
	{
		localStorage.setItem('nbCat', data.sizecat);
		localStorage.setItem('nbSsCat', data.sizesscat);
		var catAutresLangues = new Array();
		var ssCatAutresLangues = new Array();
		if(langue!= 'fr')
		{
			for(var i = 0 ; i < data.sizecat ; i++) {
				catAutresLangues.push({"cat":data.cat[i][langue],"i":data.cat[i].id});
			}
			for(var i = 0 ; i < data.sizesscat ; i++) {
				ssCatAutresLangues.push({"scat":data.sscat[i][langue],"i":i,"catparent":data.sscat[i].catparent});
			}
			catAutresLangues.sort(function(x,y){
				return (x.cat === y.cat ? 0 : (x.cat > y.cat ? 1 :- 1));});
			ssCatAutresLangues.sort(function(x,y){
				return (x.scat === y.scat ? 0 : (x.scat > y.scat ? 1 :- 1));});
		}
		
		for(var i = 0 ; i < data.sizecat ; i++) {
			var courantCat = data.cat[i];
			switch (langue) {
				case 'fr':
					var courantCatNom = courantCat.nom;
					var catimg= courantCat.id;
					break;
				default:
					var courantCatNom = catAutresLangues[i].cat;
					var catimg = catAutresLangues[i].i;
					break;
			}
			var infoCat = [catimg, courantCatNom];
			var keyCat = 'cat'+i;
			localStorage.setItem(keyCat, JSON.stringify(infoCat));
			localStorage.setItem('catimg'+i,"/public/images/cat"+catimg+"_256.png");
			}
		
		for(var i = 0 ; i < data.sizesscat ; i++) {
			var courantSsCat = data.sscat[i];
			switch (langue) {
				case 'fr':
					var courantSsCatNom = courantSsCat.nom;
					var scatimg= courantSsCat.id;
					var catparent = courantSsCat.catparent;
					var ssmenu = courantSsCat.ssmenu;
					break;
				default:
					var courantSsCatNom = ssCatAutresLangues[i].scat;
					var scatimg = data.sscat[ssCatAutresLangues[i].i].id;
					var catparent = data.sscat[ssCatAutresLangues[i].i].catparent;
					var ssmenu = data.sscat[ssCatAutresLangues[i].i].ssmenu;

					break;
			}
			var infoSsCat = [scatimg, courantSsCatNom, catparent,ssmenu];
			var keySsCat = 'sscat'+i;
			localStorage.setItem(keySsCat, JSON.stringify(infoSsCat));
			
			}
		
	}
			 localStorage.setItem("userlat", "48.1113531");
			 localStorage.setItem("userlng", "-1.6786842999999863");
}

function changeLanguage(newLang){
	defaultLanguage = newLang;
	localStorage.setItem(0, defaultLanguage);
	chargementCategories();	
	location.reload();
}

function actualiserLanguage(){
	getLanguage();
	var tab = getAllElementsWithAttribute("text");
	var l = tab.length;
	for(var i = 0 ; i < l ; i++){
		var ele = tab.pop();
		if(ele != null){
			try
			{
				ele.innerHTML = lang[defaultLanguage][ele.getAttribute("text")];	
			}catch(err)
			{
				console.log("Erreur : "+err);
			}
		}
	}
}

window.onload = actualiserLanguage();
$(document).ready(function(e){
	getLanguage();
})