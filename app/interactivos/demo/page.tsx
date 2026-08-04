'use client';

import React from 'react';
import { PredictionBox } from '@/components/interactive/PredictionBox';
import { ParameterLab } from '@/components/interactive/ParameterLab';
import { GraphLab } from '@/components/interactive/GraphLab';
import { ErrorHunter } from '@/components/interactive/ErrorHunter';
import { ModelBuilder } from '@/components/interactive/ModelBuilder';
import { ConceptMap } from '@/components/interactive/ConceptMap';
import { ArgumentBuilder } from '@/components/interactive/ArgumentBuilder';
import { CausalMap } from '@/components/interactive/CausalMap';
import { EvidenceMatcher } from '@/components/interactive/EvidenceMatcher';
import { Counterexample } from '@/components/interactive/Counterexample';
import { ArgumentEvaluation } from '@/components/interactive/ArgumentEvaluation';
import { SequenceBuilder } from '@/components/interactive/SequenceBuilder';
import { Sparkles, Layers } from 'lucide-react';

export default function InteractiveDemoPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0A0A0B] text-[#1A1A1A] dark:text-slate-100 py-12 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Page Header */}
        <header className="text-center space-y-4 border-b border-black/10 dark:border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#8B6914] dark:text-[#D4AF37] text-xs font-mono font-bold tracking-wider uppercase border border-[#D4AF37]/30">
            <Sparkles className="w-3.5 h-3.5" /> Anektia Interactive Pedagogical Suite v2.0
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-brand-ink dark:text-white tracking-tight">
            Demostración de Componentes Pedagógicos (FASE 1 & FASE 2)
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Biblioteca de 12 componentes interactivos diseñados para ofrecer experiencias cognitivas específicas: predecir, experimentar, interpretar gráficas, analizar errores, construir modelos, relacionar conceptos, razonar cadenas causales, estructurar y evaluar argumentos, parear evidencias, hallar contraejemplos y reconstruir secuencias.
          </p>
        </header>

        {/* FASE 1 COMPONENTS */}
        <div className="space-y-12">
          <h2 className="text-2xl font-bold text-[#8B6914] dark:text-[#D4AF37] font-serif border-b border-[#D4AF37]/20 pb-2">
            Fase 1: Experimentos, Modelos e Interpretaciones
          </h2>

          <PredictionBox
            id="demo_prediction"
            title="1. PredictionBox: Predicción de Aceleración en Masa Duplicada"
            question="Si duplicamos la masa de un objeto manteniendo constante la fuerza neta aplicada, ¿qué ocurrirá con su aceleración?"
            options={[
              { label: "La aceleración se duplicará (2a)", isCorrect: false, feedback: "Incorrecto. La masa se opone al movimiento." },
              { label: "La aceleración se reducirá a la mitad (a/2)", isCorrect: true, feedback: "¡Excelente predicción! Es inversamente proporcional a la masa." },
              { label: "La aceleración no cambiará", isCorrect: false, feedback: "Incorrecto. La aceleración depende directamente de la masa." }
            ]}
            explanation="Según la Segunda Ley de Newton a = F/m, la aceleración es inversamente proporcional a la masa del objeto."
            xp={50}
          />

          <ParameterLab
            id="demo_parameter_lab"
            title="2. ParameterLab: Laboratorio de Segunda Ley de Newton"
            description="Manipula los valores de Fuerza Aplicada y Masa del Objeto para observar cómo varía la Aceleración en tiempo real."
            parameters={[
              { id: "fuerza", label: "Fuerza Aplicada (F)", unit: "N", min: 1, max: 100, step: 1, defaultValue: 20 },
              { id: "masa", label: "Masa del Objeto (m)", unit: "kg", min: 1, max: 50, step: 1, defaultValue: 5 }
            ]}
            outputLabel="Aceleración Calculada (a)"
            outputUnit="m/s²"
            calculateOutput={(params) => params.fuerza / params.masa}
            guidedQuestion="¿Qué sucede con la aceleración si mantienes la masa en 5 kg e incrementas progresivamente la fuerza?"
            guidedAnswer="La aceleración aumenta de forma estrictamente lineal directamente proporcional a la fuerza."
            xp={60}
          />

          <GraphLab
            id="demo_graph_lab"
            title="3. GraphLab: Interpretación de Gráfica Posición-Tiempo"
            description="Examina la curva de posición x(t) en función del tiempo t para identificar las características del movimiento."
            xLabel="Tiempo t (s)"
            yLabel="Posición x (m)"
            data={[
              { x: 0, y: 0, label: "t=0s" },
              { x: 2, y: 10, label: "t=2s" },
              { x: 5, y: 10, label: "t=5s" },
              { x: 8, y: 25, label: "t=8s" }
            ]}
            question="¿En qué intervalo de tiempo el objeto se encuentra completamente en reposo (velocidad = 0 m/s)?"
            options={[
              { label: "De t = 0 s a t = 2 s", isCorrect: false, feedback: "En este tramo la posición cambia de 0 m a 10 m." },
              { label: "De t = 2 s a t = 5 s", isCorrect: true, feedback: "¡Correcto! En este intervalo la posición es constante en 10 m." },
              { label: "De t = 5 s a t = 8 s", isCorrect: false, feedback: "En este intervalo la posición aumenta de 10 m a 25 m." }
            ]}
            xp={50}
          />

          <ErrorHunter
            id="demo_error_hunter"
            title="4. ErrorHunter: Cazador de Errores en Conversión de Unidades"
            context="Un estudiante resolvió la conversión de 72 km/h a m/s mediante los siguientes pasos:"
            steps={[
              { id: "step1", text: "Paso 1: Identificar las equivalencias 1 km = 1000 m y 1 h = 3600 s.", hasError: false, explanation: "Correcto." },
              { id: "step2", text: "Paso 2: Multiplicar 72 por 3600 y dividir por 1000 para obtener 259.2 m/s.", hasError: true, errorType: "error_matematico", explanation: "¡Error! Para pasar de km/h a m/s hay que multiplicar por 1000 y dividir entre 3600 (72 × 1000 / 3600 = 20 m/s)." },
              { id: "step3", text: "Paso 3: Concluir que 72 km/h equivale a 259.2 m/s.", hasError: false, explanation: "Consecuencia del error del paso 2." }
            ]}
            xp={60}
          />

          <ModelBuilder
            id="demo_model_builder"
            title="5. ModelBuilder: Construcción de Modelo de Caída de Gota"
            problemDescription="Queremos construir un modelo físico simplificado para estimar la velocidad terminal de una gota de agua cayendo desde las nubes."
            availableVariables={[
              { id: "v1", name: "Fuerza Gravitatoria Peso (Fg)", isRelevant: true, justification: "Esencial: acelera la gota hacia abajo." },
              { id: "v2", name: "Resistencia del Aire (Fd)", isRelevant: true, justification: "Esencial: equilibra el peso a velocidad terminal." },
              { id: "v3", name: "Efecto Coriolis por Rotación Terrestre", isRelevant: false, justification: "Despreciable en desplazamientos de 100m." },
              { id: "v4", name: "Atracción Gravitatoria de la Luna", isRelevant: false, justification: "Completamente insignificante." }
            ]}
            xp={70}
          />
        </div>

        {/* FASE 2 COMPONENTS */}
        <div className="space-y-12 pt-8">
          <h2 className="text-2xl font-bold text-[#8B6914] dark:text-[#D4AF37] font-serif border-b border-[#D4AF37]/20 pb-2">
            Fase 2: Estructura Conceptual, Argumentación, Causalidad y Contraejemplos
          </h2>

          {/* 6. ConceptMap Demo */}
          <ConceptMap
            id="demo_concept_map"
            title="6. ConceptMap: Red de Conceptos de Mecánica"
            description="Establece las conexiones y relaciones lógicas entre los conceptos fundamentales de la dinámica."
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

          {/* 7. ArgumentBuilder Demo */}
          <ArgumentBuilder
            id="demo_argument_builder"
            title="7. ArgumentBuilder: Construcción de Argumento Deductivo"
            claimOrConclusion="Los planetas describen órbitas elípticas aceleradas alrededor del Sol."
            premises={[
              { id: "p1", text: "Existe una fuerza de atracción gravitatoria inversamente proporcional a la distancia al cuadrado." },
              { id: "p2", text: "Una fuerza central neta no nula sobre un cuerpo produce una aceleración en la dirección de la fuerza." },
              { id: "p3", text: "La trayectoria que satisface esta ecuación diferencial de movimiento es una sección cónica (elipse)." }
            ]}
            correctOrderIds={["p1", "p2", "p3"]}
            justification="El argumento se deduce aplicando la Segunda Ley de Newton conjuntamente con la Ley de Gravitación Universal de Newton."
            xp={65}
          />

          {/* 8. CausalMap Demo */}
          <CausalMap
            id="demo_causal_map"
            title="8. CausalMap: Cadena Causal de Fricción y Calor"
            description="Conecta los eslabones de causa y efecto que explican el calentamiento por rozamiento."
            nodes={[
              { id: "c1", text: "Rozamiento mecánico entre dos superficies" },
              { id: "c2", text: "Disipación de energía cinética organizada en agitación molecular" },
              { id: "c3", text: "Aumento de la temperatura interna y emisión de calor" }
            ]}
            validEdges={[
              { causeId: "c1", effectId: "c2" },
              { causeId: "c2", effectId: "c3" }
            ]}
            explanation="La fricción convierte la energía mecánica organizada en energía térmica desordenada (calor)."
            xp={65}
          />

          {/* 9. EvidenceMatcher Demo */}
          <EvidenceMatcher
            id="demo_evidence_matcher"
            title="9. EvidenceMatcher: Emparejamiento de Afirmaciones y Evidencias"
            description="Relaciona cada afirmación teórica sobre física moderna con la prueba experimental correspondiente."
            claims={[
              { id: "c1", statement: "La luz tiene comportamiento corpuscular (fotones)." },
              { id: "c2", statement: "Las partículas de materia tienen comportamiento ondulatorio." }
            ]}
            evidences={[
              { id: "e1", sourceText: "Efecto Fotoeléctrico de Hertz y Einstein (emisión de electrones por fotones).", matchesClaimId: "c1", explanation: "Demuestra los cuantos de energía lumínica." },
              { id: "e2", sourceText: "Experimento de Difracción de Electrones de Davisson-Germer.", matchesClaimId: "c2", explanation: "Demuestra la longitud de onda de De Broglie para electrones." }
            ]}
            xp={60}
          />

          {/* 10. Counterexample Demo */}
          <Counterexample
            id="demo_counterexample"
            title="10. Counterexample: Búsqueda de Caso Límite en Matemáticas"
            generalStatement="Todos los números impares mayores que 1 son números primos."
            candidates={[
              { id: "c1", label: "Número 3", isCounterexample: false, explanation: "3 es impar y primo (cumple la afirmación)." },
              { id: "c2", label: "Número 9", isCounterexample: true, explanation: "¡Contraejemplo perfecto! 9 es impar pero es divisible por 3 (3 × 3 = 9), por lo que no es primo." },
              { id: "c3", label: "Número 7", isCounterexample: false, explanation: "7 es impar y primo." }
            ]}
            xp={60}
          />

          {/* 11. ArgumentEvaluation Demo */}
          <ArgumentEvaluation
            id="demo_arg_eval"
            title="11. ArgumentEvaluation: Evaluación Crítica de Falacias"
            argumentText="El astronauta se flota en la Estación Espacial porque en el espacio no existe gravedad."
            criteria={[
              { id: "cr1", label: "El argumento es completamente válido.", isCorrectProblem: false, feedback: "Incorrecto. Sí existe gravedad en órbita terrestre." },
              { id: "cr2", label: "El argumento contiene un supuesto falso: a 400 km de altura la gravedad es ~90% de la superficie; flotan por estar en caída libre continua.", isCorrectProblem: true, feedback: "¡Excelente evaluación! En órbita los cuerpos caen continuamente alrededor de la Tierra, experimentando ingravidez aparente." }
            ]}
            xp={60}
          />

          {/* 12. SequenceBuilder Demo */}
          <SequenceBuilder
            id="demo_sequence_builder"
            title="12. SequenceBuilder: Reconstrucción del Método Científico"
            description="Ordena las etapas procedimentales del método científico experimental:"
            steps={[
              { id: "s1", label: "Observación de un fenómeno e identificación del problema" },
              { id: "s2", label: "Formulación de una hipótesis falsable" },
              { id: "s3", label: "Diseño y ejecución del experimento controlado" },
              { id: "s4", label: "Análisis de datos y conclusión" }
            ]}
            correctOrderIds={["s1", "s2", "s3", "s4"]}
            explanation="El método científico exige partir de observaciones para formular hipótesis antes de medir experimentalmente."
            xp={60}
          />
        </div>

      </div>
    </div>
  );
}
