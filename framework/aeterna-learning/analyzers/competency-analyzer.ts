import { ALL_COMPETENCIES, ArticlePurpose, CompetencyAnalysisResult, CompetencyDetection, CompetencyGapType, CompetencyMatrixRow, CompetencyStatus, EvidenceStrength, ExerciseCompetencyMapping, TaxonomyCompetency } from '../competencies/taxonomy';
import { computeFinalApplicability } from '../competencies/profiles';
import { ArticleType, ConfidenceLevel, ExtractedExercise, ParsedArticleStructure } from '../types';

export function detectArticlePurpose(parsed: ParsedArticleStructure): ArticlePurpose {
  const title = parsed.title.toLowerCase();
  const body = parsed.rawBody.toLowerCase();

  const focusAreas: string[] = [];
  const secondaryIntents: string[] = [];

  if (title.includes('cómo piensa') || title.includes('metodología') || title.includes('metodo')) {
    focusAreas.push('methodology', 'physical reasoning');
  }
  if (body.includes('fermi') || body.includes('estimación')) {
    focusAreas.push('estimation', 'fermi');
    secondaryIntents.push('Estimación de Fermi y orden de magnitud');
  }
  if (body.includes('modelo') || body.includes('simplificación')) {
    focusAreas.push('model', 'simplification');
    secondaryIntents.push('Construcción y simplificación de modelos físicos');
  }
  if (body.includes('incertidumbre') || body.includes('error') || body.includes('medición')) {
    focusAreas.push('uncertainty', 'measurement');
    secondaryIntents.push('Incertidumbre y análisis de medición');
  }

  const primaryIntent = focusAreas.includes('methodology')
    ? 'Pensamiento físico y metodología científica'
    : 'Desarrollo de conceptos fundamentales';

  return {
    primaryIntent,
    secondaryIntents,
    focusAreas
  };
}

