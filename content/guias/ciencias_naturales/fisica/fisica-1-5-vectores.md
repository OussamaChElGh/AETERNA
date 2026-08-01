---
title: "Vectores en Física: Las Flechas que Describen el Mundo"
description: "Un viaje de tres niveles: de la intuición básica de las flechas a la matemática vectorial avanzada y sus aplicaciones en la ingeniería."
slug: "vectores"
author: "Aeterna"
category: "ciencias"
subcategory: "fisica"
tags: ["física", "vectores", "magnitud", "dirección", "descomposición", "álgebra vectorial"]
image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
date: "2026-05-11"
nivel: 1
orden: 5
nivel_titulo: "Fundamentos del Cosmos"
insignia: "Aprendiz del Cosmos"
tipo: "theory"
prerequisites: ["metodo-de-la-fisica"]
breadcrumb: ["Fundamentos del Cosmos", "Vectores"]
---

## Bienvenida: Las flechas que gobiernan el universo

Imagina que eres el piloto de un avión. Son las 6 de la mañana, el cielo está despejado y el plan de vuelo es sencillo: ir directo hacia el norte. Pero hay un problema: sopla un viento de 50 km/h que viene del este y empuja tu fuselaje hacia el oeste. Si apuntas la nariz exactamente hacia el norte, llegarás al destino... desplazado medio kilómetro. Para corregir el rumbo, necesitas sumar dos flechas invisibles: la del avión y la del viento. Eso, ni más ni menos, es la física de los vectores.

Los vectores son el alfabeto con el que la naturaleza escribe las fuerzas, las velocidades y los campos. Si la temperatura se describe con un solo número (20 °C), la velocidad de tu avión no: necesita cuánto y hacia dónde. Magnitud y dirección, unidas como las dos caras de una moneda. Sin esa distinción no podrías lanzar un cohete, calcular el par de una llave inglesa, entender un campo magnético ni predecir hacia dónde va la corriente en un río.

En esta parada vas a dominar el lenguaje de las flechas. Empezarás por distinguir escalares de vectores y reconocer la anatomía de una flecha. Luego descompondrás vectores en componentes, los sumarás como un matemático y los multiplicarás con los productos escalar y vectorial. Y en la frontera verás cómo estas herramientas —que parecen simples— sostienen la relatividad, la mecánica cuántica y hasta los motores de videojuegos. Un único hilo conductor: todo en física es cuestión de cantidad y dirección.

> **💡 La clave en 10 segundos**
>
> Un vector es una flecha con magnitud (cuánto), dirección (qué recta) y sentido (hacia qué lado). Se descompone en componentes (X, Y, Z) para operar con álgebra corriente. Sumar vectores no es sumar números: es componer fuerzas, y el resultado depende de hacia dónde apunten. Dominar los vectores es dominar el espacio.

**[IMAGEN SUGERIDA: Una flecha brillante sobre un fondo de coordenadas cartesianas, con sus componentes proyectadas en los ejes. Pie de foto: "Cada vector es una historia de cantidad y dirección. Descomponerlo es leer sus sombras."]**

<ProgresionArticulo 
  hitos={["Fundamentos", "Profundización", "Frontera"]} 
  hitoInicial="Fundamentos"
/>

---

<!-- ============================================ -->
<!-- CAPA 1: FUNDAMENTOS (Principiante)           -->
<!-- ============================================ -->

<NivelActivo id="fundamentos">

<IndiceNivel titulo="🌱 Fundamentos">
- **1. El problema de los números solos**: por qué la temperatura y la masa no necesitan dirección, y la fuerza y la velocidad sí.
- **2. Anatomía de una flecha**: magnitud, dirección y sentido — los tres ingredientes de todo vector.
- **3. Representación y notación**: flechas, letras con flecha encima y componentes cartesianas.
- **4. Errores comunes**: por qué sumar vectores no es sumar números.
</IndiceNivel>

## 1. El problema de los números solos

En física hay magnitudes que se expresan con un número y una unidad, y nada más. La masa de un libro (0.5 kg), la temperatura de una habitación (20 °C) o el tiempo que tardas en leer esta frase (unos 3 s) son **escalares**. No necesitan dirección: "veinte grados" ya lo dice todo.

Pero hay otras magnitudes que, sin dirección, no tienen sentido. Si te digo que un coche va a 100 km/h, no sabes si se acerca o se aleja de ti. Si te digo que una fuerza vale 10 N, no sabes si empuja hacia arriba o hacia abajo. Esas son **magnitudes vectoriales**: necesitan un número (la magnitud) **y** una orientación (dirección y sentido). La velocidad, la fuerza, el desplazamiento y la aceleración son vectores.

La diferencia no es un capricho de los físicos: es una propiedad del mundo. La presión del aire en tu habitación es igual en todas direcciones, por eso basta un número. Pero la corriente de un río no es igual en todas direcciones: fluye hacia el mar. La naturaleza te obliga a distinguir.

| Aspecto | Escalares | Vectores |
| :--- | :--- | :--- |
| **Definición** | Magnitudes con solo cantidad | Magnitudes con cantidad y dirección |
| **Ejemplos** | Masa, tiempo, temperatura, energía | Velocidad, fuerza, desplazamiento, aceleración |
| **Operación** | Se suman con aritmética común | Se suman con reglas geométricas (ley del paralelogramo) |
| **Representación** | Un número y una unidad | Una flecha (con módulo, dirección y sentido) |

Vamos a comprobar que tienes clara la frontera entre los dos mundos. Conecta cada magnitud con su categoría correcta.

<ConceptMap
  id="concept_escalar_vector"
  title="Red de conceptos: ¿escalar o vector?"
  badgeText="RELACIONAR CONCEPTOS"
  description="Conecta cada magnitud con la categoría correcta construyendo la clasificación de la física:"
  nodes={[
    { id: "masa", label: "Masa (5 kg)" },
    { id: "fuerza", label: "Fuerza (10 N)" },
    { id: "velocidad", label: "Velocidad (100 km/h)" },
    { id: "escalar", label: "ESCALAR" },
    { id: "vector", label: "VECTOR" }
  ]}
  relationOptions={["es", "no es"]}
  validConnections={[
    { sourceId: "masa", relationLabel: "es", targetId: "escalar" },
    { sourceId: "fuerza", relationLabel: "es", targetId: "vector" },
    { sourceId: "velocidad", relationLabel: "es", targetId: "vector" }
  ]}
  xp={60}
/>

## 2. Anatomía de una flecha: magnitud, dirección y sentido

Cada vector tiene tres ingredientes que definen su personalidad:

- **Magnitud (o módulo):** Es la longitud de la flecha. Indica la intensidad o cantidad. Se denota $|\vec{v}|$ o simplemente $v$. Por ejemplo, la rapidez de un coche: 100 km/h.
- **Dirección:** Es la orientación de la recta que contiene al vector. Se mide como el ángulo que forma con un eje de referencia (por ejemplo, 30° respecto al eje X).
- **Sentido:** Es la punta de la flecha. Indica hacia qué lado de la recta apunta. Dos vectores con la misma dirección pero sentido opuesto son distintos (por ejemplo, ir al norte vs. ir al sur).

Si cambias cualquiera de estos tres, cambias el vector. Dos personas caminan a la misma velocidad (misma magnitud) pero en direcciones opuestas → sus vectores velocidad son diferentes.

> **🔑 Concepto clave: Vector**
>
> Un vector es un objeto matemático que posee magnitud (módulo), dirección (ángulo respecto a un eje de referencia) y sentido (hacia dónde apunta la punta de la flecha). Se representa gráficamente como una flecha.

Ahora pon a prueba tu intuición con un caso trampa. Muchas magnitudes que a primera vista "parecen direccionales" en realidad no lo son.

