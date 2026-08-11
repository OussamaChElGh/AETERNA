import { EnvironmentLayout, SpatialCell } from '@/types/environmentEngine';

export function getFloorMax(visibleGrid: number): number {
  return visibleGrid - 1;
}

export function buildMainStudyCells(visibleGrid: number = 10): SpatialCell[][] {
  const cells: SpatialCell[][] = [];
  const GRID_SIZE = 32;
  const FLOOR_MIN = 0;
  const FLOOR_MAX = visibleGrid - 1;

  for (let x = 0; x < GRID_SIZE; x++) {
    const row: SpatialCell[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const isFloor =
        x >= FLOOR_MIN && x <= FLOOR_MAX &&
        y >= FLOOR_MIN && y <= FLOOR_MAX;

      const isWall = (x === 0 || y === 0) && x <= FLOOR_MAX && y <= FLOOR_MAX;

      row.push({
        tileX: x,
        tileY: y,
        type: isFloor ? 'floor' : (isWall ? 'wall' : 'out_of_bounds'),
        maxElevationZ: isFloor ? 1 : 0
      });
    }
    cells.push(row);
  }

  return cells;
}

const DEFAULT_FLOOR_MAX = 9;

export const MAIN_STUDY_LAYOUT: EnvironmentLayout = {
  id: 'main_study_room',
  name: 'Estudio Principal del Astrónomo',
  gridSizeX: 32,
  gridSizeY: 32,
  cells: buildMainStudyCells(10),
  wallSegments: [
    {
      id: 'wall_nw',
      name: 'Pared Noroeste',
      facingDirection: 'north_west',
      wallModuleId: 'gothic_window_wall',
      startTile: { tileX: 0, tileY: 0 },
      endTile: { tileX: 0, tileY: DEFAULT_FLOOR_MAX }
    },
    {
      id: 'wall_ne',
      name: 'Pared Noreste',
      facingDirection: 'north_east',
      wallModuleId: 'mahogany_library_wall',
      startTile: { tileX: 0, tileY: 0 },
      endTile: { tileX: DEFAULT_FLOOR_MAX, tileY: 0 }
    }
  ],
  blockedTiles: new Set(),
  spawnPoint: { tileX: Math.floor(DEFAULT_FLOOR_MAX / 2), tileY: Math.floor(DEFAULT_FLOOR_MAX / 2) },
  cameraDefault: { zoom: 1.0, originTileX: Math.floor(DEFAULT_FLOOR_MAX / 2), originTileY: Math.floor(DEFAULT_FLOOR_MAX / 2) }
};
