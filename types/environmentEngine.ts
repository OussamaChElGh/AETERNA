// AETERNA ENVIRONMENT SYSTEM v1.0
// Comprehensive Domain Types & Entities Definition

export type SurfaceType = 'floor' | 'wall' | 'desk' | 'ceiling';
export type CellType = 'floor' | 'wall' | 'door' | 'blocked' | 'out_of_bounds';
export type DisciplineType = 'physics' | 'mathematics' | 'computer_science' | 'philosophy' | 'biology' | 'general';
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface SpatialCell {
  tileX: number;
  tileY: number;
  type: CellType;
  wallSegmentId?: string;
  maxElevationZ?: number;
  floorTileVariantIndex?: number;
}

export interface WallSegment {
  id: string;
  name: string;
  facingDirection: 'north_west' | 'north_east';
  wallModuleId: string;
  startTile: { tileX: number; tileY: number };
  endTile: { tileX: number; tileY: number };
}

export interface ElevatedSurface {
  instanceId: string;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
  surfaceZ: number;
}

export interface EnvironmentLayout {
  id: string;
  name: string;
  gridSizeX: number;
  gridSizeY: number;
  cells: SpatialCell[][];
  wallSegments: WallSegment[];
  blockedTiles: Set<string>;
  spawnPoint: { tileX: number; tileY: number };
  cameraDefault: { zoom: number; originTileX: number; originTileY: number };
}

export interface FloorTileSet {
  id: string;
  tileWidthPx: number;  // e.g. 64
  tileHeightPx: number; // e.g. 32
  variants: string[];   // Array of sprite URLs to auto-alternate pattern
}

export interface WallModuleSet {
  wallLeft: string;
  wallRight: string;
  cornerInner: string;
  cornerOuter: string;
  pillar: string;
  windowModule?: string;
  doorModule?: string;
}

export interface EnvironmentTheme {
  id: string;
  name: string;
  artStyle: 'academic_illustrative' | 'pixel_cozy' | 'parchment_classical';
  floorTileSet: FloorTileSet;
  wallModuleSet: WallModuleSet;
  lightingProfile: {
    ambientColor: string;       // e.g. '#2A1B0E'
    ambientIntensity: number;   // 0.0 .. 1.0
    sunAngleDegrees: number;
    warmthTempK: number;
  };
  particlePreset?: 'dust_motes' | 'embers' | 'magic_runes' | 'none';
}

export interface AssetMetadata {
  id: string;
  name: string;
  category: 'furniture' | 'scientific' | 'decoration' | 'plants' | 'books';
  discipline: DisciplineType;
  rarity: RarityType;
  footprint: {
    tileWidth: number;
    tileHeight: number;
  };
  anchor: {
    x: number; // 0.5 = center
    y: number; // 0.85 = floor contact base
  };
  pixelDimensions: {
    width: number;
    height: number;
  };
  placementSurface: SurfaceType;
  supportsRotation: boolean;
  hasDedicatedShadowAsset: boolean;
}

export interface EnvironmentPlacedItem {
  instanceId: string;
  catalogItemId: string;
  tileX: number;
  tileY: number;
  tileZ: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface PlacementValidationResult {
  isValid: boolean;
  reason?: 'out_of_floor' | 'wall_mismatch' | 'collision' | 'invalid_elevation' | 'blocked';
  invalidTiles: { tileX: number; tileY: number }[];
}
