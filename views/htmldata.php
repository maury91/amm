<?php
/**
* Mostra i dati sotto forma di html 
*/
class htmldata {
	public static function positions() {
		$posn=array();
		$pos=positions::get();
		foreach ($pos as $v) 
			$posn[$v['id']] = $v['nome'];
		return json_encode($posn);
	}
}
?>