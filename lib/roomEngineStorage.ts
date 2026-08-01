import { UserRoomData, PlacedRoomItem, PlacementValidationResult, RoomCatalogItem } from '@/types/roomEngine';
import { getCatalogItem, ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog';
import { getRoomAsset } from '@/data/roomEngineAssets';
import { AETERNA_ROOM_LAYOUT, isTileOnFloor, isTileOnWall } from '@/data/roomLayoutData';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface RoomUnlockContext {
  completedPaths: string[];
  completedLayers?: Record<string, string[]>;
}

export function isCatalogItemUnlocked(item: RoomCatalogItem, ctx: RoomUnlockContext): boolean {
  const cond = item.unlockCondition;
  if (!cond || cond.type === 'default') return true;

  if (cond.type === 'article_completed' && cond.targetId) {
    return ctx.completedPaths.some(p =>
      p.endsWith(cond.targetId!) || cond.targetId!.endsWith(p)
    );
  }

  if (cond.type === 'layer_completed' && cond.targetId) {
    const layers = ctx.completedLayers?.[cond.targetId] || [];
    return layers.includes(cond.layer || '');
  }

  return false;
}

export function evaluateRoomUnlocks(
  ctx: RoomUnlockContext
): { unlockedIds: Set<string>; lockedIds: Set<string> } {
  const unlockedIds = new Set<string>();
  const lockedIds = new Set<string>();
  for (const item of ROOM_ENGINE_CATALOG) {
    if (isCatalogItemUnlocked(item, ctx)) {
      unlockedIds.add(item.id);
    } else {
      lockedIds.add(item.id);
    }
  }
  return { unlockedIds, lockedIds };
}


export const GRID_SIZE_X = 32;
export const GRID_SIZE_Y = 32;
export const TILE_WIDTH_HALF = 32;
export const TILE_HEIGHT_HALF = 16;
export const ORIGIN_X = 600;
export const ORIGIN_Y = 260;

const STORAGE_KEY = 'aeterna_2d_room_engine_state';

// Pure isometric projection functions
export function tileToScreen(tileX: number, tileY: number, tileZ: number = 0) {
  const screenX = (tileX - tileY) * TILE_WIDTH_HALF + ORIGIN_X;
  const screenY = (tileX + tileY) * TILE_HEIGHT_HALF - (tileZ * 32) + ORIGIN_Y;
  return { screenX, screenY };
}

export function screenToTile(screenX: number, screenY: number, tileZ: number = 0) {
  const relX = screenX - ORIGIN_X;
  const relY = screenY - ORIGIN_Y + (tileZ * 32);

  const tileX = Math.round((relX / TILE_WIDTH_HALF + relY / TILE_HEIGHT_HALF) / 2);
  const tileY = Math.round((relY / TILE_HEIGHT_HALF - relX / TILE_WIDTH_HALF) / 2);

  return {
    tileX: Math.max(0, Math.min(GRID_SIZE_X - 1, tileX)),
    tileY: Math.max(0, Math.min(GRID_SIZE_Y - 1, tileY))
  };
}

// Pure runtime multi-cell depth sorting calculation (NOT persisted!)
export function calculateDerivedZIndex(
  tileX: number,
  tileY: number,
  tileZ: number,
  catalogItemId: string
): number {
  const catalogItem = getCatalogItem(catalogItemId);
  const asset = catalogItem ? getRoomAsset(catalogItem.assetId) : undefined;

  const footprintW = asset?.footprintTileWidth || 1;
  const footprintH = asset?.footprintTileHeight || 1;
  const maxFootprintSum = (tileX + footprintW - 1) + (tileY + footprintH - 1);

  const isRug = catalogItemId.includes('rug') || catalogItem?.name?.toLowerCase().includes('alfombra');

  // Rugs ALWAYS render below everything — absolute floor z-index, never influenced by tile position
  if (isRug) {
    return 1;
  }

  let layerPriority = 100;
  if (catalogItem?.placementSurface === 'wall') {
    layerPriority = 20;
  } else if (catalogItem?.placementSurface === 'desk') {
    layerPriority = 500;
  }

  return (maxFootprintSum * 1000) + (tileZ * 100) + layerPriority;
}

// -------------------------------------------------------------
// GEOMETRIC ROOM LAYOUT PLACEMENT VALIDATION
// -------------------------------------------------------------

export type OccupancyGrid = Map<string, string>;

export function buildOccupancyGrid(placedItems: PlacedRoomItem[], excludeInstanceId?: string): OccupancyGrid {
  const grid: OccupancyGrid = new Map();
  for (const item of placedItems) {
    if (item.instanceId === excludeInstanceId) continue;
    const catItem = getCatalogItem(item.catalogItemId);

    // Rugs do NOT block furniture placement on top of them!
    const isRug = item.catalogItemId.includes('rug') || catItem?.name?.toLowerCase().includes('alfombra');
    if (isRug) continue;

    const asset = catItem ? getRoomAsset(catItem.assetId) : undefined;
    // Use collisionTileWidth/Height if defined (allows visual footprint > collision footprint for closer placement)
    const rawW = asset?.collisionTileWidth ?? asset?.footprintTileWidth ?? 1;
    const rawH = asset?.collisionTileHeight ?? asset?.footprintTileHeight ?? 1;
    const w = (item.rotation === 90 || item.rotation === 270) ? rawH : rawW;
    const h = (item.rotation === 90 || item.rotation === 270) ? rawW : rawH;

    const isWall = catItem?.placementSurface === 'wall';
    const zSpan = isWall ? Math.max(1, Math.ceil((asset?.pixelHeight || 120) / 60)) : 1;

    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < (isWall ? 1 : h); dy++) {
        for (let dz = 0; dz < zSpan; dz++) {
          const cx = isWall ? (item.tileY === 0 ? item.tileX + dx : 0) : item.tileX + dx;
          const cy = isWall ? (item.tileX === 0 ? item.tileY + dx : 0) : item.tileY + dy;
          const cz = item.tileZ + dz;
          const key = `${cx}_${cy}_${cz}`;
          grid.set(key, item.instanceId);
        }
      }
    }
  }
  return grid;
}

