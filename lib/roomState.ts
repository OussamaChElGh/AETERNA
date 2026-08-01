import { PlacedItem } from '@/data/roomItems';

export const ROOM_CANVAS_WIDTH = 1000;
export const ROOM_CANVAS_HEIGHT = 700;
export const GRID_CELL_SIZE = 25; // 25px logical cell size
export const GRID_COLUMNS = ROOM_CANVAS_WIDTH / GRID_CELL_SIZE; // 40 columns
export const GRID_ROWS = ROOM_CANVAS_HEIGHT / GRID_CELL_SIZE; // 28 rows

const LOCAL_STORAGE_KEY = 'aeterna_room_prototype_state';

// Default initial placed items for first load
export const DEFAULT_INITIAL_PLACED_ITEMS: PlacedItem[] = [
  {
    instanceId: 'inst_escritorio_default',
    itemId: 'escritorio',
    gridX: 16,
    gridY: 14,
    rotation: 0,
    zIndex: 14
  },
  {
    instanceId: 'inst_silla_default',
    itemId: 'silla',
    gridX: 17,
    gridY: 18,
    rotation: 0,
    zIndex: 18
  },
  {
    instanceId: 'inst_telescopio_default',
    itemId: 'telescopio',
    gridX: 6,
    gridY: 10,
    rotation: 0,
    zIndex: 10
  },
  {
    instanceId: 'inst_libros_default_1',
    itemId: 'libros',
    gridX: 18,
    gridY: 13,
    rotation: 0,
    zIndex: 13
  }
];

export function loadRoomState(): PlacedItem[] {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_PLACED_ITEMS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length >= 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading room state from localStorage:', e);
  }
  return DEFAULT_INITIAL_PLACED_ITEMS;
}

export function saveRoomState(items: PlacedItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Error saving room state to localStorage:', e);
  }
}
