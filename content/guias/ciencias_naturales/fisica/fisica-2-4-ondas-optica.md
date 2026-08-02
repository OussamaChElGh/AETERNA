---
title: "Ondas y Óptica: La Física de la Luz y el Sonido"
description: Descubre qué son las ondas mecánicas y electromagnéticas, cómo se propaga la luz, por qué el cielo es azul y cómo funcionan los espejos, las lentes y los prismas. Guía completa con ejemplos claros.
slug: ondas-y-optica
author: Aeterna
category: ciencias
subcategory: fisica
tags: ["física", "ondas", "óptica", "luz", "sonido", "reflexión", "refracción", "interferencia", "difracción", "efecto Doppler"]
image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-08
nivel: 2
orden: 4
nivel_titulo: El Reino de lo Clásico
---


<NivelActivo id="fundamentos">

## 1. ¿Qué es una onda?

## ¿Qué es una onda?

Lanza una piedra a un estanque. Verás círculos expandiéndose desde el punto de impacto. Los círculos se mueven, pero el agua no viaja con ellos: cada gota de agua sube y baja, y el impulso se transmite de una gota a la siguiente.

Una **onda** es una perturbación que transfiere energía de un punto a otro **sin transferir materia**. Es el "impulso" que viaja, no el medio.

> **🔑 Concepto clave: Onda**
> Una onda transporta energía sin transportar materia. La perturbación avanza, pero las partículas del medio solo oscilan en su lugar.

**[IMAGEN SUGERIDA: Piedra cayendo en un estanque con ondas circulares expandiéndose. Pie de foto: "La onda viaja, el agua se queda."]**


```aeterna-exercise
TITLE: ¿Onda o no?
HINT: Piensa si necesita un medio para propagarse.
XP: 30
¿Cuál de estos fenómenos es una onda electromagnética que puede viajar en el vacío?
SOLUTION: La luz. El sonido, las ondas en el agua y las ondas en una cuerda necesitan un medio material. La luz es una onda electromagnética que se propaga incluso en el vacío del espacio.
```

---

## 2. Tipos de ondas: mecánicas y electromagnéticas

## Dos grandes familias de ondas

Hay dos tipos fundamentales de ondas:

- **Ondas mecánicas**: necesitan un medio para viajar. El sonido es una onda mecánica: no puede viajar en el vacío. Un golpe en la mesa viaja a través de la madera.
- **Ondas electromagnéticas**: no necesitan medio. La luz, la radio, los rayos X viajan por el vacío del espacio.

> **Dato que rompe el cerebro**
> La luz del Sol viaja 150 millones de kilómetros por el vacío del espacio hasta llegar a tu ojo. Si la luz fuera una onda mecánica, necesitaría un medio para propagarse —y no podría llegar a la Tierra.

**[IMAGEN SUGERIDA: Comparación lado a lado: ondas en una cuerda (mecánica) y ondas de luz en el espacio (electromagnética). Pie de foto: "Las mecánicas necesitan medio; las electromagnéticas no."]**

---

## 3. Propiedades fundamentales de las ondas

## Las propiedades de una onda

Toda onda tiene cuatro propiedades fundamentales:

- **Amplitud (A)**: altura de la onda, cuánta energía transporta
- **Longitud de onda (λ)**: distancia entre dos crestas consecutivas
- **Frecuencia (f)**: cuántas ondas pasan por segundo (en hercios, Hz)
- **Velocidad (v)**: rapidez con que avanza la onda

La relación clave es:

$$ v = \lambda \cdot f $$

La velocidad de una onda depende del medio, no de su frecuencia ni amplitud.

> **Dato curioso**
> Cuando subes la música en la radio, la onda no viaja más rápido. Su velocidad es fija. Lo que cambia es la amplitud (más energía) y quizá la frecuencia del sonido que escuchas.

---

## 4. Fenómenos ondulatorios

## Fenómenos ondulatorios

Las ondas tienen comportamientos sorprendentes:

- **Reflexión**: la onda rebota al chocar con una frontera (el eco del sonido, tu reflejo en el espejo)
- **Refracción**: la onda cambia de dirección al pasar a otro medio (la cuchara "rota" en el vaso de agua)
- **Difracción**: la onda se curva al pasar por una abertura (escuchas música a través de una puerta abierta)
- **Interferencia**: dos ondas se combinan, reforzándose o cancelándose

> **Dato que rompe el cerebro**
> Los sonidos graves (baja frecuencia, longitud de onda larga) se difractan más que los agudos. Por eso oyes los bajos de la música del vecino a través de la pared, pero no los agudos.


```parameter-lab
TITLE: Laboratorio de interferencia
DESC: Ajusta la separación entre rendijas y la longitud de onda para ver cómo cambia el patrón de franjas.
OUTPUT_LABEL: Separación de franjas
OUTPUT_UNIT: mm
QUESTION: ¿Qué ocurre con la separación de las franjas si aumentas la longitud de onda de la luz?
ANSWER: Las franjas se separan más. La separación es proporcional a la longitud de onda (Δy = λL/d): al doble de λ, doble de separación.
XP: 50
PARAM: lambda | Longitud de onda | nm | 400 | 700 | 10 | 500
PARAM: d | Separación de rendijas | mm | 0.05 | 0.5 | 0.01 | 0.1
```

