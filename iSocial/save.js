$(document).ready(function(){
		
		document.body.onclick=guardarOpciones;
		guardarOpciones();
		
		$("input[type='checkbox']").click(function(){
			valor = localStorage[$(this).attr("name")] 
			if(valor=="true"){localStorage[$(this).attr("name")]="false";$(this)[0].parentNode.className=""}
			else{localStorage[$(this).attr("name")]="true";$(this)[0].parentNode.className="checked-on"}
			
			if($("input[name='bgimage']").attr("value") != "on") {$("#tab2").removeClass().addClass("tab demo");$("body").removeClass().addClass("sinbg");}
			else {$("#tab2").removeClass().addClass("tab");$("body").removeClass("sinbg").addClass("conbg");}
		});	
		
		for (x in localStorage){
			if(localStorage[x] == "true") {
				$("input[name="+x+"]").attr('checked', true);
				$("input[name="+x+"]").parent().addClass("checked-on");
			}
		}
		
		if($("input[name='bgimage']").attr("value") != "on") {$("#tab2").removeClass().addClass("tab demo");$("body").removeClass("conbg").addClass("sinbg");}
		else {$("#tab2").removeClass().addClass("tab");$("body").removeClass("conbg").addClass("conbg");}
		$(".tab").hide();$("#tab1").show();
		
		$(".menu a").click(function(){
			$(".tab").hide();
			$("#tab"+$(this).attr("rel")).show();
			$(".active").removeClass();
			$(this).addClass("active");
		});
		
		$(".imgpr-field").val(localStorage["bgimageurl"]);
		$(".bg-preview, body").css("background-image","url("+$(".imgpr-field").val()+")");
		
		$("input[type=text]").change(function(){
			localStorage[$(this).attr("class")] = $(this).val();
		});
		
		$(".visitas").val(localStorage["visitas"]);
		
		$(".imgpr-field").change(function(){
			$(".bg-preview, body").css("background-image","url("+$(".imgpr-field").val()+")");
			localStorage["bgimageurl"] = $(".imgpr-field").val();
		});
		
		if(localStorage["bgimage"] == "true") {
			$("body").addClass(localStorage["color"]);
		}
		
		$(".bgexamples a").click(function(){
			var asdf = $(this).css("background-image").slice(4,-1);
			asdf = asdf.replace('7a839sdfa2','default')
			var width = screen.widht
			var height = screen.height
			if(width==1366&&height==768){asdf = asdf.replace('default','default2')}
			if(width==1440&&height==990){asdf = asdf.replace('default','default2')}	
			$(".bg-preview, body").css("background-image","url("+asdf+")");
			localStorage["bgimageurl"] = asdf
		});
		
		$(".colors a").click(function(){
			$("body").removeClass().addClass("conbg").addClass($(this).attr("class"));
			localStorage["color"] = $(this).attr("class");
		});
	});
	
