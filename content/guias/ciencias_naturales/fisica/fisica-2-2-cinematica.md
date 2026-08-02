---
title: "Cinemática: El Arte de Describir el Movimiento"
description: "Guía completa de cinemática: posición, velocidad, aceleración, movimiento rectilíneo uniforme y acelerado, caída libre, movimiento parabólico y la relación entre derivadas e integrales. Con laboratorio de ejercicios y bloques interactivos."
slug: cinematica
author: Aeterna
category: ciencias_naturales
subcategory: fisica
tags: ["cinemática", "posición", "velocidad", "aceleración", "movimiento rectilíneo", "caída libre", "movimiento parabólico", "MRU", "MRUA", "derivadas", "integrales"]
image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-09
nivel: 2
orden: 2
nivel_titulo: El Reino de lo Clásico
tipo: theory
prerequisites: ["vectores"]
breadcrumb: Física / El Reino de lo Clásico / Cinemática
---

<AeternaHeroWelcome>
  Todo se mueve: la Tierra, el aire, tu corazón. La cinemática es el arte de describir ese movimiento —sin preguntar por qué ocurre.
</AeternaHeroWelcome>

> **💡 La clave en 10 segundos**
>
> La cinemática describe el movimiento con tres conceptos: **posición** (dónde estás), **velocidad** (qué tan rápido cambias de posición) y **aceleración** (qué tan rápido cambia tu velocidad). El movimiento rectilíneo uniforme (MRU) mantiene velocidad constante; el uniformemente acelerado (MRUA) cambia la velocidad a ritmo constante; y la caída libre es MRUA con la aceleración de la gravedad. Con estas herramientas puedes describir desde un coche en la autopista hasta un planeta orbitando.

**[IMAGEN SUGERIDA: Una autopista vista desde arriba con estelas de luz de los coches moviéndose, mostrando trayectorias. Pie de foto: "La cinemática describe el movimiento sin preguntar por qué."]**

<ProgresionArticulo
  hitos={["Fundamentos", "Profundización", "Frontera"]}
  hitoInicial="Fundamentos"
/>


<NivelActivo id="fundamentos">

## Bienvenida: el mundo está en movimiento

## Bienvenida: el mundo está en movimiento

En este instante, la Tierra gira sobre su eje a 1.670 km/h, orbita el Sol a 107.000 km/h, y el Sol viaja por la galaxia a 720.000 km/h. Aunque no lo sientas, te estás moviendo a velocidades vertiginosas.

La **cinemática** es la rama de la física que describe el movimiento: dónde están las cosas, qué tan rápido se mueven y cómo cambia su rapidez. No pregunta *por qué* se mueven (eso es la dinámica): solo describe *cómo*.

Es la herramienta más básica de la física. Antes de entender las fuerzas (Newton), la energía o la gravedad, necesitas un lenguaje para describir el movimiento. Ese lenguaje es la cinemática.

> **🔑 Concepto clave: Cinemática**
> La cinemática describe el movimiento mediante posición, velocidad y aceleración, sin investigar sus causas. Es la 'gramática' del movimiento: con ella describimos cualquier trayectoria antes de preguntarnos qué la produce.

**[IMAGEN SUGERIDA: Una mariposa en vuelo con una línea de puntos que traza su trayectoria. Pie de foto: "Describir el movimiento es dibujar su trayectoria."]**


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la cinemática describe el movimiento con tres conceptos encadenados: posición (dónde estás), velocidad (cómo cambia la posición) y aceleración (cómo cambia la velocidad). Describir un movimiento es conocer esas tres funciones del tiempo.
</PedagogicalContentBlock>

---

## Posición y movimiento: ¿dónde estoy?

## Posición y movimiento: ¿dónde estoy?

Todo comienza con una pregunta de niño: ¿dónde estoy? La respuesta siempre necesita un punto de referencia. 'A 5 metros de la puerta', 'a 2 calles de casa': la posición es relativa a algo.

En física, la **posición** de un objeto es su lugar respecto a un **sistema de referencia** —un punto fijo que elegimos como origen. Se representa con un número (en 1D), un par de coordenadas (en 2D) o un vector.

La **trayectoria** es el camino que recorre el objeto. La **distancia** es cuánto camino recorrió. El **desplazamiento** es cuánto cambió su posición neta —la línea recta entre el inicio y el final, con dirección.

