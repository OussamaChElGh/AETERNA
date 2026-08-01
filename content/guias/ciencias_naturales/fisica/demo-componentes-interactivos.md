---
title: "Guía Interactiva: Demostración del Ecosistema Completo de Componentes Aeterna"
description: "Artículo patrón de demostración pedagógica que integra la suite completa de 12 actividades interactivas de Aeterna: PredictionBox, ParameterLab, GraphLab, ErrorHunter, ModelBuilder, ConceptMap, ArgumentBuilder, CausalMap, EvidenceMatcher, Counterexample, ArgumentEvaluation y SequenceBuilder."
slug: "demo-componentes-interactivos"
author: "Aeterna"
category: "ciencias"
subcategory: "fisica"
tags: ["física", "interactivo", "metodología", "laboratorio", "demostración", "argumentación", "causalidad"]
image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=2070&auto=format&fit=crop"
date: "2026-07-30"
nivel: 1
orden: 99
insignia: "Maestro de las Experiencias Pedagógicas"
tipo: "methodological"
articleType: "methodological"
---

# Guía Interactiva: Demostración del Ecosistema Completo de Componentes Aeterna

Bienvenido a esta guía viva de demostración. En este artículo podrás interactuar y poner a prueba los **12 tipos de experiencias de aprendizaje** que constituyen el ecosistema pedagógico completo de Aeterna.

---

## 1. Capa de Inicio: Predicción, Estructuración Conceptual y Fundamentos

En la fase inicial de aprendizaje, el objetivo es motivar al alumno mediante la **predicción activa antes de la observación**, la **estructuración conceptual** y la comprobación de fundamentos.

### Experiencia 1: Predicción Activa (`PredictionBox`)

<PredictionBox
  id="demo_pred_1"
  title="Predicción de Aceleración en Masa Duplicada"
  badgeText="PREDECIR ANTES DE OBSERVAR"
  question="Si duplicamos la masa de un carro manteniendo constante la fuerza neta que tira de él, ¿qué ocurrirá con su aceleración?"
  options={[
    { label: "La aceleración se duplicará (2a)", isCorrect: false, feedback: "Incorrecto. Recuerda que la masa se opone al cambio de movimiento (inercia)." },
    { label: "La aceleración se reducirá a la mitad (a/2)", isCorrect: true, feedback: "¡Predicción correcta! Al ser inversamente proporcional a la masa, duplicar la masa reduce la aceleración a la mitad." },
    { label: "La aceleración no cambiará", isCorrect: false, feedback: "Incorrecto. La aceleración depende directamente de la masa según a = F/m." }
  ]}
  explanation="Según la Segunda Ley de Newton $a = \frac{F}{m}$, la aceleración es inversamente proporcional a la masa del objeto cuando la fuerza permanece constante."
  xp={50}
/>

### Experiencia 2: Mapa de Conceptos (`ConceptMap`)

<ConceptMap
  id="demo_concept_1"
  title="Red de Conceptos de la Dinámica Newtoniana"
  badgeText="RELACIONAR CONCEPTOS"
  description="Conecta los conceptos fundamentales para construir la estructura teórica de la Segunda Ley de Newton:"
  nodes={[
    { id: "fuerza", label: "Fuerza Neta (F)" },
    { id: "masa", label: "Masa Inercial (m)" },
    { id: "aceleracion", label: "Aceleración (a)" }
  ]}
  relationOptions={["produce", "inversamente proporcional a", "es igual a"]}
  validConnections={[
    { sourceId: "fuerza", relationLabel: "produce", targetId: "aceleracion" },
    { sourceId: "masa", relationLabel: "inversamente proporcional a", targetId: "aceleracion" }
  ]}
  xp={60}
/>

### Experiencia 3: Ejercicio Tradicional de Aplicación (`AeternaExercise`)

```aeterna-exercise
TITLE: Distinción entre Exactitud y Precisión
HINT: Piensa en un blanco de tiro: exactitud es cercanía al centro, precisión es dispersión de los disparos.
XP: 50

Explica brevemente la diferencia entre exactitud y precisión en una medición experimental y da un ejemplo cotidiano.
```

