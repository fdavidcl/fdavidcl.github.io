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

function Store(key, value) {
	localStorage.removeItem(key);
	localStorage.setItem(key, value);
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
		},
		{
			title: "The Verge",
			href: "http://www.theverge.com",
			content: {
				front: '<img src="chrome://favicon/http://www.theverge.com" width=20 />'
			}
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
		[
			"Social",
			[
				[
					"",
					[
						[
							"Tuenti",
							"http://tuenti.com"
						],
						[
							"Twitter",
							"https://twitter.com"
						]
					]
				],
				[
					"Imágenes + vídeos",
					[
						[
							"Youtube",
							"http://youtube.com"
						],
						[
							"Flickr",
							"http://flickr.com"
						]
					]
				]
			]
		]
	],
	Load: function() {
		if (localStorage.towersData) {
			right_panel.towers = JSON.parse(localStorage.towersData);
		} else {
			right_panel.towers = right_panel.default_towers;
		}
		
		right_panel.Display();
		//window.onresize = function() {right_panel.Display()};
	},
	Display: function() {
		var lim = right_panel.towers.length;
		var height = window.innerHeight;
		var link_height = 46;
		var margin = 60;
		var linkspercol = Math.floor((height - margin) / link_height);
		
		document.querySelector('#right').innerHTML = "";
		
		for (var i = 0; i < lim; i++) {
			var title = 0, name = 0, sections = 1, links = 1, href = 1;
			var tower = right_panel.towers[i];
			var elem_t = document.createElement("div");
			elem_t.className = "tower";
			var inner = "<h1><span>" + tower[title] + "</span></h1>";
			inner += "<div class='col'>";
			
			var link_counter = 0;
			var lim_sec = tower[sections].length;
			for (var j = 0; j < lim_sec; j++) {
				var section = tower[sections][j];
				
				if (link_counter + 1 >= linkspercol) {
					inner += "</div><div class='col'>";
					link_counter = 0;
				}
				
				if (section[name] && section[name] != "") {
					inner += "<h3>" + section[name] + "</h3>";
					link_counter++;
				}
				
				var quantity = section[links].length;
				for (var k = 0; k < quantity; k++) {
					var link = section[links][k];
					
					inner += "<a class='bm' id='l" + i + "_" + j + "_" + k + "' href='" + link[href] + "' style='background-image: url(chrome://favicon/" + link[href] + ");'>" + link[name] + "</a>";
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
