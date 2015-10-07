/**
* Login
**/
function execute_login(animEnd,u,p) {
	$.ajax({
		data: {
			act : 'login',
			user : u,
			pass : p
		},
	})
	.done(function(r) {
		//Todo bien
		if (r.r) {
			//Show User panel
			$('body > nav > ul > li').hide().first().show();
			var up = $('body').children('.main,.login').hide().end().children('.userPanel').show();
			if (r.a) {
				//Show admin functions
				up.find('ul > li.admin').show();
			} else {
				//Hide admin functions
				up.find('ul > li.admin').hide();
			}
		}
	})
	.fail(function() {
		alert('Errore nella chiamata, forse non sei connesso a internet')
	})
	.always(animEnd);
}