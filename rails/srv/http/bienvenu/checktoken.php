<?php

	//Ce script va vérifier si le token envoyé en paramètre est bon et si le mail associé est valide

	$token = htmlspecialchars($_POST["token"]);
	$mail = htmlspecialchars($_POST["mail"]);

	$dbcon = pg_connect("dbname=rails user=rails") or die("Impossible de se connecter à POSTGRESQL");
	$req = "SELECT token FROM tokenmails WHERE mail = 'leopoldo@hotmail.fr' ORDER BY created_at DESC LIMIT 1 ";
	$reqq = pg_query($req);
	$tokenBDD = "";
	while($arr = pg_fetch_assoc($reqq))
	{
		$tokenBDD = $arr["token"];	
	}
	if($tokenBDD == $token)
	{	
		pg_query("DELETE FROM tokenmails WHERE mail = '".$mail."'");
		echo "ok";
	}
	else
	{
		echo "pasOk";	
	}




?>
