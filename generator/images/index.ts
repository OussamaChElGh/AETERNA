import fs from 'fs';
import path from 'path';
import { ImageGenRequest, ImageManifest, ExtractPlaceholderResult, ImageStyle, ImageGenResult } from './types';
import { buildImagePrompt } from './prompt-builder';
import { generateImage } from './gemini-runner';
import { generateImagePollinations } from './pollinations-runner';

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const MANIFEST_DIR = path.join(process.cwd(), 'data', 'images');

const PLACEHOLDER_REGEX = /\[IMAGEN SUGERIDA:\s*([\s\S]*?)\]/g;

function loadArticle(slug: string): any {
  const file = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Artículo JSON no encontrado: ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function parsePlaceholder(raw: string): { description: string; caption: string } {
  let description = raw;
  let caption = '';
  const captionMatch = raw.match(/Pie de foto:\s*["']([^"']+)["']/);
  if (captionMatch) {
    caption = captionMatch[1];
    description = raw.replace(/Pie de foto:\s*["'][^"']+["']/, '').replace(/\s+/g, ' ').trim();
  }
  return { description, caption };
}

export function extractPlaceholders(article: any): ExtractPlaceholderResult[] {
  const results: ExtractPlaceholderResult[] = [];
  let counter = 0;

  for (const sec of article.secciones || []) {
    const niveles = sec.niveles || {};
    for (const layer of ['principiante', 'intermedio', 'avanzado']) {
      const content = niveles[layer];
      if (!content) continue;

      let m: RegExpExecArray | null;
      const localRegex = new RegExp(PLACEHOLDER_REGEX.source, 'g');
      while ((m = localRegex.exec(content)) !== null) {
        const { description, caption } = parsePlaceholder(m[1]);
        results.push({
          description,
          caption,
          sectionId: sec.id,
          layerId: layer,
          raw: m[0],
        });
        counter++;
      }
    }
  }

  return results;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40);
}

function inferStyle(description: string, caption: string): ImageStyle {
  const d = description.toLowerCase() + ' ' + caption.toLowerCase();
  if (d.includes('gráfica') || d.includes('diagrama') || d.includes('esquema') || d.includes('gráfico') || d.includes('tabla')) {
    return 'diagram';
  }
  if (d.includes('foto') || d.includes('fotografía') || d.includes('escena') || d.includes('fotográfica')) {
    return 'cinematic';
  }
  if (d.includes('concepto') || d.includes('abstracto') || d.includes('idea')) {
    return 'conceptual';
  }
  return 'vintage-physics';
}

