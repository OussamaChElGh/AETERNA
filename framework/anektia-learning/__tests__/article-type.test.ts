import { detectArticleType } from '../analyzers/article-type-analyzer';
import { evaluateScoring, loadArticleTypeRules } from '../scoring/scoring-engine';
import { loadLearningProfile } from '../index';
import { ParsedArticleStructure } from '../types';

function createMockParsedArticle(overrides: Partial<ParsedArticleStructure> = {}): ParsedArticleStructure {
  const defaultBody = `# Test Article
## 1. Introducción
Texto de introducción.
## 2. Desarrollo
Texto de desarrollo.
## 3. Conclusión
Texto de conclusión.
`;

  return {
    filePath: 'content/test/article.md',
    title: 'Artículo de Prueba',
    slug: 'articulo-prueba',
    author: 'Anektia',
    category: 'ciencias',
    tags: ['física', 'prueba'],
    prerequisites: [],
    rawFrontmatter: {},
    rawBody: defaultBody,
    layers: [
      { id: 'inicio', title: 'Inicio', found: true, startLine: 1, endLine: 5, content: 'Inicio' },
      { id: 'intermedio', title: 'Intermedio', found: true, startLine: 6, endLine: 10, content: 'Intermedio' },
      { id: 'avanzado', title: 'Avanzado', found: true, startLine: 11, endLine: 15, content: 'Avanzado' }
    ],
    exercises: [],
    interactives: [],
    h2Headings: ['1. Introducción', '2. Desarrollo', '3. Conclusión'],
    h3Headings: [],
    mathFormulasCount: 2,
    hasTransitionButtons: true,
    hasProgressHeader: true,
    articleTypeResult: {
      detectedType: 'conceptual',
      declaredType: null,
      typeSource: 'inferred',
      confidence: 0.8,
      confidenceLevel: 'HIGH',
      alternatives: [],
      signals: ['Mock signal']
    },
    ...overrides
  };
}

const profile = loadLearningProfile('bachillerato');

function runTests() {
  console.log('====================================================');
  console.log('        RUNNING ANEKTIA ARTICLE TYPE TESTS          ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (detail) console.error(`   Details: ${detail}`);
      failed++;
    }
  }

  // Test 1: methodological + 3 ejercicios → PASS (no volume warning)
  {
    const mock = createMockParsedArticle({
      title: 'Cómo Piensa un Físico: Medición y Estimación',
      articleTypeResult: {
        detectedType: 'methodological',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.9,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Method signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q1' },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q2' },
        { id: '3', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q3' }
      ]
    });
    const report = evaluateScoring(mock, profile);
    const volumeWarn = report.warnings.some(w => w.includes('Volumen total de ejercicios'));
    assert(!volumeWarn && report.practiceEvaluation.quantity.status === 'PASS', '1. methodological + 3 ejercicios → PASS (no volume warning)');
  }

  // Test 2: problem_solving + 3 ejercicios → warning de volumen / INSUFFICIENT
  {
    const mock = createMockParsedArticle({
      title: 'Colección de Problemas Resueltos de Mecánica',
      articleTypeResult: {
        detectedType: 'problem_solving',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.9,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Problem solving signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q1' },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q2' },
        { id: '3', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q3' }
      ]
    });
    const report = evaluateScoring(mock, profile);
    const volumeWarn = report.warnings.some(w => w.includes('Volumen total de ejercicios'));
    assert(volumeWarn && report.practiceEvaluation.quantity.status === 'INSUFFICIENT', '2. problem_solving + 3 ejercicios → warning de volumen & INSUFFICIENT');
  }

  // Test 3: simulation sin interactivo → warning importante (NOT fail)
  {
    const mock = createMockParsedArticle({
      title: 'Simulación de Colisiones Elásticas en 2D',
      articleTypeResult: {
        detectedType: 'simulation',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.9,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Simulation signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q1' },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q2' },
        { id: '3', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q3' }
      ],
      interactives: []
    });
    const report = evaluateScoring(mock, profile);
    const simWarn = report.warnings.some(w => w.includes('simulation'));
    assert(simWarn && report.qualityGatesPassed, '3. simulation sin interactivo → warning importante (Quality Gates PASS)');
  }

  // Test 4: conceptual + 5 ejercicios → PASS
  {
    const mock = createMockParsedArticle({
      title: 'Concepto de Campo Gravitatorio y Potencial',
      articleTypeResult: {
        detectedType: 'conceptual',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.85,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Conceptual signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q1' },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q2' },
        { id: '3', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q3' },
        { id: '4', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q4' },
        { id: '5', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q5' }
      ]
    });
    const report = evaluateScoring(mock, profile);
    const volumeWarn = report.warnings.some(w => w.includes('Volumen total de ejercicios'));
    assert(!volumeWarn && report.practiceEvaluation.quantity.status === 'PASS', '4. conceptual + 5 ejercicios → PASS');
  }

  // Test 5: artículo sin articleType → inferencia
  {
    const result = detectArticleType({}, 'Cómo Piensa un Físico: Medición y Modelos', 'Contiene estimación de Fermi y mediciones', ['1. El arte de medir'], [], 3, 1);
    assert(result.typeSource === 'inferred' && result.detectedType === 'methodological', '5. artículo sin articleType → inferencia determinista');
  }

  // Test 6: artículo con articleType declarado → declared tiene prioridad
  {
    const result = detectArticleType({ articleType: 'simulation' }, 'Cómo Piensa un Físico', 'Texto sin interactivo', [], [], 1, 0);
    assert(result.typeSource === 'declared' && result.detectedType === 'simulation' && result.confidence === 1.0, '6. artículo con articleType declarado → declared tiene prioridad');
  }

  // Test 7: confidence baja → warning pero no FAIL
  {
    const mock = createMockParsedArticle({
      articleTypeResult: {
        detectedType: 'conceptual',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.4,
        confidenceLevel: 'LOW',
        alternatives: [],
        signals: ['Weak signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q1' },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q2' },
        { id: '3', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q3' },
        { id: '4', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Q4' }
      ]
    });
    const report = evaluateScoring(mock, profile);
    const lowConfWarn = report.warnings.some(w => w.includes('high confidence'));
    assert(lowConfWarn && report.qualityGatesPassed, '7. confidence baja → warning pero Quality Gates PASS');
  }

  // Test 8: ningún tipo debe utilizar accidentalmente el rango global 7–13
  {
    const rules = loadArticleTypeRules();
    const methodologicalRange = rules.methodological.totalRecommended;
    assert(methodologicalRange.min === 3 && methodologicalRange.max === 7, '8. ningún tipo utiliza accidentalmente rango global 7-13 (methodological = 3-7)');
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
