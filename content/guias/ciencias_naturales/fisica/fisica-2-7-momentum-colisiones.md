---
title: "Momentum y Colisiones: Por qué un camión no se detiene como una bicicleta"
description: "Qué es el momentum (cantidad de movimiento), cómo se conserva y por qué las colisiones entre un mosquito y un camión tienen sorpresas. Impulso, colisiones elásticas e inelásticas explicadas desde cero."
slug: "momentum-colisiones"
author: "Aeterna"
category: "ciencias"
subcategory: "fisica"
tags: ["física", "momentum", "cantidad de movimiento", "impulso", "colisiones", "conservación", "elástica", "inelástica", "energía cinética", "fuerza", "tiempo"]
image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
date: "2026-05-11"
nivel: 2
orden: 7
nivel_titulo: "El Reino de lo Clásico"
insignia: "Señor de lo Clásico"
tipo: "theory"
prerequisites: ["cinematica", "leyes-newton-movimiento", "vectores"]
breadcrumb: ["El Reino de lo Clásico", "Momentum y Colisiones"]
---

## ▶️ Bienvenida: El mosquito que destruyó un camión (metafóricamente)

Imagina esto: un mosquito choca contra el parabrisas de un camión a 80 km/h.

Pregunta: ¿Quién sale peor parado?

La respuesta obvia es el mosquito. Pero hay algo mucho más profundo aquí. Ese mosquito, que pesa **2 miligramos**, genera la **misma fuerza** sobre el camión que el camión genera sobre él. Sí, has leído bien: la misma.

Entonces, si las fuerzas son iguales... ¿por qué el mosquito se hace puré y el camión ni se entera?

La respuesta está en una cantidad que la gente confunde constantemente con la fuerza: el **momentum** (o **cantidad de movimiento**). Y una vez que lo entiendas, verás el mundo de una forma completamente diferente. Podrás predecir el resultado de choques, entender por qué los airbags salvan vidas y hasta calcular qué pasaría si un asteroide golpeara la Tierra.

> **💡 La clave en 10 segundos**
>
> > El **momentum** ($p = m \cdot v$) mide "cuánto movimiento tiene un objeto". No depende solo de su masa ni solo de su velocidad, sino de **ambas cosas multiplicadas**. Un camión lento puede tener el mismo momentum que una bala rápida. Lo revolucionario es que **el momentum total de un sistema siempre se conserva**: no aparece ni desaparece, solo se transfiere.

---

<!-- ============================================ -->
<!-- CAPA 1: INTUICIÓN — QUÉ ES EL MOMENTUM -->
<!-- ============================================ -->

## 🌱 Capa I: Intuición — Más que "masa × velocidad"

### 1.1 ¿Por qué "cantidad de movimiento"?

Piensa en esto:
- Un niño de 30 kg corriendo a 3 m/s
- Un futbolista de 80 kg corriendo a 3 m/s

Ambos van a la **misma velocidad**. Pero si chocas con el futbolista, vas a volar. ¿Por qué?

Porque el futbolista tiene **más movimiento** que transferir. Eso es el momentum:

$$p = m \cdot v$$

| Objeto | Masa (kg) | Velocidad (m/s) | Momentum (kg·m/s) |
|:------:|:---------:|:----------------:|:------------------:|
| Niño corriendo | 30 | 3 | **90** |
| Futbolista corriendo | 80 | 3 | **240** |
| Mosquito volando | 0,000002 | 2 | **0,000004** |
| Coche en autopista | 1.500 | 30 | **45.000** |
| Asteroide (pequeño) | 1.000.000.000 | 15.000 | **15.000.000.000.000** |

**El momentum es un vector** (como todo lo que involucra velocidad). Tiene magnitud **y** dirección. Si un objeto va al norte a 10 m/s, su momentum apunta al norte. Si frena y va al sur a 10 m/s, su momentum es **opuesto**.

### 1.2 El impulso: la fuerza × el tiempo