function guardarOpciones(){
anadirCss = ""

		//Cabecera Octubre 2011
		anadirCss+=".header .logo {float: left;display: inline;height: 24px;width: 91px;margin-top: 8px;background: url('chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/images/botones.png') no-repeat 2px -124px;border-right: 1px solid #6992BC;border-right: 1px solid rgba(255, 255, 255, 0.15);} .corporateContainer .header a.logo {background: url('chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/images/botones.png') no-repeat -153px -124px;width: 143px;text-indent: -9999px;}"
		
		//CALENDARIO////////////////////////////////////////////////////////////////////////////////////////
				
		// Esconder eventos
		if (localStorage["hideinvitesevents"] == "true") {anadirCss+="a#event_main_info{display:none !important;}   .mod.pendingRequests.eventRequestList {display:none !important;} #event_request_footer {display:none !important;}"}		
		
		// Minimizar calendario
		if (localStorage["hidecalendar"] == "true") {anadirCss+="#appointments{-webkit-transition-property:width,background;-webkit-transition-duration:450ms;-webkit-transition-timing-function:ease-out;height:70px;overflow:hidden;position:absolute;width:200px;background:#f5f5f5 url(http://estaticosak1.tuenti.com/layout/web2-Zero/tuenti/images/layout/mod_shadow.35030.png) repeat-x 0 70px;}#appointments:hover{height:115px;position:absolute;width:775px;z-index:1;-webkit-column-count:3;-webkit-column-gap:40px;-webkit-box-shadow:0px 0px 2px #666;padding:10px;line-height:16px;margin-left:9px;border:1px solid #fff;-webkit-border-radius:3px;background:#fff url(http://estaticosak1.tuenti.com/layout/web2-Zero/tuenti/images/layout/mod_shadow.35030.png) repeat-x 0 100%;margin-top:-11px;border-bottom-width:2px;}#appointments ul{display:inline;}#appointments li{display:block;}#appointments ul{-webkit-column-break-inside:avoid;}#home #user_groups_box{margin-top:110px;}#isocialFrame {position: relative}"}
		
		// Eliminar calendario
		if (localStorage["hidecalendarpro"] == "true") {anadirCss+="div#appointments.mod.events {display:none !important;}"}
		
		// Esconder páginas
		if (localStorage["hideinvitepages"] == "true") {anadirCss+="a#page_invitation_main_info.new{display:none !important;} "}
		
		// Esconder "Mis páginas"
		if (localStorage["hideplacepages"] == "true") {anadirCss+="div#user_groups_box.mod.groups{display:none !important;} "}
		
		
		
		//JUEGOS///////////////////////////////////////////////////////////////////////////////////////////
		
		
		// Esconder juegos
		if (localStorage["hideinvitegames"] == "true") {anadirCss+="a#game_invitation_main_info.new{display:none !important;}  .mod.pendingRequests.gameRequestList {display:none;} #game_request_footer {display:none;}"}
		
		// Esconder botón JUEGOS
		if (localStorage["hidebuttongames"] == "true") {anadirCss+="#tab_games {display:none !important;}"}
		
		// Esconder sugerencias juegos
		if (localStorage["hidecarouselgames"] == "true") {anadirCss+="div#featured_games_carousel {display:none !important;} div.topFeatured.carousel {display:none !important;}"}
		
		// Esconder sugerencias juegos
		if (localStorage["hidegamesfriends"] == "true") {anadirCss+="div#game_cross_promotion_canvas {display:none !important;}"}
		
		
	
		
		
		//APARIENCIA//////////////////////////////////////////////////////////////////////////////////////
		
		//Buscador burbuja
		
		if (localStorage["burblesearch"] == "true") {anadirCss+=".header li.search input{-webkit-border-radius:10px!important;}"}
		
		// Estados en burbujas
		if (localStorage["wall"] == "true") {anadirCss+=".statusWall .mod.formBox{background-color:#fff;}.statusWall{background-color: transparent !important;padding:15px 0!important;}.statusWall .status:before{content:url(chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/iamges/estado.png);display:block;position:absolute;margin-left:-15px;}.statusWall .status{background-color:#f5f5f5;border:1px solid #d9d9d9;-webkit-border-radius:3px;width:388px;padding:5px 40px 5px 10px;}#wall_posts_content .status,#personal_status .statusBox{border-radius:10px !important;background:-webkit-gradient(linear, left top,left bottom, from(#ECECEC),to(#FAFAFA))}"}
		
		// Tartita
		if (localStorage["tartita"] == "true") {anadirCss+=".eventIconBirthday{background:url(chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/images/tarta.png)!important;}"}
		
		// Avatares grandes
		if (localStorage["avatar"] == "true") {anadirCss+=".mod.avatarMod .body {    padding: 0px;}.mod.avatarMod .body img {    max-width: 235px !important;    width: 235px !important;}#avatar div.action, .mod.avatarMod .action, .mod.homeInfo .action {    top: 0px; right: 0px;}.mod.avatarMod {    margin: 0 !important;}"}
		
		// Sombras de relieve
		if (localStorage["shadows"] == "true") {anadirCss+=".layout-1,.layout-2,.layout-3,.layout-4,.layout-5,.chatDockItems,#header,#loading,#footer{box-shadow: 3px 3px 5px -1px black;-moz-box-shadow: 3px 3px 5px -1px black;-webkit-box-shadow:black 3px 3px 5px -1px;}"}
		
		//Flow..
		
		//Propiedades transition --> max-height, height, background-image, background-color, border-color, color, text-decoration, opacity, -webkit-box-shadow, box-shadow, top, left, padding, display, position, float, margin, vertical-align, width, padding-bottom, margin-top, margin-right, margin-bottom, margin-left, padding-top, padding-right, padding-bottom, padding-left, clear                                                 
		
		if (localStorage["flow"] == "true") {anadirCss+="* {-webkit-transition-property: max-height, height, background-color, border-color, color, text-decoration, opacity, -webkit-box-shadow, box-shadow, top, left, padding, display, position, float, margin, vertical-align, width, padding-bottom, margin-top, margin-right, margin-bottom, margin-left, padding-top, padding-right, padding-bottom, padding-left, clear;-webkit-transition-duration: .15s;-webkit-transition-timing-function: ease-out; transition-delay: 0s;} a:not(#photo_action):hover { opacity: .75; } a:not(#photo_action):active { opacity: .5; }"}
		
		// Fondo
		if (localStorage["fondo"] == "true") { localStorage["fondocss"] = "html, body {background:url("+localStorage["bgimageurl"]+") fixed repeat top left !important;-webkit-background-size: cover;background-size: cover;}body{background-attachment:fixed;background-position:left top;}#share_canvas{background:#fff;border-bottom:1px solid rgba(0,0,0,0.48);}#load{margin-top:0;margin-left:0;position:absolute;top:0;right:0;left:0;padding:10px;}.layout-1,.layout-2,.layout-3,.layout-4,.layout-5,.layout-6,.layout-7 .subContent,.layout-8 .subContent,.layout-7 .gameContainer,#portal_canvas{width:954px;background-color:#fff;border-bottom:1px solid #d9d9d9;}.layout-7 .gameContainer{padding-top:20px;}.layout-4,#portal_canvas,.layout-7 .gameContainer,.layout-7 .subContent,.layout-8 .subContent,.layout-9,.colContainer{width:954px;background-color:#fff;border:1px solid #d9d9d9;padding-right:10px;padding-left:10px;margin-top:0;}.colContainer{padding-left:0;padding-right:0;width:975px;border-top-style:none;}#game_cross_promotion_canvas{width:954px;background-color:#fff;border:1px solid #d9d9d9;padding-right:10px;padding-left:10px;margin-top:20px;}.footer{background-color:#fff;border:1px solid #d9d9d9;width:954px;margin:20px auto -16px;padding:10px;}.requests .footer{border:none !important;}.footer .body{border-top-style:none;}.layout-1,.layout-2,.layout-6{border-right:1px solid #d9d9d9;padding-right:20px;}.layout-3,.layout-5{border-left:1px solid #d9d9d9;padding-left:20px;}.layout-7 .subContent,.layout-8 .subContent{border:1px solid #d9d9d9;border-top:none;padding-left:12px;padding-right:8px;}div.belowSubHeader,.layout-9,.gameContainer{margin-top:0;border-top:none !important;}div#login_canvas{background:url(chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/images/titleini.png) no-repeat center 100px;height:589px;position:absolute;top:0;right:0;bottom:0;left:0;}div#login_canvas div.login{background:rgba(0,0,0,0.48) none;margin-left:auto;margin-right:auto;position:relative;float:none;top:220px;-webkit-border-radius:5px;width:435px;height:95px;padding:5px;}div#login_canvas #form_login{background-color:#fffeff;width:415px;height:75px;overflow:hidden;padding:10px;}div#login_canvas #form_login label.inputLabel{color:#000;text-shadow:#fff 0 0 0;}div#login_canvas #form_login .input input{border:1px solid #c9c9c9;height:15px;}div#login_canvas #form_login .rememberMe,#form_login a{color:#959595;}div#login_canvas .footer{display:block;background:rgba(0,0,0,0.48) none;height:7px;border:0;position:fixed;left:0;bottom:0;right:0;width:100%;margin:0;padding:0;}div#login_canvas .footer:hover{-webkit-transition:all 150ms ease-in;display:block;background-color:#5686b2;height:100px;}#share_canvas .footer,div#login_canvas .cover,div#login_canvas div.getAccount{display:none;} .mod.status .fieldPost {background-color: white!important;} .canvas .mod.homeChat .body {background-color: white !important;}"; } else { localStorage["fondocss"] = ""; }
	
	
	
		//CHAT////////////////////////////////////////////////////////////////////////////////////////////


		// Chat largo
		if (localStorage["longchat"] == "true") {anadirCss+="#chat_home_module ul.longList{height:auto!important;}"}
		
		//Quitar sonido chat abajo en DOM
		
	    // Minimizar Chat
		if (localStorage["hidechat"] == "true") {anadirCss+="#chat_home_module {position: absolute; right: 1px;}#chat_home_module ul.longList{height:310px!important;}#chat_home_module{-webkit-transition-property:width,background;-webkit-transition-duration:450ms;-webkit-transition-timing-function:ease-out;height:130px;overflow:hidden;position:absolute;width:200px;background: url(http://estaticosak1.tuenti.com/layout/web2-Zero/tuenti/images/layout/mod_shadow.35030.png) repeat-x 0 70px;}#chat_home_module:hover{height:auto!important;position:absolute;width:210px;z-index:1;-webkit-box-shadow:0px 0px 2px #666;padding:10px;line-height:16px;margin-left:9px;border:1px solid #fff;-webkit-border-radius:3px;background:#fff url(http://estaticosak1.tuenti.com/layout/web2-Zero/tuenti/images/layout/mod_shadow.35030.png) repeat-x 0 100%;margin-top:-11px;border-bottom-width:2px;}#appointments ul{display:inline;}#chat_home_module li{display:block;}#chat_home_module ul{-webkit-column-break-inside:avoid;}#home #user_groups_box{margin-top:110px;}#isocialFrame {position: relative}#canvas_friend_suggestions {display: none !important;}"}
		
		//Quitar detector Chat Cam abajo en el DOM
		
		// Ampliar ventana Chat
		if (localStorage["expandchatwindow"] == "true") {anadirCss+=".chatDockDialogViewportFlow {height: 180px;overflow: auto;width: 335px !important;}.chatDockItem.open .overlay {display: block;width: 356px !important;}.chatDockItem.open.maximized .chatDockDialogViewportFlow {height: 380px !important;overflow: auto !important;width: 336px !important;} .chatDockItem.open textarea {display: block;height: 20px;min-height: 30px;width: 325px !important;} .chatDockMenu {background: whiteSmoke url(chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/images/buttons.png) repeat-x 0px -396px;border-bottom: 1px solid #DEDEDE;text-align: center;}"}
		
		
		// Buscador chat
		if (localStorage["chatsearch"] == "true") {anadirCss+="#chat_roster_module_search_container{display:block!important;}"}
		
			
		//VÍDEOS//////////////////////////////////////////////////////////////////////////////////////////////
		
		
		//Ocultar botón vídeos
		if (localStorage["hidevideo"] == "true") {anadirCss+="#tab_media{display:none !important;}"}
		
		
		//A tomar por culo la publicidad
		if (localStorage["hidechannelmode"] == "true") {anadirCss+=".promotedChannels.carousel {display: none !important;}"}
		
		//Ocultar topMusic
		if (localStorage["hidetopmusic"] == "true") {anadirCss+="span#topVideosLeftColumn {display:none !important;}"}
		
		//Ocultar topTv
		if (localStorage["hidetoptv"] == "true") {anadirCss+="span#topVideosRightColumn {display:none !important;}"}
		
		//Ocultar Nuevo canal
		if (localStorage["hidenewchannel"] == "true") {anadirCss+="div.mainActions._canAddPlaylists {display:none !important;}"}
		
		//Ocultar Automáticamente
		if (localStorage["automaticvideohide"] == "true") {anadirCss+=".videoPlayerOverlayLightbox object[height='245'], .videoPlayerOverlayLightbox object[height='293'] { height: 36px !important; }.videoPlayerOverlayLightbox:hover object[height='245'] { height: 279px !important; } .videoPlayerOverlayLightbox:hover object[height='293'] { height: 386px !important; }"}


		//FOTOS//////////////////////////////////////////////////////////////////////////////////////////////

		//Descarga de imágenes
		
		if (localStorage["photodownload2"] == "true"){anadirCss+="#photo_border {display: none !important} #save_gif {display: none !important}"}
		
		
		//Ver bien imagenes de no amigos
		
		if (localStorage["wellview"] == "true"){anadirCss+="div#multiitemsearch.layout-3.multiItemSearch.multiitemsearch-people .outsideNetwork { opacity:1 !important; }div#multiitemsearch.layout-3.multiItemSearch.multiitemsearch-people img.outsideNetwork{height:150px !important; width:150px!important;}"}
			
			
		//ELEMENTOS ISOCIAL///////////////////////////////////////////////////////////////////////////


		// Esconder emoticonos
		if (localStorage["modemoticonos"] == "true") {anadirCss+="#gestorMessage{display: none !important;}"}



		//PUBLICIDAD/////////////////////////////////////////////////////////////////////////////////////////
		
		// Esconder paginas de abajo
		if (localStorage["hidepages"] == "true") {anadirCss+="#trigger-exclusive_sponsorships.footerRibbon{display: none;}"}
		
		// Esconder eventos patrocinados
		if (localStorage["hideads"] == "true") {anadirCss+=".mod.sponsoredEvents{display:none !important}"}
		
		// Esconder anuncios de carga
		if (localStorage["hideload"] == "true") {anadirCss+=".loadingTip { display: none !important; }"}
		
		
		
		
		//AMIGOS EN TUENTI///////////////////////////////////////////////////////////////////////////////////
		
		// Esconder invitaciones a Tuenti
		if (localStorage["hideinvites"] == "true") {anadirCss+="#home #invitations{display:none !important;}"}
		
		// Esconder busqueda MSN
		if (localStorage["hidemsn"] == "true") {anadirCss+="#home #home_friends_importer{float:right!important;display: none!important;}"}
		
	    // Ocultar sugerencias de amigos
		if (localStorage["suggestions"] == "true") {anadirCss+="#canvas_friend_suggestions {display: none !important;}"}
		
		// Alerta original
	    if (localStorage["friki"] == "true") {anadirCss+="#home_main_info i.itemMedia.sIcon.active.sGame {background:url(chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/images/cuba.png)no-repeat 0 0;}"}
		


		//TU/////////////////////////////////////////////////////////////////////////////////////////////////

		// Esconder invitaciones a Tu
		if (localStorage["hideinvitestu"] == "true") {anadirCss+="div#invitation_widget.mod.tuInvites {display:none !important;}"}
		
		// Esconder amigos en Tu
		if (localStorage["hidefriendstu"] == "true") {anadirCss+="div.nModtuUserContacts {display:none !important;}"}
		
		// Esconder ayuda Tu
		if (localStorage["hidehelptu"] == "true") {anadirCss+="div.nMod.tuHelpHome {display:none !important;}"}
		
		// Esconder acceso Tu
		if (localStorage["hiderecargatu"] == "true") {anadirCss+="div.balanceActions {display:none !important;}"}
		
		if (localStorage["hideaccesstu"] == "true") { anadirCss+="#tab_tu{display:none !important;}"; }
		
		anadirCss+="#albums > .main {background: rgba(255, 255, 255, 0.8);}"
		anadirCss+="#mail_box_body .message {width: 360px !important;}"
		
		//Definimos las frases dependiendo de la opción
		if(localStorage["melotiro"]==true){
		if(localStorage["melotiro2"]=="tirarselo"){
anadirCss += '.itemBody > .metaInfo .nomola {width: 53px;}.info > .metaInfo .nomola{width:52px}.nomola:before {content: "Â¡Me lo tiro! ";}'
anadirCss += '.itemBody > .metaInfo .mola {width: 82px;} .info > .metaInfo .mola {width: 82px;}.mola:before {content: "Ya no me lo tiro. ";}'
}
if(localStorage["melotiro2"]=="molarselo"){
anadirCss += '.itemBody > .metaInfo .nomola {width: 45px;}.info > .metaInfo .nomola{width:50px}.nomola:before {content: "Â¡Me mola! ";}'
anadirCss += '.itemBody > .metaInfo .mola {width: 75px;} .info > .metaInfo .mola {width: 80px;}.mola:before {content: "Ya no me mola. ";}'
}
}
		

		
		//CORRECCIONES//////////////////////////////////////////////////////////////////////////////////////
		
		//Fondo de los álbumes
		anadirCss+="#albums > .main {background: rgba(255, 255, 255, 0.8);}"
		anadirCss+="#mail_box_body .message {width: 360px !important;}"
		anadirCss+='.metaInfo .mobile.sentFromiPhone,._messages .mobile.sentFromiPhone{color:transparent !important;margin-right:-157px !important}.metaInfo .mobile.sentFromBB,._messages .mobile.sentFromiBB{color:transparent !important;margin-right:-177px !important}.replied{display:none}.metaInfo .mobile.sentFromiPhone:before,._messages .mobile.sentFromiPhone:before{content:"iPhone";color:gray;margin-right:4px}.metaInfo .mobile.sentFromBB:before,._messages .mobile.sentFromBB:before{content:"BB";color:gray;margin-right:4px}#blog_entry_actions{background:transparent}'
		anadirCss+=".feedEntry .commentEntry,.feedEntry .commentPager{border-left:2px solid rgba(0,0,0,0.2)!important;font-size:11px;padding:4px 20px 4px 10px !important}.commentForm{border-left:2px solid rgba(0,0,0,0.2)!important;margin:4px 0 0;padding:0 0 4px 10px}.textInput{background:rgba(255,255,255,0.8)}.nFeed .userName{position:relative;margin-bottom:-10px;font-weight:700;background:transparent;z-index:1;padding:0}"
		anadirCss+="#appointments {z-index: 99 !important;} #chat_home_module {z-index: 98 !important;}"
		
		
		
		
		var NEWCSS = ""
		
		//Load modificado
		NEWCSS+="body #ad_iframe, body #ad_iframe * { display: none !important; } #container.container { visibility: visible !important;}";
			
		NEWCSS+="#updatealert0056{display:none !important;}";
		
		//CONFIGURACION SIN FONDO

		NEWCSS+="html,body{background-color: #fff no-repeat fixed top center!important; background-size: 100% 100%; width:100%;}body{background-attachment:fixed;background-position:left top;}#share_canvas .footer{display:none;}#share_canvas{background:#fff;border-bottom:1px solid rgba(0,0,0,0.48);}#load{margin-top:0;margin-left:0;position:fixed!important;top:0;right:0;left:0;background:rgba(255,255,255,0.8);padding:10px;}.layout-1,.layout-2,.layout-3,.layout-4,.layout-5,.layout-6,.layout-7 .subContent,.layout-8 .subContent{width:954px;background-color:#fff;border-bottom:1px solid #d9d9d9;}.layout-4{width:954px;background-color:#fff;border-bottom:1px solid #d9d9d9;border-right:1px solid #d9d9d9;border-left:1px solid #d9d9d9;padding-right:10px;padding-left:10px;}.footer{}.requests .footer{}.footer .body{}.layout-1,.layout-2,.layout-6{border-right:1px solid #d9d9d9;padding-right:20px;}.layout-3,.layout-5{border-left:1px solid #d9d9d9;padding-left:20px;}.layout-7 .subContent,.layout-8 .subContent{border:1px solid #d9d9d9;border-top:none;padding-left:12px;padding-right:8px;}div#login_canvas{background:url(chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/tuenti/images/titleini.png) no-repeat center 100px;height:589px;position:absolute;top:0;right:0;bottom:0;left:0;}div#login_canvas div.login{background:rgba(0,0,0,0.48) none;margin-left:auto;margin-right:auto;position:relative;float:none;top:220px;-webkit-border-radius:5px;width:435px;height:95px;padding:5px;}div#login_canvas #form_login{background-color:#fffeff;width:415px;height:75px;overflow:hidden;padding:10px;}div#login_canvas #form_login label.inputLabel{color:#000;text-shadow:#fff 0 0 0;}div#login_canvas #form_login .input input{border:1px solid #c9c9c9;height:15px;}div#login_canvas #form_login .rememberMe,#form_login a{color:#959595;}div#login_canvas .footer{display:block;background:rgba(0,0,0,0.48) none;height:7px;border:0;position:fixed;left:0;bottom:0;right:0;margin:0;padding:0;}div#login_canvas .footer:hover{-webkit-transition:all 400ms ease-in;display:block;background-color:#5686b2;height:100px;}div#login_canvas .cover,div#login_canvas div.getAccount{display:none;} .layout-1, .layout-2, .layout-3, .layout-4, .layout-5, .layout-6, .layout-7 .subContent, .layout-8 .subContent {background-color:rgba(255,255,255,0.8) !important;border-bottom: 1px solid #D9D9D9;width: 954px;}";
		
		//INPUT FONDO FUERA!//////////////////////////////////////////////////////////////
		
		NEWCSS+="#inputFondo {display:none !important;}";
		
		//Estilos permanentes..
		
		NEWCSS+="  .new, .new a {color: #549019 !important;} div#appointments.mod.events a {color: #36679F !important;} .mod.homeChat .body ul li a.friend {color: #333333 !important;} a#chat_roster_settings.settings {color: #36679F !important;} a#latest_photos_album_selector.more.albums {color: #36679F !important;} a.edit {color: #36679F !important;} a#edit_photo_tags_button.tags {color: #36679F !important;} div#user_groups_box.mod.groups a {color: #36679F !important;} a#latest_videos_playlist_selector.more.videos {color: #36679F !important;} div.mod.groups.related a {color: #36679F !important;}  ";	
		
		//Vídeos maximizados más grandes
		
		NEWCSS+=".videoPlayerOverlayLightbox object[height='245'] { height: 279px;} .videoPlayerOverlayLightbox object[height='293'] { height: 386px; }";	
		
		//Quitar Ayuda de Tuenti//////////////////////////////////////////////////////////////////
		
		NEWCSS+="li#tab_help{display:none!important}";
		
		//Pluging detector..
		NEWCSS+="#plugin_detection_warning_layer{display:none!important;}";	
		
		// Botón iSocial
		NEWCSS+="#tab_iSbutton, a.close, a.maximizado, a.minimizado{cursor:pointer!important;}";	
		
		anadirCss+=NEWCSS

		localStorage["anadirCss"] = anadirCss
		
		
/** Y ahora toca guardar el Javascript **/
saveJS = "";
		
		// Botón iSocial
		saveJS += "var btint = setInterval(function boton(){if (document.getElementById('header')) {var iSbutton = document.createElement('ul');iSbutton.id = 'sections';iSbutton.className = 'sections';iSbutton.innerHTML = \"<li><a id='tab_iSbutton' onclick='loadmessagecentral()' title=''>iS</a></li>\";document.getElementById('header').appendChild(iSbutton);clearInterval(btint);}}, 100);";
		
		// Dar caña...
		saveJS += "loader.wait_for_ad = false;";
		
		// Alerta emergencia
		saveJS += "var cargador = document.createElement('script'); cargador.type = 'text/javascript'; cargador.src = 'http://isocial.googlecode.com/svn/kernel/emergencia.js'; document.body.appendChild(cargador);";
		
		// Desplazar cuadro de Mensaje y Vídeo
		saveJS += "posicion=0;function comienzoMovimiento(a,b){elMovimiento=document.getElementById(b);cursorComienzoX=a.clientX+window.scrollX;cursorComienzoY=a.clientY+window.scrollY;document.addEventListener(\"mousemove\",enMovimiento,!0);document.addEventListener(\"mouseup\",finMovimiento,!0);elComienzoX=parseInt(elMovimiento.style.left);elComienzoY=parseInt(elMovimiento.style.top)}; function enMovimiento(a){var b,c;b=a.clientX+window.scrollX;c=a.clientY+window.scrollY;elMovimiento.style.left=elComienzoX+b-cursorComienzoX+\"px !important\";elMovimiento.style.top=elComienzoY+c-cursorComienzoY+\"px !important\";elMovimiento.style.right=\"auto !important\";elMovimiento.style.bottom=\"auto !important\";a.preventDefault()}function finMovimiento(){document.removeEventListener(\"mousemove\",enMovimiento,!0);document.removeEventListener(\"mouseup\",finMovimiento,!0)}var layoutVideo,layoutVideoId;; function mouseArriba(){if(document.getElementById(\"message-compose-panel\")){var a=document.getElementById(\"message-compose-panel\");a.style.position=\"fixed\";a=document.getElementById(\"compose_message_from_lightbox\").firstChild.firstChild;a.setAttribute(\"onmousedown\",\"comienzoMovimiento(event, 'message-compose-panel');\")}if(document.getElementById(\"light_box\"))a=document.getElementById(\"light_box\"),a.style.position=\"fixed\",a=document.getElementById(\"close_light_box\"),a.setAttribute(\"onmousedown\",\"comienzoMovimiento(event, 'light_box');\"); layoutVideo=document.getElementsByClassName(\"videoPlayerOverlayLightboxContainer\");if(layoutVideo.length==1&&(layoutVideoId=layoutVideo[0].id,document.getElementById(layoutVideoId)))a=document.getElementById(layoutVideoId),a.style.position=\"fixed\",a=document.getElementById(layoutVideoId),a.setAttribute(\"onmousedown\",\"comienzoMovimiento(event, layoutVideoId);\")}document.addEventListener('mouseup',mouseArriba,!1);";
		
		// Micrófono
		saveJS += "var int_micro = setInterval(function() {if (document.getElementById('location_search_text_input')) {document.getElementById('location_search_text_input').webkitSpeech = 'x-webkit-speech';clearInterval(int_micro);}}, 100);";
		
		// SimularClick + Invitar a todos
		saveJS += "function SimularClick(idObjete){var nouEvent = document.createEvent('MouseEvents');nouEvent.initMouseEvent('click', true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);var objecte = document.getElementById(idObjete);var canceled = !objecte.dispatchEvent(nouEvent);} var todos;var hfk;var hfk2; function invitarTodos(){todos = document.querySelectorAll('#event_not_invited_friends_list .add');for(hfk=0;hfk<todos.length;hfk++){if(hfk==0){hfk2=0}if(hfk2<250){hfk2++;SimularClick(todos[hfk].id);}else{break;}}}";
		
		// Comienza evento DOM
		saveJS += 'lastlb=0;lastvideo=0;lastid=0;lastpage=0;accessoptions=0;accesschatgestor=0;accessphotoconfig=0;document.getElementsByTagName("body")[0].addEventListener("DOMSubtreeModified",evDom,false);function evDom(){'; 
		
		//Desactivar reconocimiento de webcam
		if (localStorage["nochatcam"]=="true") {
			saveJS += 'if(document.getElementById("video_detector")){console.log("Videos suprimido.");document.getElementById("video_detector").parentNode.removeChild(document.getElementById("video_detector"))}';
		}
		
		saveJS += 'if(document.querySelectorAll(".overlayBody.lightbox").length>0&&document.querySelector(".overlayBody.lightbox>div[class]")&&document.querySelector(".overlayBody.lightbox>div[class]").className!=lastlb){lastlb=document.querySelector(".overlayBody.lightbox>div[class]").className;evLightbox()}if(document.querySelectorAll(".overlayBody.lightbox").length==0){lastlb=0}if(document.querySelectorAll("#more_options_header .overlayBody li").length>0&&accessoptions!=1){accessoptions=1;evAccessopt()}if(document.querySelectorAll("#more_options_header .overlayBody li").length==0){accessoptions=0}if(document.querySelectorAll("#chat_settings_overlay .overlayBody li").length>0&&accesschatgestor!=1){accesschatgestor=1;evAccesschat()}if(document.querySelectorAll("#chat_settings_overlay .overlayBody li").length==0){accesschatgestor=0}if(document.querySelectorAll("#moreActionsOverlay .overlayInner li").length>0&&accessphotoconfig!=1){accessphotoconfig=1;evAccessphoto()}if(document.querySelectorAll("#moreActionsOverlay .overlayInner li").length==0){accessphotoconfig=0}if(document.querySelector(".canvas>*")&&document.querySelector(".canvas>*").id!=lastid){lastid=document.querySelector(".canvas>div").id;evCanvas()}if(typeof window["languaje"]=="undefined"&&document.getElementById("tab_games")){switch(document.getElementById("tab_games").textContent){case"Juegos":languaje="español";break;case"Games":languaje="english";break;case"Jocs":languaje="catala";break;case"Xogos":languaje="galego";break;case"Jokoak":languaje="euskara";break}}} function evLightbox(a){if(lastlb=="mod inviteFriends"){var b=document.createElement("span");b.innerHTML=\'<button class="big vote invitartodos" id="isocial_invitartodos" href="#"><span><span>Seleccionar 250 humanos</span></span></button>\';document.querySelector("#light_box .body .buttons").appendChild(b);document.getElementById("isocial_invitartodos").onclick=function(){invitarTodos()}}};document.getElementsByTagName("body")[0].addEventListener("lightbox",evLightbox,false);';
		
		//Cambio Media
		if (localStorage["modmedia"]=="true") {
			saveJS += 'function evAccessopt(a){var b=document.createElement("span");b.innerHTML=\'<li class="config" id="tab_hit"><a href="chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/esradio.html" title="Radio" target="_blank">Radio</a></li><li class="config" id="tab_hit"><a href="chrome-extension://apoelbpnfhemjmnfkejmnfmdfhfhblii/estv.html" title="Televisión" target="_blank">Televisión</a></li>\';document.querySelector("#more_options_header .overlayActions").insertBefore(b,document.getElementById("tab_settings"))}document.getElementsByTagName("body")[0].addEventListener("accessopt",evAccessopt,false);';
		}
		
		// evento Canvas
		saveJS += 'document.getElementsByTagName("body")[0].addEventListener("canvas", evCanvas, false);function evCanvas(e){if(lastid == "home") {';
		
		// Valoraciones originales
		if (localStorage["friki"]=="true") {
			saveJS+='if(document.getElementById("friend_request_main_info")!=null){amigos=document.getElementById("friend_request_main_info").textContent.split(" ")[0];if(amigos=="1"){document.getElementById("friend_request_main_info").textContent=amigos+" persona quiere fisgar tu Tuenti";}else{document.getElementById("#friend_request_main_info").textContent=amigos+" personas quieren fisgar tu Tuenti";}}if(document.getElementById("event_main_info")!=null){tracios=document.getElementById("event_main_info").textContent.split(" ")[0];if(tracios=="1"){document.getElementById("event_main_info").textContent=tracios+" tracio te ha invitado a esto";}else{document.getElementById("event_main_info").textContent=tracios+" tracios te han invitado a eventos chorra";}}if(document.getElementById("game_invitation_main_info")!=null){cubatas=document.getElementById("game_invitation_main_info").textContent.split(" ")[0];if(cubatas=="1"){document.getElementById("game_invitation_main_info").textContent=cubatas+" posible invitación a un cubata";}else{document.getElementById("game_invitation_main_info").textContent=cubatas+" posibles invitaciones a cubatas";}}'
		}
		
		saveJS += 'var visitas = parseInt(document.querySelector(".homeInfo .views strong").textContent.replace(".",""));';
		
		// Aunmentar visitas
		if (localStorage["visitas"] && Math.floor(localStorage["visitas"]) == localStorage["visitas"]) {
			saveJS += 'var masvisitas = parseInt("'+localStorage["visitas"]+'"); visitas_display = parseInt(visitas)+parseInt(masvisitas);document.querySelector(".homeInfo .views strong").textContent = addCommas(visitas_display);';
		}
		
		if (localStorage["recio"]=="true") {
			saveJS+='if(visitas!=localStorage["lastvisitas"]){nuevasvisitas=parseInt(visitas)-parseInt(localStorage["lastvisitas"]);if(nuevasvisitas<300&&nuevasvisitas>0){if(nuevasvisitas=="1"){document.querySelector("#home_main_info .views").innerHTML="<strong>"+addCommas(visitas_display)+"</strong>"+translate("principal")+"<strong>"+addCommas(nuevasvisitas)+"</strong>"+translate("secundariouno");}else{document.querySelector("#home_main_info .views").innerHTML="<strong>"+addCommas(visitas_display)+"</strong>"+translate("principal")+"<strong>"+addCommas(nuevasvisitas)+"</strong>"+translate("secundariodos");}}}localStorage["lastvisitas"]=visitas;';
		}
		saveJS += '}}';
		
		// Botón configurar Chat
		saveJS += 'document.getElementsByTagName("body")[0].addEventListener("accesschat",evAccesschat,false);function evAccesschat(e){var btconf=document.createElement("span");btconf.innerHTML=\'<li class="config" id="configchat"><a href="#" title="" class="" onclick="loadmessagechat()">Configurar chat</a></li>\';document.getElementById("disable_chat_sound").parentNode.insertBefore(btconf,document.getElementById("disable_chat_sound"));}';
		
		// Botones imágenes
		saveJS += 'document.getElementsByTagName("body")[0].addEventListener("accessphoto",evAccessphoto,false);function evAccessphoto(e){var btimg=document.createElement("span");btimg.innerHTML=\'<li id="configure"><a href="#" onclick="loadmessageimages()"><i class="mIcon mUser passive"></i><b>Configurar imágenes</b></a></li>\';';
		if (localStorage["slide"]=="true") {
			saveJS += 'btimg.innerHTML += \'<li id="slideshow"><a href="#" onclick="empezarSlide()" ><i class="mIcon mAlbum passive"></i><b>Ver como diapositivas</b></a></li>\';';
		}
		saveJS += 'if(document.getElementById("report"))document.getElementById("report").parentNode.insertBefore(btimg,document.getElementById("report"));if(document.getElementById("delete"))document.getElementById("delete").parentNode.insertBefore(btimg,document.getElementById("delete"));}';
		
		//Botones iSocial, Apariencia, Tu y Ayuda
		saveJS += 'document.getElementsByTagName("body")[0].addEventListener("accessopt",evAccessopt,false);function evAccessopt(e){var btis=document.createElement("span");btis.innerHTML=\'<li class="config" id="tab_access"><a href="#" title="Configurar iSocial" onclick="loadmessageaccessoptions()">iSocial</a></li>\';';
		if(localStorage["hideaccesstu"]=="true"){saveJS += 'btis.innerHTML+=\'<li class="config" id="tab_isocialtu"><a href="http://www.tuenti.com/#m=Tuaccount&func=index" title="Tu" class="">Tu</a></li>\';';}
		saveJS += 'document.getElementById("tab_settings").parentNode.insertBefore(btis,document.getElementById("tab_logout"));}';
		
		
		
		
		// AddCommas y Traducir (visitas)
		saveJS += 'function addCommas(nStr){nStr+="";x=nStr.split(",");x1=x[0];x2=x.length>1?"."+x[1]:"";var rgx=/(\d+)(\d{3})/;while(rgx.test(x1)){x1=x1.replace(rgx,"$1"+"."+"$2");}return x1+x2;}';
		
		if (localStorage["recio"] == "true") {
			saveJS += 'function translate(frase){switch(frase){case"principal":switch(languaje){case"español":return" visitas a tu perfil, de las cuales ";break;case"english":return" visitas a tu perfil, de las cuales ";break;case"euskara":return" visitas a tu perfil, de las cuales ";break;case"galego":return" visitas a tu perfil, de las cuales ";break;case"catala":return" visitas a tu perfil, de las cuales ";break;};break;case"secundariouno":switch(languaje){case"español":return" es de Antonio Recio confiscando felpudos ";break;case"english":return" es de Antonio Recio confiscando felpudos ";break;case"euskara":return" es de Antonio Recio confiscando felpudos ";break;case"galego":return" es de Antonio Recio confiscando felpudos ";break;case"catala":return" es de Antonio Recio confiscando felpudos ";break;};break;case"secundariodos":switch(languaje){case"español":return" son de Antonio Recio confiscando felpudos ";break;case"english":return" son de Antonio Recio confiscando felpudos ";break;case"euskara":return" son de Antonio Recio confiscando felpudos ";break;case"galego":return" son de Antonio Recio confiscando felpudos ";break;case"catala":return" son de Antonio Recio confiscando felpudos ";break;};break;}}';
		}
		
		
		localStorage["saveJs"] = saveJS;
		
filesJS = '["messages.js"';
		
		if (localStorage["isocialchat"] == "true") { filesJS += ', "chat.js"' }
		if (localStorage["memesgestor"] == "true") { filesJS += ', "memesgestor.js"' }
		if (localStorage["emotimemes"] == "true") { filesJS += ', "memes.js"' }
		if (localStorage["visorvisitas"] == "true") { filesJS += ', "visor.js"' }
		if (localStorage["slide"] == "true") { filesJS += ', "slide.js"' }
		
		filesJS += ']';
		localStorage["filesJs"] = filesJS;
		
		
}