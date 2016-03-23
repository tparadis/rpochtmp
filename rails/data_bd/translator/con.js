var readline = require('linebyline'), r1 = readline('./toMaj');

r1.on('line',function(line,lineCount,byteCount){
	
	if(line != "")
	{
	
		var lineMaj = line.charAt(1).toUpperCase() + line.slice(2);
		console.log("update sscategories set esp = '"+lineMaj+"' where esp = '"+line.slice(1)+"';");




	
	
	
	}

});
