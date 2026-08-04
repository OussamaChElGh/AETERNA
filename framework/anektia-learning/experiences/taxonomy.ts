import { TaxonomyCompetency } from '../competencies/taxonomy';
import { ArticleType } from '../types';

export type ExperienceKey =
  | 'EXPLAIN_CONCEPT'
  | 'APPLY_PROCEDURE'
  | 'SOLVE_PROBLEM'
  | 'INTERPRET_DATA'
  | 'BUILD_MODEL'
  | 'COMPARE_ALTERNATIVES'
  | 'JUSTIFY_DECISION'
  | 'ANALYZE_ERROR'
  | 'EVALUATE_PLAUSIBILITY'
  | 'PERFORM_ESTIMATION'
  | 'TRANSFER_KNOWLEDGE'
  | 'EXPERIMENT_VARIABLES'
  | 'PREDICT_BEFORE_OBSERVE'
  | 'INTERPRET_SIMULATION'
  | 'CAUSAL_REASONING'
  | 'ARGUE_BUILD'
  | 'EVIDENCE_EVALUATION'
  | 'CRITICAL_THINKING'
  | 'SEQUENCE_PROCESS';

export type ExperienceExpectation = 'CORE' | 'RECOMMENDED' | 'OPTIONAL';
export type ExperienceStatus = 'PASS' | 'PARTIAL' | 'FAIL' | 'UNKNOWN';
export type CognitiveDemandLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LearningExperienceMetadata {
  key: ExperienceKey;
  title: string;
  description: string;
  targetCompetencies: TaxonomyCompetency[];
  cognitiveDemand: CognitiveDemandLevel;
}

