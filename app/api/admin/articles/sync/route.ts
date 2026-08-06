import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { serializeArticleToMarkdown, writeArticleToContent } from '@/framework/anektia-learning/serializers/markdown-serializer';
import { loadCurriculum } from '@/framework/anektia-learning/planning/analyze-branch';

const JSON_DIR = path.join(process.cwd(), 'data', 'articles');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, branchId = 'fisica' } = body;

    let curriculum = null;
    try { curriculum = loadCurriculum(branchId); } catch (e) {}

    if (slug === '__all__') {
      if (!curriculum) {
        return NextResponse.json(
          { error: `Curriculum "${branchId}" no encontrado` },
          { status: 400 }
        );
      }
      const plannedSlugs = curriculum.articles.map((a: any) => a.slug);
      const results: { slug: string; success: boolean; mdPath?: string; error?: string }[] = [];
      
      for (const articleSlug of plannedSlugs) {
        const jsonPath = path.join(JSON_DIR, `${articleSlug}.json`);
        if (!fs.existsSync(jsonPath)) {
          results.push({ slug: articleSlug, success: false, error: 'JSON no encontrado' });
          continue;
        }
        try {
          const article = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          const contentPath = curriculum.contentPath || 'ciencias_naturales/fisica';
          const mdPath = writeArticleToContent(article, contentPath, branchId);
          
          const future = new Date(Date.now() + 2000);
          fs.utimesSync(jsonPath, future, future);
          
          results.push({ slug: articleSlug, success: true, mdPath: path.relative(process.cwd(), mdPath) });
        } catch (e: any) {
          results.push({ slug: articleSlug, success: false, error: e.message });
        }
      }
      
      return NextResponse.json({
        success: true,
        total: plannedSlugs.length,
        synced: results.filter(r => r.success).length,
        results,
      });
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Se requiere slug o __all__' },
        { status: 400 }
      );
    }

    const jsonPath = path.join(JSON_DIR, `${slug}.json`);
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: `JSON no encontrado: ${slug}` },
        { status: 404 }
      );
    }

    const article = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const contentPath = curriculum?.contentPath || 'ciencias_naturales/fisica';
    const mdContent = serializeArticleToMarkdown(article);
    const mdPath = writeArticleToContent(article, contentPath, branchId);

    const future = new Date(Date.now() + 2000);
    fs.utimesSync(jsonPath, future, future);

    return NextResponse.json({
      success: true,
      slug,
      mdPath: path.relative(process.cwd(), mdPath),
      lines: mdContent.split('\n').length,
      sections: article.secciones?.length || 0,
    });
  } catch (error) {
    console.error('Error syncing article:', error);
    return NextResponse.json(
      { error: 'Error al sincronizar artículo' },
      { status: 500 }
    );
  }
}
