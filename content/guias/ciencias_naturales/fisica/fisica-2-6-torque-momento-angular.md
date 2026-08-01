---
title: Torque y Momento Angular
description: Guía completa del torque, el equilibrio rotacional, el momento de inercia, la conservación del momento angular, la dinámica rotacional y la precesión de los giroscopios.
slug: torque-momento-angular
author: Aeterna
category: ciencias_naturales
subcategory: fisica
tags: ["torque", "momento angular", "momento de inercia", "equilibrio rotacional", "giroscopio", "precesión", "rotación"]
image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-12
nivel: 2
orden: 6
nivel_titulo: Profundización Mecánica
insignia: Maestro del Giro
tipo: theory
prerequisites: ["leyes-newton-movimiento", "momentum-colisiones", "vectores"]
breadcrumb: Física / Profundización Mecánica / Torque y Momento Angular
---

<AeternaHeroWelcome>
  Una patinadora gira con los brazos abiertos y, al cerrarlos, gira muchísimo más rápido. Un trompo se inclina y, en vez de caerse, describe un círculo. Bienvenido a la rotación.
</AeternaHeroWelcome>

> **💡 La clave en 10 segundos**
>
> El **torque** (τ = r × F) es la fuerza que hace girar: depende de la fuerza y de la distancia al eje. En **equilibrio**, la suma de torques es cero. El **momento de inercia** (I = Σmr²) es la 'masa rotacional' —depende de cómo se distribuye la masa. La segunda ley rotacional es τ = Iα. El **momento angular** (L = Iω) se conserva: por eso la patinadora acelera al cerrar los brazos. Y los **giroscopios** precesan porque el torque cambia la dirección del momento angular.

**[IMAGEN SUGERIDA: Una patinadora girando con los brazos cerrados, acelerando su giro. Pie de foto: "Al cerrar los brazos, el momento angular se conserva y gira más rápido."]**

<ProgresionArticulo
  hitos={["Fundamentos", "Profundización", "Frontera"]}
  hitoInicial="Fundamentos"
/>


<NivelActivo id="fundamentos">

## Bienvenida: la física de girar

## Bienvenida: la física de girar

Todo lo que gira —una rueda, un trompo, la Tierra, los electrones— obedece a las mismas leyes que el movimiento en línea recta, pero 'rotadas'.

Hay un paralelismo perfecto entre el movimiento lineal y el rotacional:

| Lineal | Rotacional |
|--------|-----------|
| Fuerza F | Torque τ |
| Masa m | Momento de inercia I |
| Aceleración a | Aceleración angular α |
| Momento p = mv | Momento angular L = Iω |
| F = ma | τ = Iα |

La fuerza que hace girar se llama **torque**. Y la cantidad que se conserva cuando nada externo actúa es el **momento angular**.

> **🔑 Concepto clave: El paralelismo rotacional**
> La rotación tiene su propia 'segunda ley' (τ = Iα) y su propio 'momento' (L = Iω). Lo que la fuerza es al movimiento lineal, el torque lo es a la rotación.

**[IMAGEN SUGERIDA: Un trompo girando. Pie de foto: "La rotación tiene sus propias leyes."]**


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la rotación es la versión 'girada' del movimiento lineal. El torque τ = rF es la fuerza que gira; el momento de inercia I = Σmr² es la masa rotacional; la segunda ley rotacional es τ = Iα; y el momento angular L = Iω se conserva si no hay torque externo —por eso la patinadora acelera al cerrar los brazos y los pulsares giran rapidísimo.
</PedagogicalContentBlock>

---

## ¿Qué es el torque?

## ¿Qué es el torque?

El **torque** es la 'fuerza que hace girar'. Depende de dos cosas: la fuerza y la distancia desde el punto de giro (eje).

$$ \tau = F \cdot r \cdot \sin\theta $$

Donde r es la distancia del eje a la fuerza y θ el ángulo.

Cuanto más lejos del eje apliques la fuerza, más torque. Por eso las llaves de rueda son largas: más brazo, menos esfuerzo.

