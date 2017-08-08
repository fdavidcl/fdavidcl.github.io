---
title: Métodos de aproximación en Ruby
tags:
 - programacion
 - ruby
 - math
---

Entre las tareas de una práctica para la asignatura de Mecánica
Celeste (todo
el
[código disponible en GitHub](https://github.com/fdavidcl/celeste)),
he tenido que programar un par de métodos numéricos de aproximación
iterativos. Resultó ser una aplicación muy práctica de los
[enumerables de Ruby](http://tux.ugr.es/libreim/blog/2015/08/24/ruby-enumerators/) y
me parece un buen ejemplo del ahorro de código que puede suponer su uso.

Para abstraer distintos métodos iterativos de aproximación, definí una
clase abstracta `Approximator` de la que derivarían el resto. Permite
almacenar la aproximación actual y la tolerancia o error que se quiera
aceptar. Las clases derivadas implementan el método `next_one` que
calcula la siguiente aproximación a partir de la actual.

~~~ ruby
# Clase base para métodos numéricos de aproximación de funciones
class Approximator

  # Datos miembro
  #  - current:   valor de la aproximación actual
  #  - tolerance: valor de tolerancia
  attr_accessor :current, :tolerance
  
  def initialize initial, tolerance = DEFAULT_TOLERANCE
    self.current = initial
    self.tolerance = tolerance
  end

  # Método a implementar en las clases hijas
  def next_one
    raise NotImplementedError
  end
end
~~~

El punto clave para aprovechar la potencia de los enumeradores es
implementar un método `each` que haga uso de la función `yield` para
proporcionar los resultados parciales. En este caso, proporciona la
aproximación encontrada en cada iteración. Lo interesante de `yield`
es que no devuelve el control al método hasta que se necesita un nuevo
resultado, de forma que sólo se realizan los cálculos necesarios. Por
ejemplo, podría haber implementado (y lo hice, al principio) el método
`each` como un `loop` infinito, sin condición de parada, y podría
iterar las veces necesarias para obtener una precisión arbitraria
(suponiendo convergencia del método). Sin embargo, para poder hacer un
uso práctico de las clases, añadí la condición de parada con la
tolerancia.

Una vez implementado `each`, basta con incluir el módulo `Enumerable`
que añade toda la funcionalidad de los enumeradores, como `to_a` que
acumula en un array todos los elementos devueltos por `each`. Así,
para calcular la mejor aproximación basta con devolver el último
elemento de ese array.

~~~ ruby
class Approximator
  # Método que calcula y proporciona aproximaciones
  def each
    previous = Float::INFINITY
    until (current - previous).abs < tolerance
      # Proporciona una aproximación y espera a que se
      # pida la siguiente
      yield current
      previous = current
      self.current = next_one
    end
  end

  # Incluimos herramientas que permiten enumerar
  # las aproximaciones
  include Enumerable

  # Método que devuelve la última aproximación
  # para la tolerancia dada
  def approximate
    to_a.last
  end
end
~~~

Además de consultar la mejor aproximación, podremos realizar otras
tareas como obtener una lista de *n* iteraciones con `take(n)`.

Por último, basta implementar especializaciones de esta clase con
métodos de aproximación concretos. El siguiente es el método de
Newton-Raphson, que permite calcular raíces de funciones a partir de
sucesivas evaluaciones en la función y en su derivada.

~~~ ruby
class NewtonRaphson < Approximator
  # Datos miembro
  #  - function:   almacena la función f
  #  - derivative: almacena la derivada de f
  attr_accessor :function, :derivative
  
  def initialize initial, tolerance = DEFAULT_TOLERANCE, function, derivative
    super(initial, tolerance)
    self.function = function
    self.derivative = derivative
  end
  
  def next_one
    # Método de Newton-Raphson para encontrar raíces:
    # Calcula Φ(current) = current - f(current)/f'(current)
    current - function.call(current)/derivative.call(current)
  end
end
~~~

Un ejemplo de uso de esta implementación sería el cálculo de la raíz
cuadrada de 5, como la raíz del polinomio correspondiente:

~~~ ruby
example = NewtonRaphson.new(
  3.0,
  ->(x) { x**2 - 5 },
  ->(x) { 2*x }
)
example.approximate
#=> 2.23606797749979
~~~

Otra especialización es la aproximación de la suma de una serie
convergente, a partir de una función que evalúe el n-ésimo término:

~~~ ruby
class SeriesApproximator < Approximator

  # Datos miembro
  #  - term: función que evalúa el término n-ésimo de la serie
  #  - n: índice del término actual se la serie
  attr_accessor :term, :n
  
  def initialize tolerance = DEFAULT_TOLERANCE, term
    super(0, tolerance)
    self.term = term
    self.n = 0
  end

  # Calcula el siguiente término de la serie y lo suma a
  # la aproximación actual
  def next_one
    self.n += 1
    self.current += term.call(n)
  end
end
~~~

Podemos usarla para calcular la suma de Σ1/2^n:

~~~ ruby
series = SeriesApproximator.new(->(n) { 1.0/2**n })
series.approximate
#=> 0.999999999998181
~~~

En particular, las sumas de series nos pueden permitir aproximar los
valores de algunas funciones en diversos puntos, utilizando
por ejemplo [desarrollos de Fourier](https://en.wikipedia.org/wiki/Fourier_series).

Y si habéis leído hasta aquí, ¡gracias! Espero que os haya parecido útil
y os sirva para aprovechar los enumerables en otros proyectos.
