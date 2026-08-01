---
title: "Torque y Momento Angular: Por qué una bailarina gira más rápido al cerrar los brazos"
description: "Qué es el torque, cómo se calcula el momento de una fuerza y por qué los objetos que giran se comportan de formas tan contraintuitivas. Desde abrir una puerta hasta el giro de una estrella de neutrones."
slug: "torque-momento-angular"
author: "Aeterna"
category: "ciencias"
subcategory: "fisica"
tags: ["física", "torque", "momento de fuerza", "momento angular", "rotación", "inercia", "equilibrio", "giroscopio", "bailarina", "palanca", "apalancamiento"]
image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
date: "2026-05-11"
nivel: 2
orden: 8
nivel_titulo: "El Reino de lo Clásico"
insignia: "Señor de lo Clásico"
tipo: "theory"
prerequisites: ["cinematica", "leyes-newton-movimiento", "vectores", "momentum-colisiones"]
breadcrumb: ["El Reino de lo Clásico", "Torque y Momento Angular"]
---

## ▶️ Bienvenida: La fuerza que hace girar

¿Alguna vez has intentado aflojar una tuerca muy apretada? Empujas con todas tus fuerzas... y no se mueve. Entonces agarras la llave más larga, aplicas la misma fuerza y *crac*: la tuerca cede.

¿Por qué? No empujaste más fuerte. Empujaste **más lejos** del punto de giro. Y eso lo cambia **todo**.

Bienvenido al mundo de la rotación. Aquí descubrirás que hay una fuerza "escondida" que no aparece cuando un objeto se mueve en línea recta pero que **domina** todo lo que gira, gira o se balancea. Desde las ruedas de tu bicicleta hasta los huracanes, los tornados y los agujeros negros en rotación: todo se entiende a través de dos conceptos: el **torque** y el **momento angular**.

> **💡 La clave en 10 segundos**
>
> > El **torque** mide cuánto una fuerza *intenta* hacer girar un objeto. El **momento angular** mide cuánto *movimiento rotacional* tiene un objeto. Y la ley más poderosa de esta sección es: **el momento angular total se conserva**. Por eso una bailarina gira más rápido cuando cierra los brazos, y un patinador puede girar sobre un hielo casi sin fricción durante minutos.

---

<!-- ============================================ -->
<!-- CAPA 1: INTUICIÓN — QUÉ HACE GIRAR LAS COSAS -->
<!-- ============================================ -->

## 🌱 Capa I: Intuición — Torque, la fuerza "con palanca"

### 1.1 ¿Qué es el torque?

Ya sabes que una fuerza puede cambiar la velocidad de un objeto (aceleración lineal). Pero si la fuerza se aplica **fuera del centro de masa** del objeto, también lo hace **girar**.

El **torque** ($\tau$, la letra griega "tau") mide la "capacidad de giro" de una fuerza:

$$\tau = r \times F = r \cdot F \cdot \sin(\theta)$$

donde:
- $r$ = distancia desde el punto de giro (o eje de rotación) hasta donde se aplica la fuerza
- $F$ = magnitud de la fuerza
- $\theta$ = ángulo entre el brazo de palanca y la dirección de la fuerza

**La unidad del torque** en el SI es el **Newton-metro (N·m)**. No es lo mismo que un Joule (J), aunque las unidades salgan iguales dimensionalmente. El torque es una cantidad **pseudo-vectorial** (tiene dirección según la regla de la mano derecha), mientras que la energía es un escalar.

### 1.2 La regla de la mano derecha (de nuevo, pero para torque)

Cuando aplicas una fuerza que genera torque:

1. **Apunta tus dedos** en la dirección de $r$ (desde el eje hacia el punto de aplicación)
2. **Cierra los dedos** en la dirección de la fuerza $F$
3. **Tu pulgar** apunta en la dirección del torque $\tau$

```
     Eje
      ●  ──→ τ (torque: "sale del eje")
      │
      │  F
      │ ↙
      ●───── r ────→
```

- Si el torque apunta **hacia arriba** (pulgar arriba): giro **antihorario** (visto desde arriba)
- Si apunta **hacia abajo**: giro **horario**

### 1.3 Apalancamiento: multiplicar fuerza con distancia

El torque es la razón por la cual funcionan las **palancas**. Arquímides dijo: *"Dadme un punto de apoyo y moveré el mundo"*. No era exageración.

