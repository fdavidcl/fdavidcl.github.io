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
				if (xmlhttp.responseXML) {
					callback(xmlhttp.responseXML);
				} else {
					callback(xmlhttp.responseText);
				}
			}
		}
		xmlhttp.open("GET", this.url, true);
		xmlhttp.send();
	}
}

var traduccion_weather = [
	"tornado",
	"tormenta tropical",
	"huracán",
	"tormentas fuertes",
	"tormenta",
	"lluvia y nieve",
	"aguanieve",
	"nieve y aguanieve",
	"llovizna helada",
	"llovizna",
	"lluvia helada",
	"chubascos",
	"chubascos",
	"rachas de nieve",
	"chubascos de nieve",
	"nieve y viento",
	"nieve",
	"granizo",
	"aguanieve",
	"polvo en suspensión",
	"niebla",
	"bruma",
	"humo",
	"viento fuerte",
	"viento",
	"frío",
	"nublado",
	"bastante nublado",
	"bastante nublado",
	"parcialmente nublado",
	"parcialmente nublado",
	"despejado",
	"soleado",
	"bueno",
	"bueno",
	"lluvia y granizo",
	"calor",
	"tormentas aisladas",
	"tormentas aisladas",
	"tormentas aisladas",
	"chubascos aislados",
	"mucha nieve",
	"chubascos de nieve aislados",
	"mucha nieve",
	"pacialmente nublado",
	"chubascos tormentosos",
	"chubascos de nieve",
	"chubascos tormentosos aislados"
];
traduccion_weather[3200] = "no disponible";

