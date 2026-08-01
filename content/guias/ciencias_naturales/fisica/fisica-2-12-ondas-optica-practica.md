---
title: "Ondas y Óptica: Problemas Resueltos"
description: "Taller práctico de ondas y óptica: problemas resueltos de frecuencia y velocidad, reflexión y espejos, refracción y ley de Snell, interferencia y difracción, y efecto Doppler."
slug: ondas-y-optica-practica
author: Aeterna
category: ciencias_naturales
subcategory: fisica
tags: ["ondas", "óptica", "problemas resueltos", "reflexión", "refracción", "ley de Snell", "interferencia", "efecto Doppler", "frecuencia"]
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-12
nivel: 2
orden: 12
nivel_titulo: Profundización Mecánica
insignia: Domador de Ondas
tipo: practice
prerequisites: ["ondas-y-optica", "electromagnetismo"]
breadcrumb: "Física / Profundización Mecánica / Ondas y Óptica: Problemas Resueltos"
---

<AeternaHeroWelcome>
  La teoría de ondas y óptica ya la conoces. Ahora viene lo divertido: usarla para resolver problemas reales.
</AeternaHeroWelcome>

> **💡 La clave en 10 segundos**
>
> Este taller te entrena en las herramientas de las ondas: la relación **v = λ·f** (velocidad, longitud de onda, frecuencia), la **reflexión** (ángulo de incidencia = ángulo de reflexión), la **refracción** con la **ley de Snell** (n₁sinθ₁ = n₂sinθ₂), la **interferencia** (d·sinθ = mλ) y la **difracción**, y el **efecto Doppler** (el cambio de frecuencia por el movimiento de fuente u observador). Cada sección combina problemas resueltos con ejercicios para que practiques.

**[IMAGEN SUGERIDA: Un prisma descomponiendo la luz blanca en el espectro. Pie de foto: "La refracción separa los colores."]**

<ProgresionArticulo
  hitos={["Fundamentos", "Profundización", "Frontera"]}
  hitoInicial="Fundamentos"
/>


<NivelActivo id="fundamentos">

## Bienvenida: el taller de ondas

## Bienvenida: el taller de ondas

Las ondas están en todas partes: el sonido que oyes, la luz que ves, las ondas sísmicas, las del mar. Este taller te da las herramientas para **resolver problemas** con ellas.

Tres herramientas fundamentales:

1. **v = λ·f**: velocidad = longitud de onda × frecuencia
2. **Reflexión**: ángulo de entrada = ángulo de salida
3. **Refracción**: la onda cambia de dirección al cambiar de medio

Con estas tres, resuelves la mayoría de problemas básicos.

> **🔑 Concepto clave: El método**
> Para resolver problemas de ondas: (1) identifica qué tipo de fenómeno es (propagación, reflexión, refracción, interferencia, Doppler), (2) escribe la fórmula correspondiente, (3) sustituye los datos, (4) verifica unidades y plausibilidad.

**[IMAGEN SUGERIDA: Olas en el mar, con la fórmula v = λf superpuesta. Pie de foto: "v = λf conecta las tres variables."]**


<PedagogicalContentBlock type="key-insight" title="Relaciones de Problemas Resueltos">
**Las Relaciones de Problemas Resueltos:** en ondas y óptica todo se conecta con v = λf (velocidad = longitud de onda × frecuencia). La reflexión cumple θi = θr; la refracción sigue la ley de Snell n₁sinθ₁ = n₂sinθ₂; la interferencia sitúa máximos en d·sinθ = mλ; y el efecto Doppler cambia la frecuencia con f' = f(v±vo)/(v∓vs). Identificar cuál relación usar es el primer paso de cada problema.
</PedagogicalContentBlock>

---

## Problemas básicos: frecuencia y velocidad

## Frecuencia, longitud de onda y velocidad

El problema más básico usa la relación fundamental de las ondas:

$$ v = \lambda f $$

