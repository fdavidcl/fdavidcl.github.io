---
title: Sincronizando notas entre PC y móvil mediante Orgzly y Syncthing
tags:
 - emacs
 - trucos
 - android
 - syncthing
---

Uno de los sistemas más versátiles que existen para organización personal y gestión de tareas es *org-mode* de Emacs, un modo de este editor que proporciona comodidades útiles tanto para tomar notas rápidas como incluso [escribir unos apuntes con fórmulas matemáticas](https://m42.github.io/blog/2016/09/26/matematicas-en-emacs/). Esencialmente, aunque cuesta trabajo empezar a usarlo, tiene más utilidades y plugins que la mayoría de [navajas suizas](https://www.amazon.com/Wenger-16999-Swiss-Knife-Giant/product-reviews/B001DZTJRQ/ref=cm_cr_arp_d_viewopt_rvwer?pageNumber=1&filterByStar=positive&reviewerType=all_reviews), por lo que no es muy difícil encontrar una forma cómoda de aprovechar unas cuantas para organizarse.

Para llevar un sistema basado en *org* en el móvil existe [Orgzly](http://www.orgzly.com/), una aplicación de Android que da una interfaz intuitiva mediante botones y gestos, pero que internamente utiliza el formato de *org*.

{:.fig.medium}
![](/assets/images/orgzly.png)
Orgzly en funcionamiento

La pregunta que nos vendría a la mente a todos sería si podemos tener el mismo archivo de *org* sincronizado entre nuestros dispositivos con Emacs y Orgzly. El problema al que llegamos es que el único sistema de sincronización que ofrece Orgzly es a través de Dropbox y, aparte de las preocupaciones por seguridad y privacidad que nos podrían surgir, en realidad es totalmente innecesario tener nuestro archivo almacenado en la nube.

La solución que he encontrado es usar [Syncthing, un sistema de sincronización P2P de código libre](https://syncthing.net/). Para ello simplemente tendremos que instalar la app de Syncthing en los dispositivos Android y la versión del programa correspondiente a nuestro sistema operativo para el PC.

{:.note}
En Arch Linux basta ejecutar `pacman -S syncthing`. Además, conviene añadirlo al arranque del sistema con `systemctl --user enable syncthing`.

En la versión de PC, Syncthing generalmente inicializará una carpeta por defecto. Podemos mover ahí nuestro archivo *org*. Para hacer que se comuniquen los dispositivos entre sí, desde la interfaz web disponible en `localhost:8384` mostramos el ID desde *Options* &rarr; *Show ID* y escaneamos el código QR desde el móvil en la pantalla de *Nuevo dispositivo*.

{:.fig.medium}
![](/assets/images/syncthing-add.jpg)

Una vez hecho esto, la app avisará de que el PC quiere comenzar a sincronizar la carpeta por defecto. Aceptamos la solicitud y asignamos una ruta dentro de los archivos del teléfono, para almacenar esa carpeta. Syncthing descargará en esa ubicación los archivos que hayamos copiado en el ordenador, y los volverá a enviar a este cuando realicemos cambios.

{:.fig.medium}
![](/assets/images/syncthing-pc.png)

El último paso es configurar a Orgzly para que lea y escriba de esa carpeta. Para esto entramos en la configuración de la aplicación, y bajo *Sync* seleccionamos *Repositories* &rarr; *Directory*. Escogemos la ruta que definimos antes para el almacenamiento de Syncthing. A partir de ahora, Orgzly guardará en ese directorio los archivos *org* que cree, y leerá los nuevos archivos que aparezcan.

{:.fig.medium}
![](/assets/images/orgzly-repos.jpg)

Por último, Syncthing permite sincronizar datos entre muchos dispositivos y ser relativamente selectivo en cuanto a qué se sincroniza con cada uno. Así, nuestros archivos de *org* pueden estar siempre actualizados vayamos donde vayamos, y sin necesidad de almacenarlos permanentemente en servidores externos.

