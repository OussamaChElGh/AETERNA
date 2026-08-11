import { RoomCatalogItem, RoomAsset } from '@/types/roomEngine';
import { ROOM_ENGINE_CATALOG, getCatalogItem as getStaticCatalogItem } from './roomEngineCatalog';
import { ROOM_ASSETS, getRoomAsset as getStaticRoomAsset } from './roomEngineAssets';

// En el cliente, solo usamos datos estáticos
// Los assets dinámicos se cargan solo en el servidor

export function getCombinedCatalog(): RoomCatalogItem[] {
  if (typeof window !== 'undefined') {
    const { getCachedCombinedAssets } = require('@/hooks/useCombinedAssets');
    const cached = getCachedCombinedAssets?.();
    if (cached?.catalog) return cached.catalog;
  }
  return ROOM_ENGINE_CATALOG;
}

export function getCombinedCatalogItem(id: string): RoomCatalogItem | undefined {
  if (typeof window !== 'undefined') {
    const { getCachedCombinedAssets } = require('@/hooks/useCombinedAssets');
    const cached = getCachedCombinedAssets?.();
    if (cached?.catalog) return cached.catalog.find((c: RoomCatalogItem) => c.id === id);
  }
  return getStaticCatalogItem(id);
}

export function getCombinedRoomAsset(id: string): RoomAsset | undefined {
  return getStaticRoomAsset(id);
}
