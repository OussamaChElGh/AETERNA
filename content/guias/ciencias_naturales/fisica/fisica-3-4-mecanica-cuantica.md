---
title: Mecánica Cuántica
description: "Guía completa de la mecánica cuántica: la dualidad onda-partícula, el experimento de la doble rendija, el principio de incertidumbre, la superposición, el entrelazamiento, el efecto túnel y sus aplicaciones."
slug: mecanica-cuantica
author: Anektia
category: ciencias_naturales
subcategory: fisica
tags: ["mecánica cuántica", "dualidad onda-partícula", "principio de incertidumbre", "superposición", "entrelazamiento", "efecto túnel", "doble rendija", "fotones"]
image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-12
nivel: 3
orden: 4
nivel_titulo: Física Moderna
tipo: theory
prerequisites: ["electromagnetismo-avanzado", "mecanica-clasica"]
breadcrumb: Física / Física Moderna / Mecánica Cuántica
---

<AnektiaHeroWelcome>
  A escala atómica, la realidad se comporta de forma que nuestra intuición no puede imaginar: las partículas son ondas, la incertidumbre es fundamental, y el gato puede estar vivo y muerto a la vez.
</AnektiaHeroWelcome>

> **💡 La clave en 10 segundos**
>
> La mecánica cuántica describe el mundo a escala atómica. Sus ideas centrales: la **dualidad onda-partícula** (todo es onda y partícula a la vez), el **principio de incertidumbre** (no puedes conocer posición y momento con precisión simultánea), la **superposición** (los estados se combinan hasta medir), el **entrelazamiento** (partículas correlacionadas sin importar la distancia), y el **efecto túnel** (las partículas atraviesan barreras). Todo esto es contraintuitivo, pero está verificado experimentalmente y es la base de los láseres, los transistores, la resonancia magnética y los futuros ordenadores cuánticos.

**[IMAGEN SUGERIDA: La doble rendija, con electrones formando un patrón de interferencia. Pie de foto: "Un electrón es onda y partícula a la vez."]**

<ProgresionArticulo
  hitos={["Fundamentos", "Profundización", "Frontera"]}
  hitoInicial="Fundamentos"
/>


<NivelActivo id="fundamentos">

## Bienvenida: donde la lógica se despide

## Bienvenida: donde la lógica se despide

Imagina que lanzas una pelota y esta atraviesa la pared. O que está en dos sitios a la vez. En el mundo cuántico, esto es normal.

La **mecánica cuántica** describe el comportamiento de la materia a escalas atómicas y subatómicas. A esa escala, las reglas cambian:

- Las partículas son también ondas
- No puedes medir todo con precisión
- Los objetos pueden estar en varios estados a la vez

Estas ideas son contraintuitivas, pero la física cuántica es la teoría más exitosa de la historia: explica átomos, estrellas, láseres y transistores.

> **🔑 Concepto clave: El mundo a escala atómica**
> A escalas atómicas, la realidad se comporta con reglas propias: dualidad onda-partícula, cuantización de la energía, incertidumbre y superposición. La física clásica (bolas, fuerzas, trayectorias) no se aplica ahí.

**[IMAGEN SUGERIDA: Un átomo con electrones como nubes de probabilidad. Pie de foto: "A escala atómica, las reglas cambian."]**


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** a escala atómica, la energía está cuantizada, la materia es onda y partícula (λ = h/p), los sistemas están en superposición hasta medirse, y la incertidumbre Δx·Δp ≥ ℏ/2 es fundamental. El efecto túnel permite lo 'imposible'. Es la teoría más precisa de la historia y la base de transistores, láseres, RM y ordenadores cuánticos.
</PedagogicalContentBlock>

---

## ¿Qué es la mecánica cuántica?

## ¿Qué es la mecánica cuántica?

La mecánica cuántica estudia la materia a escalas atómicas. Sus dos ideas fundacionales:

1. **La energía está cuantizada**: solo toma valores discretos
2. **La materia tiene propiedades ondulatorias**: electrones, protones y hasta moléculas se comportan como ondas

