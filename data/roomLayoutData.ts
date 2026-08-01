import { RoomLayout, WallSegment } from '@/types/roomEngine';

const GRID_SIZE = 32;

// CORRECTED FLOOR MASK — aligned with visual floor asset (940x620 centered at 600,390)
// tileToScreen(x,y) maps:
//   (0,0)   → (600, 160)  ≈ topCorner    (600, 155)  ✓
//   (0,14)  → (152, 384)  ≈ leftCorner   (130, 390)  ✓
//   (14,0)  → (1048, 384) ≈ rightCorner  (1070, 390) ✓
//   (14,14) → (600, 608)  ≈ bottomCorner (600, 625)  ✓
const FLOOR_MIN = 1;
const FLOOR_MAX = 14;

function createDefaultFloorMask(): boolean[][] {
  const mask: boolean[][] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    const row: boolean[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      row.push(x >= FLOOR_MIN && x <= FLOOR_MAX && y >= FLOOR_MIN && y <= FLOOR_MAX);
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

export const ROOM_BLOCKED_TILES = new Set<string>([]);

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