<PredictionBox
  id="pred_escalar_vector"
  title="¿Escalar o vector?"
  badgeText="PREDECIR ANTES DE OBSERVAR"
  question="Clasifica la siguiente magnitud: 'La presión atmosférica en una ciudad es de 1013 hPa'. ¿Es escalar o vectorial?"
  options={[
    { label: "Escalar", isCorrect: true, feedback: "¡Correcto! La presión solo tiene magnitud (1013 hPa), no especifica dirección. Es un escalar." },
    { label: "Vectorial", isCorrect: false, feedback: "Incorrecto. La presión no tiene dirección asociada; actúa en todas direcciones por igual, por lo que se considera un escalar." }
  ]}
  explanation="La presión es una magnitud escalar porque se define únicamente por su valor numérico y unidad, sin necesidad de especificar dirección. En física, muchas magnitudes que parecen 'direccionales' (como la presión sobre una superficie) se tratan como escalares cuando actúan uniformemente."
  xp={50}
/>

> **❌ Error común: confundir dirección con sentido**
>
> "Norte" y "sur" comparten la misma dirección (la recta vertical) pero tienen sentidos opuestos. "30° con el eje X" es una dirección; "hacia la derecha" es un sentido. Un vector no queda definido hasta que especifiques los tres ingredientes: cuánto, sobre qué recta y hacia qué lado.

## 3. Representación y notación vectorial

Un vector se puede escribir de varias formas:

- **Notación geométrica:** una flecha con una punta.
- **Notación algebraica:** $\vec{v}$ (con una flecha encima) o en negrita $\mathbf{v}$.
- **Notación por componentes:** $\vec{v} = (v_x, v_y)$ en 2D, o $\vec{v} = (v_x, v_y, v_z)$ en 3D.
- **Módulo:** $|\vec{v}| = \sqrt{v_x^2 + v_y^2}$ (en 2D).

En el plano cartesiano, todo vector se puede expresar como la suma de sus proyecciones sobre los ejes X e Y. Esas proyecciones son sus **componentes rectangulares**. Si conoces el módulo y el ángulo, calculas las componentes con trigonometría; si conoces las componentes, recuperas el módulo con Pitágoras. Son dos puertas de entrada al mismo edificio.

La fórmula del módulo es tu primera herramienta cuantitativa. Guárdala bien: aparecerá en todas las capas de este artículo.

<AeternaFormula
  title="Módulo de un vector en 2D"
  formula="|\vec{v}| = \sqrt{v_x^2 + v_y^2}"
  badgeText="FÓRMULA CLAVE"
  category="ÁLGEBRA VECTORIAL"
  variables={[
    { symbol: "|\vec{v}|", name: "Módulo del vector (longitud de la flecha)", unit: "u (según la magnitud)" },
    { symbol: "v_x", name: "Componente horizontal (proyección sobre el eje X)", unit: "u" },
    { symbol: "v_y", name: "Componente vertical (proyección sobre el eje Y)", unit: "u" }
  ]}
  note="Aplica siempre que tengas las componentes de un vector y quieras su intensidad. Es Pitágoras aplicado a las sombras del vector."
/>

Ponlo a prueba: las componentes y el módulo son dos caras de la misma moneda.

<AeternaExercise
  content="TITLE: El módulo que Pitágoras firmó
HINT: El módulo es la hipotenusa del triángulo rectángulo formado por las componentes. Aplica Pitágoras.
XP: 40

Un vector tiene componentes vx = 3 y vy = 4. ¿Cuál es su módulo? Después, si vx = 5 y vy = 12, ¿cuánto vale el módulo? Explica por qué el módulo es siempre menor o igual que la suma aritmética de las componentes."
/>

> **🧠 Dato rompe-cerebro: un vector es un segmento trasladable**
>
> Una flecha vectorial no tiene posición fija: puedes deslizarla por el plano sin que deje de ser el mismo vector, mientras no cambies su longitud, su recta y su punta. Por eso en física se dibuja un vector de fuerza sobre la partícula que lo siente, pero el vector en sí es un ente libre. Dos flechas paralelas, iguales y con el mismo sentido son *el mismo* vector, aunque estén en lugares distintos del mapa.

## 4. Errores comunes al trabajar con vectores

Uno de los errores más frecuentes es sumar magnitudes vectoriales como si fueran números. Si un barco navega a 10 km/h hacia el este y la corriente lo empuja a 10 km/h hacia el norte, mucha gente diría que la rapidez resultante es 20 km/h. **Falso.** La rapidez resultante es $\sqrt{10^2 + 10^2} \approx 14.14$ km/h. Los vectores no se suman como escalares; se suman geométricamente.

El error no es de cálculo: es de concepción. Quien suma 10 + 10 está tratando el problema como si las dos velocidades fueran masas en un costal. Pero la velocidad tiene dirección, y cuando dos movimientos se cruzan en ángulo recto, no se refuerzan del todo: se componen como los catetos de un triángulo rectángulo.

Caza el fallo en la resolución de un estudiante que intenta sumar dos vectores del plano.

<ErrorHunter
  id="err_suma_vectores"
  title="Suma de vectores: detecta el error"
  badgeText="ANALIZAR Y DETECTAR ERRORES"
  context="Un estudiante quiere sumar dos vectores: A = 3î + 4ĵ y B = 2î − 1ĵ. Sigue estos pasos:"
  steps={[
    { 
      id: "s1", 
      text: "Paso 1: Anota las componentes: A_x=3, A_y=4; B_x=2, B_y=-1.", 
      hasError: false, 
      explanation: "Correcto. Identifica correctamente las componentes de cada vector." 
    },
    { 
      id: "s2", 
      text: "Paso 2: Suma las magnitudes directamente: |A| + |B| = 5 + √5 ≈ 7.24.", 
      hasError: true, 
      errorType: "error_conceptual", 
      explanation: "¡Error! No se suman las magnitudes directamente. Se suman las componentes: R_x = A_x + B_x, R_y = A_y + B_y. La magnitud del resultante se calcula después con Pitágoras." 
    },
    { 
      id: "s3", 
      text: "Paso 3: Obtiene R_x = 3+2=5, R_y = 4-1=3, y luego |R| = √(5²+3²) = √34 ≈ 5.83.", 
      hasError: false, 
      explanation: "Ese es el procedimiento correcto. El error estaba en el paso 2." 
    }
  ]}
  xp={60}
/>

Para asentar la intuición, experimenta con la ley del paralelogramo: dos vectores perpendiculares de 10 km/h dan un resultante de $\sqrt{200} \approx 14.14$, no 20.

<ParameterLab
  id="param_resultante90"
  title="Laboratorio: ¿cuánto suman dos fuerzas perpendiculares?"
  badgeText="EXPERIMENTAR CON VARIABLES"
  description="Ajusta el módulo de dos fuerzas que forman 90°. Observa que el resultante siempre es menor que la suma aritmética de ambas."
  parameters={[
    { id: "fa", label: "Fuerza A (hacia el este)", unit: "N", min: 1, max: 20, step: 1, defaultValue: 10 },
    { id: "fb", label: "Fuerza B (hacia el norte)", unit: "N", min: 1, max: 20, step: 1, defaultValue: 10 }
  ]}
  outputLabel="Módulo del resultante (√(A² + B²))"
  outputUnit="N"
  calculateOutput={(params) => Math.sqrt(params.fa * params.fa + params.fb * params.fb)}
  guidedQuestion="¿Qué relación hay entre la suma aritmética (A + B) y el módulo resultante cuando el ángulo es 90°?"
  guidedAnswer="El resultante √(A² + B²) siempre es menor que A + B (a menos que una fuerza sea cero), porque las componentes no se alinean: Pitágoras nunca da una hipotenusa mayor que la suma de los catetos."
  xp={60}
/>

**Ejercicio de cierre de la capa.** Reúne todo lo aprendido: distingue, describe y calcula.

<AeternaExercise
  content="TITLE: La mesa del velero
HINT: Separa el problema en dos: la fuerza del motor y la fuerza del viento son perpendiculares, como los catetos de un triángulo rectángulo.
XP: 50

