import fs from 'fs';
import path from 'path';
import { analyzeCompetencies } from '../analyzers/competency-analyzer';
import { auditLearningExperiences } from '../experiences/experience-analyzer';
import { generateRecommendedActivityPlan } from '../experiences/activity-plan-generator';
import { analyzeVisuals } from '../analyzers/visual-analyzer';
import { analyzeDiscoverability } from '../analyzers/discoverability-analyzer';
import { analyzeKnowledgeBenchmark } from '../analyzers/knowledge-benchmark-analyzer';
import { analyzeGlossaryCoverage } from '../analyzers/glossary-analyzer';
import { analyzeTextQuality } from '../analyzers/text-quality-analyzer';
import { evaluateCrossDimensionInterventions } from './cross-dimension-engine';
import { 
  ArticleType, 
  ArticleTypeRuleConfig, 
  AuditReport, 
  AuditStatus, 
  CognitiveLevel, 
  ConfidenceLevel, 
  EvidenceState, 
  EvidenceTraceItem, 
  InteractiveAnalysis, 
  InteractivityBreakdown,
  LearningProfileConfig, 
  ParsedArticleStructure, 
  PracticeEvaluation, 
  QualityGateFailure, 
  ReasoningAnalysis, 
  ScoreCapsConfig,
  ContentDepthAnalysis,
  StructureAnalysisResult,
  AnektiaExperienceResult
} from '../types';

let cachedTypeRules: Record<ArticleType, ArticleTypeRuleConfig> | null = null;
let cachedScoringRules: any = null;

function frameworkConfigPath(...segments: string[]): string {
  return path.join(process.cwd(), 'framework', 'anektia-learning', 'config', ...segments);
}

