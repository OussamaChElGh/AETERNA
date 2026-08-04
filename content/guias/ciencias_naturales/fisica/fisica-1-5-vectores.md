---
title: "Vectores: El Lenguaje de la Física"
description: "Guía completa de vectores: qué son, suma y resta, descomposición en componentes, producto escalar y vectorial. La herramienta matemática que la física usa para describir cantidades con dirección."
slug: vectores
author: Anektia
category: ciencias_naturales
subcategory: fisica
tags: ["vectores", "álgebra vectorial", "descomposición", "producto escalar", "producto vectorial", "componentes"]
image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-12
nivel: 1
orden: 5
nivel_titulo: Fundamentos del Cosmos
tipo: theory
prerequisites: ["materia-y-energia"]
breadcrumb: Física / Fundamentos del Cosmos / Vectores
---

<AnektiaHeroWelcome>
  La velocidad, la fuerza, el campo eléctrico: cantidades que no bastan con un número —necesitan dirección. Eso es un vector.
</AnektiaHeroWelcome>

> **💡 La clave en 10 segundos**
>
> Un **vector** es una cantidad con magnitud y dirección (como la velocidad o la fuerza), a diferencia de un **escalar** que solo tiene magnitud (como la masa o la temperatura). Los vectores se suman, restan y descomponen en componentes perpendiculares. El **producto escalar** da un número (trabajo), el **producto vectorial** da otro vector (torque). Con los vectores, la física puede describir el mundo en dos y tres dimensiones.

**[IMAGEN SUGERIDA: Flechas de distintos colores apuntando en distintas direcciones sobre un fondo oscuro. Pie de foto: "Los vectores llevan dirección."]**

<ProgresionArticulo
  hitos={["Fundamentos", "Profundización", "Frontera"]}
  hitoInicial="Fundamentos"
/>


<NivelActivo id="fundamentos">

## Bienvenida: más que un número

## Bienvenida: más que un número

"El viento sopla a 30 km/h". ¿Basta para saber si te va a derribar? No: necesitas saber **hacia dónde** sopla. Un viento de 30 km/h hacia el norte no es lo mismo que uno de 30 km/h hacia el sur.

Algunas cantidades necesitan dirección: velocidad, fuerza, desplazamiento. Son **vectores**. Otras no la necesitan: masa, temperatura, tiempo. Son **escalares**.

Esta distinción parece simple, pero es la base de toda la física. Sin vectores, no podríamos describir cómo caen las cosas, cómo vuelan los aviones ni cómo se mueven los planetas.

> **🔑 Concepto clave: Vector y escalar**
> Un **escalar** tiene solo magnitud (un número y su unidad: 5 kg, 20 °C). Un **vector** tiene magnitud y dirección (50 km/h hacia el norte, 10 N hacia abajo). La física usa vectores para describir el espacio en varias dimensiones.

**[IMAGEN SUGERIDA: Un termómetro (escalar) y una flecha de viento (vector), contrastados. Pie de foto: "Escalares y vectores."]**


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** los vectores tienen magnitud y dirección. Se descomponen en componentes (vx = v·cosθ, vy = v·sinθ), se suman por componentes, y tienen dos productos: el escalar (A·B = |A||B|cosθ, base del trabajo) y el vectorial (A×B, base del torque). Con ellos, la física describe el mundo en 2D y 3D.
</PedagogicalContentBlock>

---

## ¿Qué es un vector?

## ¿Qué es un vector?

Un vector tiene tres características:

- **Punto de aplicación**: dónde empieza
- **Magnitud**: qué tan grande es (la longitud de la flecha)
- **Dirección y sentido**: hacia dónde apunta

La velocidad, el desplazamiento, la fuerza, la aceleración y el momento son vectores. La masa, el tiempo, la temperatura, la energía y la rapidez son escalares.

Un truco para distinguirlos: si tiene sentido preguntar '¿hacia dónde?', es un vector. '¿A qué velocidad vas?' → escalar (rapidez). '¿En qué dirección?' → vector (velocidad).

> **Dato curioso**
> La velocidad y la rapidez se confunden: la rapidez solo dice qué tan rápido (un escalar), la velocidad añade dirección (un vector). Un coche que da vueltas en una rotonda a rapidez constante tiene velocidad cambiante, porque su dirección cambia.

**[IMAGEN SUGERIDA: Flechas de distinta longitud y dirección. Pie de foto: "Magnitud, dirección y sentido."]**

---

## Suma y resta de vectores

## Suma y resta de vectores