Un velero es empujado por su motor con una fuerza de 300 N hacia el este. El viento ejerce sobre sus velas una fuerza de 400 N hacia el norte. ¿Cuál es la magnitud de la fuerza resultante sobre el velero y cómo se relaciona con la suma aritmética (700 N)? Justifica por qué no puedes simplemente sumar 300 + 400."
/>

Has completado los fundamentos. Los vectores ya no son flechas misteriosas: son objetos con magnitud, dirección y sentido, que se escriben de varias formas y que no se suman como números. Es momento de aprender a operar con ellos como lo hace un físico.

<BotonTransicion nivel="profundizacion">¿Listo para profundizar? Pasa a 🌿 Profundización para dominar la descomposición, la suma algebraica y los productos vectoriales.</BotonTransicion>

</NivelActivo>

---

<!-- ============================================ -->
<!-- CAPA 2: PROFUNDIZACIÓN (Intermedio)           -->
<!-- ============================================ -->

<NivelActivo id="profundizacion">

<IndiceNivel titulo="🌿 Profundización">
- **1. Descomposición**: proyectar un vector sobre los ejes y convertir la geometría en álgebra.
- **2. Álgebra vectorial**: sumar y restar vectores componente a componente.
- **3. Los dos productos**: escalar (trabajo) y vectorial (torque, campo magnético).
- **4. El torque en acción**: cómo los vectores hacen girar el mundo, desde la física a los motores gráficos.
</IndiceNivel>

## 1. Descomposición: proyectando sombras

Para operar con vectores en cálculos reales, necesitamos un sistema de coordenadas. En el plano, usamos los ejes X e Y. Cualquier vector puede descomponerse en sus **componentes rectangulares**: las sombras que proyecta sobre cada eje.

$$
v_x = |\vec{v}| \cdot \cos(\theta)
$$
$$
v_y = |\vec{v}| \cdot \sin(\theta)
$$

donde $\theta$ es el ángulo que forma el vector con el eje X positivo. Esta descomposición transforma un problema vectorial en dos problemas escalares independientes. Es una de las herramientas más poderosas de la física: la suma de flechas se convierte en dos sumas de números.

<AeternaFormula
  title="Descomposición de un vector"
  formula="v_x = |\vec{v}|\cos\theta \quad,\quad v_y = |\vec{v}|\sin\theta"
  badgeText="FÓRMULA CLAVE"
  category="ÁLGEBRA VECTORIAL"
  variables={[
    { symbol: "v_x", name: "Componente horizontal del vector", unit: "u" },
    { symbol: "v_y", name: "Componente vertical del vector", unit: "u" },
    { symbol: "|\vec{v}|", name: "Módulo del vector", unit: "u" },
    { symbol: "θ", name: "Ángulo respecto al eje X positivo", unit: "rad o grados" }
  ]}
  note="Dos puertas al mismo edificio: con módulo y ángulo obtienes componentes; con componentes obtienes módulo (Pitágoras) y ángulo (arctangente)."
/>

> **🔑 Concepto clave: Descomposición vectorial**
>
> Descomponer un vector es encontrar sus proyecciones ortogonales sobre los ejes coordenados. Esto permite operar con suma y resta de vectores componente a componente, convirtiendo un problema geométrico en un problema aritmético.

**Visualización de la descomposición.** Sigue el procedimiento mental del físico: dibuja, proyecta, calcula.

<ProcessVisual 
  id="proc_descomposicion"
  title="Las 4 fases de la descomposición"
  steps={[
    "📍 **Ubica** el vector en el plano cartesiano con su origen en el origen de coordenadas.",
    "📐 **Mide** el ángulo θ que forma con el eje X positivo.",
    "📏 **Proyecta**: traza la perpendicular desde la punta del vector hasta cada eje (son las sombras).",
    "🧮 **Calcula**: v_x = |v|·cos θ y v_y = |v|·sin θ."
  ]}
/>

Comprueba ahora que comprendes cómo escalan las componentes cuando cambia el módulo.

<GraphLab
  id="graph_descomposicion"
  title="Descomposición de un vector en el plano"
  badgeText="INTERPRETAR GRÁFICA"
  description="Observa el vector v con magnitud 5 y ángulo 36.87°. Sus componentes son vx = 4 y vy = 3. La gráfica muestra la flecha y sus proyecciones sobre los ejes."
  xLabel="X"
  yLabel="Y"
  data={[
    { x: 0, y: 0, label: "Origen" },
    { x: 4, y: 3, label: "Vector (4,3)" },
    { x: 4, y: 0, label: "Proyección X" },
    { x: 0, y: 3, label: "Proyección Y" }
  ]}
  question="Si duplicamos la magnitud del vector pero mantenemos el mismo ángulo, ¿qué ocurre con sus componentes?"
  options={[
    { label: "Se duplican ambas componentes", isCorrect: true, feedback: "Correcto. Si el vector se escala por 2, sus componentes se multiplican por 2, manteniendo la proporción." },
    { label: "Solo se duplica la componente X", isCorrect: false, feedback: "No, ambas componentes dependen de la magnitud y el ángulo. Si el ángulo no cambia, ambas se escalan igual." },
    { label: "Las componentes se invierten", isCorrect: false, feedback: "No, eso ocurriría si cambiáramos el ángulo a 90° - θ, pero no es el caso." }
  ]}
  xp={50}
/>

Experimenta con el vínculo entre ángulo y componentes: sube el ángulo y observa cómo la componente X cede protagonismo a la Y.

<ParameterLab
  id="param_angulo_componentes"
  title="Laboratorio: del ángulo a las componentes"
  badgeText="EXPERIMENTAR CON VARIABLES"
  description="Fija un módulo y varía el ángulo respecto al eje X. Observa cómo las componentes vx = |v|·cos(θ) y vy = |v|·sin(θ) se reparten el módulo."
  parameters={[
    { id: "mod", label: "Módulo |v|", unit: "u", min: 1, max: 20, step: 1, defaultValue: 10 },
    { id: "ang", label: "Ángulo θ respecto al eje X", unit: "°", min: 0, max: 90, step: 1, defaultValue: 30 }
  ]}
  outputLabel="Componentes (vx, vy)"
  outputUnit="u"
  calculateOutput={(params) => {
    const rad = params.ang * Math.PI / 180;
    const vx = params.mod * Math.cos(rad);
    const vy = params.mod * Math.sin(rad);
    return `(${vx.toFixed(2)}, ${vy.toFixed(2)})`;
  }}
  guidedQuestion="¿Qué le ocurre a vx cuando el ángulo crece desde 0° hasta 90°? ¿Y a vy? ¿Cuándo son iguales ambas componentes?"
  guidedAnswer="vx disminuye (coseno decrece) y vy aumenta (seno crece). Se igualan a 45°, donde cos(45°) = sin(45°), cada una valiendo |v|/√2."
  xp={50}
/>

## 2. Álgebra vectorial: suma y resta

Para sumar vectores, nunca sumes sus magnitudes directamente (a menos que vayan en la misma dirección). El método correcto es un algoritmo de cuatro pasos, y conviene que lo memorices como una receta de cocina:

<AeternaFlowchart
  title="Método para sumar vectores"
  subtitle="Algoritmo en 4 pasos para sumar cualquier conjunto de vectores del plano"
  badgeText="MÉTODO DE SUMA VECTORIAL"
  steps={[
    {
      title: "1. Descompón cada vector",
      subtitle: "Proyectar sobre los ejes",
      description: "Calcula las componentes X e Y de cada vector usando coseno y seno del ángulo que forma con el eje X.",
      items: ["Aplica v_x = |v|·cos θ", "Aplica v_y = |v|·sin θ", "Repite para cada vector del problema"]
    },
    {
      title: "2. Suma las componentes X",
      subtitle: "Sumar números, no flechas",
      description: "Suma algebraicamente todas las componentes X de los vectores para obtener R_x.",
      items: ["R_x = A_x + B_x + C_x + ...", "Atención a los signos: componentes hacia la izquierda van negativas"]
    },
    {
      title: "3. Suma las componentes Y",
      subtitle: "Misma regla, otro eje",
      description: "Suma algebraicamente todas las componentes Y para obtener R_y.",
      items: ["R_y = A_y + B_y + C_y + ...", "Atención a los signos: componentes hacia abajo van negativas"]
    },
    {
      title: "4. Reconstruye el resultante",
      subtitle: "Pitágoras y arctangente",
      description: "Con las componentes del resultante calculas su módulo y su dirección.",
      items: ["|R| = √(R_x² + R_y²)", "θ = tan⁻¹(R_y / R_x)", "Dibuja el vector resultante"]
    }
  ]}
