export type BranchLayerId = 'inicio' | 'intermedio' | 'avanzado';

export type ArticleLayerId = 'principiante' | 'intermedio' | 'avanzado';

export type CompetencyType =
  | 'recognition' | 'understanding' | 'basic_application'
  | 'application' | 'interpretation' | 'standard_problem_solving'
  | 'reasoning' | 'non_routine_problem_solving' | 'transfer';

export type ArticleTipo =
  | 'theory' | 'practice' | 'philosophy' | 'milestone'
  | 'hub' | 'synthesis' | 'methodological';

export type PlannedBlockType =
  | 'aeterna-exercise' | 'aeterna-decision' | 'aeterna-formula'
  | 'prediction-box' | 'parameter-lab' | 'graph-lab' | 'error-hunter'
  | 'model-builder' | 'concept-map' | 'argument-builder' | 'causal-map'
  | 'evidence-matcher' | 'counterexample' | 'argument-evaluation'
  | 'sequence-builder' | 'aeterna-flowchart' | 'flowchart'
  | 'pedagogical-key-insight' | 'pedagogical-misconception'
  | 'connect' | 'transfer' | 'hidden-assumption';

export type BranchStatus = 'active' | 'draft' | 'planned';

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
  tipo: ArticleTipo;
  prerequisites: string[];
  tags: string[];
  capas: Partial<Record<BranchLayerId, PlannedArticleLayer>>;
}

export interface CurriculumLevel {
  nivel: number;
  titulo: string;
  descripcion: string;
}

export interface BranchCurriculum {
  branchId: string;
  branchName: string;
  subcategory: string;
  categoryId: string;
  profileId: string;
  icon: string;
  status: BranchStatus;
  description: string;
  contentPath: string;
  levels: CurriculumLevel[];
  articles: PlannedArticle[];
  createdAt: string;
  updatedAt: string;
}

export interface BranchSummary {
  branchId: string;
  branchName: string;
  subcategory: string;
  categoryId: string;
  icon: string;
  status: BranchStatus;
  levels: number;
  totalArticles: number;
  articlesByLevel: Record<number, number>;
  typesDistribution: Record<string, number>;
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  path: string;
  message: string;
}

export interface BranchValidationReport {
  branchId: string;
  valid: boolean;
  issues: ValidationIssue[];
  stats: {
    levels: number;
    totalArticles: number;
    articlesWithPrerequisites: number;
    totalSections: number;
    totalBlocks: number;
    competencyCounts: Record<string, number>;
  };
}

export function validateBranch(branch: BranchCurriculum): BranchValidationReport {
  const issues: ValidationIssue[] = [];
  const slugs = new Set<string>();
  const competencyCounts: Record<string, number> = {};
  let totalSections = 0;
  let totalBlocks = 0;
  let articlesWithPrereqs = 0;

  if (!branch.branchId || !branch.branchName) {
    issues.push({ severity: 'error', path: 'root', message: 'branchId y branchName requeridos' });
  }

  if (!branch.levels || branch.levels.length === 0) {
    issues.push({ severity: 'warning', path: 'levels', message: 'No hay niveles definidos' });
  }

  for (const level of branch.levels) {
    if (!level.titulo) {
      issues.push({ severity: 'warning', path: `levels[${level.nivel}]`, message: `Nivel ${level.nivel} sin título` });
    }
  }

  for (const article of branch.articles) {
    if (slugs.has(article.slug)) {
      issues.push({ severity: 'error', path: `articles.${article.slug}`, message: 'Slug duplicado' });
    }
    slugs.add(article.slug);

    if (!article.title) {
      issues.push({ severity: 'error', path: `articles.${article.slug}`, message: 'Artículo sin título' });
    }

    if (!branch.levels.find(l => l.nivel === article.nivel)) {
      issues.push({ severity: 'error', path: `articles.${article.slug}`, message: `Nivel ${article.nivel} no definido en levels` });
    }

    if (article.prerequisites.length > 0) {
      articlesWithPrereqs++;
      for (const prereq of article.prerequisites) {
        if (prereq === article.slug) {
          issues.push({ severity: 'error', path: `articles.${article.slug}.prerequisites`, message: 'Prerrequisito circular (se referencia a sí mismo)' });
        }
      }
    }

    const layerIds: BranchLayerId[] = ['inicio', 'intermedio', 'avanzado'];
    let hasAnyLayer = false;
    for (const lid of layerIds) {
      const layer = article.capas[lid];
      if (!layer) continue;
      hasAnyLayer = true;
      if (layer.sections.length === 0) {
        issues.push({ severity: 'warning', path: `articles.${article.slug}.capas.${lid}`, message: `Capa ${lid} sin secciones` });
      }
      for (const section of layer.sections) {
        totalSections++;
        if (!section.titulo) {
          issues.push({ severity: 'warning', path: `articles.${article.slug}.capas.${lid}.sections.${section.id}`, message: 'Sección sin título' });
        }
        if (section.competencias.length === 0) {
          issues.push({ severity: 'info', path: `articles.${article.slug}.capas.${lid}.sections.${section.id}`, message: 'Sección sin competencias asignadas' });
        }
        for (const comp of section.competencias) {
          competencyCounts[comp] = (competencyCounts[comp] || 0) + 1;
        }
        totalBlocks += section.bloques.length;
      }
    }
    if (!hasAnyLayer) {
      issues.push({ severity: 'error', path: `articles.${article.slug}.capas`, message: 'Artículo sin capas definidas' });
    }
  }

  const validIssues = issues.filter(i => i.severity === 'error');
  for (const prereq of branch.articles.flatMap(a => a.prerequisites)) {
    if (!slugs.has(prereq)) {
      issues.push({ severity: 'error', path: `prerequisites.${prereq}`, message: `Prerrequisito "${prereq}" no existe en el catálogo` });
    }
  }

  return {
    branchId: branch.branchId,
    valid: validIssues.length === 0,
    issues,
    stats: {
      levels: branch.levels.length,
      totalArticles: branch.articles.length,
      articlesWithPrerequisites: articlesWithPrereqs,
      totalSections,
      totalBlocks,
      competencyCounts,
    },
  };
}

export const LAYER_TO_ARTICLE_LEVEL: Record<BranchLayerId, ArticleLayerId> = {
  inicio: 'principiante',
  intermedio: 'intermedio',
  avanzado: 'avanzado',
};

export function getBranchSummary(branch: BranchCurriculum): BranchSummary {
  const articlesByLevel: Record<number, number> = {};
  const typesDistribution: Record<string, number> = {};
  for (const article of branch.articles) {
    articlesByLevel[article.nivel] = (articlesByLevel[article.nivel] || 0) + 1;
    typesDistribution[article.tipo] = (typesDistribution[article.tipo] || 0) + 1;
  }
  return {
    branchId: branch.branchId,
    branchName: branch.branchName,
    subcategory: branch.subcategory,
    categoryId: branch.categoryId,
    icon: branch.icon,
    status: branch.status,
    levels: branch.levels.length,
    totalArticles: branch.articles.length,
    articlesByLevel,
    typesDistribution,
  };
}