> **Dato curioso**
> Abrir una puerta: la empujas lejos de las bisagras porque ahí produce más torque. Empujarla cerca de las bisagras requiere mucho más esfuerzo. El torque explica por qué las manijas están lejos del eje.

```aeterna-exercise
TITLE: Torque y brazo de palanca
HINT: τ = F·r·sinθ. Cuanto más lejos del eje, más torque.
XP: 30
¿Por qué es más fácil abrir una puerta empujando el borde (lejos de las bisagras) que cerca de ellas?
SOLUTION: El torque τ = F·r·sinθ depende de la distancia r al eje. En el borde, r es máximo, así que la misma fuerza produce más torque. Cerca de las bisagras, r es pequeño y se necesita mucha más fuerza para el mismo torque.
```

> **🔑 Concepto clave: Brazo de palanca**
> El torque es fuerza × distancia perpendicular al eje (brazo de palanca). Es el análogo rotacional de la fuerza: la 'fuerza que gira'. Su unidad es el newton-metro (N·m).

---

## Equilibrio rotacional

## Equilibrio rotacional

Un objeto está en **equilibrio** cuando no acelera ni gira. Para eso se requieren dos condiciones:

1. La suma de fuerzas es cero: ΣF = 0
2. La suma de torques es cero: Στ = 0

La segunda condición es la clave: aunque las fuerzas se cancelen, los torques pueden no hacerlo.

> **Dato curioso**
> Un balancín está equilibrado cuando los torques se cancelan. Una persona pesada sentada cerca del centro puede equilibrar a una ligera sentada lejos: el producto fuerza × distancia es el mismo.

**[IMAGEN SUGERIDA: Un balancín con dos personas de distinto peso en posiciones que equilibran los torques. Pie de foto: "El equilibrio exige que los torques se cancelen."]**

---

## Momento de inercia

## Momento de inercia

El **momento de inercia** (I) es la 'masa rotacional': mide cómo se distribuye la masa respecto al eje de giro.

Cuanta más masa lejos del eje, mayor momento de inercia, más difícil es girar (o frenar el giro).

> **Dato que rompe el cerebro**
> Dos objetos con la misma masa pueden tener momentos de inercia muy distintos: un aro con toda su masa en el borde tiene mucho más que un disco con la masa repartida. La distribución de la masa es clave.

**[IMAGEN SUGERIDA: Un aro y un disco con la misma masa, mostrando su distinto momento de inercia. Pie de foto: "La distribución de la masa importa."]**


### Estima como un físico: el momento de inercia de una rueda

La **estimación de Fermi** aplicada a la rotación: para estimar el momento de inercia de una rueda de bicicleta (m ≈ 2 kg, R ≈ 0.35 m), modelas la masa concentrada en el borde: I ≈ mR² ≈ 2 × 0.35² ≈ 0.25 kg·m². Un **modelo simplificado** (aro) es 2× mayor que uno de disco (½mR² ≈ 0.12), así que la respuesta real está en ese rango. Estimar el orden de magnitud antes de calcular te da un control de plausibilidad del resultado exacto.

---

## Conservación del momento angular

## Conservación del momento angular

El **momento angular** (L = Iω) se conserva en un sistema aislado: si nada externo ejerce torque, el momento angular no cambia.

Cuando la patinadora cierra los brazos, su momento de inercia I disminuye. Para que L = Iω se conserve, su velocidad angular ω debe aumentar. Por eso gira más rápido.

> **Dato que rompe el cerebro**
> Los bailarines de patinaje, los saltadores de trampolín y los clavadistas usan esta ley: encogen el cuerpo para girar rápido y lo estiran para frenar. Es la conservación del momento angular en acción.

**[IMAGEN SUGERIDA: Una patinadora cerrando los brazos y girando más rápido. Pie de foto: "L = Iω se conserva."]**