---

## 5. Óptica geométrica: espejos y lentes

## Óptica geométrica: la luz como rayos

Cuando la luz viaja en línea recta y sus obstáculos son mucho más grandes que su longitud de onda, podemos tratarla como **rayos**. Esta es la óptica geométrica.

**La ley de reflexión** es sencilla: el ángulo de incidencia es igual al ángulo de reflexión.

**La ley de Snell** describe la refracción:

$$ n_1 \sin \theta_1 = n_2 \sin \theta_2 $$

Donde n es el índice de refracción del medio. Esto explica por qué la cuchara en el vaso de agua se ve "rota".

> **Dato curioso**
> El arcoíris es refracción + reflexión interna: cada gota de lluvia descompone la luz blanca en colores, y la luz se refleja dentro de la gota antes de salir.


```aeterna-formula
title="Ley de Snell"
formula="n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2"
variables={[{"symbol":"n₁","name":"Índice de refracción medio 1","unit":"adimensional"},{"symbol":"θ₁","name":"Ángulo de incidencia","unit":"grados"},{"symbol":"n₂","name":"Índice de refracción medio 2","unit":"adimensional"},{"symbol":"θ₂","name":"Ángulo de refracción","unit":"grados"}]}
note="La luz se acerca a la normal al entrar en un medio más denso y se aleja al salir. Es la base de las lentes y los prismas."
```

```aeterna-exercise
TITLE: Distancia focal de una lente
HINT: Usa 1/f = 1/do + 1/di.
XP: 40
Una lente convergente forma una imagen de un objeto a 30 cm cuando este está a 60 cm. ¿Cuál es la distancia focal?
SOLUTION: 1/f = 1/60 + 1/30 = 1/60 + 2/60 = 3/60 = 1/20 → f = 20 cm.
```

---

## 6. Óptica física: la naturaleza ondulatoria de la luz

## Óptica física: la luz como onda

La óptica geométrica trata la luz como rayos, pero la luz también es una onda. La **óptica física** estudia los fenómenos que solo se explican con la naturaleza ondulatoria: interferencia, difracción y polarización.

El experimento de la doble rendija de Thomas Young en 1801 fue crucial: la luz pasaba por dos rendijas y formaba franjas claras y oscuras —el patrón de interferencia típico de las ondas.

> **Dato que rompe el cerebro**
> La luz es simultáneamente una onda y un conjunto de partículas (fotones). Depende de cómo la mires. Esta dualidad es una de las ideas más extrañas de la física.


```error-hunter
TITLE: La naturaleza de la luz
CONTEXT: Un estudiante afirma: "El experimento de la doble rendija demostró que la luz está hecha de partículas, porque vemos puntos de luz individuales."
XP: 60
STEP_CORRECT: La doble rendija demuestra interferencia | Las franjas claras y oscuras solo se explican si la luz es una onda que interfiere consigo misma.
STEP_CORRECT: La luz llega como fotones individuales | Al detectar fotones uno a uno, cada impacto es un punto. Pero el patrón acumulado es de interferencia ondulatoria.
STEP_ERROR: Por lo tanto la luz es solo partícula | Ignora la evidencia de interferencia y difracción, que son propiedades ondulatorias.
```

---

## 7. El color y el cielo: por qué vemos lo que vemos

## El color y el cielo

¿Por qué el cielo es azul? La luz del Sol es blanca (todos los colores). Al atravesar la atmósfera, los colores de menor longitud de onda (azul, violeta) se dispersan más por las moléculas de aire. El cielo se ve azul porque el azul se dispersa hacia todas partes.

Al atardecer, el Sol está bajo y la luz atraviesa más atmósfera. Los azules se dispersan por completo y quedan los rojos y naranjas: por eso los atardeceres son cálidos.

> **Dato que rompe el cerebro**
> Si estuvieras en la Luna (sin atmósfera), el cielo sería negro a mediodía y el Sol se vería blanco. La atmósfera terrestre es lo que pinta el cielo de azul.

---

## 8. El efecto Doppler: cuando el sonido y la luz se mueven

## El efecto Doppler

¿Has notado cómo cambia el sonido de una ambulancia al pasar? Se oye agudo cuando se acerca y grave cuando se aleja. Eso es el **efecto Doppler**: el cambio de frecuencia percibida cuando la fuente y el observador se mueven.

Cuando la fuente se acerca, las ondas se comprimen (frecuencia mayor, sonido más agudo). Cuando se aleja, se estiran (frecuencia menor, sonido más grave).

> **Dato curioso**
> Los radares de velocidad usan el efecto Doppler: miden el cambio de frecuencia de las ondas que rebotan en tu coche para calcular qué tan rápido vas.

---

## 🧠 Sistema Aeterna: ¿Qué acabas de aprender?

> **Sistema Aeterna, paso 1: La onda viaja, el medio se queda**
> Las ondas transportan energía sin transportar materia. Esa es una lección sobre el conocimiento: las ideas se propagan como ondas, cambiando de medio pero no de esencia. ¿Qué ideas te llegan de lejos y te atraviesan sin moverte?