---

## 2. Capa Intermedia: Experimentación, Causalidad, Gráficas, Evidencias y Caza de Errores

En el nivel intermedio, el estudiante pasa a **manipular variables**, **conectar causa y efecto**, **interpretar representaciones gráficas**, **validar evidencias** y **analizar errores de razonamiento**.

### Experiencia 4: Laboratorio de Variables (`ParameterLab`)

<ParameterLab
  id="demo_param_lab_1"
  title="Laboratorio de Segunda Ley de Newton"
  badgeText="EXPERIMENTAR CON VARIABLES"
  description="Ajusta los deslizadores de Fuerza y Masa para observar cómo se recalcula dinámicamente la Aceleración resultante."
  parameters={[
    { id: "fuerza", label: "Fuerza Aplicada (F)", unit: "N", min: 1, max: 100, step: 1, defaultValue: 20 },
    { id: "masa", label: "Masa del Objeto (m)", unit: "kg", min: 1, max: 50, step: 1, defaultValue: 5 }
  ]}
  outputLabel="Aceleración Resultante (a)"
  outputUnit="m/s²"
  guidedQuestion="¿Qué sucede con la aceleración si mantienes la masa constante en 5 kg y cuatriplicas la fuerza de 20 N a 80 N?"
  guidedAnswer="La aceleración aumenta de forma directamente proporcional de 4 m/s² a 16 m/s²."
  xp={60}
/>

### Experiencia 5: Cadena Causal (`CausalMap`)

<CausalMap
  id="demo_causal_1"
  title="Cadena Causal del Calentamiento por Rozamiento"
  badgeText="RAZONAMIENTO CAUSAL"
  description="Enlaza los eslabones de causa y efecto que explican la disipación térmica por fricción:"
  nodes={[
    { id: "c1", text: "Fricción mecánica entre dos superficies en contacto" },
    { id: "c2", text: "Disipación de energía cinética macroscópica a micro-agitación molecular" },
    { id: "c3", text: "Aumento de la temperatura interna y transferencia de calor" }
  ]}
  validEdges={[
    { causeId: "c1", effectId: "c2" },
    { causeId: "c2", effectId: "c3" }
  ]}
  explanation="La fricción actúa como mecanismo que degrada energía mecánica ordenada en energía térmica desordenada."
  xp={65}
/>

### Experiencia 6: Interpretación de Gráficas (`GraphLab`)

<GraphLab
  id="demo_graph_lab_1"
  title="Interpretación de Gráfica Posición-Tiempo"
  badgeText="INTERPRETAR REPRESENTACIÓN GRÁFICA"
  description="Inspecciona los puntos de la curva de movimiento x(t) para determinar la velocidad en cada tramo."
  xLabel="Tiempo t (s)"
  yLabel="Posición x (m)"
  data={[
    { x: 0, y: 0, label: "t=0s" },
    { x: 2, y: 10, label: "t=2s" },
    { x: 5, y: 10, label: "t=5s" },
    { x: 8, y: 25, label: "t=8s" }
  ]}
  question="¿En qué tramo de tiempo el objeto estuvo completamente inmóvil (reposo)?"
  options={[
    { label: "De t = 0 s a t = 2 s", isCorrect: false, feedback: "En este tramo la posición aumenta a 5 m/s constante." },
    { label: "De t = 2 s a t = 5 s", isCorrect: true, feedback: "¡Correcto! La posición se mantiene horizontal en 10 m, lo que significa que la velocidad es 0 m/s." },
    { label: "De t = 5 s a t = 8 s", isCorrect: false, feedback: "En este tramo la posición se desplaza de 10 m a 25 m." }
  ]}
  xp={50}
/>

### Experiencia 7: Emparejador de Evidencias (`EvidenceMatcher`)