Si caminas 3 km al este y luego 4 km al norte, ¿a qué distancia estás del inicio? No es 7 km: es 5 km (el teorema de Pitágoras). Los vectores no se suman como números simples.

La **suma de vectores** se hace con la regla del paralelogramo: colocas las flechas una tras otra (punta con cola) y el resultado va del inicio de la primera al final de la última.

La **resta** de vectores es sumar el opuesto: A − B = A + (−B).

> **Dato que rompe el cerebro**
> Dos vectores de 5 N y 5 N pueden sumar 10 N (si van en la misma dirección), 0 N (si van en direcciones opuestas) o cualquier valor entre 0 y 10 (según el ángulo). La suma de vectores depende del ángulo entre ellos.

**[IMAGEN SUGERIDA: Dos flechas sumándose con la regla del paralelogramo. Pie de foto: "La suma depende del ángulo."]**


<Transfer targetDomain="Navegación marítima" title="Transfiere: vectores en el mar">
Un capitán navega 30 km al este y luego 40 km al norte. Usando vectores, calcula su desplazamiento resultante y el rumbo (ángulo) respecto al norte. ¿Cómo cambiaría si hubiera una corriente que empuja 10 km al sur?
</Transfer>

---

## Descomposición en componentes

## Descomposición en componentes

Dividir un vector en sus componentes horizontal y vertical es como separar una pelota lanzada en diagonal: parte del movimiento va hacia adelante, parte hacia arriba.

La **descomposición** es la operación inversa de la composición: dado un vector con magnitud y ángulo, obtienes sus componentes:

- Componente x: vx = v·cosθ
- Componente y: vy = v·sinθ

> **Dato curioso**
> Al lanzar una pelota a 45°, la mitad de la velocidad va hacia adelante y la mitad hacia arriba. Por eso 45° da el alcance máximo. La descomposición revela cómo se reparte el movimiento.

**[IMAGEN SUGERIDA: Una flecha diagonal descompuesta en sus componentes horizontal y vertical, formando un triángulo rectángulo. Pie de foto: "Un vector se descompone en x e y."]**


<Connect title="De los vectores al tiro parabólico" sourceConcept="Descomposición vectorial" targetConcept="Cinemática">
Descomponer una velocidad inicial en componentes horizontal y vertical es exactamente lo que necesitas para analizar un tiro parabólico: el movimiento x es uniforme y el y es acelerado, independientes entre sí. La descomposición vectorial que aprendes aquí es la herramienta que usarás en cinemática 2D.
</Connect>

---

## Producto escalar y vectorial

## Producto escalar y vectorial

Hay dos formas de multiplicar vectores, y cada una da un resultado distinto:

- **Producto escalar** (·): da un número (escalar). Mide cuánto apuntan dos vectores en la misma dirección.
- **Producto vectorial** (×): da otro vector. Mide cuánto son perpendiculares y apunta perpendicular a ambos.

El producto escalar se usa para el trabajo (W = F·d). El producto vectorial para el torque (τ = r × F).

> **Dato curioso**
> El producto vectorial tiene dirección determinada por la regla de la mano derecha: apunta perpendicular al plano que forman los dos vectores, en el sentido que indica tu pulgar derecho.

**[IMAGEN SUGERIDA: Dos vectores A y B, con su producto vectorial perpendicular al plano. Pie de foto: "El producto vectorial es perpendicular a ambos."]**


### Estima como un físico: la resultante de dos vectores

La **estimación de Fermi** aplicada a vectores: si caminas 3 km al este y 4 km al norte, el desplazamiento es √(9+16) = 5 km —un **modelo simplificado** del problema. Si los vectores forman un ángulo distinto de 90°, el resultado está entre la diferencia y la suma de las magnitudes. Estimar el resultado antes de calcular te da un control de plausibilidad: un resultado de 8 km cuando los vectores suman 7 máximo es un error claro.

</NivelActivo>


<NivelActivo id="profundizacion">

## Bienvenida: más que un número

## Bienvenida: la estructura de los vectores

Un vector se representa como una flecha: la **longitud** es la magnitud y la **dirección** es hacia dónde apunta. Matemáticamente, un vector en 2D se escribe con sus componentes:

$$ \vec{v} = (v_x, v_y) $$

O en notación con vectores unitarios:

$$ \vec{v} = v_x \hat{i} + v_y \hat{j} $$

Donde î y ĵ son los vectores unitarios en los ejes x e y.

La **magnitud** (o módulo) se calcula con el teorema de Pitágoras:

