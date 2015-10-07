<?php
/**
* Gestore upload
*/
class upload{
	
	public static function image($file) {
		if (!getimagesize($file['tmp_name'])) {
			//Non è un immagine
			return false;
		}
		//Controlla esistenza di un file con lo stesso nome
		$ext = '.'.substr(strrchr($file['name'], "."), 1);
		$n=0;
		$name =  basename($file['name'],$ext);
		while (file_exists(__base_path.'images/'.$name.(($n>0)?"($n)":'').$ext))
			$n++;
		$finalname=$name.(($n>0)?"($n)":'').$ext;
		return move_uploaded_file($file['tmp_name'], __base_path.'images/'.$finalname)?$finalname:false;
	}
}
?>