<Connect title="De la rotación al electromagnetismo" sourceConcept="Momento angular" targetConcept="Momento angular de las partículas">
El momento angular es universal: los electrones tienen spin (momento angular intrínseco) que estructura la tabla periódica y los espectros atómicos. El acoplamiento espín-órbita es la base de la resonancia magnética nuclear usada en medicina. La rotación clásica que estudias aquí persiste intacta en el mundo cuántico.
</Connect>

---

## Dinámica rotacional

## Dinámica rotacional

La segunda ley rotacional:

$$ \tau = I\alpha $$

El torque neto produce aceleración angular, igual que la fuerza produce aceleración lineal.

Aplicaciones:
- Un motor aplica torque → las ruedas giran
- Frenar una rueda: el torque de fricción reduce su ω
- Un péndulo: el torque de la gravedad produce su oscilación

> **Dato curioso**
> Las ruedas de los coches aceleran por el torque del motor. Más torque en las ruedas significa más aceleración angular y, por tanto, más aceleración lineal del vehículo.

**[IMAGEN SUGERIDA: Una rueda acelerando por el torque del motor. Pie de foto: "τ = Iα gobierna la aceleración de las ruedas."]**

---

## Precesión y giroscopios

## Precesión y giroscopios

Un **giroscopio** es una rueda que gira rápido. Su momento angular lo hace resistente a cambiar de eje: por eso es estable.

Un **trompo** inclinado no se cae de inmediato: su peso produce un torque perpendicular al momento angular, que cambia la dirección de L en vez de derribarlo. Esto es la **precesión**: el eje describe un círculo.

> **Dato que rompe el cerebro**
> Una rueda de bicicleta girando sostenida por un solo lado no cae: el torque de su peso hace precesar el eje en lugar de derribarlo. Es contraintuitivo pero real.

**[IMAGEN SUGERIDA: Un trompo precesando, con su eje describiendo un círculo. Pie de foto: "La precesión: el torque cambia la dirección de L."]**


<Transfer targetDomain="Diseño de bicicletas y motos" title="Transfiere: estabilidad al girar">
Un motorista se inclina hacia dentro al tomar una curva. Analiza los torques: su peso y la fuerza centrífuga crean un torque neto que, al inclinarse, se equilibra. Compara la estabilidad de una bicicleta con ruedas grandes vs pequeñas y cómo la conservación del momento angular mantiene las ruedas girando.
</Transfer>

</NivelActivo>


<NivelActivo id="profundizacion">

## Bienvenida: la física de girar

## Bienvenida: las variables rotacionales

Las variables rotacionales son el análogo angular de las lineales:

- **Desplazamiento angular** θ (radianes)
- **Velocidad angular** ω = dθ/dt (rad/s)
- **Aceleración angular** α = dω/dt (rad/s²)

La relación con las lineales: s = rθ, v = rω, a = rα (en el borde del círculo).

Las ecuaciones cinemáticas rotacionales son análogas a las lineales con θ, ω, α sustituyendo x, v, a:

$$ \omega = \omega_0 + \alpha t $$

$$ \theta = \theta_0 + \omega_0 t + \frac{1}{2}\alpha t^2 $$

> **Dato que rompe el cerebro**
> Los radianes no tienen unidad: son una relación de arcos. Por eso ω = v/r funciona: ambos lados tienen unidades de s⁻¹. Las fórmulas rotacionales son las lineales 'rotadas', y todo el álgebra que aprendiste se transfiere.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la rotación es la versión 'girada' del movimiento lineal. El torque τ = rF es la fuerza que gira; el momento de inercia I = Σmr² es la masa rotacional; la segunda ley rotacional es τ = Iα; y el momento angular L = Iω se conserva si no hay torque externo —por eso la patinadora acelera al cerrar los brazos y los pulsares giran rapidísimo.
</PedagogicalContentBlock>

---

## ¿Qué es el torque?

## El torque como vector

El torque es un vector:

$$ \vec{\tau} = \vec{r} \times \vec{F} $$

Su magnitud: τ = rF·sinθ. Su dirección: perpendicular al plano de r y F (regla de la mano derecha).

