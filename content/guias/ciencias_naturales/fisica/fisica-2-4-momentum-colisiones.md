---
title: Momento y Colisiones
description: "Guía completa del momento lineal: qué es, el impulso, la conservación del momento, colisiones elásticas e inelásticas, centro de masa y sistemas de masa variable."
slug: momentum-colisiones
author: Aeterna
category: ciencias_naturales
subcategory: fisica
tags: ["momento lineal", "impulso", "colisiones", "conservación", "centro de masa", "cohetes"]
image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-12
nivel: 2
orden: 4
nivel_titulo: Profundización Mecánica
insignia: Guardián del Momento
tipo: theory
prerequisites: ["leyes-newton-movimiento", "mecanica-clasica"]
breadcrumb: Física / Profundización Mecánica / Momento y Colisiones
---

<AeternaHeroWelcome>
  Un mosquito choca contra el parabrisas de un camión. El camión apenas lo nota... pero el mosquito sí nota al camión. ¿Y si te digo que el momento del mosquito era igual y opuesto al del camión?
</AeternaHeroWelcome>

> **💡 La clave en 10 segundos**
>
> El **momento lineal** es p = mv —masa por velocidad. La segunda ley se escribe F = Δp/Δt: la fuerza cambia el momento. En un sistema aislado, el **momento total se conserva** (tercera ley): en cualquier colisión, lo que un cuerpo gana, otro lo pierde. En colisiones **elásticas** se conserva también la energía cinética; en **inelásticas** se pierde en calor y deformación. Con esta ley, analizas choques, retrocesos, cohetes y explosiones.

**[IMAGEN SUGERIDA: Dos bolas de billar chocando, con flechas de momento. Pie de foto: "El momento se conserva en cada choque."]**

<ProgresionArticulo
  hitos={["Fundamentos", "Profundización", "Frontera"]}
  hitoInicial="Fundamentos"
/>


<NivelActivo id="fundamentos">

## Bienvenida: el mosquito que detuvo un camión

## Bienvenida: el mosquito que detuvo un camión

Un mosquito choca contra el parabrisas de un camión a 100 km/h. El camión no se inmuta. Pero si midieras con precisión, el momento que el mosquito le transfiere al camión es exactamente el que pierde el mosquito.

El **momento lineal** (p) es la cantidad de movimiento:

$$ p = mv $$

Un camión tiene mucho momento por su enorme masa; un mosquito, por su pequeña masa, tiene poco. Por eso el impacto del mosquito apenas afecta al camión.

> **🔑 Concepto clave: Momento**
> El momento lineal p = mv mide la 'cantidad de movimiento'. Es vectorial: tiene dirección. Cuanto más masivo o más rápido un objeto, mayor su momento. Se mide en kg·m/s.

**[IMAGEN SUGERIDA: Un camión y un mosquito, con la comparación de sus momentos. Pie de foto: "El momento del camión es enorme; el del mosquito, diminuto."]**


<PedagogicalContentBlock type="key-insight" title="Fundamentos de Momento y Colisiones">
**La clave:** los **Fundamentos de Momento y Colisiones** se resumen en tres ideas: el momento p = mv es la cantidad de movimiento; el impulso J = F·Δt cambia el momento; y en un sistema aislado el momento total se conserva —elástica (se conserva la energía) o inelástica (solo el momento). El centro de masa reduce sistemas complejos a un punto, y la ecuación del cohete explica la propulsión.
</PedagogicalContentBlock>

---

## ¿Qué es el momento?

## ¿Qué es el momento?

El momento lineal p = mv es el producto de la masa por la velocidad.

Dos objetos pueden tener el mismo momento con masas distintas: una pelota de 2 kg a 10 m/s (p = 20 kg·m/s) y un camión de 2000 kg a 0.01 m/s (p = 20 kg·m/s) tienen el mismo momento.

El momento es **vectorial**: su dirección es la de la velocidad. Detener un objeto con momento requiere aplicar una fuerza durante un tiempo (impulso).

> **Dato que rompe el cerebro**
> Un camión lento puede tener más momento que una bala rápida. El momento no es lo mismo que la energía: un objeto con mucha energía cinética pero poca masa (una bala) puede tener poco momento.

