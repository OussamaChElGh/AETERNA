import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');

const PLACEHOLDER_RE = /\[IMAGEN SUGERIDA:\s*([^\]]*)\]/gi;

function extractPlaceholders(content: string): string[] {
  const found: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(PLACEHOLDER_RE.source, 'gi');
  while ((m = re.exec(content)) !== null) {
    found.push(m[1]?.trim() || '');
  }
  return found;
}

// GET /api/admin/articles/images/placeholders?slug=xyz
// Returns every [IMAGEN SUGERIDA: ...] placeholder with its location in the article.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Parámetro slug requerido' }, { status: 400 });
    }

    const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const placeholders: {
      id: string;
      description: string;
      location: string;
      sectionId: string;
      sectionTitle: string;
      level: string;
    }[] = [];

    const addFrom = (content: string | undefined, sectionId: string, sectionTitle: string, level: string) => {
      if (!content) return;
      const found = extractPlaceholders(content);
      found.forEach((desc, i) => {
        placeholders.push({
          id: `${sectionId}_${level}_${i}`,
          description: desc,
          location: `sección "${sectionTitle}" · ${level}`,
          sectionId,
          sectionTitle,
          level,
        });
      });
    };

    if (article.introduccion) {
      const found = extractPlaceholders(article.introduccion);
      found.forEach((desc, i) => {
        placeholders.push({
          id: `introduccion_${i}`,
          description: desc,
          location: 'Introducción',
          sectionId: '__introduccion__',
          sectionTitle: 'Introducción',
          level: '__introduccion__',
        });
      });
    }

    for (const section of article.secciones || []) {
      addFrom(section.niveles?.principiante, section.id, section.titulo, 'principiante');
      addFrom(section.niveles?.intermedio, section.id, section.titulo, 'intermedio');
      addFrom(section.niveles?.avanzado, section.id, section.titulo, 'avanzado');
    }

    return NextResponse.json({ placeholders, total: placeholders.length });
  } catch (error) {
    console.error('Error scanning placeholders:', error);
    return NextResponse.json({ error: 'Error al escanear placeholders' }, { status: 500 });
  }
}
