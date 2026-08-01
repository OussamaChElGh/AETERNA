---
title: "Electromagnetismo Avanzado: Corriente, Circuitos y las Ecuaciones que Mueven el Mundo Moderno"
description: "Por qué se enciende una bombilla, cómo funciona un circuito eléctrico, qué es la resistencia y cómo las ecuaciones de Maxwell unifican electricidad y magnetismo en una sola teoría que cambió la civilización."
slug: "electromagnetismo-avanzado"
author: "Aeterna"
category: "ciencias"
subcategory: "fisica"
tags: ["física", "electricidad", "magnetismo", "corriente eléctrica", "circuitos", "resistencia", "ley de Ohm", "electromagnetismo", "ecuaciones de Maxwell", "inducción", "electroimán", "generador", "transformador"]
image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop"
date: "2026-05-11"
nivel: 2
orden: 3.1
nivel_titulo: "El Reino de lo Clásico"
insignia: "Señor de lo Clásico"
tipo: "theory"
prerequisites: ["electromagnetismo", "vectores"]
breadcrumb: ["El Reino de lo Clásico", "Electromagnetismo Avanzado"]
---

## ▶️ Bienvenida: El mundo que no puedes ver

En este momento, hay **billones de electrones** moviéndose por los cables de las paredes de tu habitación. No los puedes ver, no los puedes tocar, y sin embargo, están haciendo funcionar cada dispositivo eléctrico que tienes.

Pero espera — hay algo más. Esos mismos electrones que encienden tu lámpara son **los mismos** que crean el campo magnético que hace funcionar tu disco duro, el que genera la señal WiFi que estás usando, y el que haría funcionar un motor si conectaras un cable a una batería.

La electricidad y el magnetismo son **dos caras de la misma moneda**. Y la moneda se llama **electromagnetismo**.

> **💡 La clave en 10 segundos**
>
> > La corriente eléctrica es el **flujo de electrones** a través de un conductor. Los circuitos son los **caminos** que les damos a esos electrones para que hagan trabajo útil. Y las ecuaciones de Maxwell son las **4 ecuaciones** que describen toda la relación entre electricidad y magnetismo. Todo lo eléctrico que usas a diario — desde tu teléfono hasta la planta eléctrica que te lo alimenta — se entiende con estas ideas.

---

<!-- ============================================ -->
<!-- CAPA 1: INTUICIÓN — QUÉ ES LA CORRIENTE ELÉCTRICA -->
<!-- ============================================ -->

## 🌱 Capa I: Intuición — Electrones en marcha

### 1.1 Corriente eléctrica: el río de electrones

Imagina un tubo de jardín lleno de canicas. Si empujas una canica por un lado, la que sale por el otro extremo se mueve **instantáneamente** (o casi), aunque ninguna canica haya recorrido todo el tubo. Eso es exactamente lo que pasa con la corriente eléctrica en un cable.

La **corriente eléctrica** ($I$) mide cuánta carga pasa por un punto cada segundo:

$$I = \frac{Q}{t}$$

donde $Q$ es la carga eléctrica (en Coulombs) y $t$ es el tiempo (en segundos).

**Un Coulomb** es muchísimos electrones:

$$1 \text{ C} = 6{,}242 \times 10^{18} \text{ electrones}$$

### ¿Cómo fluye realmente un electrón?

Cuando cierras un circuito, los electrones **ya están** en el cable. Lo que viaja a la velocidad de la luz no es el electrón, sino el **campo eléctrico** que les dice a todos los electrones que se muevan simultáneamente. Es como una onda en un estadio: cuando "la ola" recorre las gradas, cada persona solo se mueve un poco hacia arriba, pero la ola viaja rápidísimo.

Los electrones individuales se desplazan realmente muy lento: **milímetros por segundo** (la "velocidad de deriva"). Pero el efecto eléctrico viaja a ~300.000 km/s.

> **🧠 Dato que rompe el cerebro**
>
> > Cuando enciendes una lámpara, la luz aparece "instantáneamente" incluso si el cable mide kilómetros. ¿Cómo? El campo eléctrico se propaga por el cable casi a la velocidad de la luz, y **todos los electrones del cable** comienzan a moverse al mismo tiempo. No necesitas esperar a que un electrón viaje desde la planta eléctrica hasta tu casa. Es como una tubería de agua llena: cuando abres el grifo, el agua sale del otro lado inmediatamente porque el agua ya estaba ahí.

