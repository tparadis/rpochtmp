<?php

	//Permet d'envoyer des tokens au mail d'un utilisateur envoyé en paramètre
	date_default_timezone_set('Europe/Paris');
	sleep(3);
	$mail = htmlspecialchars($_POST['mail']);

	if(filter_var($mail, FILTER_VALIDATE_EMAIL))
	{
		//Préparation des éléments
		$dbcon = pg_connect("dbname=rails user=rails");
		$token = token();

		//Ajout du couple mail/token à la bdd
		$req = 'INSERT INTO tokenmails (mail,token,created_at, updated_at) VALUES(\''.$mail.'\', \''.$token.'\', \''.date('Y-m-d H:i:s').'\',  \''.date('Y-m-d H:i:s').'\')';
		$tokeninBDD = pg_query($dbcon, $req);		
		$str = '<h4>Afin de pouvoir finaliser votre inscription, voici votre identifiant temporaire: </h4><br/><big>'.$token.'</big><br/><br/>Cordialement,<br/><br/> L\'équipe Rennes en Poche';
		$headers = "From: Rennes en Poche <contact@rennespoche.fr> \r\n";
		$headers .= "Content-Type: text/html";
		$mailret = mail($mail, "Confirmez votre inscription pour Rennes en Poche", $str, $headers );
		if($mailret) echo "ok";
		
	}
	else
	{
		echo "pasOk";
	}






function retItem($val)
{
	if($val == "int")
	{
		return (string) rand(0,9);	
	}
	else
	{
		return chr(rand(65, (65+25)));	
	}	
}

function token()
{
	//Retourne un token de la forme RD8JKL
	$str = retItem("").retItem("").retItem("int").retItem("").retItem("").retItem("");
	return $str;
}



?>