Si conoces dos variables, hallas la tercera.

**Ejemplo resuelto:** una onda sonora tiene frecuencia de 440 Hz y la velocidad del sonido es 343 m/s. ¿Cuál es su longitud de onda?

λ = v/f = 343/440 ≈ 0.78 m.

> **Dato curioso**
> La nota la (440 Hz) es el tono de afinación de las orquestas. Su longitud de onda en el aire es de unos 78 cm —una escala humana.

```aeterna-exercise
TITLE: Calcular la longitud de onda
HINT: λ = v/f.
XP: 30
Calcula la longitud de onda del sonar: un barco emite 3000 Hz y el sonido viaja a 1500 m/s en el agua.
SOLUTION: λ = v/f = 1500/3000 = 0.5 m.
```


### Tabla comparativa: qué relación usar

| Fenómeno | Señal | Relación |
|---|---|---|
| Propagación | La onda viaja | v = λf |
| Reflexión | Cambia de dirección en una superficie | θi = θr |
| Refracción | Cambia de medio | n₁sinθ₁ = n₂sinθ₂ |
| Interferencia | Dos fuentes o rendijas | d·sinθ = mλ |
| Doppler | Movimiento fuente/observador | f' = f(v±vo)/(v∓vs) |
| Difracción | La onda bordea un borde | a·sinθ = mλ |


### Estima como un físico: ¿es plausible tu resultado?

La **estimación de orden de magnitud** es tu control de calidad. Si calculas la longitud de onda del sonido audible (20 Hz a 20 kHz): v = 343 m/s, λ entre 343/20000 = 1.7 cm y 343/20 = 17 m. Si tu problema de sonido da λ = 500 m, algo está mal (esa es una onda de radio). Estimar el orden de magnitud antes de calcular te dice si tu resultado es plausible.

---

## Reflexión y refracción

## Reflexión: espejos

La **ley de reflexión**: el ángulo de incidencia es igual al ángulo de reflexión.

$$ \theta_i = \theta_r $$

En un espejo plano, la imagen es virtual, derecha y a la misma distancia detrás del espejo que el objeto delante.

**Ejemplo resuelto:** un rayo incide sobre un espejo a 30° de la normal. Sale reflejado a 30° al otro lado.

> **Dato curioso**
> Los espejos cambian la izquierda y la derecha pero no arriba y abajo. Esto se debe a que invierten el eje perpendicular al espejo, no a un intercambio de lados.

**[IMAGEN SUGERIDA: Un rayo reflejado en un espejo plano, con ángulos iguales. Pie de foto: "θi = θr."]**


### El método de resolución paso a paso

<PedagogicalContentBlock type="process" title="Flujo de resolución de un problema de ondas">
1. **Lee** el enunciado e identifica el fenómeno (propagación, reflexión, refracción, interferencia, Doppler)
2. **Escribe** la relación correspondiente (v = λf, Snell, d·sinθ = mλ, Doppler)
3. **Sustituye** los datos en el sistema de unidades correcto
4. **Calcula** despejando la incógnita
5. **Verifica** la plausibilidad del resultado (magnitud y unidades)
</PedagogicalContentBlock>

---

## Interferencia y difracción

## Interferencia: dos ondas que se suman

Cuando dos ondas se superponen, se suman: esto es la **interferencia**.

- **Constructiva**: crestas con crestas → onda más grande (máximo)
- **Destructiva**: cresta con valle → se cancelan (mínimo)

El experimento de la doble rendija de Young mostró que la luz interfiere —prueba de que es una onda.

> **Dato que rompe el cerebro**
> La interferencia destructiva produce oscuridad: dos luces que se anulan. No es que 'falte' luz: es que las ondas llegan desfasadas y se cancelan mutuamente.

**[IMAGEN SUGERIDA: El patrón de interferencia de doble rendija, con franjas claras y oscuras. Pie de foto: "La luz interfiere: es una onda."]**

---

## El efecto Doppler

