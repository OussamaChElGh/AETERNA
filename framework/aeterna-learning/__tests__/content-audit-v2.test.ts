import fs from 'fs';
import path from 'path';
import { auditArticle } from '../index';
import { extractVisualsFromMDX, analyzeVisuals } from '../analyzers/visual-analyzer';
import { analyzeDiscoverability } from '../analyzers/discoverability-analyzer';

function runContentAuditV2Tests() {
  console.log('====================================================');
  console.log('   RUNNING AETERNA CONTENT AUDIT V2 TESTS           ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. VISUAL ANALYSIS TESTS
  const sampleMDX = `
# Test Article
![Esquema de fuerza](https://example.com/esquema.png "Diagrama de cuerpo libre")
![](https://images.unsplash.com/photo-12345)
<Image src="https://example.com/grafico.png" alt="Gráfica de aceleración vs tiempo" caption="Relación lineal" />

Se explica el paso 1, el paso 2 y el paso 3 del proceso de medición sin incluir diagrama alguno.
`;

  const layers = [{ id: 'inicio' as const, startLine: 1, endLine: 20, content: sampleMDX }];
  const visuals = extractVisualsFromMDX(sampleMDX, layers);

  assert(visuals.length === 3, '1. Visuals: Extrae correctamente 3 imágenes del MDX');
  assert(visuals.some(v => v.category === 'DATA_VISUALIZATION'), '2. Visuals: Clasifica correctamente visualización de datos');
  assert(visuals.some(v => v.category === 'DECORATIVE'), '3. Visuals: Clasifica correctamente imagen decorativa de Unsplash');
  assert(visuals.some(v => v.hasAccessibility === false), '4. Visuals: Detecta inaccesibilidad cuando falta alt text descriptivo');

  const visualAnalysis = analyzeVisuals(visuals, sampleMDX, { h2: ['Inicio'], h3: [] });
  assert(visualAnalysis.visualOpportunities.some(o => o.suggestedType === 'PROCESS'), '5. Visuals: Detecta oportunidad visual de proceso cuando hay pasos descritos sin diagrama');

  // 2. DISCOVERABILITY / SEO TESTS
  const frontmatter = {
    title: 'Cómo Piensa un Físico: Medición, Modelos y Estimación',
    description: 'Aprende a pensar como un físico: domina el arte de medir, estimar lo imposible y construir modelos.',
    slug: 'como-piensa-un-fisico',
    tags: ['física', 'medición', 'estimación']
  };

  const discoverability = analyzeDiscoverability(
    frontmatter,
    sampleMDX + ' Se define como la propiedad fundamental de medir.',
    ['1. El arte de medir'],
    [],
    'ciencias',
    'fisica'
  );

  assert(discoverability.technicalMetrics.hasTitle === true, '6. Discoverability: Valida presencia de título');
  assert(discoverability.technicalMetrics.hasValidSlug === true, '7. Discoverability: Valida slug SEO-friendly');
  assert(discoverability.searchIntentAspects.some(a => a.aspect.includes('Definición')), '8. Discoverability: Evalúa cobertura de intención de búsqueda para definiciones');

  // 3. FULL AUDIT REGRESSION ON REAL ARTICLES
  const demoPath = path.join(process.cwd(), 'content/guias/ciencias_naturales/fisica/demo-pedagogical-blocks.md');
  if (fs.existsSync(demoPath)) {
    const demoReport = auditArticle(demoPath, 'bachillerato');
    assert(demoReport.totalScore >= 60, '9. Regresión: demo-pedagogical-blocks.md audita exitosamente con puntuación aceptable');
    assert(demoReport.visualAnalysis !== undefined, '10. Regresión: demo-pedagogical-blocks.md incluye análisis visual en el informe');
    assert(demoReport.discoverabilityAnalysis !== undefined, '11. Regresión: demo-pedagogical-blocks.md incluye análisis de discoverability en el informe');
  }

  const metodoPath = path.join(process.cwd(), 'content/guias/ciencias_naturales/fisica/fisica-1-4-metodo.md');
  if (fs.existsSync(metodoPath)) {
    const metodoReport = auditArticle(metodoPath, 'bachillerato');
    assert(metodoReport.totalScore >= 70, '12. Regresión: fisica-1-4-metodo.md supera los Quality Gates con status PASSED');
    assert(Array.isArray(metodoReport.crossDimensionInterventions), '13. Cross-Dimension: Genera lista estructurada de intervenciones recomendadas');
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} tests.\n`);
  if (failed > 0) process.exit(1);
}

runContentAuditV2Tests();
