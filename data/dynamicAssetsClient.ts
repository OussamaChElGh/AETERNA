import { RoomCatalogItem, RoomAsset } from '@/types/roomEngine';
import { ROOM_ENGINE_CATALOG, getCatalogItem as getStaticCatalogItem } from './roomEngineCatalog';
import { ROOM_ASSETS, getRoomAsset as getStaticRoomAsset } from './roomEngineAssets';

// En el cliente, solo usamos datos estáticos
// Los assets dinámicos se cargan solo en el servidor

export function getCombinedCatalog(): RoomCatalogItem[] {
  // Por ahora, solo retornar el catálogo estático en el cliente
  // En el servidor, se puede usar getCombinedCatalogServer desde dynamicAssets
  return ROOM_ENGINE_CATALOG;
}

export function getCombinedCatalogItem(id: string): RoomCatalogItem | undefined {
  return getStaticCatalogItem(id);
}

export function getCombinedRoomAsset(id: string): RoomAsset | undefined {
  return getStaticRoomAsset(id);
}