## El efecto Doppler

Cuando una ambulancia se acerca, la sirena suena más aguda; cuando se aleja, más grave. Es el **efecto Doppler**: el movimiento de la fuente cambia la frecuencia percibida.

- Fuente se acerca → frecuencia mayor (sonido más agudo)
- Fuente se aleja → frecuencia menor (sonido más grave)

> **Dato que rompe el cerebro**
> La sirena de la ambulancia NO cambia: la fuente emite siempre la misma frecuencia. Lo que cambia es lo que TÚ percibes por el movimiento. Las ondas se comprimen delante y se estiran detrás.

**[IMAGEN SUGERIDA: Una ambulancia con las ondas de sonido comprimidas delante y estiradas detrás. Pie de foto: "El movimiento comprime las ondas."]**


<Connect title="De las ondas al wifi" sourceConcept="Frecuencia y longitud de onda" targetConcept="Tecnología inalámbrica">
La relación v = λf no es abstracta: el wifi usa 2.4 GHz (λ ≈ 12.5 cm) y 5 GHz (λ ≈ 6 cm). Las frecuencias más altas transmiten más datos pero atraviesan peor las paredes. La física de ondas que practicas aquí es la ingeniería de tus comunicaciones diarias.
</Connect>


<Transfer targetDomain="Medicina diagnóstica" title="Transfiere: el ultrasonido">
La ecografía usa el efecto Doppler para medir la velocidad de la sangre en las arterias. Explica: si el eco de los glóbulos rojos vuelve con mayor frecuencia, ¿se acercan o se alejan del sensor? ¿Cómo calcularías la velocidad del flujo sanguíneo con la fórmula de Doppler?
</Transfer>

---

## Experimento práctico: la velocidad del sonido

## Mide la velocidad del sonido en casa

Experimento simple: mide el eco.

1. Ve a un lugar con un muro grande y alejado
2. Date palmadas rítmicas
3. Ajusta el ritmo para que el eco coincida entre palmadas
4. Mide la distancia al muro y el tiempo entre palmadas

v = 2·distancia/tiempo

> **Dato curioso**
> El factor 2: el sonido va al muro y vuelve (ida y vuelta). Medir distancias por eco es el principio del SONAR y de la ecografía.

**[IMAGEN SUGERIDA: Una persona aplaudiendo frente a un muro, con la onda yendo y viniendo. Pie de foto: "El eco mide la distancia."]**

</NivelActivo>


<NivelActivo id="profundizacion">

## Bienvenida: el taller de ondas

## Bienvenida: estrategias de resolución

Cada tipo de problema tiene su estrategia:

- **Propagación**: v = λf. Con dos datos, hallas el tercero.
- **Reflexión**: θi = θr. Geometría simple.
- **Refracción**: n₁sinθ₁ = n₂sinθ₂. Cuidado con el índice.
- **Interferencia**: d·sinθ = mλ. Máximos y mínimos.
- **Doppler**: f' = f(v ± vo)/(v ∓ vs). Signos según el movimiento.

El error más común: usar la fórmula equivocada o los signos equivocados en Doppler.

> **Dato que rompe el cerebro**
> La velocidad del sonido en el aire es ~343 m/s y casi no cambia con la frecuencia: por eso todas las notas viajan juntas. Pero la luz en un prisma SÍ depende de la frecuencia: por eso la luz blanca se separa en colores.


<PedagogicalContentBlock type="key-insight" title="Relaciones de Problemas Resueltos">
**Las Relaciones de Problemas Resueltos:** en ondas y óptica todo se conecta con v = λf (velocidad = longitud de onda × frecuencia). La reflexión cumple θi = θr; la refracción sigue la ley de Snell n₁sinθ₁ = n₂sinθ₂; la interferencia sitúa máximos en d·sinθ = mλ; y el efecto Doppler cambia la frecuencia con f' = f(v±vo)/(v∓vs). Identificar cuál relación usar es el primer paso de cada problema.
</PedagogicalContentBlock>