Imagina que estás de pie y alguien te empuja suavemente durante 10 segundos. Ahora imagina que alguien te empuja con la **misma fuerza** durante solo 0,1 segundos (un golpe seco).

En ambos casos, la fuerza es igual. Pero el **efecto** es completamente diferente.

El **impulso** ($J$) captura esta diferencia:

$$J = F \cdot \Delta t$$

| Situación | Fuerza | Tiempo | Impulso | Resultado |
|:---------:|:------:|:------:|:-------:|:---------:|
| Empujón suave | 50 N | 10 s | **500 N·s** | Te desplazas lentamente |
| Golpe seco | 50 N | 0,1 s | **5 N·s** | Te tambaleas |
| Airbag | 5.000 N | 0,05 s | **250 N·s** | Te detienes "suavemente" |
| Sin airbag | 5.000 N | 0,005 s | **25 N·s** | Te detienes bruscamente 💀 |

**El truco:** el impulso es exactamente igual al **cambio de momentum**:

$$J = \Delta p = m \cdot v_f - m \cdot v_i$$

Esto se llama el **Teorema Impulso-Momentum**, y es una de las ecuaciones más poderosas de toda la física:

$$F \cdot \Delta t = m \cdot \Delta v$$

> **🧠 Dato que rompe el cerebro**
>
> > Un airbag **no reduce la fuerza** que actúa sobre ti. La fuerza del impacto sigue siendo enorme. Lo que hace el airbag es **aumentar el tiempo** de parada. En vez de detenerte en 0,005 segundos (golpe contra el volante), te detiene en 0,05 segundos (hundirte en la bolsa). Eso reduce la fuerza **10 veces**. Literalmente la diferencia entre vida y muerte.

### 1.3 Unidad del momentum

| Magnitud | Unidad en SI | Unidad "humana" |
|:--------:|:-----------:|:---------------:|
| Momentum | kg·m/s | — |
| Impulso | N·s | — |

**Nota curiosa:** kg·m/s y N·s son **la misma unidad** expresada de forma diferente:

$$1 \text{ N·s} = 1 \frac{\text{kg·m}}{\text{s²}} \times \text{s} = 1 \text{ kg·m/s}$$

---

<!-- ============================================ -->
<!-- CAPA 2: HERRAMIENTAS — CONSERVACIÓN DEL MOMENTUM -->
<!-- ============================================ -->

## 2.1 La ley de conservación del momentum

> **La ley más importante de esta sección:**
>
> *En un sistema aislado (sin fuerzas externas), el momentum total antes de una interacción es **igual** al momentum total después.*

$$\vec{p}_{total, antes} = \vec{p}_{total, después}$$

$$m_1 \vec{v}_{1i} + m_2 \vec{v}_{2i} = m_1 \vec{v}_{1f} + m_2 \vec{v}_{2f}$$

### ¿Por qué se conserva?

Es una consecuencia directa de la **Tercera Ley de Newton**: si el objeto A empuja al objeto B con fuerza $F$, el objeto B empuja al A con fuerza $-F$. Las fuerzas internas se cancelan, así que el momentum total **no cambia**.

> **❌ Error común**
>
> > **[El error]:** "El momentum se conserva siempre."
> >
> > **[La realidad]:** El momentum se conserva **solo en sistemas aislados** (sin fuerzas externas netas). Un coche chocando contra un muro **no** conserva momentum (el muro ejerce una fuerza externa). Pero dos hielos chocando sobre hielo sin fricción **sí** conservan momentum.

---

## 2.2 Colisiones elásticas: la perfección conservadora

Una **colisión elástica** conserva **tanto el momentum como la energía cinética**:

$$m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f} \quad \text{(momentum)}$$

$$\frac{1}{2}m_1 v_{1i}^2 + \frac{1}{2}m_2 v_{2i}^2 = \frac{1}{2}m_1 v_{1f}^2 + \frac{1}{2}m_2 v_{2f}^2 \quad \text{(energía cinética)}$$

### ¿Cuándo ocurre?