> **Dato que rompe el cerebro**
> Si caminas 3 km al norte y luego 4 km al sur, recorriste 7 km (distancia), pero tu desplazamiento es solo 1 km al norte. Distancia y desplazamiento son conceptos diferentes.

**[IMAGEN SUGERIDA: Un mapa con una línea discontinua mostrando el camino recorrido y una flecha recta mostrando el desplazamiento. Pie de foto: "Distancia vs desplazamiento."]**

---

## Velocidad: qué tan rápido y hacia dónde

## Velocidad: qué tan rápido y hacia dónde

La **velocidad** nos dice dos cosas: qué tan rápido se mueve un objeto y hacia dónde. A diferencia de la rapidez (solo qué tan rápido), la velocidad es un vector: tiene magnitud y dirección.

- **Rapidez**: cuánta distancia recorres por unidad de tiempo (solo un número). Ej: 50 km/h
- **Velocidad**: cuánto cambia tu posición por unidad de tiempo, con dirección. Ej: 50 km/h hacia el norte

Un coche que da vueltas en una rotonda a rapidez constante está cambiando de dirección constantemente, así que su velocidad está cambiando aunque su rapidez no.

> **Dato curioso**
> El velocímetro de tu coche mide la rapidez, no la velocidad. La velocidad incluye la dirección: por eso ir a 50 km/h hacia el norte y a 50 km/h hacia el sur son velocidades opuestas, aunque la rapidez sea la misma.

---

## Aceleración: el cambio del cambio

## Aceleración: el cambio del cambio

Si la velocidad mide cómo cambia la posición, la **aceleración** mide cómo cambia la velocidad. Es el 'cambio del cambio'.

La aceleración nos dice qué tan rápido cambia la velocidad —y recuerda que la velocidad incluye la dirección. Por eso:

- Frenar es acelerar (negativa)
- Girar es acelerar (cambia la dirección)
- Acelerar es acelerar (cambia la rapidez)

Cuando pisas el acelerador, tu velocidad aumenta: aceleras. Cuando pisas el freno, tu velocidad disminuye: también es aceleración, solo que en sentido opuesto.

> **Dato que rompe el cerebro**
> En física, 'aceleración' incluye frenar y girar. Un coche en una curva cerrada a velocidad constante está acelerando, porque su dirección cambia. La aceleración es cualquier cambio en la velocidad, ya sea en rapidez o en dirección.

**[IMAGEN SUGERIDA: Un coche de carreras acelerando en línea recta, con flechas de velocidad creciendo y una flecha de aceleración. Pie de foto: "La aceleración cambia la velocidad."]**

---

## MRUA y caída libre: la gravedad como protagonista

## Movimiento rectilíneo uniformemente acelerado

El **MRUA** es el movimiento en línea recta con aceleración constante. El ejemplo más importante es la **caída libre**: cuando sueltas un objeto, la gravedad lo acelera constantemente a 9.8 m/s².

En la caída libre:
- La velocidad aumenta 9.8 m/s cada segundo
- La distancia recorrida crece cada vez más rápido
- Todos los objetos caen igual (sin resistencia del aire)

> **Dato que rompe el cerebro**
> Sin resistencia del aire, una pluma y un martillo caen al mismo tiempo y a la misma velocidad. Esto se demostró en la Luna en 1971: el astronauta David Scott dejó caer una pluma y un martillo, y ambos llegaron juntos al suelo. La gravedad acelera todos los objetos por igual.

**[IMAGEN SUGERIDA: Una pluma y un martillo cayendo en la Luna (experimento de Apollo 15), ambos al mismo nivel. Pie de foto: "En el vacío, todos caen igual."]**


### Estima como un físico: ¿cuánto tarda un objeto en caer?

La **estimación de Fermi** es una herramienta del físico: descomponer un problema aparentemente incalculable en partes estimables. Un ejemplo clásico de **modelo simplificado**:

- Quieres estimar cuánto tarda una moneda en caer desde lo alto de un edificio de 100 m.
- Usas el modelo de caída libre (sin resistencia del aire): t = √(2h/g) = √(200/10) = √20 ≈ 4.5 s.
- En la realidad, la resistencia del aire la frena un poco, pero el orden de magnitud es correcto.