```aeterna-exercise
TITLE: Momento de dos objetos
HINT: p = mv. Compara masa y velocidad.
XP: 30
Un elefante de 3000 kg camina a 2 m/s. Una bala de 0.03 kg vuela a 500 m/s. ¿Cuál tiene más momento?
SOLUTION: Elefante: p = 3000×2 = 6000 kg·m/s. Bala: p = 0.03×500 = 15 kg·m/s. El elefante tiene 400 veces más momento, a pesar de ser mucho más lento.
```

> **🔑 Concepto clave: Masa × velocidad**
> El momento p = mv combina masa y velocidad. Un objeto masivo y lento puede tener el mismo momento que uno ligero y rápido. La dirección del momento es la de la velocidad.

---

## Impulso y fuerza

## Impulso y fuerza

El **impulso** (J) es la fuerza aplicada durante un tiempo:

$$ J = F \cdot \Delta t $$

Y el teorema del impulso-momento:

$$ J = \Delta p $$

La fuerza aplicada durante un tiempo cambia el momento. Lo interesante: para cambiar el mismo momento, puedes usar fuerza grande en poco tiempo o fuerza pequeña en mucho tiempo.

Esto explica por qué los airbags salvan vidas: extienden el tiempo del impacto, reduciendo la fuerza.

> **Dato que rompe el cerebro**
> Al caer, si doblas las rodillas, aumentas el tiempo del impacto y reduces la fuerza. El impulso (cambio de momento) es el mismo, pero la fuerza es menor. Los parachoques, los cascos y los colchones funcionan igual.

**[IMAGEN SUGERIDA: Un airbag desplegado, con la explicación del impulso. Pie de foto: "El airbag extiende el tiempo del impacto."]**


<Transfer targetDomain="Seguridad en accidentes" title="Transfiere: el impulso que salva vidas">
Compara dos coches que chocan contra un muro a la misma velocidad: uno con parachoques rígido y otro con zona de deformación. Usando el teorema del impulso-momento (J = F·Δt = Δp), explica por qué la zona deformable reduce la fuerza sobre los ocupantes. ¿Cómo cambiaría el impulso si el airbag no se desplegara?
</Transfer>

---

## Conservación del momento

## Conservación del momento

En un sistema aislado (sin fuerzas externas), el momento total no cambia. Esta es la **ley de conservación del momento**:

$$ p_{total\, antes} = p_{total\, después} $$

Aplicaciones:
- **Retroceso**: un arma retrocede cuando dispara
- **Colisiones**: la suma de momentos se conserva
- **Explosiones**: los fragmentos se reparten el momento

> **Dato que rompe el cerebro**
> Cuando dos patinadores quietos se empujan mutuamente, ambos salen en direcciones opuestas con momentos iguales y opuestos. El momento total era cero y sigue siendo cero.

```aeterna-exercise
TITLE: Retroceso de un cañón
HINT: El momento antes es cero, así que el momento total después también debe serlo.
XP: 40
Un cañón de 500 kg dispara una bala de 5 kg a 300 m/s. ¿A qué velocidad retrocede el cañón?
SOLUTION: 0 = 500·v_cañón + 5×300 → v_cañón = −1500/500 = −3 m/s. El cañón retrocede a 3 m/s en dirección opuesta.
```

> **🔑 Concepto clave: Ley de conservación**
> En un sistema aislado, el momento total es constante. La tercera ley de Newton garantiza que las fuerzas internas se cancelan: solo las fuerzas externas cambian el momento total.


<PedagogicalContentBlock type="misconception" title="Error común: momento y energía son lo mismo">
Confundir el momento con la energía cinética es un error habitual. Un objeto puede tener mucha energía y poco momento (una bala ligera y rápida), o mucho momento y poca energía (un camión lento). El momento es vectorial (masa × velocidad), la energía escalar (½mv²): se conservan por razones distintas y en colisiones inelásticas el momento se conserva pero la energía se disipa en calor y deformación.
</PedagogicalContentBlock>