export function isValidPlacedItem(item: any): item is PlacedRoomItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.instanceId === 'string' &&
    typeof item.catalogItemId === 'string' &&
    typeof item.tileX === 'number' && item.tileX >= 0 &&
    typeof item.tileY === 'number' && item.tileY >= 0 &&
    typeof item.tileZ === 'number' && item.tileZ >= 0 &&
    [0, 90, 180, 270].includes(item.rotation)
  );
}

export function validatePlacement(
  targetTileX: number,
  targetTileY: number,
  targetTileZ: number,
  rotation: 0 | 90 | 180 | 270,
  catalogItemId: string,
  currentInstanceId: string | null,
  placedItems: PlacedRoomItem[]
): PlacementValidationResult {
  const catalogItem = getCatalogItem(catalogItemId);
  if (!catalogItem) {
    return { isValid: false, reason: 'blocked', invalidTiles: [] };
  }

  const asset = getRoomAsset(catalogItem.assetId);
  // Use collisionTileWidth/Height if defined for the item being placed
  const rawW = asset?.collisionTileWidth ?? asset?.footprintTileWidth ?? 1;
  const rawH = asset?.collisionTileHeight ?? asset?.footprintTileHeight ?? 1;

  const effectiveW = (rotation === 90 || rotation === 270) ? rawH : rawW;
  const effectiveH = (rotation === 90 || rotation === 270) ? rawW : rawH;

  const isTargetWall = catalogItem.placementSurface === 'wall';
  const targetZSpan = isTargetWall ? Math.max(1, Math.ceil((asset?.pixelHeight || 120) / 60)) : 1;

  const invalidTiles: { tileX: number; tileY: number }[] = [];
  const occupancyGrid = buildOccupancyGrid(placedItems, currentInstanceId || undefined);

  for (let dx = 0; dx < effectiveW; dx++) {
    for (let dy = 0; dy < (isTargetWall ? 1 : effectiveH); dy++) {
      for (let dz = 0; dz < targetZSpan; dz++) {
        const cx = isTargetWall ? (targetTileY === 0 ? targetTileX + dx : 0) : targetTileX + dx;
        const cy = isTargetWall ? (targetTileX === 0 ? targetTileY + dx : 0) : targetTileY + dy;
        const cz = targetTileZ + dz;

        // 1. Validate Surface Type (Floor vs Wall)
        if (isTargetWall) {
          if (!isTileOnWall(cx, cy)) {
            invalidTiles.push({ tileX: cx, tileY: cy });
          }
        } else {
          if (!isTileOnFloor(cx, cy)) {
            invalidTiles.push({ tileX: cx, tileY: cy });
          }
        }

        // 2. Validate Surface Elevation for Floor Items
        if (!isTargetWall && (targetTileZ > 0 || catalogItem.placementSurface === 'desk')) {
          const hasSupportTable = placedItems.some(item => {
            if (item.instanceId === currentInstanceId) return false;
            if (item.tileZ !== 0) return false;
            const tableItem = getCatalogItem(item.catalogItemId);
            if (tableItem?.category !== 'furniture') return false;

            const tableAsset = getRoomAsset(tableItem.assetId);
            const tW = tableAsset?.footprintTileWidth || 1;
            const tH = tableAsset?.footprintTileHeight || 1;

            return cx >= item.tileX && cx < item.tileX + tW &&
                   cy >= item.tileY && cy < item.tileY + tH;
          });

          if (!hasSupportTable) {
            invalidTiles.push({ tileX: cx, tileY: cy });
          }
        }

        // 3. Fast O(1) 3D Occupancy Grid Collision Check (Rugs never collide with rugs or furniture)
        const isTargetRug = catalogItemId.includes('rug') || catalogItem.name.toLowerCase().includes('alfombra');
        if (!isTargetRug) {
          const collisionKey = `${cx}_${cy}_${cz}`;
          if (occupancyGrid.has(collisionKey)) {
            invalidTiles.push({ tileX: cx, tileY: cy });
          }
        }
      }
    }
  }

  if (invalidTiles.length > 0) {
    return {
      isValid: false,
      reason: catalogItem.placementSurface === 'wall' ? 'wall_mismatch' : 'out_of_floor',
      invalidTiles
    };
  }

  return {
    isValid: true,
    invalidTiles: []
  };
}