En la realidad, **nunca de forma perfecta**. Pero se aproxima bastante en:
- Choques entre billar (muy poca deformación, poco calor)
- Interacciones entre átomos y moléculas
- Pelotas de golf con el driver (con "efecto de resorte" del material)

### Resultados de una colisión elástica (una dimensión)

Si un objeto de masa $m_1$ choca con $m_2$ (en reposo), las velocidades finales son:

$$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} \cdot v_{1i}$$

$$v_{2f} = \frac{2m_1}{m_1 + m_2} \cdot v_{1i}$$

**Casos especiales que debes memorizar:**

| Situación | ¿Qué pasa? | Ejemplo |
|:---------:|:-----------:|:-------:|
| $m_1 = m_2$ | El primero se **detiene** y el segundo sale con $v_{1i}$ | Bolas de billar: una choca a otra en reposo → la primera se para, la segunda sale |
| $m_1 \gg m_2$ | El pesado **sigue igual**, el liviano sale a $\approx 2v_{1i}$ | Un camión chocando una pelota de tenis |
| $m_1 \ll m_2$ | El liviano **rebota** con velocidad $\approx -v_{1i}$ | Una pelota de tenis contra una pared |

> **🏓 Ejemplo resuelto: Billar**
>
> Una bola blanca (0,17 kg) viaja a 2 m/s y golpea una bola roja (0,17 kg) en reposo. ¿Con qué velocidad sale cada una?
>
> Como $m_1 = m_2$:
> - La blanca se **detiene**: $v_{1f} = 0$ m/s
> - La roja sale a **2 m/s**: $v_{2f} = 2$ m/s
>
> Esto es exactamente lo que ves cuando juegas billar. La bola blanca "transfiere" todo su momentum a la otra.

---

## 2.3 Colisiones inelásticas: se pierde energía, pero no momentum

En una **colisión inelástica**, el momentum se conserva, pero **la energía cinética NO**. Parte se convierte en calor, sonido, deformación, etc.

$$m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}$$

### Colisión perfectamente inelástica: se pegan

El caso extremo es cuando los dos objetos **se pegan** y se mueven juntos:

$$m_1 v_{1i} + m_2 v_{2i} = (m_1 + m_2) \cdot v_f$$

$$v_f = \frac{m_1 v_{1i} + m_2 v_{2i}}{m_1 + m_2}$$

**Ejemplo resuelto: Choque de trenes de juguete**

Un tren de 5 kg viaja a 4 m/s y choca con otro de 3 kg que viene en sentido opuesto a 2 m/s. Se pegan. ¿A qué velocidad se mueven?

**Planteamiento:** Tomamos "derecha" como positiva.
- $p_{antes} = 5 \times 4 + 3 \times (-2) = 20 - 6 = 14 \text{ kg·m/s}$
- $p_{después} = (5+3) \cdot v_f = 8 \cdot v_f$
- $v_f = \frac{14}{8} = 1{,}75 \text{ m/s (hacia la derecha)}$

**¿Cuánta energía se "perdió"?**

| Energía | Valor |
|:-------:|:-----:|
| Cinética antes | $\frac{1}{2}(5)(4^2) + \frac{1}{2}(3)(2^2) = 40 + 6 = 46$ J |
| Cinética después | $\frac{1}{2}(8)(1{,}75^2) = 12{,}25$ J |
| **Energía "perdida"** | **33,75 J** → calor + deformación + sonido |

> **🌍 Dato cotidiano**
>
> > Un **accidente de coche** es una colisión inelástica. Los coches están diseñados para **deformarse** (absorber energía), alargando el tiempo de impacto y reduciendo la fuerza sobre los ocupantes. Un coche rígido que no se deformara sería **más peligroso**, no menos, porque toda la energía iría directamente a tus órganos. Los parachoques arrugados después de un choque no son un defecto: son la prueba de que hicieron su trabajo.

---

## 2.4 El diagrama de cuerpo libre del momentum

Cuando analizas colisiones, dibujar los momentums **antes y después** es esencial. Aquí una plantilla:

```
ANTES:                          DESPUÉS:

  m₁ ───→ v₁ᵢ                    m₁ ───→ v₁f
                                
  m₂ ───→ v₂ᵢ                    m₂ ───→ v₂f
  
  p_total = m₁v₁ᵢ + m₂v₂ᵢ      p_total = m₁v₁f + m₂v₂f
  (misma dirección)              (conservado)
```

**Para 2D** (colisiones oblicuas), aplica la conservación **por separado** en X e Y:

$$p_{ix,total} = p_{fx,total}$$
$$p_{iy,total} = p_{fy,total}$$

Esto te da **dos ecuaciones** para resolver **dos incógnitas** (normalmente las velocidades finales o los ángulos).

---

## 3.1 Aplicaciones: El momentum en el mundo real

### 3.1 Cohetes: empujarse uno a sí mismos

Un cohete funciona **sin empujar nada externo**. Expulsa gases a alta velocidad hacia atrás, y por conservación del momentum, el cohete avanza hacia adelante.

$$m_{cohete} \cdot \Delta v = v_{gas} \cdot \Delta m_{combustible}$$

Esta es la **ecuación de Tsiolkovsky**, la que permite calcular cuánto puede acelerar un cohete según cuánto combustible lleve. Por eso los cohetes tienen **tantísimo combustible** y tan poca estructura útil.

### 3.2 Carros de choque y atracciones

Los carros de choque de las ferias miden deliberadamente la diferencia entre colisiones elásticas (con los parachoques de goma, que "rebotan") e inelásticas (cuando los carros quedan pegados por la inercia). Ambos son divertidos, pero físicamente son fenómenos completamente distintos.

### 3.3 El efecto látigo

¿Por qué un látigo produce un sonido tan fuerte (el "crack")? La punta del látigo se mueve **más rápido que el sonido** (~343 m/s). Cuando la punta frena bruscamente, genera una onda de choque. Esto es momentum en acción: la masa diminuta de la punta viaja a velocidades enormes, y al frenar transfiere su momentum al aire de forma explosiva.

### 3.4 Deportes

| Deporte | Momento clave del momentum |
|:-------:|:--------------------------:|
| Billar | Transferencia directa de momentum entre bolas |
| Boxeo | Un golpe potente = mucha masa del brazo × alta velocidad |
| Fútbol americano | Los bloqueos buscan transferir momentum al rival |
| Tenis | El "efecto" de la raqueta cambia el momentum angular de la pelota |
| Golf | El driver maximiza la transferencia de momentum al golpear |

> **🧠 Dato que rompe el cerebro**
>
> > Cuando bateas un balón de béisbol a 150 km/h, la pelota experimenta una **aceleración de ~5.000 g** durante los 0,001 segundos que dura el contacto con el bate. El cambio de momentum es tan violento que la pelota se deforma visiblemente en cámara lenta. Todo eso se rige por las mismas ecuaciones que acabamos de ver.

---

## 🧠 Sistema Aeterna: ¿Qué acabas de aprender?

> **🧠 Sistema Aeterna, paso 1: Piensa en momentum, no solo en velocidad**
>
> > Un mosquito y un camión a la misma velocidad **no son lo mismo**. El momentum ($p = mv$) captura la "cantidad de movimiento" total. Siempre que analices un choque o una colisión, tu primer instinto debe ser: "¿cuál es el momentum total del sistema?"

> **🧠 Sistema Aeterna, paso 2: El tiempo es tu amigo (o tu enemigo)**
>
> > El impulso ($F \cdot \Delta t$) te dice que la misma transferencia de momentum puede ser un golpe mortal o un empujón inofensivo, dependiendo del **tiempo**. Airbags, colchonetas, cascos... todos funcionan alargando el tiempo de impacto. Más tiempo = menos fuerza. Menos tiempo = más fuerza (¡peligro!).

