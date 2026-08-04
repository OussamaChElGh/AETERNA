import fs from 'fs';
import path from 'path';
import { auditArticle, formatTerminalReport, formatJsonReport } from '../framework/anektia-learning';

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Anektia Content Auditor CLI v1.0

Usage:
  npm run audit:content -- <path-to-markdown-file> [--json [output-path]] [--profile bachillerato]

Examples:
  npm run audit:content -- content/guias/ciencias_naturales/fisica/fisica-1-4-metodo.md
  npm run audit:content -- content/guias/ciencias_naturales/fisica/fisica-1-4-metodo.md --json
  npm run audit:content -- content/guias/ciencias_naturales/fisica/fisica-1-4-metodo.md --json report.json
`);
    process.exit(0);
  }

  const jsonIndex = args.indexOf('--json');
  const isJson = jsonIndex !== -1;
  let jsonOutputPath: string | null = null;
  if (isJson && args[jsonIndex + 1] && !args[jsonIndex + 1].startsWith('--')) {
    jsonOutputPath = args[jsonIndex + 1];
  }

  const profileIndex = args.indexOf('--profile');
  let profileId = 'bachillerato';
  if (profileIndex !== -1 && args[profileIndex + 1]) {
    profileId = args[profileIndex + 1];
  }

  // First positional argument that is not a flag/option is the target file
  const targetFile = args.find(arg => !arg.startsWith('--') && arg !== jsonOutputPath);

  if (!targetFile) {
    console.error('Error: Debes proporcionar la ruta a un archivo Markdown para auditar.');
    process.exit(1);
  }

  const resolvedPath = path.isAbsolute(targetFile) 
    ? targetFile 
    : path.resolve(process.cwd(), targetFile);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: Archivo no encontrado en la ruta "${resolvedPath}"`);
    process.exit(1);
  }

  try {
    const report = auditArticle(resolvedPath, profileId);

    if (isJson) {
      const jsonStr = formatJsonReport(report);
      if (jsonOutputPath) {
        fs.writeFileSync(path.resolve(process.cwd(), jsonOutputPath), jsonStr, 'utf8');
        console.log(`Reporte JSON guardado en: ${jsonOutputPath}`);
      } else {
        console.log(jsonStr);
      }
    } else {
      console.log(formatTerminalReport(report));
    }
  } catch (err: any) {
    console.error('Error durante la auditoría del contenido:', err.message || err);
    process.exit(1);
  }
}

main();
