import { 
  ConceptCoverageDetail,
  ConceptDetectionMode,
  ConfidenceLevel, 
  KnowledgeBenchmarkResult, 
  KnowledgeGap, 
  ParsedArticleStructure, 
  SequencingIssue, 
  SourceTransparencyItem,
  VisualAnalysisResult
} from '../types';
import { identifyTopic } from './topic-identifier';
import { LocalReferenceProvider } from '../providers/reference-provider';
import { buildKnowledgeModel } from '../experiences/knowledge-model-builder';
import { getCachedKnowledgeModel, setCachedKnowledgeModel } from '../experiences/benchmark-cache';

export function analyzeKnowledgeBenchmark(
  parsed: ParsedArticleStructure,
  visualAnalysis?: VisualAnalysisResult
): KnowledgeBenchmarkResult {
  const topicProfile = identifyTopic(parsed);
  const cacheKey = parsed.slug || topicProfile.topic.toLowerCase().replace(/\s+/g, '-');

  let model = getCachedKnowledgeModel(cacheKey);
  if (!model) {
    const provider = new LocalReferenceProvider();
    const sources = provider.getReferences(topicProfile);
    model = buildKnowledgeModel(topicProfile, sources);
    setCachedKnowledgeModel(cacheKey, model);
  }

  const rawBodyLower = parsed.rawBody.toLowerCase();

  const gaps: KnowledgeGap[] = [];
  const conceptDetails: ConceptCoverageDetail[] = [];
  const sequencingIssues: SequencingIssue[] = [];
  let coreCoveredCount = 0;
  let coreTotalCount = 0;
  let importantCoveredCount = 0;
  let importantTotalCount = 0;

  // 1. INTELLIGENT SEMANTIC CONCEPT COVERAGE & TERMINOLOGY
  const inScopeConcepts = model.concepts.filter(c => c.scope !== 'OUT_OF_SCOPE');

  inScopeConcepts.forEach(concept => {
    const conceptNameLower = concept.name.toLowerCase();
    const isExplicitlyNamed = rawBodyLower.includes(conceptNameLower);
    
    // Check semantic phrases
    const semanticMatches = (concept.semanticPhrases || []).filter(phrase => rawBodyLower.includes(phrase.toLowerCase()));
    const keyAspectMatches = concept.keyAspects.filter(aspect => rawBodyLower.includes(aspect.toLowerCase()));
    
    let detectionMode: ConceptDetectionMode = 'MISSING';
    let status: 'PASS' | 'PARTIAL' | 'MISSING' = 'MISSING';
    let explicitTerminology: 'PASS' | 'PARTIAL' | 'MISSING' = 'MISSING';

    if (isExplicitlyNamed) {
      detectionMode = 'EXPLICIT';
      status = 'PASS';
      explicitTerminology = 'PASS';
    } else if (semanticMatches.length >= 2 || (semanticMatches.length >= 1 && keyAspectMatches.length >= 1)) {
      detectionMode = 'SEMANTIC';
      status = 'PASS';
      explicitTerminology = 'PARTIAL';
    } else if (semanticMatches.length === 1 || keyAspectMatches.length >= 1) {
      detectionMode = 'IMPLICIT';
      status = 'PARTIAL';
      explicitTerminology = 'PARTIAL';
    } else {
      detectionMode = 'MISSING';
      status = 'MISSING';
      explicitTerminology = 'MISSING';
    }

    if (concept.importance === 'CORE') coreTotalCount++;
    if (concept.importance === 'IMPORTANT') importantTotalCount++;

    if (status === 'PASS') {
      if (concept.importance === 'CORE') coreCoveredCount++;
      if (concept.importance === 'IMPORTANT') importantCoveredCount++;
    } else if (status === 'PARTIAL') {
      if (concept.importance === 'CORE') coreCoveredCount += 0.5;
      if (concept.importance === 'IMPORTANT') importantCoveredCount += 0.5;
    }

    conceptDetails.push({
      concept: concept.name,
      importance: concept.importance,
      status,
      detectionMode,
      explicitTerminology,
      confidence: topicProfile.confidence
    });

    if (status === 'MISSING' && (concept.importance === 'CORE' || concept.importance === 'IMPORTANT')) {
      gaps.push({
        concept: concept.name,
        importance: concept.importance,
        scope: concept.scope,
        status: 'MISSING',
        reason: `El concepto fundamental "${concept.name}" no fue detectado explícita ni semánticamente en el artículo.`,
        evidenceFromReferences: [`Presente en las fuentes de autoridad para este tema y nivel.`],
        suggestedIntervention: `Incorporar una sección dedicada a ${concept.name}.`
      });
    } else if (detectionMode === 'SEMANTIC' && explicitTerminology === 'PARTIAL') {
      // Do NOT create a missing gap! Just note an opportunity for explicit label in report
    }
  });

  // 2. KNOWLEDGE SEQUENCING ANALYSIS
  if (model.conceptDependencies && model.conceptDependencies.length > 0) {
    model.conceptDependencies.forEach(dep => {
      const conceptIndex = rawBodyLower.indexOf(dep.concept.toLowerCase());
      const prereqIndex = rawBodyLower.indexOf(dep.prerequisite.toLowerCase());

      if (conceptIndex !== -1 && prereqIndex !== -1 && conceptIndex < prereqIndex) {
        sequencingIssues.push({
          concept: dep.concept,
          prerequisite: dep.prerequisite,
          message: `El concepto "${dep.concept}" aparece antes de su prerrequisito conceptual "${dep.prerequisite}".`,
          severity: 'WARNING'
        });
      }
    });
  }

  const coreConceptCoverageScore = coreTotalCount > 0 ? Math.min(100, Math.round((coreCoveredCount / coreTotalCount) * 100)) : 100;
  const importantRelationshipCoverageScore = model.relationships.length > 0 ? 85 : 100;

  // 3. REPRESENTATION BENCHMARK
  let reprCovered = 0;
  model.representations.forEach(repr => {
    if (repr.expectedType === 'formula' && parsed.mathFormulasCount > 0) reprCovered++;
    else if (repr.expectedType === 'graph' && visualAnalysis && visualAnalysis.categoriesDetected.DATA_VISUALIZATION > 0) reprCovered++;
    else if (repr.expectedType === 'diagram' && visualAnalysis && (visualAnalysis.categoriesDetected.PROCESS > 0 || visualAnalysis.categoriesDetected.CONCEPTUAL > 0)) reprCovered++;
    else if (repr.expectedType === 'table' && rawBodyLower.includes('<table') || rawBodyLower.includes('|')) reprCovered++;
    else if (repr.expectedType === 'example' && rawBodyLower.includes('ejemplo')) reprCovered++;
    else {
      if (repr.importance === 'CORE' || repr.importance === 'IMPORTANT') {
        gaps.push({
          concept: repr.concept,
          importance: repr.importance,
          scope: 'IN_SCOPE',
          status: 'MISSING',
          reason: `Falta representación en formato ${repr.expectedType} para el concepto ${repr.concept}.`,
          evidenceFromReferences: [`Fuentes de referencia de Tier 1 emplean representación ${repr.expectedType}.`],
          suggestedIntervention: repr.expectedType === 'graph' ? 'Añadir GraphLab o gráfico de datos.' : `Añadir ${repr.expectedType} explicativo.`
        });
      }
    }
  });

  const representationCoverageScore = model.representations.length > 0 ? Math.min(100, Math.round((reprCovered / model.representations.length) * 100)) : 80;

  // 4. MISCONCEPTION BENCHMARK
  let misconceptionsCovered = 0;
  model.misconceptions.forEach(m => {
    const isAddressed = rawBodyLower.includes('error') || rawBodyLower.includes('confus') || rawBodyLower.includes('equivoc') || rawBodyLower.includes('<pedagogicalcontentblock type="misconception"') || parsed.exercises.some(e => e.type === 'ErrorHunter');
    if (isAddressed) {
      misconceptionsCovered++;
    } else if (m.importance === 'CORE' || m.importance === 'IMPORTANT') {
      gaps.push({
        concept: m.title,
        importance: m.importance,
        scope: 'IN_SCOPE',
        status: 'MISSING',
        reason: `El error común "${m.title}" no se aborda en el texto ni en la práctica.`,
        evidenceFromReferences: [m.erroneousIdea],
        suggestedIntervention: 'Añadir bloque de Error Común (<PedagogicalContentBlock type="misconception">) o actividad ErrorHunter.'
      });
    }
  });

  const misconceptionCoverageScore = model.misconceptions.length > 0 ? Math.min(100, Math.round((misconceptionsCovered / model.misconceptions.length) * 100)) : 70;
  const applicationCoverageScore = model.applications.some(app => rawBodyLower.includes(app.toLowerCase())) ? 90 : 70;
  const prerequisiteCoverageScore = model.prerequisites.some(pr => rawBodyLower.includes(pr.toLowerCase())) ? 95 : 80;

  // 5. AETERNA ADDED VALUE EVALUATION
  const addedValueReasons: string[] = [];
  let interactiveScoreBonus = 0;

  if (parsed.interactives.length > 0) {
    interactiveScoreBonus += 20;
    addedValueReasons.push(`Aeterna proporciona ${parsed.interactives.length} componentes interactivos manipulables no disponibles en textos de referencia planos.`);
  }

  if (parsed.exercises.some(e => e.type === 'AeternaDecisionBox' || e.type === 'PredictionBox' || e.type === 'ParameterLab' || e.type === 'ErrorHunter')) {
    interactiveScoreBonus += 20;
    addedValueReasons.push('Aeterna exige predicción activa, toma de decisiones y análisis de errores en lugar de lectura pasiva.');
  }

  if (rawBodyLower.includes('<pedagogicalcontentblock') || rawBodyLower.includes('<connect') || rawBodyLower.includes('<transfer')) {
    interactiveScoreBonus += 15;
    addedValueReasons.push('Aeterna integra bloques pedagógicos explícitos para conectar contenidos y provocar momentos de reflexión.');
  }

  let aeternaAddedValue: 'HIGH' | 'MODERATE' | 'STANDARD' = 'STANDARD';
  if (interactiveScoreBonus >= 30) aeternaAddedValue = 'HIGH';
  else if (interactiveScoreBonus >= 15) aeternaAddedValue = 'MODERATE';

  // 6. SOURCE TRANSPARENCY
  const sourceTransparency: SourceTransparencyItem[] = model.sources.map(s => ({
    sourceName: s.name,
    tier: s.tier,
    authority: s.authorityScore,
    supportsAspect: s.supports.join(', '),
    confidence: s.confidence
  }));

  // 7. CONTRADICTIONS DETECTION
  const contradictionsDetected: string[] = [];
  if (rawBodyLower.includes('velocidad es escalar') && !rawBodyLower.includes('rapidez')) {
    contradictionsDetected.push('Inconsistencia detectada: la velocidad se menciona como escalar sin diferenciarla de la rapidez.');
  }

  const academicCorrectnessScore = contradictionsDetected.length === 0 ? 100 : 75;
  const referenceAlignmentScore = Math.min(100, Math.round((coreConceptCoverageScore * 0.4) + (representationCoverageScore * 0.3) + (misconceptionCoverageScore * 0.3)));

  // Diagnostic mode flag
  const isDiagnosticOnly = true;

  return {
    topicProfile,
    referenceConfidence: topicProfile.confidence,
    sourcesCount: model.sources.length,
    sourceQualityScore: Math.min(100, Math.round(model.sources.reduce((acc, s) => acc + s.authorityScore, 0) / model.sources.length)),
    coreConceptCoverageScore,
    importantRelationshipCoverageScore,
    representationCoverageScore,
    applicationCoverageScore,
    misconceptionCoverageScore,
    prerequisiteCoverageScore,
    referenceAlignmentScore,
    academicCorrectnessScore,
    aeternaAddedValue,
    addedValueReasons,
    conceptDetails,
    gaps,
    sequencingIssues,
    sourceTransparency,
    contradictionsDetected,
    isDiagnosticOnly
  };
}
