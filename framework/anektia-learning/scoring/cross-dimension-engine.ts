import { 
  CrossDimensionIntervention, 
  DiscoverabilityAnalysisResult, 
  KnowledgeBenchmarkResult, 
  ParsedArticleStructure, 
  PracticeEvaluation, 
  ReasoningAnalysis, 
  RecommendationPriority,
  RecommendationType,
  VisualAnalysisResult 
} from '../types';
import { LearningExperienceAuditResult } from '../experiences/taxonomy';

export function evaluateCrossDimensionInterventions(
  parsed: ParsedArticleStructure,
  practiceEval: PracticeEvaluation,
  reasoningEval: ReasoningAnalysis,
  visualEval: VisualAnalysisResult,
  discoverabilityEval: DiscoverabilityAnalysisResult,
  learningExperienceAudit?: LearningExperienceAuditResult,
  knowledgeBenchmarkEval?: KnowledgeBenchmarkResult
): CrossDimensionIntervention[] {
  const interventions: CrossDimensionIntervention[] = [];

  const existingComponentTypes = new Set([
    ...parsed.exercises.map(e => e.type),
    ...parsed.interactives.map(i => i.name || i.type)
  ]);

  // Rule 1: Knowledge Benchmark Gaps & Semantic Opportunities
  if (knowledgeBenchmarkEval) {
    knowledgeBenchmarkEval.gaps.forEach(gap => {
      if (gap.importance === 'CORE' || gap.importance === 'IMPORTANT') {
        const priorityLevel: RecommendationPriority = gap.importance === 'CORE' ? 'HIGH' : 'MEDIUM';
        const type: RecommendationType = gap.importance === 'CORE' ? 'CRITICAL_GAP' : 'IMPORTANT_GAP';
        
        interventions.push({
          category: 'KNOWLEDGE_BENCHMARK',
          title: `Brecha de Conocimiento de Referencia: ${gap.concept}`,
          missingItem: `Concepto/Representación: ${gap.concept} (${gap.importance})`,
          recommendedIntervention: gap.suggestedIntervention || `Incorporar sección o bloque explícito para ${gap.concept}.`,
          rationale: gap.reason,
          priorityLevel,
          type,
          why: [
            `Concepto ${gap.importance} en el modelo de referencia para el tema ${knowledgeBenchmarkEval.topicProfile.topic}`,
            `Confianza de referencia: ${knowledgeBenchmarkEval.referenceConfidence}`,
            `No fue detectado en el cuerpo principal del artículo`
          ]
        });
      }
    });

    // Semantic terminology opportunity
    knowledgeBenchmarkEval.conceptDetails.forEach(cd => {
      if (cd.detectionMode === 'SEMANTIC' && cd.explicitTerminology === 'PARTIAL') {
        interventions.push({
          category: 'KNOWLEDGE_BENCHMARK',
          title: `Claridad Terminológica: ${cd.concept}`,
          missingItem: `Etiqueta explícita para: ${cd.concept}`,
          recommendedIntervention: `Nombrar explícitamente "${cd.concept}" en el texto o añadir un bloque <PedagogicalContentBlock type="key-insight">`,
          rationale: `El concepto "${cd.concept}" está cubierto semánticamente pero no aparece nombrado con la terminología estandarizada.`,
          priorityLevel: 'MEDIUM',
          type: 'IMPROVEMENT_OPPORTUNITY',
          why: [
            'Concepto cubierto a nivel explicativo pero sin la terminología formal estandarizada',
            'Facilita la asimilación conceptual directa y la búsqueda de información'
          ]
        });
      }
    });
  }

  // Rule 2: Missing Core Pedagogical Experiences (Only if component is NOT already present!)
  if (learningExperienceAudit) {
    const missingCoreExpKeys = learningExperienceAudit.coreExperiences
      .filter(e => e.status === 'FAIL')
      .map(e => e.experienceKey);

    if (missingCoreExpKeys.includes('INTERPRET_DATA') && !existingComponentTypes.has('GraphLab')) {
      interventions.push({
        category: 'PEDAGOGY',
        title: 'Interpretación de Representación Gráfica',
        missingItem: 'Experiencia cognitiva: INTERPRET_DATA',
        recommendedIntervention: 'Componente interactivo: GraphLab o gráfico estático contextual',
        rationale: 'El artículo explica relaciones cuantitativas pero carece de un ejercicio interactivo de interpretación de gráficas.',
        priorityLevel: 'HIGH',
        type: 'IMPORTANT_GAP',
        why: [
          'Experiencia CORE ausente en la evaluación pedagógica',
          'Relación de variables explicada pero sin interpretación directa',
          'GraphLab disponible en el registro de componentes de Anektia'
        ]
      });
    }

    if ((missingCoreExpKeys.includes('EVALUATE_PLAUSIBILITY') || missingCoreExpKeys.includes('CRITICAL_THINKING')) && !existingComponentTypes.has('PredictionBox')) {
      interventions.push({
        category: 'PEDAGOGY',
        title: 'Predicción Hipotética Activa',
        missingItem: 'Experiencia cognitiva: EVALUATE_PLAUSIBILITY / PREDICT',
        recommendedIntervention: 'Componente interactivo: PredictionBox',
        rationale: 'Falta un momento de predicción activa antes de observar el resultado experimental o la solución.',
        priorityLevel: 'HIGH',
        type: 'IMPORTANT_GAP',
        why: [
          'Falta provocar la predicción del estudiante previa a la respuesta',
          'PredictionBox disponible en el registro de componentes'
        ]
      });
    }

    if (missingCoreExpKeys.includes('ANALYZE_ERROR') && !existingComponentTypes.has('ErrorHunter')) {
      interventions.push({
        category: 'PEDAGOGY',
        title: 'Caza y Análisis de Errores Comunes',
        missingItem: 'Experiencia cognitiva: ANALYZE_ERROR',
        recommendedIntervention: 'Componente interactivo: ErrorHunter o bloque <PedagogicalContentBlock type="misconception">',
        rationale: 'El texto explica procedimientos correctos pero no ejercita la capacidad de detectar supuestos erróneos.',
        priorityLevel: 'HIGH',
        type: 'IMPORTANT_GAP',
        why: [
          'Falta ejercitar la detección de errores y falsas intuiciones',
          'ErrorHunter o bloque de Error Común disponible en Anektia'
        ]
      });
    }
  }

  // Rule 3: Visual Opportunities matched to precise pedagogical needs
  visualEval.visualOpportunities.forEach(opp => {
    let recIntervention = 'Diagrama Explicativo o Esquema Visual';
    let recPriority: RecommendationPriority = 'MEDIUM';
    let recType: RecommendationType = 'IMPROVEMENT_OPPORTUNITY';

    if (opp.suggestedType === 'DATA_VISUALIZATION') {
      recIntervention = existingComponentTypes.has('GraphLab') ? 'Gráfico de datos estático explicativo' : 'Gráfico de datos o componente GraphLab';
      recPriority = 'HIGH';
      recType = 'IMPORTANT_GAP';
    } else if (opp.suggestedType === 'PROCESS') {
      recIntervention = 'Diagrama de Flujo / Secuencia Visual';
      recPriority = 'MEDIUM';
      recType = 'IMPROVEMENT_OPPORTUNITY';
    } else if (opp.suggestedType === 'COMPARISON') {
      recIntervention = 'Cuadro Comparativo / Tabla Anektia';
      recPriority = 'MEDIUM';
      recType = 'IMPROVEMENT_OPPORTUNITY';
    }

    interventions.push({
      category: 'VISUAL',
      title: `Representación Visual: ${opp.concept}`,
      missingItem: `Soporte visual en la sección: ${opp.section}`,
      recommendedIntervention: recIntervention,
      rationale: opp.reason,
      priorityLevel: recPriority,
      type: recType,
      why: [
        `Concepto visualmente complejo expresado solo en texto`,
        `Sección: ${opp.section}`,
        `Sugerencia: ${opp.suggestedType}`
      ]
    });
  });

  // Rule 4: Search Intent Aspects
  discoverabilityEval.missingSearchAspects.forEach(missingAspect => {
    interventions.push({
      category: 'DISCOVERABILITY',
      title: `Intención de Búsqueda no Cubierta: ${missingAspect}`,
      missingItem: `Aspecto de Intención: ${missingAspect}`,
      recommendedIntervention: `Sección o Bloque Anektia dedicado a: ${missingAspect}`,
      rationale: `Los estudiantes e IAs de búsqueda esperan encontrar una respuesta explícita para "${missingAspect}".`,
      priorityLevel: 'LOW',
      type: 'OPTIONAL_ENHANCEMENT',
      why: [
        `Intención de búsqueda esperada: ${missingAspect}`,
        'Mejora la comprensibilidad para búsquedas directas de estudiantes'
      ]
    });
  });

  // Rule 5: Pedagogical Block Enhancements
  const lowerBody = parsed.rawBody.toLowerCase();
  if (!lowerBody.includes('misconception') && !lowerBody.includes('error común') && !existingComponentTypes.has('ErrorHunter')) {
    interventions.push({
      category: 'ANEKTIA',
      title: 'Ausencia de Intervención Disonante',
      missingItem: 'Bloque Pedagógico: Error Común (misconception)',
      recommendedIntervention: '<PedagogicalContentBlock type="misconception">',
      rationale: 'Desmontar intuiciones incorrectas mejora sustancialmente la retención y la asimilación del modelo mental.',
      priorityLevel: 'MEDIUM',
      type: 'IMPROVEMENT_OPPORTUNITY',
      why: [
        'No se detectaron bloques de error común en el contenido',
        'Fomenta el cambio conceptual activo'
      ]
    });
  }

  if (!lowerBody.includes('key-insight') && !lowerBody.includes('la clave en')) {
    interventions.push({
      category: 'ANEKTIA',
      title: 'Ausencia de Condensación Sintética',
      missingItem: 'Bloque Pedagógico: Idea Clave (key-insight)',
      recommendedIntervention: '<PedagogicalContentBlock type="key-insight">',
      rationale: 'Facilita la fijación de la idea fundamental en 10 segundos antes de adentrarse en la fundamentación.',
      priorityLevel: 'LOW',
      type: 'OPTIONAL_ENHANCEMENT',
      why: [
        'No se detectaron bloques de Idea Clave',
        'Refuerza la síntesis conceptual rápida'
      ]
    });
  }

  // Sort interventions by priority: HIGH -> MEDIUM -> LOW
  const priorityOrder: Record<RecommendationPriority, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  return interventions.sort((a, b) => priorityOrder[a.priorityLevel] - priorityOrder[b.priorityLevel]);
}
