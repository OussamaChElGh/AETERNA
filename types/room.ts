export type ItemCategory = 
  | 'furniture' 
  | 'decoration' 
  | 'wall' 
  | 'floor' 
  | 'scientific' 
  | 'books' 
  | 'plants' 
  | 'collectibles';

export type DisciplineType = 
  | 'physics' 
  | 'mathematics' 
  | 'computer_science' 
  | 'philosophy' 
  | 'biology' 
  | 'history' 
  | 'general';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface RoomItemCatalogEntry {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  discipline: DisciplineType;
  rarity: ItemRarity;
  asset: {
    type: 'pixel_art' | 'svg' | 'icon';
    src: string;
    widthGrid: number;  // width in logical grid units
    heightGrid: number; // height in logical grid units
    color?: string;
  };
  unlockCondition: {
    type: 'article_completed' | 'level_reached' | 'discipline_mastered' | 'streak_reached' | 'layer_completed' | 'default';
    targetId: string; // e.g. 'como-piensa-un-fisico' or 'level_1'
    description: string;
    layer?: string; // for 'layer_completed' type: 'principiante' | 'intermedio' | 'avanzado'
  };
  placementRules: ('floor' | 'wall' | 'desk' | 'shelf')[];
  allowRotation: boolean;
}

export interface PlacedRoomItem {
  id: string;         // Unique instance ID (e.g. 'placed_physics_telescope_1785...')
  itemId: string;     // Catalog ID (e.g. 'physics_telescope')
  gridX: number;      // Logical Grid X (0..20)
  gridY: number;      // Logical Grid Y (0..15)
  rotation: number;   // 0, 90, 180, 270 degrees
  zIndex: number;     // Depth sorting
  scale: number;      // Scaling factor
}

export interface UserRoomData {
  id: string;
  userId: string;
  theme: string;
  gridColumns: number; // e.g. 20
  gridRows: number;    // e.g. 15
  placedItems: PlacedRoomItem[];
  unlockedItemIds: string[]; // Inventory of unlocked catalog IDs
  updatedAt: string;
}