El brazo de palanca es la distancia perpendicular desde el eje hasta la línea de acción de la fuerza:

$$ \tau = F \cdot r_\perp $$

Donde r⊥ = r·sinθ.

> **Dato que rompe el cerebro**
> Una fuerza que pasa exactamente por el eje no produce torque (r⊥ = 0). Empujar el centro de una rueda no la hace girar. Solo la componente perpendicular al brazo contribuye al giro.

---

## Equilibrio rotacional

## Las condiciones de equilibrio

```aeterna-decision
Badge: Concepto clave
Título: Equilibrio y torques
Pregunta: Un balancín: una persona de 60 kg a 2 m del pivote y otra de 40 kg a 3 m. ¿Está equilibrado? ¿Se cumple ΣF = 0?
Nivel: intermedio
XP: 35
Botón: Comprobar
Respuesta: Sí está equilibrado: τ₁ = 60×10×2 = 1200 N·m y τ₂ = 40×10×3 = 1200 N·m. Los torques se cancelan (Στ = 0). Las fuerzas (pesos) no se cancelan, pero el pivote ejerce la fuerza normal que equilibra ΣF = 0. El equilibrio exige ambas condiciones.
```

Las dos condiciones de equilibrio estático:

1. ΣF = 0 (traslacional)
2. Στ = 0 (rotacional)

Ambas son independientes: un objeto puede estar en equilibrio de fuerzas pero girar (si los torques no se cancelan), o viceversa.

> **🔑 Concepto clave: Dos condiciones**
> El equilibrio completo exige que la suma de fuerzas Y la suma de torques sean cero. Resolver problemas de equilibrio (grúas, puentes, escaleras) es aplicar estas dos ecuaciones.

---

## Momento de inercia

## Calculando el momento de inercia

```aeterna-formula
title="Momento de inercia"
formula="I = \\sum m_i r_i^2"
variables={[{"symbol":"I","name":"Momento de inercia","unit":"kg·m²"},{"symbol":"mi","name":"Cada masa","unit":"kg"},{"symbol":"ri","name":"Distancia al eje","unit":"m"}]}
note="La masa lejos del eje contribuye más (al cuadrado de la distancia). Por eso un aro (masa en el borde) tiene más inercia rotacional que un disco (masa repartida)."
```

Formas comunes:
- Aro (anillo): I = mR²
- Disco sólido: I = ½mR²
- Varilla (centro): I = ⅓mL² (extremo: 1/12 mL²)
- Esfera sólida: I = ⅖mR²

> **🔑 Concepto clave: Masa al cuadrado de la distancia**
> El momento de inercia I = Σmr²: la masa contribuye proporcionalmente al cuadrado de su distancia al eje. Por eso la distribución de masa domina la resistencia al giro.


### Estima como un físico: el momento de inercia de una rueda

La **estimación de Fermi** aplicada a la rotación: para estimar el momento de inercia de una rueda de bicicleta (m ≈ 2 kg, R ≈ 0.35 m), modelas la masa concentrada en el borde: I ≈ mR² ≈ 2 × 0.35² ≈ 0.25 kg·m². Un **modelo simplificado** (aro) es 2× mayor que uno de disco (½mR² ≈ 0.12), así que la respuesta real está en ese rango. Estimar el orden de magnitud antes de calcular te da un control de plausibilidad del resultado exacto.

---

## Conservación del momento angular

## La patinadora y el clavadista

```parameter-lab
TITLE: Conservación del momento angular
DESC: Una patinadora gira con los brazos abiertos. Al cerrarlos, su momento de inercia disminuye.
OUTPUT_LABEL: Velocidad angular final
OUTPUT_UNIT: rad/s
QUESTION: Una patinadora gira a 2 rad/s con I = 4 kg·m² (brazos abiertos). Al cerrar los brazos, I = 2 kg·m². ¿Cuál es su nueva velocidad angular?
ANSWER: L se conserva: I₁ω₁ = I₂ω₂ → 4×2 = 2×ω₂ → ω₂ = 4 rad/s. Al reducir su inercia a la mitad, su velocidad angular se duplica.
XP: 50
PARAM: I1 | Inercia inicial | kg·m² | 2 | 8 | 0.5 | 4
PARAM: w1 | Velocidad inicial | rad/s | 1 | 5 | 0.5 | 2
```