$$F_1 \cdot r_1 = F_2 \cdot r_2$$

Si $r_1$ es 10 veces mayor que $r_2$, necesitas **10 veces menos fuerza** en ese lado para equilibrar.

**Ejemplo: abrir una puerta**

| Dónde empujas | Brazo de palanca | Fuerza necesaria |
|:-------------:|:----------------:|:-----------------:|
| En el pomo (cerca del eje) | ~0,1 m | **Mucha** |
| En el borde de la puerta | ~0,8 m | **8 veces menos** |
| Con el codo empujando a 0,2 m | ~0,2 m | **4 veces menos** |

Por eso empujar una puerta por el pomo a veces parece imposible: ¡estás aplicando la fuerza en el peor lugar posible!

> **🎮 Experimento mental**
>
> > Imagina que una fuerza de 100 N empuja perpendicularmente a un brazo de 0,5 m. El torque es: $\tau = 0{,}5 \times 100 = 50$ N·m. Ahora imagina que el mismo empuje ocurre a 2 m del eje (como en una llave de tuercas larga): $\tau = 2 \times 100 = 200$ N·m. **Mismo esfuerzo, 4 veces más torque.** Así funcionan las llaves de tuercas, los destornilladores y las palancas de freno de bicicleta.

### 1.4 Momento de inercia: la "masa" de la rotación

En movimiento lineal, la masa ($m$) mide cuánto se resiste un objeto a cambiar su velocidad. En rotación, existe una cantidad análoga: el **momento de inercia** ($I$).

$$I = \sum m_i \cdot r_i^2$$

Para un objeto continuo:

$$I = \int r^2 \, dm$$

**¿Qué significa esto?** La masa *lejos del eje* cuenta **mucho más** que la masa *cerca del eje*. Específicamente, la contribución crece con el **cuadrado** de la distancia.

| Momento de inercia | Fórmula | Objeto |
|:-------------------:|:-------:|:------:|
| Aro delgado | $I = MR^2$ | Toda la masa a distancia $R$ |
| Disco sólido | $I = \frac{1}{2}MR^2$ | Masa distribuida uniformemente |
| Esfera sólida | $I = \frac{2}{5}MR^2$ | Masa concentrada más hacia el centro |
| Barra delgada (por centro) | $I = \frac{1}{12}ML^2$ | Masa distribuida a lo largo |
| Barra delgada (por un extremo) | $I = \frac{1}{3}ML^2$ | Eje en el extremo |

> **❌ Error común**
>
> > **[El error]:** "Un objeto más pesado siempre tiene más momento de inercia."
> >
> > **[La realidad]:** Depende de **dónde** está la masa. Un aro delgado de 1 kg con radio 1 m tiene $I = 1$ kg·m². Una esfera sólida de 10 kg con radio 0,1 m tiene $I = 0{,}008$ kg·m². **El aro "pesado" de 1 kg tiene 125 veces más inercia rotacional que la esfera "pesada" de 10 kg** porque su masa está mucho más lejos del eje.

---

<!-- ============================================ -->
<!-- CAPA 2: HERRAMIENTAS — EL CORAZÓN DE LA ROTACIÓN -->
<!-- ============================================ -->

## 2.1 Segunda ley de Newton para rotación

Así como $F = ma$ gobierna el movimiento lineal, hay una ecuación equivalente para la rotación:

$$\tau_{neto} = I \cdot \alpha$$

donde:
- $\tau_{neto}$ = torque neto (suma de todos los torques)
- $I$ = momento de inercia
- $\alpha$ = aceleración angular (rad/s²)

| Lineal | Rotacional | Analogía |
|:------:|:----------:|:--------:|
| Fuerza ($F$) | Torque ($\tau$) | Lo que "causa" el cambio |
| Masa ($m$) | Momento de inercia ($I$) | Lo que "se resiste" al cambio |
| Aceleración ($a$) | Aceleración angular ($\alpha$) | La tasa de cambio |
| $F = ma$ | $\tau = I\alpha$ | Segunda ley de Newton |

### Ejemplo: Polea con peso

Una polea de masa 2 kg y radio 0,1 m tiene un hilo enrollado. Cuelgas un peso de 5 kg del hilo. ¿Con qué aceleración angular gira la polea?