En el átomo, los electrones no orbitan como planetas: están en 'niveles de energía' definidos.

Cuando un electrón salta entre niveles, emite o absorbe un fotón de energía exacta. Esto explica los espectros de los átomos.

> **Dato que rompe el cerebro**
> Los electrones en un átomo solo pueden tener ciertas energías, como los peldaños de una escalera: no pueden 'estar entre' dos niveles. Esto es la cuantización. De ahí viene el nombre 'cuántica'.

```aeterna-exercise
TITLE: Explicar la cuantización
HINT: Piensa en los peldaños de una escalera.
XP: 30
Explica con tus palabras qué significa que la energía está 'cuantizada' y por qué es revolucionario.
SOLUTION: Significa que la energía solo toma valores discretos (como los peldaños de una escalera), no cualquier valor continuo. Es revolucionario porque la física clásica asumía que la energía podía tomar cualquier valor. La cuantización explica los espectros atómicos, los láseres y los transistores.
```

> **🔑 Concepto clave: Cuantos de energía**
> La energía no es continua: viene en paquetes (cuantos). Un electrón salta entre niveles discretos emitiendo fotones de energía E = hν. Esta idea de Planck y Einstein fundó la mecánica cuántica.

---

## La dualidad onda-partícula

## La dualidad onda-partícula

¿Es la luz una onda o un conjunto de partículas? Ambas cosas.

La **dualidad onda-partícula**: toda la materia y la radiación se comportan como onda en unos experimentos y como partícula en otros.

- La luz: difracta e interfiere (onda) pero viene en fotones (partícula)
- Los electrones: son partículas pero también interfieren (onda)

La **relación de De Broglie**: toda partícula tiene una longitud de onda asociada

$$ \lambda = \frac{h}{mv} $$

> **Dato que rompe el cerebro**
> Un electrón tiene una longitud de onda de onda de ~10⁻¹⁰ m (tamaño atómico): por eso importa en los átomos. Una pelota tiene una onda de ~10⁻³⁵ m: por eso la física clásica funciona en nuestra escala.

**[IMAGEN SUGERIDA: La luz como onda y como fotón a la vez. Pie de foto: "Onda o partícula: depende del experimento."]**


### Estima como un físico: ¿por qué no notamos la cuántica?

La **estimación de orden de magnitud** de la longitud de onda de De Broglie: para una pelota de fútbol (m = 0.4 kg, v = 20 m/s): λ = h/(mv) = 6.6×10⁻³⁴/(0.4×20) ≈ 8×10⁻³⁵ m —la longitud de Planck. Para un electrón (9×10⁻³¹ kg, 10⁶ m/s): λ ≈ 7×10⁻¹⁰ m —tamaño atómico. Esta estimación muestra por qué la cuántica domina en los átomos y es invisible en nuestra escala.

---

## La superposición y el gato de Schrödinger

## La superposición

Antes de medir, un sistema cuántico puede estar en **varios estados a la vez**: es la **superposición**.

Un electrón puede estar 'aquí y allí' simultáneamente. Un fotón puede estar polarizado de dos formas a la vez. Al medir, la superposición colapsa a un estado definido.

La famosa **paradoja del gato de Schrödinger**: un gato en una caja con un mecanismo cuántico está 'vivo y muerto' a la vez hasta que abres la caja.

> **Dato que rompe el cerebro**
> Schrödinger propuso el gato como crítica al absurdo de la superposición aplicada a lo macroscópico. Pero la superposición cuántica es real a escala atómica: es la base de los ordenadores cuánticos (qubits).

**[IMAGEN SUGERIDA: El gato de Schrödinger en la caja, con el símbolo de superposición. Pie de foto: "¿Vivo o muerto? En superposición, ambos."]**

---

## El principio de incertidumbre

## El principio de incertidumbre

**Heisenberg (1927)**: no puedes conocer simultáneamente la posición y el momento de una partícula con precisión absoluta.