Un físico no busca la cifra exacta: busca el **orden de magnitud** correcto. Estimar es modelar con supuestos explícitos y comprobar la plausibilidad —esa capacidad de **simplificar** sin traicionar es el corazón del pensamiento físico.

---

## Movimiento en dos dimensiones: el tiro parabólico

## Movimiento en dos dimensiones

La vida real es más que una línea recta. Cuando lanzas una pelota, se mueve en el aire hacia arriba y hacia adelante a la vez. Para describirlo, usamos dos ejes: horizontal (x) y vertical (y).

La clave del **tiro parabólico** es que los dos movimientos son independientes:

- **Horizontal**: velocidad constante (MRU), sin aceleración
- **Vertical**: aceleración de la gravedad (MRUA)

Como actúan de forma independiente, podemos analizarlos por separado y combinar los resultados.

> **Dato que rompe el cerebro**
> Un proyectil lanzado horizontalmente y otro que se deja caer desde la misma altura llegan al suelo al mismo tiempo. La gravedad actúa igual sobre ambos, independientemente del movimiento horizontal.

**[IMAGEN SUGERIDA: Un cañón lanzando una bala, con la trayectoria parabólica descompuesta en componentes horizontal y vertical. Pie de foto: "El tiro parabólico combina MRU horizontal y MRUA vertical."]**


<Connect title="Del tiro parabólico a la órbita" sourceConcept="Tiro parabólico" targetConcept="Movimiento orbital">
Si un proyectil se lanza con velocidad horizontal suficiente, la curvatura de la Tierra hace que "caiga" alrededor de ella en lugar de tocar el suelo. El tiro parabólico y la órbita son el mismo fenómeno visto a distintas escalas: la cinemática 2D conecta con la mecánica orbital que estudiarás en Movimiento Circular.
</Connect>

---

## De la derivada a la integral: el puente del cálculo

## La derivada y la integral: dos caras de lo mismo

La cinemática tiene un secreto hermoso: la velocidad es la **derivada** de la posición, y la posición es la **integral** de la velocidad. Son operaciones inversas.

- Derivar: de la posición obtienes la velocidad (¿qué tan rápido cambia?)
- Integrar: de la velocidad obtienes la posición (¿cuánto camino recorrió?)

Es como sumar y restar, pero para funciones continuas.

> **Dato curioso**
> Newton inventó el cálculo justamente para resolver problemas de cinemática. Necesitaba una forma de describir cómo cambia la posición continuamente. Por eso la física y el cálculo nacieron juntos.

**[IMAGEN SUGERIDA: Una gráfica de posición (curva), velocidad (recta) y aceleración (línea horizontal), mostrando las relaciones de derivada e integral. Pie de foto: "Derivar e integrar conectan posición, velocidad y aceleración."]**


<Transfer targetDomain="Economía y finanzas" title="Transfiere: derivadas en la economía">
En economía, la "velocidad" de una magnitud es su derivada: la inflación es la derivada de los precios, y el crecimiento es la derivada del PIB. Elige una magnitud económica (precios, población, ventas) e identifica qué sería su "velocidad" y su "aceleración" —el mismo lenguaje de la cinemática aplicado a otro dominio.
</Transfer>

</NivelActivo>


<NivelActivo id="profundizacion">

## Bienvenida: el mundo está en movimiento

## Bienvenida: el lenguaje del movimiento

La cinemática se distingue de la dinámica por una frontera conceptual clara: la cinemática describe *cómo* se mueve un objeto, la dinámica explica *por qué*. Esta separación es una de las mayores contribuciones de Galileo y Newton.

Los conceptos fundamentales son:

- **Sistema de referencia**: el marco desde el que observamos. 'Moverse' solo tiene sentido respecto a algo.
- **Posición**: el lugar del objeto en el sistema de referencia, un vector.
- **Trayectoria**: la curva que describe el objeto.
- **Desplazamiento**: el cambio neto de posición (vector), distinto de la distancia recorrida (escalar).
- **Velocidad**: la rapidez del cambio de posición.
- **Aceleración**: la rapidez del cambio de velocidad.

Un ejemplo que ilustra la diferencia entre desplazamiento y distancia: si caminas 3 km al norte y luego 4 km al sur, la distancia recorrida es 7 km, pero el desplazamiento es 1 km al norte. Son conceptos distintos que los físicos cuidan de no confundir.

