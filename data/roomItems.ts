export interface CatalogItem {
  id: string;
  name: string;
  category: 'furniture' | 'scientific' | 'decoration' | 'plants' | 'books';
  image: string;
  widthGrid: number;  // Grid cells wide (each cell = 25px logical)
  heightGrid: number; // Grid cells high
  allowRotation: boolean;
}

export interface PlacedItem {
  instanceId: string;
  itemId: string;
  gridX: number; // 0..40
  gridY: number; // 0..28
  rotation: number; // 0, 90, 180, 270
  zIndex: number;
}

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'escritorio',
    name: 'Escritorio de Madera Noble',
    category: 'furniture',
    image: '/images/aeterna_pixel_empty_room.png', // Uses sprite assets or styled pixel representation
    widthGrid: 4,
    heightGrid: 3,
    allowRotation: true
  },
  {
    id: 'silla',
    name: 'Silla de Estudio',
    category: 'furniture',
    image: '/images/aeterna_pixel_empty_room.png',
    widthGrid: 2,
    heightGrid: 2,
    allowRotation: true
  },
  {
    id: 'estanteria',
    name: 'Estantería de Tomos',
    category: 'furniture',
    image: '/images/aeterna_pixel_bookshelf.png',
    widthGrid: 3,
    heightGrid: 4,
    allowRotation: true
  },
  {
    id: 'telescopio',
    name: 'Telescopio de Latón',
    category: 'scientific',
    image: '/images/aeterna_pixel_telescope.png',
    widthGrid: 2,
    heightGrid: 3,
    allowRotation: true
  },
  {
    id: 'lampara',
    name: 'Lámpara de Escritorio',
    category: 'decoration',
    image: '/images/aeterna_pixel_prism.png',
    widthGrid: 2,
    heightGrid: 2,
    allowRotation: true
  },
  {
    id: 'planta',
    name: 'Planta en Maceta de Barro',
    category: 'plants',
    image: '/images/aeterna_pixel_prism.png',
    widthGrid: 2,
    heightGrid: 2,
    allowRotation: false
  },
  {
    id: 'globo',
    name: 'Globo Terráqueo de Caoba',
    category: 'scientific',
    image: '/images/aeterna_pixel_math.png',
    widthGrid: 2,
    heightGrid: 2,
    allowRotation: true
  },
  {
    id: 'cuadro',
    name: 'Cuadro de Constelaciones',
    category: 'decoration',
    image: '/images/aeterna_pixel_physics.png',
    widthGrid: 3,
    heightGrid: 2,
    allowRotation: false
  },
  {
    id: 'libros',
    name: 'Pila de Libros Antiguos',
    category: 'books',
    image: '/images/aeterna_pixel_cs.png',
    widthGrid: 2,
    heightGrid: 2,
    allowRotation: true
  },
  {
    id: 'instrumento',
    name: 'Prisma de Cristal y Soporte',
    category: 'scientific',
    image: '/images/aeterna_pixel_prism.png',
    widthGrid: 2,
    heightGrid: 2,
    allowRotation: true
  }
];

export function getCatalogItem(itemId: string): CatalogItem | undefined {
  return CATALOG_ITEMS.find(item => item.id === itemId);
}