$$ \Delta x \cdot \Delta p \geq \frac{\hbar}{2} $$

Si sabes dónde está (Δx pequeño), no sabes cuánto se mueve (Δp grande) y viceversa.

> **Dato que rompe el cerebro**
> La incertidumbre no es un límite de tus instrumentos: es una propiedad fundamental de la naturaleza. No existe experimento que mida ambos con precisión total. La física clásica asumía que sí se podía; la cuántica dice que no.

**[IMAGEN SUGERIDA: Una pelota desenfocada, simbolizando la incertidumbre. Pie de foto: "No puedes conocer todo a la vez."]**

---

## La función de onda y el efecto túnel

## La función de onda y el efecto túnel

El estado de una partícula se describe con la **función de onda** ψ. No te dice dónde está la partícula, sino la **probabilidad** de encontrarla en cada lugar.

La probabilidad es |ψ|²: la partícula puede estar en cualquier punto donde la función de onda sea distinta de cero.

Esto lleva al **efecto túnel**: una partícula puede atravesar una barrera de energía aunque no tenga suficiente energía para superarla clásicamente.

> **Dato que rompe el cerebro**
> La pelota atraviesa la pared porque su función de onda se extiende al otro lado. En la física clásica es imposible; en la cuántica, la probabilidad es pequeña pero real. Por eso el Sol brilla: la fusión nuclear ocurre por efecto túnel.

**[IMAGEN SUGERIDA: Una partícula 'tunelando' a través de una barrera de energía. Pie de foto: "El efecto túnel: atravesar lo imposible."]**

---

## Aplicaciones: del láser al ordenador cuántico

## Aplicaciones de la cuántica

La mecánica cuántica no es solo teoría: está en la tecnología que usas cada día.

- **Láser**: funciona por emisión estimulada, una idea cuántica
- **Transistores**: la base de todos los chips
- **LEDs**: luz por saltos cuánticos de electrones
- **Resonancia magnética (RM)**: espín de los núcleos
- **GPS**: relojes atómicos

Sin mecánica cuántica, no existiría la electrónica moderna.

> **Dato que rompe el cerebro**
> El transistor —el componente más fabricado de la historia (billones por segundo)— funciona por la mecánica cuántica de los semiconductores. Tu móvil es una máquina cuántica que no podría existir sin la física que estudias aquí.

**[IMAGEN SUGERIDA: Un chip de silicio, con electrones como nubes cuánticas. Pie de foto: "El transistor es cuántico."]**


<Connect title="De la cuántica a la tecnología del siglo XX" sourceConcept="Salto cuántico de electrones" targetConcept="Láser y transistores">
Los saltos de electrones entre niveles emiten fotones exactos —el principio del láser (emisión estimulada). Las bandas de energía de los semiconductores gobiernan los transistores. La mecánica cuántica, la teoría más abstracta, es literalmente el hardware de tu móvil.
</Connect>


<Transfer targetDomain="Medicina" title="Transfiere: la resonancia magnética cuántica">
La RM usa el espín de los núcleos de hidrógeno: en un campo magnético, los espines se alinean y absorben fotones de radiofrecuencia (resonancia). Al relajarse, emiten señales que forman imágenes. Investiga cómo la mecánica cuántica del espín produce las imágenes médicas y por qué el hidrógeno (agua del cuerpo) es el objetivo.
</Transfer>

</NivelActivo>


<NivelActivo id="profundizacion">

## Bienvenida: donde la lógica se despide

## Bienvenida: el nacimiento de la cuántica

A finales del siglo XIX, la física clásica enfrentaba crisis:

- **Cuerpo negro**: la radiación de un objeto caliente no encajaba con la teoría
- **Efecto fotoeléctrico**: la luz expulsaba electrones de forma inexplicable
- **Átomos estables**: según Maxwell, los electrones orbitando deberían colapsar

La solución (Planck, Einstein, Bohr, Heisenberg, Schrödinger) fue radical: la energía está **cuantizada** —solo toma valores discretos.

