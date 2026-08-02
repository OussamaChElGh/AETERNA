import fs from 'fs';
import path from 'path';
import { analyzeBranch, buildOutline, outlineToJson, loadCurriculum } from '../framework/aeterna-learning/planning';
import { writeArticleToContent } from '../framework/aeterna-learning/serializers/markdown-serializer';

function formatTerminalAnalysis(branchId: string): string {
  const result = analyzeBranch(branchId);
  const lines: string[] = [];
  lines.push(`=== ANALISIS DE RAMA: ${result.branchName} (${result.branchId}) ===`);
  lines.push(`Perfil: ${result.profileId}`);
  lines.push(`Cobertura: ${result.existingArticles}/${result.plannedArticles} articulos (${result.coveragePercentage}%)`);
  lines.push('');

  for (const level of result.levels) {
    const byLevel = result.articlesByLevel[level.nivel];
    if (!byLevel) continue;
    lines.push(`--- Nivel ${level.nivel}: ${level.titulo} ---`);
    lines.push(`  Planificados: ${byLevel.planned.length}`);
    lines.push(`  Existentes:   ${byLevel.existing.length}`);
    for (const gap of result.gaps.filter(g => g.nivel === level.nivel)) {
      lines.push(`  [${gap.severity.padEnd(8)}] ${gap.slug}: ${gap.reason}`);
    }
    lines.push('');
  }

  lines.push(`=== RESUMEN DE GAPS (${result.gaps.length}) ===`);
  for (const gap of result.gaps) {
    lines.push(`[${gap.severity.padEnd(8)}] ${gap.slug} (nivel ${gap.nivel}): ${gap.reason}`);
    lines.push(`        -> ${gap.suggestedAction}`);
  }

  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Aeterna Branch Planner CLI v1.0

Usage:
  npm run plan:branch -- <branch-id> [--outline <slug> [--output <path>]]

Commands:
  <branch-id>              Analiza la rama: inventario real vs curriculum ideal (gaps)
  --outline <slug>         Genera el esqueleto AeternaArticle para un articulo del curriculum
  --output <path>          Ruta donde guardar el esqueleto (por defecto data/articles/<slug>.outline.json)

Examples:
  npm run plan:branch -- fisica
  npm run plan:branch -- fisica --outline metodo-cientifico
  npm run plan:branch -- fisica --outline trabajo-energia --output data/articles/trabajo-energia.outline.json
`);
    process.exit(0);
  }

  const branchId = args.find(arg => !arg.startsWith('--'));
  if (!branchId) {
    console.error('Error: Debes indicar el branch-id (ej: fisica).');
    process.exit(1);
  }

  const outlineIndex = args.indexOf('--outline');
  const hasOutline = outlineIndex !== -1 && args[outlineIndex + 1];
  const outlineSlug = hasOutline ? args[outlineIndex + 1] : null;

  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 && args[outputIndex + 1] ? args[outputIndex + 1] : null;

  try {
    if (outlineSlug) {
      const curriculum = loadCurriculum(branchId);
      const outline = buildOutline(curriculum, outlineSlug);
      const json = outlineToJson(outline);

      const finalPath = outputPath || path.join('data', 'articles', `${outlineSlug}.outline.json`);
      const absPath = path.resolve(process.cwd(), finalPath);
      fs.writeFileSync(absPath, json, 'utf8');
      console.log(`Esqueleto generado en: ${finalPath}`);
      console.log(`  - Secciones: ${outline.secciones.length}`);
      console.log(`  - Nivel: ${outline.metadata.nivel} (${outline.metadata.nivel_titulo})`);
      console.log(`  - Prerequisitos sugeridos: ${loadCurriculum(branchId).articles.find(a => a.slug === outlineSlug)?.prerequisites?.join(', ') || 'ninguno'}`);

      const contentPath = curriculum.contentPath || 'ciencias_naturales/fisica';
      try {
        const mdPath = writeArticleToContent(outline, contentPath, branchId);
        console.log(`  - Markdown: ${path.relative(process.cwd(), mdPath)}`);
      } catch (e: any) {
        console.log(`  - Markdown: error (${e.message})`);
      }
      return;
    }

    console.log(formatTerminalAnalysis(branchId));
  } catch (err: any) {
    console.error('Error en el planificador:', err.message || err);
    process.exit(1);
  }
}

main();
