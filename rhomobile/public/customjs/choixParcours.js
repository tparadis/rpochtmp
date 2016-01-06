$(document).ready(function(){
	
	var screenWidth = $(window).width();
	
	$("#choixParcours").css("left",screenWidth+"px");
	$("#choixParcours").load("finalParcours.erb");
	$('#resto').change(function () {
 
        $.ajax({
		    dataType: "json",
		    contentType: "application/json",
			url : "http://leopoldofr.ddns.net:3000/",
			data : {"req":"spec","format":"json"}, //req = path indique que vous formulez une requete pour creer un parcours au backend
			type : "GET",
			async:false,
			success: function(data){

				$("#result").html(data["magasin"]["nom"]);
				$("#choixParcours").stop().animate({"left":"0px"},1000);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{
				alert(textStatus +", " +errorThrown);
			}
        
		})
	
		
		
	});
	
	$("#backBtn").click(function(){
		
		$("#choixParcours").animate({"left":screenWidth+"px"},1000);
		
	});

	
	
})