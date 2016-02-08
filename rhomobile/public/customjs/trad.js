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
		}/*
		else if(defaultLanguage == "kr"){
			$("div.ui-page-active #lang").parent().find(".ui-btn-text > span").text("KR");
			$("div.ui-page-active #lang").val("kr");
		}*/
	}
	else{
		defaultLanguage = "fr";
		localStorage.setItem(0, defaultLanguage);
		
	}
}

function changeLanguage(){
	defaultLanguage = $("div.ui-page-active #lang").val();
	localStorage.setItem(0, defaultLanguage);
	location.reload();
}

function encode_utf8(s) {
	  return unescape(encodeURIComponent(s));
	}

	function decode_utf8(s) {
	  return decodeURIComponent(escape(s));
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