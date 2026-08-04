import { TaxonomyCompetency } from '../competencies/taxonomy';
import { ExperienceKey } from './taxonomy';

export type ActivitySuitabilityLevel = 'DIRECT_FIT' | 'COMPATIBLE' | 'SECONDARY';

export interface ActivityCapabilityMapping {
  componentType: string;
  name: string;
  primaryExperiences: ExperienceKey[];
  secondaryExperiences: ExperienceKey[];
  primaryCompetencies: TaxonomyCompetency[];
  secondaryCompetencies: TaxonomyCompetency[];
  defaultLayer: 'Inicio' | 'Intermedio' | 'Avanzado';
  description: string;
}

export const ACTIVITY_CAPABILITY_REGISTRY: Record<string, ActivityCapabilityMapping> = {
  PredictionBox: {
    componentType: 'PredictionBox',
    name: 'Caja de Predicción',
    primaryExperiences: ['PREDICT_BEFORE_OBSERVE', 'EXPLAIN_CONCEPT'],
    secondaryExperiences: ['INTERPRET_DATA'],
    primaryCompetencies: ['PREDICT'],
    secondaryCompetencies: ['EXPLAIN', 'INTERPRET'],
    defaultLayer: 'Inicio',
    description: 'Permite formular una hipótesis previa a la observación o revelación de resultados.'
  },
  ParameterLab: {
    componentType: 'ParameterLab',
    name: 'Laboratorio de Parámetros',
    primaryExperiences: ['EXPERIMENT_VARIABLES', 'PREDICT_BEFORE_OBSERVE'],
    secondaryExperiences: ['INTERPRET_DATA', 'BUILD_MODEL', 'PERFORM_ESTIMATION'],
    primaryCompetencies: ['MODEL', 'PREDICT'],
    secondaryCompetencies: ['INTERPRET', 'ANALYZE', 'APPLY'],
    defaultLayer: 'Intermedio',
    description: 'Simulador interactivo con sliders para manipular variables y observar salidas dinámicas.'
  },
  GraphLab: {
    componentType: 'GraphLab',
    name: 'Laboratorio de Gráficas',
    primaryExperiences: ['INTERPRET_DATA', 'INTERPRET_SIMULATION'],
    secondaryExperiences: ['COMPARE_ALTERNATIVES', 'PREDICT_BEFORE_OBSERVE'],
    primaryCompetencies: ['INTERPRET'],
    secondaryCompetencies: ['ANALYZE', 'COMPARE', 'PREDICT'],
    defaultLayer: 'Intermedio',
    description: 'Gráfica interactiva SVG para inspeccionar puntos, pendientes y curvas de datos.'
  },
  ErrorHunter: {
    componentType: 'ErrorHunter',
    name: 'Cazador de Errores',
    primaryExperiences: ['ANALYZE_ERROR', 'EVALUATE_PLAUSIBILITY'],
    secondaryExperiences: ['JUSTIFY_DECISION', 'EXPLAIN_CONCEPT', 'CRITICAL_THINKING'],
    primaryCompetencies: ['ERROR_ANALYSIS'],
    secondaryCompetencies: ['EVALUATE', 'JUSTIFY', 'EXPLAIN'],
    defaultLayer: 'Intermedio',
    description: 'Presenta un procedimiento paso a paso e invita al estudiante a identificar el fallo.'
  },
  ModelBuilder: {
    componentType: 'ModelBuilder',
    name: 'Constructor de Modelos',
    primaryExperiences: ['BUILD_MODEL', 'JUSTIFY_DECISION', 'CAUSAL_REASONING'],
    secondaryExperiences: ['TRANSFER_KNOWLEDGE', 'COMPARE_ALTERNATIVES'],
    primaryCompetencies: ['MODEL'],
    secondaryCompetencies: ['JUSTIFY', 'ANALYZE', 'APPLY', 'TRANSFER'],
    defaultLayer: 'Intermedio',
    description: 'Permite seleccionar variables relevantes y descartar factores despreciables en un problema.'
  },
  ConceptMap: {
    componentType: 'ConceptMap',
    name: 'Mapa Conceptual',
    primaryExperiences: ['EXPLAIN_CONCEPT', 'COMPARE_ALTERNATIVES', 'CAUSAL_REASONING'],
    secondaryExperiences: ['BUILD_MODEL', 'INTERPRET_DATA'],
    primaryCompetencies: ['UNDERSTAND'],
    secondaryCompetencies: ['COMPARE', 'ANALYZE', 'EXPLAIN'],
    defaultLayer: 'Inicio',
    description: 'Conecta nodos teóricos con etiquetas de relación para estructurar el conocimiento.'
  },
  ArgumentBuilder: {
    componentType: 'ArgumentBuilder',
    name: 'Constructor de Argumentos',
    primaryExperiences: ['ARGUE_BUILD', 'JUSTIFY_DECISION'],
    secondaryExperiences: ['EXPLAIN_CONCEPT', 'EVALUATE_PLAUSIBILITY'],
    primaryCompetencies: ['JUSTIFY'],
    secondaryCompetencies: ['EXPLAIN', 'ANALYZE', 'EVALUATE'],
    defaultLayer: 'Avanzado',
    description: 'Permite secuenciar premisas lógicas para fundamentar una conclusión deducida.'
  },
  CausalMap: {
    componentType: 'CausalMap',
    name: 'Mapa Causal',
    primaryExperiences: ['CAUSAL_REASONING', 'BUILD_MODEL'],
    secondaryExperiences: ['INTERPRET_DATA', 'EXPLAIN_CONCEPT'],
    primaryCompetencies: ['ANALYZE'],
    secondaryCompetencies: ['MODEL', 'EXPLAIN', 'INTERPRET'],
    defaultLayer: 'Intermedio',
    description: 'Establece redes y cadenas de causa-efecto explícitas entre acontecimientos o variables.'
  },
  EvidenceMatcher: {
    componentType: 'EvidenceMatcher',
    name: 'Emparejador de Evidencias',
    primaryExperiences: ['EVIDENCE_EVALUATION', 'JUSTIFY_DECISION'],
    secondaryExperiences: ['INTERPRET_DATA', 'EVALUATE_PLAUSIBILITY'],
    primaryCompetencies: ['JUSTIFY'],
    secondaryCompetencies: ['EVALUATE', 'INTERPRET', 'ANALYZE'],
    defaultLayer: 'Intermedio',
    description: 'Relaciona afirmaciones o hipótesis con las evidencias empíricas/textuales que las respaldan.'
  },
  Counterexample: {
    componentType: 'Counterexample',
    name: 'Búsqueda de Contraejemplos',
    primaryExperiences: ['CRITICAL_THINKING', 'EVALUATE_PLAUSIBILITY'],
    secondaryExperiences: ['TRANSFER_KNOWLEDGE', 'ANALYZE_ERROR'],
    primaryCompetencies: ['EVALUATE'],
    secondaryCompetencies: ['TRANSFER', 'ANALYZE', 'JUSTIFY'],
    defaultLayer: 'Avanzado',
    description: 'Desafía una afirmación general solicitando identificar un caso límite que la invalide.'
  },
  ArgumentEvaluation: {
    componentType: 'ArgumentEvaluation',
    name: 'Evaluación de Argumentos',
    primaryExperiences: ['EVALUATE_PLAUSIBILITY', 'ARGUE_BUILD', 'CRITICAL_THINKING'],
    secondaryExperiences: ['JUSTIFY_DECISION', 'ANALYZE_ERROR'],
    primaryCompetencies: ['EVALUATE'],
    secondaryCompetencies: ['JUSTIFY', 'ANALYZE', 'EXPLAIN'],
    defaultLayer: 'Avanzado',
    description: 'Examina la solidez o las falacias presentes en un argumento preelaborado.'
  },
  SequenceBuilder: {
    componentType: 'SequenceBuilder',
    name: 'Reconstructor de Secuencia',
    primaryExperiences: ['SEQUENCE_PROCESS', 'APPLY_PROCEDURE'],
    secondaryExperiences: ['SOLVE_PROBLEM', 'EXPLAIN_CONCEPT'],
    primaryCompetencies: ['APPLY'],
    secondaryCompetencies: ['ANALYZE', 'UNDERSTAND'],
    defaultLayer: 'Intermedio',
    description: 'Reordena interactivamente las fases o etapas procedimentales de un experimento o algoritmo.'
  },
  AnektiaExercise: {
    componentType: 'AnektiaExercise',
    name: 'Ejercicio Tradicional Anektia',
    primaryExperiences: ['APPLY_PROCEDURE', 'SOLVE_PROBLEM', 'TRANSFER_KNOWLEDGE'],
    secondaryExperiences: ['PERFORM_ESTIMATION', 'EXPLAIN_CONCEPT'],
    primaryCompetencies: ['APPLY', 'CALCULATE'],
    secondaryCompetencies: ['ANALYZE', 'TRANSFER'],
    defaultLayer: 'Intermedio',
    description: 'Problema o cuestión práctica de respuesta abierta con pistas y soluciones.'
  },
  AnektiaDecisionBox: {
    componentType: 'AnektiaDecisionBox',
    name: 'Caja de Decisión Anektia',
    primaryExperiences: ['JUSTIFY_DECISION', 'EXPLAIN_CONCEPT'],
    secondaryExperiences: ['COMPARE_ALTERNATIVES'],
    primaryCompetencies: ['JUSTIFY'],
    secondaryCompetencies: ['EXPLAIN'],
    defaultLayer: 'Inicio',
    description: 'Pregunta gamificada de decisión conceptual con recompensa de XP.'
  },
  AnektiaFlowchart: {
    componentType: 'AnektiaFlowchart',
    name: 'Diagrama de Flujo Interactivo Anektia',
    primaryExperiences: ['SEQUENCE_PROCESS', 'EXPLAIN_CONCEPT', 'BUILD_MODEL'],
    secondaryExperiences: ['APPLY_PROCEDURE', 'INTERPRET_DATA'],
    primaryCompetencies: ['UNDERSTAND', 'APPLY'],
    secondaryCompetencies: ['ANALYZE', 'MODEL'],
    defaultLayer: 'Intermedio',
    description: 'Tarjeta y visualizador secuencial interactivo de diagramas de flujo y métodos por pasos.'
  }
};

/**
 * Finds candidate activity components that cover a target missing LearningExperience.
 * Returns direct fit components and compatible components separately.
 */
export function getCandidatesForExperience(expKey: ExperienceKey): {
  directFit: ActivityCapabilityMapping[];
  compatible: ActivityCapabilityMapping[];
} {
  const directFit: ActivityCapabilityMapping[] = [];
  const compatible: ActivityCapabilityMapping[] = [];

  Object.values(ACTIVITY_CAPABILITY_REGISTRY).forEach(cap => {
    if (cap.primaryExperiences.includes(expKey)) {
      directFit.push(cap);
    } else if (cap.secondaryExperiences.includes(expKey)) {
      compatible.push(cap);
    }
  });

  return { directFit, compatible };
}
