import fs from 'fs';
import path from 'path';
import { AuditReport, ParsedArticleStructure, LearningProfileConfig } from '../types';
import { evaluateScoring, loadArticleTypeRules } from '../scoring/scoring-engine';
import { analyzeExercises, detectCognitiveLevels } from '../analyzers/exercise-analyzer';
import { analyzeInteractives } from '../analyzers/interactive-analyzer';
import { analyzeLayers } from '../analyzers/layer-analyzer';
import { analyzeStructure } from '../analyzers/structure-analyzer';
import { detectArticleType } from '../analyzers/article-type-analyzer';
import { extractVisualsFromMDX } from '../analyzers/visual-analyzer';

function loadLearningProfile(profileId: string = 'bachillerato'): LearningProfileConfig {
  const profilePath = path.join(process.cwd(), 'framework', 'anektia-learning', 'config', `learning-profile.${profileId}.json`);
  return JSON.parse(fs.readFileSync(profilePath, 'utf8')) as LearningProfileConfig;
}

const JSON_ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');

const LEVEL_TO_LAYER_ID: Record<string, 'inicio' | 'intermedio' | 'avanzado'> = {
  principiante: 'inicio',
  intermedio: 'intermedio',
  avanzado: 'avanzado',
};

interface AnektiaArticleJSON {
  metadata: Record<string, any>;
  introduccion?: string;
  secciones?: { id: string; titulo: string; niveles?: Record<string, string>; acciones?: any[] }[];
  conclusion?: string;
  cuaderno?: Record<string, any[]>;
}

/**
 * Builds a ParsedArticleStructure directly from a structured AnektiaArticle JSON
 * (data/articles/*.json), so the auditor can score modern layered articles.
 */
export function buildParsedFromJson(slug: string): ParsedArticleStructure {
  const file = path.join(JSON_ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Artículo JSON no encontrado: ${file}`);
  }
  const article = JSON.parse(fs.readFileSync(file, 'utf8')) as AnektiaArticleJSON;
  const metadata = article.metadata || {};

  // ---- Assemble a pseudo markdown body that preserves layer tags so that the
  // existing analyzers (exercises, interactives, layers) work unchanged. ----
  const layerBodies: Record<string, string[]> = { principiante: [], intermedio: [], avanzado: [] };
  const allTextParts: string[] = [];

  if (article.introduccion) {
    allTextParts.push(article.introduccion);
  }

  const secciones = article.secciones || [];
  const h2Headings: string[] = [];
  const h3Headings: string[] = [];

  for (const sec of secciones) {
    if (sec.titulo) {
      h2Headings.push(sec.titulo);
      allTextParts.push(`## ${sec.titulo}`);
    }
    const niveles = sec.niveles || {};
    for (const level of ['principiante', 'intermedio', 'avanzado']) {
      const content = niveles[level];
      if (content && String(content).trim()) {
        layerBodies[level].push(`## ${sec.titulo}\n\n${content}`);
        allTextParts.push(content);
      }
    }
  }

  if (article.conclusion) {
    allTextParts.push(article.conclusion);
  }

  const rawBody = allTextParts.join('\n\n');

  // Cuerpo único: cada sección una sola vez (el nivel con más contenido) para
  // que el análisis de calidad de texto no inflé repeticiones por capas paralelas.
  const uniqueParts: string[] = [];
  if (article.introduccion) uniqueParts.push(article.introduccion);
  for (const sec of secciones) {
    if (sec.titulo) uniqueParts.push(`## ${sec.titulo}`);
    const niveles = sec.niveles || {};
    const candidates = ['principiante', 'intermedio', 'avanzado']
      .map(l => niveles[l])
      .filter(c => c && String(c).trim().length > 0)
      .sort((a, b) => String(b).length - String(a).length);
    if (candidates.length > 0) {
      uniqueParts.push(String(candidates[0]));
    }
  }
  if (article.conclusion) uniqueParts.push(article.conclusion);
  const rawBodyUnique = uniqueParts.join('\n\n');

  // Build the pseudo-markdown with <NivelActivo> tags so analyzeLayers works
  const nivelActivoBody = [
    `<NivelActivo id="fundamentos">\n\n${layerBodies.principiante.join('\n\n---\n\n')}\n\n</NivelActivo>`,
    `<NivelActivo id="profundizacion">\n\n${layerBodies.intermedio.join('\n\n---\n\n')}\n\n</NivelActivo>`,
    `<NivelActivo id="frontera">\n\n${layerBodies.avanzado.join('\n\n---\n\n')}\n\n</NivelActivo>`,
  ].join('\n\n');

  const structure = analyzeStructure(nivelActivoBody, `${slug}.md`);
  const layers = analyzeLayers(nivelActivoBody);
  const exercises = analyzeExercises(nivelActivoBody, layers);
  const interactivesResult = analyzeInteractives(nivelActivoBody);
  const visuals = extractVisualsFromMDX(nivelActivoBody, layers);

  const articleTypeResult = detectArticleType(
    metadata,
    metadata.title || slug,
    rawBody,
    h2Headings,
    [],
    exercises.length,
    interactivesResult.interactives.length
  );

  const mathFormulasCount = (rawBody.match(/\$\$[\s\S]*?\$\$/g) || []).length
    + (rawBody.match(/\$[^$\n]+\$/g) || []).length;

  const imagesSuggested = (rawBody.match(/\[IMAGEN SUGERIDA:/g) || []).length;

  const cuaderno = article.cuaderno || {};
  const cuadernoProblemsCount = Object.values(cuaderno).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const hasCuaderno = cuadernoProblemsCount >= 3;

  return {
    filePath: file,
    title: metadata.title || slug,
    slug,
    author: metadata.author || 'Anektia',
    category: metadata.category || 'ciencias',
    subcategory: metadata.subcategory,
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    nivel: metadata.nivel,
    prerequisites: Array.isArray(metadata.prerequisites) ? metadata.prerequisites : [],
    rawFrontmatter: metadata,
    rawBody,
    rawBodyUnique,
    layers,
    exercises,
    interactives: interactivesResult.interactives,
    visuals,
    h2Headings,
    h3Headings,
    mathFormulasCount,
    hasTransitionButtons: false,
    hasProgressHeader: false,
    imagesSuggested,
    hasCuaderno,
    cuadernoProblemsCount,
    articleTypeResult,
  };
}

export function auditStructuredArticle(slug: string, profileId: string = 'bachillerato'): AuditReport {
  const parsed = buildParsedFromJson(slug);
  const profile = loadLearningProfile(profileId);
  return evaluateScoring(parsed, profile);
}
