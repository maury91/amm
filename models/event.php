<?php
/**
* Gestore eventi
*/
class event{
	/**
	* Aggiunge un nuovo evento
	**/
	public static function add($data,$dataP) {
		//Inserisco la località
		$stmt = db::getStmt("INSERT INTO `positions`(`nome`, `lat`, `lng`) VALUES (?,?,?)");
		//Collego i dati ed eseguo
		@$stmt->bind_param("sdd",$dataP['nome'],$dataP['lat'],$dataP['lng']);
		//Eseguo
		$stmt->execute();
		//Chiusura statement
		$stmt->close();
		//Costruisco la query
		$stmt2 = db::getStmt("INSERT INTO `eventi`(`nome`,`tipo`, `lat`, `lng`,`posname`,`posfullname`, `image`, `data`, `user`, `approved`) VALUES (?,?,?,?,?,?,?,?,?,?)");
		//Collego i dati ed eseguo
		@$stmt2->bind_param("siddssssii",$data['nome'],$data['tipo'],$data['lat'],$data['lng'],$dataP['nome'],$data['posname'],$data['image'],$data['data'],user::currentId(),user::isAdmin());
		//Eseguo
		$ret = $stmt2->execute();
		//Chiusura statement
		$stmt2->close();
		return $ret;
	}

	/**
	* Ritorna la lista dei propri eventi
	**/
	public static function my() {
		//Costruisco la query
		$stmt = db::getStmt("SELECT `id`,`nome`,`image`,`posfullname` FROM `eventi` WHERE `user` = ?");
		//Collego i dati ed eseguo
		@$stmt->bind_param("i",user::currentId());
		//Controlla se ha trovato un risultato
		if ($stmt->execute()) {
			$events = array();
			//Collego i dati
			$stmt->store_result();
			$stmt->bind_result($id,$nome,$image,$posfull);
			//Lista di tutte le serie TV
			while ($stmt->fetch())
				$events[] = array(
					'id' => $id,
					'nome' => $nome,
					'image' => $image,
					'posfull' => $posfull
				);
			$stmt->close();
			return $events;
		} else
			return array();
	}

	/**
	* Ritorna la lista degli eventi non approvati
	**/
	public static function notA() {
		//Costruisco la query
		$stmt = db::getStmt("SELECT `id`,`nome`,`image`,`posfullname` FROM `eventi` WHERE `approved` = 0");
		//Controlla se ha trovato un risultato
		if ($stmt->execute()) {
			$events = array();
			//Collego i dati
			$stmt->store_result();
			$stmt->bind_result($id,$nome,$image,$posfull);
			//Lista di tutte le serie TV
			while ($stmt->fetch())
				$events[] = array(
					'id' => $id,
					'nome' => $nome,
					'image' => $image,
					'posfull' => $posfull
				);
			$stmt->close();
			return $events;
		} else
			return array();
	}

	/**
	* Cerca eventi
	**/
	static public function search($day,$tipo,$where) {
		$totDay = array(1,2,7,31);
		//Costruisco la query
		$stmt = db::getStmt("SELECT  `eventi`.`id`, `eventi`.`nome`,`image`,`posfullname`,(6373*acos(cos(radians(`positions`.`lat`))*cos(radians(`eventi`.`lat`))*cos(radians(`eventi`.`lng`)-radians(`positions`.`lng`))+sin(radians(`positions`.`lat`))*sin(radians(`eventi`.`lat`)))) as `d` FROM `eventi`,`positions` WHERE `positions`.`id`= ? AND `data` < DATE_ADD(NOW(), INTERVAL ? DAY) AND `tipo` = ? HAVING `d` < 20 ORDER BY `d` ASC");
		//Collego i dati ed eseguo
		@$stmt->bind_param("iii",$where,$totDay,$tipo);
		//Controlla se ha trovato un risultato
		if ($stmt->execute()) {
			$events = array();
			//Collego i dati
			$stmt->store_result();
			$stmt->bind_result($id,$nome,$image,$posfull,$d);
			//Lista di tutte le serie TV
			while ($stmt->fetch())
				$events[] = array(
					'id' => $id,
					'nome' => $nome,
					'image' => $image,
					'posfull' => $posfull
				);
			$stmt->close();
			return $events;
		} else
			return array();
	}

	/**
	* Approvazione di un evento
	**/
	static public function approva($id) {
		//Aggiorno evente
		$stmt = db::getStmt("UPDATE `eventi` SET `approved` = 1 WHERE `id` = ?");
		//Collego i dati ed eseguo
		$stmt->bind_param("i", $id);
		//Eseguo 
		if (!$stmt->execute()) {
			//Evento non eliminato
			$stmt->close();
			return false;
		}
		$stmt->close();
		//Evento eliminato
		return true;
	}

	/**
	* Eliminazine di un evento
	**/
	static public function del($id) {
		if(user::isAdmin())
			$dok = true;
		else {
			//Controllo se l'evento appartiene all'utente
			$stmt = db::getStmt("SELECT `user` FROM `eventi` WHERE `id` = ?");
			//Collego i dati ed eseguo
			$stmt->bind_param("i", $id);
			//Eseguo ed assegno i dati alle variabili
			if (!$stmt->execute()) return false;
			$stmt->bind_result($uid);
			$stmt->fetch();
			$stmt->close();
			$dok = $uid===user::currentId();
		}
		if (!$dok) return false;
		//Ora posso eliminare l'evento
		$stmt = db::getStmt("DELETE FROM `eventi` WHERE `id` = ?");
		//Collego i dati ed eseguo
		$stmt->bind_param("i", $id);
		//Eseguo 
		if (!$stmt->execute()) {
			//Evento non eliminato
			$stmt->close();
			return false;
		}
		$stmt->close();
		//Evento eliminato
		return true;
	}
}
?>