</NivelActivo>


<NivelActivo id="profundizacion">

## 1. ¿Qué es una onda?

### 1.1 La definición

Una **onda** es una perturbación que transfiere energía de un punto a otro sin transferencia neta de materia. Piensa en un estadio de fútbol cuando los espectadores hacen "la ola": cada persona se levanta y se sienta en su sitio. Nadie corre por las gradas. Pero la perturbación —la ola— sí viaja.

### 1.2 Partes de una onda

| Elemento | Definición | Símbolo |
| :--- | :--- | :--- |
| **Cresta** | Punto más alto de la onda | — |
| **Valle** | Punto más bajo de la onda | — |
| **Amplitud** | Distancia máxima desde la posición de equilibrio hasta la cresta o el valle | A |
| **Longitud de onda** | Distancia entre dos crestas consecutivas | λ (lambda) |
| **Frecuencia** | Número de oscilaciones completas por segundo | f (Hz) |
| **Periodo** | Tiempo que tarda en completarse una oscilación | T (s) |
| **Velocidad de propagación** | Rapidez con la que la perturbación viaja | v (m/s) |

La relación fundamental que une estas magnitudes es:

**v = λ · f**

La velocidad de la onda es igual a su longitud de onda multiplicada por su frecuencia. Esta ecuación es válida para todas las ondas: sonido, luz, ondas sísmicas, olas del mar.

---

```aeterna-exercise
TITLE: ¿Onda o no?
HINT: Piensa si necesita un medio para propagarse.
XP: 30
¿Cuál de estos fenómenos es una onda electromagnética que puede viajar en el vacío?
SOLUTION: La luz. El sonido, las ondas en el agua y las ondas en una cuerda necesitan un medio material. La luz es una onda electromagnética que se propaga incluso en el vacío del espacio.
```

---

## 2. Tipos de ondas: mecánicas y electromagnéticas

### 2.1 Ondas mecánicas

Las **ondas mecánicas** necesitan un medio material para propagarse. No pueden viajar en el vacío. El sonido es la onda mecánica más familiar: cuando hablas, tus cuerdas vocales vibran y comprimen el aire, creando zonas de alta y baja presión que se propagan hasta el oído de tu interlocutor.

**Ejemplos de ondas mecánicas:**

- **Sonido** (aire, agua o sólidos)
- **Olas del mar** (agua)
- **Ondas sísmicas** (corteza terrestre)
- **Ondas en una cuerda** (cuerda tensada)

Las ondas mecánicas pueden ser **longitudinales** (la perturbación vibra en la misma dirección en que viaja la onda, como el sonido) o **transversales** (la perturbación vibra perpendicularmente a la dirección de propagación, como las olas del mar o una cuerda que agitas).

### 2.2 Ondas electromagnéticas

Las **ondas electromagnéticas** no necesitan un medio para propagarse. Pueden viajar en el vacío, y lo hacen a la velocidad de la luz: c ≈ 300.000 km/s.

Como viste en la parada de Electromagnetismo, Maxwell demostró que una onda electromagnética es la oscilación acoplada de un campo eléctrico y otro magnético que se generan mutuamente. No necesitan un "éter" ni ninguna sustancia que las sostenga. Pueden cruzar el vacío del espacio, y de hecho lo hacen: la luz del Sol tarda unos 8 minutos en llegar a la Tierra tras recorrer 150 millones de kilómetros de vacío interestelar.

**Ejemplos de ondas electromagnéticas (en orden creciente de frecuencia):**

- Ondas de radio
- Microondas
- Infrarrojo
- **Luz visible** (la estrecha franja que ven nuestros ojos)
- Ultravioleta
- Rayos X
- Rayos gamma

---

---

## 3. Propiedades fundamentales de las ondas

### 3.1 Velocidad de propagación

La velocidad de una onda depende del medio por el que viaja, no de su amplitud ni de su frecuencia. El sonido viaja más rápido en el agua (1.480 m/s) que en el aire (343 m/s), y más rápido aún en el acero (5.960 m/s). Cuanto más denso y rígido es el medio, más rápido se propaga el sonido.

La luz, en cambio, viaja más despacio en medios materiales que en el vacío. En el agua, la luz se mueve a unos 225.000 km/s, tres cuartas partes de su velocidad en el vacío. Este frenazo es responsable de la refracción.

### 3.2 Energía y amplitud

La energía transportada por una onda depende del cuadrado de la amplitud. En una ola del mar, duplicar la altura de la ola implica multiplicar por cuatro su energía. En el sonido, la intensidad (volumen) depende del cuadrado de la amplitud de la vibración.

---

---

## 4. Fenómenos ondulatorios

### 4.1 Reflexión

La **reflexión** ocurre cuando una onda choca con una frontera y rebota. Es el fenómeno que explica los ecos (reflexión del sonido) y los espejos (reflexión de la luz).

La ley de la reflexión es simple: el **ángulo de incidencia** (θᵢ) es igual al **ángulo de reflexión** (θᵣ), y ambos se miden respecto a la perpendicular (normal) a la superficie.

**θᵢ = θᵣ**

### 4.2 Refracción

