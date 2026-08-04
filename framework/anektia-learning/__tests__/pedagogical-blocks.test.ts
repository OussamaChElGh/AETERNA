import { 
  PEDAGOGICAL_BLOCKS_REGISTRY, 
  REFERENCE_LEARNING_UI_REGISTRY, 
  PedagogicalBlockType 
} from '../experiences/pedagogical-blocks-registry';
import { ACTIVITY_CAPABILITY_REGISTRY } from '../experiences/registry';
import { ALL_LEARNING_EXPERIENCES } from '../experiences/taxonomy';

function runPedagogicalBlocksTests() {
  console.log('====================================================');
  console.log('   RUNNING PEDAGOGICAL CONTENT BLOCKS TESTS         ');
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

  // Test 1: All 8 Pedagogical Block Types exist in registry
  const expectedBlockTypes: PedagogicalBlockType[] = [
    'misconception',
    'key-insight',
    'archive-fragment',
    'aeterna-system',
    'mini-challenge',
    'connect',
    'hidden-assumption',
    'transfer'
  ];

  const registeredTypes = Object.keys(PEDAGOGICAL_BLOCKS_REGISTRY);
  assert(
    expectedBlockTypes.every(bt => registeredTypes.includes(bt)),
    '1. Todos los 8 bloques pedagógicos existen registrados en la taxonomía semántica'
  );

  // Test 2: Each block maps to valid LearningExperiences
  const allExpKeys = Object.keys(ALL_LEARNING_EXPERIENCES);
  const validExpMappings = Object.values(PEDAGOGICAL_BLOCKS_REGISTRY).every(block => 
    block.primaryExperiences.every(exp => allExpKeys.includes(exp)) &&
    block.secondaryExperiences.every(exp => allExpKeys.includes(exp))
  );
  assert(validExpMappings, '2. Cada bloque pedagógico mapea a LearningExperiences válidas existentes');

  // Test 3: Reference / Learning UI elements categorized correctly
  assert(
    REFERENCE_LEARNING_UI_REGISTRY.faq.family === 'REFERENCE_LEARNING_UI' &&
    REFERENCE_LEARNING_UI_REGISTRY.progress.family === 'REFERENCE_LEARNING_UI',
    '3. FAQ y Progress UI están clasificados correctamente bajo REFERENCE_LEARNING_UI'
  );

  // Test 4: MiniChallenge != AnektiaExercise
  const mini = PEDAGOGICAL_BLOCKS_REGISTRY['mini-challenge'];
  const ex = ACTIVITY_CAPABILITY_REGISTRY['AnektiaExercise'];
  assert(
    mini.blockType !== ex.componentType &&
    mini.family === 'PEDAGOGICAL_CONTENT_BLOCK' &&
    ex.description !== mini.description,
    '4. MiniChallenge mantiene identidad propia distinta de AnektiaExercise'
  );

  // Test 5: Connect != ConceptMap
  const conn = PEDAGOGICAL_BLOCKS_REGISTRY['connect'];
  const cmap = ACTIVITY_CAPABILITY_REGISTRY['ConceptMap'];
  assert(
    conn.blockType !== cmap.componentType &&
    conn.family === 'PEDAGOGICAL_CONTENT_BLOCK',
    '5. Connect mantiene identidad propia distinta de ConceptMap'
  );

  // Test 6: HiddenAssumption != ModelBuilder
  const ha = PEDAGOGICAL_BLOCKS_REGISTRY['hidden-assumption'];
  const mb = ACTIVITY_CAPABILITY_REGISTRY['ModelBuilder'];
  assert(
    ha.blockType !== mb.componentType &&
    ha.primaryCompetencies.includes('ANALYZE'),
    '6. HiddenAssumption mantiene identidad propia distinta de ModelBuilder'
  );

  // Test 7: Transfer != AnektiaExercise
  const tr = PEDAGOGICAL_BLOCKS_REGISTRY['transfer'];
  assert(
    tr.blockType !== ex.componentType &&
    tr.primaryExperiences.includes('TRANSFER_KNOWLEDGE'),
    '7. Transfer mantiene identidad propia distinta de AnektiaExercise'
  );

  // Test 8: Misconception != ErrorHunter
  const misc = PEDAGOGICAL_BLOCKS_REGISTRY['misconception'];
  const eh = ACTIVITY_CAPABILITY_REGISTRY['ErrorHunter'];
  assert(
    misc.blockType !== eh.componentType &&
    misc.family === 'PEDAGOGICAL_CONTENT_BLOCK',
    '8. Misconception (Error Común) es una intervención pedagógica distinta de ErrorHunter'
  );

  // Test 9: ArchiveFragment supersedes legacy did-you-know
  const af = PEDAGOGICAL_BLOCKS_REGISTRY['archive-fragment'];
  assert(
    af.visibleTitle === 'Fragmento de Archivo',
    '9. ArchiveFragment representa formalmente el concepto de Fragmento de Archivo'
  );

  // Test 10: AnektiaSystem provides procedural reasoning
  const asys = PEDAGOGICAL_BLOCKS_REGISTRY['aeterna-system'];
  assert(
    asys.primaryExperiences.includes('CRITICAL_THINKING') || asys.primaryExperiences.includes('CAUSAL_REASONING'),
    '10. AnektiaSystem proporciona razonamiento crítico y metodológico'
  );

  // Test 11: All 14 Interactive Activities remain intact
  const activeCount = Object.keys(ACTIVITY_CAPABILITY_REGISTRY).length;
  assert(
    activeCount === 15,
    `11. Las 15 Actividades Interactivas permanecen intactas y registradas (encontradas: ${activeCount})`
  );

  // Test 12: Unique Keys Check
  const totalKeys = registeredTypes.length;
  const uniqueKeys = new Set(registeredTypes).size;
  assert(
    totalKeys === uniqueKeys,
    '12. No existen claves de bloques pedagógicos duplicadas'
  );

  console.log(`\nPedagogical Blocks Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.\n`);
  if (failed > 0) process.exit(1);
}

runPedagogicalBlocksTests();
