import fs from 'fs';
import path from 'path';
import { serializeArticleToMarkdown, writeArticleToContent, filenameFromArticle } from '../framework/anektia-learning/serializers/markdown-serializer';
import { loadCurriculum } from '../framework/anektia-learning/planning/analyze-branch';

const JSON_DIR = path.join(process.cwd(), 'data', 'articles');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Anektia Article Sync CLI v1.0

Regenera el archivo Markdown (.md) en content/guias/ a partir del JSON en data/articles/.

Usage:
  npm run article:sync -- <slug> [--branch <branchId>]
  npm run article:sync -- --all [--branch <branchId>]

Examples:
  npm run article:sync -- termodinamica --branch fisica
  npm run article:sync -- mecanica-clasica --branch fisica
  npm run article:sync -- --all --branch fisica
`);
    process.exit(0);
  }

  const isAll = args.includes('--all');
  const branchIndex = args.indexOf('--branch');
  const branchId = branchIndex !== -1 && args[branchIndex + 1] ? args[branchIndex + 1] : 'fisica';
  let curriculum = null;
  try { curriculum = loadCurriculum(branchId); } catch (e) {}

  if (isAll) {
    if (!curriculum) {
      console.error(`Error: Curriculum "${branchId}" no encontrado.`);
      process.exit(1);
    }
    const plannedSlugs = curriculum.articles.map(a => a.slug);
    let count = 0;
    for (const slug of plannedSlugs) {
      const jsonPath = path.join(JSON_DIR, `${slug}.json`);
      if (!fs.existsSync(jsonPath)) continue;
      try {
        const article = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const mdPath = writeArticleToContent(article, curriculum.contentPath || 'ciencias_naturales/fisica', branchId);
        console.log(`  [sync] ${slug} -> ${path.relative(process.cwd(), mdPath)}`);
        count++;
      } catch (e: any) {
        console.error(`  [error] ${slug}: ${e.message}`);
      }
    }
    console.log(`\nSincronizados: ${count} artículos`);
    return;
  }

  const slug = args.filter(a => !a.startsWith('--'))[0];
  if (!slug) {
    console.error('Error: Indica un slug o --all.');
    process.exit(1);
  }

  const jsonPath = path.join(JSON_DIR, `${slug}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON no encontrado: ${jsonPath}`);
    process.exit(1);
  }

  try {
    const article = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const contentPath = curriculum?.contentPath || 'ciencias_naturales/fisica';

    const mdContent = serializeArticleToMarkdown(article);
    const mdPath = writeArticleToContent(article, contentPath, branchId);

    // Touch JSON so it wins mtime over MD (cuaderno, blocks only in JSON)
    const jsonPath2 = path.join(JSON_DIR, `${slug}.json`);
    if (fs.existsSync(jsonPath2)) {
      const future = new Date(Date.now() + 2000);
      fs.utimesSync(jsonPath2, future, future);
    }

    console.log(`MD generado: ${path.relative(process.cwd(), mdPath)}`);
    console.log(`  Secciones: ${article.secciones?.length || 0}`);
    console.log(`  Líneas: ${mdContent.split('\n').length}`);
  } catch (e: any) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

main();