La **refracción** es el cambio de dirección que experimenta una onda cuando pasa de un medio a otro. Ocurre porque la velocidad de la onda cambia al cambiar de medio.

La ley de Snell describe matemáticamente este fenómeno:

**n₁ · sen(θ₁) = n₂ · sen(θ₂)**

Donde `n` es el índice de refracción de cada medio (cuánto se "frena" la luz en ese material).

La refracción explica por qué un lápiz parece "romperse" sumergido en un vaso de agua, por qué las piscinas parecen menos profundas de lo que son y cómo funcionan las lentes para enfocar la luz.

**[IMAGEN SUGERIDA: Un diagrama con un rayo de luz atravesando la frontera entre aire y agua. El rayo se desvía hacia la normal al entrar en el agua. Pie de foto: "La refracción ocurre porque la luz viaja más despacio en el agua que en el aire, desviándose hacia la normal."]**

### 4.3 Interferencia

Dos ondas pueden sumarse cuando coinciden en el espacio y el tiempo. Si las crestas coinciden, se refuerzan mutuamente (**interferencia constructiva**). Si una cresta coincide con un valle, se anulan (**interferencia destructiva**).

Este principio, descubierto por Thomas Young en 1801, fue la prueba definitiva de que la luz es una onda. Young hizo pasar luz a través de dos rendijas estrechas y observó en una pantalla un patrón de bandas brillantes y oscuras alternas, el patrón de interferencia característico de las ondas. Si la luz fueran partículas, habría proyectado dos franjas brillantes correspondientes a las dos rendijas. Pero el patrón de múltiples franjas demostraba que las ondas de luz que salían de cada rendija estaban interfiriendo entre sí.

**[IMAGEN SUGERIDA: El experimento de la doble rendija de Young: una fuente de luz, dos rendijas paralelas y una pantalla con bandas brillantes y oscuras alternas. Pie de foto: "El experimento de Young demostró que la luz es una onda: solo las ondas producen patrones de interferencia."]**

### 4.4 Difracción

La **difracción** es la capacidad de las ondas para bordear obstáculos y expandirse al atravesar aberturas. Si la abertura es mucho mayor que la longitud de onda, la difracción es insignificante. Pero si la abertura es comparable a la longitud de onda, la onda se expande como si la rendija fuera una nueva fuente puntual de ondas.

La difracción explica por qué puedes oír a alguien que habla en otra habitación aunque no esté en tu línea de visión directa. Las ondas sonoras, con longitudes de onda de centímetros a metros, difractan fácilmente alrededor de esquinas y muebles. La luz, con longitudes de onda de cientos de nanómetros, difracta mucho menos, por lo que necesitas una rendija muy fina para observar el fenómeno.

---

```parameter-lab
TITLE: Laboratorio de interferencia
DESC: Ajusta la separación entre rendijas y la longitud de onda para ver cómo cambia el patrón de franjas.
OUTPUT_LABEL: Separación de franjas
OUTPUT_UNIT: mm
QUESTION: ¿Qué ocurre con la separación de las franjas si aumentas la longitud de onda de la luz?
ANSWER: Las franjas se separan más. La separación es proporcional a la longitud de onda (Δy = λL/d): al doble de λ, doble de separación.
XP: 50
PARAM: lambda | Longitud de onda | nm | 400 | 700 | 10 | 500
PARAM: d | Separación de rendijas | mm | 0.05 | 0.5 | 0.01 | 0.1
```

---

## 5. Óptica geométrica: espejos y lentes

La óptica geométrica trata la luz como si fueran rayos que viajan en línea recta. Es una aproximación válida cuando las longitudes de onda son mucho menores que los objetos con los que interactúa la luz. Permite entender el funcionamiento de espejos, lentes y todos los instrumentos ópticos clásicos.

### 5.1 Espejos

| Tipo de espejo | Forma | Imagen que produce | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Plano** | Superficie plana | Virtual, del mismo tamaño, simétrica | Espejo de baño |
| **Cóncavo** | Curvado hacia adentro (como una cueva) | Real e invertida (si el objeto está lejos) o virtual y aumentada (si está cerca del foco) | Telescopio reflector, espejo de aumento |
| **Convexo** | Curvado hacia afuera (como un ojo de pez) | Virtual, reducida, campo de visión amplio | Espejos retrovisores de coche |

### 5.2 Lentes

Una lente es un material transparente (generalmente vidrio o plástico) con superficies curvas que refractan la luz. Las lentes concentran o dispersan los rayos luminosos.

| Tipo de lente | Forma | Efecto sobre la luz | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Convergente** | Más gruesa en el centro que en los bordes | Concentra los rayos paralelos en un punto focal | Lupas, microscopios, el cristalino de tu ojo |
| **Divergente** | Más fina en el centro que en los bordes | Dispersa los rayos | Gafas para miopía, mirillas de puerta |

### 5.3 El ojo humano

Tu ojo es un instrumento óptico extraordinario. La córnea y el cristalino actúan como lentes convergentes que proyectan una imagen invertida del mundo sobre la retina. Tu cerebro se encarga de interpretar esa imagen y de enderezarla.