export const ALL_LEARNING_EXPERIENCES: Record<ExperienceKey, LearningExperienceMetadata> = {
  EXPLAIN_CONCEPT: {
    key: 'EXPLAIN_CONCEPT',
    title: 'Explicar concepto',
    description: 'Explicar un concepto o principio científico en sus propias palabras',
    targetCompetencies: ['EXPLAIN', 'UNDERSTAND'],
    cognitiveDemand: 'LOW'
  },
  APPLY_PROCEDURE: {
    key: 'APPLY_PROCEDURE',
    title: 'Aplicar procedimiento',
    description: 'Aplicar directamente un método, procedimiento o fórmula física',
    targetCompetencies: ['APPLY', 'CALCULATE'],
    cognitiveDemand: 'MEDIUM'
  },
  SOLVE_PROBLEM: {
    key: 'SOLVE_PROBLEM',
    title: 'Resolver problema',
    description: 'Resolver un problema físico estructurado de múltiples pasos',
    targetCompetencies: ['APPLY', 'CALCULATE', 'ANALYZE'],
    cognitiveDemand: 'MEDIUM'
  },
  INTERPRET_DATA: {
    key: 'INTERPRET_DATA',
    title: 'Interpretar datos',
    description: 'Interpretar gráficas, tablas de datos o magnitudes físicas',
    targetCompetencies: ['INTERPRET', 'ANALYZE'],
    cognitiveDemand: 'MEDIUM'
  },
  BUILD_MODEL: {
    key: 'BUILD_MODEL',
    title: 'Construir modelo',
    description: 'Construir, simplificar o evaluar las hipótesis de un modelo físico',
    targetCompetencies: ['MODEL', 'ANALYZE'],
    cognitiveDemand: 'HIGH'
  },
  COMPARE_ALTERNATIVES: {
    key: 'COMPARE_ALTERNATIVES',
    title: 'Comparar alternativas',
    description: 'Comparar y contrastar modelos, hipótesis o aproximaciones',
    targetCompetencies: ['COMPARE', 'EVALUATE'],
    cognitiveDemand: 'MEDIUM'
  },
  JUSTIFY_DECISION: {
    key: 'JUSTIFY_DECISION',
    title: 'Justificar decisión',
    description: 'Justificar por qué una aproximación o resultado es válido',
    targetCompetencies: ['JUSTIFY', 'EXPLAIN', 'ANALYZE'],
    cognitiveDemand: 'HIGH'
  },
  ANALYZE_ERROR: {
    key: 'ANALYZE_ERROR',
    title: 'Analizar supuestos/errores',
    description: 'Identificar y evaluar fuentes de incertidumbre, errores o supuestos no válidos',
    targetCompetencies: ['ERROR_ANALYSIS', 'EVALUATE'],
    cognitiveDemand: 'HIGH'
  },
  EVALUATE_PLAUSIBILITY: {
    key: 'EVALUATE_PLAUSIBILITY',
    title: 'Evaluar plausibilidad',
    description: 'Evaluar la sensatez o factibilidad física de un resultado u orden de magnitud',
    targetCompetencies: ['EVALUATE', 'INTERPRET'],
    cognitiveDemand: 'HIGH'
  },
  PERFORM_ESTIMATION: {
    key: 'PERFORM_ESTIMATION',
    title: 'Realizar estimación',
    description: 'Ejecutar estimaciones de Fermi y cálculos de orden de magnitud',
    targetCompetencies: ['ESTIMATE', 'APPLY'],
    cognitiveDemand: 'MEDIUM'
  },
  TRANSFER_KNOWLEDGE: {
    key: 'TRANSFER_KNOWLEDGE',
    title: 'Transferir a situación nueva',
    description: 'Transferir la metodología o concepto a un contexto físico totalmente novedoso',
    targetCompetencies: ['TRANSFER', 'APPLY', 'EVALUATE'],
    cognitiveDemand: 'HIGH'
  },
  EXPERIMENT_VARIABLES: {
    key: 'EXPERIMENT_VARIABLES',
    title: 'Experimentar con variables',
    description: 'Manipular activamente variables en una simulación o experimento interactivo',
    targetCompetencies: ['MODEL', 'PREDICT', 'INTERPRET'],
    cognitiveDemand: 'HIGH'
  },
  PREDICT_BEFORE_OBSERVE: {
    key: 'PREDICT_BEFORE_OBSERVE',
    title: 'Predecir antes de observar',
    description: 'Formular una predicción razonada previa a la observación o simulación',
    targetCompetencies: ['PREDICT', 'JUSTIFY'],
    cognitiveDemand: 'HIGH'
  },
  INTERPRET_SIMULATION: {
    key: 'INTERPRET_SIMULATION',
    title: 'Interpretar simulación',
    description: 'Analizar e interpretar las consecuencias observadas en un entorno dinámico',
    targetCompetencies: ['INTERPRET', 'EVALUATE'],
    cognitiveDemand: 'MEDIUM'
  },
  CAUSAL_REASONING: {
    key: 'CAUSAL_REASONING',
    title: 'Razonamiento causal',
    description: 'Conectar causas, mecanismos intermediarios y consecuencias en cadenas lógicas',
    targetCompetencies: ['ANALYZE', 'MODEL', 'EXPLAIN'],
    cognitiveDemand: 'HIGH'
  },
  ARGUE_BUILD: {
    key: 'ARGUE_BUILD',
    title: 'Construir argumento',
    description: 'Estructurar premisas lógicas y justificadas para fundamentar una conclusión',
    targetCompetencies: ['JUSTIFY', 'EXPLAIN', 'ANALYZE'],
    cognitiveDemand: 'HIGH'
  },
  EVIDENCE_EVALUATION: {
    key: 'EVIDENCE_EVALUATION',
    title: 'Evaluación de evidencias',
    description: 'Relacionar e inspeccionar el grado de respaldo de evidencias empíricas/textuales hacia afirmaciones',
    targetCompetencies: ['JUSTIFY', 'EVALUATE', 'INTERPRET'],
    cognitiveDemand: 'HIGH'
  },
  CRITICAL_THINKING: {
    key: 'CRITICAL_THINKING',
    title: 'Pensamiento crítico y contraejemplos',
    description: 'Buscar casos límite o contraejemplos que evalúen la validez general de una proposición',
    targetCompetencies: ['EVALUATE', 'TRANSFER', 'ANALYZE'],
    cognitiveDemand: 'HIGH'
  },
  SEQUENCE_PROCESS: {
    key: 'SEQUENCE_PROCESS',
    title: 'Reconstruir secuencia de proceso',
    description: 'Ordenar y estructurar la secuencia de fases o pasos de un procedimiento o algoritmo',
    targetCompetencies: ['APPLY', 'ANALYZE', 'UNDERSTAND'],
    cognitiveDemand: 'MEDIUM'
  }
};

export interface ActivityQualityEvaluation {
  activityId: string;
  activityTitle: string;
  type: string;
  cognitiveDemand: CognitiveDemandLevel;
  competencyRelevance: 'HIGH' | 'MEDIUM' | 'LOW';
  layerAppropriateness: boolean;
  evidenceStrength: 'STRONG' | 'MODERATE' | 'WEAK';
  transferPotential: boolean;
  coveredCompetencies: TaxonomyCompetency[];
  score: number; // 0..100 quality score
}

export interface LearningExperienceRow {
  experienceKey: ExperienceKey;
  title: string;
  description: string;
  expectation: ExperienceExpectation;
  teachingStatus: ExperienceStatus;
  practiceStatus: ExperienceStatus;
  status: ExperienceStatus;
  supportingActivities: string[];
  cognitiveDemand: CognitiveDemandLevel;
}

export interface LearningExperienceAuditResult {
  coreExperiences: LearningExperienceRow[];
  recommendedExperiences: LearningExperienceRow[];
  optionalExperiences: LearningExperienceRow[];
  activityQualityList: ActivityQualityEvaluation[];
  practiceDensity: {
    currentActivitiesCount: number;
    meaningfulCoreCoverage: string; // e.g. "2/6 core experiences"
    coreCoveredCount: number;
    coreTotalCount: number;
  };
  experienceCompletenessPercentage: number; // 0..100
  coreGapsCount: number;
}