/>

La resta es análoga: $\vec{A} - \vec{B} = \vec{A} + (-\vec{B})$, donde $-\vec{B}$ es el vector opuesto (misma magnitud, sentido contrario). Restar es sumar el opuesto: si quieres la diferencia entre dos velocidades, añades la primera y le sumas la segunda girada 180°.

Vamos a reconstruir el orden correcto de todo el procedimiento. Ordena los pasos del principio al fin.

<SequenceBuilder
  id="seq_suma"
  title="Reconstrucción: sumar dos vectores"
  badgeText="RECONSTRUIR PROCESO"
  description="Ordena las etapas del procedimiento completo de suma vectorial de principio a fin:"
  steps={[
    { id: "s1", label: "Descomponer cada vector en sus componentes X e Y con seno y coseno" },
    { id: "s2", label: "Sumar algebraicamente todas las componentes X para obtener R_x" },
    { id: "s3", label: "Sumar algebraicamente todas las componentes Y para obtener R_y" },
    { id: "s4", label: "Calcular el módulo del resultante con Pitágoras: |R| = √(R_x² + R_y²)" },
    { id: "s5", label: "Calcular la dirección con la arctangente: θ = tan⁻¹(R_y / R_x)" }
  ]}
  correctOrderIds={["s1", "s2", "s3", "s4", "s5"]}
  explanation="Primero se descompone (geometría → álgebra), luego se suman ejes por separado (álgebra pura) y finalmente se reconstruye el resultante (álgebra → geometría)."
  xp={60}
/>

**Laboratorio de suma de vectores.** Ahora experimenta con dos vectores de módulo y ángulo variables, y observa cómo el resultante emerge de las componentes.

<ParameterLab
  id="param_suma"
  title="Laboratorio de suma de vectores"
  badgeText="EXPERIMENTAR CON VARIABLES"
  description="Ajusta los módulos y ángulos de dos vectores y observa cómo cambia el vector resultante."
  parameters={[
    { id: "modA", label: "Módulo de A", unit: "", min: 1, max: 10, step: 0.5, defaultValue: 5 },
    { id: "angA", label: "Ángulo de A (grados)", unit: "°", min: 0, max: 360, step: 5, defaultValue: 30 },
    { id: "modB", label: "Módulo de B", unit: "", min: 1, max: 10, step: 0.5, defaultValue: 4 },
    { id: "angB", label: "Ángulo de B (grados)", unit: "°", min: 0, max: 360, step: 5, defaultValue: 120 }
  ]}
  outputLabel="Módulo del vector resultante"
  outputUnit=""
  calculateOutput={(params) => {
    const ax = params.modA * Math.cos(params.angA * Math.PI / 180);
    const ay = params.modA * Math.sin(params.angA * Math.PI / 180);
    const bx = params.modB * Math.cos(params.angB * Math.PI / 180);
    const by = params.modB * Math.sin(params.angB * Math.PI / 180);
    const rx = ax + bx;
    const ry = ay + by;
    return Math.sqrt(rx*rx + ry*ry);
  }}
  guidedQuestion="¿Qué ocurre con el módulo resultante si los dos vectores tienen la misma dirección (ángulos iguales)?"
  guidedAnswer="El módulo resultante es la suma de los módulos, porque las componentes se suman directamente sin cancelaciones. Es el único caso donde sumar vectores coincide con sumar números."
  xp={70}
/>

## 3. Los dos productos: escalar y vectorial

Además de la suma y la resta, hay dos maneras de "multiplicar" vectores, y cada una responde a una pregunta distinta. No las confundas jamás: una te da un número y la otra te da una flecha.

### Producto escalar (o punto)

$$
\vec{A} \cdot \vec{B} = |\vec{A}| |\vec{B}| \cos(\theta)
$$

- Da como resultado un **escalar** (un número).
- Mide la "coincidencia" en dirección. Si son perpendiculares ($\theta = 90°$), el producto es 0.
- Es útil para calcular trabajo (fuerza × desplazamiento × cos θ).

<AeternaFormula
  title="Producto escalar (punto)"
  formula="\vec{A} \cdot \vec{B} = |\vec{A}|\,|\vec{B}| \cos\theta"
  badgeText="FÓRMULA CLAVE"
  category="ÁLGEBRA VECTORIAL"
  variables={[
    { symbol: "\vec{A} \cdot \vec{B}", name: "Producto escalar (resultado: un número)", unit: "unidad²" },
    { symbol: "|\vec{A}|, |\vec{B}|", name: "Módulos de los dos vectores", unit: "u" },
    { symbol: "θ", name: "Ángulo entre los dos vectores", unit: "rad o grados" }
  ]}
  note="Pregunta que responde: '¿cuánto se parecen las direcciones de A y B?' Si son perpendiculares, se parecen en cero → producto cero. Es la base del trabajo mecánico W = F·d·cos θ."
/>

### Producto vectorial (o cruz)

$$
\vec{A} \times \vec{B} = |\vec{A}| |\vec{B}| \sin(\theta) \, \hat{n}
$$

- Da como resultado un **nuevo vector** perpendicular al plano formado por $\vec{A}$ y $\vec{B}$.
- Su magnitud es el área del paralelogramo que forman.
- Es clave en el torque, el momento angular y el magnetismo.

<AeternaFormula
  title="Producto vectorial (cruz)"
  formula="\vec{A} \times \vec{B} = |\vec{A}|\,|\vec{B}| \sin\theta \; \hat{n}"
  badgeText="FÓRMULA CLAVE"
  category="ÁLGEBRA VECTORIAL"
  variables={[
    { symbol: "\vec{A} \times \vec{B}", name: "Producto vectorial (resultado: un vector)", unit: "u²" },
    { symbol: "\hat{n}", name: "Vector unitario perpendicular al plano de A y B (regla de la mano derecha)", unit: "adimensional" },
    { symbol: "θ", name: "Ángulo entre los dos vectores", unit: "rad o grados" }
  ]}
  note="Pregunta que responde: '¿cuánto se cruzan las direcciones?' Si son paralelas, se cruzan en cero → resultado nulo. Si son perpendiculares, el producto es máximo. Es la base del torque y de la fuerza magnética."
/>

**Tabla comparativa de los dos productos.** Domina la diferencia en un solo golpe de vista:

<ComparativeTable
  id="comp_productos"
  title="Producto escalar vs. producto vectorial"
  headers={["Aspecto", "Producto escalar (·)", "Producto vectorial (×)"]}
  rows={[
    ["Resultado", "Escalar (número)", "Vector (flecha)"],
    ["Fórmula", "A·B·cos θ", "A·B·sin θ · n̂"],
    ["Máximo cuando", "Vectores paralelos (θ = 0°)", "Vectores perpendiculares (θ = 90°)"],
    ["Cero cuando", "Vectores perpendiculares (θ = 90°)", "Vectores paralelos (θ = 0°)"],
    ["Interpretación", "Proyección de uno sobre otro", "Área orientada del paralelogramo"],
    ["Aplicación", "Trabajo, potencia, flujo", "Torque, momento angular, fuerza magnética"],
    ["Propiedad", "Conmutativo: A·B = B·A", "Anticonmutativo: A×B = −(B×A)"]
  ]}
/>

> **⚠️ Error común: el orden importa en el producto cruz**
>
> El producto escalar es conmutativo (A·B = B·A, da igual el orden). El producto vectorial no: A×B = −(B×A). Cambiar el orden invierte el sentido del vector resultante. Confundir esto en un problema de torque te dará el giro al revés.

