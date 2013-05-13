
/*** Esto se ejecuta instantáneamente, sin necesidad de cargar todos los scripts ***/
document.querySelector("#theme").href = localStorage.usertheme ?
	localStorage.usertheme : "theme/metro_dark.css";

/*** Prototipo para llamada Ajax ***/
function AjaxRequest(url, callback) {
	this.url = url;

	this.Send = function() {
		if (window.XMLHttpRequest) {
			var xmlhttp = new XMLHttpRequest();
		} else {
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
		};
		xmlhttp.open("GET", this.url, true);
		xmlhttp.send();
	}
}

/*** Gestión de localStorage ***/
function Store(key, value) {
	if (value) {
		localStorage.removeItem(key);
		localStorage.setItem(key, value);
	}
	
	return localStorage[key];
}

/*** Activamos funcionalidades ***/
window.onload = function() {
	search.Load();
	liveinfo.Load();
	icons.Load();
	config.Load();
	bookmarks.LoadImport(); // Actualizamos marcadores silenciosamente
};

/*** Iniciamos el modo adecuado (si la URL tiene algún hash) ***/
window.onhashchange = function() {
	config.GetMode();
};
