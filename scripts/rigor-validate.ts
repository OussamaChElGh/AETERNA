import { validate, loadCorpus, harvest } from '../framework/anektia-learning/rigor';

function formatReport(report: ReturnType<typeof validate>, articleSlug: string) {
  console.log(`\n=== INFORME DE RIGOR: ${articleSlug} ===`);
  console.log(`Puntuación: ${report.rigorScore}/100`);
  console.log(`  Cobertura (×0.6): ${report.coverageScore}/60   (${report.claimsMatched}/${report.totalClaims} claims)`);
  console.log(`  Precisión  (×0.4): ${report.precisionScore}/40   (${report.contradictions} contradicciones)`);
  console.log('');

  if (report.corrections.length > 0) {
    console.log('--- CORRECCIONES (MUST_FIX) ---');
    for (const c of report.corrections) {
      console.log(`  [${c.severity}] ${c.sourceName}`);
      console.log(`    Falta: ${c.articleExcerpt}`);
      console.log(`    Esperado: ${c.expected}`);
      console.log(`    Fuente: ${c.sourceUrl}`);
      console.log('');
    }
  }

  if (report.missingCoreClaims.length > 0) {
    console.log(`--- CLAIMS NO CUBIERTOS (${report.missingCoreClaims.length}) ---`);
    for (const m of report.missingCoreClaims.slice(0, 8)) {
      console.log(`  ${m.entry.type.padEnd(14)} [${m.entry.source}] ${m.entry.text.slice(0, 100)}`);
    }
    if (report.missingCoreClaims.length > 8) {
      console.log(`  ... y ${report.missingCoreClaims.length - 8} más`);
    }
    console.log('');
  }

  console.log(`\n${report.summary}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Anektia Rigor Validator CLI v1.0

Usage:
  npm run rigor:validate -- <slug> [--harvest <topic>]

Examples:
  npm run rigor:validate -- metodo-cientifico
  npm run rigor:validate -- metodo-cientifico --harvest "Método Científico"
  npm run rigor:validate -- data/articles/mecanica-clasica.json
`);
    process.exit(0);
  }

  const target = args[0];
  const harvestIndex = args.indexOf('--harvest');
  let slug = target;

  if (harvestIndex !== -1 && args[harvestIndex + 1]) {
    const topic = args[harvestIndex + 1];
    console.log(`[Rigor] Cosechando corpus primero...`);
    await harvest(topic, 'fisica', { saveToFile: true, slug });
  }

  let corpus = loadCorpus(target);
  if (!corpus) {
    const slugMatch = target.match(/([^\/\\]+)\.(?:json|outline\.json)$/);
    if (slugMatch) slug = slugMatch[1];
    corpus = loadCorpus(slug);
  }

  if (!corpus) {
    console.error(`Error: No hay corpus para "${slug}". Ejecuta primero: npm run rigor:harvest -- ${slug} "<tema>"`);
    process.exit(1);
  }

  const report = validate(target, corpus);
  formatReport(report, slug);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