export function mapExerciseToCompetencies(ex: ExtractedExercise): ExerciseCompetencyMapping {
  const fullText = `${ex.title || ''} ${ex.questionText || ''}`.toLowerCase();
  const secondaryMap = new Map<TaxonomyCompetency, { strength: EvidenceStrength; reason: string }>();

  let primaryCompetency: TaxonomyCompetency = 'EXPLAIN';
  let primaryStrength: EvidenceStrength = 'MODERATE';

  // Primary competency detection based on Component Type or Keywords
  if (ex.type === 'PredictionBox') {
    primaryCompetency = 'PREDICT';
    primaryStrength = 'STRONG';
    secondaryMap.set('EXPLAIN', { strength: 'MODERATE', reason: 'Explicación del fenómeno predicho' });
    secondaryMap.set('INTERPRET', { strength: 'MODERATE', reason: 'Interpretación de la consecuencia observada' });
  } else if (ex.type === 'ParameterLab') {
    primaryCompetency = 'MODEL';
    primaryStrength = 'STRONG';
    secondaryMap.set('PREDICT', { strength: 'MODERATE', reason: 'Predicción de comportamiento ante cambio de variables' });
    secondaryMap.set('INTERPRET', { strength: 'MODERATE', reason: 'Interpretación de valores manipulados' });
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis de dependencias funcionales' });
  } else if (ex.type === 'GraphLab') {
    primaryCompetency = 'INTERPRET';
    primaryStrength = 'STRONG';
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis de la tendencia y pendiente de la gráfica' });
    secondaryMap.set('COMPARE', { strength: 'MODERATE', reason: 'Comparación de intervalos o curvas' });
    secondaryMap.set('PREDICT', { strength: 'WEAK', reason: 'Predicción de comportamiento futuro' });
  } else if (ex.type === 'ErrorHunter') {
    primaryCompetency = 'ERROR_ANALYSIS';
    primaryStrength = 'STRONG';
    secondaryMap.set('EVALUATE', { strength: 'MODERATE', reason: 'Evaluación de plausibilidad del razonamiento' });
    secondaryMap.set('JUSTIFY', { strength: 'MODERATE', reason: 'Justificación del motivo del error' });
    secondaryMap.set('EXPLAIN', { strength: 'MODERATE', reason: 'Explicación de la corrección' });
  } else if (ex.type === 'ModelBuilder') {
    primaryCompetency = 'MODEL';
    primaryStrength = 'STRONG';
    secondaryMap.set('JUSTIFY', { strength: 'MODERATE', reason: 'Justificación de simplificaciones e hipótesis' });
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Descomposición de factores relevantes' });
    secondaryMap.set('APPLY', { strength: 'MODERATE', reason: 'Aplicación del modelo simplificado' });
    secondaryMap.set('TRANSFER', { strength: 'WEAK', reason: 'Transferencia a situaciones modelo nuevas' });
  } else if (ex.type === 'ConceptMap') {
    primaryCompetency = 'UNDERSTAND';
    primaryStrength = 'STRONG';
    secondaryMap.set('COMPARE', { strength: 'MODERATE', reason: 'Comparación y clasificación de nodos' });
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis de la estructura del conocimiento' });
    secondaryMap.set('EXPLAIN', { strength: 'MODERATE', reason: 'Explicación de relaciones entre conceptos' });
  } else if (ex.type === 'ArgumentBuilder') {
    primaryCompetency = 'JUSTIFY';
    primaryStrength = 'STRONG';
    secondaryMap.set('EXPLAIN', { strength: 'MODERATE', reason: 'Explicación de premisas y conclusión' });
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis de la validez deductiva/inductiva' });
    secondaryMap.set('EVALUATE', { strength: 'MODERATE', reason: 'Evaluación del argumento resultante' });
  } else if (ex.type === 'CausalMap') {
    primaryCompetency = 'ANALYZE';
    primaryStrength = 'STRONG';
    secondaryMap.set('MODEL', { strength: 'MODERATE', reason: 'Modelización de redes causa-efecto' });
    secondaryMap.set('EXPLAIN', { strength: 'MODERATE', reason: 'Explicación de mecanismos de causación' });
    secondaryMap.set('INTERPRET', { strength: 'MODERATE', reason: 'Interpretación de consecuencias' });
  } else if (ex.type === 'EvidenceMatcher') {
    primaryCompetency = 'JUSTIFY';
    primaryStrength = 'STRONG';
    secondaryMap.set('EVALUATE', { strength: 'MODERATE', reason: 'Evaluación del respaldo empírico/textual' });
    secondaryMap.set('INTERPRET', { strength: 'MODERATE', reason: 'Interpretación de pruebas e hipótesis' });
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis de correspondencia entre datos y afirmaciones' });
  } else if (ex.type === 'Counterexample') {
    primaryCompetency = 'EVALUATE';
    primaryStrength = 'STRONG';
    secondaryMap.set('TRANSFER', { strength: 'STRONG', reason: 'Búsqueda de casos límite en dominios o contextos nuevos' });
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis de condiciones de validez' });
    secondaryMap.set('JUSTIFY', { strength: 'MODERATE', reason: 'Justificación del motivo del contraejemplo' });
  } else if (ex.type === 'ArgumentEvaluation') {
    primaryCompetency = 'EVALUATE';
    primaryStrength = 'STRONG';
    secondaryMap.set('JUSTIFY', { strength: 'MODERATE', reason: 'Justificación del fallo o solidez del argumento' });
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis de la coherencia de premisas' });
    secondaryMap.set('EXPLAIN', { strength: 'MODERATE', reason: 'Explicación de la falacia o virtud argumentativa' });
  } else if (ex.type === 'SequenceBuilder') {
    primaryCompetency = 'APPLY';
    primaryStrength = 'STRONG';
    secondaryMap.set('ANALYZE', { strength: 'MODERATE', reason: 'Análisis del orden procedimental' });
    secondaryMap.set('UNDERSTAND', { strength: 'MODERATE', reason: 'Comprensión de etapas del proceso' });
  } else if (fullText.includes('justifique') || fullText.includes('por qué') || fullText.includes('razone')) {
    primaryCompetency = 'JUSTIFY';
    primaryStrength = 'STRONG';
  } else if (fullText.includes('estime') || fullText.includes('fermi') || fullText.includes('orden de magnitud')) {
    primaryCompetency = 'ESTIMATE';
    primaryStrength = 'STRONG';
  } else if (fullText.includes('modelo') || fullText.includes('hipótesis') || fullText.includes('simplificar')) {
    primaryCompetency = 'MODEL';
    primaryStrength = 'STRONG';
  } else if (fullText.includes('calcule') || fullText.includes('convierta')) {
    primaryCompetency = 'CALCULATE';
    primaryStrength = 'STRONG';
  } else if (fullText.includes('diferencia entre') || fullText.includes('compare')) {
    primaryCompetency = 'COMPARE';
    primaryStrength = 'STRONG';
  } else if (fullText.includes('aplicar a un contexto nuevo') || fullText.includes('vida real')) {
    primaryCompetency = 'TRANSFER';
    primaryStrength = 'STRONG';
  }

  // Secondary & Implied competencies
  const meta = ALL_COMPETENCIES[primaryCompetency];
  if (meta.impliedCompetencies) {
    meta.impliedCompetencies.forEach(imp => {
      secondaryMap.set(imp.competency, {
        strength: 'MODERATE',
        reason: `Implícita por la actividad principal de ${meta.name}`
      });
    });
  }

  // Check additional keyword matches in exercise text for secondary support
  Object.values(ALL_COMPETENCIES).forEach(cMeta => {
    if (cMeta.key !== primaryCompetency && !secondaryMap.has(cMeta.key)) {
      const match = cMeta.keywords.some(kw => fullText.includes(kw));
      if (match) {
        secondaryMap.set(cMeta.key, {
          strength: 'MODERATE',
          reason: `Evidencia directa en el texto del ejercicio: "${cMeta.name}"`
        });
      }
    }
  });

  const secondaryCompetencies = Array.from(secondaryMap.entries()).map(([competency, val]) => ({
    competency,
    strength: val.strength,
    reason: val.reason
  }));

  return {
    exerciseId: ex.id,
    exerciseTitle: ex.title || ex.questionText,
    primaryCompetency,
    secondaryCompetencies,
    evidenceStrength: primaryStrength
  };
}