<Connect title="De la conservación del momento a la física de partículas" sourceConcept="Conservación del momento" targetConcept="Física de partículas">
En el LHC, los físicos reconstruyen partículas invisibles usando la conservación del momento: el momento que 'falta' en el detector revela qué se escapó. La misma ley que explica el retroceso de un cañón es la herramienta para descubrir el bosón de Higgs.
</Connect>

---

## Tipos de colisiones

## Tipos de colisiones

Hay dos tipos principales de colisiones:

**Elásticas**: se conserva el momento Y la energía cinética. Las bolas de billar ideales. Los cuerpos rebotan sin deformarse.

**Inelásticas**: se conserva el momento pero se pierde energía cinética (en calor, sonido, deformación). Un coche que choca y se deforma.

En una colisión **perfectamente inelástica**, los cuerpos quedan pegados y se mueven juntos.

> **Dato que rompe el cerebro**
> Dos bolas de masa igual en colisión elástica frontal intercambian velocidades: la primera se detiene y la segunda sale con la velocidad de la primera. Es lo que ves en el péndulo de Newton.

**[IMAGEN SUGERIDA: El péndulo de Newton, con las bolas intercambiando momento. Pie de foto: "En colisiones elásticas, el momento y la energía se conservan."]**

```graph-lab
TITLE: Momento en una colisión elástica
DESC: Dos bolas de igual masa intercambian velocidades. Visualiza la conservación del momento.
X_LABEL: Tiempo (s)
Y_LABEL: Momento (kg·m/s)
QUESTION: Antes del choque la bola A tiene p = 6 kg·m/s y B está en reposo. Tras el choque elástico con masas iguales, ¿cuál es el momento de A?
XP: 50
POINT: 0 | 6 | Momento de A antes
POINT: 1 | 0 | Momento de A después
POINT: 0 | 0 | Momento de B antes
POINT: 1 | 6 | Momento de B después
OPTION_CORRECT: 0 | En masas iguales y colisión elástica, las velocidades se intercambian: A queda en reposo (p = 0) y B sale con el momento de A.
OPTION_WRONG: 6 | Eso sería si no hubiera chocado; la colisión elástica transfiere el momento.
OPTION_WRONG: 3 | El momento se transfiere completo, no a medias.
```

---

## Centro de masa

## Centro de masa

El **centro de masa** es el punto donde se concentra toda la masa de un sistema, como si fuera un único objeto.

- Una pelota: centro de masa en su centro
- Un martillo: cerca del extremo pesado
- Dos patinadores: en el punto medio ponderado por masa

El movimiento del centro de masa sigue las leyes de Newton como si toda la masa estuviera ahí: las fuerzas internas no pueden moverlo.

> **Dato que rompe el cerebro**
> Si un bailarín gira con los brazos abiertos y los cierra, gira más rápido. Su centro de masa no cambia, pero la distribución de masa sí. El centro de masa de un objeto lanzado al aire sigue una parábola perfecta, aunque el objeto gire.

**[IMAGEN SUGERIDA: Un martillo lanzado al aire, con su centro de masa siguiendo una parábola. Pie de foto: "El centro de masa sigue una parábola."]**

---

## Sistemas de masa variable

## Sistemas de masa variable

Algunos sistemas cambian de masa mientras se mueven: un cohete que quema combustible, una manguera que expulsa agua, un tanque que pierde agua.

El momento del sistema no se conserva si la masa sale o entra, PERO el momento del sistema más lo expulsado sí se conserva.

La propulsión de cohetes funciona así: el cohete expulsa gas hacia atrás, y el gas empuja el cohete hacia adelante (tercera ley).

> **Dato que rompe el cerebro**
> Un cohete funciona mejor en el vacío que en la atmósfera: no necesita aire para empujar. Expulsa gas hacia atrás y el gas lo empuja hacia adelante, sin importar dónde esté. La conservación del momento es su motor.

**[IMAGEN SUGERIDA: Un cohete despegando, con la expulsión de gas hacia abajo. Pie de foto: "El cohete empuja el gas; el gas empuja el cohete."]**

</NivelActivo>


<NivelActivo id="profundizacion">

## Bienvenida: el mosquito que detuvo un camión

## Bienvenida: la conservación que gobierna los choques

