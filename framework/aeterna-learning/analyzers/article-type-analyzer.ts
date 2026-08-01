import { ArticleType, ArticleTypeDetectionResult, TypeAlternative } from '../types';

const VALID_ARTICLE_TYPES: ArticleType[] = [
  'conceptual',
  'methodological',
  'procedural',
  'problem_solving',
  'experimental',
  'simulation',
  'synthesis'
];

export function detectArticleType(
  rawFrontmatter: Record<string, any>,
  title: string,
  rawBody: string,
  h2Headings: string[],
  h3Headings: string[],
  exercisesCount: number,
  interactivesCount: number
): ArticleTypeDetectionResult {
  // 1. Check if articleType is declared explicitly in frontmatter
  const declaredRaw = rawFrontmatter.articleType || rawFrontmatter.type;
  let declaredType: ArticleType | null = null;

  if (typeof declaredRaw === 'string') {
    const normalizedDeclared = declaredRaw.toLowerCase().trim() as ArticleType;
    if (VALID_ARTICLE_TYPES.includes(normalizedDeclared)) {
      declaredType = normalizedDeclared;
    }
  }

  if (declaredType) {
    return {
      detectedType: declaredType,
      declaredType,
      typeSource: 'declared',
      confidence: 1.0,
      confidenceLevel: 'HIGH',
      alternatives: [],
      signals: [`Tipo declarado explícitamente en el frontmatter: "${declaredType}"`]
    };
  }

  // 2. Deterministic Signal Analysis
  const signalsMap: Record<ArticleType, { score: number; matches: string[] }> = {
    conceptual: { score: 0.3, matches: [] }, // Default baseline
    methodological: { score: 0, matches: [] },
    procedural: { score: 0, matches: [] },
    problem_solving: { score: 0, matches: [] },
    experimental: { score: 0, matches: [] },
    simulation: { score: 0, matches: [] },
    synthesis: { score: 0, matches: [] }
  };

  const lowerTitle = title.toLowerCase();
  const lowerBody = rawBody.toLowerCase();
  const allHeadingsLower = [...h2Headings, ...h3Headings].map(h => h.toLowerCase()).join(' ');

  // METHODOLOGICAL Signals
  if (lowerTitle.includes('cómo piensa') || lowerTitle.includes('medición') || lowerTitle.includes('estimación') || lowerTitle.includes('método científico')) {
    signalsMap.methodological.score += 0.45;
    signalsMap.methodological.matches.push('El título indica metodología o forma de pensamiento científico');
  }
  if (lowerBody.includes('estimación de fermi') || lowerBody.includes('fermi')) {
    signalsMap.methodological.score += 0.3;
    signalsMap.methodological.matches.push('Contiene técnicas de estimación de Fermi');
  }
  if (allHeadingsLower.includes('modelo') || allHeadingsLower.includes('medir') || allHeadingsLower.includes('incertidumbre')) {
    signalsMap.methodological.score += 0.25;
    signalsMap.methodological.matches.push('Encabezados centrados en medición, modelos o incertidumbre');
  }
  if (rawFrontmatter.tags && Array.isArray(rawFrontmatter.tags)) {
    const tagsStr = rawFrontmatter.tags.join(' ').toLowerCase();
    if (tagsStr.includes('estimación') || tagsStr.includes('método científico') || tagsStr.includes('modelos')) {
      signalsMap.methodological.score += 0.2;
      signalsMap.methodological.matches.push('Etiquetas del artículo asociadas a metodología');
    }
  }

  // PROBLEM SOLVING Signals
  if (rawFrontmatter.tipo === 'practice' || lowerTitle.includes('ejercicios') || lowerTitle.includes('problemas resueltos')) {
    signalsMap.problem_solving.score += 0.45;
    signalsMap.problem_solving.matches.push('Título o frontmatter indica enfoque en ejercicios/práctica');
  }
  if (exercisesCount >= 8) {
    signalsMap.problem_solving.score += 0.35;
    signalsMap.problem_solving.matches.push(`Alto volumen de ejercicios detectados (${exercisesCount})`);
  } else if (exercisesCount >= 5) {
    signalsMap.problem_solving.score += 0.2;
    signalsMap.problem_solving.matches.push(`Volumen moderado de ejercicios (${exercisesCount})`);
  }

  // SIMULATION Signals
  if (interactivesCount > 0 && (lowerBody.includes('simulaci') || lowerBody.includes('interactive') || lowerBody.includes('nexusnode3d'))) {
    signalsMap.simulation.score += 0.6;
    signalsMap.simulation.matches.push('Contiene simulación o componente interactivo 3D/dinámico');
  }

  // EXPERIMENTAL Signals
  if (lowerBody.includes('error experimental') || lowerBody.includes('diseño experimental') || lowerBody.includes('laboratorio')) {
    signalsMap.experimental.score += 0.5;
    signalsMap.experimental.matches.push('Menciona experimentos, diseño experimental o error de medición en laboratorio');
  }

  // PROCEDURAL Signals
  if (lowerTitle.includes('paso a paso') || lowerTitle.includes('procedimiento') || lowerTitle.includes('guía de cálculo')) {
    signalsMap.procedural.score += 0.45;
    signalsMap.procedural.matches.push('Título o secciones estructuradas como procedimiento paso a paso');
  }
  if (allHeadingsLower.includes('paso 1') || allHeadingsLower.includes('paso 2') || allHeadingsLower.includes('algoritmo')) {
    signalsMap.procedural.score += 0.35;
    signalsMap.procedural.matches.push('Pasos de ejecución procedural identificados en encabezados');
  }

  // SYNTHESIS Signals
  if (lowerTitle.includes('síntesis') || lowerTitle.includes('resumen') || lowerTitle.includes('mapa general') || lowerTitle.includes('guía maestra')) {
    signalsMap.synthesis.score += 0.4;
    signalsMap.synthesis.matches.push('Título enfocado en síntesis o consolidación de conocimientos');
  }

  // CONCEPTUAL Signals
  if (lowerBody.includes('qué es') || lowerBody.includes('definición') || lowerBody.includes('concepto de')) {
    signalsMap.conceptual.score += 0.25;
    signalsMap.conceptual.matches.push('Contiene explicaciones conceptuales y definiciones');
  }
  if (exercisesCount <= 4 && interactivesCount === 0) {
    signalsMap.conceptual.score += 0.2;
    signalsMap.conceptual.matches.push('Estructura orientada a lectura expositiva con ejercicios ligeros');
  }

  // Sort candidate types by confidence score
  const sortedCandidates = VALID_ARTICLE_TYPES.map(type => ({
    type,
    score: Math.min(1.0, Math.round(signalsMap[type].score * 100) / 100),
    matches: signalsMap[type].matches
  })).sort((a, b) => b.score - a.score);

  const bestMatch = sortedCandidates[0];
  const alternatives: TypeAlternative[] = sortedCandidates.slice(1, 3).map(c => ({
    type: c.type,
    confidence: c.score
  }));

  const confidence = bestMatch.score;
  let confidenceLevel: ArticleTypeDetectionResult['confidenceLevel'] = 'LOW';
  if (confidence >= 0.80) {
    confidenceLevel = 'HIGH';
  } else if (confidence >= 0.60) {
    confidenceLevel = 'MEDIUM';
  }

  const activeSignals = bestMatch.matches.length > 0
    ? bestMatch.matches
    : [`Detección por defecto basada en señales estructurales generales (confianza ${confidence})`];

  return {
    detectedType: bestMatch.type,
    declaredType: null,
    typeSource: 'inferred',
    confidence,
    confidenceLevel,
    alternatives,
    signals: activeSignals
  };
}