La **miopía** ocurre cuando la imagen se forma antes de la retina (el ojo es demasiado largo o la córnea demasiado curva). Se corrige con lentes divergentes. La **hipermetropía** ocurre cuando la imagen se forma detrás de la retina (el ojo es demasiado corto). Se corrige con lentes convergentes.

---

```aeterna-formula
title="Ley de Snell"
formula="n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2"
variables={[{"symbol":"n₁","name":"Índice de refracción medio 1","unit":"adimensional"},{"symbol":"θ₁","name":"Ángulo de incidencia","unit":"grados"},{"symbol":"n₂","name":"Índice de refracción medio 2","unit":"adimensional"},{"symbol":"θ₂","name":"Ángulo de refracción","unit":"grados"}]}
note="La luz se acerca a la normal al entrar en un medio más denso y se aleja al salir. Es la base de las lentes y los prismas."
```

```aeterna-exercise
TITLE: Distancia focal de una lente
HINT: Usa 1/f = 1/do + 1/di.
XP: 40
Una lente convergente forma una imagen de un objeto a 30 cm cuando este está a 60 cm. ¿Cuál es la distancia focal?
SOLUTION: 1/f = 1/60 + 1/30 = 1/60 + 2/60 = 3/60 = 1/20 → f = 20 cm.
```

---

## 6. Óptica física: la naturaleza ondulatoria de la luz

Mientras la óptica geométrica trata la luz como rayos, la óptica física la trata como ondas y explica los fenómenos que la geometría no puede: interferencia, difracción y polarización.

### 6.1 Polarización

La luz natural vibra en todas las direcciones perpendiculares a su propagación. Un **polarizador** filtra la luz y solo deja pasar las vibraciones en un plano concreto.

Las gafas de sol polarizadas bloquean la luz reflejada horizontalmente (por el agua, la nieve o el asfalto), que es la que produce deslumbramiento. Por eso los pescadores las usan para ver a través de la superficie del agua.

### 6.2 Dispersión de la luz

La **dispersión** es la separación de la luz blanca en sus colores componentes al atravesar un prisma. Ocurre porque cada color (cada frecuencia) se refracta ligeramente distinto: el violeta se desvía más que el rojo.

Newton fue el primero en demostrar esto en 1666, descomponiendo luz solar con un prisma y recomponiéndola con otro. Demostró que la luz blanca no es "pura", sino la suma de todos los colores del arcoíris.

**[IMAGEN SUGERIDA: Un haz de luz blanca atravesando un prisma de vidrio y descomponiéndose en los colores del espectro visible, del rojo al violeta. Pie de foto: "La dispersión revela que la luz blanca es la suma de todos los colores del arcoíris."]**

---

```error-hunter
TITLE: La naturaleza de la luz
CONTEXT: Un estudiante afirma: "El experimento de la doble rendija demostró que la luz está hecha de partículas, porque vemos puntos de luz individuales."
XP: 60
STEP_CORRECT: La doble rendija demuestra interferencia | Las franjas claras y oscuras solo se explican si la luz es una onda que interfiere consigo misma.
STEP_CORRECT: La luz llega como fotones individuales | Al detectar fotones uno a uno, cada impacto es un punto. Pero el patrón acumulado es de interferencia ondulatoria.
STEP_ERROR: Por lo tanto la luz es solo partícula | Ignora la evidencia de interferencia y difracción, que son propiedades ondulatorias.
```

---

## 7. El color y el cielo: por qué vemos lo que vemos

### 7.1 ¿Por qué el cielo es azul?

La luz solar que llega a la Tierra es blanca (suma de todos los colores). Al atravesar la atmósfera, las moléculas de aire dispersan más eficazmente la luz azul (longitud de onda corta) que la roja (longitud de onda larga). Por eso, cuando miras al cielo en cualquier dirección que no sea el Sol, ves esa luz azul dispersada. Es el fenómeno conocido como **dispersión de Rayleigh**.

### 7.2 ¿Por qué el atardecer es rojo?

Al atardecer, la luz solar atraviesa una capa mucho más gruesa de atmósfera para llegar a tus ojos. La luz azul se dispersa tanto que apenas queda. Solo los colores de longitud de onda más larga —rojos, naranjas, amarillos— logran atravesar esa distancia. Por eso los atardeceres parecen incendiarse.

---

---

## 8. El efecto Doppler: cuando el sonido y la luz se mueven

### 8.1 Efecto Doppler para el sonido

¿Has notado cómo el sonido de una ambulancia cambia de tono cuando pasa a tu lado? Cuando la ambulancia se acerca, las ondas sonoras se comprimen, la frecuencia aparente aumenta y el sonido es más agudo. Cuando se aleja, las ondas se estiran, la frecuencia aparente disminuye y el sonido es más grave.

Este es el **efecto Doppler**, y se aplica a todas las ondas, no solo al sonido.

### 8.2 Efecto Doppler para la luz

Cuando una estrella se aleja de la Tierra, sus ondas de luz se estiran y su frecuencia disminuye. Esto desplaza sus líneas espectrales hacia el rojo: es el **corrimiento al rojo cosmológico**. Fue observando este fenómeno como Edwin Hubble descubrió en 1929 que las galaxias se alejan de nosotros, lo que implica que el universo está en expansión.

