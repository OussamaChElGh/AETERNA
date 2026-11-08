import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog';

const REWARDS = [
  ['telescope_brass', 'sofa_leather', 'bookshelf_library', 'desk_academic'],
  ['armchair_chesterfield', 'globe_brass', 'window_gothic', 'ivy_wall'],
  ['clock_wall', 'fireplace_gothic', 'astrolabe_stand', 'rug_persian'],
  ['tapestry_alchemy', 'sconce_candelabra', 'window_arched_sunlight', 'window_stained_rose'],
];

export function getChestRewards(level: number) {
  return (REWARDS[level - 1] || []).flatMap(id => {
    const item = ROOM_ENGINE_CATALOG.find(entry => entry.id === id);
    return item ? [item] : [];
  });
}

export function getFurnitureGrant(
  progress: { extraFurniture?: string[]; claimedFurnitureChests?: Record<string, string> },
  itemIds: string[], chestId?: string
) {
  if (chestId && (progress.claimedFurnitureChests?.[chestId] || !itemIds[0])) return null;
  return {
    extraFurniture: [...new Set([...(progress.extraFurniture || []), ...itemIds])],
    ...(chestId ? { claimedFurnitureChests: { ...progress.claimedFurnitureChests, [chestId]: itemIds[0] } } : {}),
  };
}