El momento lineal p = mv es una de las cantidades más fundamentales de la física. Su conservación se deduce directamente de la tercera ley de Newton:

En una colisión, los cuerpos intercambian fuerzas iguales y opuestas. El cambio de momento de cada uno es igual y opuesto, así que el **momento total no cambia**:

$$ m_1\vec{v}_1 + m_2\vec{v}_2 = \text{constante} $$

Esta ley es universal: vale para bolas de billar, moléculas, planetas y partículas subatómicas. De hecho, se cumple incluso donde la tercera ley de Newton falla (en la fuerza de Lorentz), porque el momento se transfiere a los campos.

> **Dato que rompe el cerebro**
> Cuando disparas un arma, el retroceso que sientes es la conservación del momento: la bala sale hacia adelante con el mismo momento que el arma y tu mano reciben hacia atrás. El momento total antes y después es cero.


<PedagogicalContentBlock type="key-insight" title="Fundamentos de Momento y Colisiones">
**La clave:** los **Fundamentos de Momento y Colisiones** se resumen en tres ideas: el momento p = mv es la cantidad de movimiento; el impulso J = F·Δt cambia el momento; y en un sistema aislado el momento total se conserva —elástica (se conserva la energía) o inelástica (solo el momento). El centro de masa reduce sistemas complejos a un punto, y la ecuación del cohete explica la propulsión.
</PedagogicalContentBlock>

---

## ¿Qué es el momento?

## El momento como cantidad vectorial

El momento es un vector:

$$ \vec{p} = m\vec{v} $$

Sus componentes:

$$ p_x = mv_x, \quad p_y = mv_y, \quad p_z = mv_z $$

La conservación del momento se aplica **por componentes**: el momento x se conserva independientemente del momento y. Esto es crucial en colisiones en 2D (billar, partículas).

> **Dato que rompe el cerebro**
> En una colisión en 2D, la componente x del momento total se conserva por separado de la componente y. Por eso el análisis de choques en el billar se descompone en dos ecuaciones independientes.

---

## Impulso y fuerza

## El teorema impulso-momento

```aeterna-formula
title="Teorema del impulso-momento"
formula="J = F \\Delta t = \\Delta p"
variables={[{"symbol":"J","name":"Impulso","unit":"N·s"},{"symbol":"F","name":"Fuerza","unit":"N"},{"symbol":"Δt","name":"Tiempo de contacto","unit":"s"},{"symbol":"Δp","name":"Cambio de momento","unit":"kg·m/s"}]}
note="La fuerza aplicada durante un tiempo produce un cambio de momento. Extender el tiempo reduce la fuerza para el mismo impulso."
```

El área bajo la curva F-t es el impulso. Para fuerzas variables:

$$ J = \int F \, dt $$

Aplicaciones de la seguridad:
- **Airbags y cascos**: extienden Δt, reducen F
- **Parachoques**: deformables, absorben energía
- **Saltadores**: doblan rodillas al aterrizar

> **🔑 Concepto clave: Mismo impulso, distinta fuerza**
> El impulso (cambio de momento) está fijado por la situación. La fuerza depende del tiempo: F = Δp/Δt. Extender el tiempo es la forma de reducir la fuerza en impactos. Es la física detrás de toda la seguridad pasiva.


<Transfer targetDomain="Seguridad en accidentes" title="Transfiere: el impulso que salva vidas">
Compara dos coches que chocan contra un muro a la misma velocidad: uno con parachoques rígido y otro con zona de deformación. Usando el teorema del impulso-momento (J = F·Δt = Δp), explica por qué la zona deformable reduce la fuerza sobre los ocupantes. ¿Cómo cambiaría el impulso si el airbag no se desplegara?
</Transfer>

---

## Conservación del momento

## La conservación como ley universal

La conservación del momento se deduce de la tercera ley. Para dos cuerpos que colisionan:

$$ m_1\vec{v}_{1i} + m_2\vec{v}_{2i} = m_1\vec{v}_{1f} + m_2\vec{v}_{2f} $$

En un sistema aislado, la suma vectorial de momentos es idéntica antes y después.