1. Torque generado por el peso: $\tau = r \cdot F = 0{,}1 \times (5 \times 9{,}8) = 4{,}9$ N·m
2. Momento de inercia de la polea (disco): $I = \frac{1}{2} \times 2 \times 0{,}1^2 = 0{,}01$ kg·m²
3. Aceleración angular: $\alpha = \frac{\tau}{I} = \frac{4{,}9}{0{,}01} = 490$ rad/s²

¡En un segundo, la polea estará girando a casi 80 revoluciones por segundo! (Esto es idealizado, sin fricción.)

---

## 2.2 Momento angular: el "momentum de rotación"

Así como $p = mv$ es el momentum lineal, el **momento angular** ($L$) es su equivalente rotacional:

$$L = I \cdot \omega$$

donde $\omega$ es la velocidad angular (rad/s).

### ¿Cuáles son las unidades?

$$[L] = \text{kg·m}^2/\text{s}$$

Es un poco raro, pero tiene sentido: inercia (kg·m²) × velocidad de giro (rad/s).

### La relación entre torque y momento angular

Del mismo modo que la fuerza cambia el momentum lineal ($F = \frac{dp}{dt}$), el **torque cambia el momento angular**:

$$\tau = \frac{dL}{dt}$$

**Traducción:** Un torque neto distinto de cero **cambia** el momento angular. Si el torque neto es cero, el momento angular se **conserva**.

---

## 2.3 Conservación del momento angular: La ley más espectacular

> **Ley de conservación del momento angular:**
>
> *Si el torque neto externo sobre un sistema es cero, su momento angular total permanece constante:*
>
> $$L_{inicial} = L_{final}$$
> $$I_i \cdot \omega_i = I_f \cdot \omega_f$$

### ¡La bailarina mágica!

Imagina una patinadora/artista girando con los brazos extendidos:

```
   BRAZOS EXTENDIDOS            BRAZOS RECOGIDOS
   
      💃  ................           💃
     /|\  .  .  .   . .          /|\
    / | \ . . . . . . .         / | \
   /  |  .  .    . . .         |  |  |
            ↑ I grande                 ↑ I pequeño
            ω pequeña                ω GRANDE
```

1. **Brazos extendidos:** $I$ es grande (la masa está lejos del eje) → $\omega$ es pequeña
2. **Brazos recogidos:** $I$ es pequeña (la masa está cerca del eje) → $\omega$ **aumenta** para conservar $L$

$$I_{grande} \cdot \omega_{lenta} = I_{pequeña} \cdot \omega_{rápida}$$

No se necesita ninguna fuerza extra. Simplemente redistribuyendo su masa, la bailarina gira **3-5 veces más rápido**.

### Otros ejemplos asombrosos

| Fenómeno | Explicación |
|:--------:|:-----------|
| **Tornados** | El aire que gira se concentra en un vórtice estrecho → $I$ disminuye → $\omega$ aumenta → velocidades de hasta 500 km/h |
| **Estrellas de neutrones** | Una estrella que muere colapsa de millones de km a ~10 km de radio → $I$ cae drásticamente → gira cientos de veces por segundo (pulsar) |
| **Disco de hielo** | Un patinador extiende un brazo y gira lento; lo recoge y gira rápido |
| **El planeta Tierra** | La caída de masa atmosférica hacia los polos (por redistribución de hielo) cambia muy ligeramente la velocidad de rotación de la Tierra. La NASA ha medido este efecto: los días se acortan unos microsegundos |
| **Bicicleta estable a velocidad** | La rueda girando tiene un gran momento angular. Intentar inclinarla requiere un torque significativo, lo que da estabilidad direccional |

> **🌌 Imagina que...**
>
> > Si el Sol se colapsara hasta convertirse en una estrella de neutrones (sin perder masa), su radio pasaría de 700.000 km a ~10 km. Eso es reducir el radio **70.000 veces**. Su momento de inercia bajaría como $r^2$, es decir, ~$70.000^2 = 5 \times 10^9$ veces. Para conservar el momento angular, giraría **5.000 millones de veces más rápido**: de un giro cada ~25 días a ¡cientos de revoluciones por segundo! Eso es exactamente lo que observamos en los púlsares.

---

## 2.4 Equilibrio: cuando nada gira y nada se mueve

