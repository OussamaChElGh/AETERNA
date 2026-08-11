import { UserRoomData, PlacedRoomItem, PlacementValidationResult, RoomCatalogItem } from '@/types/roomEngine';
import { getCombinedCatalog, getCombinedCatalogItem, getCombinedRoomAsset } from '@/data/dynamicAssetsClient';
import { ANEKTIA_ROOM_LAYOUT, isTileOnFloor, isTileOnWall } from '@/data/roomLayoutData';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const GM_USER_IDS: string[] = [
];

export const GM_USER_EMAILS: string[] = [
  'usamachaikh@gmail.com'
];

export interface RoomUnlockContext {
  completedPaths: string[];
  completedLayers?: Record<string, string[]>;
  userId?: string;
  userEmail?: string | null;
}

export function isCatalogItemUnlocked(item: RoomCatalogItem, ctx: RoomUnlockContext): boolean {
  if (ctx.userId && GM_USER_IDS.includes(ctx.userId)) return true;
  if (ctx.userEmail && GM_USER_EMAILS.includes(ctx.userEmail)) return true;
  
  const cond = item.unlockCondition;
  if (!cond || cond.type === 'default') return true;

  if (cond.type === 'article_completed' && cond.targetId) {
    const target = cond.targetId;
    return ctx.completedPaths.some(p =>
      p === target ||
      p.endsWith(`/${target}`) ||
      p.endsWith(`article_read_${target}`) ||
      p.endsWith(`_${target}`)
    );
  }

  if (cond.type === 'layer_completed' && cond.targetId) {
    const layers = ctx.completedLayers?.[cond.targetId] || [];
    return layers.includes(cond.layer || '');
  }

  return false;
}

export function evaluateRoomUnlocks(
  ctx: RoomUnlockContext,
  catalogOverride?: RoomCatalogItem[]
): { unlockedIds: Set<string>; lockedIds: Set<string> } {
  const catalog = catalogOverride ?? getCombinedCatalog();
  const unlockedIds = new Set<string>();
  const lockedIds = new Set<string>();
  for (const item of catalog) {
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
  const catalogItem = getCombinedCatalogItem(catalogItemId);
  const asset = catalogItem ? getCombinedRoomAsset(catalogItem.assetId) : undefined;

  const footprintW = asset?.footprintTileWidth || 1;
  const footprintH = asset?.footprintTileHeight || 1;
  const maxFootprintSum = (tileX + footprintW - 1) + (tileY + footprintH - 1);

  const isRug = catalogItemId.includes('rug') || catalogItem?.name?.toLowerCase().includes('alfombra');

  // Rugs ALWAYS render below everything
  if (isRug) {
    return 1;
  }

  // Wall items ALWAYS render behind floor items (z 10-40 vs floor min 100)
  if (catalogItem?.placementSurface === 'wall') {
    return (tileX + tileY) + 10;
  }

  let layerPriority = 100;
  if (catalogItem?.placementSurface === 'desk') {
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
    const catItem = getCombinedCatalogItem(item.catalogItemId);

    // Rugs do NOT block furniture placement on top of them!
    const isRug = item.catalogItemId.includes('rug') || catItem?.name?.toLowerCase().includes('alfombra');
    if (isRug) continue;

    const asset = catItem ? getCombinedRoomAsset(catItem.assetId) : undefined;
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
  const catalogItem = getCombinedCatalogItem(catalogItemId);
  if (!catalogItem) {
    return { isValid: false, reason: 'blocked', invalidTiles: [] };
  }

  const asset = getCombinedRoomAsset(catalogItem.assetId);
  // Use collisionTileWidth/Height if defined for the item being placed
  const rawW = asset?.collisionTileWidth ?? asset?.footprintTileWidth ?? 1;
  const rawH = asset?.collisionTileHeight ?? asset?.footprintTileHeight ?? 1;

  const effectiveW = (rotation === 90 || rotation === 270) ? rawH : rawW;
  const effectiveH = (rotation === 90 || rotation === 270) ? rawW : rawH;

  const isTargetWall = catalogItem.placementSurface === 'wall';
  const targetZSpan = isTargetWall ? Math.max(1, Math.ceil((asset?.pixelHeight || 120) / 60)) : 1;

  const invalidTiles: { tileX: number; tileY: number }[] = [];
  const occupancyGrid = buildOccupancyGrid(placedItems, currentInstanceId || undefined);

  let failureReason: 'out_of_floor' | 'wall_mismatch' | 'collision' | 'invalid_elevation' | 'blocked' | undefined;

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
            failureReason = failureReason || 'wall_mismatch';
          }
        } else {
          if (!isTileOnFloor(cx, cy)) {
            invalidTiles.push({ tileX: cx, tileY: cy });
            failureReason = failureReason || 'out_of_floor';
          }
        }

        // 2. Validate Surface Elevation — require desk support only when elevated (Z>0)
        if (!isTargetWall && targetTileZ > 0) {
          const hasSupportTable = placedItems.some(item => {
            if (item.instanceId === currentInstanceId) return false;
            if (item.tileZ !== 0) return false;
            const tableItem = getCombinedCatalogItem(item.catalogItemId);
            if (tableItem?.category !== 'furniture') return false;

            const tableAsset = getCombinedRoomAsset(tableItem.assetId);
            const tW = tableAsset?.footprintTileWidth || 1;
            const tH = tableAsset?.footprintTileHeight || 1;

            return cx >= item.tileX && cx < item.tileX + tW &&
                   cy >= item.tileY && cy < item.tileY + tH;
          });

          if (!hasSupportTable) {
            invalidTiles.push({ tileX: cx, tileY: cy });
            failureReason = failureReason || 'invalid_elevation';
          }
        }

        // 3. Fast O(1) 3D Occupancy Grid Collision Check (Rugs never collide with rugs or furniture)
        const isTargetRug = catalogItemId.includes('rug') || catalogItem.name.toLowerCase().includes('alfombra');
        if (!isTargetRug) {
          const collisionKey = `${cx}_${cy}_${cz}`;
          if (occupancyGrid.has(collisionKey)) {
            invalidTiles.push({ tileX: cx, tileY: cy });
            failureReason = failureReason || 'collision';
          }
        }
      }
    }
  }

  if (invalidTiles.length > 0) {
    return {
      isValid: false,
      reason: failureReason || (catalogItem.placementSurface === 'wall' ? 'wall_mismatch' : 'out_of_floor'),
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
    instanceId: 'inst_rug_center',
    catalogItemId: 'rug_persian',
    tileX: 5,
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
    instanceId: 'inst_chair_desk',
    catalogItemId: 'chair_baroque_royal',
    tileX: 6,
    tileY: 3,
    tileZ: 0,
    rotation: 180
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
    instanceId: 'inst_plant_corner',
    catalogItemId: 'fern_ceramic',
    tileX: 2,
    tileY: 7,
    tileZ: 0,
    rotation: 0
  }
];

export function hasRoomEngineState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!(parsed && Array.isArray(parsed.placedItems) && parsed.placedItems.length > 0);
  } catch {
    return false;
  }
}

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
          const catItem = getCombinedCatalogItem(item.catalogItemId);
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
        // Ruta dedicada del Room Engine. Separada de la del sistema legacy
        // (RoomRepository escribe a knowledge_room/main con otro esquema).
        const roomRef = doc(db, 'users', userId, 'knowledge_room', 'engine_main');
        setDoc(roomRef, cleanState, { merge: true }).catch(err => {
          console.warn('Firestore sync failed:', err);
        });
      } catch (err) {
        console.warn('Firestore sync exception:', err);
      }
    }
  }, 300);
}
