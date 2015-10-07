<?php
/**
* Questa classe si occupa di fornire metodi di astrazione del database,
* tra cui astrazione delle transizioni e connessione automatica
*/
class db {
	public static $db=null;

	public static function connect() {
		//Se non è ancora connesso
		if (is_null(self::$db)) {
			//Crea la connessione
			self::$db = new mysqli();
			//Inclusione configurazione
			require(__base_path.'system'.DIRECTORY_SEPARATOR.'config.php');
			//Apertura connessione
			self::$db->connect($db_data['host'], $db_data['user'],$db_data['pass'], $db_data['database']);
			//Controllo errori
			if(self::$db->connect_errno != 0){
				// gestione errore
				logger::error(array(
					'type' => 'DBCONNECTION',
					'file' => __FILE__,
					'info' => array(
						'id' => self::$db->connect_errno,
						'msg'=> self::$db->connect_error
					)
				));
				error::esci(1,"Impossibile connettersi al database, se il problema persiste contattare un'amministratore");
			}
		}
	}

	/**
	* Funzioni transaction
	**/
	public static function start() {
		self::query('START TRANSACTION');
	}

	public static function commit() {
		self::query('COMMIT');
	}

	public static function rollback() {
		self::query('ROLLBACK');
	}

	/**
	* Chiusura del database
	*/
	public static function close() {
		if (!is_null(self::$db))
			self::$db->close();
	}

	/**
	* Prepara uno statement e lo restituisce
	*/
	public static function getStmt($q) {
		self::connect();
		return self::$db->prepare($q);
	}

	/**
	* Esegue una query al database
	*
	*/
	public static function query($query) {
		self::connect();
		return self::$db->query($query);

	}
}
?>