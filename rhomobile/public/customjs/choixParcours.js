var datar = "";
var firstTime = true;
var MAXMAGASINS = 30;
var currentli = 0;

$(document).ready(function () {
    var nbCat = localStorage.getItem('nbCat');
    var nbSsCat = localStorage.getItem('nbSsCat');
    var i = 0;
    var box = document.createElement("div");   box.className = "collapsible-cat-container";
    var cat_height = $("body").width() / 2;
    var list = "";
    var listR = [2,21,24,70,80];
    for (i = 0; i < nbCat; i++) {
        var keyCat = "cat" + i;
        var categorie = JSON.parse(localStorage.getItem(keyCat));
        var catimg = localStorage.getItem("catimg" + i);
        var listeSsCat = "listeSsCat" + i;
        var string = "";
        var bordureDroite = "";
        var bordureBottom = "";
        
        //Ajout de la bordure droite si n�cessaire
        if(i%2 == 0)
        {
        	bordureDroite = '<div class="bordureDroite"></div>';
        }
        if(nbCat - i > 1 && i != nbCat - 1)
        {
        	bordureBottom = '<div class="bordureBottom"></div>';
        }
        //Ajout de style � la categorie
        string += "<div id='cat-"+i+"' class='categorie' style='height: "+cat_height+"px;'>"
            + "<h3><img src=" + catimg + "  width=\"32\" height=\"32\">"
            + '<span class="cat-title">'
            + categorie[1]
            + '</span>'
            + "</h3>"
			+ bordureDroite
			+ bordureBottom
            + "</div>";

        $(box).append(string);
        
        //Mise � 100% pour la largeur de la derniere cat�gorie si elle est seule sur la derni�re ligne
        if(i == nbCat -1 && i%2 == 0)
        {
        	var last = $(box).find(".categorie:last");
        	last.css("width", "100%");
        	var firstWidth = $(box).find(".categorie:first").width();
        	var newSize = 0.8*firstWidth;
        	last.find("h3 img").css("width", newSize+"px");
        	last.css("padding-bottom", "0px");
        	last.css("margin-bottom", "0px");
        	last.find("h3 img").css("height",newSize+"px");
        	last.find("h3 img").css("margin-top","15px");
        	//Un peu �trange mais �a ajuste l'icone du milieu, te poses pas de questions
        	last.find("h3 img").css("margin-left",(newSize*1.65)+"px");
        }

        list +="<ul id='" + listeSsCat + "' class='listSsCat' " +
            "data-icon='plus' style='display:none;'>";
        for (var j = 0; j < nbSsCat; j++) {
            var keySsCat = 'sscat' + j;
            var ssCategorie = JSON.parse(localStorage.getItem(keySsCat));
            if (ssCategorie[2] == categorie[0]) {
                var filename;
                var fullpath;
                filename = localStorage.getItem("sscatimg" + ssCategorie[0]);
                if(ssCategorie[3]){
                	list += "<li id='li"+ssCategorie[0]+"'  class='options' onclick=\"showSel('sel" + ssCategorie[0] +"')\">";
                }else{
                	list += "<li onclick=\"addSsCat('" + keySsCat + "')\">";
                }
                   // + "<img src= " + filename + "  width=\"32\" height=\"32\">"
                try
                {
                	if(ssCategorie[3]){

                		list += "<span  class='listSsCatText'>" + ssCategorie[1].replace(/\\/, "").toUpperCase()
						+"<span id='anim"+ssCategorie[0]+"' class='animTransfert'> + </span></span>"
						+"</li>"
						+"<div id='sel"+ssCategorie[0]+"' class='ssList'>"
						+"<select id='val"+ssCategorie[0]+"'> "
	                	+"<option value="+ssCategorie[0]+">Categorie</option>"
	                	+"<option value='62'> Mixte </option>"
						+"<option value='59'> Homme </option>"
						+"<option value='58'> Femme </option>"
						+"<option value='60'> Enfant </option>"
						+"</select>"
						+"<button class='addcat' onclick=\"addSsCat('" + keySsCat + "')\">+</button>"
						+"</div>";
					

	                }else{
	                	list += "<span class='listSsCatText'>" + ssCategorie[1].replace(/\\/, "").toUpperCase()+"<span id='anim"+ssCategorie[0]+"' class='animTransfert' > + </span></span></li>";
	                }
                }
                catch(err)
                {
                	console.log("Erreur : "+err);
                }
            }
        }
        list += "</ul>";
       
        //si i est impair, on ferme la div(box) ouverte precedemment
        if (i % 2 == 1) {
            $("#navmenu")
                .append(box)
                .append( list );
            list = "";
            box = document.createElement("div");  
            box.className = "collapsible-cat-container";
        }

    }//fin for

    //si i on est sorti de la boucle sans fermer (et ajoute le contenu) :
    if (i  == nbCat) {
        $("#navmenu")
            .append(box)
            .append( list );
    }

    //Actions sur les cat�gories
    $(".categorie").click(function(e){
        $(".listSsCat").css("display", "none");

        var assoc_list = document.getElementById("listeSsCat"+(this.id).split("-")[1]);
        var was_active = assoc_list.classList.contains("active");
        var parent = this.parentElement;

        $(".active").removeClass("active");

        if (! was_active ) {
            parent.classList.add("active");
            assoc_list.classList.add("active");
            assoc_list.style.display = "block";
            this.classList.add("active");
        }
        hideAll();
    });

    actualiserMagasins();
    
    
    
    //Ajout des animation sur les li
    $("li").on("click",function(){    	
    	var action = $(this).attr("onclick");
    	if(action.indexOf("addSsCat") >=0)
    	{
    		//Action � effectuer sur une cat�gorie normale
    		$(this).closest("li").animate({"background-color":"#008B87"}, 200).animate({"background-color":"rgb(167,191,199)"},300);
    		console.log(action)
    		
    	}
    	else
    	{
    		currentli = $(this).attr('id');
    		console.log(currentli)
    	}
    });
    $("button.addcat").on("click",function(e){
    	$("div[role='main'] li#"+currentli).animate({"background-color":"#008B87"}, 200).animate({"background-color":"rgb(167,191,199)"},300);
    })
	
	//Animations sur les Cat�gories
	$(".collapsible-cat-container").on("click",function(){
		
		$("html,body").stop().animate({"scrollTop":($(this).offset().top - 60)},300);
		
	})
	
 
});

