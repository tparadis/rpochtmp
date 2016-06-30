<?php
	//SCRIPT RPOCH

	//En fait le num_lin est utile juste pour la mise en BDD
	//Si le num_line change d'une MAJ à l'Autre, le nom de fichier en BDD restera le meme qu'avant
	//et ce, meme si le num_line change du commerce change

	$titre = $_POST["titre"];
	$num_line = $_POST["num_line"];
	$nomFichier = $_FILES["image"]["name"];
	$ext = pathinfo($nomFichier, PATHINFO_EXTENSION);
	$nomFinal = $titre.'_'.$num_line.'.'.$ext;

	//Extension autorisées
	$allowed = array('gif', 'GIF', 'jpg', 'JPG', 'png', 'PNG');

	if(!in_array($ext, $allowed))
	{
		echo "pasok";	
	}
	else if(strpos($nomFinal, '.php') != false)
	{
		echo "pasok";
	}
	else if($_FILES["image"]["size"] > 20000000) //20 Mo
	{	
		echo "pasok";	
	}
	else
	{
		$directory = "/srv/http/static/images/";
		unlink($directory.$nomFinal);
		if(move_uploaded_file($_FILES["image"]["tmp_name"], $directory.$nomFinal))
		{
			$str = 'update commerces set image=\''.$nomFinal.'\' where enseigne = \''.strtoupper($titre).'\' and line= \''.$num_line.'\';'.PHP_EOL ; 
			file_put_contents("/srv/http/uploadImages/toUpdate", $str, FILE_APPEND);
			echo $nomFinal;	
		}
		else
		{
			echo "pasok";	
		}
		
	}


	

	
	


?>
