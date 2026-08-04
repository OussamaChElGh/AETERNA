import { detectArticleType } from '../analyzers/article-type-analyzer';
import { evaluateScoring } from '../scoring/scoring-engine';
import { loadLearningProfile } from '../index';
import { ParsedArticleStructure } from '../types';

function createMockArticle(overrides: Partial<ParsedArticleStructure> = {}): ParsedArticleStructure {
  return {
    filePath: 'content/test/article.md',
    title: 'Artículo de Prueba',
    slug: 'articulo-prueba',
    author: 'Anektia',
    category: 'ciencias',
    tags: ['física'],
    prerequisites: [],
    rawFrontmatter: {},
    rawBody: `# Título
## 1. Introducción
Texto de introducción.
## 2. Desarrollo
Texto de desarrollo.
## 3. Conclusión
Texto de conclusión.
`,
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
      confidence: 0.9,
      confidenceLevel: 'HIGH',
      alternatives: [],
      signals: ['Mock signal']
    },
    ...overrides
  };
}

const profile = loadLearningProfile('bachillerato');

function runExperienceAuditorTests() {
  console.log('====================================================');
  console.log('   RUNNING LEARNING EXPERIENCE AUDITOR TESTS       ');
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

  // 1. Artículo metodológico con pocos ejercicios -> Cap por Gaps Core y Status NO EXCELENTE
  {
    const mock = createMockArticle({
      title: 'Cómo Piensa un Físico: Medición y Modelos',
      articleTypeResult: {
        detectedType: 'methodological',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.95,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Method signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Estime de forma rápida de Fermi', detectedCognitiveLevels: ['reasoning_estimate'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.learningExperienceAudit !== undefined &&
      report.learningExperienceAudit.coreGapsCount >= 2 &&
      report.totalScore <= 79 &&
      report.status !== 'EXCELENTE',
      '1. Artículo metodológico con grandes gaps de experiencia NO obtiene status EXCELENTE'
    );
  }

  // 2. Artículo conceptual -> Evalúa experiencias conceptuales (EXPLAIN, COMPARE) sin exigir cálculo
  {
    const mock = createMockArticle({
      title: 'Concepto de Campo Gravitatorio y Potencial',
      articleTypeResult: {
        detectedType: 'conceptual',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.9,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Conceptual signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: '¿Cuál es la diferencia entre masa inercial y gravitatoria?', detectedCognitiveLevels: ['conceptual_compare'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.learningExperienceAudit !== undefined &&
      report.recommendedActivityPlan !== undefined &&
      !report.recommendations.some(r => r.includes('numerical')),
      '2. Artículo conceptual evalúa experiencias sin exigir cálculo numérico por defecto'
    );
  }

  // 3. Artículo cuantitativo / problem_solving -> Exige resolución de problemas y cálculo autónomo
  {
    const mock = createMockArticle({
      title: 'Resolución de Problemas de Mecánica Newtoniana',
      articleTypeResult: {
        detectedType: 'problem_solving',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.95,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Problem solving signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Calcule la aceleración del bloque', detectedCognitiveLevels: ['procedural_apply'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.learningExperienceAudit !== undefined &&
      report.learningExperienceAudit.coreExperiences.some(e => e.experienceKey === 'SOLVE_PROBLEM' || e.experienceKey === 'APPLY_PROCEDURE'),
      '3. Artículo de resolución de problemas exige la experiencia SOLVE_PROBLEM / APPLY_PROCEDURE'
    );
  }

  // 4. Artículo con alto potencial interactivo sin interactivo -> Recomienda fuertemente simulación
  {
    const mock = createMockArticle({
      title: 'Simulación y Dinámica de Colisiones en 2D',
      rawBody: 'Texto descriptivo de colisiones elásticas dinámicas con intercambio de momento y velocidad que varía en el tiempo.',
      articleTypeResult: {
        detectedType: 'simulation',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.9,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Simulation signal']
      },
      interactives: []
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.interactiveAnalysis.potential >= 3 || report.warnings.some(w => w.includes('simulation')),
      '4. Artículo con alto potencial interactivo recomienda fuertemente interactivo / simulación'
    );
  }

  // 5. Artículo con poca necesidad de interactividad -> No penaliza seriamente por falta de interactivo
  {
    const mock = createMockArticle({
      title: 'Historia y Definición de las Unidades SI',
      articleTypeResult: {
        detectedType: 'conceptual',
        declaredType: null,
        typeSource: 'inferred',
        confidence: 0.9,
        confidenceLevel: 'HIGH',
        alternatives: [],
        signals: ['Conceptual signal']
      },
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Defina metro', detectedCognitiveLevels: ['conceptual_explain'] }
      ],
      interactives: []
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.interactiveRequirement === 'optional' && report.interactiveAnalysis.status === 'PASS',
      '5. Artículo con poca necesidad interactiva mantiene status PASS en interactividad (opcional)'
    );
  }

  // 6. Plan de Actividades Recomendado (Activity Plan) de alta densidad
  {
    const mock = createMockArticle({
      title: 'Cómo Piensa un Físico: Medición, Modelos y Estimación',
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
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Estime Fermi', detectedCognitiveLevels: ['reasoning_estimate'] }
      ]
    });
    const report = evaluateScoring(mock, profile);
    assert(
      report.recommendedActivityPlan !== undefined &&
      report.recommendedActivityPlan.length >= 3 &&
      report.recommendedActivityPlan.some(plan => plan.purpose.includes('modelo') || plan.purpose.includes('método')),
      '6. Genera un plan de actividades recomendado (Recommended Activity Plan) de alta densidad'
    );
  }

  console.log(`\nExperience Auditor Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runExperienceAuditorTests();