> **🧠 Sistema Aeterna, paso 3: El momentum no se crea ni se destruye**
>
> > En un sistema aislado, el momentum total **siempre** se conserva. Antes y después de cualquier colisión, el momentum es el mismo. Esta es la herramienta más poderosa para resolver problemas de choques sin conocer los detalles de la fuerza.

---

## ❓ Preguntas frecuentes sobre Momentum y Colisiones

> **❓ ¿Por qué el momentum se conserva si hay fuerzas en la colisión?**
>
> Porque las fuerzas **internas** entre los objetos que chocan son iguales y opuestas (Tercera Ley de Newton). Se cancelan mutuamente. Solo las **fuerzas externas** (como la fricción con el suelo o la gravedad) pueden cambiar el momentum total. Si ignoramos esas fuerzas (que suelen ser pequeñas durante el breve instante de la colisión), el momentum se conserva.

> **❓ ¿Una colisión elástica ocurre en la vida real?**
>
> Casi nunca de forma perfecta. Pero algunas se acercan mucho: billar, péndulos de Newton (las bolitas de metal que rebotan), átomos chocando en un gas ideal, y protones en un acelerador de partículas. La clave es que la deformación y el calor generados sean mínimos comparados con la energía cinética.

> **❓ ¿Qué pasa si un objeto está en reposo y otro choca contra él? ¿Se reparte el momentum?**
>
> Sí. El objeto en reposo tiene momentum inicial = 0. Después de la colisión, recibe parte (o todo) del momentum del objeto que chocó. En una colisión elástica entre iguales, el primero se detiene y el segundo sale volando con toda la velocidad. Si el objeto en reposo es **mucho más pesado**, el que choca simplemente rebota.

> **❓ ¿Por qué los airbags salvan vidas si la fuerza del impacto sigue siendo la misma?**
>
> El airbag **no reduce el cambio de momentum** (tu cuerpo debe pasar de velocidad alta a cero de todas formas). Lo que hace es **aumentar el tiempo** durante el que ocurre ese cambio. En vez de detenerte en 0,005 segundos (contra el volante), te detienes en 0,05 segundos (hundido en la bolsa). F = Δp/Δt: si Δt crece 10 veces, la fuerza se reduce 10 veces. Eso es la diferencia entre sobrevivir y no hacerlo.

> **❓ ¿El momentum se conserva en una explosión?**
>
> ¡Sí! Una explosión es una colisión "al revés": en vez de juntarse, los trozos se separan. Si una bomba en reposo estalla en 3 pedazos, el momentum vectorial de los 3 pedazos sumados es **cero** (el momentum antes era cero). Por eso los fragmentos salen en todas direcciones de forma que se "compensan" entre sí.

---

## ⚠️ Siguiente parada en la ruta

> **⚠️ Siguiente parada: Torque y Momento Angular**
>
> Acabas de aprender cómo el movimiento "lineal" se conserva en las colisiones. ¿Pero qué pasa con las **rotaciones**? Cuando una bailarina recoge los brazos durante un giro, gira más rápido. Cuando un planeta orbita el Sol, no cae hacia él. Todo esto se explica con el **momento angular** y el **torque**: las versiones rotacionales del momentum y la fuerza. [Sigue la ruta →](#)

---

**📚 Para seguir explorando:**
- *"Fundamentos de Física"* de Halliday, Resnick y Walker — Capítulo 9 (Momentum) tiene la mejor secuencia de ejemplos progresivos que existe.
- *"Veritasium — What is Momentum?"* (YouTube) — Explicación visual increíblemente intuitiva.
- *"3Blue1Brown — But what is a derivative?"* — Para entender la relación entre impulso (F×t) y cambio de momentum desde el punto de vista del cálculo.
- *"PhET Simulation: Collision Lab"* (phet.colorado.edu) — Laboratorio virtual donde puedes chocar objetos, ajustar masas y velocidades, y verificar la conservación del momentum en tiempo real.
- *Física Universitaria de Young y Freedman* — Capítulo 8: Momentum, Impulso y Colisiones. Referencia estándar universitaria con cientos de problemas graduados.