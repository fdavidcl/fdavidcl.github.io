/*
 * liveinfo.js se encarga de mostrar información actualizada
 * sobre el tiempo, las redes sociales, etc.
 */

/*
 * BUGS
	
 * TODO
	Interfaz para añadir y modificar liveinfo personalizados
	Modificar widget del tiempo más fácilmente
	Integración de notificaciones sociales con iSocial
 */


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

var liveinfo = {
	store: {
		clock: {
			name: "Reloj",
			id: 0,
			variables: {
				ampm: {description: "¿Utilizar el formato 12 horas?", value: false}
			},
			
			title: "Reloj",
			content: {
				front: "..."
			},
			Update: function UpdateClock() {
				var ampm = "";
				var date = new Date();
				var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
				var meses = ["enero", "febrero", "marzo", 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
				
				var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				if (this.variables.ampm.value) {
					ampm = "AM";
					
					if (hour > 12) {
						hour = hour - 12;
						ampm = "PM";
					} else if (hour == 0) {
						hour = 12;
					}
				}
				var mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				
				this.node.querySelector('.title').textContent = dias[date.getDay()] + " " + date.getDate() + " " + meses[date.getMonth()];
				this.node.querySelector('.content').textContent = hour + ":" + mins + ampm;
			},
			update_freq: 4,
			
			toJSON: function() {
				return {
					type: "clock",
					variables: this.variables
				};
			},
			create: function(variables) {
				var el = Object.create(liveinfo.store.clock);
				el.variables = variables;
				
				return el;
			}
		},
		weather: {
			name: "El tiempo",
			id: 0,
			variables: {
				citycode: {description: "Código de la localidad", value: "SPXX0045"}
			},
			
			title: "Cargando",
			href: "",
			content: {
				front: "...",
				back: "..."
			},
			Update: function() {
				var el = this.node;
				var cit = this.variables.citycode.value;
				var wreq = new AjaxRequest("http://weather.yahooapis.com/forecastrss?p=" + cit + "&u=c", function(response) {
					var city = response.documentElement.querySelector("title").textContent.replace('Yahoo! Weather - ', '');
					var temp = response.documentElement.querySelector("[temp]").getAttribute("temp");
					var cond = traduccion_weather[response.documentElement.querySelector("[temp]").getAttribute("code")];
					var link = response.documentElement.querySelector("link").textContent;
					el.querySelector('.title').textContent = city;
					el.querySelector('.content').textContent = temp + "º";
					el.querySelector('.content+.content').innerHTML = "<span class=\"small\">" + cond + "</span>";
					el.href = link;
				});
				wreq.Send();
			},
			update_freq: 6000,
			
			toJSON: function() {
				return {
					type: "weather",
					variables: this.variables
				};
			},
			create: function(variables) {
				var el = Object.create(liveinfo.store.weather);
				el.variables = variables;
				
				return el;
			}
		},
		link: {
			name: "Enlace",
			id: 0,
			variables: {
				title: {description: "Título del enlace", value: ""},
				url: {description: "Dirección web", value: ""}
			},
			
			title: "Enlace",
			href: "",
			content: {
				front: "...",
				back: "..."
			},
			
			Update: function() {
				this.node.href = this.variables.url.value;
				this.node.querySelector('.title').textContent = this.variables.title.value;
				this.node.querySelector('.content').innerHTML = '<img src="chrome://favicon/' + this.variables.url.value + '" />';
				this.node.querySelector('.content+.content').innerHTML = '<span style="font-size: 14px">' + this.variables.url.value.split('://')[1] + '</span>';
			},
			
			toJSON: function() {
				return {
					type: "link",
					variables: this.variables
				};
			},
			create: function(variables) {
				var el = Object.create(liveinfo.store.link);
				el.variables = variables;
				
				return el;
			}
		}
		/***************************
		mail: {
			name: "Outlook",
			id: 0,
			variables: {
				// ???
			}
		},
		tuenti: {
			name: "Tuenti",
			id: 0,
			variables: {
				// Integración con iSocial aquí
			}
		},
		twitter: {
			name: "Twitter",
			id: 0,
			variables: {
				// Integración con iSocial aquí
			}
		}
		***************************/
	},
	widgets: [],
	Display: function() {
		document.querySelector("#liveinfo").innerHTML = "";
		
		for (var i = 0; i < this.widgets.length; i++) {
			var dget = this.widgets[i];
			dget.node = document.createElement('a');
			var node = dget.node;
			
			// Identificación del widget
			node.id = "widget_" + i;
			node.classList.add(dget.content.back ? "prelive" : "nolive", i%2>0 ? "r" : "l");
			
			// Contenido del widget
			node.href = dget.href ? dget.href : null;
			node.innerHTML = dget.content.back ? "<div class=\"content\"></div>" : "";
			node.innerHTML += "<div class=\"content\"></div><div class=\"title\"></div>";
			node.querySelector('.title').textContent = dget.title;
			node.querySelector('.content').innerHTML = dget.content.front;
			dget.content.back ? node.querySelector('.content+.content').innerHTML = dget.content.back : 0;
			
			document.querySelector("#liveinfo").appendChild(node);
			
			// Actualizamos contenido
			if (dget.Update) {
				dget.Update();
				if (dget.update_freq) {
					dget.update_interval = setInterval("liveinfo.widgets["+i+"].Update();", dget.update_freq * 1000);
				}
			} else {
				this.UpdateWidget(i);
			}
		}
		
		this.ActivaLiveTiles();
	},
	Load: function() {
		try {
			var list = JSON.parse(Store("user_widgets"));
			
			for (widget in list) {
				this.AddWidget(list[widget].type, list[widget].variables);
			}
		} catch(err) {
			console.log("Error al cargar widgets: " + err.message);
		}
		
		this.Display();
	},
	UpdateWidget: function(indice) {
		var icon = this.widgets[indice];
		var my_widget = icon.node;
		
		// Actualizamos título y enlace (si está disponible)
		my_widget.querySelector(".title").textContent = icon.title;
		my_widget.href = icon.href? icon.href: null;
		
		// Actualizamos contenido principal y secundario (si disponible)
		my_widget.querySelector('.content').innerHTML = icon.content.front;
		if (icon.content.back && my_widget.querySelectorAll('.content')[1]) {
			my_widget.querySelectorAll('.content')[1].innerHTML = icon.content.back;
		}
	},
	ActivaLiveTiles: function() {
		var a_activar = document.querySelectorAll('#liveinfo .prelive');
		
		for (elem in a_activar) {
			var t = Math.floor(Math.random() * 6000);
			
			setTimeout("var el = document.querySelector(\"#" + a_activar[elem].id + "\"); if (el) { el.classList.remove(\"prelive\"); el.classList.add(\"live\"); }", t);
		}
	},
	Save: function() {
		var storable = this.widgets;
		
		return Store("user_widgets", JSON.stringify(storable));
	},
	AddWidget: function(type, variables) {
		this.widgets.push(this.store[type].create(variables));
	},
	CreateWidget: function(type) {
		var thevars = this.store[type].variables;
		
		if (thevars) {
			for (varname in thevars) {
				switch (typeof thevars[varname].value) {
					case "boolean":
						thevars[varname].value = io.Confirm(thevars[varname].description);
						break;
					case "string":
						thevars[varname].value = io.Ask(thevars[varname].description);
						break;
					case "number":
						thevars[varname].value = parseFloat(io.Ask(thevars[varname].description));
						break;
				}
			}
		}
		
		this.AddWidget(type, thevars);
		this.Display();
		this.Save();
	},
	RemoveWidget: function(indice) {
		this.widgets.splice(indice,1);
		this.Save();
		this.Display();
	}
};