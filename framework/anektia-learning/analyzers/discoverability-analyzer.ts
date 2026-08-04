import { DiscoverabilityAnalysisResult, SearchIntentAspect, TechnicalSeoMetrics } from '../types';

export function analyzeTechnicalSeo(
  frontmatter: Record<string, any>,
  h2Headings: string[],
  h3Headings: string[],
  rawBody: string
): TechnicalSeoMetrics {
  const title = frontmatter.title || '';
  const description = frontmatter.description || '';
  const slug = frontmatter.slug || '';

  const hasTitle = title.trim().length > 0;
  const titleLength = title.trim().length;

  const hasMetaDescription = description.trim().length > 0;
  const descriptionLength = description.trim().length;

  const hasValidSlug = slug.length > 0 && /^[a-z0-9-]+$/.test(slug);

  // Check internal/external links count
  const internalLinkRegex = /\[([^\]]+)\]\((?:\/|#|file:)[^\)]+\)/g;
  const externalLinkRegex = /\[([^\]]+)\]\((?:https?:\/\/)[^\)]+\)/g;

  const internalLinksCount = (rawBody.match(internalLinkRegex) || []).length;
  const externalLinksCount = (rawBody.match(externalLinkRegex) || []).length;

  // Heading hierarchy check
  const h1MatchCount = (rawBody.match(/^#\s+/gm) || []).length;
  const headingHierarchyValid = h1MatchCount <= 2 && h2Headings.length >= 2;

  let score = 100;
  if (!hasTitle || titleLength < 15) score -= 20;
  if (!hasMetaDescription || descriptionLength < 50) score -= 20;
  if (!hasValidSlug) score -= 15;
  if (!headingHierarchyValid) score -= 15;
  if (internalLinksCount === 0 && externalLinksCount === 0) score -= 15;

  return {
    hasTitle,
    titleLength,
    hasMetaDescription,
    descriptionLength,
    hasValidSlug,
    headingHierarchyValid,
    internalLinksCount,
    externalLinksCount,
    score: Math.max(0, score)
  };
}

export function analyzeSearchIntent(
  category: string,
  subcategory: string = '',
  title: string,
  rawBody: string,
  h2Headings: string[]
): { searchIntentAspects: SearchIntentAspect[]; searchIntentScore: number; missingSearchAspects: string[] } {
  const lowerBody = rawBody.toLowerCase();
  const lowerTitle = title.toLowerCase();

  const searchIntentAspects: SearchIntentAspect[] = [];
  const missingSearchAspects: string[] = [];

  // Core Search Intent Aspect 1: Definition & Concept
  if (lowerBody.includes('se define') || lowerBody.includes('es un') || lowerBody.includes('concepto') || lowerBody.includes('qué es')) {
    searchIntentAspects.push({ aspect: 'Definición Clara del Concepto', status: 'PASS', detail: 'Incluye definición explícita aislable.' });
  } else {
    searchIntentAspects.push({ aspect: 'Definición Clara del Concepto', status: 'PARTIAL', detail: 'Definición implícita; se recomienda encabezado o bloque de definición.' });
    missingSearchAspects.push('Definición explícita inicial');
  }

  // Core Search Intent Aspect 2: Practical Examples & Applications
  if (lowerBody.includes('ejemplo') || lowerBody.includes('aplicacion') || lowerBody.includes('caso real')) {
    searchIntentAspects.push({ aspect: 'Ejemplos y Aplicaciones Prácticas', status: 'PASS', detail: 'Proporciona ejemplos contextuales.' });
  } else {
    searchIntentAspects.push({ aspect: 'Ejemplos y Aplicaciones Prácticas', status: 'MISSING', detail: 'Faltan ejemplos de la vida real o aplicación directa.' });
    missingSearchAspects.push('Ejemplos del mundo real');
  }

  // Core Search Intent Aspect 3: Common Errors & Misconceptions
  if (lowerBody.includes('error') || lowerBody.includes('fallo') || lowerBody.includes('equivoca') || lowerBody.includes('misconception')) {
    searchIntentAspects.push({ aspect: 'Errores Comunes y Falsas Intuiciones', status: 'PASS', detail: 'Aborda conceptos erróneos comunes.' });
  } else {
    searchIntentAspects.push({ aspect: 'Errores Comunes y Falsas Intuiciones', status: 'MISSING', detail: 'No aborda errores habituales de comprensión.' });
    missingSearchAspects.push('Aclaración de errores habituales');
  }

  // Core Search Intent Aspect 4: FAQ / Quick Q&A
  if (lowerBody.includes('preguntas frecuentes') || lowerBody.includes('faq') || lowerBody.includes('?')) {
    searchIntentAspects.push({ aspect: 'Resolución de Preguntas Frecuentes (FAQ)', status: 'PASS', detail: 'Dispone de preguntas frecuentes o resolución de dudas.' });
  } else {
    searchIntentAspects.push({ aspect: 'Resolución de Preguntas Frecuentes (FAQ)', status: 'PARTIAL', detail: 'Se sugiere añadir bloque FAQ de resolución rápida.' });
    missingSearchAspects.push('Sección FAQ / Preguntas Frecuentes');
  }

  const passCount = searchIntentAspects.filter(a => a.status === 'PASS').length;
  const partialCount = searchIntentAspects.filter(a => a.status === 'PARTIAL').length;
  const searchIntentScore = Math.round(((passCount * 1.0 + partialCount * 0.5) / searchIntentAspects.length) * 100);

  return {
    searchIntentAspects,
    searchIntentScore,
    missingSearchAspects
  };
}

export function analyzeDiscoverability(
  frontmatter: Record<string, any>,
  rawBody: string,
  h2Headings: string[],
  h3Headings: string[],
  category: string,
  subcategory: string = ''
): DiscoverabilityAnalysisResult {
  const technicalMetrics = analyzeTechnicalSeo(frontmatter, h2Headings, h3Headings, rawBody);
  const { searchIntentAspects, searchIntentScore, missingSearchAspects } = analyzeSearchIntent(
    category, 
    subcategory, 
    frontmatter.title || '', 
    rawBody, 
    h2Headings
  );

  // Semantic Coverage
  const keyEntitiesDetected: string[] = [];
  const tags = frontmatter.tags || [];
  if (Array.isArray(tags)) {
    keyEntitiesDetected.push(...tags);
  }

  const lowerBody = rawBody.toLowerCase();
  ['medición', 'estimación', 'modelo', 'incertidumbre', 'unidades', 'experimento', 'hipótesis'].forEach(entity => {
    if (lowerBody.includes(entity) && !keyEntitiesDetected.includes(entity)) {
      keyEntitiesDetected.push(entity);
    }
  });

  const semanticCoverageScore = Math.min(100, Math.round((keyEntitiesDetected.length / 5) * 100));

  // AI Discoverability (Observable Properties)
  const clearDefinitionsCount = (rawBody.match(/(?:se define como|es una?|definición:)/gi) || []).length;
  const structuredSectionsCount = h2Headings.length;
  const hasExplicitKeyTakeaways = lowerBody.includes('key-insight') || lowerBody.includes('la clave en') || lowerBody.includes('en resumen');
  const hasReferencesOrSources = lowerBody.includes('fuente') || lowerBody.includes('referencia') || lowerBody.includes('bibliograf');

  const technicalSeoScore = technicalMetrics.score;
  const overallScore = Math.round((technicalSeoScore * 0.4) + (semanticCoverageScore * 0.3) + (searchIntentScore * 0.3));

  return {
    technicalSeoScore,
    semanticCoverageScore,
    searchIntentScore,
    overallScore,
    technicalMetrics,
    searchIntentAspects,
    keyEntitiesDetected,
    missingSearchAspects,
    aiDiscoverabilitySignals: {
      clearDefinitionsCount,
      structuredSectionsCount,
      hasExplicitKeyTakeaways,
      hasReferencesOrSources
    }
  };
}
