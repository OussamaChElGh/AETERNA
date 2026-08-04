---
title: "Mecánica Clásica: La Física del Movimiento y las Fuerzas"
description: "Descubre las leyes de Newton, la cinemática, la dinámica, el trabajo, la energía y los fluidos. De la manzana que cae a las órbitas planetarias: la guía más completa."
slug: mecanica-clasica
author: Anektia
category: ciencias
subcategory: fisica
tags: ["física", "mecánica clásica", "leyes de Newton", "cinemática", "dinámica", "trabajo y energía", "fluidos", "momento angular", "sistemas no inerciales", "principio de Arquímedes"]
image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
date: 2026-05-07
nivel: 2
orden: 1
nivel_titulo: El Reino de lo Clásico
tipo: theory
prerequisites: ["como-piensa-un-fisico", "vectores"]
breadcrumb: ["El Reino de lo Clásico", "Mecánica Clásica"]
---


<NivelActivo id="fundamentos">

## ▶️ Bienvenida: El movimiento, el misterio más cotidiano

Todo se mueve. El suelo que pisas gira a 1.600 km/h sobre el eje terrestre. La Tierra se precipita alrededor del Sol a 107.000 km/h. Tu sangre serpentea por venas y arterias. Los electrones zumban en sus orbitales atómicos. El aire vibra con cada sonido. Nada está quieto, nunca.

Y sin embargo, durante milenios, nadie supo explicar por qué.

Hizo falta que Galileo Galilei apuntara un telescopio al cielo y midiera el tiempo con el pulso de su muñeca. Hizo falta que Isaac Newton, encerrado en su casa de Woolsthorpe durante la Gran Peste de 1665, formulara tres leyes que cambiaron para siempre nuestra comprensión del universo. La **mecánica clásica** es el fruto de ese esfuerzo colectivo: la teoría más precisa jamás concebida para describir el movimiento de todo lo que nos rodea.

> **💡 La clave en 10 segundos**
>
> La mecánica clásica se despliega en tres actos: **cinemática** (describe el movimiento), **dinámica** (explica qué lo causa) y **energía** (cuantifica lo que se transforma). Todo encaja gracias a tres leyes que son tan simples como profundas.

En esta parada exploraremos desde el vuelo de una pelota de tenis hasta la danza de los planetas, desde la presión que sostiene un avión en el aire hasta la razón por la que flota un barco de acero. Prepárate para ver el mundo con otros ojos.

![Péndulo de Foucault y el Cosmos](https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000)
*Desde el péndulo de Galileo hasta las órbitas de las galaxias: un solo conjunto de leyes lo explica todo.*

---

<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la mecánica clásica describe el movimiento con cinemática (cómo), dinámica (por qué, F = ma), trabajo y energía (la moneda del universo), y se extiende a fluidos y rotación. Es exacta para el mundo cotidiano y la base de la ingeniería, aunque falla a velocidades cercanas a la luz y a escala atómica.
</PedagogicalContentBlock>

---

## 1. Cinemática: el lenguaje del movimiento

Antes de preguntarnos *por qué* se mueve algo, necesitamos describir *cómo* se mueve. La cinemática es el alfabeto de la mecánica: nos proporciona las herramientas para medir y predecir trayectorias sin preocuparnos de sus causas. Es como describir la coreografía de un ballet sin preguntarnos qué fuerza impulsa a los bailarines.

### 1.1 Las palabras del movimiento

| Magnitud | Símbolo | ¿Qué significa? | Unidad (SI) | ¿Vector o escalar? |
| :--- | :--- | :--- | :--- | :--- |
| **Posición** | x, r | Dónde está el objeto en cada instante | metro (m) | Vector |
| **Desplazamiento** | Δx, Δr | Cuánto ha cambiado la posición | metro (m) | Vector |
| **Velocidad** | v | Lo rápido que cambia la posición | m/s | Vector |
| **Aceleración** | a | Lo rápido que cambia la velocidad | m/s² | Vector |
| **Tiempo** | t | La duración del movimiento | segundo (s) | Escalar |

> **💡 Velocidad y aceleración no son lo mismo**
>
> Puedes ir a 300 km/h en un tren de alta velocidad con aceleración cero (velocidad constante). Y puedes estar parado en un semáforo con velocidad cero y acelerar bruscamente cuando se pone verde. La velocidad te dice cómo te mueves ahora; la aceleración te dice cómo cambiará ese movimiento.

```aeterna-exercise
TITLE: El punto más alto de la trayectoria
HINT: En el punto más alto, la pelota se detiene un instante antes de caer. Pero la gravedad nunca deja de actuar.
XP: 50
Si lanzas una pelota verticalmente hacia arriba, ¿qué ocurre con su velocidad y su aceleración en el punto más alto de su trayectoria?
```

### 1.2 Los tres movimientos fundamentales

La cinemática clásica distingue tres tipos de movimiento ideal:

**Movimiento Rectilíneo Uniforme (MRU):** Sin aceleración, sin cambios de dirección. Un objeto en línea recta a velocidad constante. Es el más simple y, en el mundo real, el más raro.

**Movimiento Rectilíneo Uniformemente Acelerado (MRUA):** Aquí aparece la aceleración constante. Es el movimiento de una manzana que cae, de un coche que acelera o frena, de un proyectil que surca el aire.

**Movimiento Circular Uniforme (MCU):** Un objeto gira alrededor de un punto a velocidad angular constante. La Luna alrededor de la Tierra. Un ventilador. Aunque la velocidad lineal sea constante en módulo, siempre hay aceleración centrípeta apuntando hacia el centro. Sin ella, el objeto saldría disparado en línea recta por pura inercia.

### 1.3 El arte de leer gráficas

Las gráficas de movimiento son como partituras musicales: contienen toda la información codificada. Interpretarlas es tan importante como conocer las ecuaciones.

| Gráfica | El eje vertical muestra | La pendiente es | El área bajo la curva es |
| :--- | :--- | :--- | :--- |
| **Posición vs. Tiempo** | Dónde está | La velocidad | — |
| **Velocidad vs. Tiempo** | Lo rápido que va | La aceleración | El desplazamiento |
| **Aceleración vs. Tiempo** | Cómo cambia la velocidad | — | El cambio de velocidad |