<EvidenceMatcher
  id="demo_evidence_1"
  title="Emparejamiento de Afirmaciones Teóricas y Pruebas Experimentales"
  badgeText="EVALUACIÓN DE EVIDENCIAS"
  description="Relaciona cada postulado de la física moderna con la prueba experimental que lo confirmó:"
  claims={[
    { id: "c1", statement: "La luz tiene comportamiento corpuscular (fotones)." },
    { id: "c2", statement: "Las partículas de materia presentan comportamiento ondulatorio." }
  ]}
  evidences={[
    { id: "e1", sourceText: "Efecto Fotoeléctrico de Hertz y Einstein", matchesClaimId: "c1", explanation: "Demuestra los cuantos energéticos de la luz." },
    { id: "e2", sourceText: "Experimento de Difracción de Electrones de Davisson-Germer", matchesClaimId: "c2", explanation: "Demuestra la longitud de onda de De Broglie en electrones." }
  ]}
  xp={60}
/>

### Experiencia 8: Cazador de Errores (`ErrorHunter`)

<ErrorHunter
  id="demo_error_hunter_1"
  title="Cazador de Errores: Conversión de Velocidad"
  badgeText="ANALIZAR Y DETECTAR ERRORES"
  context="Un alumno resolvió la conversión de 72 km/h a m/s con los siguientes 3 pasos. Localiza dónde cometió el fallo:"
  steps={[
    { id: "step1", text: "Paso 1: Recordar las equivalencias 1 km = 1000 m y 1 h = 3600 s.", hasError: false, explanation: "Correcto. Equivalencias exactas." },
    { id: "step2", text: "Paso 2: Multiplicar 72 por 3600 y dividir entre 1000 para obtener 259.2 m/s.", hasError: true, errorType: "error_matematico", explanation: "¡Error cazado! Para pasar de km/h a m/s se debe multiplicar por 1000 y dividir por 3600 (72 × 1000 / 3600 = 20 m/s), no al revés." },
    { id: "step3", text: "Paso 3: Concluir que un coche a 72 km/h viaja a 259.2 m/s.", hasError: false, explanation: "Resultado físicamente absurdo provocado por el error del Paso 2." }
  ]}
  xp={60}
/>

---

## 3. Capa Avanzada: Modelización, Argumentación, Contraejemplos y Secuenciación

En el nivel avanzado, el alumno **construye y simplifica modelos físicos**, **estructura y evalúa argumentos**, **encuentra contraejemplos** y **reconstruye secuencias de procesos**.

### Experiencia 9: Constructor de Argumentos (`ArgumentBuilder`)

<ArgumentBuilder
  id="demo_arg_builder_1"
  title="Construcción de Argumento: Trayectorias Planetarias"
  badgeText="CONSTRUIR ARGUMENTO"
  claimOrConclusion="Los planetas describen órbitas elípticas alrededor del Sol."
  premises={[
    { id: "p1", text: "Existe una fuerza gravitatoria central inversamente proporcional al cuadrado de la distancia." },
    { id: "p2", text: "Una fuerza central sobre un cuerpo genera una aceleración en la dirección de la fuerza según F = m·a." },
    { id: "p3", text: "La solución matemática de la ecuación diferencial para esta fuerza es una curva cónica (elipse)." }
  ]}
  correctOrderIds={["p1", "p2", "p3"]}
  justification="El argumento deduce la Primera Ley de Kepler combinando la Gravitación Universal con la Dinámica Newtoniana."
  xp={65}
/>

### Experiencia 10: Evaluación Crítica de Falacias (`ArgumentEvaluation`)

<ArgumentEvaluation
  id="demo_arg_eval_1"
  title="Evaluación de Falacia: Ingravidez en Órbita"
  badgeText="EVALUAR ARGUMENTO"
  argumentText="Los astronautas en la Estación Espacial Internacional flotan porque a esa altura la gravedad terrestre es cero."
  criteria={[
    { id: "cr1", label: "El argumento es correcto y científicamente válido.", isCorrectProblem: false, feedback: "Incorrecto. A 400 km de altura la gravedad es ~90% de la superficie." },
    { id: "cr2", label: "El argumento contiene una premisa falsa: flotan por estar en caída libre continua alrededor de la Tierra, no por ausencia de gravedad.", isCorrectProblem: true, feedback: "¡Excelente evaluación! La ingravidez orbital es una caída libre permanente." }
  ]}
  xp={60}