### 1.2 Corriente convencional vs. flujo de electrones

**Aquí hay un error histórico muy curioso:**

Benjamin Franklin (siglo XVIII) decidió que la carga positiva era la que se movía. Definió la dirección de la corriente como: **del positivo al negativo** (fuera de la batería).

La realidad descubierta 150 años después: **los electrones** (carga negativa) se mueven del terminal **negativo al positivo**. Es decir, **en dirección opuesta** a la corriente convencional.

¿Por qué seguimos usando la convención de Franklin? Porque **funciona igual** para todos los cálculos. Los ingenieros diseñan circuitos con la convención de corriente convencional y los resultados son correctos. Solo importa que seas **consistente**.

```
   Convención de Franklin:     Realidad física:

   (+) ─────────────→ (-)      (−) ←────────────→ (+)
   Corriente convencional       Flujo real de electrones
   
   ═══════════════════
   Batería
   ═══════════════════
```

### 1.3 Voltaje: la "presión" que mueve electrones

El **voltaje** (o diferencia de potencial, $V$) es lo que **empuja** a los electrones a moverse. Es análogo a la presión del agua en una tubería, o a la altura de una colina por la que rueda una pelota.

$$V = \frac{W}{Q} = \frac{\text{Trabajo (energía)}}{\text{Carga}}$$

**Unidad:** Voltio (V) = 1 Joule por Coulomb.

| Analogía hidráulica | Concepto eléctrico |
|:--------------------:|:------------------:|
| Presión del agua | Voltaje (V) |
| Flujo de agua | Corriente (I) |
| Tubería estrecha | Resistencia (R) |
| Bomba de agua | Batería / Fuente |

**Intuición clave:** Sin voltaje, no hay corriente (en un circuito pasivo). Un cable solo conectado no tiene corriente. Necesitas una fuente de energía (batería, generador) que cree una **diferencia de potencial**.

### 1.4 Resistencia: lo que frena a los electrones

La **resistencia** ($R$) mide cuánto se opone un material al paso de la corriente. Todo material resiste algo, excepto los **superconductores** (a temperaturas cercanas al cero absoluto).

**Factores que afectan la resistencia:**

$$R = \rho \frac{L}{A}$$

| Factor | Efecto | Ejemplo |
|:------:|:-------|:-------:|
| **Longitud** ($L$) ↑ | Resistencia ↑ | Un cable largo calienta más |
| **Área transversal** ($A$) ↑ | Resistencia ↓ | Un cable grueso deja pasar más corriente |
| **Resistividad** ($\rho$) | Depende del material | Cobre: bajo; tungsteno: alto |
| **Temperatura** ↑ | Resistencia ↑ (en metales) | Un bombillo caliente tiene más resistencia |

### La Ley de Ohm: la ecuación más famosa de la electricidad

$$V = I \cdot R$$

| Incógnita | Fórmula para hallarla |
|:---------:|:---------------------:|
| Voltaje | $V = I \times R$ |
| Corriente | $I = \frac{V}{R}$ |
| Resistencia | $R = \frac{V}{I}$ |

**Ejemplo:** Tienes una bombilla de 60 W conectada a 120 V (enchufe de EE.UU.).
- Corriente: $I = \frac{P}{V} = \frac{60}{120} = 0{,}5$ A
- Resistencia del filamento: $R = \frac{V}{I} = \frac{120}{0{,}5} = 240 \,\Omega$

> **❌ Error común**
>
> > **[El error]:** "La ley de Ohm se aplica a todo."
> >
> > **[La realidad]:** La ley de Ohm ($V = IR$) solo es exacta en materiales **ohmios** (resistencia constante). Los diodos, los semiconductores y los filamentos calientes **no** obedecen exactamente esta ley. La resistencia de un filamento de tungsteno cambia con la temperatura. Pero para circuitos simples con resistencias, es extremadamente útil.

---

<!-- ============================================ -->
<!-- CAPA 2: HERRAMIENTAS — CIRCUITOS -->
<!-- ============================================ -->

