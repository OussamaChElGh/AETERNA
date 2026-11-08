// Geometry Test Battery for Anektia Room Engine Placement Validation

const { validatePlacement } = require('../lib/roomEngineStorage');

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
assert(runTestCase('B', 'Sofá cerca del borde válido', 12, 12, 0, 0, 'sofa_leather', true), 'Case B');

// Case C: Sofá con parte de su huella fuera del suelo
assert(runTestCase('C', 'Sofá con parte de su huella fuera del suelo', 13, 5, 0, 0, 'sofa_leather', false), 'Case C');

// Case D: Sofá anclado en el eje de la pared
assert(runTestCase('D', 'Sofá anclado en el eje de la pared', 2, 0, 0, 0, 'sofa_leather', false), 'Case D');

// Case E: Sofá por encima de la elevación permitida
assert(runTestCase('E', 'Sofá por encima de la elevación permitida', 1, 1, 2, 0, 'sofa_leather', false), 'Case E');

// Case F: Sofá fuera de habitación
assert(runTestCase('F', 'Sofá fuera de habitación', 30, 30, 0, 0, 'sofa_leather', false), 'Case F');

// Case G: Telescopio sobre suelo
assert(runTestCase('G', 'Telescopio sobre suelo', 8, 11, 0, 0, 'telescope_brass', true), 'Case G');

// Case H: Libro sobre mesa (con mesa colocada debajo)
const tablePlacement = [
  { instanceId: 'table_1', catalogItemId: 'desk_academic', tileX: 12, tileY: 12, tileZ: 0, rotation: 0 }
];
assert(runTestCase('H', 'Libro/Objeto elevado sobre mesa válida', 12, 12, 1, 0, 'book_tower', true, tablePlacement), 'Case H');

// Case I: Libro elevado sin mesa debajo
assert(runTestCase('I', 'Objeto elevado a Z:1 SIN soporte', 12, 12, 1, 0, 'book_tower', false, []), 'Case I');

// Case J: Objeto en una celda ocupada
assert(runTestCase('J', 'Objeto en una celda ocupada', 12, 12, 0, 0, 'telescope_brass', false, tablePlacement), 'Case J');

// Case K: Mueble grande 2x2 ocupando parcialmente una celda inválida
assert(runTestCase('K', 'Mueble grande 2x2 ocupando celda fuera del suelo', 13, 13, 0, 0, 'sofa_leather', false), 'Case K');

console.log(`=== TEST SUMMARY: ${passedCount} / ${totalCount} PASSED ===`);

if (passedCount !== totalCount) process.exitCode = 1;
