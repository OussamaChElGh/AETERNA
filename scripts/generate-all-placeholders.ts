import fs from 'fs';
import path from 'path';
import { generateImagesForArticle, extractPlaceholders } from '../generator/images';
import { execSync } from 'child_process';

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');

async function main() {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
  console.log(`Buscando marcadores [IMAGEN SUGERIDA] en ${files.length} artículos...`);

  const pendingSlugs: string[] = [];

  for (const file of files) {
    const slug = file.replace('.json', '');
    try {
      const article = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
      const placeholders = extractPlaceholders(article);
      if (placeholders.length > 0) {
        pendingSlugs.push(slug);
        console.log(`- ${slug}: ${placeholders.length} imagen(es) sugerida(s)`);
      }
    } catch (e) {
      // skip invalid JSON
    }
  }

  console.log(`\nTotal artículos pendientes: ${pendingSlugs.length}\n`);

  for (const slug of pendingSlugs) {
    console.log(`\n=== Procesando: ${slug} ===`);
    try {
      await generateImagesForArticle(slug, { provider: 'auto' });
      console.log(`✅ Completado: ${slug}`);
    } catch (e: any) {
      console.error(`❌ Error en ${slug}:`, e.message || e);
    }
  }

  console.log('\nSincronizando archivos Markdown en content/guias...');
  try {
    execSync('npx tsx scripts/article-sync.ts --all --branch fisica', { stdio: 'inherit' });
  } catch (e: any) {
    console.error('Error durante la sincronización:', e.message);
  }
}

main();