> **Dato que rompe el cerebro**
> La velocidad de la luz es constante para todos los observadores —no se suma con la velocidad del observador. Esta 'rareza' de la cinemática llevó a Einstein a la relatividad especial. La cinemática clásica es una aproximación válida a velocidades cotidianas.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la cinemática describe el movimiento con tres conceptos encadenados: posición (dónde estás), velocidad (cómo cambia la posición) y aceleración (cómo cambia la velocidad). Describir un movimiento es conocer esas tres funciones del tiempo.
</PedagogicalContentBlock>

---

## Posición y movimiento: ¿dónde estoy?

## Posición como función del tiempo

En cinemática, la posición es una función del tiempo: x(t). Conocer x(t) es conocerlo todo sobre el movimiento en esa dimensión.

El **desplazamiento** entre dos instantes es:

$$ \Delta x = x(t_2) - x(t_1) $$

La **velocidad media** es el desplazamiento dividido por el tiempo:

$$ v_{media} = \frac{\Delta x}{\Delta t} $$

La **velocidad instantánea** es el límite cuando Δt tiende a cero —la derivada de la posición:

$$ v = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t} = \frac{dx}{dt} $$

```aeterna-exercise
TITLE: ¿Distancia o desplazamiento?
HINT: Distancia = camino recorrido. Desplazamiento = cambio neto de posición con dirección.
XP: 30
Corres una vuelta completa a una pista de 400 m y vuelves al punto de partida. ¿Cuál es tu distancia y cuál tu desplazamiento?
SOLUTION: La distancia es 400 m (el camino recorrido). El desplazamiento es 0 m: volviste al punto de partida, tu posición neta no cambió. El desplazamiento es el cambio de posición, no la distancia.
```

> **🔑 Concepto clave: La posición es relativa**
> No existe una posición absoluta. Solo tiene sentido hablar de posición respecto a un sistema de referencia. Esta relatividad es tan fundamental que Einstein la extendió a la velocidad y al tiempo.

---

## Velocidad: qué tan rápido y hacia dónde

## Velocidad media e instantánea

La **velocidad media** es el desplazamiento total dividido por el tiempo total:

$$ \vec{v}_{media} = \frac{\Delta \vec{x}}{\Delta t} $$

La **velocidad instantánea** es la derivada de la posición:

$$ \vec{v} = \frac{d\vec{x}}{dt} $$

En el movimiento rectilíneo uniforme (MRU), la velocidad es constante, por lo que la posición avanza linealmente:

$$ x = x_0 + vt $$

```aeterna-formula
title="Velocidad en MRU"
formula="x = x_0 + vt"
variables={[{"symbol":"x","name":"Posición final","unit":"m"},{"symbol":"x₀","name":"Posición inicial","unit":"m"},{"symbol":"v","name":"Velocidad constante","unit":"m/s"},{"symbol":"t","name":"Tiempo","unit":"s"}]}
note="El MRU es el movimiento más simple: la posición avanza a ritmo constante, la gráfica x vs t es una línea recta cuya pendiente es la velocidad."
```

> **🔑 Concepto clave: La pendiente de la gráfica x-t**
> En una gráfica de posición frente a tiempo, la pendiente en cada punto es la velocidad instantánea. Una pendiente constante = velocidad constante (MRU). Una pendiente creciente = el objeto acelera.

---

## Aceleración: el cambio del cambio

## Aceleración media e instantánea

La **aceleración media** es el cambio de velocidad dividido por el tiempo:

$$ a_{media} = \frac{\Delta v}{\Delta t} $$

La **aceleración instantánea** es la derivada de la velocidad:

$$ a = \frac{dv}{dt} = \frac{d^2x}{dt^2} $$

En el MRUA, la aceleración es constante, y las ecuaciones del movimiento son:

$$ v = v_0 + at $$

$$ x = x_0 + v_0 t + \frac{1}{2} a t^2 $$

$$ v^2 = v_0^2 + 2a(x - x_0) $$

