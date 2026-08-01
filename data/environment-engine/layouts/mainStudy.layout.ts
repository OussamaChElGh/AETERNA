import { EnvironmentLayout, SpatialCell } from '@/types/environmentEngine';

// Grid range that matches the visual floor asset (940x620 centered at 600,390)
// tileToScreen(0,0)  = (600, 160) ≈ topCorner    (600, 155)  ✓
// tileToScreen(0,13) = (184, 368) ≈ leftCorner   (130, 390)  ✓
// tileToScreen(13,0) = (1016, 368) ≈ rightCorner (1070, 390) ✓
// tileToScreen(13,13)= (600, 576)  ≈ bottomCorner(600, 625)  ✓
const FLOOR_MIN = 0;
const FLOOR_MAX = 13;
const GRID_SIZE = 32;

function buildMainStudyCells(): SpatialCell[][] {
  const cells: SpatialCell[][] = [];

  for (let x = 0; x < GRID_SIZE; x++) {
    const row: SpatialCell[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      // Floor = the rectangular tile region that PROJECTS to the diamond floor asset on screen
      const isFloor =
        x >= FLOOR_MIN && x <= FLOOR_MAX &&
        y >= FLOOR_MIN && y <= FLOOR_MAX;

      // Wall = back edges of the floor diamond
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

export const MAIN_STUDY_LAYOUT: EnvironmentLayout = {
  id: 'main_study_room',
  name: 'Estudio Principal del Astrónomo',
  gridSizeX: GRID_SIZE,
  gridSizeY: GRID_SIZE,
  cells: buildMainStudyCells(),
  wallSegments: [
    {
      id: 'wall_nw',
      name: 'Pared Noroeste',
      facingDirection: 'north_west',
      wallModuleId: 'gothic_window_wall',
      startTile: { tileX: 0, tileY: 0 },
      endTile: { tileX: 0, tileY: 13 }
    },
    {
      id: 'wall_ne',
      name: 'Pared Noreste',
      facingDirection: 'north_east',
      wallModuleId: 'mahogany_library_wall',
      startTile: { tileX: 0, tileY: 0 },
      endTile: { tileX: 13, tileY: 0 }
    }
  ],
  blockedTiles: new Set(),
  spawnPoint: { tileX: 6, tileY: 6 },
  cameraDefault: { zoom: 1.0, originTileX: 6, originTileY: 6 }
};