Aplicaciones de la conservación del momento angular:
- **Patinadora**: cierra brazos → gira más rápido
- **Clavadista**: encoge cuerpo → más giros
- **Tierra**: el sistema Tierra-Luna conserva su momento angular total
- **Estrellas**: cuando colapsan, giran mucho más rápido (pulsares)

> **🔑 Concepto clave: Iω constante**
> En ausencia de torque externo, L = Iω es constante. Reducir I aumenta ω y viceversa. Es la ley detrás de patinadoras, pulsares, discos protoplanetarios y agujeros negros giratorios.


<Connect title="De la rotación al electromagnetismo" sourceConcept="Momento angular" targetConcept="Momento angular de las partículas">
El momento angular es universal: los electrones tienen spin (momento angular intrínseco) que estructura la tabla periódica y los espectros atómicos. El acoplamiento espín-órbita es la base de la resonancia magnética nuclear usada en medicina. La rotación clásica que estudias aquí persiste intacta en el mundo cuántico.
</Connect>

---

## Dinámica rotacional

## La segunda ley rotacional

```aeterna-exercise
TITLE: Torque neto y aceleración angular
HINT: τ = Iα. Despeja α.
XP: 40
Un disco de momento de inercia I = 5 kg·m² recibe un torque de 20 N·m. ¿Cuál es su aceleración angular?
SOLUTION: α = τ/I = 20/5 = 4 rad/s².
```

La energía cinética rotacional:

$$ E_{rot} = \frac{1}{2}I\omega^2 $$

El trabajo rotacional: W = τ·Δθ. En una rueda, la energía de rotación se convierte en movimiento lineal.

> **🔑 Concepto clave: τ = Iα**
> El torque neto produce aceleración angular proporcional e inversa a la inercia rotacional. Es el análogo exacto de F = ma, y rige ruedas, motores, péndulos y planetas en rotación.

---

## Precesión y giroscopios

## Por qué precesan los giroscopios

El torque del peso τ = r × mg es perpendicular al momento angular L. Cambiar la dirección de L (sin cambiar su magnitud) produce la precesión:

$$ \omega_p = \frac{\tau}{L} = \frac{mgr}{I\omega} $$

La velocidad angular de precesión es inversamente proporcional a ω: cuanto más rápido gira, más lento precesa.

Aplicaciones de los giroscopios:
- **Navegación**: giroscopios de inercia en aviones y barcos
- **Estabilización**: drones, satélites (ruedas de reacción)
- **Brújulas giroscópicas**: apuntan al norte verdadero
- **Tecnología**: giroscopios MEMS en smartphones

> **🔑 Concepto clave: El torque cambia L, no lo derriba**
> Cuando el torque es perpendicular al momento angular, cambia la dirección de L → precesión. El giroscopio no cae porque el torque no puede derribar un L grande: lo hace girar.


<Transfer targetDomain="Diseño de bicicletas y motos" title="Transfiere: estabilidad al girar">
Un motorista se inclina hacia dentro al tomar una curva. Analiza los torques: su peso y la fuerza centrífuga crean un torque neto que, al inclinarse, se equilibra. Compara la estabilidad de una bicicleta con ruedas grandes vs pequeñas y cómo la conservación del momento angular mantiene las ruedas girando.
</Transfer>

</NivelActivo>


<NivelActivo id="frontera">

## Bienvenida: la física de girar

## Bienvenida: la rotación como geometría

La rotación se describe con vectores: la velocidad angular ω apunta a lo largo del eje de rotación (regla de la mano derecha).

La relación entre la velocidad lineal de un punto y la rotación es el producto vectorial:

$$ \vec{v} = \vec{\omega} \times \vec{r} $$