```graph-lab
TITLE: Gráficas del MRUA
DESC: El MRUA con aceleración constante produce tres gráficas características: posición parabólica, velocidad lineal y aceleración constante.
X_LABEL: Tiempo (s)
Y_LABEL: Posición / Velocidad
QUESTION: ¿Qué forma tiene la gráfica de posición frente a tiempo en un MRUA?
XP: 45
POINT: 0 | 0 | t=0
POINT: 1 | 1.5 | t=1
POINT: 2 | 6 | t=2
POINT: 3 | 13.5 | t=3
OPTION_CORRECT: Una parábola | La posición crece como t² en un MRUA (x = ½at²), que es una parábola. La velocidad crece linealmente y la aceleración es constante.
OPTION_WRONG: Una línea recta | La línea recta corresponde al MRU (velocidad constante), no al MRUA.
OPTION_WRONG: Una onda | Las ondas corresponden a movimientos oscilatorios, no al MRUA.
```

> **🔑 Concepto clave: Las tres ecuaciones del MRUA**
> Con aceleración constante, solo necesitas tres ecuaciones: v = v₀ + at, x = x₀ + v₀t + ½at², y v² = v₀² + 2a(x−x₀). Con cualquiera de estas puedes resolver cualquier problema de MRUA.

---

## MRUA y caída libre: la gravedad como protagonista

## Caída libre y lanzamiento vertical

En la caída libre, la aceleración es la gravedad g = 9.8 m/s² hacia abajo. Las ecuaciones del MRUA se adaptan:

$$ y = y_0 + v_0 t - \frac{1}{2} g t^2 $$

$$ v = v_0 - g t $$

Para un lanzamiento vertical hacia arriba:
- El objeto sube hasta que v = 0 (altura máxima)
- Luego cae con la misma aceleración
- El tiempo de subida es igual al de bajada

```parameter-lab
TITLE: Laboratorio de caída libre
DESC: Ajusta la altura inicial y observa cómo varía el tiempo de caída y la velocidad final.
OUTPUT_LABEL: Tiempo de caída
OUTPUT_UNIT: s
QUESTION: Si duplicas la altura de caída, ¿el tiempo de caída se duplica?
ANSWER: No. El tiempo crece como la raíz cuadrada de la altura (t = √(2h/g)): al duplicar la altura, el tiempo solo se multiplica por √2 ≈ 1.41. La distancia crece como t².
XP: 50
PARAM: altura | Altura inicial | m | 5 | 100 | 1 | 20
PARAM: g | Gravedad | m/s² | 1.6 | 25 | 0.1 | 9.8
```

> **🔑 Concepto clave: La altura máxima**
> En un lanzamiento vertical, la altura máxima ocurre cuando la velocidad es cero: v = 0. Usando v² = v₀² − 2gh, la altura máxima es h_max = v₀²/(2g). El tiempo de subida es t = v₀/g.


### Estima como un físico: ¿cuánto tarda un objeto en caer?

La **estimación de Fermi** es una herramienta del físico: descomponer un problema aparentemente incalculable en partes estimables. Un ejemplo clásico de **modelo simplificado**:

- Quieres estimar cuánto tarda una moneda en caer desde lo alto de un edificio de 100 m.
- Usas el modelo de caída libre (sin resistencia del aire): t = √(2h/g) = √(200/10) = √20 ≈ 4.5 s.
- En la realidad, la resistencia del aire la frena un poco, pero el orden de magnitud es correcto.

Un físico no busca la cifra exacta: busca el **orden de magnitud** correcto. Estimar es modelar con supuestos explícitos y comprobar la plausibilidad —esa capacidad de **simplificar** sin traicionar es el corazón del pensamiento físico.

---

## Movimiento en dos dimensiones: el tiro parabólico

## El tiro parabólico en detalle

Descomponemos el movimiento en componentes. La velocidad inicial v₀ se separa:

$$ v_{0x} = v_0 \cos \theta $$

$$ v_{0y} = v_0 \sin \theta $$

Las ecuaciones por componente:

**Horizontal** (MRU):

$$ x = v_{0x} t $$

**Vertical** (MRUA con g):

$$ y = v_{0y} t - \frac{1}{2} g t^2 $$

La trayectoria es una parábola. El **alcance máximo** (horizontal) ocurre a 45°:

$$ R = \frac{v_0^2 \sin(2\theta)}{g} $$

```aeterna-exercise
TITLE: Alcance de un proyectil
HINT: R = v₀²·sin(2θ)/g. Convierte la velocidad a m/s si es necesario.
XP: 45
Un cañón dispara a 50 m/s a 45°. ¿Cuál es su alcance horizontal? (g = 9.8 m/s²)
SOLUTION: R = v₀²·sin(2θ)/g = 50²·sin(90°)/9.8 = 2500/9.8 ≈ 255 m. A 45° se maximiza el alcance.
```