Planck (1900): la energía viene en paquetes (cuantos): E = hν. Einstein (1905): la luz son cuantos (fotones). Así nació la mecánica cuántica.

> **Dato que rompe el cerebro**
> La constante de Planck h ≈ 6.626×10⁻³⁴ J·s es diminuta: por eso no notamos la cuantización en la vida diaria. Pero gobierna todo el mundo atómico.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** a escala atómica, la energía está cuantizada, la materia es onda y partícula (λ = h/p), los sistemas están en superposición hasta medirse, y la incertidumbre Δx·Δp ≥ ℏ/2 es fundamental. El efecto túnel permite lo 'imposible'. Es la teoría más precisa de la historia y la base de transistores, láseres, RM y ordenadores cuánticos.
</PedagogicalContentBlock>

---

## ¿Qué es la mecánica cuántica?

## El modelo cuántico del átomo

El modelo de Bohr (1913) introduce niveles discretos para el hidrógeno:

$$ E_n = -\frac{13.6\text{ eV}}{n^2} $$

Los electrones saltan entre niveles absorbiendo o emitiendo fotones:

$$ E_{fotón} = h\nu = E_i - E_f $$

El modelo de Bohr es correcto para el hidrógeno pero incompleto: la mecánica cuántica moderna (Schrödinger) describe electrones con funciones de onda y orbitales (nubes de probabilidad), no órbitas.

> **🔑 Concepto clave: Los saltos cuánticos**
> Los electrones cambian de nivel de energía emitiendo o absorbiendo fotones de energía exacta. Esto produce los espectros característicos de cada elemento —la 'huella digital' de los átomos usada en astronomía y medicina.

---

## La dualidad onda-partícula

## Onda y partícula a la vez

```aeterna-decision
Badge: Concepto clave
Título: Dualidad
Pregunta: ¿La luz es una onda o una partícula?
Nivel: intermedio
XP: 35
Botón: Comprobar
Respuesta: Ambas, según el experimento. En la interferencia y difracción se comporta como onda; en el efecto fotoeléctrico (expulsar electrones) como partículas (fotones). La dualidad onda-partícula es fundamental: la naturaleza es ambas cosas, no elegimos una. De Broglie extendió la idea a toda la materia: λ = h/(mv).
```

La dualidad se manifiesta en experimentos clave:
- **Efecto fotoeléctrico** (Einstein, 1905): la luz es fotones → Nobel 1921
- **Difracción de electrones** (Davisson-Germer, 1927): los electrones son ondas → Nobel 1937
- **Microscopio electrónico**: usa la onda de los electrones para ver a escala atómica

> **🔑 Concepto clave: Ambas, no una**
> La materia y la radiación son onda Y partícula. El experimento determina cuál aspecto se manifiesta. La longitud de onda de De Broglie λ = h/(mv) conecta ambos mundos.


### Estima como un físico: ¿por qué no notamos la cuántica?

La **estimación de orden de magnitud** de la longitud de onda de De Broglie: para una pelota de fútbol (m = 0.4 kg, v = 20 m/s): λ = h/(mv) = 6.6×10⁻³⁴/(0.4×20) ≈ 8×10⁻³⁵ m —la longitud de Planck. Para un electrón (9×10⁻³¹ kg, 10⁶ m/s): λ ≈ 7×10⁻¹⁰ m —tamaño atómico. Esta estimación muestra por qué la cuántica domina en los átomos y es invisible en nuestra escala.

---

## La superposición y el gato de Schrödinger

## Los qubits y la superposición

```aeterna-decision
Badge: Concepto clave
Título: El gato de Schrödinger
Pregunta: ¿Por qué el gato de Schrödinger está 'vivo y muerto' a la vez? ¿Es real o una paradoja?
Nivel: avanzado
XP: 40
Botón: Comprobar
Respuesta: La paradoja ilustra la superposición cuántica: el estado del sistema (núcleo + gato) es una superposición de 'núcleo decayó + gato muerto' y 'núcleo intacto + gato vivo' hasta que se mide (se abre la caja). A escala atómica la superposición es real; el debate es si se aplica a objetos macroscópicos como un gato (colapso, decoherencia, muchos mundos). Es un problema de interpretación de la mecánica cuántica, no una contradicción interna.
```

