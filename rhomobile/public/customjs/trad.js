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
	}
	else{
		defaultLanguage = "fr";
		localStorage.setItem(0, defaultLanguage);
	}
}
/*
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
} 

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}*/

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