```aeterna-formula
title="Conservación del momento en 1D"
formula="m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"
variables={[{"symbol":"m1, m2","name":"Masas","unit":"kg"},{"symbol":"v1i, v2i","name":"Velocidades iniciales","unit":"m/s"},{"symbol":"v1f, v2f","name":"Velocidades finales","unit":"m/s"}]}
note="El momento total antes de la colisión es igual al momento total después. Se aplica por componentes."
```

Esta ley es más robusta que las leyes de fuerza: se cumple incluso si no conoces los detalles de la interacción. Es la base del análisis de colisiones, reactores, propulsión y física de partículas.

> **🔑 Concepto clave: No importa el detalle**
> La conservación del momento es tan poderosa porque no requiere conocer los detalles de la interacción. Solo necesitas los momentos antes y después. Por eso es la primera herramienta del análisis de choques.


<PedagogicalContentBlock type="misconception" title="Error común: momento y energía son lo mismo">
Confundir el momento con la energía cinética es un error habitual. Un objeto puede tener mucha energía y poco momento (una bala ligera y rápida), o mucho momento y poca energía (un camión lento). El momento es vectorial (masa × velocidad), la energía escalar (½mv²): se conservan por razones distintas y en colisiones inelásticas el momento se conserva pero la energía se disipa en calor y deformación.
</PedagogicalContentBlock>


<Connect title="De la conservación del momento a la física de partículas" sourceConcept="Conservación del momento" targetConcept="Física de partículas">
En el LHC, los físicos reconstruyen partículas invisibles usando la conservación del momento: el momento que 'falta' en el detector revela qué se escapó. La misma ley que explica el retroceso de un cañón es la herramienta para descubrir el bosón de Higgs.
</Connect>

---

## Tipos de colisiones

## Colisiones elásticas e inelásticas

```parameter-lab
TITLE: Colisión perfectamente inelástica
DESC: Dos cuerpos chocan y quedan pegados. Varía las masas y velocidades.
OUTPUT_LABEL: Velocidad final
OUTPUT_UNIT: m/s
QUESTION: Un cuerpo de 2 kg a 3 m/s choca contra otro de 1 kg en reposo y quedan pegados. ¿Cuál es la velocidad final?
ANSWER: v = (m1v1 + m2v2)/(m1+m2) = (2×3 + 0)/(3) = 2 m/s. El momento se conserva: 6 kg·m/s antes y después. La energía cinética disminuye (se pierde en deformación y calor).
XP: 50
PARAM: m1 | Masa 1 | kg | 1 | 10 | 0.5 | 2
PARAM: v1 | Velocidad 1 | m/s | 0 | 10 | 0.5 | 3
```

**Colisión elástica** (misma masa, 1D): las velocidades se intercambian.

$$ v_{1f} = \frac{m_1-m_2}{m_1+m_2}v_1, \quad v_{2f} = \frac{2m_1}{m_1+m_2}v_1 $$

En colisiones elásticas se conservan ambas cantidades: momento y energía cinética.

> **🔑 Concepto clave: Qué se conserva en cada tipo**
> Elástica: momento Y energía cinética. Inelástica: solo momento (la energía se disipa). Perfectamente inelástica: los cuerpos quedan pegados y se mueven a la velocidad del centro de masa.

```graph-lab
TITLE: Momento en una colisión elástica
DESC: Dos bolas de igual masa intercambian velocidades. Visualiza la conservación del momento.
X_LABEL: Tiempo (s)
Y_LABEL: Momento (kg·m/s)
QUESTION: Antes del choque la bola A tiene p = 6 kg·m/s y B está en reposo. Tras el choque elástico con masas iguales, ¿cuál es el momento de A?
XP: 50
POINT: 0 | 6 | Momento de A antes
POINT: 1 | 0 | Momento de A después
POINT: 0 | 0 | Momento de B antes
POINT: 1 | 6 | Momento de B después
OPTION_CORRECT: 0 | En masas iguales y colisión elástica, las velocidades se intercambian: A queda en reposo (p = 0) y B sale con el momento de A.
OPTION_WRONG: 6 | Eso sería si no hubiera chocado; la colisión elástica transfiere el momento.
OPTION_WRONG: 3 | El momento se transfiere completo, no a medias.
```

