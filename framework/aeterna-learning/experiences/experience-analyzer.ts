import { CompetencyAnalysisResult } from '../competencies/taxonomy';
import { ArticleType, ParsedArticleStructure } from '../types';
import { 
  ActivityQualityEvaluation, 
  ALL_LEARNING_EXPERIENCES, 
  ExperienceExpectation, 
  ExperienceKey, 
  ExperienceStatus, 
  LearningExperienceAuditResult, 
  LearningExperienceRow 
} from './taxonomy';

export function determineExperienceExpectation(
  articleType: ArticleType,
  expKey: ExperienceKey,
  focusAreas: string[]
): ExperienceExpectation {
  switch (articleType) {
    case 'methodological':
      if (['EXPLAIN_CONCEPT', 'APPLY_PROCEDURE', 'BUILD_MODEL', 'JUSTIFY_DECISION', 'TRANSFER_KNOWLEDGE'].includes(expKey)) {
        return 'CORE';
      }
      if (['PERFORM_ESTIMATION', 'ANALYZE_ERROR', 'EVALUATE_PLAUSIBILITY', 'INTERPRET_DATA'].includes(expKey)) {
        return 'RECOMMENDED';
      }
      return 'OPTIONAL';

    case 'conceptual':
      if (['EXPLAIN_CONCEPT', 'COMPARE_ALTERNATIVES', 'INTERPRET_DATA'].includes(expKey)) {
        return 'CORE';
      }
      if (['APPLY_PROCEDURE', 'JUSTIFY_DECISION'].includes(expKey)) {
        return 'RECOMMENDED';
      }
      return 'OPTIONAL';

    case 'procedural':
    case 'problem_solving':
      if (['APPLY_PROCEDURE', 'SOLVE_PROBLEM', 'EVALUATE_PLAUSIBILITY'].includes(expKey)) {
        return 'CORE';
      }
      if (['JUSTIFY_DECISION', 'ANALYZE_ERROR', 'BUILD_MODEL'].includes(expKey)) {
        return 'RECOMMENDED';
      }
      return 'OPTIONAL';

    case 'experimental':
    case 'simulation':
      if (['EXPERIMENT_VARIABLES', 'PREDICT_BEFORE_OBSERVE', 'INTERPRET_SIMULATION', 'BUILD_MODEL'].includes(expKey)) {
        return 'CORE';
      }
      if (['ANALYZE_ERROR', 'TRANSFER_KNOWLEDGE', 'JUSTIFY_DECISION'].includes(expKey)) {
        return 'RECOMMENDED';
      }
      return 'OPTIONAL';

    default:
      return 'OPTIONAL';
  }
}

export function evaluateActivityQuality(parsed: ParsedArticleStructure): ActivityQualityEvaluation[] {
  return parsed.exercises.map(ex => {
    const text = `${ex.title || ''} ${ex.questionText || ''}`.toLowerCase();
    
    let cognitiveDemand: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let transferPotential = false;
    let score = 50;

    if (text.includes('justifique') || text.includes('modelo') || text.includes('estimación de fermi') || text.includes('contexto nuevo')) {
      cognitiveDemand = 'HIGH';
      score = 90;
    } else if (text.includes('calcule') || text.includes('convierta') || text.includes('diferencia entre')) {
      cognitiveDemand = 'MEDIUM';
      score = 70;
    }

    if (text.includes('vida real') || text.includes('contexto nuevo') || text.includes('situación cotidiana')) {
      transferPotential = true;
      score += 10;
    }

    // Layer appropriateness check
    let layerAppropriateness = true;
    if (ex.layerId === 'avanzado' && cognitiveDemand === 'LOW') {
      layerAppropriateness = false;
    }

    return {
      activityId: ex.id,
      activityTitle: ex.title || ex.questionText,
      type: ex.type,
      cognitiveDemand,
      competencyRelevance: 'HIGH',
      layerAppropriateness,
      evidenceStrength: cognitiveDemand === 'HIGH' ? 'STRONG' : 'MODERATE',
      transferPotential,
      coveredCompetencies: ex.detectedCognitiveLevels ? (ex.detectedCognitiveLevels as any) : [],
      score: Math.min(100, score)
    };
  });
}

