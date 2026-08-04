import { RoomLayout, WallSegment } from '@/types/roomEngine';

const GRID_SIZE = 32;

// Floor diamond covering tiles (0,0) to (16,16)
// ORIGIN_X=600, ORIGIN_Y=260, TILE_WIDTH_HALF=32, TILE_HEIGHT_HALF=16
// Edges: y >= -0.5x + 560, y >= 0.5x - 40, y <= 0.5x + 472, y <= -0.5x + 1072

function createDefaultFloorMask(): boolean[][] {
  const mask: boolean[][] = [];
  
  const TILE_WIDTH_HALF = 32;
  const TILE_HEIGHT_HALF = 16;
  const ORIGIN_X = 600;
  const ORIGIN_Y = 260;
  
  for (let x = 0; x < GRID_SIZE; x++) {
    const row: boolean[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const screenX = (x - y) * TILE_WIDTH_HALF + ORIGIN_X;
      const screenY = (x + y) * TILE_HEIGHT_HALF + ORIGIN_Y;
      
      const inside = 
        screenY >= -0.5 * screenX + 560 &&
        screenY >= 0.5 * screenX - 40 &&
        screenY <= 0.5 * screenX + 472 &&
        screenY <= -0.5 * screenX + 1072;
      
      row.push(inside);
    }
    mask.push(row);
  }
  return mask;
}

export const ROOM_WALL_SEGMENTS: WallSegment[] = [
  {
    id: 'wall_north_west',
    name: 'Pared Noroeste',
    facingDirection: 'north_west',
    validTiles: Array.from({ length: 16 }, (_, i) => ({ tileX: i, tileY: 0 }))
  },
  {
    id: 'wall_north_east',
    name: 'Pared Noreste',
    facingDirection: 'north_east',
    validTiles: Array.from({ length: 16 }, (_, i) => ({ tileX: 0, tileY: i }))
  }
];

// Tiles de suelo "tapados" visualmente por muebles de pared grandes (puerta,
// librería). Al bloquearlos, los muebles de suelo no pueden colocarse detrás
// de la puerta u otros muebles altos de la pared.
export const ROOM_BLOCKED_TILES = new Set<string>([
  // Puerta gótica (tile(0,10) en pared NE) — bloquea los 4 tiles de suelo en frente
  "1,10", "2,10",
  "1,11", "2,11",
  // Librería de caoba (tile(8,0) en pared NW) — bloquea los tiles de suelo en frente
  "8,1", "9,1", "10,1",
  // Ventanal gótico (tile(4,0)) — bloquea debajo
  "4,1", "5,1",
]);

export const AETERNA_ROOM_LAYOUT: RoomLayout = {
  gridSizeX: GRID_SIZE,
  gridSizeY: GRID_SIZE,
  floorMask: createDefaultFloorMask(),
  blockedTiles: ROOM_BLOCKED_TILES,
  wallSegments: ROOM_WALL_SEGMENTS
};

export function isTileOnFloor(tileX: number, tileY: number): boolean {
  if (tileX < 0 || tileX >= GRID_SIZE || tileY < 0 || tileY >= GRID_SIZE) return false;
  return AETERNA_ROOM_LAYOUT.floorMask[tileX][tileY] === true &&
    !AETERNA_ROOM_LAYOUT.blockedTiles.has(`${tileX},${tileY}`);
}

export function isTileOnWall(tileX: number, tileY: number): boolean {
  return ROOM_WALL_SEGMENTS.some(segment =>
    segment.validTiles.some(t => t.tileX === tileX && t.tileY === tileY)
  );
}