> **🔑 Concepto clave: Independencia de movimientos**
> La clave del tiro parabólico es que los movimientos horizontal y vertical son independientes. El tiempo de vuelo lo determina solo el movimiento vertical; el alcance horizontal es velocidad horizontal × tiempo de vuelo.


<Connect title="Del tiro parabólico a la órbita" sourceConcept="Tiro parabólico" targetConcept="Movimiento orbital">
Si un proyectil se lanza con velocidad horizontal suficiente, la curvatura de la Tierra hace que "caiga" alrededor de ella en lugar de tocar el suelo. El tiro parabólico y la órbita son el mismo fenómeno visto a distintas escalas: la cinemática 2D conecta con la mecánica orbital que estudiarás en Movimiento Circular.
</Connect>

---

## De la derivada a la integral: el puente del cálculo

## Derivadas e integrales en cinemática

Las relaciones fundamentales:

$$ v(t) = \frac{dx}{dt}, \quad a(t) = \frac{dv}{dt} $$

$$ x(t) = x_0 + \int_0^t v(\tau) d\tau $$

$$ v(t) = v_0 + \int_0^t a(\tau) d\tau $$

```aeterna-formula
title="Velocidad como derivada de la posición"
formula="v = \\frac{dx}{dt}"
variables={[{"symbol":"v","name":"Velocidad","unit":"m/s"},{"symbol":"x","name":"Posición","unit":"m"},{"symbol":"t","name":"Tiempo","unit":"s"}]}
note="La velocidad instantánea es la pendiente de la curva de posición. El área bajo la curva de velocidad da el desplazamiento (integral)."
```

**Interpretación gráfica:**
- La pendiente de x-t es la velocidad
- La pendiente de v-t es la aceleración
- El área bajo v-t es el desplazamiento
- El área bajo a-t es el cambio de velocidad

> **🔑 Concepto clave: Pendiente y área**
> En cinemática, las gráficas tienen dos lecturas: la **pendiente** de una curva es la derivada (velocidad o aceleración), y el **área** bajo una curva es la integral (desplazamiento o cambio de velocidad). Esta dualidad pendiente-área es el corazón del cálculo aplicado al movimiento.


<Transfer targetDomain="Economía y finanzas" title="Transfiere: derivadas en la economía">
En economía, la "velocidad" de una magnitud es su derivada: la inflación es la derivada de los precios, y el crecimiento es la derivada del PIB. Elige una magnitud económica (precios, población, ventas) e identifica qué sería su "velocidad" y su "aceleración" —el mismo lenguaje de la cinemática aplicado a otro dominio.
</Transfer>

</NivelActivo>


<NivelActivo id="frontera">

## Bienvenida: el mundo está en movimiento

## Bienvenida: la cinemática como geometría del espacio-tiempo

En su formulación moderna, la cinemática describe el movimiento como una curva en el **espacio-tiempo**: un evento es un punto (t, x, y, z), y la trayectoria de una partícula es una línea mundial en 4 dimensiones.

La velocidad es la tangente a esa línea mundial, y la aceleración mide la curvatura de la línea. Esta visión geométrica, formalizada por Minkowski, es la base de la relatividad.

En cinemática clásica (no relativista), el tiempo es absoluto y común a todos los observadores. Las coordenadas de un objeto son funciones del tiempo: x(t), y(t), z(t). La velocidad y la aceleración son derivadas:

$$ \vec{v} = \frac{d\vec{r}}{dt}, \quad \vec{a} = \frac{d\vec{v}}{dt} = \frac{d^2\vec{r}}{dt^2} $$

Esta conexión entre cinemática y cálculo —que velocidad y aceleración son derivadas de la posición— es el puente que Newton construyó entre la física y las matemáticas.

> **💡 Nota avanzada**
> La elección del sistema de referencia no es trivial. En relatividad, dos observadores con movimientos distintos miden intervalos de tiempo y longitudes diferentes. La cinemática relativista corrige la clásica con los factores de Lorentz, aunque a velocidades cotidianas la corrección es despreciable.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la cinemática describe el movimiento con tres conceptos encadenados: posición (dónde estás), velocidad (cómo cambia la posición) y aceleración (cómo cambia la velocidad). Describir un movimiento es conocer esas tres funciones del tiempo.
</PedagogicalContentBlock>

