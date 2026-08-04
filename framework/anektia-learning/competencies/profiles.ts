import { ArticleType } from '../types';
import { ArticlePurpose, CompetencyApplicability, TaxonomyCompetency } from './taxonomy';

export interface CompetencyProfileConfig {
  type: ArticleType;
  core: TaxonomyCompetency[];
  relevant: TaxonomyCompetency[];
  notRelevant?: TaxonomyCompetency[];
}

export const COMPETENCY_PROFILES: Record<ArticleType, CompetencyProfileConfig> = {
  methodological: {
    type: 'methodological',
    core: ['EXPLAIN', 'APPLY', 'JUSTIFY', 'ANALYZE', 'TRANSFER'],
    relevant: ['ESTIMATE', 'MODEL', 'INTERPRET', 'ERROR_ANALYSIS', 'EVALUATE'],
    notRelevant: ['CALCULATE', 'RECALL', 'DESIGN']
  },
  conceptual: {
    type: 'conceptual',
    core: ['EXPLAIN', 'UNDERSTAND', 'IDENTIFY', 'COMPARE'],
    relevant: ['CLASSIFY', 'INTERPRET', 'SYNTHESIZE'],
    notRelevant: ['CALCULATE', 'DESIGN']
  },
  procedural: {
    type: 'procedural',
    core: ['APPLY', 'CALCULATE', 'IDENTIFY'],
    relevant: ['UNDERSTAND', 'ERROR_ANALYSIS', 'INTERPRET'],
    notRelevant: ['DESIGN', 'REFLECT']
  },
  problem_solving: {
    type: 'problem_solving',
    core: ['APPLY', 'CALCULATE', 'ANALYZE', 'EVALUATE', 'JUSTIFY'],
    relevant: ['MODEL', 'ERROR_ANALYSIS', 'TRANSFER'],
    notRelevant: ['RECALL']
  },
  experimental: {
    type: 'experimental',
    core: ['PREDICT', 'INTERPRET', 'ANALYZE', 'ERROR_ANALYSIS'],
    relevant: ['ESTIMATE', 'MODEL', 'EVALUATE', 'DESIGN']
  },
  simulation: {
    type: 'simulation',
    core: ['PREDICT', 'MODEL', 'INTERPRET', 'ANALYZE'],
    relevant: ['ESTIMATE', 'EVALUATE', 'TRANSFER']
  },
  synthesis: {
    type: 'synthesis',
    core: ['SYNTHESIZE', 'COMPARE', 'EVALUATE', 'REFLECT'],
    relevant: ['EXPLAIN', 'TRANSFER']
  }
};

/**
 * Computes FINAL APPLICABILITY combining:
 * BASE EXPECTATION (Article Type Profile) + ARTICLE PURPOSE + CONTENT INTENT
 */
export function computeFinalApplicability(
  articleType: ArticleType,
  competency: TaxonomyCompetency,
  purpose: ArticlePurpose
): CompetencyApplicability {
  const profile = COMPETENCY_PROFILES[articleType] || COMPETENCY_PROFILES.conceptual;
  
  // Explicitly not relevant for article type
  if (profile.notRelevant?.includes(competency)) {
    // Check if purpose explicitly promotes it
    const relatesToPurpose = purpose.focusAreas.some(fa => fa.toLowerCase().includes(competency.toLowerCase()));
    if (!relatesToPurpose) {
      return 'NOT_RELEVANT';
    }
  }

  const isCoreBase = profile.core.includes(competency);
  const isRelevantBase = profile.relevant.includes(competency);
  const isFocusArea = purpose.focusAreas.some(fa => 
    fa.toLowerCase().includes(competency.toLowerCase()) || 
    (competency === 'ESTIMATE' && fa.toLowerCase().includes('estimación')) ||
    (competency === 'MODEL' && fa.toLowerCase().includes('modelo')) ||
    (competency === 'ERROR_ANALYSIS' && fa.toLowerCase().includes('incertidumbre'))
  );

  if (isCoreBase && isFocusArea) {
    return 'CORE';
  }
  if (isCoreBase) {
    return 'CORE';
  }
  if (isRelevantBase || isFocusArea) {
    return 'RELEVANT';
  }

  return 'OPTIONAL';
}