---

## Problemas básicos: frecuencia y velocidad

## Problemas de propagación

```aeterna-exercise
TITLE: Calcular distancia por el trueno
HINT: La luz llega casi instantáneamente; el sonido tarda. d = v·t.
XP: 40
Calcula la distancia a la tormenta: ves un rayo y oyes el trueno 3 segundos después (sonido ≈ 343 m/s).
SOLUTION: La luz llega en microsegundos (despreciable). El sonido tarda 3 s: d = v·t = 343×3 ≈ 1029 m ≈ 1 km. Regla práctica: cada 3 segundos ≈ 1 km.
```

```aeterna-decision
Badge: Estrategia
Título: Elegir la fórmula
Pregunta: Conoces la frecuencia y la velocidad de una onda. ¿Qué fórmula usas para la longitud de onda?
Nivel: principiante
XP: 30
Botón: Comprobar
Respuesta: λ = v/f. Despejamos λ de v = λf dividiendo por f: λ = v/f. La frecuencia f = 1/T es la inversa del periodo.
```

> **🔑 Concepto clave: El triángulo v-λ-f**
> v = λf relaciona las tres variables. Con dos, obtienes la tercera: λ = v/f, f = v/λ. Es la herramienta más usada en problemas de ondas.


### Tabla comparativa: qué relación usar

| Fenómeno | Señal | Relación |
|---|---|---|
| Propagación | La onda viaja | v = λf |
| Reflexión | Cambia de dirección en una superficie | θi = θr |
| Refracción | Cambia de medio | n₁sinθ₁ = n₂sinθ₂ |
| Interferencia | Dos fuentes o rendijas | d·sinθ = mλ |
| Doppler | Movimiento fuente/observador | f' = f(v±vo)/(v∓vs) |
| Difracción | La onda bordea un borde | a·sinθ = mλ |


### Estima como un físico: ¿es plausible tu resultado?

La **estimación de orden de magnitud** es tu control de calidad. Si calculas la longitud de onda del sonido audible (20 Hz a 20 kHz): v = 343 m/s, λ entre 343/20000 = 1.7 cm y 343/20 = 17 m. Si tu problema de sonido da λ = 500 m, algo está mal (esa es una onda de radio). Estimar el orden de magnitud antes de calcular te dice si tu resultado es plausible.

---

## Reflexión y refracción

## Refracción y la ley de Snell

Cuando la luz pasa de un medio a otro, cambia de dirección. La **ley de Snell**:

$$ n_1 \sin\theta_1 = n_2 \sin\theta_2 $$

Donde n es el índice de refracción (n = c/v).

**Ejemplo resuelto:** la luz pasa del aire (n₁ = 1) al agua (n₂ = 1.33) con ángulo de incidencia 45°.

sinθ₂ = (1×sin45°)/1.33 = 0.707/1.33 = 0.532 → θ₂ ≈ 32°.

> **Dato que rompe el cerebro**
> La luz se desvía hacia la normal al entrar en un medio más denso (agua). Por eso un palo sumergido en agua parece doblado: la luz que viene de la parte sumergida cambia de dirección al salir al aire.

```aeterna-exercise
TITLE: Calcular el ángulo de refracción
HINT: n₁·sinθ₁ = n₂·sinθ₂.
XP: 45
Calcula el ángulo de refracción: un rayo pasa del aire (n = 1) al vidrio (n = 1.5) con ángulo de incidencia 30° (sin 30° = 0.5).
SOLUTION: sinθ₂ = (1×0.5)/1.5 = 0.333 → θ₂ ≈ 19.5°. La luz se acerca a la normal al entrar al vidrio.
```

> **🔑 Concepto clave: La ley de Snell**
> n₁sinθ₁ = n₂sinθ₂. Al pasar a un medio más denso (n mayor), la luz se acerca a la normal. Es la base de lentes, prismas, fibra óptica y del arcoíris.