export function analyzeCompetencies(
  parsed: ParsedArticleStructure,
  articleType: ArticleType
): CompetencyAnalysisResult {
  const detectedCompetencies: CompetencyDetection[] = [];
  const matrix: CompetencyMatrixRow[] = [];
  const criticalGaps: string[] = [];
  const warningGaps: string[] = [];
  const gapRecommendations: string[] = [];

  const purpose = detectArticlePurpose(parsed);
  const exerciseMappings = parsed.exercises.map(ex => mapExerciseToCompetencies(ex));
  const lowerBody = parsed.rawBody.toLowerCase();

  // Helper to extract evidence snippet around a keyword
  function findSnippet(text: string, kw: string): string {
    const idx = text.indexOf(kw);
    if (idx === -1) return '';
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + kw.length + 40);
    return '...' + text.substring(start, end).replace(/\n/g, ' ').trim() + '...';
  }

  // 1. TEACHING (CONTENT) EVALUATION
  const teachingMap = new Map<TaxonomyCompetency, { status: CompetencyStatus; confidence: ConfidenceLevel; evidence: string[] }>();

  Object.values(ALL_COMPETENCIES).forEach(meta => {
    let matchesCount = 0;
    const snippets: string[] = [];

    meta.keywords.forEach(kw => {
      if (lowerBody.includes(kw)) {
        matchesCount++;
        const snip = findSnippet(lowerBody, kw);
        if (snip && !snippets.includes(snip)) {
          snippets.push(snip);
        }
      }
    });

    let status: CompetencyStatus = 'UNKNOWN';
    let confidence: ConfidenceLevel = 'LOW';

    if (matchesCount >= 3) {
      status = 'PASS';
      confidence = 'HIGH';
    } else if (matchesCount >= 1) {
      status = 'PASS';
      confidence = 'MEDIUM';
    } else {
      status = 'UNKNOWN';
      confidence = 'LOW';
    }

    teachingMap.set(meta.key, { status, confidence, evidence: snippets });

    if (status === 'PASS') {
      detectedCompetencies.push({
        competency: meta.key,
        source: 'content',
        confidence: confidence === 'HIGH' ? 0.90 : 0.75,
        evidence: snippets[0] || `Evidencia de enseñanza de ${meta.name} en el texto.`
      });
    }
  });

  // 2. PRACTICE COVERAGE AGGREGATION ACROSS ALL EXERCISES
  const practiceMap = new Map<TaxonomyCompetency, { 
    status: CompetencyStatus; 
    strength: EvidenceStrength; 
    confidence: ConfidenceLevel; 
    supportingExercises: string[];
    explanation?: string;
  }>();

  Object.values(ALL_COMPETENCIES).forEach(meta => {
    const supporting: string[] = [];
    let hasStrong = false;
    let hasModerate = false;
    let hasWeak = false;

    exerciseMappings.forEach(mapping => {
      if (mapping.primaryCompetency === meta.key) {
        supporting.push(`[${mapping.exerciseId}] ${mapping.exerciseTitle} (Primary: ${mapping.evidenceStrength})`);
        if (mapping.evidenceStrength === 'STRONG') hasStrong = true;
        if (mapping.evidenceStrength === 'MODERATE') hasModerate = true;
        if (mapping.evidenceStrength === 'WEAK') hasWeak = true;
      } else {
        const sec = mapping.secondaryCompetencies.find(s => s.competency === meta.key);
        if (sec) {
          supporting.push(`[${mapping.exerciseId}] ${mapping.exerciseTitle} (Secondary: ${sec.strength})`);
          if (sec.strength === 'STRONG') hasStrong = true;
          if (sec.strength === 'MODERATE') hasModerate = true;
          if (sec.strength === 'WEAK') hasWeak = true;
        }
      }
    });

    let status: CompetencyStatus = 'UNKNOWN';
    let strength: EvidenceStrength = 'NONE';
    let confidence: ConfidenceLevel = 'LOW';
    let explanation: string | undefined = undefined;

    if (hasStrong) {
      status = 'PASS';
      strength = 'STRONG';
      confidence = 'HIGH';
      explanation = `Cubierta de forma principal y explícita por ejercicios prácticos.`;
    } else if (hasModerate) {
      status = 'PASS';
      strength = 'MODERATE';
      confidence = 'HIGH';
      explanation = `Cubierta de forma secundaria o implícita a través de ejercicios de razonamiento.`;
    } else if (hasWeak) {
      status = 'PARTIAL';
      strength = 'WEAK';
      confidence = 'MEDIUM';
      explanation = `Presencia parcial o indirecta en los ejercicios prácticos.`;
    } else if (parsed.exercises.length >= 3) {
      // 3+ exercises analyzed and NONE matched this competency
      status = 'FAIL';
      strength = 'NONE';
      confidence = 'HIGH';
      explanation = `Sin oportunidades de práctica detectadas tras analizar todos los ejercicios.`;
    } else {
      status = 'UNKNOWN';
      strength = 'NONE';
      confidence = 'LOW';
      explanation = `Sin evidencia suficiente para determinar cobertura de práctica.`;
    }

    practiceMap.set(meta.key, {
      status,
      strength,
      confidence,
      supportingExercises: supporting,
      explanation
    });
  });

  // 3. MATRIX BUILD & GAP CLASSIFICATION
  let coreTotal = 0;
  let coreCovered = 0;
  let relevantTotal = 0;
  let relevantCovered = 0;

  Object.values(ALL_COMPETENCIES).forEach(meta => {
    const applicability = computeFinalApplicability(articleType, meta.key, purpose);
    const teachingInfo = teachingMap.get(meta.key) || { status: 'UNKNOWN', confidence: 'LOW', evidence: [] };
    const practiceInfo = practiceMap.get(meta.key) || { status: 'UNKNOWN', strength: 'NONE', confidence: 'LOW', supportingExercises: [] };

    let gapType: CompetencyGapType = 'NONE';
    let recommendation: string | undefined = undefined;

    if (applicability === 'CORE') {
      coreTotal++;
      if (practiceInfo.status === 'PASS') {
        coreCovered++;
        gapType = 'INFO';
      } else if (practiceInfo.status === 'PARTIAL') {
        coreCovered++;
        gapType = 'WARNING';
        warningGaps.push(meta.key);
        recommendation = getRecommendationForCompetency(meta.key, purpose);
      } else if (practiceInfo.status === 'FAIL' && practiceInfo.confidence === 'HIGH') {
        gapType = 'CRITICAL';
        criticalGaps.push(meta.key);
        recommendation = getRecommendationForCompetency(meta.key, purpose);
      } else {
        gapType = 'INFO';
      }
    } else if (applicability === 'RELEVANT') {
      relevantTotal++;
      if (practiceInfo.status === 'PASS' || practiceInfo.status === 'PARTIAL') {
        relevantCovered++;
        gapType = 'INFO';
      } else if (practiceInfo.status === 'FAIL' && practiceInfo.confidence === 'HIGH') {
        gapType = 'WARNING';
        warningGaps.push(meta.key);
        recommendation = getRecommendationForCompetency(meta.key, purpose);
      } else {
        gapType = 'INFO';
      }
    } else {
      // OPTIONAL or NOT_RELEVANT
      gapType = 'NONE';
    }

    // Recommendation Gating: ONLY add recommendations for CRITICAL or WARNING gaps!
    if ((gapType === 'CRITICAL' || gapType === 'WARNING') && recommendation && !gapRecommendations.includes(recommendation)) {
      gapRecommendations.push(recommendation);
    }

    matrix.push({
      competency: meta.key,
      description: meta.name,
      applicability,
      teachingStatus: teachingInfo.status,
      practiceStatus: practiceInfo.status,
      evidenceStrength: practiceInfo.strength,
      confidence: practiceInfo.confidence,
      supportingExercises: practiceInfo.supportingExercises,
      evidenceTraceExplanation: practiceInfo.explanation,
      gapType,
      recommendation: (gapType === 'CRITICAL' || gapType === 'WARNING') ? recommendation : undefined
    });
  });

  const corePercentage = coreTotal > 0 ? Math.round((coreCovered / coreTotal) * 100) : 100;
  const relevantPercentage = relevantTotal > 0 ? Math.round((relevantCovered / relevantTotal) * 100) : 100;

  return {
    articlePurpose: purpose,
    exerciseMappings,
    matrix,
    coreSummary: { covered: coreCovered, total: coreTotal, percentage: corePercentage },
    relevantSummary: { covered: relevantCovered, total: relevantTotal, percentage: relevantPercentage },
    criticalGaps,
    warningGaps,
    gapRecommendations
  };
}

