/*
 * Este archivo procesa los marcadores del usuario y los convierte en
 * una lista de torres de enlaces almacenada en localStorage
 */
 
var bookmarks = {
	ProcessSection: function(objeto) {
		/* Toma un objeto (carpeta o marcador) y devuelve una
		   lista con todos los enlaces que contiene           */
		var lista_salida = [];
		if (objeto.children) {
			var lim = objeto.children.length;
			
			for (var i = 0; i < lim; i++) {
				var procesado = bookmarks.ProcessSection(objeto.children[i]);
				console.log(procesado);
				
				lista_salida = lista_salida.concat(procesado);
			}
				console.log(lista_salida);
		} else if (objeto.url) {
			lista_salida.push({name: objeto.title, href: objeto.url});
		}
		
		return lista_salida;
	},
	ProcessTower: function(tower) {
		var section_n = tower.children.length;
		var output_tower = { title: tower.title, sections: [] };
		var section_list = output_tower.sections;
		var default_section = { name: "", links:[] };
		var default_links = default_section.links;
		
		/* Creamos una sección por carpeta y añadimos los marcadores
		   sueltos a la sección por defecto                          */
		for (var i = 0; i < section_n; i++) {
			var item = tower.children[i];
			
			if (item.children) { // Carpeta
				section_list.push({ name: item.title, links: bookmarks.ProcessSection(item) });
			} else if (item.url) { // Marcador
				default_links.push({ name: item.title, href: item.url });
			}
		}
		
		if (default_links.length > 0) {
			section_list.unshift(default_section);
		}
		
		return output_tower;
	},
	CreateTowers: function(group) {
		var tower_n = group.children.length;
		var tower_list = [];
		var default_tower = { title: group.title, sections: [ { name: "", links:[] } ] };
		var default_links = default_tower.sections[0].links;
		
		/* Creamos una torre por carpeta y añadimos los marcadores sueltos
		   a la torre por defecto                                          */
		for (var i = 0; i < tower_n; i++) {
			var item = group.children[i];
			
			if (item.children) { // Carpeta
				tower_list.push(bookmarks.ProcessTower(item));
			} else if (item.url) { // Marcador
				default_links.push({ name: item.title, href: item.url });
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
		
		localStorage.towersData = JSON.stringify(tower_list);
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