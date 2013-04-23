
/*
 * Estructura de una torre: [ "<Título>", [<Secciones>] ]
 * Estructura de una sección: [ "<Nombre>", [<Enlaces>] ]
 * Estructura de un enlace: [ "<Nombre>", "<URL>" ]
 */
 
/*
 * BUGS
 * TODO
	Ordenar este archivo y main.js
 */
 
/*
icons.AddTower = function() {
	var new_tower = {
		title: "",
		sections: [
			{
				links: [
					
				]
			}
		]
	}
	
	new_tower.title = io.Ask("Título", "Nueva torre");
	
	icons.towers.push(new_tower);
	icons.Save();
};

icons.AddSection = function(tower) {
	var new_section = {
		name: "",
		links: [
			
		]
	};
	
	new_section.name = io.Ask("Nombre", "Nueva sección");
	
	icons.towers[tower].sections.push(new_section);
	icons.Save();
};
icons.AddLink = function(tower, section) {
	var new_link = {};
	
	new_link.name = io.Ask('Nombre', new_link.name);
	new_link.href = io.Ask('Dirección', "http://" + new_link.name.toLowerCase() + ".com");
	
	icons.towers[tower].sections[section].links.push(new_link);
	icons.Save();
};
icons.DeleteTower = function(tower) {
	if (io.Confirm("¿Seguro que deseas borrar esta torre? Todos los enlaces que contiene se perderán")) {
		icons.towers.splice(tower, 1);
	}
	icons.Save();
};
icons.DeleteSection = function(tower, section) {
	if (io.Confirm("¿Seguro que deseas borrar esta sección? Todos los enlaces que contiene se perderán")) {
		icons.towers[tower].sections.splice(section, 1);
	}
	icons.Save();
};
icons.DeleteLink = function(tower, section, link) {
	icons.towers[tower].sections[section].links.splice(link, 1);
	icons.Save();
};
icons.Save = function() {
	localStorage.towersData = JSON.stringify(icons.towers);
	icons.Display();
};
*/

