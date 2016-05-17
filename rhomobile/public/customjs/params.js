$(document).ready(function(){
	
	var slider = new Slider(document.getElementById('slider'), 0, 50);
	slider.onChange = function(value) {
	    document.getElementById('value').textContent = Math.round(value);
	};
	slider.setValue(10);

	function Slider(container, minValue, maxValue) {
	    var slider = this;
	    
	    ///////////
	    //  DOM  //
	    ///////////
	    var slideGroup = document.createElement('div');
	    container.appendChild(slideGroup);
	    slideGroup.style.position = 'relative';
	    slideGroup.style.width = "100%";
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
	
	
	
	
	
});