### El método de resolución paso a paso

<PedagogicalContentBlock type="process" title="Flujo de resolución de un problema de ondas">
1. **Lee** el enunciado e identifica el fenómeno (propagación, reflexión, refracción, interferencia, Doppler)
2. **Escribe** la relación correspondiente (v = λf, Snell, d·sinθ = mλ, Doppler)
3. **Sustituye** los datos en el sistema de unidades correcto
4. **Calcula** despejando la incógnita
5. **Verifica** la plausibilidad del resultado (magnitud y unidades)
</PedagogicalContentBlock>

---

## Interferencia y difracción

## La doble rendija

Para dos rendijas separadas d, los **máximos** de interferencia aparecen en ángulos:

$$ d\sin\theta = m\lambda $$

Donde m = 0, 1, 2... es el orden del máximo.

**Ejemplo resuelto:** rendijas separadas 0.5 mm, luz de 600 nm. ¿Ángulo del primer máximo (m = 1)?

sinθ = λ/d = 600×10⁻⁹/0.5×10⁻³ = 1.2×10⁻³ → θ ≈ 0.07°.

Los ángulos son pequeños: por eso el patrón se ve a cierta distancia.

```error-hunter
TITLE: Interferencia o difracción
CONTEXT: Un estudiante afirma: «La luz de una sola rendija produce el mismo patrón que la de doble rendija, porque la interferencia es interferencia.»
XP: 60
STEP_CORRECT: La doble rendija produce interferencia | Dos fuentes coherentes interfieren constructiva y destructivamente en franjas.
STEP_CORRECT: La rendija simple produce difracción | La luz se dobla al bordear cada borde de la rendija, produciendo franjas por difracción.
STEP_ERROR: Son exactamente el mismo fenómeno | La doble rendija es interferencia entre dos fuentes; la rendija simple es difracción (flexión en bordes). Ambos dan franjas, pero el patrón y la causa difieren.
```

> **🔑 Concepto clave: Máximos de interferencia**
> d·sinθ = mλ. Los máximos ocurren donde la diferencia de caminos es un múltiplo entero de λ. Es la base de los espectrómetros y del análisis de luz.

---

## El efecto Doppler

## La fórmula de Doppler

```aeterna-exercise
TITLE: Calcular la frecuencia percibida
HINT: f' = f·v/(v − vs). Observador quieto, fuente que se acerca.
XP: 45
Calcula la frecuencia percibida: una ambulancia emite a 700 Hz y se acerca a 30 m/s (sonido = 343 m/s).
SOLUTION: f' = f·v/(v − vs) = 700×343/(343−30) = 700×343/313 ≈ 767 Hz. Más aguda al acercarse.
```

La fórmula general:

$$ f' = f\frac{v \pm v_o}{v \mp v_s} $$

- v₀: velocidad del observador (+, hacia la fuente)
- vs: velocidad de la fuente (−, hacia el observador)

Aplicaciones del Doppler:
- **Radar de velocidad**: policía, deportes
- **Ecografía Doppler**: flujo de sangre, latido fetal
- **Astronomía**: el desplazamiento al rojo revela que el universo se expande

> **🔑 Concepto clave: Comprimir y estirar ondas**
> El movimiento de la fuente comprime las ondas delante (frecuencia mayor) y las estira detrás (menor). La fórmula de Doppler cuantifica el cambio con los signos según quien se mueve.


<Connect title="De las ondas al wifi" sourceConcept="Frecuencia y longitud de onda" targetConcept="Tecnología inalámbrica">
La relación v = λf no es abstracta: el wifi usa 2.4 GHz (λ ≈ 12.5 cm) y 5 GHz (λ ≈ 6 cm). Las frecuencias más altas transmiten más datos pero atraviesan peor las paredes. La física de ondas que practicas aquí es la ingeniería de tus comunicaciones diarias.
</Connect>


