export type ItemLayer = 'wall' | 'wall-decoration' | 'floor' | 'furniture' | 'foreground';

export interface RoomAsset {
  id: string;
  src: string; // Default sprite path
  spritesByRotation?: Partial<Record<0 | 90 | 180 | 270, string>>;
  footprintTileWidth: number;  // Grid cells X occupied (visual/z-index)
  footprintTileHeight: number; // Grid cells Y occupied (visual/z-index)
  collisionTileWidth?: number;  // Collision-only footprint X (defaults to footprintTileWidth)
  collisionTileHeight?: number; // Collision-only footprint Y (defaults to footprintTileHeight)
  pixelWidth: number;          // Native sprite image width in px
  pixelHeight: number;         // Native sprite image height in px
  anchorX: number;             // 0.5 = center
  anchorY: number;             // 0.85 = base contact point
  isIsoPreAngled?: boolean;    // If true, sprite already has 2.5D isometric perspective (skips CSS skewing)
}

export interface RoomCatalogItem {
  id: string;
  name: string;
  description: string;
  discipline: 'physics' | 'mathematics' | 'computer_science' | 'philosophy' | 'biology' | 'general';
  category: 'furniture' | 'scientific' | 'decoration' | 'plants' | 'books';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  assetId: string;
  placementSurface: 'floor' | 'wall' | 'desk';
  canRotate: boolean;
}

export interface PlacedRoomItem {
  instanceId: string;
  catalogItemId: string;
  tileX: number; // 0..31
  tileY: number; // 0..31
  tileZ: number; // 0 = floor, 1 = table surface
  rotation: 0 | 90 | 180 | 270;
}

export interface CameraState {
  viewportWidth: number;
  viewportHeight: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface UserRoomData {
  roomId: string;
  theme: string;
  gridSizeX: number; // 32
  gridSizeY: number; // 32
  placedItems: PlacedRoomItem[];
}

// -------------------------------------------------------------
// ROOM GEOMETRY LOGIC TYPES (ROOM LAYOUT & PLACEMENT MASK)
// -------------------------------------------------------------

export type SurfaceType = 'floor' | 'wall' | 'desk';
export type CellType = 'floor' | 'wall' | 'blocked' | 'out_of_bounds';

export interface WallSegment {
  id: string;
  name: string;
  facingDirection: 'north_west' | 'north_east';
  validTiles: { tileX: number; tileY: number }[];
}

export interface ElevatedSurface {
  instanceId: string;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
  surfaceZ: number; // e.g. Z = 1
}

export interface RoomLayout {
  gridSizeX: number;
  gridSizeY: number;
  floorMask: boolean[][]; // 32x32 boolean grid: true if tile is valid floor
  blockedTiles: Set<string>; // "tileX,tileY" set of blocked tiles
  wallSegments: WallSegment[];
}

export interface PlacementValidationResult {
  isValid: boolean;
  reason?: 'out_of_floor' | 'wall_mismatch' | 'collision' | 'invalid_elevation' | 'blocked';
  invalidTiles: { tileX: number; tileY: number }[];
}
