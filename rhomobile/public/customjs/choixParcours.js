var datar = "";

$(document).ready(function () {
    var nbCat = localStorage.getItem('nbCat');
    var nbSsCat = localStorage.getItem('nbSsCat');
    var i = 0;
    var box = document.createElement("div");   box.className = "collapsible-cat-container";
    var cat_height = $("body").width() / 2;
    var list = "";
    for (i = 0; i < nbCat; i++) {
        var keyCat = "cat" + i;
        var categorie = JSON.parse(localStorage.getItem(keyCat));
        var catimg = localStorage.getItem("catimg" + i);
        var listeSsCat = "listeSsCat" + i;
        var string = "";

        //Ajout de style à la categorie
        string += "<div id='cat-"+i+"' class='categorie' style='height: "+cat_height+"px;'>"
            + "<h3><img src=" + catimg + "  width=\"32\" height=\"32\">"
            + '<span class="cat-title">'
            + categorie[1]
            + '</span>'
            + "</h3>"
            + "</div>";

        $(box).append(string);

        list +="<ul id='" + listeSsCat + "' class='listSsCat' " +
            "data-icon='plus' style='display:none;'>";
        for (var j = 0; j < nbSsCat; j++) {
            var keySsCat = 'sscat' + j;
            var ssCategorie = JSON.parse(localStorage.getItem(keySsCat));
            if (ssCategorie[2] == categorie[0]) {
                var filename;
                var fullpath;
                filename = localStorage.getItem("sscatimg" + ssCategorie[0]);
                list +=
                    "<li onclick=\"addSsCat('" + keySsCat + "')\">"
                   // + "<img src= " + filename + "  width=\"32\" height=\"32\">"
                    + "<span class='listSsCatText'>" + ssCategorie[1].replace(/\\/, "").toUpperCase() + "</span></li>";
            }
        }
        list += "</ul>";


        //si i est impair, on ferme la div(box) ouverte precedemment
        if (i % 2 == 1) {
            $("#navmenu")
                .append(box)
                .append( list );
            list = "";
            box = document.createElement("div");   box.className = "collapsible-cat-container";
        }


    }//fin for

    //si i on est sorti de la boucle sans fermer (et ajoutï¿½ le contenu) :
    if (i  == nbCat) {
        $("#navmenu")
            .append(box)
            .append( list );
    }


    //Actions sur les catégories
    $(".categorie").click(function(e){
        console.log("clisck on ", this);
        $(".listSsCat").css("display", "none");


        console.error("looking for ", "listeSsCat"+(this.id).split("-")[1]);
        var assoc_list = document.getElementById("listeSsCat"+(this.id).split("-")[1]);
        console.warn("got ", assoc_list);
        var was_active = assoc_list.classList.contains("active");
        var parent = this.parentElement;

        $(".active").removeClass("active");

        if (! was_active ) {
            parent.classList.add("active");
            assoc_list.classList.add("active");
            assoc_list.style.display = "block";
            this.classList.add("active");
        }
    });

    actualiserMagasins();
});

//Call ruby method via ajax
function call_ruby_method_via_ajax(method_name, nCommerce) {
    //$.ajax({url:'/app/DetailsCommerce/'+method_name,type : "post",data:{ magasin_id: datar.commerces[nCommerce].id }});
    $.get('/app/DetailsCommerce/' + method_name, {magasin_id: datar.commerces[nCommerce].id});
}
function addSsCat(sscat) {
    var tmp = JSON.parse(localStorage.getItem(sscat));
    sessionStorage.setItem(sessionStorage.length, JSON.stringify(tmp));
    actualiserMagasins();
    //toast message
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' > Magasin Ajout&eacute</div>").css({
            "display": "block",
            "opacity": 0.96,
            "": $(window).scrollTop()
        })
        .appendTo($.mobile.pageContainer)
        .delay(300)
        .fadeOut(300, function () {
            $(this).remove();
        });
}


function actualiserMagasins() {
    $(".cart #nb_magasins").text(sessionStorage.length);
}
