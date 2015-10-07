<?php
//Path di base del progetto
define('__base_path', dirname(__FILE__).DIRECTORY_SEPARATOR);
define('__http_path','http://amm.mauriziocarboni.it/');
define('DEBUG', false);
//Creo la sessione, tanto poco ma sicuro la userò
session_start();
//Autoloading
require(__base_path.'system'.DIRECTORY_SEPARATOR.'__autoload.php');
//Controllo se è una chiamata ajax
if (ajax::is()) {
	ajax::action();
	db::close();
} else {
	//Il sito funziona interamente in ajax, quindi mostro la pagina principale
	require(__base_path.'views'.DIRECTORY_SEPARATOR.'theme.php');
}
/*$page = page::build();
$left = left::build();
*/
?>