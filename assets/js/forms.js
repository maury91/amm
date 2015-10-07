$(window).bind('load',function() {
	/**
	* Seletore fico
	**/
	var selector_select = function(id,text,selector) {
			/**
			* Questa funzione viene eseguita quando scegli un valore
			*
			* La funzione aggiorna il testo del selettore, e fa sparire l'interfaccia di selezione
			**/
			$(selector).text(text).data('selected',id).change();
			$(this).parent().children('span.selected').removeClass('selected');
			$(this).addClass('selected');

		},
		selector_open = function() {
			/**
			* QUando clicchi sul selettore esegue questa funzione
			*
			* Si occupa di far apparire l'interfaccia di selezione
			**/

			/**
			* Variabili prima parte funzione
			*
			* alcuni elementi DOM che servono per mostrare il selettore
			* opzioni del selettore
			* offset del selettore e sue dimensioni (che serviranno per centrare l'interfaccia di selezione)
			* variabili di supporto clousure
			**/
			var shadow = $('<div class="selector_list"/>'),
				opened= $('<div/>'),
				opts  = $(this).data('options'),
				off = $(this).offset(),
				th = $(this).height()+parseInt($(this).css('paddingTop'))+parseInt($(this).css('paddingBottom')),
				tw = $(this).width()+parseInt($(this).css('paddingLeft'))+parseInt($(this).css('paddingRight')),
				curSelector = this,
				curSel = $(this).data('selected');
			//Creazione degli elementi per la scelta dentro l'interfaccia di selezione
			for (var i in opts) {
				var spn = $('<span/>').css('float', 'left').text(opts[i]).click($.proxy(selector_select,null,i, opts[i], curSelector));
				if (i === curSel)
					spn.addClass('selected');
				opened.append(spn);
			}
			//Body > Shadow > Interfaccia Selezione > Options
			opened.appendTo(shadow);
			//Animazione ombra
			shadow.appendTo($(this).parent()).css('opacity', .3).animate({
				opacity : 1
			});
			//Calcolo la dimensione degli elementi, mi serve il più largo e la dimensione totale in altezza
			var childSize=[0,0];
			opened.children('span').each(function(index, el) {
				var w = $(this).width()+parseInt($(this).css('paddingLeft')),
					h = $(this).height();
				if (w>childSize[0]) childSize[0] = w;
				childSize[1] +=h+2;
			}).removeAttr('style');
			//Calculate positions for the animation
			var animT = off.top+th/2,
				animL = off.left+tw/2,
				marL = -(childSize[0]+40)/2,
				marT = -childSize[1]/2,
				wid = childSize[0]+40;
			animT = (animT+marT>=0)?animT:-marT;
			animL = (animL+marL>=0)?animL:-marL;
			//Funzione di chiusura (viene attivata in qualsiasi punto calchi)
			shadow.click(function(event) {
				shadow.animate({
					opacity: .3},
					//Alla fine dell'animazione di chiusura elimino tutto
					function() {
						$(this).remove();
				});
				//Animazione inversa (zoom out)
				opened.animate({
					fontSize: ".7em",
					width: wid*.7,
					marginLeft : marL*.7,
					marginTop : marT*.7
				});
			});
			//Applico le dimensioni iniziali ed eseguo l'animazione zoom in
			opened.css({
				fontSize: ".7em",
				width: wid*.7,
				top : animT,
				left : animL,
				marginLeft : marL*.7,
				marginTop : marT*.7
			}).animate({
				fontSize: "1em",
				width: wid,
				marginLeft : marL,
				marginTop : marT,
			});
		};

	/**
	* Creazione dei selettori
	**/
	$('.selector').each(function(index, el) {
		//So che jQuery lo fa in "automatico" ma mi piace andare sul sicuro
		var selected=null,options=$.parseJSON($(this).attr('data-options'));
		//Nel caso ci sia l'attributo data-selected (valore di default)	
		if ($(this).is('[data-selected]')) {
			selected = $.parseJSON($(this).attr('data-selected'));
			$(this).removeAttr('data-selected');
		}
		//Trasformazione da [] a {}
		if (options instanceof Array) {
			//Trasformo in un oggetto
			var trf = {};
			for (var i=0,l=options.length;i<l;i++)
				trf[i] = options[i];
			options = trf;
		}
		//Mi salvo le opzioni (dopo averle opzionalmente trasformate)
		$(this).data('options',options).removeAttr('data-options');
		//Non deve essere vuoto
		if ((options instanceof Object)&&(Object.keys(options).length>0)) {
			//Nessun elemento selezionato predefinito
			if (selected==null) {
				//Seleziona la prima
				selected = (options instanceof Array)?0:Object.keys(options)[0];
			}
			//Testo del valore selezionato, bind dell'azione di apertura e dei dati
			$(this).text(options[selected]).click(selector_open).data('selected',selected);
		}
		
	});

	/**
	* Input raggrupati (guarda su Accedi e capirai)
	**/

	/**
	* Funzione che mostra l'input successivo
	**/
	var oneAT_next = function() {
		/**
		* Input corrente e totale
		* variabili di supporto per le animazioni
		**/
		var current=$(this).data('current'),
			total=$(this).data('total'),
			that=$(this).children('div.container'),
			ch=that.children().eq(current);
		//Check current value (not empty)
		if ($.trim(ch.val()).length>0) {
			//Se è l'ultimo input eseguo il submit e l'animazione
			if (total===current+1) {
				//Controllo esistenza funzione submit
				var submitFunc = $(this).data('onSubmit');
				if (typeof submitFunc === "function") {
					//Faccio sparire il contenuto e creo l'elemento animato
					$(this).children().fadeOut(200).end()
						.append($('<span class="waiting"/>'));
					//Chiamo la funzione di submit con due parametri : funzione per terminare l'animazioe di loading e inputs	
					submitFunc($.proxy(function(){
						//Il primo input deve tornare visibile
						var fi = $(this).find('div.container > input').hide().first().show();
						//Reset valori, i vecchi elementi tornano visibili e l'elemento waiting va cancellato
						$(this).data('current',0).children('span.waiting').remove()
							.end().children().stop().css('opacity','').show().filter('span.status').css('width','').end().filter('div.text').children().text(fi.data('text'));
					},this),that.children('input'));
				}
			} else {
				//Animazione next
				var t=$(this).children('div.text'),
					n=that.children().eq(++current),
					h=t.height();
				//Il testo mi serve di altezza fissa
				t.css('height', h);
				//Sposto il vecchio testo in alto e creo il nuovo sotto
				t.append($('<span/>').text(n.data('text')))
					.children('span').first().animate({marginTop : -h}, 400,function(){
						$(this).remove();
					});
				//Aggiorno il valore di current e animo la barra del progresso
				$(this).data('current',current).children('span.status').animate({width:(current/total*100)+'%'}, 400);
				//FadeOut vecchio input, fadeIn del nuovo
				ch.fadeOut(200, function() {
					n.fadeIn(200, function() {
						$(this).focus();
					});
				});
			}
		}
	}

	/**
	* Creazione dei oneAT
	**/
	$('.oneAT').each(function(index, el) {
		//Variabili di supporto e variabile per i clousure
		var mW=0,mH=0,
			inputContainer=$('<div class="container"/>'),
			that=this,
			//Text è il testo da mostrare, in pratica quello del primo input, guarda la catena per capire meglio
			text=
				$(this).children().each(function(index, el) {
					//Ottengo la dimensione massima degli input
					var w,h;
						if (mW<(w=$(this).width()+parseFloat($(this).css('paddingLeft'))*2)) mW = w;
						if (mH<(h=$(this).height()+parseFloat($(this).css('paddingTop'))*2)) mH = h;
						//Bind dei dati e spostamento degli elementi in inputContainer
						$(this).data('text', $(this).attr('data-text')).removeAttr('data-text')
							.appendTo(inputContainer);
				})
				//Tutti gli input devono avere la dimensione del più grande
				.css({
					width: mW,
					height: mH
				}).hide().first().show().data('text');//Faccio rimanere visibile solo il primo
		//Setto le dimensione del elemento padre, e alcuni dati
		$(this).css({
				width: mW
			})
			.attr('tabindex', 0)
			.focus(function(e) {
				//Seleziona input corrente
				$(this).children('.container').children('input').eq($(this).data('current')).focus();
			})
			.data('current',0)
			.data('total',inputContainer.children().length)
			//Aggiungo tutto il contenuto
			.append($('<div class="text"/>').append($('<span/>').text(text)))
			.append(inputContainer.height(mH+2))
			.append($('<span class="status"/>'));
		//Aggiungo la freccia a destra
		inputContainer.append($('<span class="icon-next"/>').click(function(event) {
			//Go to next
			oneAT_next.call(that);
		})).children().focus(function(event) {
			//La freccia destra appare quando selezioni per la prima volta
			$(this).parent().children('span.icon-next').fadeIn();
		});
	}).keydown(function(e) {
		//Ma devo anche commentarla questa?
		switch (e.keyCode) {
			case 13 :
				//Go to next
				oneAT_next.call(this);
			case 9 :
				//Disable Tab
				e.preventDefault();
				//Go to next
				oneAT_next.call(this);
			break;
		}
	});

	
});