<Transfer targetDomain="Medicina diagnóstica" title="Transfiere: el ultrasonido">
La ecografía usa el efecto Doppler para medir la velocidad de la sangre en las arterias. Explica: si el eco de los glóbulos rojos vuelve con mayor frecuencia, ¿se acercan o se alejan del sensor? ¿Cómo calcularías la velocidad del flujo sanguíneo con la fórmula de Doppler?
</Transfer>

---

## Experimento práctico: la velocidad del sonido

## Experimento de resonancia

Con un tubo y un diapasón puedes medir la velocidad del sonido por **resonancia**:

- Llena un tubo con agua y sumerge un diapasón vibrando en la boca
- Ajusta la columna de aire hasta que el sonido se amplifique (resonancia)
- En la primera resonancia, la columna de aire es λ/4

v = 4·L·f

**Ejemplo:** con un diapasón de 512 Hz, la primera resonancia ocurre a L ≈ 16.7 cm → v = 4×0.167×512 ≈ 342 m/s.

> **🔑 Concepto clave: Resonancia**
> La resonancia ocurre cuando la frecuencia de la fuente coincide con la natural del sistema (la columna de aire). En la primera resonancia de un tubo cerrado, L = λ/4. Es el principio de los instrumentos de viento.

</NivelActivo>


<NivelActivo id="frontera">

## Bienvenida: el taller de ondas

## Bienvenida: del problema al fenómeno

El reto de los problemas avanzados es identificar el fenómeno antes de aplicar la fórmula. Preguntas guía:

- ¿La onda cambia de medio? → Refracción (Snell)
- ¿Hay dos fuentes o rendijas? → Interferencia
- ¿Hay movimiento relativo? → Doppler
- ¿La onda bordea un obstáculo? → Difracción

Un buen físico clasifica el problema antes de calcular. La mayoría de errores vienen de aplicar una fórmula a un fenómeno equivocado.

> **💡 Nota avanzada**
> Los problemas reales combinan fenómenos: un barco que emite sonido hacia el fondo (reflexión) mientras se mueve (Doppler) requiere descomponer el problema en etapas. Descomponer problemas complejos en sub-problemas es la habilidad central.


<PedagogicalContentBlock type="key-insight" title="Relaciones de Problemas Resueltos">
**Las Relaciones de Problemas Resueltos:** en ondas y óptica todo se conecta con v = λf (velocidad = longitud de onda × frecuencia). La reflexión cumple θi = θr; la refracción sigue la ley de Snell n₁sinθ₁ = n₂sinθ₂; la interferencia sitúa máximos en d·sinθ = mλ; y el efecto Doppler cambia la frecuencia con f' = f(v±vo)/(v∓vs). Identificar cuál relación usar es el primer paso de cada problema.
</PedagogicalContentBlock>

---

## Problemas básicos: frecuencia y velocidad

## Ondas en distintos medios

Cuando una onda cambia de medio, la **frecuencia no cambia** (la fuente la determina), pero la velocidad y la longitud de onda sí.

La luz al pasar del aire (n = 1) al vidrio (n = 1.5):

$$ v_{vidrio} = \frac{c}{n} = \frac{3\times10^8}{1.5} = 2\times10^8 \text{ m/s} $$

La frecuencia se mantiene; la longitud de onda se reduce en el vidrio.

> **💡 Nota avanzada**
> La frecuencia es la única variable que se conserva al cambiar de medio. Es la 'identidad' de la onda. Este principio es la base de cómo los prismas separan colores: la velocidad depende de la frecuencia (dispersión), pero cada color mantiene su frecuencia.


### Tabla comparativa: qué relación usar

| Fenómeno | Señal | Relación |
|---|---|---|
| Propagación | La onda viaja | v = λf |
| Reflexión | Cambia de dirección en una superficie | θi = θr |
| Refracción | Cambia de medio | n₁sinθ₁ = n₂sinθ₂ |
| Interferencia | Dos fuentes o rendijas | d·sinθ = mλ |
| Doppler | Movimiento fuente/observador | f' = f(v±vo)/(v∓vs) |
| Difracción | La onda bordea un borde | a·sinθ = mλ |


