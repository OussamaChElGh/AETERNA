import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ArticleFrontmatter, AeternaArticle } from '@/types';

const contentDirectories = [
  path.join(process.cwd(), 'content', 'guias'),
  path.join(process.cwd(), '..', 'AETERNA-main', 'src', 'content', 'guias')
];
const jsonArticlesDirectory = path.join(process.cwd(), 'data', 'articles');

function getFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else if (file.endsWith('.md') || file.endsWith('.txt')) {
      results.push(fullPath);
    }
  });
  
  return results;
}

function getAllMarkdownFiles(): string[] {
  let allFiles: string[] = [];
  contentDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      allFiles = allFiles.concat(getFilesRecursively(dir));
    }
  });
  return allFiles;
}

export function parseFrontmatter(fileContent: string, filePath: string): { data: ArticleFrontmatter; content: string } {
  const filename = path.basename(filePath, path.extname(filePath));
  const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/');
  
  let parsedData: any = {};
  let content = fileContent;

  try {
    const parsed = matter(fileContent);
    parsedData = parsed.data || {};
    content = parsed.content || fileContent;
  } catch (e) {
    const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatterMatch) {
      content = fileContent.replace(frontmatterMatch[0], "").trim();
      const yamlLines = frontmatterMatch[1].split("\n");
      yamlLines.forEach(line => {
        const colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          value = value.replace(/^["']|["']$/g, '');
          if (value.startsWith("[") && value.endsWith("]")) {
            parsedData[key] = value.slice(1, -1).split(",").map(v => v.trim().replace(/^["']|["']$/g, ''));
          } else {
            parsedData[key] = value;
          }
        }
      });
    } else {
      content = fileContent.replace(/^---\r?\n/, "").trim();
    }
  }

  const data: ArticleFrontmatter = {
    slug: parsedData.slug || filename,
    title: parsedData.title || filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: parsedData.description || '',
    author: parsedData.author || 'Aeterna',
    category: parsedData.category || 'guias',
    subcategory: parsedData.subcategory,
    tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
    image: parsedData.image || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop',
    date: parsedData.date || new Date().toISOString(),
    nivel: parsedData.nivel,
    orden: parsedData.orden,
    nivel_titulo: parsedData.nivel_titulo,
    tipo: parsedData.tipo,
    _path: relativePath,
  };

  return { data, content };
}

export function getAllArticles(): ArticleFrontmatter[] {
  const files = getAllMarkdownFiles();
  const articlesMap = new Map<string, { data: ArticleFrontmatter; mtime: number }>();

  files.forEach(filePath => {
    try {
      const stat = fs.statSync(filePath);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = parseFrontmatter(fileContent, filePath);
      const key = data.slug || path.basename(filePath, path.extname(filePath));
      
      const existing = articlesMap.get(key);
      if (!existing || stat.mtimeMs > existing.mtime) {
        articlesMap.set(key, { data, mtime: stat.mtimeMs });
      }
    } catch (e) {}
  });

  const articles = Array.from(articlesMap.values()).map(item => item.data);
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): { data: ArticleFrontmatter; content: string } | null {
  const files = getAllMarkdownFiles();
  let newest: { data: ArticleFrontmatter; content: string; mtime: number } | null = null;

  for (const filePath of files) {
    try {
      const stat = fs.statSync(filePath);
      const filename = path.basename(filePath, path.extname(filePath));
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = parseFrontmatter(fileContent, filePath);
      
      if (parsed.data.slug === slug || filename === slug) {
        if (!newest || stat.mtimeMs > newest.mtime) {
          newest = { ...parsed, mtime: stat.mtimeMs };
        }
      }
    } catch (e) {}
  }

  return newest;
}

export function getStructuredArticleBySlug(slug: string): AeternaArticle | null {
  const filePath = path.join(jsonArticlesDirectory, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as AeternaArticle;
  } catch (e) {
    console.error(`Error loading JSON article ${slug}:`, e);
    return null;
  }
}

/**
 * Returns the article to render, preferring the source that was modified most
 * recently: the structured JSON or the raw markdown. Editing the markdown file
 * takes effect immediately; regenerating the JSON makes it win again.
 */
export function getArticleForRender(slug: string): AeternaArticle | null {
  const files = getAllMarkdownFiles();
  let newestMd: { data: ArticleFrontmatter; content: string; mtime: number } | null = null;

  for (const filePath of files) {
    try {
      const stat = fs.statSync(filePath);
      const filename = path.basename(filePath, path.extname(filePath));
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = parseFrontmatter(fileContent, filePath);

      if (parsed.data.slug === slug || filename === slug) {
        if (!newestMd || stat.mtimeMs > newestMd.mtime) {
          newestMd = { ...parsed, mtime: stat.mtimeMs };
        }
      }
    } catch (e) {}
  }

  const jsonPath = path.join(jsonArticlesDirectory, `${slug}.json`);
  let jsonMtime = 0;
  if (fs.existsSync(jsonPath)) {
    try { jsonMtime = fs.statSync(jsonPath).mtimeMs; } catch (e) {}
  }

  if (newestMd && newestMd.mtime > jsonMtime) {
    return adaptMarkdownToAeterna(newestMd);
  }

  return getStructuredArticleBySlug(slug);
}

export function getAllStructuredArticleSlugs(): string[] {
  if (!fs.existsSync(jsonArticlesDirectory)) return [];
  const files = fs.readdirSync(jsonArticlesDirectory);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

export function adaptMarkdownToAeterna(mdData: { data: ArticleFrontmatter; content: string }): AeternaArticle {
  const content = mdData.content;
  const secciones: any[] = [];
  let introduccion = "";

  const nivelActivoRegex = /<NivelActivo\s+id=["']([^"']+)["']>([\s\S]*?)<\/NivelActivo>/gi;
  const matches = Array.from(content.matchAll(nivelActivoRegex));

  if (matches.length > 0) {
    const firstMatchIndex = matches[0].index || 0;
    introduccion = content.substring(0, firstMatchIndex).replace(/^---[\s\S]*?---/, '').trim();

    matches.forEach((match) => {
      const layerIdRaw = match[1].toLowerCase().trim();
      const layerBody = match[2].trim();

      let capaKey = 'principiante';
      if (layerIdRaw === 'fundamentos' || layerIdRaw === 'principiante' || layerIdRaw === 'capa1') {
        capaKey = 'principiante';
      } else if (layerIdRaw === 'profundizacion' || layerIdRaw === 'exegesis' || layerIdRaw === 'intermedio' || layerIdRaw === 'capa2') {
        capaKey = 'intermedio';
      } else if (layerIdRaw === 'frontera' || layerIdRaw === 'avanzado' || layerIdRaw === 'capa3') {
        capaKey = 'avanzado';
      }

      const rawBlocks = layerBody.split(/(?=^#{1,3}\s+)/m);
      rawBlocks.forEach((blockStr, index) => {
        const trimmed = blockStr.trim();
        if (!trimmed) return;

        const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/m);
        if (headingMatch) {
          const fullHeadingLine = headingMatch[0];
          const titleLine = headingMatch[2].trim();
          const body = trimmed.substring(fullHeadingLine.length).trim();
          const secId = `${capaKey}-${titleLine.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;

          secciones.push({
            id: secId || `${capaKey}-sec-${index}`,
            titulo: titleLine,
            capa: capaKey,
            niveles: {
              [capaKey]: body,
              principiante: body,
              intermedio: body,
              avanzado: body
            },
            acciones: []
          });
        } else {
          secciones.push({
            id: `${capaKey}-intro-${index}`,
            titulo: `Índice de ${capaKey === 'principiante' ? 'Fundamentos' : capaKey === 'intermedio' ? 'Profundización' : 'Frontera'}`,
            capa: capaKey,
            niveles: {
              [capaKey]: trimmed,
              principiante: trimmed,
              intermedio: trimmed,
              avanzado: trimmed
            },
            acciones: []
          });
        }
      });
    });
  } else {
    const rawBlocks = content.split(/(?=^#{1,3}\s+)/m);
    rawBlocks.forEach((blockStr, index) => {
      const trimmed = blockStr.trim();
      if (!trimmed) return;

      const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/m);
      if (headingMatch) {
        const fullHeadingLine = headingMatch[0];
        const titleLine = headingMatch[2].trim();
        const body = trimmed.substring(fullHeadingLine.length).trim();
        const secId = titleLine.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

        secciones.push({
          id: secId || `seccion-${index}`,
          titulo: titleLine,
          niveles: {
            principiante: body,
            intermedio: body,
            avanzado: body
          },
          acciones: []
        });
      } else {
        if (index === 0 || !introduccion) {
          introduccion = trimmed;
        } else {
          secciones.push({
            id: `seccion-${index}`,
            titulo: `Hito ${secciones.length + 1}`,
            niveles: {
              principiante: trimmed,
              intermedio: trimmed,
              avanzado: trimmed
            },
            acciones: []
          });
        }
      }
    });
  }

  if (secciones.length === 0 && content.trim()) {
    secciones.push({
      id: "seccion-principal",
      titulo: mdData.data.title || "Contenido Principal",
      niveles: {
        principiante: content,
        intermedio: content,
        avanzado: content
      },
      acciones: []
    });
  }

  return {
    metadata: mdData.data,
    introduccion,
    secciones,
    conclusion: ""
  };
}
