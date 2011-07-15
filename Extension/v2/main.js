chrome.extension.sendRequest({elements: "mintuenti", script: "mintuentiscript"}, function(response) {
/**************
* Código basado en Minimalist for Gmail, por Ansel Santosa
* http://minimalistsuite.com/
***************/
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(response.o));
		heads[0].appendChild(node);
	}

	var bodies = document.getElementsByTagName("body");
	if (bodies.length > 0) {
		var scr = document.createElement("script");
		scr.type = "text/javascript";
		scr.appendChild(document.createTextNode(response.s));
		bodies[0].appendChild(scr);
	}
});