---

## Centro de masa

## Calculando el centro de masa

```model-builder
TITLE: El centro de masa
PROBLEM: Dos masas de 1 kg y 3 kg están en x = 0 y x = 4 m. Selecciona las variables relevantes para encontrar el centro de masa y descarta las irrelevantes.
XP: 60
VAR_RELEVANT: Posiciones de las masas | Determinan el centro de masa
VAR_RELEVANT: Masas | Pesan la posición de cada masa
VAR_RELEVANT: Número de masas | Dos masas, dos términos
VAR_IRRELEVANT: Color de las masas | No afecta
VAR_IRRELEVANT: Velocidad inicial | Irrelevante para el CM estático
```

Para un sistema de n partículas:

$$ x_{CM} = \frac{m_1x_1 + m_2x_2 + ...}{m_1 + m_2 + ...} $$

El centro de masa se mueve como si toda la masa estuviera concentrada y todas las fuerzas externas actuaran sobre él:

$$ \vec{a}_{CM} = \frac{\sum \vec{F}_{ext}}{M_{total}} $$

> **🔑 Concepto clave: El CM sigue las fuerzas externas**
> El centro de masa se mueve como si concentrara toda la masa, bajo las fuerzas externas. Las fuerzas internas (acción-reacción) no afectan su movimiento. Es la razón por la que un proyectil que explota en vuelo: el CM sigue la parábola original.

---

## Sistemas de masa variable

## La ecuación del cohete

```aeterna-exercise
TITLE: El cohete y su impulso
HINT: El momento del cohete más el del gas expulsado se conserva.
XP: 40
Un cohete expulsa 100 kg de gas a 2000 m/s. ¿Qué momento transfiere al cohete?
SOLUTION: El gas lleva momento p = 100 × 2000 = 200,000 kg·m/s hacia atrás, así que el cohete gana 200,000 kg·m/s hacia adelante (conservación del momento).
```

La **ecuación del cohete** (Tsiolkovsky):

$$ \Delta v = v_e \ln\left(\frac{m_i}{m_f}\right) $$

Donde ve es la velocidad de escape del gas, mi la masa inicial y mf la final. El cambio de velocidad depende del logaritmo de la relación de masas: necesitas mucha masa de combustible para ganar velocidad.

> **🔑 Concepto clave: Expulsar masa para acelerar**
> Un cohete acelera expulsando masa hacia atrás. El momento total (cohete + gas) se conserva. La velocidad final depende logarítmicamente de la relación de masas: el combustible domina la masa del cohete.

</NivelActivo>


<NivelActivo id="frontera">

## Bienvenida: el mosquito que detuvo un camión

## Bienvenida: el momento como invariante

El momento lineal es un ejemplo de una cantidad conservada ligada a una simetría: el **teorema de Noether** dice que a cada simetría del sistema le corresponde una ley de conservación. La conservación del momento es consecuencia de la simetría de **traslación espacial** —las leyes de la física son las mismas en cualquier punto del espacio.

Esta conexión entre simetría y conservación es uno de los principios más profundos de la física. Se repite: la conservación de la energía proviene de la simetría temporal, y la del momento angular de la simetría rotacional.

> **💡 Nota de frontera**
> En mecánica cuántica y relatividad, el momento se generaliza (operadores, cuadrivectores), pero su conservación persiste. En el colisionador de partículas, los físicos reconstruyen partículas invisibles justamente usando la conservación del momento: si el momento 'falta', algo se escapó.


<PedagogicalContentBlock type="key-insight" title="Fundamentos de Momento y Colisiones">
**La clave:** los **Fundamentos de Momento y Colisiones** se resumen en tres ideas: el momento p = mv es la cantidad de movimiento; el impulso J = F·Δt cambia el momento; y en un sistema aislado el momento total se conserva —elástica (se conserva la energía) o inelástica (solo el momento). El centro de masa reduce sistemas complejos a un punto, y la ecuación del cohete explica la propulsión.
</PedagogicalContentBlock>

---

## ¿Qué es el momento?

## Momento y segunda ley

Newton formuló su segunda ley originalmente en términos de momento:

$$ F = \frac{d\vec{p}}{dt} $$

La fuerza es la tasa de cambio del momento. Esta formulación es más general que F = ma:

- Si la masa es constante, F = ma (se recupera la forma clásica)
- Si la masa cambia (cohete), F = ma no basta: hay que usar dp/dt
- En relatividad, el momento se generaliza y esta ley persiste

> **💡 Nota de frontera**
> La formulación F = dp/dt es la que sobrevive en la relatividad: el momento relativista p = γmv, donde γ es el factor de Lorentz. A velocidades cercanas a la luz, el momento crece sin límite, lo que hace imposible alcanzar c.

---

## Impulso y fuerza

## Impulso y fuerzas variables

Cuando la fuerza varía (como en un martillazo), el impulso es la integral:

$$ J = \int_{t_1}^{t_2} F(t) \, dt $$

Y el cambio de momento:

$$ \Delta p = \int F(t) \, dt $$

La fuerza media es F_media = J/Δt. En deportes (golpe de béisbol, tiro en fútbol), la fuerza media determina la velocidad de salida de la pelota.

> **💡 Nota avanzada**
> En choques con duración finita, la fuerza instantánea puede ser enorme: golpes, impactos y explosiones producen picos de fuerza muy superiores a la fuerza media. El diseño de materiales y estructuras analiza estos picos.


<Transfer targetDomain="Seguridad en accidentes" title="Transfiere: el impulso que salva vidas">
Compara dos coches que chocan contra un muro a la misma velocidad: uno con parachoques rígido y otro con zona de deformación. Usando el teorema del impulso-momento (J = F·Δt = Δp), explica por qué la zona deformable reduce la fuerza sobre los ocupantes. ¿Cómo cambiaría el impulso si el airbag no se desplegara?
</Transfer>

---

## Conservación del momento

## Conservación y simetría

El teorema de Noether conecta la conservación del momento con la simetría de traslación: si las leyes físicas son las mismas en todos los puntos del espacio (simetría traslacional), el momento se conserva.

$$ \frac{d\vec{p}}{dt} = \vec{F}_{ext} = -\frac{\partial U}{\partial \vec{r}} $$

Si el potencial no depende de la posición (U constante en el espacio), la fuerza es cero y el momento se conserva.

> **💡 Nota de frontera**
> En la mecánica cuántica, la conservación del momento se manifiesta en las ondas de materia: una partícula libre tiene momento definido y su función de onda es una onda plana. El principio de incertidumbre de Heisenberg limita la simultaneidad de posición y momento.


<PedagogicalContentBlock type="misconception" title="Error común: momento y energía son lo mismo">
Confundir el momento con la energía cinética es un error habitual. Un objeto puede tener mucha energía y poco momento (una bala ligera y rápida), o mucho momento y poca energía (un camión lento). El momento es vectorial (masa × velocidad), la energía escalar (½mv²): se conservan por razones distintas y en colisiones inelásticas el momento se conserva pero la energía se disipa en calor y deformación.
</PedagogicalContentBlock>


<Connect title="De la conservación del momento a la física de partículas" sourceConcept="Conservación del momento" targetConcept="Física de partículas">
En el LHC, los físicos reconstruyen partículas invisibles usando la conservación del momento: el momento que 'falta' en el detector revela qué se escapó. La misma ley que explica el retroceso de un cañón es la herramienta para descubrir el bosón de Higgs.
</Connect>

---

## Tipos de colisiones

## Análisis cuantitativo de colisiones

Para resolver una colisión elástica, usas dos ecuaciones:

1. Conservación del momento: m₁v₁i + m₂v₂i = m₁v₁f + m₂v₂f
2. Conservación de la energía cinética: ½m₁v₁i² + ½m₂v₂i² = ½m₁v₁f² + ½m₂v₂f²

De estas dos ecuaciones con dos incógnitas (v₁f, v₂f) se obtienen las fórmulas de la colisión elástica. En el caso especial de masas iguales, las velocidades se intercambian.

En colisiones **inelásticas**, la energía cinética perdida es:

$$ \Delta E = \frac{1}{2}\mu(v_1-v_2)^2 $$