Cuando un objeto está completamente en reposo (sin traslación ni rotación), decimos que está en **equilibrio**. Para que esto ocurra, se deben cumplir **dos condiciones simultáneamente**:

### Condición 1: Equilibrio traslacional

$$\sum \vec{F} = 0$$

La suma vectorial de todas las fuerzas es cero (primera ley de Newton).

### Condición 2: Equilibrio rotacional

$$\sum \tau = 0$$

La suma de todos los torques respecto a **cualquier punto** es cero.

### Ejemplo: La barra y el balancín

Una barra de 4 m y 20 kg descansa sobre un soporte (fulcro) a 1,5 m de su extremo izquierdo. ¿Dónde debes colocar un peso de 30 kg para que el sistema esté en equilibrio?

```
         × fulcro
    |-------|---------------|
    0      1.5 m             4 m
    ↑      ↑                ↑
    A      PUNTO DE GIRO     B

    Peso de la barra actúa en su centro (2 m)
```

**Torques respecto al fulcro:**

| Elemento | Fuerza | Brazo | Dirección | Torque |
|:--------:|:------:|:-----:|:---------:|:------:|
| Peso barra izquierda (0,9 m) | 88 N | 0,6 m (izq.) | Horario | -52,8 N·m |
| Peso barra derecha (2,5 m) | 112 N | 1,0 m (der.) | Antihorario | +112 N·m |
| Peso de 30 kg | 294 N | x (desconocido) | ? | ? |

Para equilibrio: $-52{,}8 + 112 + \tau_{peso} = 0$

Si ponemos el peso a la izquierda del fulcro a distancia $d$:
$59{,}8 = 294 \times d \Rightarrow d = 0{,}20$ m → **20 cm a la izquierda del fulcro**

---

## 3.1 Aplicaciones reales sorprendentes

### 3.2 Giroscopios: la brújula del espacio

Un giroscopio es un disco que gira muy rápido sobre un eje. Sus propiedades son extraordinarias:

| Propiedad | Explicación | Aplicación |
|:---------:|:-----------|:----------:|
| **Rigidez direccional** | Un giroscopio que gira se resiste a cambiar la orientación de su eje | Brújulas en barcos, aviones (cuando no hay GPS) |
| **Precesión** | Cuando aplicas un torque a un giroscopio, no se cae: **orbita** alrededor del punto de apoyo | Bicicletas estables, sistemas de navegación de la ISS |

> **🍕 Experimento mental**
>
> > Sostén una rueda de bicicleta por el eje (con un mango en cada mano). Hazla girar rápido. Ahora intenta inclinarla. ¡Se resiste! Si empujas el eje hacia la izquierda, en vez de caerse, la rueda **orbita** hacia arriba (o abajo, dependiendo del sentido de giro). Eso es precesión, y es lo que mantiene tu bicicleta estable sin que te des cuenta.

### 3.3 Atletas rotacionales: ciencia del espín

| Deporte | Momento angular en acción |
|:-------:|:-------------------------:|
| **Patinaje artístico** | Brazos recogidos = giro rápido; brazos extendidos = giro lento |
| **Gimnasia** | El "doble twist" en salto se logra recogiendo el cuerpo al máximo |
| **Diving (clavados)** | Los clavadistas hacen giros imposibles recogiendo extremidades |
| **Fútbol americano** | El efecto (spiral) estabiliza el balón en vuelo por conservación de L |
| **Béisbol** | La rotación de la pelota (curveball, slider) genera fuerzas de Magnus |

### 3.4 El péndulo de Foucault: la Tierra gira bajo tus pies

En 1851, Léon Foucault colgó un péndulo de 67 metros en el Panteón de París. Lo puso a oscilar en un plano fijo. Horas después, el plano de oscilación había **rotado**. ¿El péndulo cambió? **No.** Fue la **Tierra** la que giró debajo.

Es la prueba más elegante de que la Tierra rota. Y funciona porque el momento angular del péndulo se conserva (en la dirección vertical): su plano permanece fijo en el espacio mientras la Tierra gira.

- En el **ecuador**: el plano no rota (respecto al suelo)
- En los **polos**: rota 360° en 24 horas
- En **París** (49° latitud): rota ~270° en 24 horas

---

## 🧠 Sistema Aeterna: ¿Qué acabas de aprender?

