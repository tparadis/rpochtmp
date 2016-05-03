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
			localStorage.setItem('catimg'+i,"/public/images/cat"+catimg+"_32.png");
			}
		
		for(var i = 0 ; i < data.sizesscat ; i++) {
			var courantSsCat = data.sscat[i];
			switch (langue) {
				case 'fr':
					var courantSsCatNom = courantSsCat.nom;
					var scatimg= courantSsCat.id;
					var catparent = courantSsCat.catparent;
					break;
				default:
					var courantSsCatNom = ssCatAutresLangues[i].scat;
					var scatimg = data.sscat[ssCatAutresLangues[i].i].id;
					var catparent = data.sscat[ssCatAutresLangues[i].i].catparent;
					break;
			}
			var infoSsCat = [scatimg, courantSsCatNom, catparent];
			var keySsCat = 'sscat'+i;
			localStorage.setItem(keySsCat, JSON.stringify(infoSsCat));
			var filename;
			var fullpath;
			fullpath=Rho.RhoFile.join(Rho.Application.publicFolder, "/images/scat"+scatimg+"_32.png");
						
			if(Rho.RhoFile.exists(fullpath))
			{
				filename = "/public/images/scat"+scatimg+"_32.png";
			}else
			{
				filename = "/public/images/cat"+catparent+"_32.png";
			}
			localStorage.setItem('sscatimg'+scatimg,filename);
			}
	}
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
		ele.innerHTML = lang[defaultLanguage][ele.getAttribute("text")];
	}
}

//Fonction qui va mettre le cadre des langues au bon emplacement
//Et crŽe le menu si besoin
function afficheBoxLanguages(){
	var box = $("body").find(".languageSelect");
	var langs = ["fr", "en", "esp", "de"];
	var equiv = ["FRANCAIS", "ENGLISH", "SPANISH", "DEUTSCH"];
	var i = 0;
	var newLeft = ($("body").width()/5)*3 + 20;
	var bordure = "";
	if( $(".elem").length ==0 ){
		for(i = 0; i < langs.length; i++)
		{
			if(i != langs.length -1 )
			{	
				bordure = '<div class="bordureBottom"></div>';
			}
			else
			{
				bordure = "";
			}
			
			$(box).append('<div class="elem" name="'+langs[i]+'">'+equiv[i] + bordure + '</div>');
			
		}
	}
	$(".elem").on("click", function(){
		changeLanguage($(this).attr('name'));
	});
	$(box).css("bottom", $("body").find("div[id='footer']").height() +"px");
	$(box).css("left", newLeft + "px");
	
}
function initiate(){
	var nb = $(".languageSelect").length;
	if(nb < 1){
		$("body").append("<div id='grisement'></div>");
		$('body').append('<div class="languageSelect"></div>');
	}
	$("#grisement").css("height", $("page").height - $("#footer").height() - $("header").height() +"px");
	
	$("#grisement").hide();
	$(".languageSelect").hide();
}

window.onload = actualiserLanguage();
$(document).ready(getLanguage);
$(document).ready(function(e){
	
	var affiche = false;
	initiate();
	afficheBoxLanguages();
	getLanguage();
	$('a[name="btn4"]').on('click',function(){
		if(affiche == false)
		{
			var newLeft = ($("body").width()/5)*3 + 20;
			var box = $("body").find(".languageSelect");
			$(box).css("bottom", $("body").find("div[id='footer']").height() +"px");
			$(box).css("left", newLeft + "px");
			$("#grisement").show();
			$(".languageSelect").show();
			affiche = true;
		}
		else
		{
			affiche = false;
			$("#grisement").hide();
			$(".languageSelect").hide();
		}
	});
	$('#grisement').on('click',function(){
			$("#grisement").hide();
			$(".languageSelect").hide();
			affiche = false;
	});
	
})



