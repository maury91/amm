<?php
/**
* Posizioni
*/
class positions{
	
	/**
	* Ritorna la lista delle posizioni
	**/
	public static function get() {
		//Costruisco la query
		$stmt = db::getStmt("SELECT `id`,`nome`, `lat`, `lng` FROM `positions`");
		//Controlla se ha trovato un risultato
		if ($stmt->execute()) {
			$pos = array();
			//Collego i dati
			$stmt->store_result();
			$stmt->bind_result($id,$nome,$lat,$lng);
			//Lista di tutte le serie TV
			while ($stmt->fetch())
				$pos[] = array(
					'id' => $id,
					'nome' => $nome,
					'lat' => $lat,
					'lng' => $lng
				);
			$stmt->close();
			return $pos;
		} else
			return array();
	}
}

?>