---

## Posición y movimiento: ¿dónde estoy?

## La posición y el cálculo diferencial

La posición x(t) es una función continua y (para movimientos físicos) derivable. La velocidad es su primera derivada y la aceleración la segunda.

Para un movimiento con aceleración constante, la posición es un polinomio cuadrático:

$$ x(t) = x_0 + v_0 t + \frac{1}{2} a t^2 $$

Derivando: v(t) = v₀ + at, y a(t) = a (constante). La forma cuadrática de la posición es la firma de la aceleración constante.

La relación entre posición y sus derivadas es la base del problema inverso: si conoces la aceleración a(t) y las condiciones iniciales, puedes integrar para obtener v(t) y x(t):

$$ v(t) = v_0 + \int_0^t a(\tau) d\tau $$

$$ x(t) = x_0 + \int_0^t v(\tau) d\tau $$

> **💡 Nota avanzada**
> La conexión cinemática-cálculo es la razón por la que Newton inventó el cálculo: necesitaba un lenguaje para describir la variación continua. La derivada de la posición (velocidad) y su integral (recorrido) son los dos pilares de la descripción del movimiento.

---

## Velocidad: qué tan rápido y hacia dónde

## Velocidad, rapidez y distancia

La rapidez es la magnitud del vector velocidad: rapidez = |v|. La distancia recorrida es la integral de la rapidez:

$$ d = \int |\vec{v}| \, dt $$

Mientras que el desplazamiento es la integral de la velocidad (vectorial):

$$ \Delta \vec{x} = \int \vec{v} \, dt $$

Para movimientos con velocidad variable, la distancia y el desplazamiento pueden diferir mucho. Un objeto que va y viene a distintas velocidades acumula distancia pero puede tener desplazamiento neto pequeño.

> **💡 Nota de frontera**
> En relatividad, la velocidad se combina de forma no trivial (suma relativista de velocidades). A velocidades cercanas a la luz, ninguna velocidad supera c. Pero en cinemática clásica, las velocidades simplemente se suman: v_total = v₁ + v₂.

---

## Aceleración: el cambio del cambio

## Aceleración como curvatura

La aceleración mide la curvatura de la trayectoria en el espacio-tiempo. En coordenadas, la aceleración tiene componentes tangencial y normal:

- **Tangencial**: cambia la rapidez
- **Normal (centrípeta)**: cambia la dirección

La aceleración total es la suma vectorial de ambas. Para un movimiento circular uniforme, solo hay componente normal: a = v²/r.

La relación entre aceleración y fuerza (segunda ley de Newton) conecta la cinemática con la dinámica: F = ma. Pero en cinemática pura, la aceleración es solo una propiedad geométrica de la trayectoria.

> **💡 Nota avanzada**
> Las gráficas de aceleración frente a tiempo pueden tener formas complejas, pero el área bajo la curva a-t da el cambio de velocidad (integral). Del mismo modo, el área bajo la curva v-t da el desplazamiento. Estas son las dos integrales fundamentales de la cinemática.

---

## MRUA y caída libre: la gravedad como protagonista

## Caída libre: de Galileo a la Luna

Galileo estableció en el siglo XVII que, en ausencia de resistencia del aire, todos los cuerpos caen con la misma aceleración. Lo verificó (según la leyenda) lanzando objetos desde la Torre de Pisa, y más rigurosamente con planos inclinados que ralentizaban la caída.

La caída libre es un caso de MRUA con a = g:

$$ y(t) = y_0 + v_0 t - \frac{1}{2} g t^2 $$

La velocidad final al caer desde una altura h:

$$ v = \sqrt{2gh} $$

> **💡 Nota de frontera**
> La aceleración gravitatoria no es exactamente constante: varía con la altitud (g = GM/r²) y la latitud. A 400 km (órbita de la ISS), g ≈ 8.7 m/s². En la Luna, g ≈ 1.6 m/s². La 'constante' g es local, no universal.


### Estima como un físico: ¿cuánto tarda un objeto en caer?

La **estimación de Fermi** es una herramienta del físico: descomponer un problema aparentemente incalculable en partes estimables. Un ejemplo clásico de **modelo simplificado**:

