/*
 * Este archivo procesa los marcadores del usuario y los convierte en
 * una lista de torres de enlaces almacenada en localStorage
 */

/*
 * Estructura de una torre: [ "<Título>", [<Secciones>] ]
 * Estructura de una sección: [ "<Nombre>", [<Enlaces>] ]
 * Estructura de un enlace: [ "<Nombre>", "<URL>" ]
 */
 
/*
 * BUGS
 * TODO
	Dar al usuario la posibilidad de ocultar torres, convertir una
	carpeta de marcadores en una o varias torres.
	o bien
	Favoritos: Mostrar únicamente los marcadores preferidos por el usuario.
 */
 
var bookmarks = {
	ProcessSection: function(section, path) {
		// Creamos el "camino" hasta la carpeta
		if (!path) {
			path = "";
		}
		
		var section_list = [[path, []]];
		
		var n_elements = section.children.length;
		for (var i = 0; i < n_elements; i++) {
			var this_item = section.children[i];
			
			// Añadimos los marcadores a la sección raíz y las
			// carpetas internas forman nuevas secciones.
			if (this_item.url) {
				section_list[0][1].push([this_item.title, this_item.url]);
			} else if (this_item.children) {
				var new_path = path == "" ? this_item.title : path + " / "  + this_item.title;
				section_list = section_list.concat(bookmarks.ProcessSection(this_item, new_path));
			}
		}
			
		if (section_list[0][1].length == 0) {
			section_list.shift();
		}
		
		return section_list;
	},
	ProcessTower: function(tower) {
		var output_tower =[tower.title, []];
		
		// Creamos secciones
		output_tower[1] = output_tower[1].concat(bookmarks.ProcessSection(tower));
		
		return output_tower;
	},
	CreateTowers: function(group) {
		var tower_n = group.children.length;
		var tower_list = [];
		var default_tower = [group.title, [ ["", []] ] ];
		var default_links = default_tower[1][0][1];
		
		/* Creamos una torre por carpeta y añadimos los marcadores sueltos
		   a la torre por defecto                                          */
		for (var i = 0; i < tower_n; i++) {
			var item = group.children[i];
			
			if (item.children) { // Carpeta
				var temp = bookmarks.ProcessTower(item);
				tower_list.push(temp);
			} else if (item.url) { // Marcador
				default_links.push([item.title, item.url]);
			}
		}
		
		if (default_links.length > 0) {
			tower_list.push(default_tower);
		}
		
		return tower_list;
	},
	Import: function(bookmarks_tree, bar_towers, other_towers, mobile_towers) {
		/* Hay tres fuentes de marcadores: Barra de marcadores, Otros marcadores
		   y Marcadores del móvil. Importamos la primera con tantas torres como
		   carpetas tenga, la segunda y la tercera como una única torre cada una */
		var tower_list = [];
		
		/* Barra de marcadores */
		var bm_bar = bookmarks_tree.children[0];
		var bar_hierarchy;
		
		if (bar_towers) {
			bar_hierarchy = bookmarks.CreateTowers(bm_bar);
		} else {
			bar_hierarchy = [ bookmarks.ProcessTower(bm_bar) ];
		}
		
		/* Otros marcadores */
		var other = bookmarks_tree.children[1];
		var other_hierarchy;
		
		if (other_towers) {
			other_hierarchy = bookmarks.CreateTowers(other);
		} else {
			other_hierarchy = [ bookmarks.ProcessTower(other) ];
		}
		
		/* Marcadores del móvil */
		var mobile = bookmarks_tree.children[2];
		var mobile_hierarchy;
		
		if (mobile_towers) {
			mobile_hierarchy = bookmarks.CreateTowers(mobile);
		} else {
			mobile_hierarchy = [ bookmarks.ProcessTower(mobile) ];
		}
		
		tower_list = bar_hierarchy.concat(other_hierarchy, mobile_hierarchy);
		
		Store("towersData", JSON.stringify(tower_list));
	},
	LoadImport: function() {
		/* Opciones para mostrar las carpetas como torres o agruparlas en una sola */
		var expand_bar_folders = true;
		var expand_other_folders = false;
		var expand_mobile_folders = false;
		
		chrome.bookmarks.getTree(function(resp) {
			bookmarks.Import(resp[0], expand_bar_folders, expand_other_folders, expand_mobile_folders);
		});
	}
};