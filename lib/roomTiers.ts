export interface RoomTier {
  tier: number;
  name: string;
  visibleGrid: number;
  levelRequired: number;
  roomWidth: number;
  roomHeight: number;
}

export const ROOM_TIERS: RoomTier[] = [
  { tier: 1, name: 'Estudio Pequeño',        visibleGrid: 8,  levelRequired: 1,  roomWidth: 686, roomHeight: 543 },
  { tier: 2, name: 'Estudio Medio',          visibleGrid: 10, levelRequired: 3,  roomWidth: 857, roomHeight: 679 },
  { tier: 3, name: 'Estudio Amplio',         visibleGrid: 12, levelRequired: 7,  roomWidth: 1029, roomHeight: 814 },
  { tier: 4, name: 'Salón del Saber',        visibleGrid: 14, levelRequired: 12, roomWidth: 1200, roomHeight: 950 },
  { tier: 5, name: 'Gran Salón Académico',   visibleGrid: 16, levelRequired: 20, roomWidth: 1371, roomHeight: 1086 },
  { tier: 6, name: 'Salón de la Eternidad',  visibleGrid: 20, levelRequired: 35, roomWidth: 1714, roomHeight: 1357 },
  { tier: 7, name: 'Sanctum del Conocimiento', visibleGrid: 24, levelRequired: 55, roomWidth: 2057, roomHeight: 1629 },
];

export const DEFAULT_TIER = ROOM_TIERS[0];
export const MAX_TIER = ROOM_TIERS[ROOM_TIERS.length - 1];

export function getRoomTier(level: number): RoomTier {
  for (let i = ROOM_TIERS.length - 1; i >= 0; i--) {
    if (level >= ROOM_TIERS[i].levelRequired) {
      return ROOM_TIERS[i];
    }
  }
  return DEFAULT_TIER;
}

export function getNextTier(currentTier: RoomTier): RoomTier | null {
  const idx = ROOM_TIERS.findIndex(t => t.tier === currentTier.tier);
  if (idx < ROOM_TIERS.length - 1) {
    return ROOM_TIERS[idx + 1];
  }
  return null;
}

export const BASE_ROOM_WIDTH = 1200;
export const BASE_ROOM_HEIGHT = 950;