La superposición tiene una aplicación práctica: los **qubits** de los ordenadores cuánticos.

- Un bit clásico: 0 o 1
- Un qubit: 0, 1 o superposición de ambos

Con superposición y entrelazamiento, un ordenador cuántico procesa información de forma exponencialmente más eficiente en ciertos problemas.

> **🔑 Concepto clave: Estados hasta medir**
> La superposición significa que un sistema cuántico es una combinación de estados hasta que se mide, momento en que colapsa a uno. Los qubits explotan esto para computar en paralelo.

---

## El principio de incertidumbre

## Incertidumbre en la práctica

```aeterna-formula
title="Principio de incertidumbre"
formula="\\Delta x \\cdot \\Delta p \\geq \\frac{\hbar}{2}"
variables={[{"symbol":"Δx","name":"Incertidumbre de posición","unit":"m"},{"symbol":"Δp","name":"Incertidumbre de momento","unit":"kg·m/s"},{"symbol":"ℏ","name":"Constante de Planck reducida","unit":"J·s"}]}
note="La incertidumbre es fundamental: no es limitación instrumental. Cuanto más precisión de posición, menos de momento."
```

También hay incertidumbre energía-tiempo:

$$ \Delta E \cdot \Delta t \geq \frac{\hbar}{2} $$

Esta relación explica fenómenos sorprendentes: las partículas virtuales 'prestan' energía del vacío por tiempos cortísimos.

Consecuencias:
- Los electrones no colapsan al núcleo (la incertidumbre lo impide)
- El tamaño del átomo está fijado por la incertidumbre
- Las partículas virtuales existen temporalmente (interacciones)

> **🔑 Concepto clave: El límite del conocimiento**
> Δx·Δp ≥ ℏ/2 es un límite fundamental de la naturaleza. No es falta de precisión instrumental: es una propiedad cuántica. Determina el tamaño de los átomos y permite las fluctuaciones del vacío.

---

## La función de onda y el efecto túnel

## El efecto túnel en acción

El efecto túnel explica fenómenos esenciales:

1. **La fusión en el Sol**: los protones se repelen (barrera eléctrica) pero tunelan y se fusionan
2. **Microscopio de efecto túnel (STM)**: usa la corriente por túnel para ver átomos
3. **Desintegración radiactiva alfa**: el núcleo emite partículas por túnel
4. **Diodos y transistores**: la corriente por túnel en semiconductores

```aeterna-exercise
TITLE: Explicar el efecto túnel
HINT: La función de onda se extiende más allá de la barrera.
XP: 40
¿Por qué el Sol puede fusionar hidrógeno si los protones se repelen eléctricamente? Relaciónalo con el efecto túnel.
SOLUTION: Los protones se repelen (barrera culombiana), pero su función de onda se extiende a través de la barrera con probabilidad pequeña pero no nula. A la temperatura del Sol (~15 millones K), una fracción de protones tunela la barrera y se fusiona. Sin efecto túnel, el Sol no brillaría.
```

> **🔑 Concepto clave: La probabilidad atraviesa**
> La función de onda ψ da la probabilidad |ψ|² de encontrar la partícula. Aunque la energía clásica no alcanza para superar una barrera, la probabilidad de 'tunelar' es pequeña pero real. El efecto túnel es esencial en el Sol, la radiactividad y la nanotecnología.

---

## Aplicaciones: del láser al ordenador cuántico

## El láser y los estados cuánticos

