import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  BranchCurriculum,
  ArticleInventoryItem,
  BranchAnalysisResult,
  ArticleGap,
  ArticleSource,
  GapSeverity,
} from './types';

const CONTENT_BASE = path.join(process.cwd(), 'content', 'guias');
const JSON_ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');
const CURRICULUM_DIR = path.join(process.cwd(), 'data', 'curriculum');

const LEGACY_BLOCK_RE = /```(aeterna-question|aeterna-equation)\b/g;

function parseFrontmatter(fileContent: string, fallbackSlug: string): { data: Record<string, any> } {
  try {
    const { data } = matter(fileContent);
    return { data };
  } catch (e) {
    // gray-matter no soporta algunos frontmatters del repo; fallback manual igual al de server-content.ts
    const data: Record<string, any> = {};
    const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (match) {
      const lines = match[1].split('\n');
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          value = value.replace(/^["']|["']$/g, '');
          if (value.startsWith('[') && value.endsWith(']')) {
            data[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
          } else {
            data[key] = value;
          }
        }
      }
    }
    return { data };
  }
}

function getFilesRecursively(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const entry of list) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursively(full, ext));
    } else if (entry.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

function findMarkdownForSlug(slug: string): string | null {
  const files = getFilesRecursively(CONTENT_BASE, '.md');
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const { data } = parseFrontmatter(raw, path.basename(file, '.md'));
      const fileSlug = data.slug || path.basename(file, '.md');
      if (fileSlug === slug) return file;
    } catch (e) {
      // skip
    }
  }
  return null;
}

const ALL_BLOCK_TYPES = [
  'aeterna-exercise','aeterna-ejercicio','aeterna-decision','aeterna-decision-box',
  'aeterna-formula','aeterna-flowchart','flowchart',
  'prediction-box','parameter-lab','graph-lab','error-hunter',
  'model-builder','concept-map','argument-builder','causal-map',
  'evidence-matcher','counterexample','argument-evaluation','sequence-builder',
];

function inspectJsonArticle(slug: string): { sections: number; allLayers: boolean; legacyBlocks: number; blockTypesUsed: number; totalBlocks: number; imagesSuggested: number } {
  const file = path.join(JSON_ARTICLES_DIR, `${slug}.json`);
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    const rawText = fs.readFileSync(file, 'utf8');
    const secciones: any[] = Array.isArray(raw.secciones) ? raw.secciones : [];
    const levelKeys = ['principiante', 'intermedio', 'avanzado'];
    const coverage: Record<string, boolean> = { principiante: false, intermedio: false, avanzado: false };

    const bodyStr = rawText;
    let legacyBlocks = 0;
    let totalBlocks = 0;
    const usedTypes = new Set<string>();

    for (const bt of ALL_BLOCK_TYPES) {
      const re = new RegExp('```' + bt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const count = (bodyStr.match(re) || []).length;
      if (count > 0) {
        usedTypes.add(bt);
        totalBlocks += count;
      }
    }

    // Also check legacy blocks specifically
    const legacyRe = /```(aeterna-question|aeterna-equation)\b/g;
    legacyBlocks = (bodyStr.match(legacyRe) || []).length;

    for (const sec of secciones) {
      const niveles = sec?.niveles || {};
      for (const lk of levelKeys) {
        if (niveles[lk] && String(niveles[lk]).trim()) coverage[lk] = true;
      }
    }
    const allLayers = levelKeys.every(lk => coverage[lk]);

    const imagesSuggested = (bodyStr.match(/IMAGEN SUGERIDA/g) || []).length;

    return { sections: secciones.length, allLayers, legacyBlocks, blockTypesUsed: usedTypes.size, totalBlocks, imagesSuggested };
  } catch (e) {
    return { sections: 0, allLayers: false, legacyBlocks: 0, blockTypesUsed: 0, totalBlocks: 0, imagesSuggested: 0 };
  }
}

export function loadCurriculum(branchId: string): BranchCurriculum {
  const file = path.join(CURRICULUM_DIR, `${branchId}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Curriculum no encontrado: ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as BranchCurriculum;
}

export function scanInventory(branchPath?: string): ArticleInventoryItem[] {
  const branchBase = branchPath ? path.join(CONTENT_BASE, ...branchPath.split('/')) : CONTENT_BASE;
  const jsonFiles = fs.existsSync(JSON_ARTICLES_DIR)
    ? fs.readdirSync(JSON_ARTICLES_DIR).filter(f => f.endsWith('.json'))
    : [];
  const mdFiles = getFilesRecursively(branchBase, '.md');
  const seen = new Set<string>();
  const items: ArticleInventoryItem[] = [];

  for (const file of mdFiles) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const { data } = parseFrontmatter(raw, path.basename(file, '.md'));
      const slug = data.slug || path.basename(file, '.md');
      const json = inspectJsonArticle(slug);
      items.push({
        slug,
        source: json.sections > 0 ? 'json' : 'markdown',
        filePath: file,
        title: data.title,
        nivel: data.nivel,
        orden: data.orden,
        existsJson: json.sections > 0,
        existsMarkdown: true,
        jsonSections: json.sections,
        jsonHasAllLayers: json.allLayers,
        jsonLegacyBlocks: json.legacyBlocks,
        blockTypesUsed: json.blockTypesUsed,
        totalBlocks: json.totalBlocks,
        imagesSuggested: json.imagesSuggested,
      });
      seen.add(slug);
    } catch (e) {
      // skip
    }
  }

  for (const file of jsonFiles) {
    const slug = file.replace(/\.json$/, '');
    if (seen.has(slug)) continue;
    const mdPath = findMarkdownForSlug(slug);
    if (!mdPath || !mdPath.startsWith(branchBase)) continue;
    const json = inspectJsonArticle(slug);
    items.push({
      slug,
      source: 'json',
      filePath: mdPath,
      title: matter(fs.readFileSync(mdPath, 'utf8')).data.title,
      existsJson: true,
      existsMarkdown: true,
      jsonSections: json.sections,
      jsonHasAllLayers: json.allLayers,
      jsonLegacyBlocks: json.legacyBlocks,
      blockTypesUsed: json.blockTypesUsed,
      totalBlocks: json.totalBlocks,
      imagesSuggested: json.imagesSuggested,
    });
    seen.add(slug);
  }

  return items;
}

