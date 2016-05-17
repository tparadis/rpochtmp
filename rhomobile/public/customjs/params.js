$(document).ready(function(){
	
	var slider = new Slider(document.getElementById('slider'), 1, 50);
	slider.onChange = function(value) {
	    document.getElementById('value').textContent = Math.round(value);
	};
	var currentDist = localStorage.getItem("distMax");
	if(currentDist != null)
	{
		slider.setValue(Number(currentDist));
	}
	else
	{
		slider.setValue(10);
	}

	function Slider(container, minValue, maxValue) {
	    var slider = this;
	    
	    ///////////
	    //  DOM  //
	    ///////////
	    var slideGroup = document.createElement('div');
	    container.appendChild(slideGroup);
	    slideGroup.style.position = 'relative';
	    slideGroup.style.width = 
	    slideGroup.style.height =
	        '100%';
	    
	    var slideBar = document.createElement('div');
	    slideGroup.appendChild(slideBar);
	    slideBar.style.position = 'absolute';
	    slideBar.style.left =
	    slideBar.style.right =
	    slideBar.style.top =
	    slideBar.style.bottom =
	        Math.round(container.offsetHeight / 2 - 1) + 'px';
	    slideBar.style.backgroundColor = 'black';
	    
	    var slideButton = document.createElement('div');
	    slideGroup.appendChild(slideButton);
	    slideButton.style.position = 'absolute';
	    slideButton.style.width =
	    slideButton.style.height =
	    slideButton.style.borderRadius =
	        container.offsetHeight + 'px';

	    
	    /////////////
	    //  VALUE  //
	    /////////////
	    var value = null;
	    
	    slider.getValue = function() {
	        return value;
	    };
	    
	    slider.setValue = function(newValue) {
	        value = Math.max(minValue, Math.min(maxValue, newValue));
	        var position = (value - minValue) / (maxValue - minValue);
	        slideButton.style.left = Math.round(position * slideBar.offsetWidth) + 'px';
	        slideButton.style.backgroundColor = "black";
	        if (slider.onChange) slider.onChange(value);
	    };
	    
	    slider.setValue(minValue);
	    
	    /////////////
	    //  MOUSE  //
	    /////////////
	    var sliding = false;
	    var startX = 0;
	    
	    document.addEventListener('mousedown', function(event) {
	        if (event.target === slideButton) {
	            event.preventDefault();
	            sliding = true;
	            startX = event.pageX;
	        }
	    });
	    
	    document.addEventListener('mouseup', function(event) {
	        if (sliding) {
	            sliding = false;
	            startX = null;
	            sauvegardeEnFichier(Math.round(value));
	        }
	    });
	    
	    document.addEventListener('mousemove', function(event) {
	        if (sliding) {
	            var newValue = value + ((event.pageX - startX) / slideBar.offsetWidth) * (maxValue - minValue);
	            startX = event.pageX;
	            slider.setValue(newValue);
	        }
	    });
	}
	
	//On affine la hauteur de la balise distanceMaximale
	$("#widget01").css({"position":"absolute", "top": "70px"});
	
	
});

function sauvegardeEnFichier(newDist)
{
	var fichier = new Rho.RhoFile(Rho.RhoFile.join(Rho.Application.publicFolder,"save.txt"), Rho.RhoFile.OPEN_FOR_READ_WRITE);
	var filename = Rho.RhoFile.join(Rho.Application.publicFolder, 'save.txt'); // build the path
	var contents = Rho.RhoFile.read(filename); // read the file into a variable
	
	var debut = contents.split('\n');
	var reecrire = "distMax:"+newDist;
	var final = "";
	var i = 1;
	final += reecrire;
	
	for(i = 1; i < debut.size; i++)
	{
		final += debut[i];
	}
	
	fichier.write(final);
	
	fichier.close();
	
	localStorage.setItem("distMax", Number(newDist));
	
}