$$ |\vec{v}| = \sqrt{v_x^2 + v_y^2} $$

La dirección se da con el ángulo respecto al eje x:

$$ \theta = \tan^{-1}\left(\frac{v_y}{v_x}\right) $$

> **Dato que rompe el cerebro**
> Un vector es el mismo objeto físico aunque lo representes en distintos sistemas de coordenadas. Girar el sistema de referencia cambia las componentes (vx, vy) pero no el vector en sí. La física busca descripciones que no dependan del observador.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** los vectores tienen magnitud y dirección. Se descomponen en componentes (vx = v·cosθ, vy = v·sinθ), se suman por componentes, y tienen dos productos: el escalar (A·B = |A||B|cosθ, base del trabajo) y el vectorial (A×B, base del torque). Con ellos, la física describe el mundo en 2D y 3D.
</PedagogicalContentBlock>

---

## ¿Qué es un vector?

## Vectores en componentes

Representar un vector con sus componentes facilita las operaciones. Dado un vector con magnitud v y ángulo θ:

$$ v_x = v \cos \theta $$

$$ v_y = v \sin \theta $$

```aeterna-exercise
TITLE: Componentes de un vector
HINT: vx = v·cosθ, vy = v·sinθ.
XP: 30
Un vector de 10 N forma un ángulo de 30° con el eje x. ¿Cuáles son sus componentes?
SOLUTION: vx = 10·cos(30°) = 10×0.866 = 8.66 N. vy = 10·sin(30°) = 10×0.5 = 5 N. El vector es (8.66, 5) N.
```

> **🔑 Concepto clave: Componentes**
> Las componentes (vx, vy) son las proyecciones del vector sobre los ejes. Conociéndolas, puedes reconstruir la magnitud (Pitágoras) y la dirección (tangente). Son dos representaciones equivalentes del mismo vector.

---

## Suma y resta de vectores

## Suma por componentes

La forma más fácil de sumar vectores es sumar sus componentes por separado:

$$ \vec{A} + \vec{B} = (A_x + B_x, A_y + B_y) $$

```graph-lab
TITLE: Suma de vectores
DESC: Dos vectores A y B se suman por componentes. Visualiza la resultante.
X_LABEL: x
Y_LABEL: y
QUESTION: Si A = (3,4) y B = (1,−2), ¿cuál es la resultante A+B?
XP: 45
POINT: 0 | 0 | Origen
POINT: 3 | 4 | A
POINT: 4 | 2 | A+B
OPTION_CORRECT: (4,2) | Sumas componentes: x = 3+1 = 4, y = 4+(−2) = 2.
OPTION_WRONG: (3,2) | Olvidaste sumar la componente x de B.
OPTION_WRONG: (4,6) | Confundiste el signo de la componente y de B.
```

> **🔑 Concepto clave: La regla del paralelogramo**
> La suma de vectores sigue la regla del paralelogramo o la del polígono (punta con cola). La resultante va del origen del primero al extremo del último. La resta A−B es A + (−B).


<Transfer targetDomain="Navegación marítima" title="Transfiere: vectores en el mar">
Un capitán navega 30 km al este y luego 40 km al norte. Usando vectores, calcula su desplazamiento resultante y el rumbo (ángulo) respecto al norte. ¿Cómo cambiaría si hubiera una corriente que empuja 10 km al sur?
</Transfer>

---

## Descomposición en componentes

## Descomposición: de magnitud y ángulo a componentes

```aeterna-formula
title="Descomposición de un vector"
formula="v_x = v \\cos \\theta, \\quad v_y = v \\sin \\theta"
variables={[{"symbol":"v","name":"Magnitud del vector","unit":"u"},{"symbol":"θ","name":"Ángulo con el eje x","unit":"grados"},{"symbol":"vx","name":"Componente horizontal","unit":"u"},{"symbol":"vy","name":"Componente vertical","unit":"u"}]}
note="La descomposición es la clave para trabajar con vectores en 2D: separa el movimiento en ejes independientes."
```

La descomposición es especialmente útil en física porque los movimientos en x e y son independientes (como viste en el tiro parabólico).

> **🔑 Concepto clave: Independencia de ejes**
> Descomponer un vector en componentes perpendiculares permite tratar cada eje por separado. Esta es la base del análisis de fuerzas, del tiro parabólico y de la descomposición de la gravedad en planos inclinados.