Cuando una fuente de luz se acerca, sus ondas se comprimen y la frecuencia aumenta, desplazando las líneas espectrales hacia el azul: es el **corrimiento al azul**.

---

---

## 🧠 Sistema Aeterna: ¿Qué acabas de aprender?

> **Paso 1: Formula preguntas, no certezas.**
>
> Newton pensaba que la luz estaba hecha de partículas (corpúsculos). Young demostró que era una onda con su experimento de la doble rendija. ¿Quién tenía razón? Ambos. La luz es partícula y onda, una dualidad que te espera en la Mecánica Cuántica. Las grandes preguntas no tienen respuestas fáciles.
>
> **Paso 2: Crea hipótesis falsables.**
>
> "El efecto Doppler se aplica a la luz". ¿Cómo refutarías esto? Si observaras una galaxia que se aleja y su luz se desplaza al azul en lugar de al rojo, tendrías que revisar la teoría. De hecho, hay una galaxia famosa, Andrómeda, que se acerca a nosotros y muestra corrimiento al azul. La hipótesis no se refuta: se confirma.
>
> **Paso 3: Busca activamente el error.**
>
> El experimento de Young fue ignorado por la comunidad científica durante años porque contradecía la autoridad de Newton. Young persistió, recopiló más evidencia y acabó demostrando que Newton —el mayor genio de la física— estaba equivocado en esto. La ciencia avanza cuando alguien cuestiona a los gigantes.

---

> **❓ Preguntas frecuentes sobre Ondas y Óptica**
>
> **¿Cuál es la diferencia entre ondas mecánicas y electromagnéticas?**
> Las mecánicas necesitan un medio material para propagarse (sonido, olas). Las electromagnéticas pueden viajar en el vacío (luz, radio, rayos X). Las primeras necesitan materia; las segundas son campos eléctricos y magnéticos que se generan mutuamente.
>
> **¿Qué demostró el experimento de Young?**
> Demostró que la luz es una onda, no una partícula, al producir un patrón de interferencia con dos rendijas. Si la luz fueran partículas, solo veríamos dos franjas brillantes, no un patrón de bandas alternas.
>
> **¿Por qué el cielo es azul y el atardecer rojo?**
> La dispersión de Rayleigh hace que la atmósfera disperse más eficazmente la luz azul (longitud de onda corta). De día, ves esa luz azul dispersada. Al atardecer, la luz atraviesa más atmósfera, el azul se dispersa tanto que solo quedan los rojos y naranjas.
>
> **¿Cómo funciona un espejo?**
> La luz se refleja en la superficie pulida del espejo siguiendo la ley de la reflexión: el ángulo de incidencia es igual al ángulo de reflexión. La imagen que ves es virtual (parece estar detrás del espejo), del mismo tamaño y simétrica.
>
> **¿Qué es el efecto Doppler?**
> Es el cambio aparente de frecuencia de una onda cuando la fuente se mueve respecto al observador. En el sonido, explica por qué la sirena de una ambulancia cambia de tono al pasar. En la luz, explica el corrimiento al rojo de las galaxias que se alejan.

---

