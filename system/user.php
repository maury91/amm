<?php
/**
* Gestisce gli utenti
*/
class user {
	
	public static function login($user,$pass) {
		//Costruisco la query
		$stmt = db::getStmt("SELECT `password`,`id`,`amministratore` FROM `utenti` WHERE `nickname` = ?");
		//Collego i dati ed eseguo
		$stmt->bind_param("s", $user);
		//Eseguo ed assegno i dati alle variabili
		if (!$stmt->execute()) return false;
		$stmt->bind_result($password,$id,$admin);
		$stmt->fetch();
		$stmt->close();
		//Controllo della password
		if (md5($pass)!=$password) return false;
		//Se la password è ok modifico la sessione
		$_SESSION['user'] = array(
			'nick' => $user,
			'id' => $id,
			'admin' => $admin==1
		);
		return true;
	}

	public static function aggiungi($data) {
		//Costruisco la query
		$stmt = db::getStmt("INSERT INTO `utenti` (`nickname`,`password`) VALUES (?,?)");
		//Collego i dati ed eseguo
		$stmt->bind_param("ss", $data['user'],md5($data['password']));
		//Eseguo
		$ret = $stmt->execute();
		//Chiusura statement
		$stmt->close();
		return $ret;
	}

	public static function all() {
		//Costruisco la query
		$stmt = db::getStmt("SELECT `id`,`nickname` FROM `utenti` WHERE `amministratore`=0");
		//Controlla se ha trovato un risultato
		if ($stmt->execute()) {
			$users = array();
			//Collego i dati
			$stmt->bind_result($id,$user);
			while ($stmt->fetch())
				$users[] = array('id'=>$id,'user'=>$user);
			$stmt->close();
			//Ritorna le serie che ha trovato
			return $users;
		} else
			return false;
	}

	public static function elimina($id) {
		//Controllo che non sia un'amministratore
		$stmt = db::getStmt("SELECT `amministratore` FROM `utenti` WHERE `id` = ?");
		//Collego i dati ed eseguo
		$stmt->bind_param("i", $id);
		//Eseguo ed assegno i dati alle variabili
		if (!$stmt->execute()) return false;
		$stmt->bind_result($admin);
		$stmt->fetch();
		$stmt->close();
		if($admin) return false;
		//Avvio la transazione
		db::start();
		//Elimino le serie create dall'utente (è inutile visto che la foreign key le cancellerebbe in automatico ma ho bisogno di fare una transaction)
		if (!serie::eliminaFromUser($id)) {
			db::rollback();
			return false;
		}
		//ELimino anche l'utente ora
		//Controllo che non sia un'amministratore
		$stmt = db::getStmt("DELETE FROM `utenti` WHERE `id` = ?");
		//Collego i dati ed eseguo
		$stmt->bind_param("i", $id);
		//Eseguo 
		if (!$stmt->execute()) {
			//Utente non eliminato, ripristina le serie
			$stmt->close();
			db::rollback();
			return false;
		}
		$stmt->close();
		//Utente eliminato, rendi effettive le modifiche
		db::commit();
		return true;
	}

	public static function current() {
		return (isset($_SESSION['user']))?$_SESSION['user']:false;
	}

	public static function logged() {
		return (isset($_SESSION['user']));
	}

	public static function currentId() {
		return (isset($_SESSION['user']))?$_SESSION['user']['id']:false;
	}

	public static function isAdmin() {
		return (isset($_SESSION['user']))?$_SESSION['user']['admin']:false;
	}

	public static function logout() {
		unset($_SESSION['user']);
		session_destroy();
		return true;
	}
}
?>