/>

### Experiencia 11: Búsqueda de Contraejemplos (`Counterexample`)

<Counterexample
  id="demo_counter_1"
  title="Búsqueda de Caso Límite en Matemáticas"
  badgeText="PENSAMIENTO CRÍTICO"
  generalStatement="Todos los números impares mayores que 1 son números primos."
  candidates={[
    { id: "c1", label: "Número 3", isCounterexample: false, explanation: "3 es impar y primo." },
    { id: "c2", label: "Número 9", isCounterexample: true, explanation: "¡Contraejemplo perfecto! 9 es impar pero es divisible por 3 (3×3=9), desmintiendo la afirmación." },
    { id: "c3", label: "Número 7", isCounterexample: false, explanation: "7 es impar y primo." }
  ]}
  xp={60}
/>

### Experiencia 12: Constructor de Modelos (`ModelBuilder`)

<ModelBuilder
  id="demo_model_builder_1"
  title="Construcción de Modelo: Caída de una Gota de Lluvia"
  badgeText="MODELIZAR Y SIMPLIFICAR"
  problemDescription="Queremos estimar la velocidad terminal de una gota de agua cayendo desde las nubes. Selecciona qué factores son esenciales para el modelo simplificado y cuáles pueden ser descartados:"
  availableVariables={[
    { id: "v1", name: "Fuerza Gravitatoria Peso (Fg)", isRelevant: true, justification: "Esencial: acelera la gota hacia el suelo." },
    { id: "v2", name: "Resistencia o Arrastre del Aire (Fd)", isRelevant: true, justification: "Esencial: equilibra el peso a velocidad terminal." },
    { id: "v3", name: "Efecto Coriolis por Rotación Terrestre", isRelevant: false, justification: "Despreciable: el desplazamiento vertical es demasiado pequeño." },
    { id: "v4", name: "Atracción Gravitatoria de la Luna", isRelevant: false, justification: "Despreciable: fuerza insignificante frente a la de la Tierra." }
  ]}
  xp={70}
/>

### Experiencia 13: Reconstructor de Secuencia de Proceso (`SequenceBuilder`)

<SequenceBuilder
  id="demo_seq_1"
  title="Reconstrucción del Método Científico Experimental"
  badgeText="RECONSTRUIR PROCESO"
  description="Ordena las etapas procedimentales del método científico experimental de principio a fin:"
  steps={[
    { id: "s1", label: "Observación de un fenómeno imprevisto e identificación de la pregunta" },
    { id: "s2", label: "Formulación de una hipótesis falsable y testable" },
    { id: "s3", label: "Diseño y ejecución de un experimento controlado" },
    { id: "s4", label: "Análisis de datos, contraste y conclusión" }
  ]}
  correctOrderIds={["s1", "s2", "s3", "s4"]}
  explanation="El método científico exige fundamentar la experiencia en hipótesis previas antes de medir experimentalmente."
  xp={60}
/>

### Experiencia 14: Fragmento de Destino (`AeternaDecisionBox`)

<AeternaDecisionBox
  id="demo_decision_1"
  title="Elección de Simplificación Metodológica"
  badgeText="Fragmento de Destino"
  question="¿Por qué en los modelos iniciales de física se suele asumir que un objeto es una 'masa puntual' sin volumen?"
  xp={50}
  levelRequired={0}
  buttonText="Aceptar Destino"
  completedText="Decisión Sellada"
/>

---

## Resumen Pedagógico

Con este ecosistema completo de **12 componentes**, los artículos educativos de Aeterna cubren de forma integral todas las dimensiones de aprendizaje: **comprender**, **explicar**, **aplicar**, **interpretar**, **predecir**, **experimentar**, **modelizar**, **justificar**, **analizar errores**, **estructurar argumentos**, **relacionar evidencias**, **encontrar contraejemplos**, **reconstruir procesos** y **transferir**.
