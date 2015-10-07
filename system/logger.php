<?php
/**
* Logging degli errori
*/
class logger {
	
	public static error($data) {
		if (DEBUG) var_dump($data);
		file_put_contents(__base_path.'logs'.DIRECTORY_SEPARATOR.'error.log', json_encode($data,JSON_PRETTY_PRINT).",\n",FILE_APPEND);
	}
}
?>