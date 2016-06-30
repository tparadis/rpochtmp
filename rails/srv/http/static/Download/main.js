$(document).ready(function(e){
	$("#news")
        .css("margin-bottom","-100px")
        .on("mouseenter",function(){
            $(this).stop().animate({"margin-bottom":"0px"},400);
        })
        .on("mouseleave",function(){
            $(this).stop().animate({"margin-bottom":"-100px"},600);
        });
	
	$("#creators li")
        .on("mouseover",function(){
			$(this).stop().animate({"margin-left":"10px"},250);
		})
		.on("mouseleave",function(){
			$(this).stop().animate({"margin-left":"0px"},250);
		});
	
	$("#midbloc")
        .on("mouseover",function(){
            $("#dlicon").stop().animate({"opacity":1, "bottom":"3px"},150);
        })
        .on("mouseleave",function(){
            $("#dlicon").stop().animate({"opacity":0, "bottom":"10px"},300);
        });
});