![Trayectoria y movimiento](https://images.unsplash.com/photo-1542291026-7eec264c27fc?auto=format&fit=crop&q=80&w=2000)
*Las gráficas de movimiento cuentan la historia completa de un objeto: dónde está, cómo se mueve y cómo cambia su movimiento.*

---

---

## 2. Dinámica: las leyes de Newton

La cinemática describe; la dinámica explica. ¿Qué causa el movimiento? ¿Por qué un objeto acelera o se detiene? En 1687, Isaac Newton publicó las respuestas en los *Principia Mathematica*, el libro que fundó la física moderna.

### 2.1 Primera Ley: La Inercia

> **"Todo cuerpo persevera en su estado de reposo o de movimiento uniforme y en línea recta, salvo que una fuerza externa neta lo obligue a cambiar."**

Parece simple. Pero es una idea revolucionaria. Desde Aristóteles se pensaba que el estado natural de las cosas era el reposo, y que para mantener algo en movimiento hacía falta una fuerza constante. Newton dijo lo contrario: el reposo y el movimiento uniforme son el mismo estado. Lo que requiere explicación no es el movimiento, sino el **cambio** de movimiento.

Cuando un autobús frena y tu cuerpo sale despedido hacia adelante, no es que una fuerza misteriosa te empuje. Es tu inercia, que se resiste a cambiar.

### 2.2 Segunda Ley: La Ecuación del Universo

> **"La aceleración de un objeto es directamente proporcional a la fuerza neta que actúa sobre él, e inversamente proporcional a su masa."**

```aeterna-formula
title="Segunda Ley de Newton"
formula="\vec{F} = m \cdot \vec{a}"
variables={[{"symbol":"F","name":"Fuerza neta","unit":"N"},{"symbol":"m","name":"Masa","unit":"kg"},{"symbol":"a","name":"Aceleración","unit":"m/s²"}]}
note="Conecta la fuerza (la causa), la masa (la resistencia al cambio) y la aceleración (el efecto)."
```

Esta ecuación modesta es una de las más poderosas de la historia. Si conoces dos de las tres magnitudes, puedes calcular la tercera. Casi toda la ingeniería y la mecánica se derivan de esta línea.

```aeterna-exercise
TITLE: El coche y el camión
HINT: Piensa en la relación entre la masa y la aceleración cuando la fuerza es la misma.
XP: 50
Si empujas a la vez un coche pequeño (poco masivo) y un camión grande (muy masivo) con la misma fuerza neta, ¿cuál acelerará más?
```

### 2.3 Tercera Ley: Acción y Reacción

> **"A toda acción se opone siempre una reacción igual y contraria."**

Las fuerzas nunca actúan solas. Si empujas una pared, la pared te empuja a ti con la misma fuerza. La Tierra atrae a la Luna; la Luna atrae a la Tierra con la misma intensidad. Un cohete expulsa gases hacia abajo; los gases empujan el cohete hacia arriba. Por eso los cohetes funcionan en el vacío del espacio: no necesitan apoyarse en nada, solo necesitan expulsar algo en dirección contraria.

![Lanzamiento de cohete espacial](https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=2000)
*Sin la tercera ley de Newton, los viajes espaciales serían imposibles: el cohete no se apoya en el aire, sino en la expulsión de sus propios gases.*

---

<Connect title="De la mecánica al electromagnetismo" sourceConcept="Fuerza de Newton" targetConcept="Fuerza de Lorentz">
La mecánica clásica no solo describe fuerzas mecánicas: la fuerza de Lorentz (F = qv×B) se aplica con las mismas leyes de Newton a partículas cargadas en campos. El método —diagramas de cuerpo libre + F = ma— es universal, sea la fuerza gravitatoria, eléctrica o magnética.
</Connect>

---

## 3. Trabajo y energía: la moneda del universo

Si las leyes de Newton son el motor de la mecánica, la energía es su combustible. La energía es la capacidad de realizar trabajo, y el trabajo es lo que ocurre cuando una fuerza desplaza un objeto.

### 3.1 Trabajo mecánico

```aeterna-formula
title="Trabajo mecánico"
formula="W = F \cdot d \cdot \cos(\theta)"
variables={[{"symbol":"W","name":"Trabajo","unit":"J"},{"symbol":"F","name":"Fuerza","unit":"N"},{"symbol":"d","name":"Desplazamiento","unit":"m"},{"symbol":"θ","name":"Ángulo entre fuerza y desplazamiento","unit":"°"}]}
```

No toda fuerza realiza trabajo. Para que haya trabajo, la fuerza debe tener una componente en la dirección del desplazamiento. Sostener una maleta en el andén agota tus músculos, pero no realizas trabajo mecánico porque el desplazamiento es cero. La física y el esfuerzo muscular no siempre coinciden.

```aeterna-exercise
TITLE: La caja sobre tu cabeza
HINT: El trabajo mecánico necesita desplazamiento. ¿Cuánto se mueve la caja mientras esperas?
XP: 50
Estás sosteniendo una pesada caja de 50 kg sobre tu cabeza mientras esperas el autobús durante 10 minutos. ¿Cuánto trabajo mecánico estás realizando sobre la caja?
```

### 3.2 Energía cinética y potencial

La **energía cinética** es la del movimiento. Un coche, un electrón, una galaxia: todo lo que se mueve la posee.

$$E_k = \frac{1}{2} m v^2$$

Duplica la velocidad y la energía se cuadruplica. Por eso los accidentes de tráfico son tan sensibles a la velocidad.

La **energía potencial gravitatoria** es la energía almacenada por ocupar una posición en un campo gravitatorio. Un libro en una estantería, el agua retenida en una presa, una manzana a punto de caer.

$$E_p = m \cdot g \cdot h$$

### 3.3 La gran conservación

En ausencia de rozamiento, la suma de energía cinética y potencial se conserva. Lo que se pierde de una se gana en la otra. Una montaña rusa es la demostración perfecta: en la cima la energía potencial es máxima y la cinética mínima; en el valle ocurre lo contrario.

La energía no se crea ni se destruye: solo cambia de disfraz.

![Vías de una montaña rusa](https://images.unsplash.com/photo-1513077759247-f39b6e8eab70?auto=format&fit=crop&q=80&w=2000)
*En una montaña rusa ideal, la energía mecánica total permanece constante. La física y la diversión son la misma cosa.*

---

<Transfer targetDomain="Ingeniería mecánica" title="Transfiere: diseña un sistema de poleas">
Usando F = ma y los diagramas de cuerpo libre, analiza un sistema de poleas que eleva una carga de 200 kg. ¿Qué fuerza mínima necesita el operador? ¿Cómo cambia si usas una polea móvil (que duplica la ventaja mecánica)? Aplica el teorema trabajo-energía para relacionar la distancia que tira el operador con la altura que sube la carga.
</Transfer>

---

## 4. Estática de fluidos: la física del agua y el aire

Los fluidos —líquidos y gases— también obedecen las leyes de Newton, pero lo hacen de forma colectiva y a menudo contraintuitiva. La estática de fluidos estudia qué ocurre cuando un fluido está en reposo, y sus principios explican desde el vuelo de un globo aerostático hasta la flotación de un transatlántico.

### 4.1 Presión: la fuerza invisible

La presión es fuerza repartida sobre área:

$$P = \frac{F}{A}$$

Se mide en pascales (Pa). La presión atmosférica al nivel del mar —unos 101.325 Pa— significa que sobre cada metro cuadrado de tu piel se ejerce una fuerza equivalente al peso de un coche pequeño. No te aplasta porque tu cuerpo ejerce una presión igual desde dentro hacia fuera.

### 4.2 Principio de Pascal

> **"Un cambio de presión en un punto de un fluido incompresible se transmite íntegramente a todos los puntos del fluido."**

Esto es lo que permite que los frenos de tu coche funcionen: la presión que ejerces sobre el pedal se transmite instantáneamente a las pastillas de freno. También es el fundamento de las prensas hidráulicas, que multiplican fuerzas hasta límites industriales.

### 4.3 Principio de Arquímedes

> **"Todo cuerpo sumergido en un fluido experimenta un empuje vertical hacia arriba igual al peso del fluido desalojado."**

Este principio explica por qué flotan los objetos. Un barco de acero de 100.000 toneladas no flota a pesar de ser de acero, sino porque su casco desplaza un volumen de agua que pesa más de 100.000 toneladas. Si el peso del agua desalojada es mayor que el peso del barco, el barco flota. Es así de simple.

```aeterna-exercise
TITLE: El cubo de hielo
HINT: Piensa en el peso del agua que desplaza el cubo mientras está sumergido.
XP: 50
¿Por qué un cubo de hielo flota en un vaso de agua?
```

---

---

## 5. Sistemas en rotación: el giro del mundo

Hasta ahora hemos tratado los objetos como puntos sin tamaño. Pero el mundo real está lleno de cuerpos que giran: planetas, peonzas, ruedas, electrones. La mecánica rotacional es la extensión natural de las leyes de Newton a los objetos que rotan.

### 5.1 Momento angular

El momento angular es el equivalente rotacional del momento lineal. Describe cuánto "giro" posee un sistema:

$$L = I \cdot \omega$$

Y, al igual que el momento lineal, se conserva en ausencia de influencias externas. Es una de las leyes de conservación más profundas del universo.

### 5.2 La patinadora y la conservación

Cuando una patinadora gira con los brazos extendidos y luego los encoge, su velocidad de giro aumenta drásticamente. ¿Por qué? Porque su momento de inercia (I) disminuye al acercar la masa al eje de rotación, y para conservar el momento angular (L), la velocidad angular (ω) debe aumentar. La misma ley explica por qué una estrella que colapsa puede pasar de girar lentamente a rotar cientos de veces por segundo como un púlsar.

---

---

## 6. Más allá de lo clásico: dónde falla Newton

La mecánica clásica es extraordinariamente precisa para el mundo humano. Pero a principios del siglo XX, los físicos descubrieron que falla en tres fronteras:

| Frontera | Qué falla | Quién la corrigió |
| :--- | :--- | :--- |
| **Velocidades cercanas a la luz** | La velocidad no se suma linealmente; la masa crece con la velocidad | Einstein (Relatividad Especial) |
| **El mundo subatómico** | La posición y la velocidad no pueden conocerse simultáneamente con precisión | Schrödinger, Heisenberg (Mecánica Cuántica) |
| **Campos gravitatorios intensos** | La gravedad newtoniana no explica la órbita de Mercurio | Einstein (Relatividad General) |

La mecánica clásica no es "falsa". Es un modelo excelente para el 99,9% de nuestra experiencia cotidiana. Pero como todo modelo, tiene un dominio de validez. Saber cuándo deja de funcionar es tan importante como saber cuándo funciona.

---

---

## 🧠 Sistema Anektia: ¿Qué acabas de aprender?

> **🧠 Sistema Anektia, paso 1: Describe antes de explicar**
>
> > La cinemática describe el movimiento; la dinámica lo explica. Antes de preguntarte *por qué* algo se mueve, aprende a narrar *cómo* se mueve: posición, velocidad, aceleración. El orden importa: no puedes explicar lo que no sabes describir.

> **🧠 Sistema Anektia, paso 2: Busca lo que se conserva**
>
> > La energía y el momento angular no se crean ni se destruyen. Cuando un problema parece imposible, pregunta: ¿qué se está conservando aquí? Las leyes de conservación son las herramientas más poderosas de la física.

> **🧠 Sistema Anektia, paso 3: Conoce los límites de tu modelo**
>
> > La mecánica clásica funciona para el 99,9% de la vida cotidiana, pero falla a velocidades extremas y en el mundo subatómico. Todo modelo tiene un dominio de validez. Saber cuándo usarlo —y cuándo no— es la marca del pensador riguroso.

---

---

## ❓ Preguntas frecuentes sobre Mecánica Clásica

> **❓ ¿Cuáles son las tres leyes de Newton?**
>
> 1ª (Inercia): un objeto mantiene su velocidad constante si no actúa una fuerza neta sobre él. 2ª (F = ma): la aceleración es proporcional a la fuerza neta e inversamente proporcional a la masa. 3ª (Acción-Reacción): las fuerzas siempre vienen en pares iguales y opuestos.

> **❓ ¿Cuál es la diferencia entre velocidad y aceleración?**
>
> La velocidad describe cómo cambia la posición. La aceleración describe cómo cambia la velocidad. Son magnitudes independientes: puedes tener mucha velocidad y cero aceleración, o cero velocidad y mucha aceleración.

> **❓ ¿Por qué los astronautas flotan en la Estación Espacial Internacional?**
>
> No es porque no haya gravedad. A 400 km de altura, la gravedad terrestre es todavía el 90% de la que sentimos en la superficie. Los astronautas flotan porque están en caída libre perpetua alrededor de la Tierra, igual que un ascensor que se desploma.

> **❓ ¿Cómo funciona el principio de Arquímedes?**
>
> Un objeto sumergido en un fluido recibe un empuje hacia arriba igual al peso del fluido desplazado. Si el peso del objeto es menor que ese empuje, flota. Si es mayor, se hunde. Los barcos flotan porque su densidad media —contando el aire dentro del casco— es menor que la del agua.

> **❓ ¿Qué quiere decir que la energía se conserva?**
>
> La energía no se crea ni se destruye, solo se transforma. La energía química de la gasolina se convierte en energía cinética del coche, y esta en calor por fricción. La cantidad total de energía del universo es constante.

---

---

## ⚠️ Siguiente parada en la ruta

> **⚠️ Siguiente parada: Termodinámica**
>
> Ya sabes cómo se mueven las cosas cuando la energía mecánica se conserva. Pero, ¿qué ocurre cuando no es así? ¿Por qué el tiempo avanza en una sola dirección? ¿Qué es exactamente la entropía y por qué el universo tiende al desorden? En la siguiente parada entrarás en el terreno del calor, las máquinas térmicas y la segunda ley que explica por qué nada —absolutamente nada— es gratis. [Sigue la ruta →](#)

---

**📚 Para seguir explorando:**
- *"Fundamentos de Física"* de Halliday, Resnick y Walker — El manual universitario estándar, con capítulos impecables de mecánica.
- *"Six Easy Pieces"* de Richard Feynman — Capítulo brillante sobre las leyes del movimiento, con la claridad del mejor divulgador de la física.
- *"The Mechanical Universe"* (serie) — Las lecciones de física clásica del Caltech, con demostraciones históricas.
- *PhET Simulations* (phet.colorado.edu) — Simuladores interactivos de fuerzas, energía y fluidos.
- *The Physics Classroom* (physicsclassroom.com) — Explicaciones claras y animadas de toda la mecánica clásica.

</NivelActivo>


<NivelActivo id="profundizacion">

## ▶️ Bienvenida: El movimiento, el misterio más cotidiano

Todo se mueve. El suelo que pisas gira a 1.600 km/h sobre el eje terrestre. La Tierra se precipita alrededor del Sol a 107.000 km/h. Tu sangre serpentea por venas y arterias. Los electrones zumban en sus orbitales atómicos. El aire vibra con cada sonido. Nada está quieto, nunca.

Y sin embargo, durante milenios, nadie supo explicar por qué. La **mecánica clásica** —el fruto del trabajo de Galileo y Newton— es la teoría más precisa jamás concebida para describir el movimiento de todo lo que nos rodea: predice la órbita de un cometa con precisión de kilómetros y la trayectoria de una bala con precisión de centímetros.

> **💡 La clave en 10 segundos**
>
> La mecánica clásica se despliega en tres actos: **cinemática** (describe el movimiento), **dinámica** (explica qué lo causa) y **energía** (cuantifica lo que se transforma). A estas tres columnas se suman dos extensiones poderosas: la **estática de fluidos** y los **sistemas en rotación**. Todo encaja gracias a tres leyes tan simples como profundas.

En esta parada exploraremos desde el vuelo de una pelota de tenis hasta la danza de los planetas, desde la presión que sostiene un avión en el aire hasta la razón por la que flota un barco de acero.

![Péndulo de Foucault y el Cosmos](https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000)
*Desde el péndulo de Galileo hasta las órbitas de las galaxias: un solo conjunto de leyes lo explica todo.*

---

<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la mecánica clásica describe el movimiento con cinemática (cómo), dinámica (por qué, F = ma), trabajo y energía (la moneda del universo), y se extiende a fluidos y rotación. Es exacta para el mundo cotidiano y la base de la ingeniería, aunque falla a velocidades cercanas a la luz y a escala atómica.
</PedagogicalContentBlock>

---

## 1. Cinemática: el lenguaje del movimiento

La cinemática es el **lenguaje del movimiento**: describe *cómo* se mueve algo sin preguntarse *por qué*. Es el primer piso del edificio de la mecánica.

### 1.1 Las magnitudes del movimiento

La velocidad instantánea es la derivada de la posición respecto al tiempo:

$$\vec{v} = \frac{d\vec{r}}{dt}$$

Y la aceleración instantánea es la derivada de la velocidad:

$$\vec{a} = \frac{d\vec{v}}{dt}$$

Si la aceleración es constante (MRUA), estas tres ecuaciones lo resuelven casi todo:

$$v = v_0 + a \cdot t$$

$$x = x_0 + v_0 \cdot t + \frac{1}{2}a \cdot t^2$$

$$v^2 = v_0^2 + 2a(x - x_0)$$

> **🧠 Truco de memoria:** Cada ecuación "esconde" una variable distinta: la 1ª no tiene $x$, la 2ª no tiene $v$ final, la 3ª no tiene $t$. Elige la que tenga solo **una incógnita**.

### 1.2 Caída libre: la prueba de Galileo

Cerca de la superficie terrestre, todos los cuerpos caen con la misma aceleración (ignorando la resistencia del aire):

$$a = g \approx 9{,}8 \text{ m/s}^2 \text{ (hacia abajo)}$$

**Ejemplo:** Sueltas una pelota desde lo alto de un edificio de 80 metros. ¿Cuánto tarda en llegar al suelo?

$$0 = 80 + 0 \cdot t - \frac{1}{2}(9{,}8)t^2$$

$$t = \sqrt{\frac{2 \times 80}{9{,}8}} = 4{,}04 \text{ segundos}$$

### 1.3 Movimiento en 2D: la independencia de los ejes

El movimiento en dos dimensiones se descompone en movimientos independientes en cada eje. Un proyectil es un MRU horizontal + un MRUA vertical, simultáneos e independientes:

| Componente | Movimiento | Ecuación clave |
|:----------:|:----------:|:--------------:|
| **Horizontal (x)** | MRU | $x = v_{0x} \cdot t$ |
| **Vertical (y)** | MRUA con $a_y = -g$ | $y = v_{0y} \cdot t - \frac{1}{2}g \cdot t^2$ |

Y en el movimiento circular uniforme, la aceleración centrípeta apunta siempre al centro:

$$a_c = \frac{v^2}{r}$$

---

---

## 2. Dinámica: las leyes de Newton

La dinámica explica **por qué** se mueve algo: identifica las fuerzas que causan la aceleración. Las tres leyes de Newton son el motor del edificio clásico.

### 2.1 Las tres leyes en acción

1. **Inercia:** si la fuerza neta es cero, la velocidad no cambia. Reposo y movimiento uniforme son el mismo estado físico.
2. **Fundamental:** $\vec{F}_{neta} = m \vec{a}$. La fuerza neta (vector) determina la aceleración (vector).
3. **Acción-Reacción:** las fuerzas siempre vienen en pares iguales y opuestos aplicados a cuerpos **distintos**.

### 2.2 Diagramas de cuerpo libre

Para resolver un problema de dinámica: dibuja el objeto, marca **todas** las fuerzas reales que actúan sobre él (peso, normal, tensión, fricción...), y aplica la segunda ley por componentes:

$$\sum F_x = m a_x \qquad \sum F_y = m a_y$$

| Fuerza | ¿Qué es? | Dirección típica |
|:------:|:---------|:----------------:|
| **Peso** | $\vec{P} = m\vec{g}$ | Hacia el centro de la Tierra |
| **Normal** | Reacción de la superficie | Perpendicular a la superficie |
| **Tensión** | Fuerza de una cuerda | A lo largo de la cuerda |
| **Fricción** | Resistencia al deslizamiento | Opuesta al movimiento |

**Ejemplo:** Un bloque de 5 kg está en reposo sobre una mesa horizontal sin fricción. ¿Qué fuerza horizontal lo haría acelerar a 2 m/s²?

$$F = m \cdot a = 5 \times 2 = 10 \text{ N}$$

> **❌ Error común:** Confundir la tercera ley con el equilibrio. La tercera ley dice que las fuerzas de interacción son iguales y opuestas, pero actúan sobre cuerpos diferentes. El equilibrio (fuerza neta cero) se refiere a todas las fuerzas sobre **un mismo** cuerpo.

```aeterna-decision
Badge: 🧠 REFLEXIÓN
Título: El empujón del suelo
Pregunta: Cuando caminas, tus pies empujan el suelo hacia atrás y el suelo te empuja hacia adelante. Si ambas fuerzas son iguales y opuestas (tercera ley), ¿por qué avanzas en lugar de quedarte quieto?
Nivel: 1
XP: 50
Botón: He meditado al respecto
```

---

<Connect title="De la mecánica al electromagnetismo" sourceConcept="Fuerza de Newton" targetConcept="Fuerza de Lorentz">
La mecánica clásica no solo describe fuerzas mecánicas: la fuerza de Lorentz (F = qv×B) se aplica con las mismas leyes de Newton a partículas cargadas en campos. El método —diagramas de cuerpo libre + F = ma— es universal, sea la fuerza gravitatoria, eléctrica o magnética.
</Connect>

---

## 3. Trabajo y energía: la moneda del universo

La energía es la **moneda de cambio** del universo: no se crea ni se destruye, solo se transforma. Este principio de conservación es la herramienta más poderosa de la mecánica.

### 3.1 El teorema trabajo-energía

El trabajo total realizado sobre un objeto es igual al cambio de su energía cinética:

$$W_{total} = \Delta E_k = \frac{1}{2}mv_f^2 - \frac{1}{2}mv_i^2$$

Esto convierte problemas complejos de fuerzas en simples balances de energía.

**Ejemplo:** Un coche de 1.000 kg frena desde 20 m/s hasta detenerse. ¿Cuánta energía cinética se disipó en los frenos?

$$\Delta E_k = \frac{1}{2} \times 1000 \times 20^2 = 200.000 \text{ J}$$

Esa energía no desaparece: se convierte en calor en las pastillas de freno y en sonido.

### 3.2 Energía mecánica y su conservación

Para fuerzas conservativas (gravedad, resortes), la energía mecánica se conserva:

$$E_m = E_k + E_p = \text{constante}$$

$$\frac{1}{2}mv_1^2 + mgh_1 = \frac{1}{2}mv_2^2 + mgh_2$$

**Ejemplo:** Lanzas una pelota hacia arriba a 10 m/s. ¿Qué altura alcanza?

En el punto más alto, toda la energía cinética se ha convertido en potencial:

$$h = \frac{v_0^2}{2g} = \frac{10^2}{2 \times 9{,}8} = 5{,}1 \text{ metros}$$

### 3.3 Potencia

La potencia es la rapidez con la que se realiza trabajo:

$$P = \frac{W}{t}$$

Se mide en vatios (W). Un coche de 100 kW no es el que hace más trabajo total, sino el que lo hace más rápido. La potencia conecta el mundo de la energía con el del tiempo.

```aeterna-decision
Badge: 🧠 REFLEXIÓN
Título: La energía que no se ve
Pregunta: Cuando un coche frena, su energía cinética se convierte en calor y sonido. ¿Crees que esa energía "perdida" podría recuperarse? ¿Qué tecnologías conoces que intentan aprovecharla?
Nivel: 1
XP: 50
Botón: He meditado al respecto
```

---

<Transfer targetDomain="Ingeniería mecánica" title="Transfiere: diseña un sistema de poleas">
Usando F = ma y los diagramas de cuerpo libre, analiza un sistema de poleas que eleva una carga de 200 kg. ¿Qué fuerza mínima necesita el operador? ¿Cómo cambia si usas una polea móvil (que duplica la ventaja mecánica)? Aplica el teorema trabajo-energía para relacionar la distancia que tira el operador con la altura que sube la carga.
</Transfer>

---

## 4. Estática de fluidos: la física del agua y el aire

La estática de fluidos explica un catálogo de fenómenos cotidianos asombrosos: por qué flotas en una piscina, por qué un barco de acero flota y por qué la cortina de la ducha se pega a tu cuerpo.

### 4.1 La ecuación fundamental de la hidrostática

La presión dentro de un fluido en reposo aumenta con la profundidad:

$$P = P_0 + \rho \, g \, h$$

Donde $\rho$ es la densidad del fluido y $h$ la profundidad. La presión no depende de la forma del recipiente, solo de la profundidad. Por eso los diques son más gruesos en la base: la presión del agua es mayor allí.

### 4.2 La prensa hidráulica

Gracias al principio de Pascal, una fuerza pequeña sobre un émbolo pequeño genera una fuerza grande sobre uno grande:

$$\frac{F_1}{A_1} = \frac{F_2}{A_2} \qquad \Rightarrow \qquad F_2 = F_1 \cdot \frac{A_2}{A_1}$$

El truco no es gratis: el émbolo grande se desplaza menos. La energía se conserva.

### 4.3 Arquímedes con densidades

El empuje es el peso del fluido desalojado:

$$E = \rho_{fluido} \cdot V_{sumergido} \cdot g$$

Un objeto flota si su **densidad media** (considerando todo su volumen) es menor que la del fluido:

| Objeto | Densidad media | Resultado |
|:------:|:--------------:|:---------:|
| Barco de acero (con aire) | ~200 kg/m³ | Flota |
| Lingote de acero | ~7.800 kg/m³ | Se hunde |
| Globos de helio | ~0,3 kg/m³ | Ascienden |
| Globo de aire caliente | < aire exterior | Asciende |

Los barcos flotan porque su densidad media —contando el aire dentro del casco— es menor que la del agua.

---

---

## 5. Sistemas en rotación: el giro del mundo

La mecánica rotacional traduce cada concepto de la dinámica lineal a su equivalente giratorio. Aprender la correspondencia es la mitad del trabajo.

### 5.1 El alfabeto rotacional

| Lineal | Rotacional | Relación clave |
|:------:|:----------:|:--------------:|
| Fuerza $F$ | Torque $\tau$ | $\tau = I \alpha$ |
| Masa $m$ | Momento de inercia $I$ | — |
| Aceleración $a$ | Aceleración angular $\alpha$ | — |
| Momento $p = mv$ | Momento angular $L = I\omega$ | — |
| Energía cinética $\frac{1}{2}mv^2$ | Energía rotacional $\frac{1}{2}I\omega^2$ | — |

### 5.2 Conservación del momento angular

$$L = I \cdot \omega = \text{constante (sin torque externo)}$$

La patinadora que encoge los brazos: $I$ disminuye, $\omega$ aumenta. La estrella que colapsa en púlsar: su momento de inercia cae miles de veces, y su giro se acelera en la misma proporción.

**Ejemplo:** Una patinadora gira a 2 vueltas/s con los brazos extendidos ($I_1 = 2\, \text{kg·m}^2$). Al encogerlos, su momento de inercia se reduce a la mitad ($I_2 = 1\, \text{kg·m}^2$). ¿A qué velocidad gira?

$$I_1 \omega_1 = I_2 \omega_2 \quad \Rightarrow \quad \omega_2 = \frac{I_1}{I_2} \omega_1 = 2 \times 2 = 4 \text{ vueltas/s}$$

### 5.3 Aplicaciones sorprendentes

- **El efecto giroscópico** estabiliza bicicletas, balas y satélites.
- **Los púlsares** son estrellas de neutrones que rotan cientos de veces por segundo, nacidos del colapso de estrellas que giraban lentamente.
- **La Tierra misma**: el día terrestre se alarga ~2 ms por siglo porque la Luna roba momento angular a la rotación terrestre.

```aeterna-decision
Badge: 🧠 REFLEXIÓN
Título: La bailarina cósmica
Pregunta: La conservación del momento angular hace que una estrella colapsada gire a cientos de revoluciones por segundo. ¿Qué otros fenómenos de la naturaleza crees que se explican con esta misma ley?
Nivel: 1
XP: 50
Botón: He meditado al respecto
```

---

---

## 6. Más allá de lo clásico: dónde falla Newton

La mecánica clásica es un modelo magnífico, pero no universal. A principios del siglo XX se descubrió que tiene un **dominio de validez** y que fuera de él predice mal. Tres fronteras lo demuestran.

### 6.1 La frontera de la velocidad

A velocidades comparables a la de la luz, las velocidades no se suman linealmente y el tiempo se dilata:

$$t' = \frac{t}{\sqrt{1 - v^2/c^2}}$$

Para velocidades cotidianas, el factor de Lorentz es indistinguible de 1. Es por eso que Newton funciona tan bien en la vida diaria: su dominio coincide con nuestra experiencia.

### 6.2 La frontera de lo muy pequeño

En el mundo subatómico, la posición y el momento no pueden conocerse simultáneamente con precisión arbitraria:

$$\Delta x \cdot \Delta p \geq \frac{\hbar}{2}$$

El principio de incertidumbre de Heisenberg no es una limitación de los instrumentos: es una propiedad de la naturaleza.

### 6.3 La frontera de la gravedad intensa

La órbita de Mercurio se desviaba 43 segundos de arco por siglo respecto a lo que predecía Newton. Era una discrepancia minúscula, pero era real. Einstein la explicó con la curvatura del espacio-tiempo. La anomalía que otros ignoraron fue la grieta por la que se coló la Relatividad General.

| Frontera | Límite de la física clásica | Teoría que la reemplaza |
|:--------:|:---------------------------|:------------------------|
| $v \sim c$ | La velocidad no se suma linealmente | Relatividad Especial (1905) |
| $\Delta x \cdot \Delta p \sim \hbar$ | No hay trayectoria definida | Mecánica Cuántica (1925) |
| $GM/(rc^2) \sim 1$ | La gravedad curva el espacio-tiempo | Relatividad General (1915) |

---

---

## 🧠 Sistema Anektia: ¿Qué acabas de aprender?

> **🧠 Sistema Anektia, paso 1: La causalidad newtoniana**
>
> > Las tres leyes de Newton no son fórmulas aisladas: forman un sistema cerrado. La inercia define el estado natural; la segunda ley cuantifica el cambio; la tercera garantiza la coherencia de las interacciones. Estúdialas como un todo.

> **🧠 Sistema Anektia, paso 2: La energía como estrategia**
>
> > Cuando las fuerzas son complicadas, cambia de marco: usa energía. El teorema trabajo-energía y la conservación de la energía mecánica convierten problemas de fuerzas variables en simples balances. El cambio de marco es un superpoder.

> **🧠 Sistema Anektia, paso 3: La anomalía como oportunidad**
>
> > La órbita de Mercurio no encajaba con Newton por 43 segundos de arco por siglo. En lugar de ignorarla, Einstein la persiguió — y nació la Relatividad General. Las grandes revoluciones empiezan con anomalías que nadie se atreve a descartar.

---

---

## ❓ Preguntas frecuentes sobre Mecánica Clásica

> **❓ ¿Cuándo uso cada ley de conservación?**
>
> Si la fuerza neta externa es cero, se conserva el momento lineal. Si el torque neto externo es cero, se conserva el momento angular. Si solo actúan fuerzas conservativas, se conserva la energía mecánica. Pregunta siempre: ¿qué se está conservando en este sistema?

> **❓ ¿Por qué los cohetes funcionan en el vacío?**
>
> Por la tercera ley de Newton. El cohete expulsa gases hacia atrás; los gases empujan el cohete hacia adelante. No necesita empujar contra el aire ni contra el suelo: solo necesita expulsar masa en dirección contraria a la que quiere avanzar.

> **❓ ¿Un objeto en MCU tiene aceleración si su rapidez es constante?**
>
> Sí. La rapidez no cambia, pero la velocidad sí (porque cambia la dirección). Como la aceleración es el cambio de la velocidad, y la velocidad es un vector, hay aceleración: la centrípeta, que apunta al centro de la circunferencia.

> **❓ ¿Qué significa que un sistema es "no inercial"?**
>
> Que está acelerado. En esos marcos de referencia aparecen fuerzas ficticias (como la centrífuga o la de Coriolis) que no provienen de interacciones reales, sino de la elección del sistema de referencia. Para aplicar Newton, lo más limpio es trabajar en marcos inerciales.

> **❓ ¿La mecánica clásica está "mal"?**
>
> No. Es una aproximación excelente para el mundo cotidiano. Solo falla a velocidades cercanas a la luz, en el mundo subatómico y en campos gravitatorios intensos. Las teorías modernas la incluyen como caso límite.

---

</NivelActivo>


<NivelActivo id="frontera">

## ▶️ Bienvenida: El movimiento, el misterio más cotidiano

Todo se mueve. El suelo que pisas gira a 1.600 km/h sobre el eje terrestre. La Tierra se precipita alrededor del Sol a 107.000 km/h. Tu sangre serpentea por venas y arterias. Los electrones zumban en sus orbitales atómicos. El aire vibra con cada sonido. Nada está quieto, nunca.

La **mecánica clásica** es el modelo de la física que Newton construyó en 1687 y que hoy sigue siendo el lenguaje de la ingeniería: desde el diseño de un puente hasta la trayectoria de una sonda que visita Júpiter. Pero no es la verdad absoluta: es una **aproximación magnífica** con un dominio de validez bien definido. Saber cuándo funciona —y cuándo deja de funcionar— es tan importante como dominar sus ecuaciones.

> **💡 La clave en 10 segundos**
>
> La mecánica clásica se articula en tres grandes pilares: **cinemática** (el lenguaje del movimiento), **dinámica** (las leyes de Newton como causa) y **energía** (la moneda de cambio). Dos extensiones completan el edificio: la **estática de fluidos** y la **mecánica rotacional**. En la frontera, el modelo clásico cede ante la relatividad y la mecánica cuántica.

En esta parada exploraremos desde el vuelo de una pelota de tenis hasta la danza de los planetas, desde la presión que sostiene un avión hasta la razón por la que un barco de acero flota. Y al final, veremos dónde —y por qué— falla Newton.

![Péndulo de Foucault y el Cosmos](https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000)
*Desde el péndulo de Galileo hasta las órbitas de las galaxias: un solo conjunto de leyes lo explica todo.*

---

<PedagogicalContentBlock type="key-insight" title="La clave en 10 segundos">
**La clave:** la mecánica clásica describe el movimiento con cinemática (cómo), dinámica (por qué, F = ma), trabajo y energía (la moneda del universo), y se extiende a fluidos y rotación. Es exacta para el mundo cotidiano y la base de la ingeniería, aunque falla a velocidades cercanas a la luz y a escala atómica.
</PedagogicalContentBlock>

---

## 1. Cinemática: el lenguaje del movimiento

La cinemática es el **lenguaje del movimiento**: un sistema formal para describir *cómo* se mueve algo. En su versión más potente, se expresa con cálculo vectorial.

### 1.1 Formulación diferencial

La velocidad y la aceleración son derivadas de la posición:

$$\vec{v}(t) = \frac{d\vec{r}}{dt} \qquad \vec{a}(t) = \frac{d\vec{v}}{dt} = \frac{d^2\vec{r}}{dt^2}$$

Cuando la aceleración es constante, integrando se obtienen las tres ecuaciones cinemáticas:

$$\vec{v} = \vec{v}_0 + \vec{a} \, t$$

$$\vec{r} = \vec{r}_0 + \vec{v}_0 \, t + \frac{1}{2}\vec{a} \, t^2$$

$$v^2 = v_0^2 + 2\vec{a} \cdot (\vec{r} - \vec{r}_0)$$

> **🧠 Profundidad matemática:** La tercera ecuación no es independiente: se obtiene eliminando el tiempo entre las dos primeras. La cinemática clásica es, en el fondo, cálculo integral aplicado a trayectorias.

### 1.2 Aceleración tangencial y normal

Para una trayectoria curvilínea general, la aceleración se descompone en dos componentes ortogonales:

$$\vec{a} = a_t \, \hat{t} + a_n \, \hat{n}$$

- **Tangencial** $a_t$: cambia el *módulo* de la velocidad (frenar o acelerar).
- **Normal** $a_n = v^2/r$: cambia la *dirección* (la curvatura).

En el MCU, $a_t = 0$ y toda la aceleración es centrípeta. En el movimiento rectilíneo acelerado, $a_n = 0$ y toda es tangencial.

### 1.3 Movimiento parabólico completo

Para un lanzamiento con ángulo $\theta$ y rapidez inicial $v_0$:

$$R = \frac{v_0^2 \sin(2\theta)}{g} \qquad H = \frac{v_0^2 \sin^2(\theta)}{2g} \qquad T = \frac{2v_0 \sin(\theta)}{g}$$

La trayectoria es una parábola:

$$y = x \tan(\theta) - \frac{g \, x^2}{2 v_0^2 \cos^2(\theta)}$$

> **⚠️ Matiz importante:** El ángulo óptimo para máximo alcance es 45° **solo** si el punto de lanzamiento y el de aterrizaje están a la misma altura. Desde un acantilado, el óptimo es menor.

---

---

## 2. Dinámica: las leyes de Newton

La dinámica newtoniana es el primer ejemplo histórico de una **teoría física matemáticamente cerrada**: postulados simples, consecuencias precisas y verificables.

### 2.1 La segunda ley como postulado

$$\vec{F}_{neta} = \frac{d\vec{p}}{dt} \quad \text{donde} \quad \vec{p} = m\vec{v}$$

En su forma más general, la segunda ley dice que la fuerza neta es la variación temporal del **momento lineal**. Para masa constante, se reduce a $\vec{F} = m\vec{a}$. En problemas de masa variable —como un cohete que expulsa combustible— la forma con $d\vec{p}/dt$ es la correcta.

### 2.2 Fricción y fuerzas de contacto

La fricción estática máxima y la fricción cinética son aproximadamente:

$$f_s^{max} = \mu_s N \qquad f_k = \mu_k N$$

La fricción **estática** puede ser menor o igual que su máximo (se adapta al empuje), mientras que la **cinética** es aproximadamente constante. Esta distinción explica por qué cuesta más *arrancar* un objeto que mantenerlo deslizando.

### 2.3 Momentum y colisiones

El momento lineal se conserva en ausencia de fuerza externa neta:

$$\vec{p}_{total}^{\,antes} = \vec{p}_{total}^{\,después}$$

Esto convierte las colisiones en problemas algebraicos: en una colisión perfectamente inelástica los cuerpos quedan unidos; en una elástica, también se conserva la energía cinética. La conservación del momentum es más profunda que las leyes de Newton: se mantiene incluso en regímenes donde la mecánica clásica falla.

> **🧠 Conexión con la simetría:** El teorema de Noether demuestra que la conservación del momento lineal es la consecuencia matemática de que las leyes físicas son las mismas en todo punto del espacio (homogeneidad espacial). Lo que Newton postuló, la física moderna lo deriva de la simetría.

---

<Connect title="De la mecánica al electromagnetismo" sourceConcept="Fuerza de Newton" targetConcept="Fuerza de Lorentz">
La mecánica clásica no solo describe fuerzas mecánicas: la fuerza de Lorentz (F = qv×B) se aplica con las mismas leyes de Newton a partículas cargadas en campos. El método —diagramas de cuerpo libre + F = ma— es universal, sea la fuerza gravitatoria, eléctrica o magnética.
</Connect>

---

## 3. Trabajo y energía: la moneda del universo

El principio de conservación de la energía es la ley más verificada de toda la física: no tiene ni una excepción documentada en ningún experimento jamás realizado.

### 3.1 Trabajo como integral de línea

Para fuerzas variables a lo largo de una trayectoria, el trabajo es una integral de línea:

$$W = \int_{A}^{B} \vec{F} \cdot d\vec{r}$$

Las fuerzas **conservativas** (aquellas cuyo trabajo no depende del camino) admiten una función escalar de energía potencial:

$$\vec{F} = -\nabla U$$

Esta ecuación es la clave de todo: **la fuerza es el gradiente negativo de la energía potencial**. Conocer $U(\vec{r})$ es conocer la física del sistema.

### 3.2 Potenciales y equilibrio

| Punto del potencial $U(x)$ | Tipo de equilibrio | Comportamiento |
|:--------------------------:|:------------------:|:---------------|
| Mínimo local | **Estable** | Pequeñas perturbaciones oscilan alrededor |
| Máximo local | **Inestable** | Pequeñas perturbaciones lo alejan |
| Zona plana | **Indiferente** | No hay fuerza restauradora |

La frecuencia de las pequeñas oscilaciones alrededor de un mínimo se obtiene de la segunda derivada:

$$\omega = \sqrt{\frac{U''(x_0)}{m}}$$

### 3.3 El formalismo que vino después

La conservación de la energía es la puerta a las formulaciones más profundas de la mecánica. El **principio de mínima acción** de Lagrange y Hamilton reformula toda la dinámica en términos de una única función —el lagrangiano $L = T - U$— y de un principio variacional. Esta reformulación es la que se generalizó, intacta, a la mecánica cuántica.

> **🧠 Teorema de Noether:** La conservación de la energía no es un accidente: es la consecuencia matemática de que las leyes físicas no cambian con el paso del tiempo (simetría temporal). Cada simetría del universo genera una ley de conservación.

---

<Transfer targetDomain="Ingeniería mecánica" title="Transfiere: diseña un sistema de poleas">
Usando F = ma y los diagramas de cuerpo libre, analiza un sistema de poleas que eleva una carga de 200 kg. ¿Qué fuerza mínima necesita el operador? ¿Cómo cambia si usas una polea móvil (que duplica la ventaja mecánica)? Aplica el teorema trabajo-energía para relacionar la distancia que tira el operador con la altura que sube la carga.
</Transfer>

---

## 4. Estática de fluidos: la física del agua y el aire

La estática de fluidos es la mecánica de Newton aplicada a un medio continuo. Sus resultados unifican la flotación, la presión atmosférica y el comportamiento de los fluidos en reposo.

### 4.1 Derivación hidrostática

La ecuación fundamental de la hidrostática se deriva del equilibrio de una columna de fluido: la diferencia de presión entre dos alturas debe equilibrar el peso del fluido entre ellas.

$$\frac{dP}{dh} = \rho \, g$$

Integrando para un fluido incompresible (densidad constante):

$$P(h) = P_0 + \rho \, g \, h$$

En un fluido compresible como la atmósfera, la densidad decrece con la altura y la presión sigue una ley exponencial (en la aproximación isoterma):

$$P(h) = P_0 \, e^{-h/H}$$

donde $H$ es la altura de escala, aproximadamente 8,5 km para la Tierra.

### 4.2 Arquímedes como consecuencia

El principio de Arquímedes no es un postulado adicional: se deduce de la hidrostática. El empuje es la resultante de las fuerzas de presión sobre la superficie del cuerpo sumergido, y el teorema de divergencia la reduce al peso del fluido desalojado:

$$E = \int_S P \, d\vec{A} = \rho_{fluido} \, V \cdot g$$

### 4.3 Estabilidad de la flotación

Un objeto flota en equilibrio estable si su **metacentro** (el punto donde la línea de empuje corta el eje de simetría) está por encima de su centro de gravedad. Este principio rige el diseño de barcos: por eso los buques lastran los fondos —bajan el centro de gravedad— y por eso un barco volcado no se recupera por sí solo.

```aeterna-exercise
TITLE: El barco y el lingote
HINT: Compara la densidad media del objeto con la del agua.
XP: 75
Un mismo volumen de acero flota cuando tiene forma de barco (con aire dentro) y se hunde cuando es un lingote macizo. ¿Qué magnitud decide si flota?
```

---

---

## 5. Sistemas en rotación: el giro del mundo

La mecánica rotacional es un ejemplo perfecto de cómo la física **generaliza**: cada ley lineal tiene un análogo rotacional con su propia lógica y sus propias aplicaciones.

### 5.1 Torque como producto vectorial

El torque es el producto vectorial entre el brazo y la fuerza:

$$\vec{\tau} = \vec{r} \times \vec{F}$$

Y la segunda ley de Newton rotacional es:

$$\sum \vec{\tau} = I \, \vec{\alpha} = \frac{d\vec{L}}{dt}$$

### 5.2 Momento de inercia continuo

Para cuerpos extendidos, el momento de inercia se calcula integrando la distribución de masa:

$$I = \int r^2 \, dm$$

Algunos resultados clásicos (masa $M$, radio $R$):

| Cuerpo | Eje | Momento de inercia |
|:-------|:----|:------------------:|
| Aro | Centro, perpendicular | $MR^2$ |
| Disco sólido | Centro, perpendicular | $\frac{1}{2}MR^2$ |
| Esfera sólida | Diámetro | $\frac{2}{5}MR^2$ |
| Varilla | Extremo | $\frac{1}{3}ML^2$ |

El teorema del eje paralelo permite trasladar estos valores a cualquier eje paralelo: $I = I_{cm} + Mh^2$.

### 5.3 Precesión: el giro del giro

Cuando un torque externo actúa perpendicular al eje de rotación, el eje no cae: **precesiona**, describe un cono. Es el principio de la peonza, del giroscopio y de la precesión del eje terrestre, que completa una vuelta cada 26.000 años.

$$\Omega_p = \frac{\tau}{L} = \frac{M g r}{I \omega}$$

> **🧠 Profundidad:** La precesión de los giroscopios es la misma física que hace que el eje de la Tierra describa un cono —moviendo lentamente las estrellas del polo a lo largo de los siglos— y que una peonza parezca desafiar la gravedad.

---

---

## 6. Más allá de lo clásico: dónde falla Newton

La mecánica clásica es una **teoría efectiva**: funciona espectacularmente en su dominio, y falla de forma medible fuera de él. Comprender dónde y por qué falla es una de las lecciones más profundas de la física.

### 6.1 El principio de correspondencia

Toda teoría nueva debe reducirse a la clásica en el límite apropiado:

- Cuando $v \ll c$, la relatividad especial se reduce a la mecánica de Newton.
- Cuando las acciones son mucho mayores que $\hbar$, la mecánica cuántica se reduce a la clásica.
- Cuando la curvatura del espacio-tiempo es pequeña, la relatividad general se reduce a la gravedad newtoniana.

La física clásica no se descarta: se **incrusta** como caso límite de teorías más generales. Es, literalmente, el límite de casi toda la física moderna.

### 6.2 Los tres parámetros de la frontera

| Teoría clásica | Parámetro que rompe su validez | Teoría moderna |
|:---------------|:-------------------------------|:---------------|
| Mecánica de Newton | $\beta = v/c \to 1$ | Relatividad Especial |
| Órbita determinista | $S \sim \hbar$ | Mecánica Cuántica |
| Gravedad de Newton | $GM/(rc^2) \sim 1$ | Relatividad General |

### 6.3 La anomalía como método

La órbita de Mercurio no encajaba con Newton por apenas 43 segundos de arco por siglo —una fracción diminuta. Pero los físicos no lo ignoraron: lo persiguieron. Las grandes revoluciones científicas no empiezan con certezas; empiezan con anomalías que nadie se atreve a descartar como ruido.

```aeterna-decision
Badge: 🔬 FRONTERA
Título: La certeza como aproximación
Pregunta: Newton creyó que su mecánica era la descripción definitiva de la realidad. Dos siglos después, Einstein demostró que era una aproximación con límites. ¿Qué certeza de tu propia vida podría ser también una aproximación a una verdad más amplia?
Nivel: 2
XP: 100
Botón: Registrar Reflexión
```

---

---

## 🧠 Sistema Anektia: ¿Qué acabas de aprender?

> **🧠 Sistema Anektia, paso 1: De la fuerza al principio**
>
> > La mecánica clásica se puede reformular por completo con el principio de mínima acción y el lagrangiano $L = T - U$. Esta formulación variacional es más profunda que las leyes de Newton: se generaliza intacta a la mecánica cuántica. La física no es un conjunto de reglas: es una jerarquía de principios.

> **🧠 Sistema Anektia, paso 2: La simetría gobierna**
>
> > El teorema de Noether conecta cada simetría con una ley de conservación: homogeneidad del tiempo → energía; homogeneidad del espacio → momento lineal; isotropía → momento angular. La estructura profunda de la física no son las fuerzas, sino las simetrías.

> **🧠 Sistema Anektia, paso 3: La teoría efectiva**
>
> > La mecánica clásica es el caso límite de la relatividad y la cuántica. Aprender cuándo un modelo deja de ser válido —y qué parámetro lo rompe— es la habilidad que separa a quien memoriza física de quien la entiende.

---

---

## ❓ Preguntas frecuentes sobre Mecánica Clásica

> **❓ ¿Qué es el teorema de Noether?**
>
> Demuestra que cada simetría de las leyes físicas genera una ley de conservación: homogeneidad temporal → energía; homogeneidad espacial → momento lineal; isotropía → momento angular. Es el puente entre la geometría del universo y sus leyes de conservación.

> **❓ ¿Por qué la energía cinética es $\frac{1}{2}mv^2$ y no $mv^2$?**
>
> Porque es la integral del trabajo: $W = \int m\vec{a} \cdot d\vec{r} = \int m v \, dv = \frac{1}{2}mv^2$. El factor 1/2 es una consecuencia matemática de integrar la aceleración a lo largo del desplazamiento.

> **❓ ¿Qué es la fuerza ficticia de Coriolis?**
>
> Una fuerza aparente que aparece en marcos de referencia en rotación. Explica la rotación de los ciclones (en el hemisferio norte giran en un sentido, en el sur en el contrario) y la desviación de proyectiles de largo alcance. No es una interacción real: es geometría del marco de referencia.

> **❓ ¿Qué distingue un marco inercial de uno no inercial?**
>
> En un marco inercial, un cuerpo sin fuerzas se mueve en línea recta uniforme. En uno no inercial (acelerado o en rotación), aparecen fuerzas ficticias. La Tierra es un marco solo aproximadamente inercial: la rotación terrestre produce efectos medibles como la fuerza de Coriolis.

> **❓ ¿Cuándo se viola la conservación de la energía?**
>
> Nunca en un sistema aislado. La energía total del universo es constante. Lo que ocurre es que a menudo la energía se convierte en calor (energía térmica desordenada) y ya no está disponible en forma útil — eso es lo que mide la entropía. La primera ley nunca falla; la segunda es la que impone el sentido del tiempo.

---

</NivelActivo>


La mecánica clásica es la corona de la física newtoniana: con unas pocas leyes —cinemática, las tres leyes de Newton, trabajo y energía— se describe el movimiento de casi todo lo que vemos, desde una pelota lanzada hasta un planeta orbitando. Has recorrido sus pilares: el lenguaje del movimiento (cinemática), las causas del movimiento (dinámica), la moneda de cambio del universo (trabajo y energía), los fluidos en reposo y en movimiento, los sistemas en rotación y, finalmente, los límites donde Newton falla. Porque la mecánica clásica es brillante pero no definitiva: a velocidades cercanas a la luz y a escalas atómicas, sus leyes ceden ante la relatividad y la mecánica cuántica. Sin embargo, para la inmensa mayoría de las situaciones cotidianas —y para la ingeniería que construye puentes, cohetes y máquinas— la mecánica clásica es exacta y poderosa. Dominar esta rama te da la base sobre la que se construye toda la física moderna: entender cómo se mueve el mundo es el primer paso para entender por qué se mueve.
