import { ArticleType, ConfidenceLevel } from '../types';

export type TaxonomyCompetency =
  | 'UNDERSTAND'
  | 'IDENTIFY'
  | 'RECALL'
  | 'EXPLAIN'
  | 'COMPARE'
  | 'CLASSIFY'
  | 'APPLY'
  | 'CALCULATE'
  | 'INTERPRET'
  | 'PREDICT'
  | 'ESTIMATE'
  | 'MODEL'
  | 'JUSTIFY'
  | 'ANALYZE'
  | 'EVALUATE'
  | 'ERROR_ANALYSIS'
  | 'TRANSFER'
  | 'SYNTHESIZE'
  | 'DESIGN'
  | 'REFLECT';

export type CompetencyApplicability = 'CORE' | 'RELEVANT' | 'OPTIONAL' | 'NOT_RELEVANT' | 'UNKNOWN';
export type CompetencyStatus = 'PASS' | 'PARTIAL' | 'FAIL' | 'UNKNOWN';
export type CompetencyGapType = 'CRITICAL' | 'WARNING' | 'INFO' | 'NONE';
export type EvidenceStrength = 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE';

export interface CompetencyMetadata {
  key: TaxonomyCompetency;
  name: string;
  description: string;
  keywords: string[];
  impliedCompetencies?: { competency: TaxonomyCompetency; impliedStatus: 'PARTIAL' | 'PASS' }[];
}

export const ALL_COMPETENCIES: Record<TaxonomyCompetency, CompetencyMetadata> = {
  UNDERSTAND: {
    key: 'UNDERSTAND',
    name: 'Comprender',
    description: 'Comprender conceptos básicos y principios fundamentales',
    keywords: ['comprender', 'significado', 'concepto', 'entender', 'idea clave', 'fundamento']
  },
  IDENTIFY: {
    key: 'IDENTIFY',
    name: 'Identificar',
    description: 'Reconocer e identificar variables, elementos y símbolos',
    keywords: ['identificar', 'reconocer', 'señalar', 'cuál de los siguientes', 'distinguir la variable', 'magnitud']
  },
  RECALL: {
    key: 'RECALL',
    name: 'Recordar',
    description: 'Recordar definiciones, unidades e información fáctica',
    keywords: ['recordar', 'unidad de medida', 'definición exacta', 'fórmula de', 'constante']
  },
  EXPLAIN: {
    key: 'EXPLAIN',
    name: 'Explicar',
    description: 'Explicar causas, mecanismos y relaciones teóricas',
    keywords: ['explicar', 'explique por qué', 'cómo funciona', 'razón física', 'forma de pensar', 'método']
  },
  COMPARE: {
    key: 'COMPARE',
    name: 'Comparar',
    description: 'Comparar y contrastar magnitudes, modelos o aproximaciones',
    keywords: ['comparar', 'diferencia entre', 'versus', 'frente a', 'se asemeja', 'orden de magnitud']
  },
  CLASSIFY: {
    key: 'CLASSIFY',
    name: 'Clasificar',
    description: 'Agrupar y categorizar elementos según criterios científicos',
    keywords: ['clasificar', 'categorizar', 'agrupar', 'tipo de', 'sistemas']
  },
  APPLY: {
    key: 'APPLY',
    name: 'Aplicar',
    description: 'Aplicar leyes y métodos a situaciones o cálculos directos',
    keywords: ['aplicar', 'utilizar la ecuación', 'aplicando el método', 'sustituya', 'usando la expresión', 'conversión']
  },
  CALCULATE: {
    key: 'CALCULATE',
    name: 'Calcular',
    description: 'Realizar cálculos numéricos y transformaciones matemáticas',
    keywords: ['calcular', 'convierta', 'halle el valor numérico', 'resultado aritmético', 'operación numérica']
  },
  INTERPRET: {
    key: 'INTERPRET',
    name: 'Interpretar',
    description: 'Interpretar gráficas, resultados u órdenes de magnitud',
    keywords: ['interpretar', 'qué significa el resultado', 'gráfica', 'lectura de datos', 'sentido físico']
  },
  PREDICT: {
    key: 'PREDICT',
    name: 'Predecir',
    description: 'Predecir comportamientos o tendencias ante cambios de variables',
    keywords: ['predecir', 'qué ocurrirá si', 'si aumentamos', 'tendencia', 'efecto']
  },
  ESTIMATE: {
    key: 'ESTIMATE',
    name: 'Estimar',
    description: 'Realizar estimaciones de Fermi y cálculos de orden de magnitud',
    keywords: ['estimar', 'estimación de fermi', 'orden de magnitud', 'aproximación rápida', 'cuántos aproximadamente', 'estime'],
    impliedCompetencies: [
      { competency: 'APPLY', impliedStatus: 'PARTIAL' },
      { competency: 'ERROR_ANALYSIS', impliedStatus: 'PARTIAL' }
    ]
  },
  MODEL: {
    key: 'MODEL',
    name: 'Modelizar',
    description: 'Construir o simplificar modelos físicos e hipótesis de trabajo',
    keywords: ['modelizar', 'modelo físico', 'vaca esférica', 'simplificación', 'hipótesis ideal', 'supuestos'],
    impliedCompetencies: [
      { competency: 'ANALYZE', impliedStatus: 'PARTIAL' },
      { competency: 'APPLY', impliedStatus: 'PARTIAL' }
    ]
  },
  JUSTIFY: {
    key: 'JUSTIFY',
    name: 'Justificar',
    description: 'Justificar la idoneidad de una respuesta, aproximación o modelo',
    keywords: ['justificar', 'justifique su respuesta', 'razone la elección', 'por qué es válida', 'razón'],
    impliedCompetencies: [
      { competency: 'EXPLAIN', impliedStatus: 'PARTIAL' },
      { competency: 'ANALYZE', impliedStatus: 'PARTIAL' },
      { competency: 'EVALUATE', impliedStatus: 'PARTIAL' }
    ]
  },
  ANALYZE: {
    key: 'ANALYZE',
    name: 'Analizar',
    description: 'Descomponer problemas complejos en subproblemas resolubles',
    keywords: ['analizar', 'descomponer el problema', 'análisis paso a paso', 'factores involucrados', 'descomposición']
  },
  EVALUATE: {
    key: 'EVALUATE',
    name: 'Evaluar',
    description: 'Evaluar la sensatez o validez de un resultado o método',
    keywords: ['evaluar', 'es razonable el resultado', 'validez', 'limitación del método', 'plausibilidad'],
    impliedCompetencies: [
      { competency: 'ANALYZE', impliedStatus: 'PARTIAL' },
      { competency: 'INTERPRET', impliedStatus: 'PARTIAL' }
    ]
  },
  ERROR_ANALYSIS: {
    key: 'ERROR_ANALYSIS',
    name: 'Análisis de Errores',
    description: 'Identificar sesgos, fuentes de incertidumbre y errores comunes',
    keywords: ['análisis de error', 'incertidumbre', 'precisión vs exactitud', 'sesgo', 'error común', 'orden de magnitud']
  },
  TRANSFER: {
    key: 'TRANSFER',
    name: 'Transferencia',
    description: 'Aplicar el método o concepto a una situación física totalmente novedosa',
    keywords: ['transferencia', 'contexto nuevo', 'vida real', 'situación cotidiana inédita', 'aplicar a otro campo', 'frontera']
  },
  SYNTHESIZE: {
    key: 'SYNTHESIZE',
    name: 'Sintetizar',
    description: 'Integrar múltiples conceptos o leyes en una conclusión unificada',
    keywords: ['sintetizar', 'resumen integrador', 'conclusión general', 'visión global']
  },
  DESIGN: {
    key: 'DESIGN',
    name: 'Diseñar',
    description: 'Diseñar experimentos, simulaciones o estrategias de medición',
    keywords: ['diseñar', 'proponga un experimento', 'estrategia de medición', 'procedimiento experimental']
  },
  REFLECT: {
    key: 'REFLECT',
    name: 'Reflexionar',
    description: 'Reflexionar sobre metacognición y el proceso de aprendizaje',
    keywords: ['reflexionar', 'metacognición', 'qué has aprendido', 'cómo cambió tu visión']
  }
};