```parameter-lab
TITLE: Niveles de energía del hidrógeno
DESC: Los electrones solo ocupan niveles discretos. La energía del fotón emitido es la diferencia entre niveles.
OUTPUT_LABEL: Energía del fotón
OUTPUT_UNIT: eV
QUESTION: Un electrón salta del nivel n = 2 (E = −3.4 eV) al n = 1 (E = −13.6 eV). ¿Cuál es la energía del fotón emitido?
ANSWER: E_fotón = E_i − E_f = −3.4 − (−13.6) = 10.2 eV. El fotón tiene exactamente la energía de la diferencia entre niveles.
XP: 50
PARAM: nivel_final | Nivel final (n) | '' | 1 | 5 | 1 | 1
PARAM: nivel_inicial | Nivel inicial (n) | '' | 1 | 5 | 1 | 2
```

Aplicaciones cuánticas en medicina y tecnología:
- **RM**: alinea los espines nucleares en un campo magnético
- **PET**: detecta la aniquilación de positrones
- **Microscopía cuántica**: sensores de espín

> **🔑 Concepto clave: La cuántica es tecnología**
> Los saltos cuánticos de los electrones producen los fotones de los láseres y LEDs. Los semiconductores funcionan por bandas de energía cuántica. La RM usa el espín. La cuántica está en toda la tecnología moderna.


<Connect title="De la cuántica a la tecnología del siglo XX" sourceConcept="Salto cuántico de electrones" targetConcept="Láser y transistores">
Los saltos de electrones entre niveles emiten fotones exactos —el principio del láser (emisión estimulada). Las bandas de energía de los semiconductores gobiernan los transistores. La mecánica cuántica, la teoría más abstracta, es literalmente el hardware de tu móvil.
</Connect>


<Transfer targetDomain="Medicina" title="Transfiere: la resonancia magnética cuántica">
La RM usa el espín de los núcleos de hidrógeno: en un campo magnético, los espines se alinean y absorben fotones de radiofrecuencia (resonancia). Al relajarse, emiten señales que forman imágenes. Investiga cómo la mecánica cuántica del espín produce las imágenes médicas y por qué el hidrógeno (agua del cuerpo) es el objetivo.
</Transfer>

</NivelActivo>


<NivelActivo id="frontera">

## Bienvenida: donde la lógica se despide

## Bienvenida: la revolución conceptual

La mecánica cuántica no es solo 'física rara': es un cambio en nuestra concepción de la realidad.

- **El estado de un sistema** se describe con una función de onda ψ
- **La medida** colapsa la función de onda a un estado definido
- **La probabilidad**: no sabes dónde está el electrón, sino su distribución de probabilidad
- **La incertidumbre es fundamental**, no un límite instrumental

Esta revolución conceptual sigue abierta: el significado de la función de onda (interpretaciones de Copenhague, muchos mundos, variables ocultas) se debate desde hace un siglo.

> **💡 Nota avanzada**
> La mecánica cuántica es el ejemplo de que la física describe lo que podemos predecir, no lo que 'es'. Su éxito predictivo (precisión de 12 dígitos en la QED) es el mayor de la historia, aunque el 'significado' siga en debate. La naturaleza, a escala atómica, es probabilística.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** a escala atómica, la energía está cuantizada, la materia es onda y partícula (λ = h/p), los sistemas están en superposición hasta medirse, y la incertidumbre Δx·Δp ≥ ℏ/2 es fundamental. El efecto túnel permite lo 'imposible'. Es la teoría más precisa de la historia y la base de transistores, láseres, RM y ordenadores cuánticos.
</PedagogicalContentBlock>

---

## ¿Qué es la mecánica cuántica?

## Del modelo de Bohr a la función de onda

El modelo de Bohr es la primera versión cuántica; la mecánica cuántica moderna (Schrödinger, Heisenberg, 1925-26) es completa:

- El estado del sistema: función de onda ψ
- Su evolución: ecuación de Schrödinger
- Los observables: operadores
- Los resultados: valores propios

$$ i\hbar\frac{\partial\psi}{\partial t} = \hat{H}\psi $$

La función de onda no es una partícula en un punto: es una distribución de probabilidad. El electrón 'está' en todas partes con cierta probabilidad hasta que se mide.

