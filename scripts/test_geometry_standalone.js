// Standalone Geometry Validation Test Battery for Aeterna Room Engine

const GRID_SIZE = 32;

function createDefaultFloorMask() {
  const mask = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    const row = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const isWithinX = x >= 5 && x <= 25;
      const isWithinY = y >= 5 && y <= 25;
      const isNotNorthCorner = (x + y) >= 12;
      const isNotSouthCorner = (x + y) <= 46;
      row.push(isWithinX && isWithinY && isNotNorthCorner && isNotSouthCorner);
    }
    mask.push(row);
  }
  return mask;
}

const floorMask = createDefaultFloorMask();
const blockedTiles = new Set(['25,5', '25,6', '5,25', '6,25']);

function isTileOnFloor(tileX, tileY) {
  if (tileX < 0 || tileX >= GRID_SIZE || tileY < 0 || tileY >= GRID_SIZE) return false;
  return floorMask[tileX][tileY] === true && !blockedTiles.has(`${tileX},${tileY}`);
}

function validatePlacement(targetTileX, targetTileY, targetTileZ, rotation, catalogItem, currentInstanceId, placedItems) {
  const rawW = catalogItem.footprintTileWidth;
  const rawH = catalogItem.footprintTileHeight;

  const effectiveW = (rotation === 90 || rotation === 270) ? rawH : rawW;
  const effectiveH = (rotation === 90 || rotation === 270) ? rawW : rawH;

  const invalidTiles = [];

  for (let dx = 0; dx < effectiveW; dx++) {
    for (let dy = 0; dy < effectiveH; dy++) {
      const cx = targetTileX + dx;
      const cy = targetTileY + dy;

      if (catalogItem.placementSurface === 'floor') {
        if (!isTileOnFloor(cx, cy)) {
          invalidTiles.push({ tileX: cx, tileY: cy });
        }
      }

      if (targetTileZ > 0) {
        const hasSupportTable = placedItems.some(item => {
          if (item.instanceId === currentInstanceId) return false;
          if (item.tileZ !== 0) return false;
          return cx >= item.tileX && cx < item.tileX + item.width &&
                 cy >= item.tileY && cy < item.tileY + item.height;
        });

        if (!hasSupportTable) {
          invalidTiles.push({ tileX: cx, tileY: cy });
        }
      }
    }
  }

  return { isValid: invalidTiles.length === 0, invalidTiles };
}

console.log('=== RUNNING ROOM GEOMETRY TEST BATTERY ===\n');

const sofa = { footprintTileWidth: 2, footprintTileHeight: 2, placementSurface: 'floor' };
const telescope = { footprintTileWidth: 1, footprintTileHeight: 1, placementSurface: 'floor' };

let passed = 0;
let total = 0;

function test(name, result, expected) {
  total++;
  const ok = result === expected;
  if (ok) passed++;
  console.log(`${ok ? '✅ PASS' : '❌ FAIL'} ${name} (Result: ${result}, Expected: ${expected})`);
}

test('Case A: Sofá en el centro del suelo (10,10)', validatePlacement(10, 10, 0, 0, sofa, 'inst1', []).isValid, true);
test('Case B: Sofá en borde aceptable (18,18)', validatePlacement(18, 18, 0, 0, sofa, 'inst1', []).isValid, true);
test('Case C: Sofá parcialmente sobre pared (4,5)', validatePlacement(4, 5, 0, 0, sofa, 'inst1', []).isValid, false);
test('Case D: Sofá completamente sobre pared (2,2)', validatePlacement(2, 2, 0, 0, sofa, 'inst1', []).isValid, false);
test('Case E: Sofá sobre tejado (1,1)', validatePlacement(1, 1, 0, 0, sofa, 'inst1', []).isValid, false);
test('Case F: Sofá fuera de habitación (30,30)', validatePlacement(30, 30, 0, 0, sofa, 'inst1', []).isValid, false);
test('Case G: Telescopio sobre suelo (8,14)', validatePlacement(8, 14, 0, 0, telescope, 'inst1', []).isValid, true);
test('Case H: Libro sobre mesa con soporte (12,12, Z:1)', validatePlacement(12, 12, 1, 0, telescope, 'inst1', [{ instanceId: 'table1', tileX: 12, tileY: 12, width: 2, height: 2, tileZ: 0 }]).isValid, true);
test('Case I: Libro elevado SIN mesa (12,12, Z:1)', validatePlacement(12, 12, 1, 0, telescope, 'inst1', []).isValid, false);
test('Case J: Objeto en puerta bloqueada (5,25)', validatePlacement(5, 25, 0, 0, telescope, 'inst1', []).isValid, false);
test('Case K: Mueble grande 2x2 en borde parcial inválido (24,25)', validatePlacement(24, 25, 0, 0, sofa, 'inst1', []).isValid, false);

console.log(`\n=== TEST RESULTS: ${passed} / ${total} TESTS PASSED ===`);
