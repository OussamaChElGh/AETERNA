import fs from 'fs';
import path from 'path';
import { auditArticle } from '../index';
import { identifyTopic } from '../analyzers/topic-identifier';
import { classifySourceTier, rankSources } from '../analyzers/source-ranker';
import { buildKnowledgeModel } from '../experiences/knowledge-model-builder';
import { getCachedKnowledgeModel, setCachedKnowledgeModel, clearBenchmarkCache } from '../experiences/benchmark-cache';
import { analyzeKnowledgeBenchmark } from '../analyzers/knowledge-benchmark-analyzer';
import { LocalReferenceProvider, AcademicProvider } from '../providers/reference-provider';
import { ParsedArticleStructure } from '../types';

function runKnowledgeBenchmarkTests() {
  console.log('====================================================');
  console.log('   RUNNING KNOWLEDGE BENCHMARK FRAMEWORK TESTS     ');
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

  // 1. TOPIC IDENTIFICATION
  const mockParsed: ParsedArticleStructure = {
    filePath: 'test.md',
    title: '1.4 Cómo Piensa un Físico: Medición y Estimación',
    slug: 'como-piensa-un-fisico',
    author: 'Anektia Team',
    category: 'ciencias_naturales',
    subcategory: 'fisica',
    tags: ['física', 'medición', 'estimación', 'incertidumbre'],
    prerequisites: [],
    rawFrontmatter: {},
    rawBody: 'La medición física es el proceso de comparar magnitudes. Toda medida contiene incertidumbre y error. Se define como la relación fundamental. Al simplificar la realidad para construir una representación idealizada, logramos un modelo simplificado. La estimación de Fermi descompone el problema.',
    layers: [],
    exercises: [
      { id: '1', type: 'AnektiaDecisionBox', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Decida' }
    ],
    interactives: [
      { type: 'AnektiaDecisionBox', name: 'DecisionBox', line: 10, interactiveValue: { score: 4, criteria: { manipulateVariables: true, observeDynamicChanges: true, experiment: true, immediateFeedback: true, visualizeHardConcept: true }, interpretation: 'recomendado' } }
    ],
    h2Headings: ['1. El arte de medir', '2. Estimación de Fermi'],
    h3Headings: [],
    mathFormulasCount: 3,
    hasTransitionButtons: true,
    hasProgressHeader: true,
    articleTypeResult: {
      detectedType: 'methodological',
      declaredType: null,
      typeSource: 'inferred',
      confidence: 0.9,
      confidenceLevel: 'HIGH',
      alternatives: [],
      signals: []
    }
  };

  const topicProfile = identifyTopic(mockParsed);
  assert(topicProfile.topic.includes('Medición') || topicProfile.topic.includes('Físico'), '1. Topic Identification: Extrae correctamente el tema del título');
  assert(topicProfile.primaryEntities.includes('medición'), '2. Topic Identification: Identifica entidades primarias clave');
  assert(topicProfile.confidence === 'HIGH', '3. Topic Identification: Determina nivel de confianza de forma determinista');

  // 2. REFERENCE PROVIDERS ABSTRACTION
  const localProvider = new LocalReferenceProvider();
  const academicProvider = new AcademicProvider();
  const localSources = localProvider.getReferences(topicProfile);
  const academicSources = academicProvider.getReferences(topicProfile);
  assert(localSources.length > 0 && academicSources.length > 0, '4. Reference Providers: La abstracción de providers suministra fuentes de referencia');

  // 3. SOURCE RANKING & TIERS
  const tier1 = classifySourceTier('ocw.mit.edu', 'University Physics');
  assert(tier1.tier === 'TIER_1_ACADEMIC' && tier1.authorityScore === 95, '5. Source Ranking: Clasifica fuentes universitarias como Tier 1');

  const ranked = rankSources([
    { name: 'General Blog', domain: 'blog.com' },
    { name: 'MIT Courseware', domain: 'mit.edu' }
  ]);
  assert(ranked[0].domain === 'mit.edu', '6. Source Ranking: Ordena fuentes por nivel de autoridad decreciente');

  // 4. KNOWLEDGE MODEL & SCOPE BOUNDARIES
  clearBenchmarkCache();
  const model = buildKnowledgeModel(topicProfile, ranked);
  assert(model.concepts.some(c => c.scope === 'IN_SCOPE'), '7. Scope Boundaries: Clasifica conceptos dentro del alcance esperable (IN_SCOPE)');
  assert(model.concepts.some(c => c.scope === 'OUT_OF_SCOPE'), '8. Scope Boundaries: Identifica formalmente temas avanzados fuera de alcance (OUT_OF_SCOPE)');

  // 5. BENCHMARK CACHE
  setCachedKnowledgeModel('como-piensa-un-fisico', model);
  const cached = getCachedKnowledgeModel('como-piensa-un-fisico');
  assert(cached !== null && cached.topicProfile.topic === topicProfile.topic, '9. Benchmark Cache: Almacena y recupera modelos por topicSlug');

  // 6. KNOWLEDGE BENCHMARK ANALYZER & SEMANTIC DETECTION
  const benchmarkResult = analyzeKnowledgeBenchmark(mockParsed);
  assert(benchmarkResult.isDiagnosticOnly === true, '10. Diagnostic Mode: Opera en modo diagnóstico inicial protegiendo el score global');
  
  const modelConstDetail = benchmarkResult.conceptDetails.find(cd => cd.concept === 'Construcción de modelos');
  assert(modelConstDetail !== undefined && modelConstDetail.detectionMode === 'SEMANTIC' && modelConstDetail.status === 'PASS', '11. Semantic Detection: Detecta "Construcción de modelos" semánticamente (SEMANTIC coverage PASS)');
  assert(modelConstDetail !== undefined && modelConstDetail.explicitTerminology === 'PARTIAL', '12. Explicit Terminology: Diferencia cobertura de concepto PASS de terminología explícita PARTIAL');

  // 7. SCORE BOUNDS CHECKING
  assert(benchmarkResult.coreConceptCoverageScore <= 100 && benchmarkResult.coreConceptCoverageScore >= 0, '13. Score Bounds: Cobertura conceptual estrictamente dentro de [0, 100]');
  assert(benchmarkResult.referenceAlignmentScore <= 100 && benchmarkResult.referenceAlignmentScore >= 0, '14. Score Bounds: Alineación de referencia estrictamente dentro de [0, 100]');

  // 8. REGRESSION ON REAL ARTICLES & PRIORITIZED PLAN
  const metodoPath = path.join(process.cwd(), 'content/guias/ciencias_naturales/fisica/fisica-1-4-metodo.md');
  if (fs.existsSync(metodoPath)) {
    const report = auditArticle(metodoPath, 'bachillerato');
    assert(report.knowledgeBenchmarkResult !== undefined, '15. Regresión: fisica-1-4-metodo.md incluye Knowledge Benchmark en el informe');
    assert(report.totalScore <= 100 && report.totalScore >= 0, '16. Score Bounds: TotalScore de física-1-4-metodo.md estrictamente <= 100 (100% calibrado)');
    assert(report.scores.activityDiversityScore <= 100, '17. Score Bounds: Activity diversity score estrictamente <= 100 (sin desbordamientos de 110)');
    assert(report.interactiveAnalysis.breakdown !== undefined && typeof report.interactiveAnalysis.breakdown.explanation === 'string', '18. Interactivity Breakdown: Incluye explicación detallada e interpretable del score de interactividad');
    assert(report.crossDimensionInterventions.length > 0 && report.crossDimensionInterventions[0].priorityLevel === 'HIGH', '19. Prioritized Plan: Ordena intervenciones por nivel de prioridad (HIGH -> MEDIUM -> LOW)');
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} tests.\n`);
  if (failed > 0) process.exit(1);
}

runKnowledgeBenchmarkTests();