var io = {
	windows: {
		general_conf: {
			id: "window_config",
			width: 400,
			height: 400,
			title: "Configuración",
			content: '<span class="options"><!--a href="#config/edit">Editar enlaces</a--><a href="#config/themes">Apariencia</a><a href="#config/export">Exportar configuración</a><a href="#config/import">Importar configuración</a><a href="#config/bookmarks">Importar marcadores</a></span>',
			buttons: [
				["Cerrar", function() {
					io.CloseWindow('#window_config');
					document.querySelector('#search_input').focus();
					location.hash = "";
				}]
			]
		},
		themes: {
			id: "window_theme",
			width: 400,
			height: 300,
			title: "Temas",
			content: 'Elige uno de los temas disponibles.<p><span id="choose_theme"><input type="radio" name="theme" value="theme/metro_dark.css" id="metro_dark" /><label for="metro_dark">Metro Dark</label><br /><input type="radio" name="theme" value="theme/metro_light.css" id="metro_light" /><label for="metro_light">Metro Light</label><br /><input type="radio" name="theme" value="theme/neon_dark.css" id="neon_dark" /><label for="neon_dark">Neon Dark</label><br /><input type="radio" name="theme" value="theme/gnome.css" id="gnome" /><label for="gnome">GNOME</label><br /><input type="radio" name="theme" value="theme/minimal.css" id="minimal" /><label for="minimal">minimal</label><br /></span><p>',
			buttons: [
				["Listo", function() { config.SetTheme(); io.CloseWindow('#window_theme')}],
				["Cancelar", function() { location.hash = "#config"; }]
			]
		},
		export_conf: {
			id: "window_export",
			width: 500,
			height: 500,
			title: "Exportar configuración",
			content: 'Exportando tu configuración podrás transferir los enlaces y los ajustes de tu página a otros dispositivos. Pulsa <b>Exportar</b> para comenzar.<p></p>',
			buttons: [
				["Exportar", function() {
					var ex = document.createElement('textarea');
					ex.value = JSON.stringify(localStorage);
					ex.style.width = "500px";
					ex.style.height = "180px";
					ex.style.marginTop = "20px";
					document.querySelector('#window_export > div').appendChild(ex);
					document.querySelector('#window_export > div > textarea').select();
				}],
				["Cerrar", function() { location.hash = "#config"; }]
			]
		},
		import_conf: {
			id: "window_import",
			width: 500,
			height: 500,
			title: "Importar configuración",
			content: 'Copia aquí el código que obtuviste al exportar tu configuración. Pulsa <b>Importar</b> para sustituir tu configuración actual por la importada.<p></p><textarea id="import_code" style="width: 500px; height: 180px;"></textarea>',
			buttons: [
				["Importar", function() {
					try {
						var nc = JSON.parse(document.querySelector('#import_code').value);
						
						localStorage.clear();
						for (key in nc) {
							localStorage[key] = nc[key];
						}
						
						io.CloseWindow('#window_import');
						io.Inform("Importación completada", "Tu configuración ha sido importada con éxito.");
						location.reload(true);
					} catch(err) {
						io.Alert("Error", "No se ha podido llevar a cabo la importación. Mensaje de error:\n" + err.message);
					}
				}],
				["Cancelar", function() { location.hash = "#config"; }]
			]
		},
		import_bookmarks: {
			id: "window_bookmarks",
			width: 400,
			height: 300,
			title: "Importar marcadores",
			content: 'Al importar tus marcadores se crearán nuevas torres de enlaces que sustituirán a las actuales. Si deseas continuar, pulsa <strong>Comenzar</strong>.',
			buttons: [
				["Comenzar", function() {
					try {
						bookmarks.LoadImport();
						
						io.Inform("Importación completada", "Tus marcadores han sido importados con éxito.");
						location.hash = "";
						//location.reload(true);
					} catch(err) {
						io.Alert("Error", "No se ha podido llevar a cabo la importación. Mensaje de error:\n" + err.message);
					}
				}],
				["Cancelar", function() { location.hash = "#config"; }]
			]
		}
	},
	Alert: function(title, message) {
		alert(title + "\n" + message);
	},
	Inform: function(title, message) {
		alert(title + "\n" + message);
	},
	Ask: function(message, default_val) {
		return prompt(message, default_val);
	},
	Confirm: function (message) {
		return confirm(message);
	},
	ShowWindow: function(win) {
		var elem = document.createElement('div');
		elem.id = win.id;
		elem.className = "window";
		
		var innh = "<div style='width: " + win.width + "px; height: " + win.height + "px;'><header>" + win.title + "</header>";
		innh += win.content;
		innh += "<div class='buttons'><a id=\"" + win.id + "_but0\" class='accept'>" + win.buttons[0][0];
		
		for (var i = 1; i < win.buttons.length; i++) {
			innh += "</a><a id=\"" + win.id + "_but" + i +"\">" + win.buttons[i][0];
		}
		
		innh += "</a></div></div>";
		elem.innerHTML = innh;
		
		if (document.querySelector(".window")) {
			document.querySelector(".window").parentNode.removeChild(document.querySelector(".window"));
		}
		
		document.querySelector("#window_space").appendChild(elem);
		
		for (var i = 0; i < win.buttons.length; i++) {
			document.querySelector('#' + win.id + '_but' + i).onclick = win.buttons[i][1];
		}
	},
	CloseWindow: function(winsel) {
		document.querySelector("#window_space").removeChild(document.querySelector(winsel));
	}
};



var config = {
	modes: {
		user: "user_mode",
		edit: "edit_mode",
		search: "search_mode"
	},
	ChangeMode: function(mode) {
		document.querySelector("body").className = mode;
	},
	LoadTheme: function() {
		document.querySelector("#theme").href = localStorage.usertheme ?
			localStorage.usertheme+"?_="+new Date().getTime() : "theme/metro_dark.css";
	},
	Load: function() {
		config.LoadTheme();
		config.GetMode();
	},
	GetMode: function() {
		switch (location.hash) {
			case "":
				if (document.querySelector('.window'))
					io.CloseWindow('.window');
			break;
			case "#config":
				io.ShowWindow(io.windows.general_conf);
			break;
			case "#config/edit":
				config.ChangeMode(config.modes.edit);
			break;
			case "#config/themes":
				io.ShowWindow(io.windows.themes);
			break;
			case "#config/export":
				io.ShowWindow(io.windows.export_conf);
			break;
			case "#config/import":
				io.ShowWindow(io.windows.import_conf);
			break;
			case "#config/bookmarks":
				io.ShowWindow(io.windows.import_bookmarks);
			break;
		}
	},
	/*ToggleEditMode: function() {
		var current = document.querySelector("body").className;
		if (current == config.modes.user) {
			config.ChangeMode(config.modes.edit);
		} else {
			config.ChangeMode(config.modes.user);
		}
	},*/
	SetTheme: function() {
		var new_theme = document.querySelector('#choose_theme input:checked').value;
		localStorage.usertheme = new_theme;
		location.hash = "#config";
		location.reload(true);
	}
};
