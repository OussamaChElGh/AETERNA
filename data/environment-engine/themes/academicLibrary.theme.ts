import { EnvironmentTheme } from '@/types/environmentEngine';

export const ACADEMIC_LIBRARY_THEME: EnvironmentTheme = {
  id: 'academic_library_parchment',
  name: 'Estancia Académica de Caoba y Pergamino',
  artStyle: 'academic_illustrative',
  floorTileSet: {
    id: 'oak_parquet_classical',
    tileWidthPx: 64,
    tileHeightPx: 32,
    variants: [
      '/images/anektia_master_oak_floor_tile.png',
      '/images/anektia_master_oak_floor_tile_b.png',
      '/images/anektia_master_oak_floor_tile_c.png',
      '/images/anektia_master_oak_floor_tile.png'
    ]
  },
  wallModuleSet: {
    wallLeft: '/images/room_bookshelf.png',
    wallRight: '/images/room_bookshelf.png',
    cornerInner: '/images/room_bookshelf.png',
    cornerOuter: '/images/room_bookshelf.png',
    pillar: '/images/room_bookshelf.png',
    windowModule: '/images/room_telescope.png'
  },
  lightingProfile: {
    ambientColor: '#2A1B0E',
    ambientIntensity: 0.85,
    sunAngleDegrees: 45,
    warmthTempK: 2700
  },
  particlePreset: 'dust_motes'
};
