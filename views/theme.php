<!DOCTYPE html>
<html>
	<head>
		<title>Progettino AMM</title>
		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
		<link rel="stylesheet" href="<?= __http_path ?>assets/styles/style.css"/>
		<link rel="stylesheet" href="<?= __http_path ?>assets/styles/font.css"/>
		<link href="http://fonts.googleapis.com/css?family=Lato:300,400" rel="stylesheet" type="text/css"/>
		<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB_fQ_h_M_mppwS6ur5hDkuWC8ZkfyuuZo&sensor=false"></script>
		<script type="text/javascript">
			__http_path="<?= __http_path ?>";
			userLogged=<?=user::logged()?'true':'false'?>;
			isAdmin=<?=user::isAdmin()?'true':'false'?>;
		</script>
		<script type="text/javascript" src="<?= __http_path ?>assets/js/main.js"></script>
		<script type="text/javascript" src="<?= __http_path ?>assets/js/login.js"></script>
		<script type="text/javascript" src="<?= __http_path ?>assets/js/forms.js"></script>
	</head>
	<body>
		<nav>
			<ul>
				<li style="display:none"><span class="icon">Home</span></li>
				<li<?= user::logged()?' style="display:none"':''?>><span class="icon">Accedi</span></li>
				<li<?= user::logged()?'':' style="display:none"'?>><span class="icon">Panello</span></li>
			</ul>
		</nav>
		<p id="info" style="display:none">
			<span>Premi sui campi sottolineati per perfezionare la ricerca!</span>
		</p>
		<div class="main">
			<div class="wrapper">
				<span class="selector" data-options='["Oggi","Domani","Questa Settimana","Questo Mese"]'></span>
				<span>voglio andare a</span>
				<span class="selector" data-options='["mangiare","un concerto","ballare","bere","vedere un film"]'></span>
				<span>nei pressi di</span>
				<span class="selector auto" data-options='<?= htmldata::positions() ?>'></span>
				<a class="button">Cerca</a>
			</div>
			<div class="wrapper" style="display:none">
			</div>
		</div>
		<div class="login">
			<h1>Accedi</h1>
			<div class="oneAT" id="loginForm">
				<input type="text" data-text="Username"/>
				<input type="password" data-text="Password"/>
			</div>
		</div>
		<div class="userPanel">
			<nav>
				<ul>
					<li class="selected">Aggiungi evento</li>
					<li>I miei eventi</li>
					<li class="admin"<?=user::isAdmin()?'':' style="display:none"'?>>Approva</li>
					<li>Esci</li>
				</ul>
			</nav>
			<div id="add">
				<div class="wrapper">
					<div class="photo"><span class="icon-photo"></span><span>Carica foto</span><input type="file" accept="image/*"/></div>
					<input type="text" placeholder="Nome evento"/>
					<div class="map"></div><span class="mapinfo"></span>
					<span class="selector" data-options='["Cenone","Concerto","Discoteca","Festa","Cinema"]'></span>
					<div class="date" data-hint="Quando si svolgerà l'evento">
						<input class="d" type="text" placeholder="xx" />
						<input class="m" type="text" placeholder="xx" />
						<input class="y" type="text" placeholder="201x" />
					</div>
					<a class="button">Aggiungi</a>
				</div>
			</div>
			<div id="show" style="display:none"></div>
			<div id="confirm" style="display:none"></div>
		</div>
	</body>
</html>