export interface ExerciseCompetencyMapping {
  exerciseId: string;
  exerciseTitle: string;
  primaryCompetency: TaxonomyCompetency;
  secondaryCompetencies: { competency: TaxonomyCompetency; strength: EvidenceStrength; reason: string }[];
  evidenceStrength: EvidenceStrength;
}

export interface ArticlePurpose {
  primaryIntent: string;
  secondaryIntents: string[];
  focusAreas: string[];
}

export interface CompetencyDetection {
  competency: TaxonomyCompetency;
  source: 'content' | 'practice';
  confidence: number; // 0.0 .. 1.0
  evidence: string;
  exerciseId?: string;
}

export interface CompetencyMatrixRow {
  competency: TaxonomyCompetency;
  description: string;
  applicability: CompetencyApplicability;
  teachingStatus: CompetencyStatus;
  practiceStatus: CompetencyStatus;
  evidenceStrength: EvidenceStrength;
  confidence: ConfidenceLevel;
  supportingExercises: string[];
  evidenceTraceExplanation?: string;
  gapType: CompetencyGapType;
  recommendation?: string;
}

export interface CompetencyAnalysisResult {
  articlePurpose: ArticlePurpose;
  exerciseMappings: ExerciseCompetencyMapping[];
  matrix: CompetencyMatrixRow[];
  coreSummary: { covered: number; total: number; percentage: number };
  relevantSummary: { covered: number; total: number; percentage: number };
  criticalGaps: string[];
  warningGaps: string[];
  gapRecommendations: string[];
}