### Estima como un físico: ¿es plausible tu resultado?

La **estimación de orden de magnitud** es tu control de calidad. Si calculas la longitud de onda del sonido audible (20 Hz a 20 kHz): v = 343 m/s, λ entre 343/20000 = 1.7 cm y 343/20 = 17 m. Si tu problema de sonido da λ = 500 m, algo está mal (esa es una onda de radio). Estimar el orden de magnitud antes de calcular te dice si tu resultado es plausible.


```aeterna-exercise
TITLE: Calcular la longitud de onda del sonido
HINT: λ = v/f. Usa v = 343 m/s.
XP: 35
Calcula la longitud de onda de un tono grave de 100 Hz (v = 343 m/s).
SOLUTION: λ = 343/100 = 3.43 m. Los tonos graves tienen longitudes de onda grandes —del orden de metros.
```

---

## Reflexión y refracción

## Reflexión total interna

Cuando la luz va de un medio denso a uno menos denso (agua → aire) con ángulo mayor que el **ángulo crítico**, ocurre la **reflexión total interna**: toda la luz se refleja.

El ángulo crítico (cuando θ₂ = 90°):

$$ \sin\theta_c = \frac{n_2}{n_1} $$

Para agua (n = 1.33) al aire: θc ≈ 48.8°.

> **💡 Nota de frontera**
> La reflexión total interna es el principio de la **fibra óptica**: la luz queda atrapada dentro del núcleo reflejándose sin perder energía. Internet y las telecomunicaciones dependen de esta física. Es también el efecto detrás de los brillos de los diamantes.


### El método de resolución paso a paso

<PedagogicalContentBlock type="process" title="Flujo de resolución de un problema de ondas">
1. **Lee** el enunciado e identifica el fenómeno (propagación, reflexión, refracción, interferencia, Doppler)
2. **Escribe** la relación correspondiente (v = λf, Snell, d·sinθ = mλ, Doppler)
3. **Sustituye** los datos en el sistema de unidades correcto
4. **Calcula** despejando la incógnita
5. **Verifica** la plausibilidad del resultado (magnitud y unidades)
</PedagogicalContentBlock>

```aeterna-exercise
TITLE: Calcular el ángulo crítico
HINT: sinθc = n₂/n₁. El diamante tiene n = 2.42.
XP: 50
El diamante (n = 2.42) al aire (n = 1). ¿Cuál es el ángulo crítico?
SOLUTION: sinθc = 1/2.42 = 0.413 → θc ≈ 24°. El ángulo crítico pequeño del diamante produce los brillos espectaculares: la luz queda atrapada reflejándose internamente.
```

---

## Interferencia y difracción

## Difracción y límite de resolución

La **difracción** es la flexión de las ondas al bordear obstáculos o pasar por aberturas. En una rendija de ancho a, los mínimos aparecen en:

$$ a\sin\theta = m\lambda $$

La difracción limita la resolución de los instrumentos ópticos. El **criterio de Rayleigh**: dos puntos son resolubles si su separación angular supera

$$ \theta_{min} = 1.22\frac{\lambda}{D} $$

Donde D es el diámetro del instrumento.

> **💡 Nota de frontera**
> La difracción limita los telescopios: un telescopio mayor resuelve más detalles (menor θ_min). Pero hay un límite absoluto: el límite de difracción. Los microscopios ópticos no pueden ver detalles menores que ~λ/2, por eso se inventaron los microscopios electrónicos (electrones con λ mucho menor).

