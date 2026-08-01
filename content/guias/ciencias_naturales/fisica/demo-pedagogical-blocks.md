---
title: Demo de Bloques Pedagógicos de Aeterna
description: Demostración oficial de los 8 Pedagogical Content Blocks y las Actividades Interactivas en Aeterna.
category: Ciencias Naturales
subcategory: Física
layer: principiante
order: 99
---

# Demostración de Bloques Pedagógicos de Aeterna

Esta guía ilustra la taxonomía semántica de los Bloques Pedagógicos de Contenido y las Actividades Interactivas en Aeterna.

<NivelActivo id="fundamentos">

# Capa I: Catálogo Completo de Bloques Pedagógicos y Actividades Interactivas

<IndiceNivel titulo="🌱 Fundamentos, Bloques y Ejercicios">
- **Hito 1**: Disonancia Cognitiva y Axiomas (`Misconception` & `KeyInsight`)
- **Hito 2**: Fragmentos y Principios Metodológicos (`ArchiveFragment` & `AeternaSystem`)
- **Hito 3**: Conexiones, Supuestos y Transferencia (`Connect`, `HiddenAssumption`, `Transfer` & `MiniChallenge`)
- **Hito 4**: Actividades Interactivas (`AeternaExercise`, `AeternaDecisionBox`, `PredictionBox`, `ParameterLab`, `ErrorHunter` & `ModelBuilder`)
</IndiceNivel>

## Hito 1: Disonancia Cognitiva y Axiomas

<PedagogicalContentBlock 
  type="misconception" 
  title="Error Común: Fuerza y Movimiento" 
  content="Creer que un objeto necesita una fuerza constante ejercida sobre él para seguir moviéndose a velocidad constante." 
  extra="La Primera Ley de Newton establece que el estado natural de un objeto sin fuerzas netas es mantener su velocidad constante." 
/>

<PedagogicalContentBlock 
  type="key-insight" 
  title="La Clave en 10 segundos: Inercia" 
  content="La masa mide la resistencia de un cuerpo a cambiar su estado de movimiento." 
/>

## Hito 2: Fragmentos y Principios Metodológicos

<PedagogicalContentBlock 
  type="archive-fragment" 
  title="Fragmento de Archivo: Galileo y la Torre de Pisa" 
  content="Galileo demostró que dos objetos de masas diferentes caen con la misma aceleración en ausencia de rozamiento aerodinámico." 
/>

<PedagogicalContentBlock 
  type="aeterna-system" 
  title="Sistema Aeterna: Medición y Modelado" 
  content="Paso 1: Mide con precisión. Paso 2: Simplifica sin traicionar la realidad. Paso 3: Evalúa la incertidumbre experimental." 
/>

## Hito 3: Conexiones, Supuestos y Transferencia

<Connect 
  title="Aceleración y Derivadas" 
  sourceConcept="Aceleración instantánea (Física)" 
  targetConcept="Derivada segunda respecto al tiempo (Matemáticas)" 
  content="La aceleración física representa exactamente la segunda derivada de la posición con respecto al tiempo, igual que las tasas de cambio estudiadas en Cálculo." 
/>

<HiddenAssumption 
  title="Resistencia del Aire" 
  assumption="El movimiento de caída libre asume vacío perfecto sin rozamiento aerodinámico." 
  implication="Para objetos ligeros o velocidades elevadas, esta aproximación genera desviaciones notables respecto al experimento real." 
/>

<Transfer 
  title="Conservación de Energía a la Economía" 
  targetDomain="Economía y Sistemas Financieros" 
  prompt="Analiza cómo el principio de conservación de energía en un sistema cerrado se asemeja al principio de masa monetaria equilibrada en una economía cerrada." 
/>

<PedagogicalContentBlock 
  type="mini-challenge" 
  title="Mini Desafío: Intuición Térmica" 
  content="¿Por qué la madera se siente más cálida al tacto que el metal si ambos están a la misma temperatura ambiente de 20 °C?" 
  extra="Pista: La conductividad térmica del metal extrae calor de tu piel mucho más rápido." 
/>

## Hito 4: Actividades Interactivas y Ejercicios Pixel Art

<AeternaExercise
  content="TITLE: Ejercicio de Aplicación de Inercia
HINT: Piensa en qué ocurre con tu cuerpo cuando un autobús frena de golpe.
XP: 50

Si un astronauta lanza una piedra en el espacio interestelar lejos de cualquier estrella o planeta, describe qué sucederá con la velocidad de la piedra y justifica tu respuesta usando las Leyes de Newton."
/>

