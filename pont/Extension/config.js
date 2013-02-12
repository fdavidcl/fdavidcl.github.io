function AjaxRequest(url, callback) {
	this.url = url;

	this.Send = function() {
		if (window.XMLHttpRequest) {
			var xmlhttp = new XMLHttpRequest();
		}
		else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				callback(xmlhttp.responseText);
			}
		}
		xmlhttp.open("GET", this.url, true);
		xmlhttp.send();
	}
}

right_panel.Display = function() {
	var lim = right_panel.towers.length;
	var height = window.innerHeight;
	var link_height = 46;
	var margin = 60;
	var linkspercol = Math.floor((height - margin) / link_height);
	
	document.querySelector('#right').innerHTML = "";
	
	for (var i = 0; i < lim; i++) {
		var tower = right_panel.towers[i];
		var elem_t = document.createElement("div");
		elem_t.className = "tower";
		var inner = "<h1><span>" + tower.title + "</span><a title='Eliminar torre' class='edit del_tower' href='javascript:right_panel.DeleteTower(" + i + ")'>x</a><a title='Añadir sección' class='edit add_section' href='javascript:right_panel.AddSection(" + i + ")'>+</a></h1>";
		inner += "<div class='col'>";
		
		var link_counter = 0;
		var lim_sec = tower.sections.length;
		for (var j = 0; j < lim_sec; j++) {
			var section = tower.sections[j];
			
			if (link_counter + 1 >= linkspercol) {
				inner += "</div><div class='col'>";
				link_counter = 0;
			}
			
			if (section.name) {
				inner += "<h3>" + section.name + "<a title='Eliminar sección' class='edit del_section' href='javascript:right_panel.DeleteSection(" + i + ", " + j + ")'>x</a><a title='Añadir enlace' class='edit add_link' href='javascript:right_panel.AddLink(" + i + ", " + j + ")'>+</a></h3>";
				link_counter++;
			}
			
			var quantity = section.links.length;
			for (var k = 0; k < quantity; k++) {
				var link = section.links[k];
				inner += "<a class='bm' id='l" + i + "_" + j + "_" + k + "' href='" + link.href + "' style='background-image: url(" + link.favicon + ");'><span title='Eliminar enlace' class='edit del_link' onclick='event.preventDefault(); right_panel.DeleteLink(" + i + ", " + j + ", " + k + ")'>x</span>" + link.name + "</a>";
				link_counter++;
				
				if (link_counter >= linkspercol) {
					inner += "</div><div class='col'>";
					link_counter = 0;
				}
			}
		}
			
		inner += "</div>";
		
		elem_t.innerHTML = inner;
		
		document.querySelector('#right').appendChild(elem_t);
	}
	document.querySelector('#right').innerHTML += '<div class="tower"><a title="Añadir torre" class="edit add_tower" href="javascript:right_panel.AddTower()">+</a></div>';
};

right_panel.AddTower = function() {
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
	
	right_panel.towers.push(new_tower);
	right_panel.Save();
};

right_panel.AddSection = function(tower) {
	var new_section = {
		name: "",
		links: [
			
		]
	};
	
	new_section.name = io.Ask("Nombre", "Nueva sección");
	
	right_panel.towers[tower].sections.push(new_section);
	right_panel.Save();
};
right_panel.AddLink = function(tower, section) {
	var new_link = {
		name: "Nombre",
		href: "http://www.example.com",
		favicon: "http://www.example.com/favicon.ico"
	};
	
	new_link.name = io.Ask('Nombre', new_link.name);
	new_link.href = io.Ask('Dirección', "http://" + new_link.name + ".com");
	var guess = new_link.href.split('://')[0] + "://" + new_link.href.split('://')[1].split('/')[0] + "/favicon.ico";
	new_link.favicon = io.Ask('Icono (favicon)', guess);
	
	right_panel.towers[tower].sections[section].links.push(new_link);
	right_panel.Save();
};
right_panel.DeleteTower = function(tower) {
	if (io.Confirm("¿Seguro que deseas borrar esta torre? Todos los enlaces que contiene se perderán")) {
		right_panel.towers.splice(tower, 1);
	}
	right_panel.Save();
};
right_panel.DeleteSection = function(tower, section) {
	if (io.Confirm("¿Seguro que deseas borrar esta sección? Todos los enlaces que contiene se perderán")) {
		right_panel.towers[tower].sections.splice(section, 1);
	}
	right_panel.Save();
};
right_panel.DeleteLink = function(tower, section, link) {
	right_panel.towers[tower].sections[section].links.splice(link, 1);
	right_panel.Save();
};
right_panel.Save = function() {
	localStorage.towersData = JSON.stringify(right_panel.towers);
	right_panel.Display();
};

var io = {
	windows: {
		themes: {
			id: "window_theme",
			width: 400,
			height: 300,
			title: "Temas",
			content: 'Elige uno de los temas disponibles.<p><span id="choose_theme"><input type="radio" name="theme" value="theme/metro_dark.css" id="metro_dark" /><label for="metro_dark">Metro Dark</label><br /><input type="radio" name="theme" value="theme/metro_light.css" id="metro_light" /><label for="metro_light">Metro Light</label><br /></span><p>',
			buttons: [
				["Listo", "config.SetTheme(); io.CloseWindow('#window_theme')"],
				["Cancelar", "io.CloseWindow('#window_theme')"]
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
		elem.className = "window visible";
		
		var innh = "<div style='width: " + win.width + "px; height: " + win.height + "px;'><header>" + win.title + "</header>";
		innh += win.content;
		innh += "<div class='buttons'><a href=\"javascript:" + win.buttons[0][1] + "\" class='accept'>" + win.buttons[0][0];
		if (win.buttons[1]) {
			innh += "</a><a href=\"javascript:" + win.buttons[1][1] + "\" class='cancel'>" + win.buttons[1][0];
		}
		innh += "</a></div></div>";
		elem.innerHTML = innh;
		
		if (document.querySelector(".window.visible")) {
			document.querySelector(".window.visible").className = "window";
		}
		
		document.querySelector("#window_space").appendChild(elem);
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
	ToggleEditMode: function() {
		var current = document.querySelector("body").className;
		if (current == config.modes.user) {
			config.ChangeMode(config.modes.edit);
		} else {
			config.ChangeMode(config.modes.user);
		}
	},
	LoadTheme: function() {
		document.querySelector("#theme").href = localStorage.usertheme ?
			localStorage.usertheme : "theme/metro_dark.css";
	},
	SetTheme: function() {
		var new_theme = document.querySelector('#choose_theme input:checked').value;
		localStorage.usertheme = new_theme;
		document.querySelector("#theme").href = new_theme;
	},
	Load: function() {
		config.LoadTheme();
		config.ChangeMode(config.modes.user);
	}
};

window.onload = function() {
	search.Load();
	widgets.Display();
	right_panel.Load();
	config.Load();
};