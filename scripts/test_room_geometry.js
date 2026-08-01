// Geometry Test Battery for Aeterna Room Engine Placement Validation

const { validatePlacement, DEFAULT_PLACED_ITEMS } = require('../lib/roomEngineStorage');
const { ROOM_ENGINE_CATALOG } = require('../data/roomEngineCatalog');

console.log('=== RUNNING ROOM GEOMETRY TEST BATTERY ===\n');

// Mock helper to run a test case
function runTestCase(caseId, name, tileX, tileY, tileZ, rotation, catalogItemId, expectedValid, currentPlacedItems = []) {
  const result = validatePlacement(
    tileX,
    tileY,
    tileZ,
    rotation,
    catalogItemId,
    'test_instance',
    currentPlacedItems
  );

  const passed = result.isValid === expectedValid;
  const status = passed ? '✅ PASS' : '❌ FAIL';

  console.log(`${status} [Case ${caseId}] ${name}`);
  console.log(`   Location: (${tileX}, ${tileY}, Z:${tileZ}), Rot:${rotation}° | Result: isValid=${result.isValid} (Expected: ${expectedValid})`);
  if (result.reason) {
    console.log(`   Reason: ${result.reason} | Invalid Tiles: ${JSON.stringify(result.invalidTiles)}`);
  }
  console.log('');

  return passed;
}

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) passedCount++;
}

// Case A: Sofá en el centro del suelo
assert(runTestCase('A', 'Sofá en el centro del suelo', 10, 10, 0, 0, 'sofa_leather', true), 'Case A');

// Case B: Sofá cerca del borde aceptable
assert(runTestCase('B', 'Sofá cerca del borde válido', 18, 18, 0, 0, 'sofa_leather', true), 'Case B');

// Case C: Sofá parcialmente sobre pared
assert(runTestCase('C', 'Sofá parcialmente sobre pared', 4, 5, 0, 0, 'sofa_leather', false), 'Case C');

// Case D: Sofá completamente sobre pared
assert(runTestCase('D', 'Sofá completamente sobre pared', 2, 2, 0, 0, 'sofa_leather', false), 'Case D');

// Case E: Sofá sobre tejado
assert(runTestCase('E', 'Sofá sobre tejado', 1, 1, 0, 0, 'sofa_leather', false), 'Case E');

// Case F: Sofá fuera de habitación
assert(runTestCase('F', 'Sofá fuera de habitación', 30, 30, 0, 0, 'sofa_leather', false), 'Case F');

// Case G: Telescopio sobre suelo
assert(runTestCase('G', 'Telescopio sobre suelo', 8, 14, 0, 0, 'telescope_brass', true), 'Case G');

// Case H: Libro sobre mesa (con mesa colocada debajo)
const tablePlacement = [
  { instanceId: 'table_1', catalogItemId: 'sofa_leather', tileX: 12, tileY: 12, tileZ: 0, rotation: 0 }
];
assert(runTestCase('H', 'Libro/Objeto elevado sobre mesa válida', 12, 12, 1, 0, 'telescope_brass', true, tablePlacement), 'Case H');

// Case I: Libro elevado sin mesa debajo
assert(runTestCase('I', 'Objeto elevado a Z:1 SIN soporte', 12, 12, 1, 0, 'telescope_brass', false, []), 'Case I');

// Case J: Objeto atravesando puerta/celda bloqueada
assert(runTestCase('J', 'Objeto en umbral de puerta bloqueado', 25, 5, 0, 0, 'telescope_brass', false), 'Case J');

// Case K: Mueble grande 2x2 ocupando parcialmente una celda inválida
assert(runTestCase('K', 'Mueble grande 2x2 ocupando celda fuera del suelo', 24, 25, 0, 0, 'sofa_leather', false), 'Case K');

console.log(`=== TEST SUMMARY: ${passedCount} / ${totalCount} PASSED ===`);