## 2.1 Componentes básicos de un circuito

Todo circuito necesita al menos tres cosas:

```
    ┌──[Motor / Bombilla]──┐
    │                      │
( + )                    ( − )  ← Batería
    │                      │
    └──[Interruptor]───────┘
```

| Componente | Función | Símbolo |
|:----------:|:-------:|:-------:|
| **Fuente** (batería) | Genera voltaje, empuja electrones | \|\| \|\| |
| **Cables** | Conducen electrones | ─────── |
| **Carga** (bombilla, motor) | Usa la energía eléctrica | ● ○ |
| **Interruptor** | Abre/cierra el camino | ⎊ |
| **Resistencia** | Limita la corriente a propósito | ╞═╡ |
| **Amperímetro** | Mide la corriente (en serie) | A |
| **Voltimetro** | Mide el voltaje (en paralelo) | V |

### Tipos de circuito

**Circuito abierto:** Hay una interrupción → no circula corriente. Es como un tubo con una válvula cerrada.

**Circuito cerrado:** El camino está completo → fluye corriente. Es el estado normal de funcionamiento.

**Cortocircuito:** La corriente encuentra un camino de **muy baja resistencia** (un cable conecta directamente los terminales de la batería). Esto genera una corriente enorme que puede quemar cables, dañar la batería o causar un incendio.

---

## 2.2 Circuitos en serie: una sola carretera

En un circuito en serie, los componentes están **uno detrás de otro**, formando un único camino para la corriente.

```
  (+) ──[R₁]──[R₂]──[R₃]─── (−)
```

### Reglas del circuito en serie:

**1. La corriente es IGUAL en todos los componentes:**

$$I_{total} = I_1 = I_2 = I_3$$

(¿Por qué? Porque los electrones no tienen otro camino. Es como personas caminando en fila india: todos caminan al mismo ritmo.)

**2. El voltaje se DIVIDE entre los componentes:**

$$V_{total} = V_1 + V_2 + V_3$$

**3. La resistencia total es la SUMA:**

$$R_{total} = R_1 + R_2 + R_3$$

### Ejemplo: Luces de árbol de Navidad (viejo estilo)

Las antiguas luces de navidad conectadas en serie tienen un problema famoso: si una bombilla se quema, **todas se apagan**. ¿Por qué? Porque rompen el único camino por donde puede circular la corriente. Es como un puente que se derrumba: nadie puede pasar.

**Cálculo:** Si tienes 20 bombillas de 2,5 V cada una conectadas a 120 V:
$$V_{total} = 20 \times 2{,}5 = 50 \text{ V} \quad \text{(¡No alcanzan para 120 V!)}$$
$$V_{total} = 50 \text{ V} \text{ (necesitarías 48 bombillas para usar 120 V)}$$

> **🌌 Imagina que...**
>
> > Si tuvieras una fila de LED de 3 V y una batería de 9 V, podrías conectar exactamente 3 LEDs en serie. Cada uno "gasta" 3 V, y $3 \times 3 = 9$ V, que es exactamente lo que da la batería.

---

## 2.3 Circuitos en paralelo: múltiples autopistas

En un circuito en paralelo, los componentes tienen **sus propios caminos independientes** hacia la fuente.

```
        ┌──[R₁]──┐
        │         │
  (+) ──┼──[R₂]──┼─── (−)
        │         │
        └──[R₃]──┘
```

### Reglas del circuito en paralelo:

**1. El voltaje es IGUAL en todos los componentes:**

$$V_{total} = V_1 = V_2 = V_3$$

(Cada componente está conectado directamente a la fuente, como departamentos que tienen cada uno su propia conexión al agua.)

**2. La corriente se DIVIDE entre las ramas:**

$$I_{total} = I_1 + I_2 + I_3$$

**3. La resistencia total se calcula así:**

$$\frac{1}{R_{total}} = \frac{1}{R_1} + \frac{1}{R_2} + \frac{1}{R_3}$$

### ¿Por qué la resistencia total es MENOR que cualquiera individual?

Piénsalo así: estás abriendo más caminos por donde puede fluir la corriente. Cuantos más caminos, más fácil es para la corriente circular → menor resistencia total. Es como abrir más carriles en una autopista: el tráfico fluye mejor.

