import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');

// POST /api/admin/articles/images/assign
// body: { slug, description?, url }
// Replaces the FIRST [IMAGEN SUGERIDA] placeholder (optionally matching `description`)
// with ![description](url). If no description given, replaces the first placeholder.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, description, url } = body;

    if (!slug || !url) {
      return NextResponse.json({ error: 'Se requieren slug y url' }, { status: 400 });
    }

    const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let replaced = 0;

    const replaceIn = (content: string | undefined): string | undefined => {
      if (!content) return content;
      let out = content;
      if (description) {
        const esc = description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`\\[IMAGEN SUGERIDA:\\s*${esc}\\]`, 'i');
        if (re.test(out)) {
          const alt = (description || 'imagen').replace(/\s+/g, '-').toLowerCase().slice(0, 40);
          out = out.replace(re, `![${alt}](${url})`);
          replaced++;
          return out;
        }
        return out; // exact description not found; don't blindly replace
      }
      const re = /\[IMAGEN SUGERIDA:[^\]]*\]/i;
      if (re.test(out)) {
        out = out.replace(re, `![imagen](${url})`);
        replaced++;
      }
      return out;
    };

    if (article.introduccion) {
      const r = replaceIn(article.introduccion);
      if (r !== article.introduccion) {
        article.introduccion = r;
      }
    }

    for (const section of article.secciones || []) {
      for (const level of ['principiante', 'intermedio', 'avanzado']) {
        if (section.niveles?.[level]) {
          const original = section.niveles[level];
          const r = replaceIn(original);
          if (r !== original) {
            section.niveles[level] = r;
          }
        }
      }
    }

    if (replaced === 0) {
      return NextResponse.json(
        { error: description ? `No se encontró placeholder "${description}"` : 'No se encontró ningún placeholder' },
        { status: 404 }
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');

    return NextResponse.json({ success: true, replaced });
  } catch (error) {
    console.error('Error assigning image to placeholder:', error);
    return NextResponse.json({ error: 'Error al asignar imagen' }, { status: 500 });
  }
}
