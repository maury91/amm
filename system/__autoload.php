<?php
/**
* Loading automatico dei files richiesti
*/
function __autoload($class_name) {
	//Cartelle
	$directorys = array(
		'system',
		'models',
		'views',
		'controllers'
	);
	
	//Scorro tutte le directory
	foreach($directorys as $directory) {
		//Controlla se il file esiste
		if(file_exists(__base_path.$directory.DIRECTORY_SEPARATOR.$class_name.'.php')) {
			require_once(__base_path.$directory.DIRECTORY_SEPARATOR.$class_name .'.php');
			//Ritorna vero
			return true;
		}            
	}
	return false;
}
?>