**Ejemplo:** Dos resistencias de 10 Ω en paralelo:
$$\frac{1}{R_{total}} = \frac{1}{10} + \frac{1}{10} = \frac{2}{10}$$
$$R_{total} = 5 \,\Omega$$

¡La mitad de una sola!

### Ejemplo: ¿Por qué no se apagan todas las luces de tu casa?

Porque las luces de tu casa están en **paralelo**. Cada bombilla tiene su propio camino independiente a la red eléctrica. Si una se quema:

```
        ┌──💡 (se quemó, R→∞)──┐
        │                        │
  red ──┼──💡 ON──────────────┼── red
        │                        │
        └──💡 ON──────────────┘
```

El circuito de las otras bombillas **no se ve afectado**. La corriente simplemente deja de pasar por la bombilla quemada y sigue por los otros caminos. Esa es la razón por la que las casas usan circuitos en paralelo, no en serie.

---

## 2.4 Circuitos mixtos: la realidad es más compleja

La mayoría de los circuitos reales combinan series y paralelo. La estrategia es siempre la misma:

1. **Simplifica** paso a paso: calcula primero las resistencias en serie y paralelo por separado.
2. **Reemplaza** cada combinación por su resistencia equivalente ($R_{eq}$).
3. **Repite** hasta tener un solo valor de $R_{total}$.
4. **Calcula** la corriente total: $I = V / R_{total}$.
5. **Deshaz** los pasos para encontrar corrientes y voltajes individuales.

**Ejemplo rápido:**

```
       ┌──[6Ω]──┐
       │         │
  12V ─┤         ├──[4Ω]── (−)
       │         │
       └──[6Ω]──┘
```

1. Las dos resistencias de 6 Ω en paralelo: $R_p = \frac{6 \times 6}{6 + 6} = 3 \,\Omega$
2. En serie con la de 4 Ω: $R_{total} = 3 + 4 = 7 \,\Omega$
3. Corriente total: $I = 12/7 = 1{,}71$ A
4. Voltaje en la de 4 Ω: $V = 1{,}71 \times 4 = 6{,}86$ V
5. Voltaje en el paralelo: $12 - 6{,}86 = 5{,}14$ V
6. Corriente en cada rama de 6 Ω: $I = 5{,}14/6 = 0{,}86$ A

---

## 3.1 Potencia eléctrica: la velocidad de gastar energía

La **potencia** ($P$) mide qué tan rápido consume o genera energía un dispositivo:

$$P = V \cdot I$$

Combinando con la ley de Ohm, obtenemos tres formas equivalentes:

| Si conoces... | Usa esta fórmula |
|:-------------:|:-----------------:|
| $V$ e $I$ | $P = V \cdot I$ |
| $I$ y $R$ | $P = I^2 \cdot R$ |
| $V$ y $R$ | $P = \frac{V^2}{R}$ |

### ¿Dónde se va tu dinero?

| Electrodoméstico | Potencia típica | Uso diario | Energía diaria |
|:-----------------:|:--------------:|:----------:|:--------------:|
| Aire acondicionado | 1.500 W | 8 h | 12 kWh |
| Calentador de agua | 2.000 W | 2 h | 4 kWh |
| Refrigerador | 200 W | 24 h | 4,8 kWh |
| Televisor | 100 W | 5 h | 0,5 kWh |
| Computadora | 150 W | 8 h | 1,2 kWh |
| LED (1 bombilla) | 10 W | 6 h | 0,06 kWh |

> **💰 Dato práctico:**
>
> > Un kilovatio-hora (kWh) cuesta entre $0,10 y $0,30 dependiendo de tu país. Si dejas encendida una bombilla de 100 W (incandescente) durante 10 horas, consumes 1 kWh ≈ $0,15-0,30. Cambiarla por una LED de 10 W te cuesta 10 veces menos. Así de simple es el ahorro.

### Efecto Joule: por qué los cables calientan

Toda resistencia disipa energía en forma de **calor**. Esto se llama **efecto Joule**:

$$P_{calor} = I^2 \cdot R$$

**Aplicaciones prácticas (¿útiles o peligrosas?):**