function classifyGap(
  planned: { slug: string; title: string; nivel: number; orden: number },
  inventory: ArticleInventoryItem | undefined
): ArticleGap | null {

  if (!inventory) {
    return {
      slug: planned.slug,
      title: planned.title,
      nivel: planned.nivel,
      orden: planned.orden,
      severity: 'CRITICA',
      reason: 'Artículo no existe ni como JSON ni como Markdown',
      suggestedAction: 'Generar esqueleto con plan-branch --outline y desarrollarlo',
    };
  }

  if (!inventory.existsJson) {
    return {
      slug: planned.slug,
      title: planned.title,
      nivel: planned.nivel,
      orden: planned.orden,
      severity: 'MEDIA',
      reason: 'Solo existe Markdown: render plano, sin capas interactivas modernas',
      suggestedAction: 'Convertir a data/articles/*.json en formato de capas',
    };
  }

  if (inventory.jsonLegacyBlocks > 0) {
    return {
      slug: planned.slug,
      title: planned.title,
      nivel: planned.nivel,
      orden: planned.orden,
      severity: 'MEDIA',
      reason: `El JSON usa ${inventory.jsonLegacyBlocks} bloques legacy no soportados (aeterna-question/aeterna-equation)`,
      suggestedAction: 'Sustituir por bloques modernos (aeterna-exercise/aeterna-decision/aeterna-formula)',
    };
  }

  if (!inventory.jsonHasAllLayers) {
    return {
      slug: planned.slug,
      title: planned.title,
      nivel: planned.nivel,
      orden: planned.orden,
      severity: 'INFO',
      reason: 'JSON existe pero alguna capa (principiante/intermedio/avanzado) está vacía',
      suggestedAction: 'Completar las secciones por nivel',
    };
  }

  if (inventory.blockTypesUsed < 3) {
    return {
      slug: planned.slug,
      title: planned.title,
      nivel: planned.nivel,
      orden: planned.orden,
      severity: 'MEDIA',
      reason: `Solo ${inventory.blockTypesUsed} tipo(s) de bloque interactivo de 19 disponibles (${inventory.totalBlocks} bloques totales).`,
      suggestedAction: 'Añadir prediction-box, parameter-lab, graph-lab, error-hunter, concept-map, model-builder o sequence-builder.',
    };
  }

  if (inventory.imagesSuggested === 0) {
    return {
      slug: planned.slug,
      title: planned.title,
      nivel: planned.nivel,
      orden: planned.orden,
      severity: 'INFO',
      reason: 'Sin marcadores [IMAGEN SUGERIDA]. El contenido visual mejora la retención.',
      suggestedAction: 'Añadir placeholders [IMAGEN SUGERIDA] en secciones con conceptos visualizables.',
    };
  }

  return null;
}

export function analyzeBranch(branchId: string): BranchAnalysisResult {
  const curriculum = loadCurriculum(branchId);
  const inventory = scanInventory(curriculum.contentPath);
  const invBySlug = new Map(inventory.map(i => [i.slug, i]));

  const articlesByLevel: Record<number, { planned: string[]; existing: string[] }> = {};
  const gaps: ArticleGap[] = [];
  const missingArticles: ArticleGap[] = [];
  const degradedArticles: ArticleGap[] = [];

  for (const article of curriculum.articles) {
    if (!articlesByLevel[article.nivel]) {
      articlesByLevel[article.nivel] = { planned: [], existing: [] };
    }
    articlesByLevel[article.nivel].planned.push(article.slug);

    const inv = invBySlug.get(article.slug);
    if (inv && (inv.existsJson || inv.existsMarkdown)) {
      articlesByLevel[article.nivel].existing.push(article.slug);
    }

    const gap = classifyGap(article, inv);
    if (gap) {
      gaps.push(gap);
      if (gap.severity === 'CRITICA') missingArticles.push(gap);
      else degradedArticles.push(gap);
    }
  }

  // Extra markdown/json articles in the branch not in the curriculum map
  for (const item of inventory) {
    if (!curriculum.articles.some(a => a.slug === item.slug)) {
      gaps.push({
        slug: item.slug,
        title: item.title || item.slug,
        nivel: item.nivel || 0,
        orden: item.orden || 0,
        severity: 'INFO',
        reason: 'Existe contenido pero no está mapeado en el curriculum',
        suggestedAction: 'Añadir al data/curriculum/' + branchId + '.json o revisar su ubicación',
      });
    }
  }

  const plannedCount = curriculum.articles.length;
  const existingCount = curriculum.articles.filter(a => {
    const inv = invBySlug.get(a.slug);
    return inv && (inv.existsJson || inv.existsMarkdown);
  }).length;

  return {
    branchId: curriculum.branchId,
    branchName: curriculum.branchName,
    profileId: curriculum.profileId,
    levels: curriculum.levels,
    plannedArticles: plannedCount,
    existingArticles: existingCount,
    coveragePercentage: plannedCount > 0 ? Math.round((existingCount / plannedCount) * 100) : 0,
    articlesByLevel,
    gaps,
    missingArticles,
    degradedArticles,
    inventory,
  };
}