El momento angular es el producto vectorial de la posición y el momento:

$$ \vec{L} = \vec{r} \times \vec{p} $$

Y el torque:

$$ \vec{\tau} = \vec{r} \times \vec{F} $$

Estas definiciones vectoriales son esenciales: la dirección del momento angular define el eje de rotación, y la conservación de L es una de las leyes más fundamentales de la física.

> **💡 Nota avanzada**
> El momento angular se conserva en sistemas aislados, consecuencia de la simetría rotacional (teorema de Noether). Desde los electrones (spin) hasta las galaxias, la conservación del momento angular organiza el cosmos.


<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la rotación es la versión 'girada' del movimiento lineal. El torque τ = rF es la fuerza que gira; el momento de inercia I = Σmr² es la masa rotacional; la segunda ley rotacional es τ = Iα; y el momento angular L = Iω se conserva si no hay torque externo —por eso la patinadora acelera al cerrar los brazos y los pulsares giran rapidísimo.
</PedagogicalContentBlock>

---

## ¿Qué es el torque?

## Torque y trabajo rotacional

El torque realiza trabajo rotacional:

$$ W = \tau \cdot \Delta\theta $$

Y la potencia rotacional:

$$ P = \tau \cdot \omega $$

Estas son análogas a W = F·d y P = F·v. El teorema trabajo-energía también se transfiere: el trabajo rotacional cambia la energía cinética rotacional ½Iω².

> **💡 Nota avanzada**
> El producto escalar τ·ω da la potencia: es la forma rotacional de F·v. Los motores se caracterizan por su torque y potencia: el torque determina la aceleración, la potencia la velocidad máxima.

---

## Equilibrio rotacional

## Centro de gravedad y estabilidad

El **centro de gravedad** es el punto donde actúa el peso total. Para que un objeto sea estable, su centro de gravedad debe estar sobre su base de apoyo.

- Un objeto es **estable** si su CG está dentro de la base
- Se **vuelca** si el CG cae fuera de la base
- Los coches tienen CG bajo para no volcarse en curvas

> **💡 Nota de frontera**
> La estabilidad es un problema de energías: el objeto es estable si su CG está en un mínimo de energía potencial. Las torres, los puentes y los robots caminantes resuelven este equilibrio en cada instante.

---

## Momento de inercia

## Inercia de cuerpos continuos

Para cuerpos continuos, la suma se convierte en integral:

$$ I = \int r^2 \, dm $$

El **teorema de los ejes paralelos**:

$$ I = I_{CM} + Md^2 $$

Permite calcular I respecto a cualquier eje paralelo al que pasa por el centro de masa.

El momento de inercia es un **tensor** en 3D: el cuerpo tiene inercias distintas según el eje (un libro gira fácil sobre su plano, difícil sobre su lomo).

> **💡 Nota de frontera**
> En mecánica cuántica, el momento de inercia de las moléculas determina sus espectros de rotación. La cuantización del momento angular (L = nℏ) da los niveles de energía rotacional de las moléculas, la base de la espectroscopía.


### Estima como un físico: el momento de inercia de una rueda

La **estimación de Fermi** aplicada a la rotación: para estimar el momento de inercia de una rueda de bicicleta (m ≈ 2 kg, R ≈ 0.35 m), modelas la masa concentrada en el borde: I ≈ mR² ≈ 2 × 0.35² ≈ 0.25 kg·m². Un **modelo simplificado** (aro) es 2× mayor que uno de disco (½mR² ≈ 0.12), así que la respuesta real está en ese rango. Estimar el orden de magnitud antes de calcular te da un control de plausibilidad del resultado exacto.

---

## Conservación del momento angular

## Momento angular y el cosmos

La conservación del momento angular organiza el universo:

- Una nube de gas colapsa: su momento angular se conserva y acelera → disco protoplanetario que gira
- El Sol y los planetas se forman de este disco
- Cuando una estrella colapsa en una enana blanca o pulsar, su ω aumenta enormemente
- Los agujeros negros giratorios (Kerr) tienen momento angular definido

