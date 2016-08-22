---
title: Cómo hacer accesible un blog Jekyll a quien no sabe de Jekyll ni GitHub
---

Durante un tiempo, los colaboradores del [blog de LibreIM](http://tux.ugr.es/dgiim/blog) hemos tenido que componer los posts prácticamente a mano, haciendo uso de un editor de texto para escribirlos, Git para llevar el registro de cambios y una *pull request* en GitHub para enviar el post, revisarlo y corregirlo. Evidentemente, este puede ser un proceso ideal para desarrolladores acostumbrados al proceso, pero está lejos de ser perfecto cuando tratamos de mantener un blog colaborativo abierto a que cualquiera publique su conocimiento. Lo que buscamos es una forma de abstraer el proceso de edición y envío de posts para hacer el blog accesible a mucha más gente.

La solución que concebimos consta de dos partes: por un lado, un backend que utilizaría una cuenta *bot* de GitHub para la gestión automática de ramas y *pull requests*; por otro, una aplicación web con un formulario y un sencillo editor desde la que se enviarían los posts.

## Preparativos previos

Para crear nuevos *commits* y *pull requests* necesitamos una cuenta de GitHub. Podemos usar la propia o crear una nueva. Otorgaremos a dicha cuenta permisos de escritura sobre el repositorio de blog en cuestión. Después, obtendremos un [token de acceso personal](https://github.com/settings/tokens) con permisos de modificación de repositorios. Dicho token lo almacenaremos en las variables de entorno de la shell donde vayamos a hospedar la aplicación, supongamos que bajo el nombre de `GITHUB_TOKEN`.

## El backend

Componer un guion que trabaje con Git automáticamente no es muy complicado. Se podría utilizar directamente un guion de Bash pero, en vistas a integrarlo en la aplicación web, usamos la [gema git](https://rubygems.org/gems/git) para Ruby. Esta permite realizar todo tipo de operaciones sobre repositorios Git, a nosotros nos basta con clonar, abrir una nueva rama, incluir un nuevo archivo en un *commit* y enviarlo al repositorio remoto. El siguiente código Ruby define una función que realiza todo el proceso, notemos cómo se obtiene por parámetro un *block* (similar a una función anónima) que permite realizar las modificaciones pertinentes al repositorio:

~~~ruby
# repo.rb
require 'fileutils'
require 'git'

def modify_repo repo, head, commit_msg, &block
  dir = ".repo"

  # Usamos el token de acceso para clonar el repositorio
  g = Git.clone("https://#{ENV["GITHUB_TOKEN"]}@github.com/#{repo}.git", dir)

  # Configuramos el email y nombre de la cuenta bot
  g.config("user.name", "BOT")
  g.config("user.email", 'BOT_EMAIL@example.org')

  # Creamos una rama nueva
  g.branch(head).checkout

  # Realizamos modificaciones en el repo
  g.chdir { block.call }

  # Commit y push
  g.add(all: true)
  g.commit("#{commit_msg}")
  g.push("origin", head)

  FileUtils.rm_rf(dir)
end
~~~

Ahora hemos de añadir la capacidad de crear *pull requests*, para ello usamos la [gema octokit](https://rubygems.org/gems/octokit), que acepta el token de acceso que obtuvimos antes:

~~~ruby
# form.rb
require 'octokit'
require_relative 'repo'

github = Octokit::Client.new(:access_token => ENV["GITHUB_TOKEN"])

repo = "BOT/blog"
base = "gh-pages"
head = "new-post"

modify_repo repo, head, "Nuevo post" do
  # Creación del nuevo post
end

response = github.create_pull_request(repo, base, head, "Nuevo post", "")
~~~

Únicamente nos queda obtener del usuario los datos necesarios para crear un nuevo post: un titulo, un autor, una categoría y el contenido.

## El formulario

### Sinatra

[Sinatra](http://www.sinatrarb.com/) es un *domain specific language* (DSL) para Ruby que facilita la creación de aplicaciones web sencillas sin apenas esfuerzo. Basta con escribir las peticiones HTTP que se aceptan y cuál es la respuesta. Además, es muy útil utilizarlo junto a otras gemas de Ruby que ahorren trabajo a la hora de escribir las plantillas y el estilo. Nuestro archivo de dependencias `Gemfile` queda de la siguiente forma:

~~~ruby
# Gemfile

source 'https://rubygems.org'

gem 'sinatra'
gem 'sinatra-contrib'
gem 'thin'      # Web server
gem 'haml'      # For layouts
gem 'sass'      # For stylesheets
gem 'kramdown'  # For the preview
gem 'rouge'     # For syntax highlighting
gem 'octokit'   # For pull requests
gem 'git'       # Repo management
gem 'recaptcha' # Some protection against bots
~~~

Para instalar y manejar las dependencias usamos [Bundler](http://bundler.io/): basta así con ejecutar `gem install bundler` y tras esto `bundle install`.

### Respondiendo a peticiones

Vamos a ampliar el archivo `form.rb` creado anteriormente para aceptar y responder un par de peticiones HTTP. Responderemos a `GET /` mostrando el formulario, que crearemos aparte en una vista en Haml. Por otro lado, al enviar dicho formulario se creará una petición `POST /posts` con los datos que necesitamos para componer el nuevo post.

~~~haml
-# views/form.haml
%h1 Nuevo post
%form{action: "/posts", method: "post"}
  %input{type: "text", name: "title", placeholder: "Título"}
  %input{type: "text", name: "author", placeholder: "Autor 1, Autor 2, ..."}
  %input{type: "text", name: "category", placeholder: "Categoría"}
  %textarea{name: "content", placeholder: "Contenido"}
  %input{type: "submit", value: "Enviar"}
~~~

~~~ruby
# form.rb
require 'rubygems'
require 'bundler'
Bundler.require(:default)
require_relative "repo"

get "/" do
  # Mostramos el formulario
  haml :form
end

post "/posts/?" do
  # Obtenemos los datos
  title = params[:title]
  author = params[:author]
  content = params[:content]
  category = params[:category] || "unclassified"

  # Creamos el nombre del archivo
  date = Date.today.strftime "%Y-%m-%d"
  filename = title.downcase.split(" ")[0..4].join("-")

  github = Octokit::Client.new(:access_token => ENV["GITHUB_TOKEN"])

  repo = "BOT/blog"
  base = "gh-pages"
  head = "new-post-#{filename}"

  modify_repo repo, head, "Nuevo post" do
    # Creamos el archivo del post
    File.open("_posts/#{date}-#{filename}.md", "w") do |f|
        f.write <<EOF
---
layout: post
title: #{title}
authors: #{author.split /,\s*/}
category: #{category}
---

#{content}
EOF
    end
  end

  response = github.create_pull_request(repo, base, head, "Nuevo post", "")
end
~~~

Para iniciar el servidor web con nuestra aplicación, debería bastar con ejecutar `ruby form.rb` en el terminal.

### Añadiendo un editor de verdad

Todo esto ya está muy bien, y la aplicación ahorra un montón de esfuerzo para cada vez que se crea un nuevo post. Pero aún queda una barrera que evitaría que algunos usuarios estuvieran cómodos escribiendo: el marcado de formato con Markdown. 