Donde μ = m₁m₂/(m₁+m₂) es la masa reducida.

> **💡 Nota de frontera**
> En física de partículas, las colisiones elásticas revelan estructuras internas: los experimentos de dispersión (como el experimento de Rutherford) usan colisiones para 'ver' el interior del átomo. Cada tipo de colisión —elástica, inelástica, reactiva— da información distinta.

```graph-lab
TITLE: Momento en una colisión elástica
DESC: Dos bolas de igual masa intercambian velocidades. Visualiza la conservación del momento.
X_LABEL: Tiempo (s)
Y_LABEL: Momento (kg·m/s)
QUESTION: Antes del choque la bola A tiene p = 6 kg·m/s y B está en reposo. Tras el choque elástico con masas iguales, ¿cuál es el momento de A?
XP: 50
POINT: 0 | 6 | Momento de A antes
POINT: 1 | 0 | Momento de A después
POINT: 0 | 0 | Momento de B antes
POINT: 1 | 6 | Momento de B después
OPTION_CORRECT: 0 | En masas iguales y colisión elástica, las velocidades se intercambian: A queda en reposo (p = 0) y B sale con el momento de A.
OPTION_WRONG: 6 | Eso sería si no hubiera chocado; la colisión elástica transfiere el momento.
OPTION_WRONG: 3 | El momento se transfiere completo, no a medias.
```

---

## Centro de masa

## Centro de masa de sistemas continuos

Para objetos continuos, la suma se convierte en integral:

$$ \vec{r}_{CM} = \frac{\int \vec{r} \, dm}{M} $$

El centro de masa puede estar fuera del cuerpo (un anillo, una herradura). Es un concepto geométrico: el punto promedio ponderado de la masa.

El **teorema del centro de masa**: el movimiento del CM de un sistema está gobernado solo por las fuerzas externas. Esto simplifica enormemente el análisis de sistemas de múltiples cuerpos.

> **💡 Nota de frontera**
> En mecánica celeste, la Tierra y la Luna orbitan alrededor de su centro de masa común (el baricentro). En física de partículas, el centro de masa de una colisión define el marco de referencia donde el momento total es cero —el marco más útil para analizar las partículas resultantes.

---

## Sistemas de masa variable

## La dinámica de masa variable

La ecuación general para masa variable:

$$ F_{ext} + v_{rel}\frac{dm}{dt} = m\frac{dv}{dt} $$

Donde v_rel es la velocidad relativa de la masa expulsada. Para un cohete sin fuerzas externas:

$$ m\frac{dv}{dt} = v_e\frac{dm}{dt} $$

Integrando se obtiene la ecuación de Tsiolkovsky. Aplicaciones: cohetes, propulsión de motores a reacción, lluvia que cae en un vagón, cintas transportadoras.

> **💡 Nota de frontera**
> Los cohetes de ionización eléctrica expulsan masa muy rápido (velocidad de escape enorme) pero poca cantidad: alta eficiencia, baja aceleración. El diseño de propulsión es un balance entre empuje (Δm/Δt grande) y eficiencia (v_e grande).

</NivelActivo>


El momento lineal es una de las cantidades más poderosas de la física: p = mv, la conservación del momento en sistemas aislados, el teorema del impulso-momento que explica la seguridad pasiva (airbags, cascos, parachoques), y los dos tipos de colisiones —elásticas que conservan energía y momento, inelásticas que solo conservan momento. Has visto también el centro de masa, que reduce sistemas complejos a un punto, y los sistemas de masa variable, que explican los cohetes y la propulsión. La conservación del momento es más que una fórmula: es la manifestación de una simetría profunda del universo, el traslación espacial, ligada por el teorema de Noether. Y su poder es que no requiere conocer los detalles de las interacciones: basta con los momentos antes y después. Esta ley es la que los físicos de partículas usan para descubrir partículas invisibles en el LHC, la que los ingenieros usan para diseñar airbags y la que gobierna el movimiento de los cuerpos celestes. Con la conservación del momento, has añadido una de las herramientas más versátiles de la física —y una pista de que detrás de cada conservación hay una simetría esperando ser descubierta.