| Caso | ¿Deseado? | Explicación |
|:----:|:----------:|:-----------:|
| Tostadora | ✅ Sí | Una resistencia calienta el pan por efecto Joule |
| Freno de disco eléctrico | ✅ Sí | La energía cinética del auto se convierte en calor |
| Sobrecarga en cables | ❌ No | Demasiada corriente → demasiada calor → ¡incendio! |
| Cortocircuito | ❌ No | Corriente enorme → calor extremo → fundido/meltdown |

> **🔧 Seguridad eléctrica:**
>
> > Los fusibles y breakers (interruptores térmicos) existen para protegerte del efecto Joule descontrolado. Cuando la corriente excede un límite seguro, el fusible se **derrite** (se abre el circuito) y se apaga todo. Es una destrucción controlada que evita una destrucción no controlada.

---

## 4.1 Campos eléctricos y potencial

### De la fuerza al campo

¿Por qué dos cargas se atraen o se repelen sin tocarse? Porque cada carga crea un **campo eléctrico** a su alrededor. Es como si cada carga gritara: "¡Estoy aquí! Si eres positiva, ven; si eres negativa, aléjate."

El campo eléctrico $\vec{E}$ en un punto es la fuerza que sentiría una carga de prueba unitaria:

$$\vec{E} = \frac{\vec{F}}{q}$$

**Unidad:** Newton por Coulomb (N/C), equivalente a Voltio por metro (V/m).

### Potencial eléctrico: la "altura" eléctrica

Así como la energía potencial gravitatoria depende de la altura, la **energía potencial eléctrica** depende del **potencial eléctrico** ($V$):

$$V = \frac{U}{q} = \frac{kQ}{r}$$

donde $k = 8{,}99 \times 10^9$ N·m²/C² es la constante de Coulomb.

**Analogía gravitatoria:**

| Gravitatorio | Eléctrico |
|:------------:|:---------:|
| Masa ($m$) | Carga ($q$) |
| Fuerza gravitatoria ($F_g = Gm_1m_2/r^2$) | Fuerza eléctrica ($F_e = kq_1q_2/r^2$) |
| Altura ($h$) | Potencial ($V$) |
| Energía potencial gravitatoria ($mgh$) | Energía potencial eléctrica ($qV$) |
| La gravedad siempre atrae | La electricidad atrae Y repele |

**Diferencia fundamental:** No existe la "carga negativa" de la masa. La gravedad siempre es atractiva. La electricidad puede ser **atractiva O repulsiva**.

### ¿Por qué te da un "calambre" al tocar una manija?

Cuando caminas con calcetines sobre alfombra, tus zapatos arrancan electrones del material → tu cuerpo acumula carga negativa. Al acercarte a la manija metálico, se crea un gran campo eléctrico entre tu cuerpo y la manija. Cuando la diferencia de potencial es suficiente (~3.000 V en aire seco), el aire se **ioniza** y los electrones saltan como un relámpago en miniatura. El "calambre" es un **descarga electrostática** (ESD).

---

## 5.1 Las 4 Ecuaciones de Maxwell: Las leyes más hermosas de la física

Si solo pudieras aprender **4 ecuaciones** en toda la física, que sean estas. James Clerk Maxwell las reunió en 1865 y demostró que la electricidad y el magnetismo son **una sola fuerza**: el electromagnetismo. Con ellas predijo la existencia de las **ondas electromagnéticas** (luz, radio, WiFi, rayos X... todo).

### Las 4 ecuaciones en palabras:

### 1. Ley de Gauss para el campo eléctrico

> **"La carga eléctrica crea campo eléctrico."**

$$\oint \vec{E} \cdot d\vec{A} = \frac{Q_{int}}{\varepsilon_0}$$

**Traducción simple:** Si encierras una carga dentro de una superficie imaginaria, el campo eléctrico que "sale" de esa superficie es proporcional a la carga encerrada. Más carga adentro = más campo saliendo.

### 2. Ley de Gauss para el campo magnético

> **"No existen monopolos magnéticos."**

$$\oint \vec{B} \cdot d\vec{A} = 0$$