> **💡 Nota de frontera**
> La ecuación de Schrödinger no es relativista. Dirac la relativizó (1928), prediciendo la antimateria. La mecánica cuántica relativista y la teoría cuántica de campos (QED) describen el mundo subatómico con precisión asombrosa.

---

## La dualidad onda-partícula

## La onda de materia

La longitud de onda de De Broglie λ = h/(mv) es la clave de la estructura atómica:

- Los electrones en el átomo forman **ondas estacionarias** (solo ciertas ondas 'caben' → niveles discretos)
- La cuantización de los niveles de energía es una consecuencia de la onda de los electrones

```aeterna-formula
title="Longitud de onda de De Broglie"
formula="\\lambda = \\frac{h}{mv} = \\frac{h}{p}"
variables={[{"symbol":"λ","name":"Longitud de onda","unit":"m"},{"symbol":"h","name":"Constante de Planck","unit":"J·s"},{"symbol":"m","name":"Masa","unit":"kg"},{"symbol":"v","name":"Velocidad","unit":"m/s"}]}
note="Toda partícula tiene una onda asociada. Para objetos macroscópicos, λ es indetectable; para electrones, es del tamaño atómico."
```

> **💡 Nota de frontera**
> Los microscopios electrónicos usan la onda de De Broglie de los electrones acelerados: con λ ~ picómetros, resuelven estructuras atómicas y moleculares, superando el límite de difracción de la luz. La biología estructural (proteínas, virus) depende de esta física.


### Estima como un físico: ¿por qué no notamos la cuántica?

La **estimación de orden de magnitud** de la longitud de onda de De Broglie: para una pelota de fútbol (m = 0.4 kg, v = 20 m/s): λ = h/(mv) = 6.6×10⁻³⁴/(0.4×20) ≈ 8×10⁻³⁵ m —la longitud de Planck. Para un electrón (9×10⁻³¹ kg, 10⁶ m/s): λ ≈ 7×10⁻¹⁰ m —tamaño atómico. Esta estimación muestra por qué la cuántica domina en los átomos y es invisible en nuestra escala.

---

## La superposición y el gato de Schrödinger

## Superposición y ordenadores cuánticos

Los ordenadores cuánticos explotan superposición y entrelazamiento:

- **Qubits**: superposición de 0 y 1
- **Puertas cuánticas**: transforman los estados
- **Medida**: colapsa al resultado

Algoritmos cuánticos (Shor para factorización, Grover para búsqueda) superan a los clásicos exponencialmente. La criptografía y la simulación de moléculas son sus aplicaciones.

El problema principal: la **decoherencia** —la superposición se destruye al interactuar con el entorno. Mantener qubits aislados requiere frío extremo (~millikelvin).

> **💡 Nota de frontera**
> Los ordenadores cuánticos actuales (IBM, Google) tienen decenas a cientos de qubits 'ruidosos' (NISQ). Los futuros ordenadores tolerantes a fallos requerirán corrección cuántica de errores, un desafío enorme. Pero la superposición y el entrelazamiento ya están en producción en computación cuántica, sensores y criptografía.

---

## El principio de incertidumbre

## Incertidumbre y estructura de la materia

La incertidumbre explica propiedades fundamentales:

- **Estabilidad del átomo**: si el electrón estuviera en el núcleo (Δx ≈ 0), su momento (Δp) sería enorme y la energía gigantesca. El equilibrio entre incertidumbre y atracción fija el tamaño atómico (~10⁻¹⁰ m).
- **Energía del punto cero**: incluso a temperatura cero, la materia tiene energía (oscilaciones del vacío).
- **Partículas virtuales**: prestadas del vacío por ΔE·Δt ~ ℏ.

> **💡 Nota de frontera**
> El efecto Casimir (fuerzas entre placas por fluctuaciones del vacío) es una consecuencia medible de la incertidumbre. En la cosmología, las fluctuaciones cuánticas del vacío primordial se amplificaron y dieron origen a la estructura del universo (galaxias, cúmulos).

---

## La función de onda y el efecto túnel

## Túnel y nanotecnología

