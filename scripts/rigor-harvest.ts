import { harvest, loadCorpus } from '../framework/aeterna-learning/rigor/harvest';

function formatCorpus(slug: string, topic: string) {
  const corpus = loadCorpus(slug);
  if (!corpus) {
    console.log(`[Rigor] No hay corpus cacheado para "${slug}"`);
    return;
  }
  console.log(`\n=== CORPUS: ${corpus.topic} ===`);
  console.log(`Timestamp: ${corpus.harvestedAt}`);
  console.log(`Total entradas: ${corpus.totalEntries}`);
  console.log(`\nFuentes:`);
  for (const s of corpus.sources) {
    console.log(`  ${s.name.padEnd(15)} tier: ${s.tier.padEnd(25)} entries: ${s.entriesCount}`);
  }
  console.log(`\nEntradas por tipo:`);
  const byType: Record<string, number> = {};
  for (const e of corpus.entries) {
    byType[e.type] = (byType[e.type] || 0) + 1;
  }
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type.padEnd(18)} ${count}`);
  }
  console.log('');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Aeterna Rigor Harvest CLI v1.0

Usage:
  npm run rigor:harvest -- <slug> <topic>
  npm run rigor:harvest -- <slug> <topic> --dry      (solo muestra corpus cacheado)

Examples:
  npm run rigor:harvest -- metodo-cientifico "Método Científico"
  npm run rigor:harvest -- trabajo-energia "Trabajo y Energía"
  npm run rigor:harvest -- cinematica "Cinemática"
  npm run rigor:harvest -- metodo-cientifico "Método Científico" --dry
`);
    process.exit(0);
  }

  const slug = args[0];
  const topic = args.slice(1).filter(a => a !== '--dry').join(' ');

  if (args.includes('--dry') || !topic) {
    formatCorpus(slug, topic || slug);
    return;
  }

  console.log(`[Rigor] Cosechando corpus para "${topic}" (slug: ${slug})...\n`);
  const corpus = await harvest(topic, 'fisica', { saveToFile: true, slug });

  console.log(`\n[Cosecha completada]`);
  console.log(`  Entradas: ${corpus.totalEntries}`);
  console.log(`  Fuentes:  ${corpus.sources.map(s => s.name).join(', ')}`);
  console.log(`  Archivo:  data/rigor/${slug}.corpus.json`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