**Traducción simple:** Cada vez que sale una línea de campo magnético de una superficie, **vuelve a entrar** obligatoriamente. Los imanes siempre tienen un polo norte Y un polo sur. Puedes cortar un imán en mil pedazos y cada pedazo tendrá su norte y su sur. **Nunca** se encuentra un polo magnético aislado en la naturaleza (aunque la física teórica predice que podrían existir).

### 3. Ley de Faraday de la inducción

> **"Un campo magnético que cambia genera campo eléctrico."**

$$\oint \vec{E} \cdot d\vec{l} = -\frac{d\Phi_B}{dt}$$

**Traducción simple:** Si mueves un imán cerca de un cable, o cambias el campo magnético alrededor del cable, se genera una **corriente eléctrica**. Este principio es la base de:
- Los **generadores eléctricos**
- Los **transformadores**
- Las **plantas hidroeléctricas**
- La carga inalámbrica de tu teléfono

### 4. Ley de Ampère-Maxwell

> **"Un campo eléctrico que cambia genera campo magnético, y una corriente eléctrica genera campo magnético."**

$$\oint \vec{B} \cdot d\vec{l} = \mu_0 I + \mu_0 \varepsilon_0 \frac{d\Phi_E}{dt}$$

**Traducción simple:** Toda corriente eléctrica genera un campo magnético a su alrededor (parte de Ampère). Pero Maxwell añadió algo revolucionario: un **campo eléctrico que cambia con el tiempo** también genera campo magnético (la corrección de desplazamiento). Sin este término adicional, las ondas electromagnéticas no existirían y Maxwell no habría podido predecir la luz.

---

## 5.2 La predicción más grande: las ondas electromagnéticas

Maxwell combinó sus 4 ecuaciones y llegó a una conclusión asombrosa: debía existir una perturbación que se propaga por el espacio a una velocidad:

$$c = \frac{1}{\sqrt{\mu_0 \varepsilon_0}} \approx 300.000 \text{ km/s}$$

Ese número coincidía exactamente con la **velocidad de la luz**. Maxwell concluyó: **la luz es una onda electromagnética**.

> **🌌 Imagina que...**
>
> > Un campo eléctrico que cambia genera un campo magnético. Ese campo magnético cambia y genera un campo eléctrico. Ese campo eléctrico cambia y genera otro campo magnético... y así sucesivamente, propagándose por el espacio a la velocidad de la luz. No necesita ningún medio. Viaja por el vacío del espacio. Eso es la luz. Eso es WiFi. Eso son los rayos X. Eso es la radiación que calienta tu comida en el microondas. Todo es exactamente el mismo fenómeno, a diferentes frecuencias.

### El espectro electromagnético completo

```
   Longitud de onda creciente →
   Frecuencia decreciente →

   Gamma │  Rayos X  │  Ultravioleta  │  VISIBLE  │  Infrarrojo  │  Microondas  │  Radio
         │           │                 │ 🔴🟠🟡🟢🔵🟣 │              │              │
         │           │                 │  Luz visible  │              │              │
```

| Tipo de onda | Longitud de onda | Frecuencia | Uso cotidiano |
|:------------:|:----------------:|:----------:|:-------------:|
| Rayos gamma | < 0,01 nm | > 30 EHz | Medicina (radioterapia) |
| Rayos X | 0,01 - 10 nm | 30 PHz - 30 EHz | Radiografías |
| Ultravioleta | 10 - 400 nm | 750 THz - 30 PHz | Bronceador, desinfección |
| **Luz visible** | **400 - 700 nm** | **430 - 750 THz** | **Lo que tus ojos ven** |
| Infrarrojo | 700 nm - 1 mm | 300 GHz - 430 THz | Control remoto, térmica |
| Microondas | 1 mm - 1 m | 300 MHz - 300 GHz | Microondas, WiFi, GPS |
| Radio | > 1 m | < 300 MHz | Radio FM, TV, celular |

---

## 6.1 El motor eléctrico: convertir electricidad en movimiento

Los motores eléctricos usan la interacción entre corriente y campo magnético para generar movimiento rotacional. Es el dispositivo más importante de la era moderna.

### Principio básico

Un cable por donde circula corriente, colocado en un campo magnético, experimenta una **fuerza**:

$$\vec{F} = I \cdot \vec{L} \times \vec{B}$$

La **regla de la mano izquierda** (o de Fleming):
- **Índice** → Campo magnético (B)
- **Corazón** → Corriente (I)
- **Pulgar** → Fuerza (F)

### ¿Cómo funciona un motor?

```
        Imán N
        ───────────────
       /   I↓  ↑I      \
      │  ┌────┐  ┌────┐ │
      │  │  ↑ │  │  ↓  │ │  ← Rotor (gira)
      │  └────┘  └────┘ │
       \   I↑  ↓I      /
        ───────────────
        Imán S
```

1. La corriente fluye por las bobinas del rotor.
2. El campo magnético de los imanes ejerce fuerza sobre las bobinas.
3. El rotor gira. Cada media vuelta, un **comutador** invierte la dirección de la corriente para mantener el giro en la misma dirección.

> **🌍 Dato cotidiano**
>
> > En un coche eléctrico, no hay motor de combustión. Solo hay uno (o varios) **motores eléctricos**. La energía de la batería fluye por las bobinas, interactúa con imanes permanentes y convierte la electricidad en movimiento. Eficiencia típica: **85-95%** frente al **20-30%** de un motor de combustión interna.

---

## 7.1 Transformadores: cambiar voltaje sin tocar los cables

Un **transformador** es un dispositivo que cambia el voltaje de una corriente alterna (CA) usando inducción electromagnética. Es probablemente el invento más importante para la distribución de energía eléctrica.

### ¿Por qué necesitamos transformadores?

Para transmitir electricidad a largas distancias con **mínimas pérdidas**:

$$P_{pérdida} = I^2 \cdot R_{cable}$$

Si transmites a **alta tensión** (millones de voltios), la corriente es baja → las pérdidas son mínimas. Pero en tu casa necesitas **120 V o 220 V**, no millones de voltios. Necesitas un dispositivo que baje el voltaje: el transformador.

### Relación del transformador:

$$\frac{V_1}{V_2} = \frac{N_1}{N_2}$$

| Tipo | Vueltas | Relación | Ejemplo |
|:----:|:-------:|:--------:|:-------:|
| **Elevador** | $N_2 > N_1$ | $V_2 > V_1$ | Planta eléctrica → línea de transmisión |
| **Reductor** | $N_2 < N_1$ | $V_2 < V_1$ | Poste de luz → enchufe de tu casa |

### Ejemplo: La energía que llega a tu casa

```
Planta eléctrica
    20.000 V ────────── [Transformador elevador] ──────────> 400.000 V
                                                            Línea de alta tensión
    400.000 V ═══════════════════════════════════════> [Transformador reductor]
                                                            Poste de luz
    220 V (o 120 V en EE.UU.) ───────────────────────> Tu enchufe
```

> **🧠 Dato que rompe el cerebro**
>
> > Toda la electricidad que usas en tu casa fue generada a **miles de kilómetros de distancia**, posiblemente. Gracias a los transformadores, puede viajar eficientemente por cables que cruzan países enteros, y al llegar a tu barrio se convierte al voltaje seguro que necesitas para cargar tu teléfono. Sin transformadores, necesitaríamos una planta eléctrica en cada cuadra.

---

## 🧠 Sistema Aeterna: ¿Qué acabas de aprender?

> **🧠 Sistema Aeterna, paso 1: Los electrones no corren tan rápido como crees**
>
> > Los electrones en un cable se mueven a velocidades de milímetros por segundo. Lo que viaja a la velocidad de la luz es el **campo eléctrico**, que le dice a todos los electrones que se muevan al mismo tiempo. Es como la ola en un estadio: nadie corre, pero la ola viaja rápidísimo.

> **🧠 Sistema Aeterna, paso 2: La ley de Ohm es tu GPS eléctrico**
>
> > Si conoces dos de las tres variables (V, I, R), siempre puedes encontrar la tercera. Pero recuerda: no todos los materiales son "ohmios". Los diodos, los semiconductores y los materiales en condiciones extremas no siguen esta regla simple.

