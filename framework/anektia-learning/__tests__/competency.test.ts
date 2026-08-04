import { analyzeCompetencies, mapExerciseToCompetencies } from '../analyzers/competency-analyzer';
import { ExtractedExercise, ParsedArticleStructure } from '../types';

function createMockParsedArticle(overrides: Partial<ParsedArticleStructure> = {}): ParsedArticleStructure {
  return {
    filePath: 'content/test/article.md',
    title: 'Cómo Piensa un Físico: Medición, Modelos y Estimación',
    slug: 'articulo-prueba',
    author: 'Anektia',
    category: 'ciencias',
    tags: ['física', 'metodología'],
    prerequisites: [],
    rawFrontmatter: {},
    rawBody: `# Título
## 1. Introducción
Texto de introducción sobre la estimación de fermi y el método científico.
## 2. Desarrollo
Texto de desarrollo sobre simplificación de modelos físicos e incertidumbre.
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
      detectedType: 'methodological',
      declaredType: null,
      typeSource: 'inferred',
      confidence: 0.9,
      confidenceLevel: 'HIGH',
      alternatives: [],
      signals: ['Method signal']
    },
    ...overrides
  };
}

function runMultiCompetencyTests() {
  console.log('====================================================');
  console.log('  RUNNING MULTI-COMPETENCY & INTENT ANALYSIS TESTS  ');
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

  // TEST 1: Un ejercicio puede cubrir varias competencias (Primary + Secondary)
  {
    const ex: ExtractedExercise = {
      id: 'ex3',
      type: 'AnektiaDecisionBox',
      layerId: 'avanzado',
      hasHint: true,
      hasXP: true,
      hasSolution: true,
      questionText: '¿Por qué la estimación de Fermi suele funcionar incluso cuando cada paso individual es bastante incierto?',
      detectedCognitiveLevels: ['reasoning_justify']
    };
    const mapping = mapExerciseToCompetencies(ex);
    assert(
      mapping.primaryCompetency === 'JUSTIFY' && mapping.secondaryCompetencies.length >= 2,
      'TEST 1: Un ejercicio cubre varias competencias (Primary JUSTIFY + secundarias explícitas/implícitas)'
    );
  }

  // TEST 2: Una competencia secundaria puede ser PARTIAL o PASS aunque no sea explícita
  {
    const mock = createMockParsedArticle({
      exercises: [
        {
          id: 'ex3',
          type: 'AnektiaDecisionBox',
          layerId: 'avanzado',
          hasHint: true,
          hasXP: true,
          hasSolution: true,
          questionText: '¿Por qué la estimación de Fermi suele funcionar aunque haya incertidumbre?',
          detectedCognitiveLevels: ['reasoning_justify']
        }
      ]
    });
    const result = analyzeCompetencies(mock, 'methodological');
    const analyzeRow = result.matrix.find(r => r.competency === 'ANALYZE');
    assert(
      analyzeRow !== undefined && (analyzeRow.practiceStatus === 'PASS' || analyzeRow.practiceStatus === 'PARTIAL'),
      'TEST 2: Competencia secundaria (ANALYZE) recibe cobertura PARTIAL/PASS vía ejercicio de JUSTIFY'
    );
  }

  // TEST 3: 3 ejercicios de razonamiento solo provocan brechas críticas para lo verdaderamente ausente (ej. TRANSFER)
  {
    const mock = createMockParsedArticle({
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Estime de forma rápida de Fermi', detectedCognitiveLevels: ['reasoning_estimate'] },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Proponga una simplificación de modelo físico', detectedCognitiveLevels: ['reasoning_model'] },
        { id: '3', type: 'AnektiaDecisionBox', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: '¿Por qué la estimación funciona?', detectedCognitiveLevels: ['reasoning_justify'] }
      ]
    });
    const result = analyzeCompetencies(mock, 'methodological');
    assert(
      result.criticalGaps.length <= 2 && result.criticalGaps.includes('TRANSFER'),
      `TEST 3: 3 ejercicios de razonamiento reducen las brechas críticas a 1 (TRANSFER) (gaps críticos: ${result.criticalGaps.join(', ')})`
    );
  }

  // TEST 4: Una competencia no relevante (ej. CALCULATE) no genera recomendación
  {
    const mock = createMockParsedArticle({
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'P1' }
      ]
    });
    const result = analyzeCompetencies(mock, 'methodological');
    const calcRec = result.gapRecommendations.some(r => r.toLowerCase().includes('numerical') || r.toLowerCase().includes('calculate'));
    assert(
      !calcRec,
      'TEST 4: Competencia NOT_RELEVANT (CALCULATE en metodológico) no genera recomendación irrelevante'
    );
  }

  // TEST 5: Un artículo metodológico no tiene que incluir cálculo numérico por defecto (CALCULATE = NOT_RELEVANT)
  {
    const mock = createMockParsedArticle();
    const result = analyzeCompetencies(mock, 'methodological');
    const calcRow = result.matrix.find(r => r.competency === 'CALCULATE');
    assert(
      calcRow !== undefined && calcRow.applicability === 'NOT_RELEVANT' && calcRow.gapType === 'NONE',
      'TEST 5: CALCULATE es NOT_RELEVANT para artículo metodológico puro'
    );
  }

  // TEST 6: Un ejercicio de justificación cubre parcialmente EXPLAIN, ANALYZE y EVALUATE
  {
    const mock = createMockParsedArticle({
      exercises: [
        { id: 'ex3', type: 'AnektiaDecisionBox', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'Justifique por qué la simplificación es razonable', detectedCognitiveLevels: ['reasoning_justify'] }
      ]
    });
    const result = analyzeCompetencies(mock, 'methodological');
    const explainRow = result.matrix.find(r => r.competency === 'EXPLAIN');
    const analyzeRow = result.matrix.find(r => r.competency === 'ANALYZE');
    const evalRow = result.matrix.find(r => r.competency === 'EVALUATE');

    assert(
      explainRow?.practiceStatus === 'PASS' && analyzeRow?.practiceStatus === 'PASS' && evalRow?.practiceStatus === 'PASS',
      'TEST 6: Ejercicio de justificación cubre secundariamente EXPLAIN, ANALYZE y EVALUATE'
    );
  }

  // TEST 7: Solo generar FAIL cuando no exista evidencia tras analizar todas las actividades
  {
    const mock = createMockParsedArticle({
      exercises: [
        { id: '1', type: 'AnektiaExercise', layerId: 'inicio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'P1' },
        { id: '2', type: 'AnektiaExercise', layerId: 'intermedio', hasHint: true, hasXP: true, hasSolution: true, questionText: 'P2' },
        { id: '3', type: 'AnektiaExercise', layerId: 'avanzado', hasHint: true, hasXP: true, hasSolution: true, questionText: 'P3' }
      ]
    });
    const result = analyzeCompetencies(mock, 'methodological');
    const transferRow = result.matrix.find(r => r.competency === 'TRANSFER');
    assert(
      transferRow !== undefined && transferRow.practiceStatus === 'FAIL',
      'TEST 7: FAIL se genera si tras analizar 3 ejercicios no hay evidencia de TRANSFER'
    );
  }

  // TEST 8: La recomendación debe depender del propósito del artículo
  {
    const mock = createMockParsedArticle();
    const result = analyzeCompetencies(mock, 'methodological');
    assert(
      result.articlePurpose.primaryIntent.length > 0 && result.gapRecommendations.every(r => !r.includes('numerical')),
      'TEST 8: Las recomendaciones dependen del propósito del artículo sin exigir cálculo numérico'
    );
  }

  console.log(`\nMulti-Competency Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runMultiCompetencyTests();