Pon a prueba si distingues los dos productos antes de aplicarlos al torque.

<AeternaExercise
  content="TITLE: Dos productos, dos mundos
HINT: Pregúntate qué pide cada caso: ¿un número (escalar) o una flecha (vectorial)? ¿Paralelos o perpendiculares?
XP: 50

Dos vectores tienen módulos |A| = 4 y |B| = 3, con un ángulo de 90° entre ellos. Calcula: (a) el producto escalar A·B, (b) el producto vectorial A×B. Después responde: si los vectores fueran paralelos (θ = 0°), ¿qué pasaría con ambos productos? Justifica cada resultado y explica qué representa cada uno físicamente."
/>

## 4. El torque en acción: cómo los vectores hacen girar el mundo

El producto vectorial no es un juguete algebraico: es la maquinaria de las rotaciones. El **torque** ($\vec{\tau} = \vec{r} \times \vec{F}$) mide la capacidad de una fuerza para hacer girar un objeto. Aprietas una tuerca con una llave: la fuerza $\vec{F}$ aplicada al extremo del mango ($\vec{r}$) genera un torque. Si empujas a lo largo del mango (paralelo), no gira nada; si empujas perpendicular, gira con máxima eficacia. Eso es exactamente el sin θ del producto cruz en acción.

Sigue la cadena causal que conecta la fuerza con la rotación.

<CausalMap
  id="causal_torque"
  title="Cadena causal del giro de una tuerca"
  badgeText="RAZONAMIENTO CAUSAL"
  description="Enlaza los eslabones de causa y efecto que explican cómo se afloja una tuerca:"
  nodes={[
    { id: "c1", text: "Se aplica una fuerza F perpendicular al mango de la llave" },
    { id: "c2", text: "El brazo de palanca r y la fuerza F forman un ángulo de 90°" },
    { id: "c3", text: "El producto vectorial τ = r × F alcanza su máximo (sin 90° = 1)" },
    { id: "c4", text: "La tuerca gira en el sentido indicado por la regla de la mano derecha" }
  ]}
  validEdges={[
    { causeId: "c1", effectId: "c2" },
    { causeId: "c2", effectId: "c3" },
    { causeId: "c3", effectId: "c4" }
  ]}
  explanation="Cada eslabón depende del anterior: el ángulo recto maximiza el seno, el seno máximo maximiza el torque, y el torque produce la rotación. Si el ángulo fuera 0°, la cadena se rompería en el segundo eslabón."
  xp={65}
/>

Ahora decide qué variables entran en el modelo del torque y cuáles sobran. Esta es la habilidad del físico: simplificar sin traicionar.

<ModelBuilder
  id="model_torque"
  title="Modelo de torque con vectores"
  badgeText="MODELIZAR Y SIMPLIFICAR"
  problemDescription="El torque (τ) que ejerce una fuerza F sobre un objeto es τ = r × F, donde r es el vector desde el eje de rotación hasta el punto de aplicación de la fuerza. Selecciona las variables relevantes para determinar la magnitud del torque."
  availableVariables={[
    { id: "v1", name: "Magnitud de la fuerza (F)", isRelevant: true, justification: "A mayor fuerza, mayor torque (directamente proporcional)." },
    { id: "v2", name: "Distancia desde el eje (r)", isRelevant: true, justification: "A mayor distancia, mayor torque (brazo de palanca)." },
    { id: "v3", name: "Ángulo entre r y F", isRelevant: true, justification: "El torque máximo ocurre a 90°, y es nulo cuando son paralelos." },
    { id: "v4", name: "Masa del objeto", isRelevant: false, justification: "La masa afecta la inercia, no el torque aplicado." },
    { id: "v5", name: "Velocidad angular", isRelevant: false, justification: "La velocidad angular es el resultado del torque, no un factor que lo determine directamente." }
  ]}
  xp={70}
/>

Los vectores que acabas de dominar no viven solo en los libros de física: son el corazón de los motores gráficos de tus videojuegos favoritos.

<Connect 
  title="Álgebra vectorial y motores gráficos" 
  sourceConcept="Producto vectorial y normales (Física)" 
  targetConcept="Iluminación y colisiones (Gráficos por computadora)" 
  content="En un videojuego, la luz que incide sobre una superficie se calcula con el producto escalar entre el vector de luz y la normal (perpendicular) a la superficie; si el ángulo es obtuso, la zona está en sombra. Y el producto vectorial sirve para calcular normales a partir de los vértices de un triángulo 3D. La misma matemática de Maxwell ilumina tus partidas." 
/>

<AeternaDecisionBox 
  id="decision_suma_geometrica"
  badgeText="Reflexión de Laboratorio"
  title="La suma que no es suma"
  question="Si dos fuerzas de igual magnitud actúan sobre un objeto, ¿en qué situación la fuerza resultante es nula, y por qué ese caso violaría la intuición de 'sumar' como sumamos números?"
  xp={50}
  buttonText="Aceptar y Registrar Gnosis"
  completedText="Gnosis Registrada"
/>

En la capa de profundización aprendiste a descomponer, sumar, restar y multiplicar vectores. Ya operas con flechas como un físico: las conviertes en números, haces aritmética y reconstruyes el resultado. Ahora viene la parte emocionante: aplicar todo esto a problemas reales de navegación, electromagnetismo y relatividad.

<BotonTransicion nivel="frontera">¿Listo para la frontera? Pasa a 🔬 Frontera para explorar la regla de la mano derecha, la navegación con viento y la conexión con los tensores.</BotonTransicion>

</NivelActivo>

---

<!-- ============================================ -->
<!-- CAPA 3: FRONTERA (Avanzado)                   -->
<!-- ============================================ -->

<NivelActivo id="frontera">

<IndiceNivel titulo="🌳 Frontera">
- **1. La regla de la mano derecha**: la orientación del producto vectorial en el espacio.
- **2. Navegación aérea con viento cruzado**: un problema real de ingeniería aeroespacial.
- **3. Contraejemplos**: por qué |A + B| casi nunca es |A| + |B|.
- **4. Evidencias históricas**: de Gibbs a Maxwell, cómo nació el álgebra vectorial.
- **5. Supuestos ocultos**: el espacio plano que damos por sentado.
- **6. Más allá de los vectores**: los tensores y el espacio-tiempo.
- **7. Transferencia al 3D**: navegación en un mundo de tres dimensiones.
</IndiceNivel>

## 1. La regla de la mano derecha en el espacio

El producto vectorial no es solo una operación algebraica; es la base de cómo el universo gestiona las rotaciones y el magnetismo. La **regla de la mano derecha** permite determinar la dirección del vector resultante en un producto cruz:

<ProcessVisual 
  id="proc_mano_derecha"
  title="Regla de la mano derecha (3 pasos)"
  steps={[
    "✋ **Abre** la palma de tu mano derecha y alíneala a lo largo del primer vector (A).",
    "🤏 **Cierra** los dedos en dirección del segundo vector (B), como si fueras a empuñar algo.",
    "👍 **Pulgar** extendido: apunta exactamente en la dirección de A × B, el vector resultante."
  ]}
/>

> **🔑 Concepto clave: Regla de la mano derecha**
>
> Es un convenio para determinar la dirección de un vector perpendicular a otros dos. Sin ella, no podríamos saber si un torque gira en sentido horario o antihorario, ni la dirección de la fuerza magnética sobre una carga en movimiento. Es una de las reglas mnemotécnicas más rentables de toda la física.

Esta regla es fundamental en mecánica (torque, momento angular), electromagnetismo (fuerza de Lorentz) y hasta en gráficos por computadora (cálculo de normales a superficies).

Aplica la regla mentalmente antes de leer la respuesta.

