var gmap,mappos=null,maploc,mapfull,mapapx;
/**
* per addatarsi alle dimensioni del display
* calcolo la dimensione di base del testo (da cui poi tutto grazie ad em e rem viene riadatto)
* e l'orientamento
**/
function update_base_font() {
	//Imposto la dimensione del testo di base
	$('html').css('fontSize',(window.innerHeight+window.innerWidth)/70);
	//Orientamento
	if (window.innerHeight>window.innerWidth)
		$('html').addClass('portrait').removeClass('landscape');
	else
		$('html').addClass('landscape').removeClass('portrait');
	//Prevent mobile to be crazy
	$('html,body,body>div').css({
		height: window.innerHeight,
		width: window.innerWidth
	});
}
//Update iniziale
update_base_font();
//Update al ridimensionamento
$(window).resize(update_base_font);
//Nascondo dietro le schermate che non devo mostrare (mi serve visibile per avere la dimensione degli oggetti)
$(function(){
	$('body > .login, body > .userPanel').css({
		zIndex:-1,
		visibility:'hidden'
	});
});
//Al caricamento di tutto
$(window).bind('load',function() {
	//Caricamento mappa
	var marker=null,photoSelected=false;
	gmap = new google.maps.Map($('#add > div > .map').get(0), {
        zoom: 6
    });
    google.maps.event.addListener(gmap, "click", function (d) {
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+d.latLng.lat()+','+d.latLng.lng()+'&sensor=false',function(a){
        	//Cerco un valore che mi vada bene
        	var name=null,searched=["route","administrative_area_level_1","administrative_area_level_2","administrative_area_level_3","locality","sublocality_level_1","sublocality_level_2","sublocality_level_3"],
        		curA=-1,curB=-1,x;
        	for (var i=0,l=a.results.length;i<l;i++) {
        		for (var j=0,m=a.results[i].types.length;j<m;j++) {
        			if ((x=searched.indexOf(a.results[i].types[j])) > curA) {
    					curA=x;
    					for (var h=0,n=a.results[i].address_components.length;h<n;h++) {
    						for (var e=0,o=a.results[i].address_components[h].types.length;e<o;e++) {
	    						if ((y=searched.indexOf(a.results[i].address_components[h].types[e])) > curB) {
	    							curB = y;
	    							name=a.results[i].address_components[h].long_name;
	    							mapapx=a.results[i].geometry.location;
	    						}
    						}
    					}
        			}
        		}
        	}
        	//Controllo se ho trovato un valore
        	if (name!==null) {
	        	mapfull=a.results[0].formatted_address;
	        	maploc=name;
	        	$('#add > div > .mapinfo').text(name);
	        	if (marker !== null)
		        	marker.setMap(null);
		        marker = new google.maps.Marker({
		            position: d.latLng,
		            map: gmap,
		            icon: {
			            url: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2288FF|FFFFFF",
			            size: new google.maps.Size(21, 34),
			            origin: new google.maps.Point(0, 0),
			            anchor: new google.maps.Point(10, 33)
			        },
		            animation: google.maps.Animation.DROP
		        });
		        mappos = {
		            lat : d.latLng.lat(),
		            lng : d.latLng.lng()
		        };
        	} else {
        		alert('Posizione non valida (sempre che non sia una barca)');
        	}
        	
        });
        
    });
	navigator.geolocation && navigator.geolocation.getCurrentPosition(function (a) {
		a = new google.maps.LatLng(a.coords.latitude, a.coords.longitude);
		gmap.setCenter(a);
	}, function () {
		console.log("No GeoLocation!");
	});
	//Nuovo ridimensionamento (serve per il mobile che è duro di comprendorio)
	setTimeout(update_base_font,500);
	//Mostro l'avviso dopo un po' che la pagina è apparsa (per far vedere all'utente l'animazione)
	setTimeout(function(){
		//Se è un nuovo utente
		if (localStorage.getItem('info')===null) {
			//Mostro e bindo la funzione di chiusura
			$('body > #info').show().click(function(){
				//Animazione di chiusura
				var that=this;
					$(this).children('span').animate({
					height:0,
					marginTop:'1em',
					lineHeight:0
				},400,function(){
					//Salvataggio dati
					that.remove();
					localStorage.setItem('info','showed');
				});
			}).children('span').css({
				height : 0,
				lineHeight: 0,
				marginTop:'1em',
			}).animate({
				marginTop:0,
				height:'2em',
				lineHeight:'2em'
			},1200);
		}
	},1500);
	//Hide sezioni che non sono la principale
	setTimeout(function(){
		$('body > .login, body > .userPanel').hide().css({
			zIndex:'',
			visibility:''
		});
	},1000);
	//Navigation animations
	$('body > nav > ul > li').click(function(){
		//Create a clone and animate it
		var act = $('body > nav > ul > li').index(this),
			off = $(this).offset(),
			cln = $('<span class="nav_animation" />').text($(this).text()).css({
				left : off.left,
				right: window.innerWidth-(off.left+($(this).width()+parseFloat($(this).css('paddingLeft'))*2)),
				top : off.top,
				backgroundColor : $(this).css('backgroundColor'),
				fontSize: $(this).css('fontSize'),
				color: $(this).css('color')
			}).animate({
				top: 0},
				600, function() {
					//L'animazione è composta da due parti
					$(this).animate({
						left: 0,
						right: 0},
						600, function() {
							$(this).remove();
							switch (act) {
								case 0 :
									//Show Main
									$('body > nav > ul > li').hide();
									if (userLogged)
										$('body > nav > ul > li:nth-child(3)').show();
									else
										$('body > nav > ul > li:nth-child(2)').show();
									$('body').children('.main').show().end().children('.login,.userPanel').hide();
								break;
								case 1 :
									//Show Accedi
									$('body > nav > ul > li').hide().first().show();
									var a = $('body').children('.main,.userPanel').hide().end().children('.login').show().children('.oneAT');
									setTimeout(function(){
										a.focus();
									},600);
								break;
								case 2 :
									//Show User panel
									$('body > nav > ul > li').hide().first().show();
									$('body').children('.main,.login').hide().end().children('.userPanel').show();
								break;
							}
					});
			}).appendTo('body');
	});
	//Login Function
	$('#loginForm').data('onSubmit',function(stopAnimation,inputs){
		var
			user=inputs.first().val(),
			pass=inputs.last().val();
		inputs.val('');
		execute_login(stopAnimation,user,pass);
	});
	//Photo selection
	$('#add > div > .photo').click(function(e) {
		$(this).find('input').click();
	}).find('input').click(function(event) {
		event.stopPropagation();
	}).change(function(e) {
		//Load file
		var reader = new FileReader();
	    reader.onload = function(e) {
	    	photoSelected=true;
	    	$('#add > div > .photo').css('backgroundImage','url('+e.target.result+')').children().hide();
	    };
	    reader.readAsDataURL(this.files[0]);
	});
	//Inserimento evento
	$('#add > div > a.button').click(function(){
		//Check photo
		if (!photoSelected) return alert('Carica una foto per l\'evento');
		//Check mappa
		if (mappos==null) return alert('Clicca sulla mappa per selezionare un punto');
		//Check nome
		var nome=$.trim($('#add > div > input').val());
		if (nome.length<3) return alert('Nome evento troppo corto');
		//Check data
		//Anno
		var a=parseInt($('#add > div > .date > .y').val());
		if (a<100) a+=2000;
		if (isNaN(a)||(a<2014)||(a>2020)) return alert('Anno non valido');
		//Mese
		var m=parseInt($('#add > div > .date > .m').val());
		if (isNaN(m)||(m<1)||(m>12)) return alert('Mese non valido');
		var mDays=[0,31,28,31,30,31,30,31,31,30,31,30,31];
		//Bisestile
		if (a%4)
			mDays[2]++;
		//Giorno
		var d=parseInt($('#add > div > .date > .d').val());
		if (isNaN(d)||(d<1)||(d>mDays[m])) return alert('Giorno non valido');
		//Tutto apposto, invia!
		var formData = new FormData(),
			uploadProgressShadow = $('<div class="uploadProgress"/>'),
			uploadProgress = $('<div class="bar"/>').appendTo(uploadProgressShadow);
		uploadProgressShadow.appendTo('.userPanel');
		formData.append('act','newEv');
		formData.append('nome',nome);
		formData.append('maploc',maploc);
		formData.append('mapfull',mapfull);
		formData.append('apxlat',mapapx.lat);
		formData.append('apxlng',mapapx.lng);
		formData.append('d',d);
		formData.append('m',m);
		formData.append('y',a);
		formData.append('lat',mappos.lat);
		formData.append('lng',mappos.lng);
		formData.append('type',$('#add > div > .selector').data('selected'));
		formData.append("image", $('#add > div > .photo > input').get(0).files[0]);
		$.ajax({
			data: formData,
			xhr: function() {
				//Gestione progresso
	            var myXhr = $.ajaxSettings.xhr();
	            if(myXhr.upload){ 
	                myXhr.upload.addEventListener('progress',function(e) {
	                	console.log(e.loaded/e.total,e.loaded,e.total);
	                	uploadProgress.stop().animate({'width':e.loaded/e.total*100+'%'},200);
	                }, false);
	            }
	            return myXhr;
	        },
	        cache: false,
	        contentType: false,
	        processData: false
		})
		.done(function(r) {
			if (r.r) {
				show_myevents();
				//Reset campi
				$('#add > div > .photo').css('backgroundImage', '').children('span').show();
				$('#add > div > input,#add > div > .date > input').val('');
				if (marker !== null)
		        	marker.setMap(null);
		        marker = null;
		        $('#add > div > .mapinfo').text('');
			}
		})
		.fail(function() {
			alert('Errore nel caricamento');
		})
		.always(function() {
			uploadProgressShadow.fadeOut(200, function() {
				$(this).remove();
			});
		});
	});
	//Navigazione pannello di controllo utente
	var show_myevents = function() {
		//Lista eventi
		$('#add,#confirm').hide();
		$('#show').show();
		//Carica eventi
		$.ajax({
			data: {act: 'getMyEv'},
		})
		.done(function(r) {
			if ((typeof r.r === "boolean")&&(!r.r))
				return alert('Errore nel caricamento');
			$('#show').html('');
			for (var i=0,l=r.length;i<l;i++) {
				var d=$('<div class="result"/>')
					.append($('<span class="nome"/>').text(r[i].nome))
					.append($('<span class="position"/>').text(r[i].posfull))
					.append($('<span class="image"/>').css('backgroundImage','url("'+__http_path+'images/'+r[i].image+'")'))
					.append($('<a class="button delete">Elimina</a>').click($.proxy(function(id){
						var that=this;
						$.ajax({
							data: {
								act : 'delev',
								id : id
							}
						})
						.done(function(r) {
							//Nel caso l'eliminazione abbia successo, allora lo elimina anche da qui
							if (r.r) {
								$(that).closest('div.result').fadeOut(400, function() {
									$(this).remove();
								});
							}
						})
						.fail(function() {
							console.log("error");
						})
						.always(function() {
							console.log("complete");
						});
						
					},null,r[i].id)));
				$('#show').append(d);
			}
			
		})
		.fail(function() {
			alert('Errore nel caricamento');
		});
	}
	//Ricerca
	var first_search = true,
		do_search = function() {
		//Search params
		var s = $('.main > .wrapper > .selector'),
			s1 = s.eq(0).data('selected'),
			s2 = s.eq(1).data('selected'),
			s3 = s.eq(2).data('selected');
		//Carica eventi
		$.ajax({
			data: {
				act: 'events',
				day: s1,
				tipo: s2,
				where: s3
			},
		})
		.done(function(r) {
			if ((typeof r.r === "boolean")&&(!r.r))
				return alert('Errore nel caricamento');
			if (first_search) {
				first_search = false;
				$('.main > .wrapper:first').animate({
					marginLeft : 0,
					marginTop : 0,
					top : 0,
					width:'100%',
					lineHeight : '2rem'
				}).css({
					zIndex: 2
				}).children('span:not(.selector)').animate({
					fontSize : 0
				}).end()
				  .children('a').fadeOut().end()
				  .children('span.selector').animate({
					fontSize : '.6em'
				}).change(do_search);
			}
			var cont = $('.main > .wrapper:last').html('').show();
			for (var i=0,l=r.length;i<l;i++) {
				var d=$('<div class="result"/>')
					.append($('<span class="nome"/>').text(r[i].nome))
					.append($('<span class="position"/>').text(r[i].posfull))
					.append($('<span class="image"/>').css('backgroundImage','url("'+__http_path+'images/'+r[i].image+'")'));
				cont.append(d.hide());
			}
			setTimeout(function(){
				$('.main > .wrapper:last > .result').each(function(index) {
					setTimeout($.proxy(function(){
						$(this).fadeIn(200);
					},this),200*index);
				});
			},500);
		})
		.fail(function() {
			alert('Errore nel caricamento');
		});
	}
	$('body > .userPanel > nav > ul > li')
		.click(function(){
			$(this).parent().children().removeClass('selected').end().end().addClass('selected');
		})
		.eq(0).click(function() {
			//Aggiungi evento
			$('#show,#confirm').hide();
			$('#add').show();
		}).end().eq(1).click(show_myevents)
		  .end().eq(2).click(function() {
			//Approva eventi
			$('#add,#show').hide();
			$('#confirm').show();
			//Carica eventi
			$.ajax({
				data: {act: 'naev'},
			})
			.done(function(r) {
				if ((typeof r.r === "boolean")&&(!r.r))
					return alert('Errore nel caricamento');
				$('#confirm').html('');
				for (var i=0,l=r.length;i<l;i++) {
					var d=$('<div class="result"/>')
						.append($('<span class="nome"/>').text(r[i].nome))
						.append($('<span class="position"/>').text(r[i].posfull))
						.append($('<span class="image"/>').css('backgroundImage','url("'+__http_path+'images/'+r[i].image+'")'))
						.append($('<a class="button appr">Approva</a>').click($.proxy(function(id){
							var that=this;
							$.ajax({
								data: {
									act : 'apev',
									id : id
								}
							})
							.done(function(r) {
								//Nel caso l'eliminazione abbia successo, allora lo elimina anche da qui
								if (r.r) {
									$(that).closest('div.result').fadeOut(400, function() {
										$(this).remove();
									});
								}
							});
						},null,r[i].id)))
						.append($('<a class="button delete">Elimina</a>').click($.proxy(function(id){
							var that=this;
							$.ajax({
								data: {
									act : 'delev',
									id : id
								}
							})
							.done(function(r) {
								//Nel caso l'eliminazione abbia successo, allora lo elimina anche da qui
								if (r.r) {
									$(that).closest('div.result').fadeOut(400, function() {
										$(this).remove();
									});
								}
							});
						},null,r[i].id)));
					$('#confirm').append(d);
				}
				
			})
			.fail(function() {
				alert('Errore nel caricamento');
			});
		}).end().last().click(function() {
			//Logout
			$.ajax({
				data: {act: 'logout'},
			})
			.done(function(r) {
				if (r.r) {
					//Logout success
					$('body > nav > ul > li').hide().eq(1).show();
					$('body').children('.main').show().end().children('.login,.userPanel').hide();

				}
			})
			.fail(function() {
				alert('Errore nel caricamento');
			});
				
		});
	//Ricerca
	$('.main > .wrapper > a.button').click(do_search);
});
//Setup Ajax
$.ajaxSetup({
	url: __http_path,
	type:'POST',
	dataType:'json'
});
