var listData = [];                             
        
function makelist(){
			   listData = ['Coiffeur' , 'Magasins de chaussure' , 'Salle de massage' , 'Parfumerie' , 'Opticien'];
			   var numberOfListItems = listData.length;   			   
               if(numberOfListItems != 0){
                	/**Création du nouveau tableau*/
                	var listContainer = document.getElementById("listeParcours")
                
                	var listElement = document.createElement("table");
                	listContainer.appendChild(listElement);
                
                	for( var i =  0 ; i < numberOfListItems ; ++i){
                		
                		/**Création ligne*/
                        	var listItem = document.createElement("tr");
                        	listElement.appendChild(listItem);
                        	
                        /**Ajout du magasin*/	
                        	listItem = document.createElement("td");
                        	listItem.innerHTML = listData[i];
                        	listElement.appendChild(listItem);          
                        	
                        /** Ajout des tags*/
                        	listItem = document.createElement("td");
							listElement.appendChild(listItem);
							
							/**Ajout de l'image du bouton tags*/
                        	listItem = document.createElement("img");
                        	listItem.src = '/public/images/listArrowDown.png';
                        	listItem.id = listData[i];
                        	//TODO :: LE onclick ne fonctionne pas il doit afficher une popup contenant la liste de tags avec des checkbox
                        	listItem.onclick = "afficherTags(" + listData[i] + ");";
                        	listElement.appendChild(listItem);
                        	
						/** Ajout bouton suppression*/
                        	listItem = document.createElement("td");
							listElement.appendChild(listItem);
							
							/**Ajout de l'image du bouton de suppression*/
                        	listItem = document.createElement("img");
                        	listItem.src = '/public/images/cancel.png';
                        	listItem.id = listData[i];
                        	listElement.appendChild(listItem);
                    }
                	
              }
              else{
            	  document.getElementById("listeParcours").innerHTML = "Vous n'avez choisis aucun magasin pour votre parcours.";
              }
}

function afficherTags(nomMagasin){
	document.write("je suis ici");
}

function addTags(){
	
}

window.onload = makelist();