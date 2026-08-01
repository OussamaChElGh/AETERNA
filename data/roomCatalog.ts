import { RoomItemCatalogEntry } from '@/types/room';

export const ROOM_ITEM_CATALOG: RoomItemCatalogEntry[] = [
  {
    id: 'physics_telescope',
    name: 'Telescopio Antiguo de Latón',
    description: 'Instrumento astronómico para la observación del movimiento planetario y el cosmos.',
    category: 'scientific',
    discipline: 'physics',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_pixel_telescope.png',
      widthGrid: 2,
      heightGrid: 3
    },
    unlockCondition: {
      type: 'article_completed',
      targetId: 'como-piensa-un-fisico',
      description: 'Completar el artículo "Cómo Piensa un Físico: Medición y Modelos"'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'physics_prism',
    name: 'Prisma Espectral de Newton',
    description: 'Prisma de cristal que descompone la luz blanca en su espectro electromagnético. Poster desbloqueado al completar la capa de Fundamentos de Óptica.',
    category: 'scientific',
    discipline: 'physics',
    rarity: 'uncommon',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_pixel_prism.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'layer_completed',
      targetId: 'ondas-y-optica',
      layer: 'principiante',
      description: 'Completar la capa de Fundamentos de "Ondas y Óptica"'
    },
    placementRules: ['wall', 'desk', 'floor'],
    allowRotation: true
  },
  {
    id: 'physics_schrodinger_cat',
    name: 'Caja de Schrödinger',
    description: 'Caja cuántica hermética en estado de superposición cuántica.',
    category: 'scientific',
    discipline: 'physics',
    rarity: 'epic',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_pixel_trophy.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'article_completed',
      targetId: 'mecanica-cuantica',
      description: 'Completar el artículo "Mecánica Cuántica: Dualidad y Superposición"'
    },
    placementRules: ['floor', 'desk'],
    allowRotation: true
  },
  {
    id: 'math_golden_spiral',
    name: 'Marco de la Proporción Áurea',
    description: 'Diagrama geométrico sagrado con la espiral logarítmica de Fibonacci.',
    category: 'decoration',
    discipline: 'mathematics',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_pixel_math.png',
      widthGrid: 3,
      heightGrid: 3
    },
    unlockCondition: {
      type: 'article_completed',
      targetId: 'vectores-y-espacio',
      description: 'Completar un artículo de Matemáticas o Geometría'
    },
    placementRules: ['wall', 'floor'],
    allowRotation: false
  },
  {
    id: 'math_abacus',
    name: 'Ábaco Antiguo de Caoba',
    description: 'Herramienta clásica de cálculo aritmético de alta precisión.',
    category: 'scientific',
    discipline: 'mathematics',
    rarity: 'common',
    asset: {
      type: 'svg',
      src: 'abacus',
      widthGrid: 2,
      heightGrid: 1,
      color: '#D4AF37'
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible al fundar tu Habitación del Conocimiento'
    },
    placementRules: ['desk', 'floor'],
    allowRotation: true
  },
  {
    id: 'cs_quantum_core',
    name: 'Procesador Cuántico Aeterna',
    description: 'Matriz de cómputo cuántico con superconductores de flujo binario.',
    category: 'scientific',
    discipline: 'computer_science',
    rarity: 'legendary',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_pixel_cs.png',
      widthGrid: 3,
      heightGrid: 3
    },
    unlockCondition: {
      type: 'article_completed',
      targetId: 'fisica-tecnologia',
      description: 'Completar el artículo "Del Transistor al Computador Cuántico"'
    },
    placementRules: ['floor', 'desk'],
    allowRotation: true
  },
  {
    id: 'cs_terminal_desk',
    name: 'Escritorio de Cómputo Cobre',
    description: 'Mesa de trabajo de cobre pulido equipada con terminales de datos.',
    category: 'furniture',
    discipline: 'computer_science',
    rarity: 'rare',
    asset: {
      type: 'svg',
      src: 'terminal',
      widthGrid: 3,
      heightGrid: 2,
      color: '#8B6914'
    },
    unlockCondition: {
      type: 'level_reached',
      targetId: 'level_3',
      description: 'Alcanzar el Nivel 3 de Usuario'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'philosophy_bust',
    name: 'Busto de Mármol de Sócrates',
    description: 'Escultura clásica de mármol que evoca el diálogo socrático y la contemplación.',
    category: 'collectibles',
    discipline: 'philosophy',
    rarity: 'epic',
    asset: {
      type: 'svg',
      src: 'bust',
      widthGrid: 2,
      heightGrid: 2,
      color: '#E5E7EB'
    },
    unlockCondition: {
      type: 'discipline_mastered',
      targetId: 'humanidades',
      description: 'Completar guías en la rama de Filosofía y Humanidades'
    },
    placementRules: ['floor', 'desk'],
    allowRotation: true
  },
  {
    id: 'bio_microscope',
    name: 'Microscopio de Latón',
    description: 'Instrumento óptico para explorar la estructura celular y microbiana.',
    category: 'scientific',
    discipline: 'biology',
    rarity: 'uncommon',
    asset: {
      type: 'svg',
      src: 'microscope',
      widthGrid: 2,
      heightGrid: 2,
      color: '#10B981'
    },
    unlockCondition: {
      type: 'article_completed',
      targetId: 'fisica-atomica',
      description: 'Completar artículos en ciencias biológicas o atómicas'
    },
    placementRules: ['desk', 'floor'],
    allowRotation: true
  },
  {
    id: 'bio_terrarium',
    name: 'Terrario Bioluminiscente',
    description: 'Ecosistema sellado en cristal con musgo y flora bioluminiscente.',
    category: 'plants',
    discipline: 'biology',
    rarity: 'rare',
    asset: {
      type: 'svg',
      src: 'terrarium',
      widthGrid: 2,
      heightGrid: 2,
      color: '#34D399'
    },
    unlockCondition: {
      type: 'streak_reached',
      targetId: 'streak_3',
      description: 'Alcanzar una Racha de Lectura de 3 días'
    },
    placementRules: ['desk', 'floor', 'shelf'],
    allowRotation: true
  },
  {
    id: 'general_bookshelf',
    name: 'Estantería de Pergaminos Dorados',
    description: 'Mueble de madera noble para almacenar el Codex y tomos del conocimiento.',
    category: 'furniture',
    discipline: 'general',
    rarity: 'common',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_pixel_bookshelf.png',
      widthGrid: 3,
      heightGrid: 3
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible por defecto al fundar tu Habitación'
    },
    placementRules: ['floor', 'wall'],
    allowRotation: true
  },
  {
    id: 'general_armchair',
    name: 'Sillón de Lectura de Cuero Noble',
    description: 'Sillón acolchado de cuero con detalles en latón para largas sesiones de estudio.',
    category: 'furniture',
    discipline: 'general',
    rarity: 'uncommon',
    asset: {
      type: 'svg',
      src: 'armchair',
      widthGrid: 2,
      heightGrid: 2,
      color: '#8B4513'
    },
    unlockCondition: {
      type: 'level_reached',
      targetId: 'level_2',
      description: 'Alcanzar el Nivel 2 de Usuario'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'master_academic_desk',
    name: 'Escritorio Académico de Caoba',
    description: 'Gran mesa de estudio de caoba con superficie de cuero, lámpara de latón y manuscritos.',
    category: 'furniture',
    discipline: 'general',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_desk_0deg.png',
      widthGrid: 3,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'master_chesterfield_armchair',
    name: 'Sillón Chesterfield de Cuero',
    description: 'Sillón capitoné clásico en cuero marrón con remaches de latón.',
    category: 'furniture',
    discipline: 'general',
    rarity: 'uncommon',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_armchair_0deg.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'master_brass_globe',
    name: 'Globo Celeste y Esfera Armilar',
    description: 'Instrumento astronómico en trípode de caoba tallado con esfera armilar de latón.',
    category: 'scientific',
    discipline: 'physics',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_globe_0deg.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'master_gothic_window',
    name: 'Vidriera Gótica de la Sabiduría',
    description: 'Ventana ojival gótica con vidrieras emplomadas multicolor.',
    category: 'wall',
    discipline: 'general',
    rarity: 'epic',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_gothic_window.png',
      widthGrid: 2,
      heightGrid: 3
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'master_wall_ivy',
    name: 'Hiedra Verde para Pared',
    description: 'Enredadera de hiedra natural sobre enrejado para paredes.',
    category: 'plants',
    discipline: 'biology',
    rarity: 'common',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_wall_ivy.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'master_wall_clock',
    name: 'Reloj de Pared de Péndulo',
    description: 'Reloj de péndulo clásico de caoba y latón.',
    category: 'decoration',
    discipline: 'physics',
    rarity: 'uncommon',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_wall_clock.png',
      widthGrid: 1,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'fireplace_gothic',
    name: 'Chimenea Gótica de Piedra',
    description: 'Gran chimenea gótica de piedra labrada con brasas ardientes.',
    category: 'furniture',
    discipline: 'physics',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_fireplace.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'astrolabe_stand',
    name: 'Astrolabio sobre Pedestal',
    description: 'Esfera armilar de latón antiguo sobre pedestal de caoba.',
    category: 'scientific',
    discipline: 'physics',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_astrolabe.png',
      widthGrid: 1,
      heightGrid: 1
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['floor', 'desk'],
    allowRotation: true
  },
  {
    id: 'rug_persian',
    name: 'Alfombra Persa Erudita',
    description: 'Gran alfombra tejida con intrincados arabescos carmesí y zafiro.',
    category: 'decoration',
    discipline: 'philosophy',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_persian_rug.png',
      widthGrid: 3,
      heightGrid: 3
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['floor'],
    allowRotation: true
  },
  {
    id: 'tapestry_alchemy',
    name: 'Tapiz Alquímico Celestial',
    description: 'Tapiz de pared medieval grabado con símbolos astronómicos.',
    category: 'decoration',
    discipline: 'mathematics',
    rarity: 'uncommon',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_wall_tapestry.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'sconce_candelabra',
    name: 'Candelabro Gótico de Pared',
    description: 'Candelabro de pared de latón con velas gemelas de llamas cálidas.',
    category: 'decoration',
    discipline: 'physics',
    rarity: 'common',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_wall_sconce.png',
      widthGrid: 1,
      heightGrid: 1
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'window_arched_sunlight',
    name: 'Ventanal Gótico Iluminado',
    description: 'Ventana gótica de madera con haces de luz solar dorada.',
    category: 'decoration',
    discipline: 'physics',
    rarity: 'rare',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_arched_window_sunlight.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'window_stained_rose',
    name: 'Ventanal Rosetón Gótico',
    description: 'Gran ventana gótica de caoba con vidriera artesanal azul y oro.',
    category: 'decoration',
    discipline: 'mathematics',
    rarity: 'epic',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_gothic_window_tight.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'window_stone_arch_gothic',
    name: 'Ventana Gótica de Cantería',
    description: 'Ventanal gótico ortográfico con arco de piedra esculpida y repisa de cantería.',
    category: 'decoration',
    discipline: 'physics',
    rarity: 'legendary',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_stone_gothic_window.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  },
  {
    id: 'door_gothic_double',
    name: 'Puerta Gótica de Caoba',
    description: 'Imponente puerta gótica de caoba tallada con herrajes de latón y columnas de cantería.',
    category: 'decoration',
    discipline: 'physics',
    rarity: 'legendary',
    asset: {
      type: 'pixel_art',
      src: '/images/aeterna_master_gothic_door.png',
      widthGrid: 2,
      heightGrid: 2
    },
    unlockCondition: {
      type: 'default',
      targetId: 'default',
      description: 'Disponible en tu Estancia Académica'
    },
    placementRules: ['wall'],
    allowRotation: true
  }
];

export function getCatalogItemById(itemId: string): RoomItemCatalogEntry | undefined {
  return ROOM_ITEM_CATALOG.find(item => item.id === itemId);
}