export const DEFAULT_PLACED_ITEMS: PlacedRoomItem[] = [
  {
    instanceId: 'inst_fireplace_main',
    catalogItemId: 'fireplace_gothic',
    tileX: 0,
    tileY: 0,
    tileZ: 0,
    rotation: 0
  },
  {
    instanceId: 'inst_window_sunlight',
    catalogItemId: 'window_stone_arch_gothic',
    tileX: 4,
    tileY: 0,
    tileZ: 1,
    rotation: 0
  },
  {
    instanceId: 'inst_bookshelf_nw',
    catalogItemId: 'bookshelf_library',
    tileX: 8,
    tileY: 0,
    tileZ: 0,
    rotation: 0
  },
  {
    instanceId: 'inst_clock_nw',
    catalogItemId: 'clock_wall',
    tileX: 2,
    tileY: 0,
    tileZ: 2,
    rotation: 0
  },
  {
    instanceId: 'inst_tapestry_ne',
    catalogItemId: 'tapestry_alchemy',
    tileX: 0,
    tileY: 4,
    tileZ: 2,
    rotation: 0
  },
  {
    instanceId: 'inst_door_gothic',
    catalogItemId: 'door_gothic_double',
    tileX: 0,
    tileY: 10,
    tileZ: 0,
    rotation: 0
  },
  {
    instanceId: 'inst_sofa_ne',
    catalogItemId: 'sofa_leather',
    tileX: 0,
    tileY: 7,
    tileZ: 0,
    rotation: 90
  },
  {
    instanceId: 'inst_sconce_ne',
    catalogItemId: 'sconce_candelabra',
    tileX: 0,
    tileY: 2,
    tileZ: 2,
    rotation: 0
  },
  {
    instanceId: 'inst_rug_center',
    catalogItemId: 'rug_persian',
    tileX: 4,
    tileY: 4,
    tileZ: 0,
    rotation: 0
  },
  {
    instanceId: 'inst_desk_center',
    catalogItemId: 'desk_academic',
    tileX: 5,
    tileY: 4,
    tileZ: 0,
    rotation: 0
  },
  {
    instanceId: 'inst_globe_side',
    catalogItemId: 'globe_brass',
    tileX: 3,
    tileY: 6,
    tileZ: 0,
    rotation: 0
  },
  {
    instanceId: 'inst_astrolabe_side',
    catalogItemId: 'astrolabe_stand',
    tileX: 1,
    tileY: 2,
    tileZ: 0,
    rotation: 0
  },
  {
    instanceId: 'inst_telescope_fg',
    catalogItemId: 'telescope_brass',
    tileX: 10,
    tileY: 9,
    tileZ: 0,
    rotation: 0
  }
];

