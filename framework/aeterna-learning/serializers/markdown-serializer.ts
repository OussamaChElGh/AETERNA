import fs from 'fs';
import path from 'path';

interface AeternaMetadata {
  title: string;
  description?: string;
  slug: string;
  author?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  image?: string;
  date?: string;
  nivel?: number;
  orden?: number;
  nivel_titulo?: string;
  insignia?: string;
  tipo?: string;
  prerequisites?: string[];
  breadcrumb?: string[] | string;
  [key: string]: any;
}

interface AeternaSection {
  id: string;
  titulo: string;
  niveles: Partial<Record<'principiante' | 'intermedio' | 'avanzado', string>>;
  acciones?: any[];
}

interface ArticleJSON {
  metadata: AeternaMetadata;
  introduccion?: string;
  secciones: AeternaSection[];
  conclusion?: string;
}

const LAYER_TO_NIVEL_ACTIVO: Record<string, string> = {
  principiante: 'fundamentos',
  intermedio: 'profundizacion',
  avanzado: 'frontera',
};

function escapeYamlValue(v: string): string {
  if (v.includes(':') || v.includes('#') || v.includes('"') || v.includes("'")) {
    return `"${v.replace(/"/g, '\\"')}"`;
  }
  return v;
}

function buildFrontmatter(metadata: Record<string, any>): string {
  const lines: string[] = ['---'];
  const keys = ['title', 'description', 'slug', 'author', 'category', 'subcategory',
    'tags', 'image', 'date', 'nivel', 'orden', 'nivel_titulo', 'insignia', 'tipo',
    'prerequisites', 'breadcrumb'];

  for (const key of keys) {
    const v = metadata[key];
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${key}: [${v.map(x => `"${String(x).replace(/"/g, '\\"')}"`).join(', ')}]`);
    } else if (typeof v === 'object') {
      lines.push(`${key}: [${Object.values(v).map(x => `"${String(x).replace(/"/g, '\\"')}"`).join(', ')}]`);
    } else {
      lines.push(`${key}: ${escapeYamlValue(String(v))}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function wrapInNivelActivo(layerId: string, content: string): string {
  const nivelActivoId = LAYER_TO_NIVEL_ACTIVO[layerId] || layerId;
  return `\n<NivelActivo id="${nivelActivoId}">\n\n${content}\n\n</NivelActivo>\n`;
}

export function serializeArticleToMarkdown(article: ArticleJSON): string {
  const parts: string[] = [];

  parts.push(buildFrontmatter(article.metadata));
  parts.push('');

  if (article.introduccion) {
    parts.push(article.introduccion.trim());
    parts.push('');
  }

  const layerOrder = ['principiante', 'intermedio', 'avanzado'];
  const layerContent: Record<string, string[]> = {};

  for (const sec of article.secciones) {
    const niveles = sec.niveles || {};
    for (const layerId of layerOrder) {
      const content = (niveles as any)[layerId];
      if (content && String(content).trim()) {
        if (!layerContent[layerId]) layerContent[layerId] = [];
        const heading = `## ${sec.titulo}`;
        const body = String(content).trim();
        layerContent[layerId].push(`${heading}\n\n${body}`);
      }
    }
  }

  for (const layerId of layerOrder) {
    const content = layerContent[layerId];
    if (content && content.length > 0) {
      parts.push(wrapInNivelActivo(layerId, content.join('\n\n---\n\n')));
    }
  }

  if (article.conclusion) {
    parts.push('');
    parts.push(article.conclusion.trim());
  }

  return parts.join('\n').trim() + '\n';
}

export function filenameFromArticle(article: ArticleJSON, branchPrefix: string): string {
  const m = article.metadata;
  const nivel = m.nivel || 1;
  const orden = m.orden || 1;
  const slug = m.slug.replace(/-de-|-y-| /g, '-').slice(0, 40);
  return `${branchPrefix}-${nivel}-${orden}-${slug}.md`;
}

export function writeArticleToContent(
  article: ArticleJSON,
  contentPath: string,
  branchPrefix: string
): string {
  const md = serializeArticleToMarkdown(article);
  const filename = filenameFromArticle(article, branchPrefix);
  const fullPath = path.join(process.cwd(), 'content', 'guias', contentPath, filename);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, md, 'utf8');
  return fullPath;
}