export function auditLearningExperiences(
  parsed: ParsedArticleStructure,
  articleType: ArticleType,
  competencyAnalysis: CompetencyAnalysisResult
): LearningExperienceAuditResult {
  const focusAreas = competencyAnalysis.articlePurpose.focusAreas;
  const activityQualityList = evaluateActivityQuality(parsed);
  const matrix = competencyAnalysis.matrix;

  const coreExperiences: LearningExperienceRow[] = [];
  const recommendedExperiences: LearningExperienceRow[] = [];
  const optionalExperiences: LearningExperienceRow[] = [];

  Object.values(ALL_LEARNING_EXPERIENCES).forEach(meta => {
    const expectation = determineExperienceExpectation(articleType, meta.key, focusAreas);

    // Evaluate Teaching Status from competency analysis matrix
    const targetCompRows = matrix.filter(r => meta.targetCompetencies.includes(r.competency));
    
    let teachingStatus: ExperienceStatus = 'UNKNOWN';
    if (targetCompRows.some(r => r.teachingStatus === 'PASS')) {
      teachingStatus = 'PASS';
    } else if (targetCompRows.some(r => r.teachingStatus === 'PARTIAL')) {
      teachingStatus = 'PARTIAL';
    } else {
      teachingStatus = 'FAIL';
    }

    // Evaluate Practice Status from competency analysis matrix & exercises
    let practiceStatus: ExperienceStatus = 'FAIL';
    const supportingActivities: string[] = [];

    targetCompRows.forEach(r => {
      if (r.practiceStatus === 'PASS' || r.practiceStatus === 'PARTIAL') {
        r.supportingExercises.forEach(se => {
          if (!supportingActivities.includes(se)) supportingActivities.push(se);
        });
      }
    });

    // Check if any detected pedagogical content block supports this experience
    const fullText = JSON.stringify(parsed).toLowerCase();
    if (meta.key === 'ANALYZE_ERROR' && (fullText.includes('error común') || fullText.includes('misconception') || fullText.includes('disonancia cognitiva'))) {
      if (!supportingActivities.includes('PedagogicalBlock:Misconception')) supportingActivities.push('PedagogicalBlock:Misconception');
    }
    if (meta.key === 'EXPLAIN_CONCEPT' && (fullText.includes('la clave') || fullText.includes('key-insight') || fullText.includes('axioma fundamental'))) {
      if (!supportingActivities.includes('PedagogicalBlock:KeyInsight')) supportingActivities.push('PedagogicalBlock:KeyInsight');
    }
    if (meta.key === 'TRANSFER_KNOWLEDGE' && (fullText.includes('conecta') || fullText.includes('transfiere') || fullText.includes('connect') || fullText.includes('transfer'))) {
      if (!supportingActivities.includes('PedagogicalBlock:Transfer/Connect')) supportingActivities.push('PedagogicalBlock:Transfer/Connect');
    }
    if (meta.key === 'CAUSAL_REASONING' && (fullText.includes('supuesto oculto') || fullText.includes('hidden-assumption') || fullText.includes('sistema aeterna'))) {
      if (!supportingActivities.includes('PedagogicalBlock:HiddenAssumption/System')) supportingActivities.push('PedagogicalBlock:HiddenAssumption/System');
    }

    if (targetCompRows.some(r => r.practiceStatus === 'PASS')) {
      practiceStatus = 'PASS';
    } else if (targetCompRows.some(r => r.practiceStatus === 'PARTIAL') || supportingActivities.length > 0) {
      practiceStatus = supportingActivities.length > 0 ? 'PASS' : 'PARTIAL';
    } else if (parsed.exercises.length >= 3) {
      practiceStatus = 'FAIL';
    } else {
      practiceStatus = 'UNKNOWN';
    }

    let overallStatus: ExperienceStatus = 'FAIL';
    if (practiceStatus === 'PASS') {
      overallStatus = 'PASS';
    } else if (practiceStatus === 'PARTIAL') {
      overallStatus = 'PARTIAL';
    } else {
      overallStatus = 'FAIL';
    }

    const row: LearningExperienceRow = {
      experienceKey: meta.key,
      title: meta.title,
      description: meta.description,
      expectation,
      teachingStatus,
      practiceStatus,
      status: overallStatus,
      supportingActivities,
      cognitiveDemand: meta.cognitiveDemand
    };

    if (expectation === 'CORE') coreExperiences.push(row);
    else if (expectation === 'RECOMMENDED') recommendedExperiences.push(row);
    else optionalExperiences.push(row);
  });

  const coreTotal = coreExperiences.length;
  const coreCovered = coreExperiences.filter(e => e.status === 'PASS' || e.status === 'PARTIAL').length;
  const coreGapsCount = coreExperiences.filter(e => e.status === 'FAIL').length;

  const experienceCompletenessPercentage = coreTotal > 0 ? Math.round((coreCovered / coreTotal) * 100) : 100;

  return {
    coreExperiences,
    recommendedExperiences,
    optionalExperiences,
    activityQualityList,
    practiceDensity: {
      currentActivitiesCount: parsed.exercises.length,
      meaningfulCoreCoverage: `${coreCovered}/${coreTotal} core experiences`,
      coreCoveredCount: coreCovered,
      coreTotalCount: coreTotal
    },
    experienceCompletenessPercentage,
    coreGapsCount
  };
}
