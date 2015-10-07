<?php
/**
* Questa classe gestisce i risultati Ajax
*/
class ajax{
	/**
	* Questa funziona controlla se è una chiamata ajax
	* per farla semplice, tutte le chiamate sono fatte in POST
	**/
	static public function is() {
		return count($_POST);
	}

	/**
	* Questa funzione conclude la chiamata ajax
	**/
	static public function end($value) {
		//La maggior parte delle chiamate tendono a volere una semplice risposta si/no
		if (is_bool($value))
			exit(print(json_encode(array('r'=>$value))));
		exit(print(json_encode($value)));
	}

	/**
	* Elabora la chiamata ajax
	*/
	static public function action() {
		/**
		* Avrei preferito un
		* if ((str_pos($_POST['act'],'..')===false)&& file_exists(__base_path.strtolower($_POST['act']).'.php')) include(__base_path.strtolower($_POST['act']).'.php');
		* Ma sarebbe stato senza utilizzo di classi...
		**/
		switch (strtolower($_POST['act'])) {
			case 'logout':
				ajax::end(user::logout());
			break;
			case 'login':
				/**
				* Esecuzione login
				**/
				if (user::logged()) {
					//Utente loggato
					ajax::end(array(
						'r'=>true,
						'a'=>user::isAdmin()
					));
				} else {
					//Tento il login
					ajax::end(array(
						'r'=>user::login($_POST['user'],$_POST['pass']),
						'a'=>user::isAdmin()
					));
				}
			break;
			case 'newev':
				//Bisogna essere loggati per creare un evento
				if (user::logged()) {
					//Upload immagine
					$img = upload::image($_FILES['image']);
					ajax::end(event::add(array(
						'nome' => $_POST['nome'],
						'lat' => $_POST['lat'],
						'lng' => $_POST['lng'],
						'tipo' => $_POST['type'],
						'posname' => $_POST['mapfull'],
						'data' => $_POST['y'].'-'.str_pad($_POST['m'], 2,'0',STR_PAD_LEFT).'-'.str_pad($_POST['d'], 2,'0',STR_PAD_LEFT),
						'image' => $img
					),array(
						'nome' => $_POST['maploc'],
						'lat' => $_POST['apxlat'],
						'lng' => $_POST['apxlng']
					)));
				}
				else 
					ajax::end(false);
			break;
			case 'events':
				ajax::end(event::search($_POST['day'],$_POST['tipo'],$_POST['where']));
			break;
			case 'getmyev':
				//Bisogna essere loggati per vedere i propri eventi
				if (user::logged()) {
					ajax::end(event::my());
				}
				else 
					ajax::end(false);	
			break;
			case 'delev':
				//Bisogna essere loggati per eliminare gli eventi
				if (user::logged()) {
					ajax::end(event::del($_POST['id']));
				}
				else 
					ajax::end(false);
			break;
			case 'naev':
				//Lista eventi non approvati
				if (user::isAdmin())
					ajax::end(event::notA());
				else
					ajax::end(false);
			break;
			case 'apev':
				//Lista eventi non approvati
				if (user::isAdmin())
					ajax::end(event::approva($_POST['id']));
				else
					ajax::end(false);
			break;
			default:
				ajax::end(array('r'=>false,'err'=>404));
			break;
		}
	}
}
?>