> **⚠️ Siguiente parada: Relatividad Especial**
>
> Has completado el Nivel 2: El Reino de lo Clásico. Ahora te espera un salto a las fronteras de la realidad. Prepárate para descubrir por qué el tiempo se dilata cuando viajas muy rápido, por qué la velocidad de la luz es un límite cósmico y cómo Einstein nos obligó a abandonar las ideas más arraigadas sobre el espacio y el tiempo. [Sigue la ruta →](#)

---

**📚 Para seguir explorando:** *"QED: The Strange Theory of Light and Matter"* de Richard Feynman es una explicación magistral de la naturaleza cuántica de la luz. Si quieres seguir explorando la óptica desde la perspectiva más brillante y didáctica, Feynman es el guía perfecto. [Consíguelo aquí](enlace-afiliado).

</NivelActivo>


<NivelActivo id="frontera">

## 1. ¿Qué es una onda?

## Ondas: el lenguaje de la física

Las ondas son ubicuas: el sonido, la luz, las ondas sísmicas, las ondas de radio, las ondas gravitacionales. Toda la información que recibimos del universo —excepto la materia que cae en nuestros detectores— llega en forma de ondas.

La descripción matemática de una onda se basa en la **función de onda**:

$$ y(x,t) = A \sin(kx - \omega t) $$

Donde A es la amplitud, k el número de onda y ω la frecuencia angular. Esta función describe cómo se desplaza cada punto del medio.

Las ondas transportan **energía y momento**, pero no materia. La energía de una onda es proporcional al cuadrado de su amplitud: E ∝ A². Por eso un terremoto de amplitud doble libera cuatro veces más energía.

> **💡 Nota avanzada**
> El principio de superposición establece que cuando dos ondas se cruzan, la perturbación resultante es la suma de ambas. Las ondas no "chocan": se superponen y continúan su camino sin alterarse mutuamente.


```aeterna-exercise
TITLE: ¿Onda o no?
HINT: Piensa si necesita un medio para propagarse.
XP: 30
¿Cuál de estos fenómenos es una onda electromagnética que puede viajar en el vacío?
SOLUTION: La luz. El sonido, las ondas en el agua y las ondas en una cuerda necesitan un medio material. La luz es una onda electromagnética que se propaga incluso en el vacío del espacio.
```

---

## 2. Tipos de ondas: mecánicas y electromagnéticas

## Ondas transversales y longitudinales

Además de la clasificación por medio, las ondas se clasifican por la dirección de oscilación:

- **Transversales**: la oscilación es perpendicular a la dirección de propagación (cuerda, ondas en la superficie del agua, luz).
- **Longitudinales**: la oscilación es paralela a la propagación (sonido, ondas de compresión).

Las ondas sísmicas combinan ambas: las ondas P (primarias) son longitudinales y las S (secundarias) transversales. Las S no atraviesan el núcleo líquido de la Tierra —así se descubrió que el núcleo exterior es líquido.

> **💡 Nota de frontera**
> Las ondas gravitacionales, detectadas por LIGO en 2015, son ondas del propio espacio-tiempo. No viajan "por" un medio: el medio es el propio tejido del espacio.

---

## 3. Propiedades fundamentales de las ondas

## La relación de dispersión

La relación v = λ·f es válida cuando la velocidad no depende de la frecuencia. En medios **dispersivos**, cada frecuencia viaja a distinta velocidad, y la onda se deforma al propagarse.

Ejemplos de dispersión:
- La luz blanca se separa en colores al pasar por un prisma porque cada color (frecuencia) viaja a distinta velocidad en el vidrio
- Las ondas de agua: las ondas largas viajan más rápido que las cortas (por eso los tsunamis, de longitud de onda enorme, viajan a cientos de km/h)
- La fibra óptica gestiona la dispersión cromática para que los pulsos de luz no se mezclen

> **💡 Nota avanzada**
> La dispersión es la clave de la espectroscopía: analizando la luz descompuesta de una estrella, sabemos de qué está hecha y a qué velocidad se aleja (corrimiento al rojo).

---

## 4. Fenómenos ondulatorios

## Interferencia y difracción

La **interferencia** ocurre cuando dos ondas coherentes se superponen:

- **Constructiva**: crestas con crestas → amplitud doble
- **Destructiva**: crestas con valles → se cancelan

El experimento de la **doble rendija** de Young (1801) demostró que la luz interfiere, probando su naturaleza ondulatoria. Las franjas claras y oscuras en una pantalla son interferencia constructiva y destructiva.

La **difracción** es la curvatura de las ondas al pasar por aberturas comparables a su longitud de onda. La condición para difracción apreciable es que la abertura sea del orden de λ.

> **💡 Nota de frontera**
> El principio de Huygens describe cada punto de un frente de onda como fuente de nuevas ondas secundarias. Es la base de la óptica física y explica tanto la difracción como la refracción desde un único principio.


```parameter-lab
TITLE: Laboratorio de interferencia
DESC: Ajusta la separación entre rendijas y la longitud de onda para ver cómo cambia el patrón de franjas.
OUTPUT_LABEL: Separación de franjas
OUTPUT_UNIT: mm
QUESTION: ¿Qué ocurre con la separación de las franjas si aumentas la longitud de onda de la luz?
ANSWER: Las franjas se separan más. La separación es proporcional a la longitud de onda (Δy = λL/d): al doble de λ, doble de separación.
XP: 50
PARAM: lambda | Longitud de onda | nm | 400 | 700 | 10 | 500
PARAM: d | Separación de rendijas | mm | 0.05 | 0.5 | 0.01 | 0.1
```

---

## 5. Óptica geométrica: espejos y lentes

## Lentes, espejos y formación de imágenes

La **ecuación de las lentes delgadas** relaciona la distancia al objeto (do), la distancia a la imagen (di) y la distancia focal (f):

$$ \frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i} $$

El **aumento** es:

$$ m = -\frac{d_i}{d_o} $$

Tipos de lentes:
- **Convergentes** (biconvexas): enfocan rayos paralelos en un punto focal. Lupa, cámara, ojo
- **Divergentes** (bicóncavas): separan rayos. Corrector de miopía

> **💡 Nota avanzada**
> El ojo humano es una lente convergente que forma una imagen invertida en la retina. Tu cerebro la voltea. Las gafas corrigen el punto donde se forma la imagen: detrás de la retina (hipermetropía) o delante (miopía).


```aeterna-formula
title="Ley de Snell"
formula="n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2"
variables={[{"symbol":"n₁","name":"Índice de refracción medio 1","unit":"adimensional"},{"symbol":"θ₁","name":"Ángulo de incidencia","unit":"grados"},{"symbol":"n₂","name":"Índice de refracción medio 2","unit":"adimensional"},{"symbol":"θ₂","name":"Ángulo de refracción","unit":"grados"}]}
note="La luz se acerca a la normal al entrar en un medio más denso y se aleja al salir. Es la base de las lentes y los prismas."
```

