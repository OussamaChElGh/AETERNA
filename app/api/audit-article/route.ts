import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { auditArticle } from '@/framework/aeterna-learning';

const contentDirectories = [
  path.join(process.cwd(), 'content', 'guias'),
  path.join(process.cwd(), '..', 'AETERNA-main', 'src', 'content', 'guias'),
];

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

function findMarkdownFile(slug: string): string | null {
  for (const dir of contentDirectories) {
    if (!fs.existsSync(dir)) continue;
    const files = getFilesRecursively(dir);
    for (const filePath of files) {
      const filename = path.basename(filePath, path.extname(filePath));
      if (filename === slug) return filePath;
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (frontmatterMatch) {
          const slugMatch = frontmatterMatch[1].match(/slug:\s*"?([^"\s]+)"?/);
          if (slugMatch && slugMatch[1] === slug) return filePath;
        }
      } catch {}
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const mdPath = findMarkdownFile(slug);
    if (!mdPath) {
      return NextResponse.json({ error: `Markdown file for "${slug}" not found` }, { status: 404 });
    }

    const report = auditArticle(mdPath, 'bachillerato');
    return NextResponse.json({ report });
  } catch (err: any) {
    console.error('Audit error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
