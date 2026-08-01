import { auditStructuredArticle, formatTerminalReport } from '../framework/aeterna-learning';

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Aeterna Structured Auditor CLI v1.0

Audita un articulo JSON (data/articles/*.json) directamente, sin pasar por Markdown.

Usage:
  npm run audit:structured -- <slug>
  npm run audit:structured -- <slug> --json [output-path]

Examples:
  npm run audit:structured -- trabajo-energia
  npm run audit:structured -- termodinamica
  npm run audit:structured -- mecanica-clasica --json report.json
`);
    process.exit(0);
  }

  const slug = args.find(a => !a.startsWith('--'));
  if (!slug) {
    console.error('Error: Indica el slug del articulo (ej: trabajo-energia).');
    process.exit(1);
  }

  const jsonIndex = args.indexOf('--json');
  const isJson = jsonIndex !== -1;
  let outputPath: string | null = null;
  if (isJson && args[jsonIndex + 1] && !args[jsonIndex + 1].startsWith('--')) {
    outputPath = args[jsonIndex + 1];
  }

  try {
    const report = auditStructuredArticle(slug);

    if (isJson) {
      const jsonStr = JSON.stringify(report, null, 2);
      if (outputPath) {
        require('fs').writeFileSync(require('path').resolve(process.cwd(), outputPath), jsonStr, 'utf8');
        console.log(`Reporte JSON guardado en: ${outputPath}`);
      } else {
        console.log(jsonStr);
      }
    } else {
      console.log(formatTerminalReport(report));
    }
  } catch (err: any) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