```aeterna-exercise
TITLE: Calcular el orden del máximo
HINT: d·sinθ = mλ. Despeja m.
XP: 50
Calcula el orden del máximo: rendijas separadas 2 mm, luz de 600 nm, ángulo de 0.017° (sin 0.017° ≈ 3×10⁻⁴).
SOLUTION: m = d·sinθ/λ = 2×10⁻³×3×10⁻⁴/600×10⁻⁹ = 6×10⁻⁷/6×10⁻⁷ = 1. El primer máximo (m = 1).
```

---

## El efecto Doppler

## Doppler en la luz y el universo

El efecto Doppler se aplica a TODAS las ondas, incluida la luz. En astronomía:

- **Desplazamiento al azul**: el objeto se acerca
- **Desplazamiento al rojo**: el objeto se aleja

El **desplazamiento al rojo** de las galaxias lejanas reveló que el universo se expande (ley de Hubble). En general, la fórmula relativista para la luz:

$$ \frac{\lambda'}{\lambda} = \sqrt{\frac{1 + v/c}{1 - v/c}} $$

> **💡 Nota de frontera**
> El desplazamiento al rojo cosmológico no es un Doppler clásico sino el estiramiento de la luz por la expansión del espacio-tiempo. Aun así, la idea del Doppler —movimiento → cambio de frecuencia— es el origen conceptual del descubrimiento de la expansión del universo.


<Connect title="De las ondas al wifi" sourceConcept="Frecuencia y longitud de onda" targetConcept="Tecnología inalámbrica">
La relación v = λf no es abstracta: el wifi usa 2.4 GHz (λ ≈ 12.5 cm) y 5 GHz (λ ≈ 6 cm). Las frecuencias más altas transmiten más datos pero atraviesan peor las paredes. La física de ondas que practicas aquí es la ingeniería de tus comunicaciones diarias.
</Connect>


<Transfer targetDomain="Medicina diagnóstica" title="Transfiere: el ultrasonido">
La ecografía usa el efecto Doppler para medir la velocidad de la sangre en las arterias. Explica: si el eco de los glóbulos rojos vuelve con mayor frecuencia, ¿se acercan o se alejan del sensor? ¿Cómo calcularías la velocidad del flujo sanguíneo con la fórmula de Doppler?
</Transfer>

---

## Experimento práctico: la velocidad del sonido

## Análisis del experimento

Interpretación rigurosa del experimento de resonancia:

1. La primera resonancia confirma L = λ/4
2. La velocidad calculada v = 4Lf debe aproximarse a 343 m/s
3. La temperatura del aire afecta: v ≈ 331 + 0.6T (m/s, T en °C)
4. Errores de medición: incertidumbre en L (regla) y en la posición de resonancia (auditiva)

> **💡 Nota de frontera**
> En física, un experimento 'simple' esconde toda la metodología: variables, errores, modelos y plausibilidad. La velocidad del sonido medida con un tubo y un diapasón es un experimento clásico de laboratorio que combina resonancia, ondas estacionarias y análisis de errores.

</NivelActivo>


Has completado el taller de ondas y óptica. La herramienta fundamental es v = λf, que conecta velocidad, longitud de onda y frecuencia —y que, al cambiar de medio, conserva la frecuencia mientras velocidad y longitud de onda se ajustan. Dominas la reflexión (θi = θr) de los espejos y la refracción de la ley de Snell (n₁sinθ₁ = n₂sinθ₂), con su límite fascinante: la reflexión total interna de la fibra óptica. La interferencia (d·sinθ = mλ) y la difracción te mostraron que la luz es una onda, y el efecto Doppler transformó el sonido en herramienta —del radar a la cosmología. Lo más importante de este taller no son las fórmulas: es el método. Identificar el fenómeno antes de calcular, elegir la fórmula correcta, sustituir con cuidado de unidades y verificar la plausibilidad del resultado. Ese proceso —clasificar, modelar, calcular, comprobar— es lo que separa a quien memoriza fórmulas de quien resuelve problemas. Practica con los ejercicios, haz los experimentos en casa, y las ondas —que están en tu voz, tu vista y tu wifi— empezarán a hablarte en su idioma.
