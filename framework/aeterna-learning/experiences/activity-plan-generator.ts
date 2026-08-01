import { InteractiveAnalysis } from '../types';
import { getCandidatesForExperience } from './registry';
import { LearningExperienceAuditResult, ExperienceKey } from './taxonomy';

export interface ProposedActivityItem {
  step: number;
  layer: 'Inicio' | 'Intermedio' | 'Avanzado' | 'Interactive';
  type: string;
  purpose: string;
  covers: string[];
  recommendedComponent: string;
  directFitComponents?: string[];
  compatibleComponents?: string[];
}

export function generateRecommendedActivityPlan(
  expAudit: LearningExperienceAuditResult,
  interactiveAnalysis: InteractiveAnalysis
): ProposedActivityItem[] {
  const plan: ProposedActivityItem[] = [];
  const missingKeys = new Set<ExperienceKey>(
    [...expAudit.coreExperiences, ...expAudit.recommendedExperiences]
      .filter(e => e.status === 'FAIL' || e.status === 'PARTIAL')
      .map(e => e.experienceKey)
  );

  let stepCounter = 1;

  // Helper to build a plan item using Registry lookup
  const pushPlanItem = (
    layer: 'Inicio' | 'Intermedio' | 'Avanzado' | 'Interactive',
    primaryExp: ExperienceKey,
    groupedKeys: ExperienceKey[],
    purpose: string
  ) => {
    const coversList: string[] = [];
    groupedKeys.forEach(k => {
      if (missingKeys.has(k)) {
        coversList.push(k);
        missingKeys.delete(k);
      }
    });

    if (coversList.length === 0) return;

    const candidates = getCandidatesForExperience(primaryExp);
    const directNames = candidates.directFit.map(c => c.componentType);
    const compNames = candidates.compatible.map(c => c.componentType);
    const mainType = directNames[0] || 'AeternaExercise';
    const recCompString = [...directNames, ...compNames].join(' / ');

    plan.push({
      step: stepCounter++,
      layer,
      type: mainType,
      recommendedComponent: recCompString,
      directFitComponents: directNames,
      compatibleComponents: compNames,
      purpose,
      covers: coversList
    });
  };

  // 1. Concept Structure & Explanation
  if (missingKeys.has('EXPLAIN_CONCEPT') || missingKeys.has('COMPARE_ALTERNATIVES')) {
    pushPlanItem('Inicio', 'EXPLAIN_CONCEPT', ['EXPLAIN_CONCEPT', 'COMPARE_ALTERNATIVES'], 'Relacionar conceptos fundamentales y comparar alternativas o supuestos iniciales');
  }

  // 2. Causal Chains & Causal Reasoning
  if (missingKeys.has('CAUSAL_REASONING') || missingKeys.has('EXPERIMENT_VARIABLES') || missingKeys.has('PERFORM_ESTIMATION')) {
    pushPlanItem('Intermedio', 'CAUSAL_REASONING', ['CAUSAL_REASONING', 'EXPERIMENT_VARIABLES', 'PERFORM_ESTIMATION'], 'Construir cadenas de causa-efecto o experimentar manipulando variables');
  }

  // 3. Evidence Matcher & Data Interpretation
  if (missingKeys.has('EVIDENCE_EVALUATION') || missingKeys.has('INTERPRET_DATA') || missingKeys.has('INTERPRET_SIMULATION')) {
    pushPlanItem('Intermedio', 'EVIDENCE_EVALUATION', ['EVIDENCE_EVALUATION', 'INTERPRET_DATA', 'INTERPRET_SIMULATION'], 'Relacionar afirmaciones teóricas con evidencias empíricas/textuales o gráficas');
  }

  // 4. Argument Construction & Justification
  if (missingKeys.has('ARGUE_BUILD') || missingKeys.has('JUSTIFY_DECISION') || missingKeys.has('PREDICT_BEFORE_OBSERVE')) {
    pushPlanItem('Intermedio', 'ARGUE_BUILD', ['ARGUE_BUILD', 'JUSTIFY_DECISION', 'PREDICT_BEFORE_OBSERVE'], 'Estructurar premisas lógicas para justificar una conclusión o evaluar argumentos');
  }

  // 5. Critical Thinking & Error Analysis
  if (missingKeys.has('CRITICAL_THINKING') || missingKeys.has('ANALYZE_ERROR') || missingKeys.has('EVALUATE_PLAUSIBILITY')) {
    pushPlanItem('Intermedio', 'CRITICAL_THINKING', ['CRITICAL_THINKING', 'ANALYZE_ERROR', 'EVALUATE_PLAUSIBILITY'], 'Identificar fallos de razonamiento o encontrar contraejemplos a afirmaciones generales');
  }

  // 6. Model Building
  if (missingKeys.has('BUILD_MODEL')) {
    pushPlanItem('Intermedio', 'BUILD_MODEL', ['BUILD_MODEL'], 'Construir/simplificar un modelo eligiendo factores relevantes y descartando los despreciables');
  }

  // 7. Sequence Process & Transfer Knowledge
  if (missingKeys.has('SEQUENCE_PROCESS') || missingKeys.has('TRANSFER_KNOWLEDGE') || missingKeys.has('SOLVE_PROBLEM') || missingKeys.has('APPLY_PROCEDURE')) {
    pushPlanItem('Avanzado', 'SEQUENCE_PROCESS', ['SEQUENCE_PROCESS', 'TRANSFER_KNOWLEDGE', 'SOLVE_PROBLEM', 'APPLY_PROCEDURE'], 'Reconstruir la secuencia del procedimiento o aplicar la metodología a situaciones inéditas (Transferencia)');
  }

  return plan;
}
