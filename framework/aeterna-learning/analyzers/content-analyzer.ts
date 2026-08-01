import { ParsedArticleStructure } from '../types';
import { analyzeStructure } from './structure-analyzer';
import { analyzeLayers } from './layer-analyzer';
import { analyzeExercises } from './exercise-analyzer';
import { analyzeInteractives } from './interactive-analyzer';
import { analyzePrerequisites } from './prerequisite-analyzer';
import { detectArticleType } from './article-type-analyzer';
import { extractVisualsFromMDX } from './visual-analyzer';

export function analyzeArticleContent(fileContent: string, filePath: string): {
  parsedStructure: ParsedArticleStructure;
  prereqResult: ReturnType<typeof analyzePrerequisites>;
} {
  const struct = analyzeStructure(fileContent, filePath);
  const layers = analyzeLayers(struct.rawBody);
  const exercises = analyzeExercises(struct.rawBody, layers);
  const interactivesResult = analyzeInteractives(struct.rawBody);
  const prereqResult = analyzePrerequisites(struct.prerequisites, struct.rawFrontmatter);
  const visuals = extractVisualsFromMDX(struct.rawBody, layers);

  const articleTypeResult = detectArticleType(
    struct.rawFrontmatter,
    struct.title,
    struct.rawBody,
    struct.h2Headings,
    struct.h3Headings,
    exercises.length,
    interactivesResult.interactives.length
  );

  const parsedStructure: ParsedArticleStructure = {
    filePath,
    title: struct.title,
    slug: struct.slug,
    author: struct.author,
    category: struct.category,
    subcategory: struct.subcategory,
    tags: struct.tags,
    nivel: struct.nivel,
    prerequisites: struct.prerequisites,
    rawFrontmatter: struct.rawFrontmatter,
    rawBody: struct.rawBody,
    layers,
    exercises,
    interactives: interactivesResult.interactives,
    visuals,
    h2Headings: struct.h2Headings,
    h3Headings: struct.h3Headings,
    mathFormulasCount: struct.mathFormulasCount,
    hasTransitionButtons: struct.hasTransitionButtons,
    hasProgressHeader: struct.hasProgressHeader,
    articleTypeResult
  };

  return {
    parsedStructure,
    prereqResult
  };
}
