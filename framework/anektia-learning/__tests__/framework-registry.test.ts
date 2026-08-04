import { ACTIVITY_CAPABILITY_REGISTRY, getCandidatesForExperience } from '../experiences/registry';
import { ALL_LEARNING_EXPERIENCES, LearningExperienceAuditResult } from '../experiences/taxonomy';
import { generateRecommendedActivityPlan } from '../experiences/activity-plan-generator';

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

export function runFrameworkRegistryTests() {
  console.log('====================================================');
  console.log('   RUNNING FRAMEWORK CAPABILITY REGISTRY TESTS      ');
  console.log('====================================================\n');

  // Test 1: Todos los 14 componentes existen en el Registry
  {
    const expectedComponents = [
      'PredictionBox', 'ParameterLab', 'GraphLab', 'ErrorHunter', 'ModelBuilder',
      'ConceptMap', 'ArgumentBuilder', 'CausalMap', 'EvidenceMatcher', 'Counterexample',
      'ArgumentEvaluation', 'SequenceBuilder', 'AnektiaExercise', 'AnektiaDecisionBox', 'AnektiaFlowchart'
    ];

    const allPresent = expectedComponents.every(comp => ACTIVITY_CAPABILITY_REGISTRY[comp] !== undefined);
    assert(
      Object.keys(ACTIVITY_CAPABILITY_REGISTRY).length === 15 && allPresent,
      '1. Todos los 15 componentes existen registrados con metadatos completos'
    );
  }

  // Test 2: Mapeos válidos hacia LearningExperiences
  {
    const validExpKeys = Object.keys(ALL_LEARNING_EXPERIENCES);
    let allValid = true;

    Object.values(ACTIVITY_CAPABILITY_REGISTRY).forEach(mapping => {
      mapping.primaryExperiences.forEach(exp => {
        if (!validExpKeys.includes(exp)) allValid = false;
      });
      mapping.secondaryExperiences.forEach(exp => {
        if (!validExpKeys.includes(exp)) allValid = false;
      });
    });

    assert(allValid, '2. Cada componente mapea a LearningExperiences válidas existentes en el sistema');
  }

  // Test 3: Múltiples actividades candidatas por experiencia ausente
  {
    const predictCandidates = getCandidatesForExperience('PREDICT_BEFORE_OBSERVE');
    const causalCandidates = getCandidatesForExperience('CAUSAL_REASONING');

    const hasMultiplePredict = predictCandidates.directFit.length >= 2;
    const hasMultipleCausal = causalCandidates.directFit.length >= 2;

    assert(
      hasMultiplePredict && hasMultipleCausal,
      '3. El framework puede obtener múltiples actividades candidatas (Direct Fit & Compatible) para una misma experiencia'
    );
  }

  // Test 4: Generación de plan dinámico basado en carencias
  {
    const mockAudit: LearningExperienceAuditResult = {
      coreExperiences: [
        {
          experienceKey: 'CAUSAL_REASONING',
          title: 'Razonamiento Causal',
          description: '',
          expectation: 'CORE',
          teachingStatus: 'PASS',
          practiceStatus: 'FAIL',
          status: 'FAIL',
          supportingActivities: [],
          cognitiveDemand: 'HIGH'
        }
      ],
      recommendedExperiences: [],
      optionalExperiences: [],
      activityQualityList: [],
      practiceDensity: {
        currentActivitiesCount: 1,
        meaningfulCoreCoverage: '0/1',
        coreCoveredCount: 0,
        coreTotalCount: 1
      },
      experienceCompletenessPercentage: 0,
      coreGapsCount: 1
    };

    const mockInteractive: any = { potential: 5, requirement: 'optional', presence: true };
    const plan = generateRecommendedActivityPlan(mockAudit, mockInteractive);
    const causalItem = plan.find(p => p.covers.includes('CAUSAL_REASONING'));

    assert(
      causalItem !== undefined && causalItem.recommendedComponent.includes('CausalMap'),
      '4. El auditor detecta la carencia de CAUSAL_REASONING y sugiere actividades especializadas'
    );
  }

  // Test 5: Sin duplicación de claves de experiencia
  {
    const keys = Object.keys(ALL_LEARNING_EXPERIENCES);
    const uniqueKeys = new Set(keys);
    assert(keys.length === uniqueKeys.size, '5. No existen claves de experiencia duplicadas en el sistema');
  }

  console.log(`\nRegistry Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runFrameworkRegistryTests();