<PredictionBox
  id="pred_mano_derecha"
  title="Predice: ¿hacia dónde apunta A × B?"
  badgeText="PREDECIR ANTES DE OBSERVAR"
  question="El vector A apunta hacia el este y el vector B hacia el norte. Usando la regla de la mano derecha (palma sobre A, dedos cerrando hacia B), ¿hacia dónde apunta el pulgar, es decir, el vector A × B?"
  options={[
    { label: "Hacia el este", isCorrect: false, feedback: "No. El resultado del producto cruz es perpendicular a ambos vectores, así que no puede apuntar al plano horizontal del este." },
    { label: "Hacia arriba (fuera de la pantalla)", isCorrect: true, feedback: "¡Correcto! Palma sobre A (este), dedos cerrando hacia B (norte): el pulgar señala hacia arriba. Por eso el eje Z positivo es precisamente el resultado de este producto." },
    { label: "Hacia abajo (dentro de la pantalla)", isCorrect: false, feedback: "Casi: eso sería B × A. El producto cruz no es conmutativo: invierte el orden y el pulgar apunta al lado opuesto." }
  ]}
  explanation="En coordenadas estándar, X × Y = Z. La regla de la mano derecha es el convenio que fija el sentido de los ejes: los sistemas de coordenadas 'diestros' son los que cumplen esta regla."
  xp={50}
/>

## 2. Problema de reto: navegación aérea con viento cruzado

Un avión quiere volar hacia el norte (respecto al suelo). En aire quieto, su velocidad es de 200 km/h. Pero sopla un viento que viene del este y empuja hacia el oeste a 50 km/h. El piloto no puede dejar que el viento lo arrastre: debe compensarlo.

**El desafío:** ¿En qué dirección debe apuntar la nariz del avión para que su trayectoria real respecto al suelo sea exactamente hacia el norte?

La física del problema se reduce a una sola ecuación vectorial: la velocidad respecto al suelo es la suma del avión respecto al aire más el viento.

$$
\vec{v}_{\text{avión}} + \vec{v}_{\text{viento}} = \vec{v}_{\text{suelo}}
$$

Llamemos:
- $\vec{v}_{\text{avión}}$ = velocidad del avión respecto al aire (magnitud 200 km/h, ángulo desconocido).
- $\vec{v}_{\text{viento}}$ = velocidad del viento = 50 km/h hacia el oeste (vector $(-50, 0)$).
- $\vec{v}_{\text{suelo}}$ = velocidad respecto al suelo, que debe ser hacia el norte (vector $(0, v)$).

El avión debe apuntar ligeramente hacia el oeste para que el viento lo empuje hacia el este justo lo necesario. Despejando:

$$
\vec{v}_{\text{avión}} = \vec{v}_{\text{suelo}} - \vec{v}_{\text{viento}} = (0, v) - (-50, 0) = (50, v)
$$

La magnitud del vector del avión es 200 km/h, así que aplicamos Pitágoras:

$$
\sqrt{50^2 + v^2} = 200 \Rightarrow v = \sqrt{200^2 - 50^2} = \sqrt{37500} \approx 193.65 \text{ km/h}
$$

La corrección angular respecto al norte es:

$$
\theta = \tan^{-1}\left(\frac{50}{193.65}\right) \approx 14.5^\circ
$$

<AeternaFormula
  title="Corrección de rumbo del piloto"
  formula="\theta = \tan^{-1}\!\left(\frac{v_{\text{viento}}}{v_{\text{suelo}}}\right) = \tan^{-1}\!\left(\frac{50}{193.65}\right) \approx 14.5^\circ"
  badgeText="APLICACIÓN REAL"
  category="NAVEGACIÓN AEROESPACIAL"
  variables={[
    { symbol: "θ", name: "Ángulo de corrección hacia el oeste respecto al norte", unit: "grados" },
    { symbol: "v_viento", name: "Velocidad del viento cruzado", unit: "km/h" },
    { symbol: "v_suelo", name: "Velocidad real respecto al suelo", unit: "km/h" }
  ]}
  note="El piloto orienta la nariz 14.5° hacia el oeste del norte; el viento la desvía hacia el este justo lo necesario para que el rumbo real sea norte. Sin vectores, no hay avión comercial."
/>

> **💡 Reflexión:** Este problema ilustra cómo la suma vectorial es esencial en la navegación, la meteorología y la ingeniería aeroespacial. Sin vectores, los aviones no podrían mantener su rumbo en presencia de vientos cruzados. Cada despegue que has visto es un ejercicio de álgebra vectorial resuelto en tiempo real.

Evalúa ahora si el argumento de un piloto novato resiste el análisis.

<ArgumentEvaluation
  id="arg_viento"
  title="Evaluación: la excusa del piloto"
  badgeText="EVALUAR ARGUMENTO"
  argumentText="'Con este viento de 50 km/h hacia el oeste, mi velocidad respecto al suelo será de 250 km/h: 200 km/h de mi motor más 50 km/h de empuje del viento, todo hacia el norte.'"
  criteria={[
    { id: "cr1", label: "El argumento es correcto: los vectores se suman con aritmética simple.", isCorrectProblem: false, feedback: "Incorrecto. El viento empuja hacia el OESTE, no hacia el norte: son vectores perpendiculares y no se suman como números." },
    { id: "cr2", label: "El argumento contiene un error: el viento es perpendicular al rumbo, así que no suma rapidez: cambia la dirección y obliga a corregir el rumbo.", isCorrectProblem: true, feedback: "¡Excelente evaluación! El viento cruzado no acelera el avión hacia el norte: lo desvía hacia el oeste. Por eso el piloto debe apuntar 14.5° a barlovento y su rapidez al norte será ~193.65 km/h, menor que 200." }
  ]}
  xp={60}
/>

Cuantifica cómo el viento obliga a corregir el rumbo: cuanto más fuerte sopla el viento cruzado, mayor es la desviación que hay que compensar.

<ParameterLab
  id="param_compensacion_viento"
  title="Laboratorio: compensando el viento cruzado"
  badgeText="EXPERIMENTAR CON VARIABLES"
  description="Un avión vuela a 200 km/h respecto al aire. Ajusta la rapidez del viento cruzado y observa cuánto debe corregir su rumbo para seguir al norte exacto."
  parameters={[
    { id: "vv", label: "Velocidad del viento cruzado", unit: "km/h", min: 0, max: 120, step: 5, defaultValue: 50 },
    { id: "va", label: "Rapidez del avión respecto al aire", unit: "km/h", min: 100, max: 300, step: 10, defaultValue: 200 }
  ]}
  outputLabel="Ángulo de corrección θ"
  outputUnit="°"
  calculateOutput={(params) => {
    if (params.vv >= params.va) return "∞ (no puede compensarse)";
    const theta = Math.atan2(params.vv, Math.sqrt(params.va * params.va - params.vv * params.vv));
    return (theta * 180 / Math.PI).toFixed(1);
  }}
  guidedQuestion="¿Qué ocurre con el ángulo de corrección cuando el viento se aproxima a la rapidez del avión? ¿Qué pasaría si lo igualara o superara?"
  guidedAnswer="El ángulo crece sin límite: tiende a 90° cuando el viento iguala la rapidez del avión. Si lo supera, es imposible mantener un rumbo norte: ningún ángulo de corrección basta."
  xp={50}
/>

## 3. Contraejemplos: la desigualdad triangular

¿Recuerdas el error de sumar módulos? Ahora vamos a cazarlo a nivel formal. La afirmación "el módulo de la suma es la suma de los módulos" solo se cumple cuando los vectores son paralelos y del mismo sentido. En cualquier otro caso, |A + B| < |A| + |B|. Esto se llama **desigualdad triangular**, y es una de las piedras angulares del álgebra vectorial.