> **💡 Nota de frontera**
> El momento angular está cuantizado en mecánica cuántica: L = ℏ√(l(l+1)). El **spin** es una forma intrínseca de momento angular sin análogo clásico: partículas como los electrones tienen spin ½, y esta propiedad estructura la tabla periódica.


<Connect title="De la rotación al electromagnetismo" sourceConcept="Momento angular" targetConcept="Momento angular de las partículas">
El momento angular es universal: los electrones tienen spin (momento angular intrínseco) que estructura la tabla periódica y los espectros atómicos. El acoplamiento espín-órbita es la base de la resonancia magnética nuclear usada en medicina. La rotación clásica que estudias aquí persiste intacta en el mundo cuántico.
</Connect>

---

## Dinámica rotacional

## Rodadura: rotación + traslación

Un objeto que rueda sin resbalar combina rotación y traslación. Su energía cinética total:

$$ E = \frac{1}{2}Mv^2 + \frac{1}{2}I\omega^2 $$

Con la condición de rodadura v = Rω.

La aceleración de un objeto que rueda por un plano inclinado:

$$ a = \frac{g\sin\theta}{1 + I/MR^2} $$

Una esfera (I = ⅖MR²) baja más rápido que un aro (I = MR²): menos energía 'atrapada' en rotación.

> **💡 Nota de frontera**
> En rodadura, la fricción estática (no la cinética) actúa en el punto de contacto. El problema de rodar sin resbalar es un ejemplo clásico de vínculo (constraint) en la mecánica de Lagrange: se resuelve con coordenadas generalizadas.

---

## Precesión y giroscopios

## Momento angular en el espacio

Los satélites usan **ruedas de reacción**: giros que, al acelerarse, transfieren momento angular al satélite y lo rotan sin combustible.

La **Tierra precesa**: su eje describe un círculo completo cada 26,000 años (precesión de los equinoccios), por el torque de la Luna y el Sol sobre el abultamiento ecuatorial.

El giroscopio es la base de la **inercia de navegación**: con acelerómetros y giros, un sistema inercial calcula posición sin GPS.

> **💡 Nota de frontera**
> En mecánica cuántica, el spin y el momento angular orbital se acoplan (acoplamiento espín-órbita). En el mundo cuántico, la precesión de los momentos angulares produce fenómenos como la resonancia magnética nuclear (RMN), usada en medicina.


<Transfer targetDomain="Diseño de bicicletas y motos" title="Transfiere: estabilidad al girar">
Un motorista se inclina hacia dentro al tomar una curva. Analiza los torques: su peso y la fuerza centrífuga crean un torque neto que, al inclinarse, se equilibra. Compara la estabilidad de una bicicleta con ruedas grandes vs pequeñas y cómo la conservación del momento angular mantiene las ruedas girando.
</Transfer>

</NivelActivo>


La rotación completa el cuadro de la mecánica. Has aprendido que el torque es la fuerza que hace girar —depende de la fuerza y de la distancia al eje—, que el equilibrio exige que se cancelen tanto fuerzas como torques, y que el momento de inercia mide cómo la masa se reparte alrededor del eje. La segunda ley rotacional τ = Iα es el espejo exacto de F = ma, y la conservación del momento angular L = Iω explica desde la patinadora que acelera al cerrar los brazos hasta los pulsares que giran miles de veces por segundo. Los giroscopios y la precesión te mostraron la belleza contraintuitiva de la rotación: cuando el torque es perpendicular al momento angular, en lugar de derribar el objeto, hace que su eje describa círculos. Esta física rotacional no es solo teoría: está en los motores, los drones, los satélites, la navegación inercial y la estabilización de todo lo que gira. Y el momento angular, con su conservación ligada a la simetría rotacional, es una de las cantidades más fundamentales del universo —del spin de los electrones a la rotación de las galaxias. Ahora entiendes no solo cómo giran las cosas, sino por qué se resisten a cambiar su giro.
