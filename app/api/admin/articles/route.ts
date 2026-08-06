import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');

export async function GET() {
  try {
    if (!fs.existsSync(ARTICLES_DIR)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
    const articles = files.map(file => {
      const filePath = path.join(ARTICLES_DIR, file);
      const stat = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);

      return {
        slug: json.metadata?.slug || file.replace('.json', ''),
        title: json.metadata?.title || 'Sin título',
        description: json.metadata?.description || '',
        category: json.metadata?.category || '',
        subcategory: json.metadata?.subcategory || '',
        nivel: json.metadata?.nivel || 0,
        orden: json.metadata?.orden || 0,
        tipo: json.metadata?.tipo || '',
        tags: json.metadata?.tags || [],
        image: json.metadata?.image || '',
        date: json.metadata?.date || '',
        author: json.metadata?.author || '',
        seccionesCount: json.secciones?.length || 0,
        hasCuaderno: !!json.cuaderno && Object.keys(json.cuaderno).length > 0,
        fileSize: stat.size,
        lastModified: stat.mtimeMs,
      };
    });

    articles.sort((a, b) => {
      if (a.nivel !== b.nivel) return a.nivel - b.nivel;
      if (a.orden !== b.orden) return a.orden - b.orden;
      return a.title.localeCompare(b.title);
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error listing articles:', error);
    return NextResponse.json(
      { error: 'Error al listar artículos' },
      { status: 500 }
    );
  }
}