<Counterexample
  id="counter_suma"
  title="Búsqueda de contraejemplo: ¿siempre se suman los módulos?"
  badgeText="PENSAMIENTO CRÍTICO"
  generalStatement="Para cualesquiera dos vectores A y B, se cumple que |A + B| = |A| + |B|."
  candidates={[
    { id: "c1", label: "A y B paralelos y del mismo sentido (A = 3, B = 4, ambos al este)", isCounterexample: false, explanation: "Aquí sí se cumple: |A + B| = 7 = 3 + 4. La igualdad solo vale en este caso." },
    { id: "c2", label: "A = 3 N al este, B = 4 N al norte (perpendiculares)", isCounterexample: true, explanation: "¡Contraejemplo perfecto! |A + B| = √(3² + 4²) = 5 N, que es menor que 7 N. La igualdad se rompe: la suma vectorial compone, no acumula." },
    { id: "c3", label: "A y B opuestos y del mismo módulo (A = 3 al este, B = 3 al oeste)", isCounterexample: true, explanation: "Otro contraejemplo extremo: |A + B| = 0, mientras que |A| + |B| = 6. Los vectores opuestos se anulan por completo." }
  ]}
  xp={60}
/>

> **🧠 Dato rompe-cerebro: la desigualdad triangular es la 'regla de oro' de los espacios métricos**
>
> La desigualdad |A + B| ≤ |A| + |B| no es exclusiva de los vectores: es uno de los axiomas que definen cualquier noción de 'distancia' en matemáticas. La cumplen los números reales, los vectores, las funciones y hasta los espacios abstractos de Hilbert de la mecánica cuántica. Encontrarás esta misma desigualdad en prácticamente toda la matemática moderna.

## 4. Evidencias históricas: cómo nació el álgebra vectorial

Los vectores que manejas hoy no nacieron de un día para otro: son el resultado de un siglo de debates entre matemáticos y físicos que discutían cómo describir las fuerzas del mundo. Empareja cada pieza de la historia con su protagonista.

<EvidenceMatcher
  id="evidence_historia"
  title="Emparejamiento: los padres del álgebra vectorial"
  badgeText="EVALUACIÓN DE EVIDENCIAS"
  description="Relaciona cada hito del desarrollo del álgebra vectorial con su protagonista histórico:"
  claims={[
    { id: "c1", statement: "Desarrolló el análisis vectorial moderno y la notación de los productos punto y cruz, publicándola en 'Vector Analysis'." },
    { id: "c2", statement: "Inventó los cuaterniones, un sistema algebraico de cuatro dimensiones que precedió a los vectores y que Maxwell intentó usar para su electromagnetismo." },
    { id: "c3", statement: "Consolidó el electromagnetismo en un conjunto de ecuaciones que los físicos luego escribieron en lenguaje vectorial, prediciendo las ondas de radio." }
  ]}
  evidences={[
    { id: "e1", sourceText: "Josiah Willard Gibbs (y Oliver Heaviside)", matchesClaimId: "c1", explanation: "Gibbs, físico de Yale, liberó a los científicos de los cuaterniones y estableció el análisis vectorial como lo conocemos." },
    { id: "e2", sourceText: "William Rowan Hamilton", matchesClaimId: "c2", explanation: "Grabó su fórmula fundamental de cuaterniones en el puente de Broom, en Dublín, en 1843." },
    { id: "e3", sourceText: "James Clerk Maxwell", matchesClaimId: "c3", explanation: "Sus 20 ecuaciones originales se condensaron después en las 4 ecuaciones vectoriales que hoy estudias." }
  ]}
  xp={60}
/>

## 5. Supuestos ocultos: el espacio plano que damos por sentado

Hasta ahora hemos trabajado con vectores en un espacio plano (euclidiano), donde las reglas de Pitágoras y la descomposición ortogonal funcionan sin complicaciones. Pero ese es un supuesto, no una ley divina.

<HiddenAssumption 
  title="El supuesto del espacio plano" 
  assumption="La suma de vectores con componentes y Pitágoras asume que el espacio es euclidiano y plano: la geometría que aprendiste en el instituto." 
  implication="En relatividad general, la gravedad curva el espacio-tiempo. Cerca de un agujero negro, sumar 'flechas' con Pitágoras deja de ser válido y hay que usar la geometría del espacio curvo (tensores métricos). Los vectores siguen existiendo, pero se definen sobre cada punto con reglas locales." 
/>

Este es el puente conceptual hacia el último tema: cuando el espacio se curva, los vectores se generalizan en tensores.

Antes de cruzar el puente, pon a prueba tu intuición sobre el límite del supuesto plano.

<PredictionBox
  id="pred_espacio_curvo"
  title="Predice: ¿Pitágoras sobrevive a un agujero negro?"
  badgeText="PREDECIR ANTES DE OBSERVAR"
  question="Cerca de un agujero negro, la gravedad curva el espacio-tiempo de forma extrema. Si intentas calcular la 'longitud' de un vector usando la fórmula plana |v| = √(vx² + vy²) en esa región, ¿qué ocurre?"
  options={[
    { label: "Funciona perfectamente, el espacio siempre es plano", isCorrect: false, feedback: "No. La curvatura del espacio-tiempo deforma las distancias: la geometría euclidiana es solo una aproximación local." },
    { label: "Deja de ser exacta: hay que usar la métrica del espacio curvo", isCorrect: true, feedback: "¡Correcto! La fórmula plana vale solo en espacios euclidianos. Cerca del agujero negro hay que usar el tensor métrico, que describe cómo se miden las distancias en cada punto." },
    { label: "Los vectores dejan de existir por completo", isCorrect: false, feedback: "No: los vectores siguen existiendo, pero se definen en el espacio tangente de cada punto, con reglas locales. Se generalizan en tensores, no desaparecen." }
  ]}
  explanation="La lección profunda: las herramientas que usamos (Pitágoras, descomposición ortogonal) descansan sobre el supuesto de espacio plano. Cuando el supuesto se rompe, la herramienta se generaliza — los vectores se convierten en tensores."
  xp={50}
/>

## 6. El límite de los vectores: los tensores

En niveles avanzados de física, los vectores son casos particulares de objetos más generales llamados **tensores**. 

- Un **escalar** es un tensor de rango 0 (solo magnitud).
- Un **vector** es un tensor de rango 1 (magnitud y dirección).
- Un **tensor de rango 2** puede describir esfuerzos en un material (por ejemplo, la presión en diferentes direcciones), la curvatura del espacio-tiempo en relatividad general, o la polarización de la luz.

Los tensores son la herramienta matemática que utiliza Einstein para formular sus ecuaciones de campo. Dominar los vectores hoy es abrir la puerta a la física de altas energías, la cosmología y la ingeniería estructural.

<PredictionBox
  id="pred_tensor"
  title="Predice: ¿qué tipo de magnitud es la deformación de un material?"
  badgeText="PREDECIR ANTES DE OBSERVAR"
  question="Cuando aplicas fuerzas sobre un sólido, este se deforma. La deformación en un punto dado se describe por un conjunto de números que dependen de la dirección en que se mida. ¿Qué tipo de objeto matemático necesitas para describir la deformación?"
  options={[
    { label: "Escalar", isCorrect: false, feedback: "No, la deformación no es la misma en todas las direcciones; no basta un número." },
    { label: "Vector", isCorrect: false, feedback: "Un vector solo tiene una dirección, pero la deformación puede ser diferente en varias direcciones a la vez." },
    { label: "Tensor (rango 2)", isCorrect: true, feedback: "¡Correcto! La deformación se describe por un tensor de rango 2, que asigna una dirección y magnitud a cada orientación del material." }
  ]}
  explanation="Un tensor de rango 2 es una generalización de un vector: en lugar de tener componentes vi, tiene componentes Tij (una matriz). Puede representar propiedades que varían según la dirección, como el estrés, la deformación o la curvatura del espacio."
  xp={50}
/>

## 7. Transferencia a un problema nuevo: análisis vectorial en 3D

Has aplicado vectores en 2D para la navegación aérea. Ahora **extiende el problema a 3D**. Imagina que el avión no solo debe contrarrestar el viento horizontal, sino también una corriente vertical descendente (aire que baja) de 10 km/h. El piloto quiere mantener una trayectoria horizontal (sin ascender ni descender).

Este es el momento de transferir lo aprendido a un dominio nuevo, como hace el físico cuando ataca un problema desconocido.

