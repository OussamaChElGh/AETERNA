import { ArticleType, CompetencyType } from '../types';

export type BranchLayerId = 'inicio' | 'intermedio' | 'avanzado';
export type ArticleLayerId = 'principiante' | 'intermedio' | 'avanzado';

export type PlannedBlockType =
  | 'aeterna-exercise'
  | 'aeterna-decision'
  | 'aeterna-formula'
  | 'prediction-box'
  | 'parameter-lab'
  | 'graph-lab'
  | 'error-hunter'
  | 'model-builder'
  | 'concept-map'
  | 'argument-builder'
  | 'causal-map'
  | 'evidence-matcher'
  | 'counterexample'
  | 'argument-evaluation'
  | 'sequence-builder'
  | 'aeterna-flowchart'
  | 'flowchart'
  | 'pedagogical-key-insight'
  | 'pedagogical-misconception'
  | 'connect'
  | 'transfer'
  | 'hidden-assumption';

export interface PlannedSection {
  id: string;
  titulo: string;
  competencias: CompetencyType[];
  bloques: PlannedBlockType[];
}

export interface PlannedArticleLayer {
  sections: PlannedSection[];
}

export interface PlannedArticle {
  slug: string;
  title: string;
  nivel: number;
  orden: number;
  tipo: 'theory' | 'practice' | 'philosophy' | 'milestone' | 'hub' | 'synthesis' | 'methodological';
  prerequisites: string[];
  tags: string[];
  capas: Record<BranchLayerId, PlannedArticleLayer>;
}

export interface CurriculumLevel {
  nivel: number;
  titulo: string;
  descripcion: string;
}

export interface BranchCurriculum {
  branchId: string;
  branchName: string;
  profileId: string;
  source: string;
  description: string;
  contentPath?: string;
  levels: CurriculumLevel[];
  articles: PlannedArticle[];
}

export type ArticleSource = 'json' | 'markdown' | 'none';

export interface ArticleInventoryItem {
  slug: string;
  source: ArticleSource;
  filePath?: string;
  title?: string;
  nivel?: number;
  orden?: number;
  existsJson: boolean;
  existsMarkdown: boolean;
  jsonSections: number;
  jsonHasAllLayers: boolean;
  jsonLegacyBlocks: number;
  blockTypesUsed: number;
  totalBlocks: number;
  imagesSuggested: number;
}

export type GapSeverity = 'CRITICA' | 'MEDIA' | 'INFO';

export interface ArticleGap {
  slug: string;
  title: string;
  nivel: number;
  orden: number;
  severity: GapSeverity;
  reason: string;
  suggestedAction: string;
}

export interface BranchAnalysisResult {
  branchId: string;
  branchName: string;
  profileId: string;
  levels: CurriculumLevel[];
  plannedArticles: number;
  existingArticles: number;
  coveragePercentage: number;
  articlesByLevel: Record<number, { planned: string[]; existing: string[] }>;
  gaps: ArticleGap[];
  missingArticles: ArticleGap[];
  degradedArticles: ArticleGap[];
  inventory: ArticleInventoryItem[];
}

export interface OutlineSection {
  id: string;
  titulo: string;
  niveles: Partial<Record<ArticleLayerId, string>>;
  acciones: unknown[];
}

export interface OutlineMetadata {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  subcategory: string;
  tags: string[];
  nivel: number;
  orden: number;
  nivel_titulo: string;
  tipo: ArticleType | string;
}

export interface OutlineCuadernoEntry {
  titulo: string;
  enunciado: string;
  solucion: string;
  pasos?: string[];
  xp?: number;
  pistas?: string[];
  opciones?: { label: string; correcta: boolean }[];
}

export interface ArticleOutline {
  metadata: OutlineMetadata;
  introduccion: string;
  secciones: OutlineSection[];
  conclusion: string;
  cuaderno?: Record<ArticleLayerId, OutlineCuadernoEntry[]>;
}