- Quieres estimar cuánto tarda una moneda en caer desde lo alto de un edificio de 100 m.
- Usas el modelo de caída libre (sin resistencia del aire): t = √(2h/g) = √(200/10) = √20 ≈ 4.5 s.
- En la realidad, la resistencia del aire la frena un poco, pero el orden de magnitud es correcto.

Un físico no busca la cifra exacta: busca el **orden de magnitud** correcto. Estimar es modelar con supuestos explícitos y comprobar la plausibilidad —esa capacidad de **simplificar** sin traicionar es el corazón del pensamiento físico.

---

## Movimiento en dos dimensiones: el tiro parabólico

## Del tiro parabólico al movimiento orbital

Si lanzas un proyectil con velocidad horizontal suficiente, la curvatura de la Tierra hace que 'caiga' alrededor de ella: el tiro parabólico se convierte en órbita. A ~7.9 km/s, el proyectil orbita la Tierra.

Esto conecta la cinemática 2D con la mecánica orbital: el movimiento parabólico es el caso límite de un proyectil local; la órbita es el proyectil que nunca cae.

> **💡 Nota de frontera**
> El tiro parabólico asume gravedad uniforme y sin resistencia del aire. En la realidad, la trayectoria se desvía: el aire frena el proyectil y la gravedad decrece con la altura. Los misiles balísticos reales siguen elipses, no parábolas, porque cubren distancias donde la Tierra se curva.


<Connect title="Del tiro parabólico a la órbita" sourceConcept="Tiro parabólico" targetConcept="Movimiento orbital">
Si un proyectil se lanza con velocidad horizontal suficiente, la curvatura de la Tierra hace que "caiga" alrededor de ella en lugar de tocar el suelo. El tiro parabólico y la órbita son el mismo fenómeno visto a distintas escalas: la cinemática 2D conecta con la mecánica orbital que estudiarás en Movimiento Circular.
</Connect>

---

## De la derivada a la integral: el puente del cálculo

## El cálculo como lenguaje del movimiento

La cinemática es la aplicación más directa del cálculo. Para una posición general x(t), la velocidad y aceleración son sus derivadas, y reconstruir x(t) desde a(t) requiere dos integraciones.

Un ejemplo completo: si a = constante, integrando una vez obtenemos v = v₀ + at, e integrando de nuevo x = x₀ + v₀t + ½at². Las tres ecuaciones del MRUA son exactamente la integración del caso más simple.

Para movimientos con aceleración variable (por ejemplo, a(t) = kt), las ecuaciones se complican pero el método es el mismo: integrar.

> **💡 Nota de frontera**
> Esta conexión entre cinemática y cálculo es la razón por la que el análisis matemático es el lenguaje natural de la física. Cada ley física se expresa como relaciones entre funciones y sus derivadas o integrales —ecuaciones diferenciales. La cinemática es la primera y más clara manifestación de este lenguaje.


<Transfer targetDomain="Economía y finanzas" title="Transfiere: derivadas en la economía">
En economía, la "velocidad" de una magnitud es su derivada: la inflación es la derivada de los precios, y el crecimiento es la derivada del PIB. Elige una magnitud económica (precios, población, ventas) e identifica qué sería su "velocidad" y su "aceleración" —el mismo lenguaje de la cinemática aplicado a otro dominio.
</Transfer>

</NivelActivo>


La cinemática es el lenguaje del movimiento. Has aprendido que la posición describe dónde estás, la velocidad qué tan rápido cambia tu posición, y la aceleración qué tan rápido cambia tu velocidad —el 'cambio del cambio'. El movimiento rectilíneo uniforme mantiene velocidad constante, el uniformemente acelerado la cambia a ritmo constante, y la caída libre es el caso especial donde la gravedad acelera todo por igual. El tiro parabólico revela que los movimientos horizontal y vertical son independientes, y la conexión entre derivadas e integrales muestra que la posición, la velocidad y la aceleración son eslabones de una misma cadena matemática. Pero la cinemática solo describe: no pregunta por qué. Esa pregunta —por qué los objetos se mueven como se mueven— es el territorio de la dinámica, a la que llegarás pronto. Con el lenguaje de la cinemática dominado, estás listo para descubrir qué hace que las cosas se muevan. El movimiento ya no es un misterio: es un libro abierto, y ahora sabes leerlo.