<Transfer 
  title="Del plano al espacio: el dron de reparto" 
  targetDomain="Robótica y simulación de vuelo 3D" 
  prompt="Un dron de reparto debe mantener su posición fija en el aire mientras sopla un viento de 8 km/h hacia el norte y una corriente ascendente (térmica) lo empuja hacia arriba a 2 km/h. Con vectores en 3D (X: este-oeste, Y: norte-sur, Z: vertical), determina qué componentes de empuje debe generar cada rotor para anular ambos efectos. ¿Qué ecuaciones vectoriales planteas y cómo las resuelves componente a componente?" 
/>

Consolida la transferencia con un caso numérico completo.

<AeternaExercise
  content="TITLE: El dron de reparto en 3D
HINT: Trabaja eje por eje. El viento actúa en Y, la térmica en Z. Escribe la ecuación vectorial y luego cada componente por separado.
XP: 60

Un dron debe mantenerse suspendido y en reposo. Un viento de 8 km/h lo empuja hacia el norte (eje Y) y una térmica lo empuja hacia arriba a 2 km/h (eje Z). ¿Qué vector de empuje E = (Ex, Ey, Ez) debe generar el dron para anular ambos efectos y mantenerse inmóvil? Escribe la ecuación vectorial y resuelve cada componente. Justifica el signo de cada una."
/>

**El desafío:** ¿Qué componentes debe tener la velocidad del avión respecto al aire para compensar el viento cruzado y la corriente descendente, manteniendo el módulo de 200 km/h y la trayectoria norte?

**Pasos:**
1. Plantea el problema en coordenadas (X: este-oeste, Y: norte-sur, Z: vertical).
2. El viento cruzado está en el eje X (50 km/h hacia el oeste), la corriente descendente en el eje Z (10 km/h hacia abajo).
3. La velocidad deseada respecto al suelo es únicamente hacia el norte (eje Y), con componente Z = 0.
4. Escribe la ecuación vectorial $\vec{v}_{\text{avión}} + \vec{v}_{\text{viento}} + \vec{v}_{\text{corriente}} = \vec{v}_{\text{suelo}}$.
5. Determina las componentes necesarias de $\vec{v}_{\text{avión}}$ en X, Y y Z, sabiendo que su módulo total es 200 km/h.

> **💡 Solución orientativa:** Deberás tener una componente X = 50 km/h (para contrarrestar el viento), componente Z = +10 km/h (para contrarrestar la corriente descendente), y la componente Y se ajusta para que el módulo total sea 200: $Y = \sqrt{200^2 - 50^2 - 10^2} \approx 193.2$ km/h. El avión deberá apuntar ligeramente hacia arriba y hacia el oeste. La generalización es directa: cada eje es un problema escalar independiente, y el módulo se reconstruye con Pitágoras en tres dimensiones.

Este ejercicio te obliga a trabajar con vectores en tres dimensiones, una habilidad esencial para la mecánica orbital, la robótica y la simulación de fluidos. Fíjate en la potencia del método: pasaste de un problema de avión a uno de dron, de 2D a 3D, sin cambiar las herramientas — solo añadiendo un eje más.

Antes de cerrar la frontera, una última reflexión profunda que conecta todo el viaje.

<AeternaDecisionBox 
  id="decision_vectores_realidad"
  badgeText="Reflexión Final del Viaje"
  title="¿Inventados o descubiertos?"
  question="Los vectores son un modelo matemático que describimos con flechas sobre papel. Pero las fuerzas, las velocidades y los campos que representan existen independientemente de nosotros. ¿Crees que los vectores son un invento humano para ordenar el caos, o un descubrimiento de una estructura real del universo?"
  xp={50}
  buttonText="Aceptar y Registrar Gnosis"
  completedText="Gnosis Registrada"
/>

La frontera se cierra donde empieza otro territorio. Dominas las flechas en 2D y 3D, conoces sus productos, cazas los errores históricos y sabes que el mundo plano es solo una aproximación. Has pasado de no saber qué es una magnitud vectorial a navegar con viento cruzado y plantear problemas de tensores. Eso es exactamente lo que hace un físico: escalar capa por capa.

</NivelActivo>

---

<!-- ============================================ -->
<!-- SECCIONES COMUNES A TODOS LOS NIVELES         -->
<!-- ============================================ -->

## ❓ Preguntas frecuentes sobre vectores

> **❓ Preguntas frecuentes**
>
> **¿Por qué no se pueden sumar vectores como números normales?**  
> Porque la suma de vectores tiene en cuenta la dirección. Si sumas 5 km al este y 5 km al norte, no obtienes 10 km, sino $\sqrt{5^2+5^2} \approx 7.07$ km en dirección noreste. La suma de flechas sigue la ley del paralelogramo.
>
> **¿Qué diferencia hay entre dirección y sentido?**  
> La dirección es la orientación de la recta que contiene al vector (por ejemplo, horizontal, vertical, 30° con el eje X). El sentido es la punta de la flecha (por ejemplo, hacia la derecha o hacia la izquierda). Dos vectores con la misma dirección pero sentido opuesto son diferentes.
>
> **¿Para qué sirve el producto escalar en la vida real?**  
> El producto escalar se usa para calcular el trabajo realizado por una fuerza ($\vec{F} \cdot \vec{d}$), el flujo de un campo (como en electromagnetismo) y en algoritmos de machine learning (para medir similitud entre vectores de características).
>
> **¿Qué es la regla de la mano derecha?**  
> Es un método mnemotécnico para determinar la dirección del producto vectorial. Coloca la palma de la mano derecha a lo largo del primer vector, cierra los dedos hacia el segundo, y el pulgar indica la dirección del resultado.
>
> **¿Los vectores existen en la naturaleza o son solo matemáticas?**  
> Los vectores son un modelo matemático que representa propiedades físicas que tienen dirección. La velocidad, la fuerza y el campo magnético son realidades físicas; los vectores son la herramienta que usamos para describirlas y predecirlas.
>
> **¿Qué es un tensor?**  
> Un tensor es una generalización de un vector. Mientras que un vector tiene componentes $v_i$ (uno por dirección), un tensor de rango 2 tiene componentes $T_{ij}$ (una matriz). Sirve para describir propiedades que varían con la dirección, como la deformación de un material o la curvatura del espacio-tiempo.

## 🧠 Sistema Aeterna: ¿Qué acabas de aprender?

> **🧠 Sistema Aeterna, paso 1: Distingue escalares de vectores**  
> Antes de operar, pregunta: ¿esta magnitud necesita dirección? La masa no, la fuerza sí. Si no distingues, sumarás peras con manzanas y obtendrás resultados absurdos. Cada vez que veas un número en física, pregúntate: ¿esto es una cantidad o una flecha?
>
> **🧠 Sistema Aeterna, paso 2: Descompón siempre**  
> La descomposición en ejes coordenados convierte un problema complicado en dos (o tres) problemas simples. Es la llave maestra del álgebra vectorial. Cuando un problema de fuerzas te parezca imposible, proyéctalo sobre los ejes y la geometría se vuelve aritmética.
>
> **🧠 Sistema Aeterna, paso 3: Piensa en 3D**  
> El mundo no es plano. La física real ocurre en tres dimensiones. Los vectores en 2D son un entrenamiento; los tensores en 4D son el destino. Pero todo empieza con dominar las flechas. Cada eje resuelto por separado es una victoria, y el módulo final es solo Pitágoras con más catetos.

---

> **⚠️ Siguiente parada: Cinemática — Espacio, Tiempo y Movimiento**  
> Con los vectores ya sabes cómo describir direcciones. Ahora vas a aplicarlos al movimiento: posición, velocidad y aceleración. La cinemática te enseñará a predecir dónde estará un objeto en cualquier instante, y descubrirás por qué la gravedad es la gran protagonista de la trayectoria. [Sigue la ruta →](#)

---

**📚 Para seguir explorando:** *"Vectores y tensores"* de Daniel A. Fleisch es una puerta de entrada rigurosa y accesible: explica paso a paso cómo se pasa de las flechas del plano a los tensores de la relatividad, con ejemplos de física aplicada en cada capítulo. [Consíguelo aquí](enlace-afiliado).