<Connect title="De los vectores al tiro parabólico" sourceConcept="Descomposición vectorial" targetConcept="Cinemática">
Descomponer una velocidad inicial en componentes horizontal y vertical es exactamente lo que necesitas para analizar un tiro parabólico: el movimiento x es uniforme y el y es acelerado, independientes entre sí. La descomposición vectorial que aprendes aquí es la herramienta que usarás en cinemática 2D.
</Connect>

---

## Producto escalar y vectorial

## Producto escalar

El producto escalar de dos vectores:

$$ \vec{A} \cdot \vec{B} = |A||B| \cos \theta $$

Da un número. Si son perpendiculares (θ = 90°), el producto es cero. Si son paralelos, es el producto de sus magnitudes.

```aeterna-formula
title="Producto escalar"
formula="\\vec{A} \\cdot \\vec{B} = |A||B| \\cos \\theta"
variables={[{"symbol":"A·B","name":"Producto escalar","unit":"u²"},{"symbol":"|A|,|B|","name":"Magnitudes","unit":"u"},{"symbol":"θ","name":"Ángulo entre vectores","unit":"grados"}]}
note="El producto escalar es máximo cuando son paralelos y cero cuando son perpendiculares."
```

**El producto vectorial:**

$$ \vec{A} \times \vec{B} = |A||B| \sin \theta \, \hat{n} $$

Donde n̂ es el vector unitario perpendicular al plano (regla de la mano derecha). El resultado es un vector cuya magnitud es el área del paralelogramo que forman A y B.

> **🔑 Concepto clave: Trabajo y torque**
> El producto escalar define el trabajo: W = F·d·cosθ —solo la componente de la fuerza en la dirección del movimiento hace trabajo. El producto vectorial define el torque: τ = r×F —mide la eficacia de una fuerza para hacer girar.


### Estima como un físico: la resultante de dos vectores

La **estimación de Fermi** aplicada a vectores: si caminas 3 km al este y 4 km al norte, el desplazamiento es √(9+16) = 5 km —un **modelo simplificado** del problema. Si los vectores forman un ángulo distinto de 90°, el resultado está entre la diferencia y la suma de las magnitudes. Estimar el resultado antes de calcular te da un control de plausibilidad: un resultado de 8 km cuando los vectores suman 7 máximo es un error claro.

</NivelActivo>


<NivelActivo id="frontera">

## Bienvenida: más que un número

## Bienvenida: vectores como entidades geométricas

Los vectores son objetos geométricos con dos operaciones fundamentales: la suma (que satisface la propiedad del paralelogramo) y la multiplicación por un escalar. Estas dos operaciones definen un **espacio vectorial**.

Un espacio vectorial es un conjunto con reglas de suma y multiplicación escalar que cumplen ciertos axiomas (conmutatividad, asociatividad, distributividad...). Los vectores de la física son elementos de un espacio vectorial de dimensión 2, 3 o más.

Esta abstracción permite generalizar el concepto: funciones, matrices y estados cuánticos forman espacios vectoriales. El formalismo vectorial es el puente entre la física clásica y la cuántica.

> **💡 Nota avanzada**
> Los vectores transforman de forma específica al cambiar el sistema de coordenadas (transformaciones ortogonales). Esta propiedad de transformación es lo que distingue a un vector de un simple conjunto de números. En relatividad, los cuadrivectores transforman con las transformaciones de Lorentz.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** los vectores tienen magnitud y dirección. Se descomponen en componentes (vx = v·cosθ, vy = v·sinθ), se suman por componentes, y tienen dos productos: el escalar (A·B = |A||B|cosθ, base del trabajo) y el vectorial (A×B, base del torque). Con ellos, la física describe el mundo en 2D y 3D.
</PedagogicalContentBlock>

---

## ¿Qué es un vector?

## El vector como transformación

En su definición más rigurosa, un vector es un objeto que se transforma de una forma específica al cambiar de sistema de coordenadas. Si rotas el sistema un ángulo α, las nuevas componentes son:

$$ v_x' = v_x \cos \alpha - v_y \sin \alpha $$

$$ v_y' = v_x \sin \alpha + v_y \cos \alpha $$

Esta es una **transformación de rotación**. Los vectores se transforman así; los escalares no cambian; los tensores tienen sus propias reglas.

> **💡 Nota de frontera**
> Esta propiedad de transformación es lo que define un vector de forma invariante. Es la base de la relatividad general, donde el espacio-tiempo curvo requiere generalizar los vectores a vectores tangentes en cada punto (campos vectoriales).

---

## Suma y resta de vectores

## El espacio vectorial de las operaciones