function getRecommendationForCompetency(comp: TaxonomyCompetency, purpose: ArticlePurpose): string {
  switch (comp) {
    case 'TRANSFER':
      return 'Add one advanced transfer exercise requiring application of the methodology to a novel situation.';
    case 'ERROR_ANALYSIS':
      return 'Add one exercise where the learner identifies and evaluates unreasonable assumptions or sources of error.';
    case 'JUSTIFY':
      return 'Add an exercise requiring the learner to justify why a model or simplification is appropriate.';
    case 'MODEL':
      return 'Add an exercise where the learner builds or simplifies a model representation for a problem.';
    case 'ESTIMATE':
      return 'Add a Fermi estimation exercise to practice order-of-magnitude calculations.';
    case 'ANALYZE':
      return 'Add an exercise requiring step-by-step problem decomposition.';
    case 'EVALUATE':
      return 'Add an exercise requiring the student to evaluate the physical plausibility of a given result.';
    case 'INTERPRET':
      return 'Add an exercise requiring the student to interpret a graph, data table, or physical magnitude.';
    case 'APPLY':
      return 'Add an exercise requiring direct application of the physical model or method.';
    case 'EXPLAIN':
      return 'Add a question asking the learner to explain the underlying physical mechanism in their own words.';
    default:
      return `Add a practice activity focused on the ${comp} competency.`;
  }
}
