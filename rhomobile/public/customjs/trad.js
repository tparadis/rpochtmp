var defaultLanguage;

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
		if(defaultLanguage == "fr"){
			$("div.ui-page-active #lang").parent().find(".ui-btn-text > span").text("FR");
			$("div.ui-page-active #lang").val("fr");
		}
		else if(defaultLanguage == "en"){
			$("div.ui-page-active #lang").parent().find(".ui-btn-text > span").text("EN");
			$("div.ui-page-active #lang").val("en");
		}
		else if(defaultLanguage == "esp"){
			$("div.ui-page-active #lang").parent().find(".ui-btn-text > span").text("ESP");
			$("div.ui-page-active #lang").val("esp");
		}
		else if(defaultLanguage == "de"){
			$("div.ui-page-active #lang").parent().find(".ui-btn-text > span").text("DE");
			$("div.ui-page-active #lang").val("de");
		}
	}
	else{
		defaultLanguage = "fr";
		localStorage.setItem(0, defaultLanguage);
	}
	chargementCategories();
}

function chargementCategories() {
	localStorage.clear();
	localStorage.setItem(0, defaultLanguage);
	$.ajax({
		dataType: "json",
		contentType: "application/json",
		url: "http://rpoch.istic.univ-rennes1.fr/api/",
		data: {"req":"allcat","format":"json"},
		type: "GET",
		async: false,
		success: function(data) {
			var langue = localStorage.getItem(0);
			localStorage.setItem('nbCat', data.sizecat);
			localStorage.setItem('nbSsCat', data.sizesscat);
			for(var i = 0 ; i < data.sizecat ; i++) {
				var courantCat = data.cat[i];
				switch (langue) {
					case 'fr':
						var courantCatNom = courantCat.nom;
						break;
					default:
						var courantCatNom = courantCat[langue];
						break;
				}
				var infoCat = [courantCat.id, courantCatNom];
				var keyCat = 'cat'+i;
				localStorage.setItem(keyCat, JSON.stringify(infoCat));				
			}
			for(var i = 0 ; i < data.sizesscat ; i++) {
				var courantSsCat = data.sscat[i];
				switch (langue) {
					case 'fr':
						var courantSsCatNom = courantSsCat.nom;
						break;
					default:
						var courantSsCatNom = courantSsCat[langue];
						break;
				}
				var infoSsCat = [courantSsCat.id, courantSsCatNom, courantSsCat.catparent];
				var keySsCat = 'sscat'+i;
				localStorage.setItem(keySsCat, JSON.stringify(infoSsCat));
			}
		},
	})
}

function changeLanguage(){
	defaultLanguage = $("div.ui-page-active #lang").val();
	localStorage.setItem(0, defaultLanguage);
	location.reload();
}

function actualiserLanguage(){
	getLanguage();
	var tab = getAllElementsWithAttribute("text");
	var l = tab.length;
	for(var i = 0 ; i < l ; i++){
		var ele = tab.pop();
		ele.innerHTML = lang[defaultLanguage][ele.getAttribute("text")];
	}
}
window.onload = actualiserLanguage();
$(document).ready(getLanguage);