```aeterna-exercise
TITLE: Distancia focal de una lente
HINT: Usa 1/f = 1/do + 1/di.
XP: 40
Una lente convergente forma una imagen de un objeto a 30 cm cuando este está a 60 cm. ¿Cuál es la distancia focal?
SOLUTION: 1/f = 1/60 + 1/30 = 1/60 + 2/60 = 3/60 = 1/20 → f = 20 cm.
```

---

## 6. Óptica física: la naturaleza ondulatoria de la luz

## La luz: onda y partícula

El debate sobre la naturaleza de la luz duró siglos:

- **Newton** (corpúsculos): la luz son partículas
- **Huygens** (ondas): la luz es una onda
- **Young** (1801): la interferencia demostró ondas
- **Einstein** (1905): el efecto fotoeléctrico demostró fotones

La **dualidad onda-partícula** es la resolución: la luz se comporta como onda en propagación e interferencia, y como partícula en absorción y emisión. Los fotones tienen energía E = hf, donde h es la constante de Planck.

> **💡 Nota de frontera**
> El experimento de la doble rendija con detectores de partículas individuales muestra que los fotones llegan uno a uno, pero forman el patrón de interferencia al acumularse. La naturaleza cuántica de la luz desafía nuestra intuición clásica.


```error-hunter
TITLE: La naturaleza de la luz
CONTEXT: Un estudiante afirma: "El experimento de la doble rendija demostró que la luz está hecha de partículas, porque vemos puntos de luz individuales."
XP: 60
STEP_CORRECT: La doble rendija demuestra interferencia | Las franjas claras y oscuras solo se explican si la luz es una onda que interfiere consigo misma.
STEP_CORRECT: La luz llega como fotones individuales | Al detectar fotones uno a uno, cada impacto es un punto. Pero el patrón acumulado es de interferencia ondulatoria.
STEP_ERROR: Por lo tanto la luz es solo partícula | Ignora la evidencia de interferencia y difracción, que son propiedades ondulatorias.
```

---

## 7. El color y el cielo: por qué vemos lo que vemos

## Dispersión de Rayleigh y percepción del color

La **dispersión de Rayleigh** explica que la intensidad de luz dispersada varía como 1/λ⁴: los azules (λ corta) se dispersan mucho más que los rojos. Por eso el cielo es azul y los atardeceres rojos.

La **percepción del color** es un fenómeno biofísico: el ojo tiene tres tipos de conos (rojo, verde, azul) que responden a distintas frecuencias. El "color" que percibimos no es una propiedad de la luz sino de la interpretación de nuestro cerebro de las frecuencias que llegan a la retina.

> **💡 Nota de frontera**
> Los animales ven "colores" distintos: las abejas ven en ultravioleta (para encontrar néctar), las serpientes en infrarrojo (para ver a sus presas de sangre caliente). Nuestro arcoíris es solo una pequeña ventana del espectro.

---

## 8. El efecto Doppler: cuando el sonido y la luz se mueven

## Doppler para la luz: corrimiento al rojo

El efecto Doppler también afecta a la luz. Cuando una fuente luminosa se aleja, su luz se desplaza hacia el rojo (frecuencia menor, longitud de onda mayor). Cuando se acerca, hacia el azul.

Este **corrimiento al rojo** es la base de la cosmología: las galaxias lejanas se alejan de nosotros (su luz se corre al rojo), lo que reveló la expansión del universo. Edwin Hubble observó que el corrimiento es proporcional a la distancia —la ley de Hubble.

> **💡 Nota de frontera**
> El corrimiento al rojo cosmológico no es exactamente Doppler de velocidad: es la expansión del propio espacio la que estira la luz durante su viaje. La luz de galaxias muy lejanas se corre tanto que se ve infrarroja.

---

## 🧠 Sistema Aeterna: ¿Qué acabas de aprender?

> **Sistema Aeterna, paso 2: La luz es onda y partícula a la vez**
> La dualidad de la luz nos enseña que la realidad no siempre se ajusta a nuestras categorías. A veces un mismo fenómeno tiene dos descripciones válidas que se complementan. ¿En qué áreas de tu vida dos "verdades" coexisten sin anularse?

> **Sistema Aeterna, paso 3: El corrimiento al rojo revela lo que no se ve**
> El efecto Doppler de la luz nos dice que el universo se expande. A veces los pequeños cambios que observamos —un tono, un matiz— revelan grandes movimientos que no vemos directamente. ¿Qué señales sutiles te revelan grandes procesos ocultos?

</NivelActivo>


Las ondas son el idioma universal de la física: transportan energía sin transportar materia, desde el sonido que llega a tu oído hasta la luz que revela el universo. Has aprendido que una onda se describe por su amplitud, longitud de onda, frecuencia y velocidad, unidas por v = λf. Has visto cómo la reflexión, la refracción, la difracción y la interferencia gobiernan el comportamiento de las ondas, y cómo la óptica geométrica trata la luz como rayos mientras la óptica física la trata como ondas. Pero la lección más profunda es la dualidad: la luz es onda y partícula a la vez, un recordatorio de que la realidad no siempre se ajusta a nuestras categorías. Y el corrimiento al rojo nos enseña que, observando las ondas, podemos leer el movimiento del universo entero. Las ondas no solo mueven el mundo: son el mensajero que nos cuenta la historia del cosmos.