var search = {
	engines: [
		{
			name: "Google",
			favicon: "http://www.google.es/favicon.ico",
			url: {
				left: "http://www.google.es/search?q=",
				right: ""
			}
		},
		{
			name: "DuckDuckGo",
			favicon: "http://www.duckduckgo.com/favicon.ico",
			url: {
				left: "http://www.duckduckgo.com/",
				right: ""
			}
		},
		{
			name: "Bing",
			favicon: "http://www.bing.com/favicon.ico",
			url: {
				left: "http://www.bing.com/search?q=",
				right: ""
			}
		},
		{
			name: "WolframAlpha",
			favicon: "http://www.wolframalpha.com/favicon.ico",
			url: {
				left: "http://www.wolframalpha.com/input/?i=",
				right: ""
			}
		}
	],
	highlighted: -1,
	last_query: "",
	Display: function() {
		
	},
	Instant: function() {
		var orig_query = document.querySelector('#search_form > input').value;
		
		if (orig_query != search.last_query) {
			//var regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((‌​\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
			var regex = /^(http[s]?:\/\/|ftp:\/\/)?(localhost|([0-9A-Za-z-\.@:%_\+~#=])+((\.[A-Za-z][A-Za-z]+))+)([0-9A-Za-z-\.@:%_\+~#=\/])*$/;
			var re = new RegExp(regex);
			if (orig_query.match(re)) {
				var link = orig_query;
				
				if (orig_query.indexOf('http://') != 0 && orig_query.indexOf('https://') != 0 && orig_query.indexOf('ftp://') != 0) {
					link = "http://" + orig_query;
				}
				
				document.querySelector('#go_o').innerHTML = "<a href=\"" + link + "\" style=\"background-image: url(chrome://favicon/" + link + ");\">Ir<span class=\"url\">" + link + "</span></a>";
			} else {
				document.querySelector('#go_o').innerHTML = "";
			}

			search.last_query = orig_query;
			var query = document.querySelector('#search_form > input').value.toLowerCase().replace(/\)/g, '\\)').replace(/\(/g, '\\(');
			search.best = [];
			var min_relev = -1;
			
			for (var i = 0; i < right_panel.towers.length; i++) {
				for (var j = 0; j < right_panel.towers[i].sections.length; j++) {
					for (var k = 0; k < right_panel.towers[i].sections[j].links.length; k++) {
						var name = right_panel.towers[i].sections[j].links[k].name;
						var url = right_panel.towers[i].sections[j].links[k].href.replace('http','').replace('s://','').replace('://','');
						
						if (document.querySelector('#l'+i+'_'+j+'_'+k)) {
							var relevancia = -1;
							var words = query.split(' ');
							
							/* Buscamos cada palabra de búsqueda en los nombres y enlaces,
							   confeccionando una medida de la relevancia de cada uno a
							   partir del lugar de aparición de lo buscado                 */
							
							var rel_name = -1;
							var rel_url = -1;
							var cuantas_coinciden = 0;
							
							for (var l = 0; l < words.length; l++) {
								var this_word = words[l];
								
								if (this_word != "") {
									var n_r = name.toLowerCase().search(this_word);
									var l_r = url.search(this_word);
									
									if (n_r > -1) {
										if (rel_name == -1)
											rel_name = 0;
										
										rel_name = rel_name + n_r;
										cuantas_coinciden++;
									}
									if (l_r > -1) {
										if (rel_url == -1)
											rel_url = 0;
										
										rel_url = rel_url + l_r;
										cuantas_coinciden++;
									}
								}
							}
							
							var coincide = cuantas_coinciden > 0;
							
							if (coincide) {
								var relevancia = 0;
								var penalizacion = 5;
								var importancia = 7;
								
								if (rel_url == -1) {
									relevancia += penalizacion;
								} else {
									relevancia += rel_url;
								}
								
								if (rel_name == -1) {
									relevancia += penalizacion;
								} else {
									relevancia += rel_name;
								}
								
								relevancia += cuantas_coinciden * importancia;
							
								document.querySelector('#l'+i+'_'+j+'_'+k).style.display = 'block';
								
								var obj_encontrado = {
									name: right_panel.towers[i].sections[j].links[k].name,
									href: right_panel.towers[i].sections[j].links[k].href,
									in_section: right_panel.towers[i].sections[j].name,
									from: right_panel.towers[i].title
								};
								
								// Por terminar aún...
								if (relevancia < min_relev) {
									search.best.unshift(obj_encontrado);
									
									if (search.best.length > 3) {
										search.best.pop();
									}
								} else if (search.best.length < 3) {
									search.best.push(obj_encontrado);
									
									min_relev = relevancia < min_relev || min_relev == -1 ? relevancia : min_relev;
								}
								
								// Ordenar los resultados más relevantes, eliminar
								// los menos relevantes, dejando solo 3.
							} else {
								document.querySelector('#l'+i+'_'+j+'_'+k).style.display = 'none';
							}
						}
					}
				}
			}
			
			var html_out = "";
			
			if (query == "") {
				config.ChangeMode(config.modes.user);
			} else {
				config.ChangeMode(config.modes.search);
				
				// Query a DuckduckGo
				var ddg_rq = new AjaxRequest("http://api.duckduckgo.com/?q=" + encodeURIComponent(orig_query) + "&format=json", search.InsertDDG);
				ddg_rq.Send();
			
				// Mejores resultados de marcadores
				var mejores = "";
				if (search.best.length > 0) {
					var tope = search.best.length;
					for (var m = 0; m < tope; m++) {
						var enl = search.best[m];
						mejores += '<a href="' + enl.href + '" style="background-image: url(chrome://favicon/' + enl.href + ')">' + enl.name + '<span class="from"> en ' + enl.from + '</span><span class="url">' + enl.href + '</span></a>';
					}
				}
				
				html_out += mejores;
			}
			
			// Buscadores
			var search_html = "";
			
			for (i in search.engines) {
				engine = search.engines[i];
				
				search_html += '<a href="' + engine.url.left + encodeURIComponent(orig_query) + engine.url.right + '" style="background-image: url(' + engine.favicon + ')">Buscar en ' + engine.name + '</a>';
			}
			
			document.querySelector('#bookmarks_o').innerHTML = html_out;
			document.querySelector('#engines_o').innerHTML = search_html;
			search.HighlightItem(0);
		}
	},
	InsertDDG: function(content) {
		content = JSON.parse(content);
		document.querySelector('#instant_o').innerHTML = "";
		var resultado = false;
		var def_link = false;
		var ddgl = document.createElement('span');
		
		if (content.Results[0]) {
			var lin = content.Results[0];
			var res = document.createElement('a');
			res.innerHTML = lin.Text + "<span class='url'>" + lin.FirstURL + "</span>";
			res.href = lin.FirstURL;
			if (lin.Icon) {
				res.style.backgroundImage = "url(" + lin.Icon.URL + ")";
			}
			
			ddgl.appendChild(res);
			resultado = true;
		}
		if (content.Abstract != "") {
			var abs = document.createElement('a');
			abs.innerHTML = content.Abstract + '<span class="inlink_banner">' + content.AbstractSource + '</span>';
			abs.href = content.AbstractURL;
			ddgl.appendChild(abs);
			
			resultado = true;
			def_link = true;
		}
		if (content.Answer != "") {
			var ans = document.createElement('a');
			//ans.innerHTML = content.Answer.split('">')[1].split('</a>')[0].replace(/,/g, "");
			ans.innerHTML = content.Answer;
			ddgl.appendChild(ans);
			
			resultado = true;
		}
		if (content.Definition != "") {
			var def = document.createElement('a');
			def.innerHTML = content.Definition + '<span class="inlink_banner">' + content.DefinitionSource + '</span>';
			if (content.DefinitionURL)
				def.href = content.DefinitionURL;
			ddgl.appendChild(def);
			
			resultado = true;
			def_link = true;
		}
		
		ddgl.innerHTML += '';
		
		if (resultado) {
			document.querySelector('#instant_o').innerHTML = ddgl.innerHTML;
		}
		search.HighlightItem(0);
	},
	HighlightItem: function(ind) {
		var all_links = document.querySelectorAll("#search_output .results a[href]");
		if (all_links[ind]) {
			if (document.querySelector("#search_output a.highlight")) {
				document.querySelector("#search_output a.highlight").classList.remove("highlight");
			}
			all_links[ind].classList.add("highlight");
		
			search.highlighted = ind;
		}
	},
	HighlightByKey: function(ev) {
		ev = ev || window.event;
		
		if (ev.keyCode == 38) {
			ev.preventDefault();
			search.HighlightItem(search.highlighted - 1);
		} else if (ev.keyCode == 40) {
			ev.preventDefault();
			search.HighlightItem(search.highlighted + 1);
		}
	},
	FormSubmit: function() {
		if (document.querySelector("#search_output .results a.highlight")) {
			event.preventDefault();
			document.location.href = document.querySelector("#search_output .results a.highlight").href;
		} else {
			return false;
		}
	},
	Load: function() {
		search.Display();
		document.querySelector('#search_form > input').focus();
		document.querySelector('#search_form > input').oninput = function() { search.Instant(); };
		document.querySelector('#search_form > input').onpaste = function() { search.Instant(); };
		document.querySelector('#search_form > input').onkeyup = function() { search.Instant(); };
		document.querySelector('#search_form > input').onkeydown = function() { search.HighlightByKey(); };
		document.querySelector('#search_form').onsubmit = function() { search.FormSubmit(); };
	}
};

var widgets = {
	icons: [
		{
			title: "",
			content: {
				front: ""
			},
			Update: function() {
				var date = new Date();
				var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
				var meses = ["enero", "febrero", "marzo", 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
				var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				var mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				
				this.title = dias[date.getDay()] + " " + date.getDate() + " " + meses[date.getMonth()];
				this.content.front = hour + ":" + mins;
				widgets.UpdateWidget(0);
			},
			update_freq: 4
		},
		{
			title: "Outlook",
			href: "http://outlook.com",
			content: {
				front: "0 mensajes"
			}
		},
		{
			title: "Tuenti",
			href: "http://tuenti.com",
			content: {
				front: "0 privados",
				back: "1 evento"
			}
		},
		{
			title: "Feedly",
			href: "http://www.feedly.com/home",
			content: {
				front: "1000+"
			}
		},
		{
			title: "Jaén",
			href: "",
			content: {
				front: "0º",
				back: "despejado"
			},
			GetInfo: function(response) {
				var temp = response.documentElement.querySelector("[temp]").getAttribute("temp");
				var cond = traduccion_weather[response.documentElement.querySelector("[temp]").getAttribute("code")];
				var link = response.documentElement.querySelector("link").textContent;
				widgets.icons[4].content.front = temp + "º";
				widgets.icons[4].content.back = "<span class=\"small\">" + cond + "</span>";
				widgets.icons[4].href = link;
				widgets.UpdateWidget(4);
			},
			Update: function() {
				var wreq = new AjaxRequest("http://weather.yahooapis.com/forecastrss?p=SPXX0045&u=c", widgets.icons[4].GetInfo);
				wreq.Send();
			},
			update_freq: 60
		},
		{
			title: "Granada",
			href: "",
			content: {
				front: "0º",
				back: "despejado"
			},
			GetInfo: function(response) {
				var temp = response.documentElement.querySelector("[temp]").getAttribute("temp");
				var cond = traduccion_weather[response.documentElement.querySelector("[temp]").getAttribute("code")];
				var link = response.documentElement.querySelector("link").textContent;
				widgets.icons[5].content.front = temp + "º";
				widgets.icons[5].content.back = "<span class=\"small\">" + cond + "</span>";
				widgets.icons[5].href = link;
				widgets.UpdateWidget(5);
			},
			Update: function() {
				var wreq = new AjaxRequest("http://weather.yahooapis.com/forecastrss?p=SPXX0040&u=c", widgets.icons[5].GetInfo);
				wreq.Send();
			},
			update_freq: 60
		}
	],
	Display: function() {
		var a_randomizar = [];
		
		for (var i = 0; i < widgets.icons.length; i++) {
			var icon = widgets.icons[i];
			icon.widget = document.createElement('a');
			icon.widget.id = "widget_" + i;
			
			if (icon.href) {
				icon.widget.href = icon.href;
			}
			if (i % 2 != 0) {
				icon.widget.classList.add("r");
			}
			if (icon.content.back) {
				a_randomizar.push(i);
				icon.widget.classList.add("prelive");
				icon.widget.innerHTML += '<div class="content">.</div>';
			}
			
			icon.widget.innerHTML += '<div class="content">.</div><div class="title">Cargando información</div>';
			
			document.querySelector('#widgets').appendChild(icon.widget);
			
			if (widgets.icons[i].Update) {
				widgets.icons[i].Update();
				if (icon.update_freq) {
					icon.update_interval = setInterval("widgets.icons["+i+"].Update();", icon.update_freq * 1000);
				}
			} else {
				widgets.UpdateWidget(i);
			}
		}
		
		widgets.ActivaLiveTiles(a_randomizar);
	},
	UpdateWidget: function(indice) {
		var icon = widgets.icons[indice];
		var my_widget = icon.widget;
		
		var inner = '<div class="content">' + icon.content.front + '</div>';
		
		if (icon.content.back) {
			inner += '<div class="content">' + icon.content.back + '</div>';
		}
		if (icon.href) {
			my_widget.href = icon.href;
		}
		
		inner += '<div class="title">' + icon.title + '</div>';	
		my_widget.innerHTML = inner;
	},
	ActivaLiveTiles: function(tiles) {
		var t;
		
		for (indice in tiles) {
			t = Math.floor(Math.random() * 4000);
			
			setTimeout("document.querySelector('#widget_" + tiles[indice] + "').classList.remove(\"prelive\");document.querySelector('#widget_" + tiles[indice] + "').classList.add(\"live\");", t);
		}
	}
};

var right_panel = {
	default_towers: [
		{
			title: "Social",
			sections: [
				{
					name: "General",
					links: [
						{
							name: "Tuenti",
							href: "http://tuenti.com"
						},
						{
							name: "Twitter",
							href: "http://twitter.com"
						}
					]
				},
				{
					name: "Imágenes + vídeos",
					links: [
						{
							name: "Youtube",
							href: "http://youtube.com"
						},
						{
							name: "Flickr",
							href: "http://flickr.com"
						}
					]
				}
			]
		}
	],
	Load: function() {
		if (localStorage.towersData) {
			right_panel.towers = JSON.parse(localStorage.towersData);
		} else {
			right_panel.towers = right_panel.default_towers;
		}
		
		right_panel.Display();
		window.onresize = function() {right_panel.Display()};
	},
	Display: function() {
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
			var inner = "<h1><span>" + tower.title + "</span></h1>";
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
					inner += "<h3>" + section.name + "</h3>";
					link_counter++;
				}
				
				var quantity = section.links.length;
				for (var k = 0; k < quantity; k++) {
					var link = section.links[k];
					
					inner += "<a class='bm' id='l" + i + "_" + j + "_" + k + "' href='" + link.href + "' style='background-image: url(chrome://favicon/" + link.href + ");'>" + link.name + "</a>";
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
	}
};

window.onload = function() {
	search.Load();
	widgets.Display();
	right_panel.Load();
	config.Load();
};

window.onhashchange = function() {
	config.GetMode();
};
