/*var opt = new Array();
opt[0] = ["font", "@media screen { @font-face { font-family: 'Raleway'; font-style: normal; font-weight: 100; src: local('Raleway Thin'), local('Raleway-Thin'), url('http://themes.googleusercontent.com/font?kit=RJMlAoFXXQEzZoMSUteGWD8E0i7KZn-EPnyo3HZu7kw') format('woff'); } } @media screen { @font-face { font-family: 'PT Sans'; font-style: italic; font-weight: bold; src: local('PT Sans Bold Italic'), local('PTSans-BoldItalic'), url('http://themes.googleusercontent.com/font?kit=lILlYDvubYemzYzN7GbLkHhCUOGz7vYGh680lGh-uXM') format('woff'); } } @media screen { @font-face { font-family: 'PT Sans'; font-style: italic; font-weight: normal; src: local('PT Sans Italic'), local('PTSans-Italic'), url('http://themes.googleusercontent.com/font?kit=PIPMHY90P7jtyjpXuZ2cLD8E0i7KZn-EPnyo3HZu7kw') format('woff'); } } @media screen { @font-face { font-family: 'PT Sans'; font-style: normal; font-weight: normal; src: local('PT Sans'), local('PTSans-Regular'), url('http://themes.googleusercontent.com/font?kit=LKf8nhXsWg5ybwEGXk8UBQ') format('woff'); } } @media screen { @font-face { font-family: 'PT Sans'; font-style: normal; font-weight: bold; src: local('PT Sans Bold'), local('PTSans-Bold'), url('http://themes.googleusercontent.com/font?kit=0XxGQsSc1g4rdRdjJKZrNBsxEYwM7FgeyaSgU71cLG0') format('woff'); } } * { font-family: 'PT Sans', sans-serif !important; } h1, h2, h3 { font-weight: normal !important; } header ul#aspect_nav > li * { font-family: 'Raleway' !important; font-weight: normal !important; }"];
opt[1] = ["tran", "* { -webkit-transition-property: background, background-color, border-color, color, opacity, -webkit-box-shadow; -webkit-transition-duration: .1s; -webkit-transition-timing-function: ease-out; }"];
opt[2] = ["logo", "* { -webkit-transition-property: background, background-color, border-color, color, opacity, -webkit-box-shadow; -webkit-transition-duration: .1s; -webkit-transition-timing-function: ease-out; }"];


var css = '';
var elm = '';
var addcss = '';
var cuenta = 0;

for (var i = 0; i < opt.length; i++) {
	//alert(i);
	elm = opt[i][0];
	addcss = opt[i][1];*/

	chrome.extension.sendRequest({elements: "mintuenti", script: "mintuentiscript"}, function(response) {

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
		/*if (response.o == 'true') {
			css += addcss + "\n";
		}
        if (++cuenta == opt.length) {
            insertCss(css);
        }
		//alert(elm+' '+response.o+': '+addcss);*/

	});
/*}*/



/*function insertCss(ncss) {
	var heads = document.getElementsByTagName("head");
	//alert(heads.length);
	if (heads.length > 0) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(ncss));
		heads[0].appendChild(node);
	}
}*/