La suma vectorial y la multiplicación escalar cumplen axiomas que definen un espacio vectorial. Propiedades clave:

- Conmutativa: A + B = B + A
- Asociativa: (A+B)+C = A+(B+C)
- Elemento neutro: A + 0 = A
- Distributiva: k(A+B) = kA + kB

Estos axiomas son los mismos que cumplen los números, pero generalizados. Por eso podemos aplicar el álgebra lineal completa a los vectores físicos.

> **💡 Nota avanzada**
> La base canónica {î, ĵ, k̂} genera todo el espacio 3D: cualquier vector se escribe como combinación lineal de estos tres. Elegir otra base (por ejemplo, esférica o cilíndrica) es cambiar de representación, no de vector.


<Transfer targetDomain="Navegación marítima" title="Transfiere: vectores en el mar">
Un capitán navega 30 km al este y luego 40 km al norte. Usando vectores, calcula su desplazamiento resultante y el rumbo (ángulo) respecto al norte. ¿Cómo cambiaría si hubiera una corriente que empuja 10 km al sur?
</Transfer>

---

## Descomposición en componentes

## Componentes y producto punto

La descomposición en una base ortogonal permite calcular el **producto escalar** de forma simple:

$$ \vec{A} \cdot \vec{B} = A_x B_x + A_y B_y + A_z B_z $$

También se define como:

$$ \vec{A} \cdot \vec{B} = |A||B| \cos \theta $$

El producto escalar proyecta un vector sobre otro. Es la base del concepto de **trabajo**: W = F·d·cosθ —solo la componente de la fuerza en la dirección del desplazamiento hace trabajo.

> **💡 Nota avanzada**
> El producto escalar mide la 'cantidad de un vector que apunta en la dirección del otro'. Si son perpendiculares, su producto escalar es cero. Esta propiedad se usa para verificar ortogonalidad y para descomponer vectores en bases generales.


<Connect title="De los vectores al tiro parabólico" sourceConcept="Descomposición vectorial" targetConcept="Cinemática">
Descomponer una velocidad inicial en componentes horizontal y vertical es exactamente lo que necesitas para analizar un tiro parabólico: el movimiento x es uniforme y el y es acelerado, independientes entre sí. La descomposición vectorial que aprendes aquí es la herramienta que usarás en cinemática 2D.
</Connect>

---

## Producto escalar y vectorial

## Productos vectoriales en el espacio

En componentes, el producto vectorial se calcula con el determinante:

$$ \vec{A} \times \vec{B} = \begin{vmatrix} \hat{i} & \hat{j} & \hat{k} \\ A_x & A_y & A_z \\ B_x & B_y & B_z \end{vmatrix} $$

Propiedades:
- Anticonmutativo: A×B = −(B×A)
- Distributivo sobre la suma
- El producto de un vector consigo mismo es cero (A×A = 0)

> **💡 Nota de frontera**
> Los productos vectoriales son la base del electromagnetismo (fuerza de Lorentz F = qv×B) y de la rotación (L = r×p, momento angular). En dimensiones superiores a 3, el producto vectorial no existe como tal —se generaliza con el álgebra exterior.


### Estima como un físico: la resultante de dos vectores

La **estimación de Fermi** aplicada a vectores: si caminas 3 km al este y 4 km al norte, el desplazamiento es √(9+16) = 5 km —un **modelo simplificado** del problema. Si los vectores forman un ángulo distinto de 90°, el resultado está entre la diferencia y la suma de las magnitudes. Estimar el resultado antes de calcular te da un control de plausibilidad: un resultado de 8 km cuando los vectores suman 7 máximo es un error claro.

</NivelActivo>


Los vectores son el lenguaje en el que la física describe el mundo en varias dimensiones. Has aprendido que un vector tiene magnitud y dirección —a diferencia de un escalar—, que se puede descomponer en componentes perpendiculares, que la suma vectorial sigue la regla del paralelogramo, y que hay dos productos con significados profundos: el escalar (trabajo) y el vectorial (torque). Esta herramienta matemática no es un fin en sí misma: es el puente hacia todo lo que viene. Con los vectores puedes describir el tiro parabólico, descomponer fuerzas en planos inclinados, entender el movimiento circular y, más adelante, los campos eléctricos y magnéticos. La física habla el idioma de los vectores: ahora tienes el vocabulario. Cada flecha que veas de aquí en adelante —una fuerza, una velocidad, un campo— será un vector pidiendo ser descompuesto, sumado y entendido.