> **🧠 Sistema Aeterna, paso 3: Maxwell lo unificó todo**
>
> > Antes de Maxwell, electricidad y magnetismo eran fenómenos separados. Maxwell demostró que son dos aspectos de una sola fuerza y predijo que las ondas electromagnéticas existían... 20 años antes de que Hertz las confirmara experimentalmente. La luz, el WiFi, las microondas, los rayos X: todo es el mismo fenómeno a diferentes frecuencias.

---

## ❓ Preguntas frecuentes sobre Electromagnetismo Avanzado

> **❓ ¿La electricidad viaja realmente por dentro del cable o por fuera?**
>
> Técnicamente, la corriente (flujo de electrones) va por **dentro** del conductor. Pero el campo electromagnético que transporta la energía viaja **por fuera** del cable, en el espacio que lo rodea. Esto es contraintuitivo pero está bien demostrado. En un cable de alta tensión, la mayor parte de la energía no está *dentro* del cable, sino en el **espacio alrededor** de él.

> **❓ ¿Por qué los pájaros pueden pararse en cables de alta tensión sin morir?**
>
> Porque tocan el cable en **un solo punto** y no hay diferencia de potencial entre sus patas. La corriente necesita un **camino completo** para fluir (circuito cerrado). Si el pájaro no toca el suelo ni otro cable, no hay camino para la corriente → no hay descarga. Si un pájaro extendiera sus alas y tocara dos cables simultáneamente (o un cable y una torre), recibiría una descarga letal.

> **❓ ¿Qué diferencia hay entre corriente continua (CC) y corriente alterna (CA)?**
>
> En **CC** (baterías, pilas), los electrones fluyen siempre en la **misma dirección**. En **CA** (enchufe de casa), los electrones cambian de dirección **60 veces por segundo** (EE.UU.) o **50 veces por segundo** (Europa/Latinoamérica). La CA se usa para distribución porque se puede transformar fácilmente a distintos voltajes con transformadores.

> **❓ ¿Los imanes de nevera realmente usan electromagnetismo?**
>
> Sí, pero de forma simplificada. Un imán de nevera es un **imán permanente** (material ferromagnético magnetizado). Funciona porque sus átomos tienen momentos magnéticos alineados que crean un campo magnético estable. Los **electroimanes** (como los de una grúa) usan corriente eléctrica pasando por una bobina para generar un campo magnético temporal y controlable.

> **❓ ¿Por qué los transformadores SOLO funcionan con corriente alterna?**
>
> Porque el principio del transformador se basa en la **inducción electromagnética**: un campo magnético **cambiante** genera una corriente en una bobina cercana. Con corriente continua, el campo magnético es constante (no cambia) → no hay inducción → no hay transformación. Necesitas que el campo cambie para que el segundo bobinado "sienta" algo y genere voltaje.

---

## ⚠️ Siguiente parada en la ruta

> **⚠️ Siguiente parada: Movimiento Circular Avanzado**
>
> Ahora que entiendes circuitos y electromagnetismo, veamos cómo la física de la rotación se aplica a fenómenos como la fuerza centrífuga artificial (la de una centrifugadora), los aceleradores de partículas (que usan campos magnéticos para hacer girar protones) y los movimientos circulares que ves todos los días en lavadoras, centrifugadoras y montañas rusas. [Sigue la ruta →](#)

---

**📚 Para seguir explorando:**
- *"Electromagnetismo para ciencias e ingeniería"* de Griffiths — El libro universitario estándar sobre electromagnetismo.
- *3Blue1Brown "But what is a derivative?"* — Para entender los conceptos de cambio continuo detrás de Maxwell.
- *Veritasium "Which Way is Down?"* (YouTube) — Para entender la diferencia entre gravedad, aceleración y campos.
- *PhET "Circuit Construction Kit"* (phet.colorado.edu) — Simulador donde puedes construir circuitos, medir voltajes y corrientes, y ver cómo cambian en tiempo real.
- *Khan Academy — Electrical Engineering* — Curso completo de electromagnetismo, circuitos y señales.
- *MIT OCW 8.02 (Electricity and Magnetism)* — Videos de Walter Lewin, legendario profesor del MIT. Sus demostraciones en clase son famosas en todo el mundo.
- *Documental "Electricidad" (Netflix)* — Serie sobre la historia del descubrimiento de la electricidad y el magnetismo.*