function showSel(id){
	
	hideAll();
	$(document.getElementById(id)).show(10);
}

function  hideAll(){
	
	$(document.getElementById("sel21")).hide();
	$(document.getElementById("sel80")).hide();
	$(document.getElementById("sel70")).hide();
	$(document.getElementById("sel24")).hide();
	$(document.getElementById("sel2")).hide();
}

//Call ruby method via ajax
function call_ruby_method_via_ajax(method_name, nCommerce) {
    //$.ajax({url:'/app/DetailsCommerce/'+method_name,type : "post",data:{ magasin_id: datar.commerces[nCommerce].id }});
    $.get('/app/DetailsCommerce/' + method_name, {magasin_id: datar.commerces[nCommerce].id});
}

function addSsCat(sscat) {
	if(sessionStorage.length < MAXMAGASINS)
	{
		var tmp = JSON.parse(localStorage.getItem(sscat));
	    console.log(tmp);
	    var tags =[];
    	tags.push(tmp[0]);

    	if(tmp[3]){
	    	tags.push(parseInt(document.getElementById("val"+tmp[0]).value));
	    }
		tmp.push(tags);	
	    console.log(tmp);
	    sessionStorage.setItem(sessionStorage.length, JSON.stringify(tmp));
	    actualiserMagasins();
	    
	    $(document.getElementById("anim"+tmp[0])).stop().animate({"opacity":"1"},500).animate({"bottom":"700px","left":"200px","size":"50px", "opacity":"0"},2000).animate({"bottom":"0px","left":"0px", "opacity":"0"},50);
	}
}

function actualiserMagasins() {
	//Petite animation pour dire qu'il faut cliquer sur le magasin
	if(!firstTime)
	{
		$("#animationPlus").stop().animate({"bottom":"18px", "opacity":"1"},300).delay(500).animate({"bottom":"0px", "opacity":"0"},500);
		
	}
	else if(firstTime)
	{
		$("#animationPlus").css("opacity","0");
	}
	firstTime = false;
    $(".cart #nb_magasins").text(sessionStorage.length);
}
