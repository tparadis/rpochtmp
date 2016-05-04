function init() {
	sessionStorage.clear();
	chargementCategories();
	
}
$(document).ready(function(e){
	$("#page").css("height","100%");
	$("#page").css("margin","0");
	$("#page").css("padding","0");
	$("#menuAcc").css("top", $("#footer").height()+10 +"px");
	
});