import { detectArticleType } from '../analyzers/article-type-analyzer';
import { evaluateScoring, loadArticleTypeRules } from '../scoring/scoring-engine';
import { loadLearningProfile } from '../index';
import { ParsedArticleStructure } from '../types';

function createMockParsedArticle(overrides: Partial<ParsedArticleStructure> = {}): ParsedArticleStructure {
  const defaultBody = `# Test Article
## 1. Introducción
Texto de introducción sobre conceptos.
## 2. Desarrollo
Texto de desarrollo sobre modelos sencillos.
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

function runCalibrationTests() {
  console.log('====================================================');
  console.log('    RUNNING ANEKTIA FINAL CALIBRATION TESTS        ');
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

  // Test 1: Explicar razonamiento ≠ practicar razonamiento
  {
    const mock = createMockParsedArticle({
      rawBody: 'Explicación profunda de la estimación de Fermi y de la simplificación de modelos físicos.',
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: '¿Qué es una magnitud física?', detectedCognitiveLevels: ['conceptual_explain'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.reasoningAnalysis.contentScore > 50 && 
      report.reasoningAnalysis.practiceScore < 50 && 
      report.reasoningAnalysis.weightedScore < 12,
      '1. Explicar razonamiento ≠ practicar razonamiento (Content 100%, Practice 15% -> Weighted < 12)'
    );
  }

  // Test 2: Un artículo con buen contenido conceptual pero poca práctica de reasoning no obtiene máxima puntuación
  {
    const mock = createMockParsedArticle({
      rawBody: 'Explicación de modelos físicos y estimación.',
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Defina unidad base', detectedCognitiveLevels: ['conceptual_explain'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(report.scores.razonamiento < 15 && report.totalScore < 90, '2. Buen contenido conceptual sin práctica de razonamiento no obtiene 15/15 ni status EXCELENTE');
  }

  // Test 3: Un interactivo presente no obtiene automáticamente 10/10
  {
    const mock = createMockParsedArticle({
      interactives: [
        {
          type: 'AnektiaDecisionBox',
          name: 'DecisionBox',
          line: 10,
          interactiveValue: {
            score: 3,
            criteria: { manipulateVariables: true, observeDynamicChanges: true, experiment: false, immediateFeedback: true, visualizeHardConcept: false },
            interpretation: 'opcional'
          }
        }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(report.scores.interactividad < 10, '3. Interactivo presente no obtiene automáticamente 10/10', `Score interactividad: ${report.scores.interactividad}/10`);
  }

  // Test 4: Cuatro ejercicios con el mismo formato UI pueden tener alta variedad cognitiva
  {
    const mock = createMockParsedArticle({
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: '¿Qué es el metro?', detectedCognitiveLevels: ['conceptual_explain'] },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Calcule la velocidad', detectedCognitiveLevels: ['procedural_apply'] },
        { id: '3', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Estime la cantidad de afinadores de Fermi', detectedCognitiveLevels: ['reasoning_estimate'] },
        { id: '4', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Justifique en un contexto cotidiano', detectedCognitiveLevels: ['transfer_new_context'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(report.practiceEvaluation.cognitiveVariety.status === 'PASS', '4. Cuatro ejercicios del mismo formato UI con distintos niveles cognitivos obtienen PASS en variedad cognitiva');
  }

  // Test 5: Cuatro componentes UI distintos pueden tener baja variedad cognitiva
  {
    const mock = createMockParsedArticle({
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: '¿Qué es la longitud?', detectedCognitiveLevels: ['conceptual_explain'] },
        { id: '2', type: 'AnektiaDecisionBox', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: '¿Qué es la masa?', detectedCognitiveLevels: ['conceptual_explain'] },
        { id: '3', type: 'StandardCodeBlock', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: '¿Qué es el tiempo?', detectedCognitiveLevels: ['conceptual_explain'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(report.practiceEvaluation.cognitiveVariety.status === 'INSUFFICIENT', '5. Componentes UI distintos pero todos conceptual_explain obtienen INSUFFICIENT en variedad cognitiva');
  }

  // Test 6: NOT_EVALUATED reduce confidence pero no equivale automáticamente a FAIL
  {
    const mock = createMockParsedArticle({
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
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Estime Fermi', detectedCognitiveLevels: ['reasoning_estimate'] },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Calcule la conversión', detectedCognitiveLevels: ['procedural_apply'] },
        { id: '3', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Justifique la respuesta', detectedCognitiveLevels: ['reasoning_justify'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.practiceEvaluation.competencyCoverage.status === 'NOT_EVALUATED' &&
      report.practiceEvaluation.confidence === 'MEDIUM' &&
      report.qualityGatesPassed,
      '6. NOT_EVALUATED reduce confidence a MEDIUM pero no falla Quality Gates'
    );
  }

  // Test 7: Evidence Trace explica las razones del score
  {
    const mock = createMockParsedArticle();
    const report = evaluateScoring(mock, profile);
    assert(report.evidenceTraces.length >= 2, '7. Evidence Trace contiene explicaciones detalladas para las puntuaciones principales');
  }

  console.log(`\nCalibration Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runCalibrationTests();
