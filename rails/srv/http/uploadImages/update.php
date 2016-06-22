<?php

//Ici, nous mettons à jour la BASE DE DONNE grace au fichier 
//toUpdate que nous avons crées
	pg_connect("dbname=rails user=rails");
	$handle = fopen("toUpdate", "r");
	if($handle)
	{
		while(($line = fgets($handle)) !== false)
		{
			
			
			pg_query($line);	
			
			
		}
		fclose($handle);

		
	}

	//Maintenant on clean le dossier où nous avons nos images
	//Ceci sera utile pour une maintenance optimale
	$dir = scandir("/srv/http/static/images/");
	$allowed = ["jpg", "JPG", "png", "PNG", "gif", "GIF"];

	foreach($dir as $file)
	{
		$trouve = false;
		//print $file;
		$ext = pathinfo($file, PATHINFO_EXTENSION);
		if($ext != "" && in_array($ext, $allowed))
		{
			$req = pg_query("SELECT image from commerces where image != 'noimage.jpg'");
			while($row = pg_fetch_row($req))
			{
				if ($file == $row[0])
				{
					//Image trouvée, tout va bien
					$trouve = true;
					break;
				}
			}
			if($trouve == false)
			{
				//Image non trouvée, ça se passe moins bien
				echo $file." inexistant<br/>";
				unlink("/srv/http/static/images/".$file);
			}
		}
		
		
	}

	
?>
