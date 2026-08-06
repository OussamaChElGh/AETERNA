import fs from 'fs';
import path from 'path';
import { RoomCatalogItem, RoomAsset } from '@/types/roomEngine';
import { ROOM_ENGINE_CATALOG, getCatalogItem as getStaticCatalogItem } from './roomEngineCatalog';
import { ROOM_ASSETS, getRoomAsset as getStaticRoomAsset } from './roomEngineAssets';

const ASSETS_FILE = path.join(process.cwd(), 'data', 'assets.json');

export interface DynamicAsset {
  id: string;
  name: string;
  description: string;
  type: string;
  discipline: string;
  rarity: string;
  category: string;
  imageUrl: string;
  storagePath: string;
  footprintTileWidth: number;
  footprintTileHeight: number;
  pixelWidth: number;
  pixelHeight: number;
  anchorX: number;
  anchorY: number;
  placementSurface: string;
  canRotate: boolean;
  isFromCatalog?: boolean;
  unlockCondition?: {
    type: string;
    targetId?: string;
    layer?: string;
    nivel?: number;
  };
}

// Esta función solo se ejecuta en el servidor
export function loadDynamicAssetsServer(): DynamicAsset[] {
  try {
    if (fs.existsSync(ASSETS_FILE)) {
      const data = fs.readFileSync(ASSETS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.assets || [];
    }
  } catch (error) {
    console.error('Error loading dynamic assets:', error);
  }
  return [];
}

// Función para el cliente - usa datos estáticos
// En el futuro, esto podría cargar desde una API
export function loadDynamicAssetsClient(): DynamicAsset[] {
  // Por ahora, retornar vacío en el cliente
  // Los assets dinámicos solo se cargan en el servidor
  return [];
}

// Variable global para cache en el servidor
let serverCache: DynamicAsset[] | null = null;
let lastLoadTime = 0;
const CACHE_TTL = 5000;

export function getDynamicAssetsCached(): DynamicAsset[] {
  const now = Date.now();
  if (serverCache && (now - lastLoadTime) < CACHE_TTL) {
    return serverCache;
  }

  serverCache = loadDynamicAssetsServer();
  lastLoadTime = now;
  return serverCache;
}

export function clearDynamicAssetsCache() {
  serverCache = null;
  lastLoadTime = 0;
}

// Combina catálogo estático con assets dinámicos (solo servidor)
export function getCombinedCatalogServer(): RoomCatalogItem[] {
  const dynamicAssets = getDynamicAssetsCached();
  const staticIds = new Set(ROOM_ENGINE_CATALOG.map(item => item.id));
  
  const dynamicCatalogItems: RoomCatalogItem[] = dynamicAssets
    .filter(asset => !staticIds.has(asset.id))
    .map(asset => ({
      id: asset.id,
      name: asset.name,
      description: asset.description,
      discipline: asset.discipline as any,
      category: asset.category as any,
      rarity: asset.rarity as any,
      assetId: asset.id,
      placementSurface: asset.placementSurface as any,
      canRotate: asset.canRotate,
      unlockCondition: asset.unlockCondition as any,
    }));

  return [...ROOM_ENGINE_CATALOG, ...dynamicCatalogItems];
}

// Obtiene un item del catálogo combinado (solo servidor)
export function getCombinedCatalogItemServer(id: string): RoomCatalogItem | undefined {
  const staticItem = getStaticCatalogItem(id);
  if (staticItem) return staticItem;

  const dynamicAssets = getDynamicAssetsCached();
  const asset = dynamicAssets.find(a => a.id === id);
  if (!asset) return undefined;

  return {
    id: asset.id,
    name: asset.name,
    description: asset.description,
    discipline: asset.discipline as any,
    category: asset.category as any,
    rarity: asset.rarity as any,
    assetId: asset.id,
    placementSurface: asset.placementSurface as any,
    canRotate: asset.canRotate,
    unlockCondition: asset.unlockCondition as any,
  };
}

// Combina assets estáticos con dinámicos (solo servidor)
export function getCombinedAssetsServer(): Record<string, RoomAsset> {
  const dynamicAssets = getDynamicAssetsCached();
  const combined: Record<string, RoomAsset> = { ...ROOM_ASSETS };

  for (const asset of dynamicAssets) {
    if (!combined[asset.id]) {
      combined[asset.id] = {
        id: asset.id,
        src: asset.imageUrl || asset.storagePath,
        footprintTileWidth: asset.footprintTileWidth,
        footprintTileHeight: asset.footprintTileHeight,
        pixelWidth: asset.pixelWidth,
        pixelHeight: asset.pixelHeight,
        anchorX: asset.anchorX,
        anchorY: asset.anchorY,
      };
    }
  }

  return combined;
}

// Obtiene un asset combinado (solo servidor)
export function getCombinedRoomAssetServer(id: string): RoomAsset | undefined {
  const staticAsset = getStaticRoomAsset(id);
  if (staticAsset) return staticAsset;

  const dynamicAssets = getDynamicAssetsCached();
  const asset = dynamicAssets.find(a => a.id === id);
  if (!asset) return undefined;

  return {
    id: asset.id,
    src: asset.imageUrl || asset.storagePath,
    footprintTileWidth: asset.footprintTileWidth,
    footprintTileHeight: asset.footprintTileHeight,
    pixelWidth: asset.pixelWidth,
    pixelHeight: asset.pixelHeight,
    anchorX: asset.anchorX,
    anchorY: asset.anchorY,
  };
}
