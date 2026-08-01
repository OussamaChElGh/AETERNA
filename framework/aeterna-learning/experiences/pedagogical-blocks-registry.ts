import { TaxonomyCompetency } from '../competencies/taxonomy';
import { ExperienceKey } from './taxonomy';

export type PedagogicalBlockType =
  | 'misconception'
  | 'key-insight'
  | 'archive-fragment'
  | 'aeterna-system'
  | 'mini-challenge'
  | 'connect'
  | 'hidden-assumption'
  | 'transfer';

export interface PedagogicalBlockCapabilityMapping {
  blockType: PedagogicalBlockType;
  name: string;
  visibleTitle: string;
  family: 'PEDAGOGICAL_CONTENT_BLOCK';
  primaryExperiences: ExperienceKey[];
  secondaryExperiences: ExperienceKey[];
  primaryCompetencies: TaxonomyCompetency[];
  secondaryCompetencies: TaxonomyCompetency[];
  description: string;
}

export const PEDAGOGICAL_BLOCKS_REGISTRY: Record<PedagogicalBlockType, PedagogicalBlockCapabilityMapping> = {
  'misconception': {
    blockType: 'misconception',
    name: 'Error Común',
    visibleTitle: 'Error Común',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['ANALYZE_ERROR', 'EVALUATE_PLAUSIBILITY'],
    secondaryExperiences: ['CRITICAL_THINKING', 'JUSTIFY_DECISION'],
    primaryCompetencies: ['ERROR_ANALYSIS', 'EVALUATE'],
    secondaryCompetencies: ['JUSTIFY', 'ANALYZE'],
    description: 'Desmonta una concepción errónea o intuición incorrecta contrastando el error con la realidad.'
  },
  'key-insight': {
    blockType: 'key-insight',
    name: 'La Clave en 10s',
    visibleTitle: 'La Clave en 10 segundos',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['EXPLAIN_CONCEPT', 'TRANSFER_KNOWLEDGE'],
    secondaryExperiences: ['JUSTIFY_DECISION'],
    primaryCompetencies: ['UNDERSTAND', 'EXPLAIN'],
    secondaryCompetencies: ['APPLY'],
    description: 'Destaca la idea fundamental y sintética que el estudiante debe retener.'
  },
  'archive-fragment': {
    blockType: 'archive-fragment',
    name: 'Fragmento de Archivo',
    visibleTitle: 'Fragmento de Archivo',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['EXPLAIN_CONCEPT', 'INTERPRET_DATA'],
    secondaryExperiences: ['TRANSFER_KNOWLEDGE'],
    primaryCompetencies: ['UNDERSTAND', 'INTERPRET'],
    secondaryCompetencies: ['EXPLAIN'],
    description: 'Introduce un dato contraintuitivo o contextualizador que amplía el modelo mental.'
  },
  'aeterna-system': {
    blockType: 'aeterna-system',
    name: 'Sistema Aeterna',
    visibleTitle: 'Sistema Aeterna',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['CRITICAL_THINKING', 'CAUSAL_REASONING'],
    secondaryExperiences: ['BUILD_MODEL', 'JUSTIFY_DECISION'],
    primaryCompetencies: ['ANALYZE', 'EVALUATE'],
    secondaryCompetencies: ['MODEL', 'JUSTIFY'],
    description: 'Presenta un protocolo explícito de razonamiento metodológico.'
  },
  'mini-challenge': {
    blockType: 'mini-challenge',
    name: 'Mini Desafío',
    visibleTitle: 'Mini Desafío',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['EVALUATE_PLAUSIBILITY', 'APPLY_PROCEDURE'],
    secondaryExperiences: ['TRANSFER_KNOWLEDGE'],
    primaryCompetencies: ['APPLY', 'EVALUATE'],
    secondaryCompetencies: ['UNDERSTAND'],
    description: 'Microprueba rápida de comprensión o intuición directa sin competir con ejercicios completos.'
  },
  'connect': {
    blockType: 'connect',
    name: 'Conecta',
    visibleTitle: 'Conecta',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['TRANSFER_KNOWLEDGE', 'COMPARE_ALTERNATIVES'],
    secondaryExperiences: ['EXPLAIN_CONCEPT'],
    primaryCompetencies: ['TRANSFER', 'COMPARE'],
    secondaryCompetencies: ['UNDERSTAND', 'APPLY'],
    description: 'Relaciona el concepto actual con conocimientos previos o ideas de otras disciplinas.'
  },
  'hidden-assumption': {
    blockType: 'hidden-assumption',
    name: 'Supuesto Oculto',
    visibleTitle: 'Supuesto Oculto',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['ANALYZE_ERROR', 'BUILD_MODEL', 'CRITICAL_THINKING'],
    secondaryExperiences: ['EVALUATE_PLAUSIBILITY'],
    primaryCompetencies: ['ANALYZE', 'EVALUATE'],
    secondaryCompetencies: ['MODEL', 'ERROR_ANALYSIS'],
    description: 'Hace explícitas las condiciones, simplificaciones o limitaciones ocultas de un modelo.'
  },
  'transfer': {
    blockType: 'transfer',
    name: 'Transfiere',
    visibleTitle: 'Transfiere',
    family: 'PEDAGOGICAL_CONTENT_BLOCK',
    primaryExperiences: ['TRANSFER_KNOWLEDGE', 'APPLY_PROCEDURE'],
    secondaryExperiences: ['BUILD_MODEL', 'EVALUATE_PLAUSIBILITY'],
    primaryCompetencies: ['TRANSFER', 'APPLY'],
    secondaryCompetencies: ['MODEL', 'ANALYZE'],
    description: 'Plantea el salto conceptual hacia un dominio o contexto completamente diferente.'
  }
};

export interface ReferenceLearningUIElement {
  uiType: 'faq' | 'progress';
  name: string;
  family: 'REFERENCE_LEARNING_UI';
  description: string;
}

export const REFERENCE_LEARNING_UI_REGISTRY: Record<'faq' | 'progress', ReferenceLearningUIElement> = {
  faq: {
    uiType: 'faq',
    name: 'Aeterna FAQ / Exégesis',
    family: 'REFERENCE_LEARNING_UI',
    description: 'Bloque de consulta de preguntas frecuentes y resolución de dudas comunes.'
  },
  progress: {
    uiType: 'progress',
    name: 'Nivel de Asimilación UI',
    family: 'REFERENCE_LEARNING_UI',
    description: 'Indicador visual de progreso e hito alcanzado dentro de la guía.'
  }
};
