
var icons = {
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
			icons.towers = JSON.parse(localStorage.towersData);
		} else {
			icons.towers = icons.default_towers;
		}
		
		icons.Display();
		//window.onresize = function() {icons.Display()};
	},
	Display: function() {
		var lim = icons.towers.length;
		
		var sections = 1, links = 1, href = 1, name = 0;
		
		document.querySelector('#right').innerHTML = "";
		
		for (var i = 0; i < lim; i++) {
			var tower = icons.towers[i];
			var elem_t = document.createElement("div");
			var inner = "<h1 id='tower_" + i + "'><span>" + tower[name] + "</span></h1>";
			
			var link_counter = 1;
			var lim_sec = tower[sections].length;
			for (var j = 0; j < lim_sec; j++) {
				var section = tower[sections][j];
				
				if (section[name] && section[name] != "") {
					inner += "<h3 id='section_" + i + "_" + j + "'>" + section[name] + "</h3>";
					link_counter++;
				}
				
				var quantity = section[links].length;
				for (var k = 0; k < quantity; k++) {
					var link = section[links][k];
					var l_elem = document.createElement('a');
					l_elem.className = 'bm';
					l_elem.id = "l" + i + "_" + j + "_" + k;
					l_elem.href = link[href];
					l_elem.style.backgroundImage = "url(chrome://favicon/" + link[href] + ")";
					l_elem.innerHTML = link[name];
					var dummy = document.createElement('div');
					dummy.appendChild(l_elem);
					
					inner += dummy.innerHTML;
					
					link_counter++;
				}
			}
			
			elem_t.innerHTML = inner;
			
			document.querySelector('#right').innerHTML += elem_t.innerHTML;
			
		}
	}
};