<AeternaDecisionBox 
  badgeText="Reflexión de Laboratorio"
  title="Experimento Mente-Física"
  question="¿Consideras que las matemáticas son un lenguaje descubierto o una herramienta inventada para describir el universo?"
  xp={50}
  buttonText="Aceptar y Registrar Gnosis"
/>

<PredictionBox 
  badgeText="PREDICCIÓN ANTES DE OBSERVAR"
  title="Caída de Pluma y Martillo en la Luna"
  question="Si dejamos caer simultáneamente una pluma y un martillo en la superficie lunar (sin atmósfera), ¿cuál tocará el suelo primero?"
  options={[
    { label: "El martillo tocará el suelo primero por ser más pesado", isCorrect: false, feedback: "Incorrecto. En el vacío, la masa no afecta la aceleración gravitatoria." },
    { label: "La pluma flotará y nunca tocará el suelo", isCorrect: false, feedback: "Incorrecto. La Luna tiene gravedad (1.62 m/s²)." },
    { label: "Ambos tocarán el suelo exactamente al mismo tiempo", isCorrect: true, feedback: "¡Correcto! En ausencia de aire, la masa no influye en la aceleración de caída libre." }
  ]}
  explanation="Apollo 15 demostró experimentalmente en la Luna que sin resistencia del aire, la pluma y el martillo caen exactamente a la misma tasa."
  xp={50}
/>

<ParameterLab
  title="Laboratorio de la Segunda Ley de Newton"
  badgeText="EXPERIMENTAR CON VARIABLES"
  description="Ajusta la fuerza aplicable y la masa del objeto para calcular la aceleración resultante."
  outputLabel="Aceleración Producida (a = F / m)"
  outputUnit="m/s²"
  guidedQuestion="¿Qué le sucede a la aceleración cuando duplicas la masa manteniendo constante la fuerza?"
  guidedAnswer="La aceleración se reduce exactamente a la mitad, demostrando la relación inversamente proporcional entre masa y aceleración."
  parameters={[
    { id: "fuerza", label: "Fuerza Aplicada (F)", unit: "N", min: 10, max: 200, step: 10, defaultValue: 100 },
    { id: "masa", label: "Masa del Objeto (m)", unit: "kg", min: 1, max: 50, step: 1, defaultValue: 10 }
  ]}
  xp={60}
/>

<ErrorHunter
  title="Detección de Error en Cálculo de Aceleración"
  badgeText="CAZADOR DE ERRORES"
  context="Un estudiante intenta calcular el tiempo de frenado de un coche de 1000 kg que viaja a 20 m/s bajo una fuerza de frenado de 2000 N."
  steps={[
    { id: "step-1", text: "Paso 1: Identificar datos: m = 1000 kg, v0 = 20 m/s, F = -2000 N", hasError: false, explanation: "Paso correcto. Se identificaron correctamente los datos." },
    { id: "step-2", text: "Paso 2: Aceleración a = F * m = -2000 * 1000 = -2,000,000 m/s²", hasError: true, errorType: "Fórmula invertida", explanation: "¡ERROR EN PASO 2! La Segunda Ley indica a = F / m, no a = F * m. La aceleración real es -2 m/s²." },
    { id: "step-3", text: "Paso 3: Tiempo t = (v - v0) / a = (0 - 20) / a", hasError: false, explanation: "Paso correcto conceptualmente." }
  ]}
  xp={60}
/>

<ModelBuilder
  title="Modelado de Caída Libre Real"
  badgeText="CONSTRUCTOR DE MODELOS"
  problemDescription="Selecciona cuáles de las siguientes variables son críticas para modelar con precisión la caída de una gota de lluvia en la atmósfera terrestre."
  availableVariables={[
    { id: "v1", name: "Aceleración de la Gravedad (g)", isRelevant: true, justification: "Es la fuerza motriz principal de la caída." },
    { id: "v2", name: "Resistencia Aerodinámica del Aire", isRelevant: true, justification: "Para gotas de agua pequeñas, el rozamiento del aire alcanza rápidamente la velocidad terminal." },
    { id: "v3", name: "Atracción Gravitatoria de la Luna", isRelevant: false, justification: "Es despreciable comparada con la gravedad terrestre local." },
    { id: "v4", name: "Geometría y Tamaño de la Gota", isRelevant: true, justification: "Determina el coeficiente de arrastre aerodinámico." }
  ]}
  xp={70}
/>

<BotonTransicion nivel="profundizacion">Avanzar a Capa II →</BotonTransicion>

</NivelActivo>
