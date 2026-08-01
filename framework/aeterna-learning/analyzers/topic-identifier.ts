import { ArticleType, ConfidenceLevel, ParsedArticleStructure, TopicProfile } from '../types';

export function identifyTopic(parsed: ParsedArticleStructure): TopicProfile {
  const rawTitle = parsed.title || parsed.slug || 'General Topic';
  // Clean title (remove prefixes like "1.4 " or "Cómo Piensa un Físico: ")
  let cleanTopic = rawTitle.replace(/^[\d\.\-\s]+/, '').trim();
  if (cleanTopic.includes(':')) {
    const parts = cleanTopic.split(':');
    cleanTopic = parts[parts.length - 1].trim();
  }

  const discipline = (parsed.subcategory || parsed.category || 'general').toLowerCase();
  const level = parsed.nivel ? `Nivel ${parsed.nivel}` : 'intermediate';
  const articleType: ArticleType = parsed.articleTypeResult ? parsed.articleTypeResult.detectedType : 'conceptual';

  const entitiesSet = new Set<string>();

  // Extract from tags
  if (parsed.tags && parsed.tags.length > 0) {
    parsed.tags.forEach(tag => entitiesSet.add(tag.toLowerCase()));
  }

  // Extract from headings
  parsed.h2Headings.forEach(h2 => {
    const clean = h2.replace(/^[\d\.\-\s]+/, '').toLowerCase();
    if (clean.length > 3 && !clean.includes('resumen') && !clean.includes('ejercicio') && !clean.includes('introducci')) {
      entitiesSet.add(clean);
    }
  });

  // Common physics/math entity detection keywords
  const bodyLower = parsed.rawBody.toLowerCase();
  const candidateKeywords = [
    'velocidad', 'posición', 'aceleración', 'tiempo', 'desplazamiento',
    'fuerza', 'masa', 'energía', 'trabajo', 'potencia', 'presión',
    'medición', 'estimación', 'modelo', 'incertidumbre', 'error',
    'gravedad', 'campo', 'onda', 'frecuencia', 'amplitud', 'vector'
  ];

  candidateKeywords.forEach(kw => {
    if (bodyLower.includes(kw)) {
      entitiesSet.add(kw);
    }
  });

  const primaryEntities = Array.from(entitiesSet).slice(0, 8);
  const relatedTopics = primaryEntities.slice(2, 6);

  const confidence: ConfidenceLevel = primaryEntities.length >= 3 ? 'HIGH' : (primaryEntities.length >= 1 ? 'MEDIUM' : 'LOW');

  return {
    topic: cleanTopic || 'Física General',
    discipline,
    level,
    articleType,
    primaryEntities,
    relatedTopics,
    confidence
  };
}