El **microscopio de efecto túnel (STM)** —Nobel 1986— usa el efecto túnel:

- Una punta metálica muy fina se acerca a una superficie
- Los electrones tunelan entre la punta y la muestra
- La corriente por túnel depende exponencialmente de la distancia
- Midiendo la corriente, se mapea la superficie átomo por átomo

El STM permitió escribir átomos (logotipo de IBM) y manipular la materia a escala atómica —el origen de la nanotecnología.

> **💡 Nota de frontera**
> La probabilidad de tunelar cae exponencialmente con el ancho de la barrera. Los transistores modernos (escala nanométrica) tienen fuga por túnel: un límite físico de la miniaturización que obliga a rediseñar la electrónica. La cuántica define tanto las posibilidades como los límites de la tecnología.

---

## Aplicaciones: del láser al ordenador cuántico

## La frontera: computación cuántica

La computación cuántica usa superposición y entrelazamiento:

- **Qubits** (IBM, Google): hasta cientos hoy
- **Supremacía cuántica**: Google (2019) resolvió en segundos un problema que a un clásico le tomaría miles de años
- **Aplicaciones**: criptografía (Shor), simulación de moléculas, optimización

Los retos:
- **Decoherencia**: los qubits pierden superposición
- **Corrección de errores**: necesaria para la escala
- **Frío extremo**: los qubits requieren millikelvin

El futuro: ordenadores cuánticos tolerantes a fallos que revolucionen la simulación, la química y la inteligencia artificial.

> **💡 Nota de frontera**
> La mecánica cuántica y la relatividad general son incompatibles en el régimen extremo (agujeros negros, Big Bang). La gravedad cuántica —cuerdas, lazos— busca unificarlas. Es el problema abierto más profundo de la física, y la computación cuántica es un paso práctico hacia entender la cuántica en profundidad.


<Connect title="De la cuántica a la tecnología del siglo XX" sourceConcept="Salto cuántico de electrones" targetConcept="Láser y transistores">
Los saltos de electrones entre niveles emiten fotones exactos —el principio del láser (emisión estimulada). Las bandas de energía de los semiconductores gobiernan los transistores. La mecánica cuántica, la teoría más abstracta, es literalmente el hardware de tu móvil.
</Connect>


<Transfer targetDomain="Medicina" title="Transfiere: la resonancia magnética cuántica">
La RM usa el espín de los núcleos de hidrógeno: en un campo magnético, los espines se alinean y absorben fotones de radiofrecuencia (resonancia). Al relajarse, emiten señales que forman imágenes. Investiga cómo la mecánica cuántica del espín produce las imágenes médicas y por qué el hidrógeno (agua del cuerpo) es el objetivo.
</Transfer>

</NivelActivo>


La mecánica cuántica describe la realidad a escala atómica, y sus reglas son radicalmente distintas de la física clásica. Has recorrido sus pilares: la cuantización de la energía que fundó la teoría, la dualidad onda-partícula que revela que toda la materia tiene una onda asociada, la superposición que permite a los sistemas estar en varios estados a la vez, el principio de incertidumbre que fija un límite fundamental al conocimiento, la función de onda que gobierna las probabilidades, y el efecto túnel que permite lo 'imposible'. Aunque todo esto contradice la intuición —el gato vivo y muerto, la partícula que atraviesa paredes, la incertidumbre fundamental—, la mecánica cuántica es la teoría más exitosa de la historia: su precisión predictiva es asombrosa, y su tecnología está en tus manos: los transistores de tu móvil, el láser, la resonancia magnética, el GPS. Y su frontera sigue abierta: los ordenadores cuánticos, la física de materiales, y el desafío de reconciliarla con la gravedad. La lección más profunda de la cuántica es que la naturaleza no es como la imaginamos: es como la medimos. En el mundo atómico, la intuición clásica falla, y las matemáticas —no los sentidos— son la guía fiable. Ese es el mayor regalo de la mecánica cuántica: enseñarnos a escuchar lo que el universo dice, aunque no sea lo que esperábamos oír.