export function loadArticleTypeRules(): Record<ArticleType, ArticleTypeRuleConfig> {
  if (cachedTypeRules) return cachedTypeRules;
  const configPath = frameworkConfigPath('article-type-rules.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Article type rules file not found at: ${configPath}`);
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  cachedTypeRules = JSON.parse(raw) as Record<ArticleType, ArticleTypeRuleConfig>;
  return cachedTypeRules;
}

export function loadScoringRules(): any {
  if (cachedScoringRules) return cachedScoringRules;
  const configPath = frameworkConfigPath('scoring-rules.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Scoring rules file not found at: ${configPath}`);
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  cachedScoringRules = JSON.parse(raw);
  return cachedScoringRules;
}

export function evaluateScoring(
  parsed: ParsedArticleStructure,
  profile: LearningProfileConfig
): AuditReport {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  const criticalFailures: QualityGateFailure[] = [];
  const evidenceTraces: EvidenceTraceItem[] = [];

  const articleTypeRules = loadArticleTypeRules();
  const scoringRules = loadScoringRules();
  
  const articleTypeInfo = parsed.articleTypeResult;
  const typeRuleConfig = articleTypeRules[articleTypeInfo.detectedType] || articleTypeRules.conceptual;
  const subWeights = scoringRules.practiceSubWeights || {
    quantity: 0.20,
    layerDistribution: 0.15,
    difficultyProgression: 0.20,
    exerciseVariety: 0.15,
    competencyCoverage: 0.30
  };
  const cogVarietyWeight = subWeights.cognitiveVariety || subWeights.exerciseVariety || 0.15;

  const scoreCaps: ScoreCapsConfig = scoringRules.scoreCaps || {
    practiceUnder50Cap: 74,
    practiceUnder60Cap: 79,
    rigorUnder50Cap: 74,
    reasoningUnder50Cap: 79
  };

  if (articleTypeInfo.confidenceLevel === 'LOW' && articleTypeInfo.typeSource === 'inferred') {
    warnings.push('Article type could not be determined with high confidence.');
  }

  // Count exercises per layer
  const exercisesPerLayer = {
    inicio: 0,
    intermedio: 0,
    avanzado: 0,
    general: 0
  };

  parsed.exercises.forEach(ex => {
    if (ex.layerId in exercisesPerLayer) {
      exercisesPerLayer[ex.layerId]++;
    } else {
      exercisesPerLayer.general++;
    }
  });

  const totalExercises = parsed.exercises.length;

  // Layer presence status
  const layerStatus = {
    inicio: parsed.layers.some(l => l.id === 'inicio' && l.found),
    intermedio: parsed.layers.some(l => l.id === 'intermedio' && l.found),
    avanzado: parsed.layers.some(l => l.id === 'avanzado' && l.found)
  };

  const structurePass = layerStatus.inicio && layerStatus.intermedio && layerStatus.avanzado;

  if (!structurePass) {
    criticalFailures.push({
      ruleId: 'STRUCTURE_LAYERS_MISSING',
      critical: true,
      message: 'Falta al menos una de las capas obligatorias (Fundamentos, Profundización o Frontera).'
    });
  }

  // Quant Evaluation
  let quantityStatus: EvidenceState = 'PASS';
  let quantityMsg = 'Cantidad de ejercicios adecuada.';
  let quantityScore = 100;

  const minRec = typeRuleConfig.totalRecommended.min;
  const maxRec = typeRuleConfig.totalRecommended.max;

  if (totalExercises < minRec) {
    quantityStatus = 'INSUFFICIENT';
    quantityMsg = `Volumen total de ejercicios (${totalExercises}) es menor al recomendado (${minRec}–${maxRec}).`;
    warnings.push(quantityMsg);
    quantityScore = Math.max(20, Math.round((totalExercises / minRec) * 70));
  } else if (totalExercises > maxRec + 5) {
    quantityStatus = 'PARTIAL';
    quantityMsg = `Se encontraron ${totalExercises} ejercicios (exceso respecto a ${maxRec}).`;
    quantityScore = 80;
  }

  // Layer Distribution Eval
  let layerDistStatus: EvidenceState = 'PASS';
  let layerDistMsg = 'Distribución adecuada entre capas.';
  let layerDistScore = 100;

  const inCount = exercisesPerLayer.inicio;
  const intCount = exercisesPerLayer.intermedio;
  const avCount = exercisesPerLayer.avanzado;

  if (inCount === 0 || intCount === 0 || avCount === 0) {
    layerDistStatus = 'INSUFFICIENT';
    layerDistMsg = `Hay capas sin ejercicios (Inicio: ${inCount}, Intermedio: ${intCount}, Avanzado: ${avCount}).`;
    layerDistScore = 40;
  }

  // Difficulty Progression
  let diffProgScore = 100;
  let diffProgStatus: EvidenceState = 'PASS';
  let diffProgMsg = 'Progresión de dificultad adecuada.';

  if (inCount > 0 && avCount > 0 && exercisesPerLayer.general > totalExercises / 2) {
    diffProgStatus = 'PARTIAL';
    diffProgMsg = 'Gran parte de los ejercicios no están asignados a una capa específica.';
    diffProgScore = 70;
  }

  // Cognitive Variety
  const cognitiveSet = new Set<CognitiveLevel>();
  parsed.exercises.forEach(ex => {
    if (ex.detectedCognitiveLevels) {
      ex.detectedCognitiveLevels.forEach(cl => cognitiveSet.add(cl));
    }
  });

  const cognitiveLevelsDetected = Array.from(cognitiveSet);
  let cogVarScore = Math.min(100, Math.max(0, cognitiveLevelsDetected.length * 25));
  let cogVarStatus: EvidenceState = cognitiveLevelsDetected.length >= 3 ? 'PASS' : (cognitiveLevelsDetected.length <= 1 ? 'INSUFFICIENT' : 'PARTIAL');
  let cogVarMsg = `${cognitiveLevelsDetected.length} niveles cognitivos distintos identificados en la práctica.`;

  const totalPracticeScore = Math.min(100, Math.max(0, Math.round(
    quantityScore * subWeights.quantity +
    layerDistScore * subWeights.layerDistribution +
    diffProgScore * subWeights.difficultyProgression +
    cogVarScore * cogVarietyWeight +
    100 * subWeights.competencyCoverage
  )));

  const practiceEvaluation: PracticeEvaluation = {
    quantity: {
      actual: totalExercises,
      recommended: [minRec, maxRec],
      status: quantityStatus,
      message: quantityMsg,
      score: quantityScore
    },
    layerDistribution: {
      status: layerDistStatus,
      message: layerDistMsg,
      score: layerDistScore
    },
    difficultyProgression: {
      status: diffProgStatus,
      message: diffProgMsg,
      score: diffProgScore
    },
    cognitiveVariety: {
      status: cogVarStatus,
      cognitiveLevelsDetected,
      message: cogVarMsg,
      score: cogVarScore
    },
    competencyCoverage: {
      status: 'NOT_EVALUATED',
      reason: 'análisis semántico no implementado',
      score: 100
    },
    totalPracticeScore,
    confidence: 'MEDIUM',
    confidenceReason: 'Competency Coverage en NOT_EVALUATED'
  };

  // Interactive Analysis & Granular Breakdown
  const presence = parsed.interactives.length > 0;
  let highestInteractiveValue = 0;
  parsed.interactives.forEach(it => {
    if (it.interactiveValue.score > highestInteractiveValue) {
      highestInteractiveValue = it.interactiveValue.score;
    }
  });

  // Block type diversity (modern fenced blocks + legacy components)
  const typesDetected = Array.from(new Set(parsed.interactives.map(i => i.type)));
  const typeDiversityCount = typesDetected.length;

  let qualityScore = highestInteractiveValue;
  let interactiveMsg = presence ? 'Componente interactivo detectado y evaluado.' : 'No se detectaron componentes interactivos.';

  if (typeRuleConfig.type === 'simulation' && !presence) {
    warnings.push('El artículo de tipo simulation no contiene componentes interactivos.');
  }

  const interactiveStatus: EvidenceState = presence ? 'PASS' : (typeRuleConfig.interactiveRequirement === 'optional' ? 'PASS' : 'PARTIAL');

  const hasManipulation = presence && parsed.interactives.some(i => i.interactiveValue.criteria.manipulateVariables);
  const hasFeedback = presence && parsed.interactives.some(i => i.interactiveValue.criteria.immediateFeedback);
  const hasStateChange = presence && parsed.interactives.some(i => i.interactiveValue.criteria.observeDynamicChanges);

  const breakdown: InteractivityBreakdown = {
    overall: presence ? Math.min(100, Math.round(highestInteractiveValue * 20)) : 40,
    meaningfulCoverage: presence ? 90 : 50,
    activityDiversity: Math.min(100, cognitiveLevelsDetected.length * 25),
    diversityBonus: cognitiveLevelsDetected.length >= 4 ? 'EXCEPTIONAL_DIVERSITY' : undefined,
    interactionDepth: presence ? Math.min(100, Math.round(highestInteractiveValue * 18)) : 30,
    manipulation: hasManipulation ? 85 : 30,
    feedbackQuality: hasFeedback ? 90 : 40,
    stateChange: hasStateChange ? 85 : 20,
    explanation: presence 
      ? 'Las actividades integran componentes interactivos con feedback y manipulabilidad de variables evaluada.' 
      : 'El artículo presenta componentes estáticos con poca manipulación activa de variables o feedback dinámico.'
  };

  const interactiveAnalysis: InteractiveAnalysis = {
    potential: highestInteractiveValue,
    requirement: typeRuleConfig.interactiveRequirement,
    presence,
    relevance: presence ? 'PASS' : (typeRuleConfig.interactiveRequirement === 'optional' ? 'PASS' : 'INSUFFICIENT'),
    manipulation: presence,
    feedback: presence,
    exploration: presence,
    learningAlignment: presence ? 'PASS' : (typeRuleConfig.interactiveRequirement === 'optional' ? 'PASS' : 'INSUFFICIENT'),
    qualityScore,
    scoreCategory: Math.min(10, qualityScore * 2),
    status: interactiveStatus,
    message: interactiveMsg,
    breakdown,
    typesDetected,
    typeDiversityCount
  };

  // Reasoning Analysis
  const lowerBody = parsed.rawBody.toLowerCase();
  let reasoningContentScore = 50;
  const evidenceContent: string[] = [];

  if (lowerBody.includes('fermi') || lowerBody.includes('estimaci')) {
    reasoningContentScore += 25;
    evidenceContent.push('El texto explica técnicas de estimación de Fermi y descomposición de problemas');
  }
  if (lowerBody.includes('modelo') || lowerBody.includes('simplifica')) {
    reasoningContentScore += 25;
    evidenceContent.push('El texto explica la construcción y simplificación de modelos físicos');
  }

  reasoningContentScore = Math.min(100, reasoningContentScore);

  let reasoningPracticeScore = totalExercises >= 8 ? 100 : (totalExercises >= 3 ? 85 : (totalExercises === 0 ? 0 : 30));
  const evidencePractice: string[] = [];
  if (totalExercises >= 8) {
    evidencePractice.push(`${totalExercises} ejercicios de práctica con foco en razonamiento, estimación y análisis`);
  } else if (totalExercises >= 3) {
    evidencePractice.push(`${totalExercises} o más ejercicios de práctica detectados con foco en razonamiento/estimación`);
  }

  const reasoningWeightedScore = Number(((reasoningContentScore * 0.40 + reasoningPracticeScore * 0.60) * 0.15).toFixed(1));
  const reasoningStatus: EvidenceState = reasoningWeightedScore >= 10 ? 'PASS' : 'PARTIAL';

  const reasoningAnalysis: ReasoningAnalysis = {
    contentScore: reasoningContentScore,
    practiceScore: reasoningPracticeScore,
    weightedScore: reasoningWeightedScore,
    status: reasoningStatus,
    evidenceContent,
    evidencePractice,
    competenciesDetected: ['reasoning', 'application'],
    missingCompetencies: [],
    ruleExplanation: 'Artículos de metodología/razonamiento requieren que la práctica del alumno (60%) acompañe la explicación teórica (40%).'
  };

  // NEW: Visual Analysis
  const visualAnalysis = analyzeVisuals(parsed.visuals || [], parsed.rawBody, { h2: parsed.h2Headings, h3: parsed.h3Headings });

  // NEW: Discoverability Analysis
  const discoverabilityAnalysis = analyzeDiscoverability(
    parsed.rawFrontmatter,
    parsed.rawBody,
    parsed.h2Headings,
    parsed.h3Headings,
    parsed.category,
    parsed.subcategory
  );

  // NEW: Knowledge Benchmark Analysis
  const knowledgeBenchmarkResult = analyzeKnowledgeBenchmark(parsed, visualAnalysis);

  // NEW: Glossary Coverage Analysis (terms that enable the hover-dictionary feature)
  const glossaryCoverage = analyzeGlossaryCoverage(parsed.rawBody, parsed.subcategory === 'fisica' ? 'fisica' : parsed.subcategory || 'fisica');

  // NEW: Text Quality Analysis (repeated phrases + markdown shown as code)
  const textQuality = analyzeTextQuality(parsed.rawBodyUnique || parsed.rawBody);
  if (textQuality.repeatedPhrases.length > 0) {
    warnings.push(`Texto con ${textQuality.repeatedPhrases.length} frases repetidas innecesariamente.`);
  }
  if (textQuality.codeMarkdownIssues.length > 0) {
    warnings.push(`Se detectaron ${textQuality.codeMarkdownIssues.length} fragmentos de contenido markdown que se muestran como código sin procesar.`);
  }
  textQuality.repeatedPhrases.slice(0, 5).forEach(rp => {
    recommendations.push(`Elimina la frase repetida "${rp.phrase.slice(0, 60)}..." (aparece ${rp.count} veces).`);
  });
  textQuality.codeMarkdownIssues.slice(0, 5).forEach(ci => {
    recommendations.push(`Convierte a contenido renderizado el fragmento que aparece como código: "${ci.sample.slice(0, 60)}..."`);
  });

  // NEW: Content Depth Analysis
  const wordCount = parsed.rawBody.split(/\s+/).length;
  const contentDepthAnalysis: ContentDepthAnalysis = {
    coverageScore: Math.min(100, Math.max(0, Math.round((wordCount / 1200) * 100))),
    depthScore: Math.min(100, Math.max(0, Math.round((parsed.h2Headings.length / 4) * 100))),
    academicRigorScore: Math.min(100, parsed.mathFormulasCount > 0 ? 85 : 70),
    overallScore: Math.min(100, Math.max(0, Math.round((wordCount / 1200) * 50 + (parsed.h2Headings.length / 4) * 50))),
    conceptsDetected: parsed.tags,
    missingConcepts: [],
    redundantConcepts: [],
    shallowSections: [],
    wordCount,
    readabilityScore: 85
  };

  // NEW: Structure Analysis
  const structureAnalysis: StructureAnalysisResult = {
    articleStructureScore: structurePass ? 100 : 50,
    layerDistributionScore: layerDistScore,
    navigationScore: parsed.hasProgressHeader ? 100 : 70,
    overallScore: structurePass ? 100 : 60,
    headingHierarchyValid: discoverabilityAnalysis.technicalMetrics.headingHierarchyValid,
    layerBalanceMessage: layerDistMsg,
    poorSections: [],
    overlyLongSections: []
  };

  // NEW: Anektia Experience Result
  const anektiaBlocksCount = (parsed.rawBody.match(/<(?:PedagogicalContentBlock|Connect|HiddenAssumption|Transfer)/g) || []).length;
  const aeternaExperienceResult: AnektiaExperienceResult = {
    connectionsScore: parsed.rawBody.includes('Connect') ? 90 : 60,
    experienceScore: anektiaBlocksCount >= 3 ? 95 : 70,
    overallScore: anektiaBlocksCount >= 3 ? 92 : 65,
    pedagogicalBlocksCount: anektiaBlocksCount,
    meaningfulIntegrationScore: anektiaBlocksCount > 0 ? 90 : 50,
    reflectionMomentsCount: (parsed.rawBody.match(/<AnektiaDecisionBox/g) || []).length
  };

  // Category Scores calculation
  const rigorScore = Math.min(20, Math.max(0, Math.round((parsed.mathFormulasCount > 0 ? 15 : 12) + (parsed.h2Headings.length >= 3 ? 5 : 2))));
  const estructuraScore = structurePass ? 20 : 10;
  const practicaCategoryScore = Math.min(20, Math.max(0, Math.round(totalPracticeScore * 0.20)));

  // Interactivity: base score from highest interactive value + diversity bonus.
  // ≥3 distinct block types → bonus for a rich interactive palette.
  const diversityBonus = typeDiversityCount >= 5 ? 3 : typeDiversityCount >= 3 ? 2 : 0;
  const interactividadCategoryScore = presence
    ? Math.min(10, Math.round(highestInteractiveValue * 2) + diversityBonus)
    : 4;

  const hasConnect = parsed.rawBody.includes('Connect') || parsed.rawBody.includes('<Connect');
  const hasTransfer = parsed.rawBody.includes('Transfer') || parsed.rawBody.includes('<Transfer');
  const hasCrossDomain = /(termodinámic|química|biologí|electromagnet|cosmolog|astronom|ingenier)/i.test(parsed.rawBody);
  const conexionesScore = (hasConnect && hasTransfer) ? 10 : (hasConnect || hasTransfer) ? 9 : (hasCrossDomain ? 8 : 6);

  // Anektia experience: pedagogical blocks + cuaderno + planned images.
  // imagesSuggested may come from the structured auditor (JSON). If 0/undefined,
  // derive from [IMAGEN SUGERIDA] markers OR real markdown images (![..](url)).
  const suggestedMarkers = (parsed.rawBody.match(/\[IMAGEN SUGERIDA:/g) || []).length;
  const markdownImages = (parsed.rawBody.match(/!\[[^\]]*\]\(/g) || []).length;
  const imagesSuggestedCount = (parsed.imagesSuggested && parsed.imagesSuggested > 0)
    ? parsed.imagesSuggested
    : (suggestedMarkers + markdownImages);
  const cuadernoBonus = parsed.hasCuaderno ? 1 : 0;
  const imagesBonus = imagesSuggestedCount >= 3 ? 1 : 0;
  const glossaryBonus = glossaryCoverage.glossaryHasTerms && glossaryCoverage.coverageScore >= 20 ? 1 : 0;
  const experienciaScore = Math.min(5, (anektiaBlocksCount >= 3 ? 3 : 2) + cuadernoBonus + imagesBonus + glossaryBonus);

  // Text quality penalty: mala calidad de texto no puede aspirar a nota alta.
  let textQualityPenalty = 0;
  if (textQuality.status === 'FAIL') {
    textQualityPenalty = textQuality.overallScore < 50 ? 8 : 5;
  } else if (textQuality.status === 'PARTIAL') {
    textQualityPenalty = 3;
  }

  let uncappedTotalScore = Math.min(100, Math.max(0, Math.round(
    rigorScore + 
    estructuraScore + 
    practicaCategoryScore + 
    reasoningAnalysis.weightedScore + 
    interactividadCategoryScore + 
    conexionesScore + 
    experienciaScore -
    textQualityPenalty
  )));

  // Populate Evidence Traces
  evidenceTraces.push({
    dimension: 'Practica',
    score: practicaCategoryScore,
    maxScore: 20,
    evidence: [`Puntuación de práctica calibrada: ${totalPracticeScore}/100`],
    rule: 'Practica Sub-Score se calcula por volumen, distribución y variedad cognitiva'
  });
  evidenceTraces.push({
    dimension: 'Razonamiento',
    score: Math.round(reasoningAnalysis.weightedScore),
    maxScore: 15,
    evidence: evidenceContent.concat(evidencePractice),
    rule: 'Razonamiento exige 40% explicación teórica y 60% práctica del estudiante'
  });

  // Score Caps
  let appliedScoreCap: { cap: number; reason: string } | undefined = undefined;

  if (totalPracticeScore < 50 && quantityStatus === 'INSUFFICIENT') {
    appliedScoreCap = {
      cap: scoreCaps.practiceUnder50Cap,
      reason: `Practice Sub-Score (${totalPracticeScore}/100) es INSUFFICIENT (< 50%). Capped a máximo ${scoreCaps.practiceUnder50Cap}.`
    };
  } else if (rigorScore < 10) {
    appliedScoreCap = {
      cap: scoreCaps.rigorUnder50Cap,
      reason: `Rigor Académico (${rigorScore}/20) es INSUFFICIENT (< 50%). Capped a máximo ${scoreCaps.rigorUnder50Cap}.`
    };
  }

  const competencyAnalysis = analyzeCompetencies(parsed, articleTypeInfo.detectedType);
  const learningExperienceAudit = auditLearningExperiences(parsed, articleTypeInfo.detectedType, competencyAnalysis);
  const recommendedActivityPlan = generateRecommendedActivityPlan(learningExperienceAudit, interactiveAnalysis);

  // NEW: Cross Dimension Interventions
  const crossDimensionInterventions = evaluateCrossDimensionInterventions(
    parsed,
    practiceEvaluation,
    reasoningAnalysis,
    visualAnalysis,
    discoverabilityAnalysis,
    learningExperienceAudit,
    knowledgeBenchmarkResult
  );

  competencyAnalysis.gapRecommendations.forEach(rec => {
    if (!recommendations.includes(rec)) {
      recommendations.push(rec);
    }
  });

  // Glossary coverage recommendation: ensure terms exist for the hover-dictionary
  if (glossaryCoverage.glossaryHasTerms && glossaryCoverage.coverageScore < 20) {
    const sample = glossaryCoverage.recommendedTerms.slice(0, 5).map(t => `"${t.term}"`).join(', ');
    recommendations.push(
      `Add glossary terms to enable the hover dictionary: the article covers only ${glossaryCoverage.termsCovered}/${glossaryCoverage.totalTerms} glossary terms. Consider incorporating ${sample || 'more technical terminology'}.`
    );
  }

  if (learningExperienceAudit.coreGapsCount >= 3 && uncappedTotalScore > 74) {
    appliedScoreCap = {
      cap: 74,
      reason: `${learningExperienceAudit.coreGapsCount} experiencias CORE ausentes. Capped a máximo 74.`
    };
  } else if (learningExperienceAudit.coreGapsCount === 2 && uncappedTotalScore > 79) {
    appliedScoreCap = {
      cap: 79,
      reason: `2 experiencias CORE ausentes. Capped a máximo 79.`
    };
  } else if (learningExperienceAudit.coreGapsCount === 1 && uncappedTotalScore > 84) {
    appliedScoreCap = {
      cap: 84,
      reason: `1 experiencia CORE ausente. Capped a máximo 84.`
    };
  }

  const recalculatedTotalScore = appliedScoreCap ? Math.min(uncappedTotalScore, appliedScoreCap.cap) : uncappedTotalScore;

  // Status EXCELENTE Gating
  const isExcellentEligible = 
    recalculatedTotalScore >= 90 &&
    totalPracticeScore >= 75 &&
    reasoningAnalysis.weightedScore >= 11 &&
    learningExperienceAudit.experienceCompletenessPercentage >= 80 &&
    learningExperienceAudit.coreGapsCount === 0 &&
    textQuality.status === 'PASS' &&
    !appliedScoreCap;

  let status: AuditStatus = 'NO_APROBADO';
  if (isExcellentEligible) {
    status = 'EXCELENTE';
  } else if (recalculatedTotalScore >= 80) {
    status = 'BUENO';
  } else if (recalculatedTotalScore >= 70) {
    status = 'NECESITA_REVISION';
  } else if (recalculatedTotalScore >= 60) {
    status = 'DEBIL';
  } else {
    status = 'NO_APROBADO';
  }

  const qualityGatesPassed = criticalFailures.length === 0;
  if (!qualityGatesPassed && (status === 'EXCELENTE' || status === 'BUENO')) {
    status = 'NECESITA_REVISION';
    warnings.push('El artículo no puede aprobar con calificación alta debido a Quality Gates no superados.');
  }

  return {
    timestamp: new Date().toISOString(),
    filePath: parsed.filePath,
    articleTitle: parsed.title,
    profile: profile.name,
    discipline: parsed.subcategory || parsed.category || 'General',
    articleTypeInfo,
    typeRuleConfig,
    structurePass,
    layerStatus,

    contentDepthAnalysis,
    structureAnalysis,
    practiceEvaluation,
    interactiveAnalysis,
    reasoningAnalysis,
    visualAnalysis,
    discoverabilityAnalysis,
    aeternaExperienceResult,
    knowledgeBenchmarkResult,
    glossaryCoverage,
    textQuality,

    evidenceTraces,
    competencyAnalysis,
    learningExperienceAudit,
    recommendedActivityPlan,
    crossDimensionInterventions,

    exercisesPerLayer,
    totalExercises,
    interactiveDetected: presence,
    interactiveDetails: parsed.interactives,
    interactiveValueScore: highestInteractiveValue,
    interactiveRecommendation: interactiveMsg,
    interactiveRequirement: typeRuleConfig.interactiveRequirement,
    
    scores: {
      rigorAcademico: rigorScore,
      estructuraPedagogica: estructuraScore,
      practica: practicaCategoryScore,
      razonamiento: reasoningAnalysis.weightedScore,
      interactividad: interactividadCategoryScore,
      conexiones: conexionesScore,
      experienciaAnektia: experienciaScore,

      contentCoverageScore: contentDepthAnalysis.coverageScore,
      contentDepthScore: contentDepthAnalysis.depthScore,
      articleStructureScore: structureAnalysis.articleStructureScore,
      layerDistributionScore: structureAnalysis.layerDistributionScore,
      navigationScore: structureAnalysis.navigationScore,
      coreExperiencesScore: learningExperienceAudit ? learningExperienceAudit.experienceCompletenessPercentage : 100,
      cognitiveVarietyScore: cogVarScore,
      interactiveQualityScore: Math.min(100, interactiveAnalysis.qualityScore * 20),
      meaningfulCoverageScore: interactiveAnalysis.presence ? 90 : 50,
      activityDiversityScore: Math.min(100, cognitiveLevelsDetected.length * 25),
      visualCoverageScore: visualAnalysis.visualCoverageScore,
      pedagogicalVisualsScore: visualAnalysis.pedagogicalVisualsScore,
      imageAccessibilityScore: visualAnalysis.imageAccessibilityScore,
      technicalSeoScore: discoverabilityAnalysis.technicalSeoScore,
      semanticCoverageScore: discoverabilityAnalysis.semanticCoverageScore,
      searchIntentScore: discoverabilityAnalysis.searchIntentScore,
      knowledgeCoverageScore: knowledgeBenchmarkResult.coreConceptCoverageScore,
      referenceAlignmentScore: knowledgeBenchmarkResult.referenceAlignmentScore,
      textQualityScore: textQuality.overallScore,
      repetitionScore: textQuality.repetitionScore,
      codeMarkdownScore: textQuality.codeMarkdownScore
    },
    totalScore: Math.min(100, Math.max(0, recalculatedTotalScore)),
    appliedScoreCap,
    status,
    qualityGatesPassed,
    criticalFailures,
    warnings,
    recommendations
  };
}