export async function generateImagesForArticle(
  slug: string,
  options: { model?: string; force?: boolean; provider?: 'gemini' | 'pollinations' | 'auto' } = {}
): Promise<ImageManifest> {
  const provider = options.provider || 'auto';
  const article = loadArticle(slug);
  const placeholders = extractPlaceholders(article);

  if (placeholders.length === 0) {
    throw new Error(`No se encontraron marcadores [IMAGEN SUGERIDA] en ${slug}.`);
  }

  const imgDir = path.join(PUBLIC_IMAGES_DIR, slug);
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
  if (!fs.existsSync(MANIFEST_DIR)) fs.mkdirSync(MANIFEST_DIR, { recursive: true });

  const manifestPath = path.join(MANIFEST_DIR, `${slug}.manifest.json`);
  let existing: ImageManifest | null = null;
  if (!options.force && fs.existsSync(manifestPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as ImageManifest;
    } catch { existing = null; }
  }

  const images: ImageManifest['images'] = [];
  let generatedCount = 0;

  for (let i = 0; i < placeholders.length; i++) {
    const ph = placeholders[i];
    const id = `img-${String(i + 1).padStart(3, '0')}`;
    const fileRel = `/images/${slug}/${id}.webp`;

    // Skip if already generated and file exists (with or without manifest)
    const absFile = path.join(process.cwd(), 'public', fileRel);
    const inManifest = existing && existing.images.find(img => img.id === id);
    if ((inManifest || fs.existsSync(absFile)) && fs.existsSync(absFile)) {
      const prev = existing?.images.find(img => img.id === id);
      if (prev) {
        images.push(prev);
        console.log(`  [${id}] ya generada, omitida`);
      } else {
        console.log(`  [${id}] archivo existe, omitida (sin manifest)`);
      }
      continue;
    }

    const style = inferStyle(ph.description, ph.caption);
    const request: ImageGenRequest = {
      description: ph.description,
      caption: ph.caption,
      sectionId: ph.sectionId,
      layerId: ph.layerId,
      style,
    };

    const prompt = buildImagePrompt(request);

    // Resolve provider: explicit or auto (gemini → pollinations fallback)
    const resolvedProviders = provider === 'auto' ? ['gemini', 'pollinations'] : [provider];

    let result: ImageGenResult | null = null;
    let usedProvider = '';
    for (const p of resolvedProviders) {
      console.log(`  [${id}] generando (${style}) vía ${p}: ${ph.description.slice(0, 60)}...`);
      try {
        if (p === 'pollinations') {
          result = await generateImagePollinations(prompt);
        } else {
          result = await generateImage(prompt, { model: options.model });
        }
        usedProvider = p;
        break;
      } catch (e: any) {
        const isQuota = /429|quota|RESOURCE_EXHAUSTED|exceeded|502|503/i.test(e.message || '');
        console.log(`    ⚠️  ${p} falló${isQuota ? ' (cuota/sobrecarga)' : ''}: ${e.message?.slice(0, 80)}`);
      }
    }

    if (!result) {
      console.log(`    ❌ No se pudo generar ${id} con ningún provider. Se omite.`);
      continue;
    }

    const buf = Buffer.from(result.base64, 'base64');
    const absPath = path.join(process.cwd(), 'public', fileRel);
    fs.writeFileSync(absPath, buf);

    images.push({
      id,
      prompt,
      description: ph.description,
      caption: ph.caption,
      sectionId: ph.sectionId,
      layerId: ph.layerId,
      file: fileRel,
      generatedAt: new Date().toISOString(),
      provider: usedProvider,
    });
    generatedCount++;
  }

  const manifest: ImageManifest = {
    slug,
    aestheticBase: 'vintage-physics',
    generatedAt: new Date().toISOString(),
    images,
    totalGenerated: images.length,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  // Replace placeholders in the article JSON with markdown image references
  let rawJson = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.json`), 'utf8');
  for (let i = 0; i < placeholders.length; i++) {
    const ph = placeholders[i];
    const img = images[i];
    if (!img) continue;
    const mdImage = captionToMarkdown(img);
    rawJson = rawJson.split(ph.raw).join(mdImage);
  }
  fs.writeFileSync(path.join(ARTICLES_DIR, `${slug}.json`), rawJson, 'utf8');

  return manifest;
}

function captionToMarkdown(img: ImageManifest['images'][0], forJson = false): string {
  const newline = forJson ? '\\n\\n' : '\n\n';
  if (img.caption) {
    return `![${img.caption}](${img.file})${newline}*${img.caption}*`;
  }
  return `![${img.description.slice(0, 60)}](${img.file})`;
}

/**
 * Replaces every [IMAGEN SUGERIDA: ...] marker in the article JSON with the
 * generated markdown image reference, using the manifest mapping (by order).
 */
export function replacePlaceholdersInArticle(slug: string): { replaced: number; remaining: number } {
  const articlePath = path.join(ARTICLES_DIR, `${slug}.json`);
  const manifest = loadManifest(slug);
  if (!manifest) {
    throw new Error(`No hay manifest para ${slug}. Genera las imágenes primero.`);
  }

  let rawJson = fs.readFileSync(articlePath, 'utf8');
  let replaced = 0;

  // Find placeholders in order and map to manifest images by index
  const placeholderRegex = new RegExp(PLACEHOLDER_REGEX.source, 'g');
  let m: RegExpExecArray | null;
  let idx = 0;
  const placeholdersFound: string[] = [];
  while ((m = placeholderRegex.exec(rawJson)) !== null) {
    placeholdersFound.push(m[0]);
  }

  for (const raw of placeholdersFound) {
    const img = manifest.images[idx];
    if (!img) break;
    rawJson = rawJson.split(raw).join(captionToMarkdown(img, true));
    replaced++;
    idx++;
  }

  fs.writeFileSync(articlePath, rawJson, 'utf8');
  const remaining = (rawJson.match(/IMAGEN SUGERIDA:/g) || []).length;
  return { replaced, remaining };
}

export function loadManifest(slug: string): ImageManifest | null {
  const file = path.join(MANIFEST_DIR, `${slug}.manifest.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as ImageManifest;
  } catch { return null; }
}

export { slugify };
