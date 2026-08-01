import { generateImagesForArticle, loadManifest } from '../generator/images';

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Aeterna Image Generator CLI v1.0

Genera las imagenes de un articulo.

Providers:
  pollinations (gratis, sin key)  - por defecto en auto si Gemini falla
  gemini (Nano Banana)            - requiere GEMINI_API_KEY en .env
  auto                            - intenta Gemini, si falla usa Pollinations

Usage:
  npm run images:generate -- <slug> [--provider auto|gemini|pollinations] [--model <modelo>] [--force]

Examples:
  npm run images:generate -- trabajo-energia
  npm run images:generate -- trabajo-energia --provider pollinations
  npm run images:generate -- trabajo-energia --force
`);
    process.exit(0);
  }

  const slug = args.find(a => !a.startsWith('--'));
  if (!slug) {
    console.error('Error: Indica el slug del articulo.');
    process.exit(1);
  }

  const modelIndex = args.indexOf('--model');
  const model = modelIndex !== -1 && args[modelIndex + 1] ? args[modelIndex + 1] : undefined;
  const force = args.includes('--force');
  const providerIndex = args.indexOf('--provider');
  const providerArg = providerIndex !== -1 && args[providerIndex + 1] ? args[providerIndex + 1] : 'auto';
  const provider = ['gemini', 'pollinations', 'auto'].includes(providerArg) ? providerArg as any : 'auto';

  generateImagesForArticle(slug, { model, force, provider })
    .then(manifest => {
      console.log(`\nImagenes generadas para ${slug}: ${manifest.totalGenerated}`);
      console.log(`Manifest: data/images/${slug}.manifest.json`);
      const existing = loadManifest(slug);
      if (existing) {
        existing.images.forEach(img => console.log(`  ${img.id}: ${img.file} (${img.provider || 'n/a'})`));
      }
    })
    .catch(err => {
      console.error('Error:', err.message || err);
      process.exit(1);
    });
}

main();
