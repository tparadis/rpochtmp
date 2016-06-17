function init() {
	sessionStorage.clear();
	chargementCategories();
	
}
$(document).ready(function(e){
	$("#page").css("height","100%");
	$("#page").css("margin","0");
	$("#page").css("padding","0");
	$("#menuAcc").css("top", $("#footer").height()+10 +"px");
	
	localStorage.setItem("userlat", "48.1113531");
	localStorage.setItem("userlng", "-1.6786842999999863");
	//pour recuperer l'id du telephone
	//alert(Rho.System.getProperties(["phoneId"]).phoneId);
	//console.log(Rho.System.getProperties(["phoneId"]));

	

});