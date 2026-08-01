import { RoomCatalogItem } from '@/types/roomEngine';

export const ROOM_ENGINE_CATALOG: RoomCatalogItem[] = [
  {
    id: 'telescope_brass',
    name: 'Telescopio Antiguo de Latón',
    description: 'Instrumento astronómico de latón envejecido y trípode de caoba.',
    discipline: 'physics',
    category: 'scientific',
    rarity: 'rare',
    assetId: 'asset_telescope_brass',
    placementSurface: 'floor',
    canRotate: true,
    unlockCondition: { type: 'layer_completed', targetId: 'ondas-y-optica', layer: 'principiante' }
  },
  {
    id: 'sofa_leather',
    name: 'Sofá de Cuero Clásico',
    description: 'Sofá de cuero marrón acolchado con molduras de madera oscura.',
    discipline: 'general',
    category: 'furniture',
    rarity: 'common',
    assetId: 'asset_sofa_leather',
    placementSurface: 'floor',
    canRotate: true
  },
  {
    id: 'bookshelf_library',
    name: 'Estantería de Madera de Caoba',
    description: 'Librería artesanal repleta de tomos de cuero y manuscritos antiguos.',
    discipline: 'computer_science',
    category: 'furniture',
    rarity: 'epic',
    assetId: 'asset_bookshelf_wood',
    placementSurface: 'floor',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'guia-maestra-de-fisica' }
  },
  {
    id: 'desk_academic',
    name: 'Escritorio Académico de Caoba',
    description: 'Gran mesa de estudio de caoba con superficie de cuero y manuscritos.',
    discipline: 'general',
    category: 'furniture',
    rarity: 'rare',
    assetId: 'asset_desk_academic',
    placementSurface: 'floor',
    canRotate: true
  },
  {
    id: 'armchair_chesterfield',
    name: 'Sillón Chesterfield de Cuero',
    description: 'Sillón capitoné clásico en cuero marrón con remaches de latón.',
    discipline: 'general',
    category: 'furniture',
    rarity: 'uncommon',
    assetId: 'asset_armchair_chesterfield',
    placementSurface: 'floor',
    canRotate: true
  },
  {
    id: 'globe_brass',
    name: 'Globo Celeste y Esfera Armilar',
    description: 'Instrumento astronómico en trípode de caoba con esfera armilar de latón.',
    discipline: 'physics',
    category: 'scientific',
    rarity: 'rare',
    assetId: 'asset_globe_brass',
    placementSurface: 'floor',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'cosmologia' }
  },
  {
    id: 'window_gothic',
    name: 'Vidriera Gótica de la Sabiduría',
    description: 'Ventana ojival gótica con vidrieras emplomadas que filtran luz multicolor.',
    discipline: 'general',
    category: 'decoration',
    rarity: 'epic',
    assetId: 'asset_window_gothic',
    placementSurface: 'wall',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'metodo-cientifico' }
  },
  {
    id: 'ivy_wall',
    name: 'Hiedra Verde para Pared',
    description: 'Enredadera de hiedra natural sobre enrejado de madera para decorar paredes.',
    discipline: 'biology',
    category: 'plants',
    rarity: 'common',
    assetId: 'asset_ivy_wall',
    placementSurface: 'wall',
    canRotate: true
  },
  {
    id: 'clock_wall',
    name: 'Reloj de Pared de Péndulo',
    description: 'Reloj de péndulo antiguo de caoba con esfera y engranajes de latón.',
    discipline: 'physics',
    category: 'decoration',
    rarity: 'uncommon',
    assetId: 'asset_clock_wall',
    placementSurface: 'wall',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'termodinamica' }
  },
  {
    id: 'fireplace_gothic',
    name: 'Chimenea Gótica de Piedra',
    description: 'Gran chimenea gótica de piedra labrada con brasas ardientes.',
    discipline: 'physics',
    category: 'furniture',
    rarity: 'rare',
    assetId: 'asset_fireplace_gothic',
    placementSurface: 'floor',
    canRotate: true
  },
  {
    id: 'astrolabe_stand',
    name: 'Astrolabio sobre Pedestal',
    description: 'Esfera armilar de latón antiguo sobre pedestal de caoba.',
    discipline: 'physics',
    category: 'scientific',
    rarity: 'rare',
    assetId: 'asset_astrolabe_stand',
    placementSurface: 'floor',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'movimiento-circular-satelites' }
  },
  {
    id: 'rug_persian',
    name: 'Alfombra Persa Erudita',
    description: 'Elegante alfombra persa en tonos carmesí y oro.',
    discipline: 'general',
    category: 'decoration',
    rarity: 'common',
    assetId: 'asset_rug_persian',
    placementSurface: 'floor',
    canRotate: true
  },
  {
    id: 'tapestry_alchemy',
    name: 'Tapiz Alquímico Celestial',
    description: 'Tapiz de pared medieval grabado con símbolos astronómicos.',
    discipline: 'mathematics',
    category: 'decoration',
    rarity: 'uncommon',
    assetId: 'asset_tapestry_alchemy',
    placementSurface: 'wall',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'mecanica-cuantica' }
  },
  {
    id: 'sconce_candelabra',
    name: 'Candelabro Gótico de Pared',
    description: 'Candelabro de pared de latón con velas gemelas de llamas cálidas.',
    discipline: 'physics',
    category: 'decoration',
    rarity: 'common',
    assetId: 'asset_sconce_candelabra',
    placementSurface: 'wall',
    canRotate: true
  },
  {
    id: 'window_arched_sunlight',
    name: 'Ventanal Gótico Iluminado',
    description: 'Ventana gótica de madera con haces de luz solar dorada.',
    discipline: 'physics',
    category: 'decoration',
    rarity: 'rare',
    assetId: 'asset_window_arched_sunlight',
    placementSurface: 'wall',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'materia-y-energia' }
  },
  {
    id: 'window_stained_rose',
    name: 'Ventanal Rosetón Gótico',
    description: 'Gran ventana gótica de caoba con vidriera artesanal azul y oro.',
    discipline: 'mathematics',
    category: 'decoration',
    rarity: 'epic',
    assetId: 'asset_window_gothic_tight',
    placementSurface: 'wall',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'relatividad-especial' }
  },
  {
    id: 'window_stone_arch_gothic',
    name: 'Ventana Gótica de Cantería',
    description: 'Ventanal gótico ortográfico con arco de piedra esculpida y repisa de cantería.',
    discipline: 'physics',
    category: 'decoration',
    rarity: 'legendary',
    assetId: 'asset_window_stone_arch_gothic',
    placementSurface: 'wall',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'leyes-newton-movimiento' }
  },
  {
    id: 'door_gothic_double',
    name: 'Puerta Gótica de Caoba',
    description: 'Imponente puerta gótica de caoba tallada con herrajes de latón y columnas de cantería.',
    discipline: 'physics',
    category: 'decoration',
    rarity: 'legendary',
    assetId: 'asset_door_gothic_double',
    placementSurface: 'wall',
    canRotate: true
  },
  {
    id: 'chair_baroque_royal',
    name: 'Silla Barroca Real',
    description: 'Silla de despacho barroca con cuero capitoné burdeos, talla dorada y base giratoria esculpida.',
    discipline: 'general',
    category: 'furniture',
    rarity: 'legendary',
    assetId: 'asset_chair_baroque_royal',
    placementSurface: 'floor',
    canRotate: true,
    unlockCondition: { type: 'article_completed', targetId: 'fisica-particulas' }
  }
];

export function getCatalogItem(id: string): RoomCatalogItem | undefined {
  return ROOM_ENGINE_CATALOG.find(item => item.id === id);
}