export function loadRoomEngineState(): UserRoomData {
  const defaultState: UserRoomData = {
    roomId: 'main_2d_room',
    theme: 'parchment_classical',
    gridSizeX: GRID_SIZE_X,
    gridSizeY: GRID_SIZE_Y,
    placedItems: DEFAULT_PLACED_ITEMS
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.placedItems)) {
        const validParsedItems = parsed.placedItems.filter(isValidPlacedItem);
        const existingInstanceIds = new Set(validParsedItems.map((i: PlacedRoomItem) => i.instanceId));
        const mergedItems = [...validParsedItems];
        for (const defItem of DEFAULT_PLACED_ITEMS) {
          if (!existingInstanceIds.has(defItem.instanceId)) {
            mergedItems.push(defItem);
          }
        }

        const sanitizedItems = mergedItems.map(item => {
          const catItem = getCatalogItem(item.catalogItemId);
          if (catItem?.placementSurface === 'floor') {
            return {
              ...item,
              tileX: Math.max(1, item.tileX),
              tileY: Math.max(1, item.tileY)
            };
          }
          return item;
        });

        return {
          ...defaultState,
          ...parsed,
          placedItems: sanitizedItems,
          gridSizeX: GRID_SIZE_X,
          gridSizeY: GRID_SIZE_Y
        };
      }
    }
  } catch (e) {
    console.warn('Error loading 2D Room Engine state:', e);
  }

  return defaultState;
}

let saveDebounceTimer: NodeJS.Timeout | null = null;

export function saveRoomEngineStateDebounced(state: UserRoomData, userId: string = 'anonymous'): void {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);

  saveDebounceTimer = setTimeout(() => {
    const cleanPlacedItems: PlacedRoomItem[] = state.placedItems.map(item => ({
      instanceId: item.instanceId,
      catalogItemId: item.catalogItemId,
      tileX: item.tileX,
      tileY: item.tileY,
      tileZ: item.tileZ,
      rotation: item.rotation
    }));

    const cleanState: UserRoomData = {
      ...state,
      placedItems: cleanPlacedItems
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
      } catch (e) {
        console.warn('Error saving room state to LocalStorage:', e);
      }
    }

    if (userId && userId !== 'anonymous' && db) {
      try {
        const roomRef = doc(db, 'users', userId, 'knowledge_room', 'main');
        setDoc(roomRef, cleanState, { merge: true }).catch(err => {
          console.warn('Firestore sync failed:', err);
        });
      } catch (err) {
        console.warn('Firestore sync exception:', err);
      }
    }
  }, 300);
}