> **🧠 Sistema Aeterna, paso 1: Si gira, piensa en torque**
>
> > Cada vez que veas algo girando o intentando girar, pregúntate: "¿Dónde está el eje? ¿Dónde se aplica la fuerza? ¿A qué distancia?" Porque la respuesta determina el torque, y el torque determina todo lo demás.

> **🧠 Sistema Aeterna, paso 2: El momento de inercia lo es todo**
>
> > No es solo cuánta masa tienes, sino **dónde** está esa masa. Dos objetos con la misma masa pueden tener momentos de inercia radicalmente diferentes. Recuerda: la masa lejos del eje cuenta muchísimo más (¡al cuadrado!).

> **🧠 Sistema Aeterna, paso 3: Conservar es la clave maestra**
>
> > Sin torque externo, el momento angular no cambia. Punto. Esta ley explica desde estrellas de neutrones hasta por qué una bailarina gira más rápido al cerrar los brazos. Cuando veas algo acelerar su rotación sin empuje externo, ya sabes: su momento de inercia disminuyó y la naturaleza "conservó" el momento angular.

---

## ❓ Preguntas frecuentes sobre Torque y Momento Angular

> **❓ ¿Por qué la puerta se abre más fácil cuanto más lejos empujo?**
>
> Porque el torque es $\tau = r \times F$. Si duplicas la distancia al eje ($r$), duplicas el torque con la misma fuerza. Empujar en el borde de la puerta (a 80 cm del eje) genera 8 veces más torque que empujar en el pomo (a 10 cm).

> **❓ ¿Un objeto en rotación puede estar en equilibrio?**
>
> Sí, si gira a **velocidad angular constante** (sin aceleración angular) y no hay traslación. Un disco girando en el espacio sin fricción está en equilibrio rotacional: $\tau_{neto} = 0$ porque no cambia su velocidad de giro.

> **❓ ¿Por qué los ciclistas se inclinan en las curvas?**
>
> Para generar el torque necesario. La fuerza de fricción lateral (que empuja la bicicleta hacia el centro de la curva) actúa debajo del centro de gravedad. Eso genera un torque que tiende a tumbar al ciclista. Inclinándose, el ciclista equilibra ese torque con el de su propio peso. Es un equilibrio rotacional en movimiento.

> **❓ ¿El momento angular es un vector?**
>
> Sí, es un **pseudo-vector** (o vector axial). Apunta a lo largo del eje de rotación según la regla de la mano derecha: si enrollas los dedos en la dirección del giro, el pulgar apunta en la dirección de $\vec{L}$. En el caso de la Tierra, $\vec{L}$ apunta hacia el Polo Norte.

> **❓ ¿Puedo crear "energía" con el momento angular?**
>
> No. El momento angular y la energía son cantidades **diferentes** que se conservan de forma independiente. Puedes redistribuir el momento angular (cambiando tu momento de inercia), pero no puedes crear momento angular de la nada. Tampoco puedes crear energía: al recoger los brazos, la energía cinética rotacional **aumenta**, pero eso es porque hiciste **trabajo** con tus músculos al mover los brazos hacia dentro.

---

## ⚠️ Siguiente parada en la ruta

> **⚠️ Siguiente parada: Electromagnetismo Avanzado**
>
> Acabas de entender cómo los objetos que giran se comportan de formas contraintuitivas pero predecibles. Ahora vamos a explorar cómo la electricidad y el magnetismo están íntimamente conectados: cómo fluye la corriente, qué son los circuitos y por qué un imán en movimiento genera electricidad. [Sigue la ruta →](#)

---

**📚 Para seguir explorando:**
- *"Fundamentos de Física"* de Halliday, Resnick y Walker — Capítulo 10-12 (Rotación, Momento Angular) — La mejor secuencia de ejemplos progresivos.
- *"Veritasium — The Bizarre Behavior of Rotating Bodies"* (YouTube) — Explicación visual asombrosa de la precesión y el giroscopio.
- *"Practical Physics: Torque and Equilibrium"* — Experimentos con materiales caseros para entender torque.
- *"MinutePhysics: How does a spinning top work?"* — Explicación breve y elegante de la estabilidad rotacional.
- *Física Universitaria de Young y Freedman* — Capítulos 10-11 (Rotación de un cuerpo rígido) y 12 (Estática y Elasticidad).