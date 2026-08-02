import { RoomAsset } from '@/types/roomEngine';

export const ROOM_ASSETS: Record<string, RoomAsset> = {
  asset_sofa_leather: {
    id: 'asset_sofa_leather',
    src: '/images/aeterna_master_sofa.png',
    spritesByRotation: {
      0: '/images/aeterna_master_sofa.png',
      90: '/images/aeterna_master_sofa.png',
      180: '/images/aeterna_master_sofa.png',
      270: '/images/aeterna_master_sofa.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 160,
    pixelHeight: 120,
    anchorX: 0.5,
    anchorY: 0.75
  },
  asset_telescope_brass: {
    id: 'asset_telescope_brass',
    src: '/images/aeterna_master_telescope.png',
    spritesByRotation: {
      0: '/images/aeterna_master_telescope.png',
      90: '/images/aeterna_master_telescope.png',
      180: '/images/aeterna_master_telescope.png',
      270: '/images/aeterna_master_telescope.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 120,
    pixelHeight: 160,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_bookshelf_wood: {
    id: 'asset_bookshelf_wood',
    src: '/images/aeterna_master_bookshelf.png',
    spritesByRotation: {
      0: '/images/aeterna_master_bookshelf.png',
      90: '/images/aeterna_master_bookshelf.png',
      180: '/images/aeterna_master_bookshelf.png',
      270: '/images/aeterna_master_bookshelf.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 140,
    pixelHeight: 180,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_desk_academic: {
    id: 'asset_desk_academic',
    src: '/images/aeterna_master_desk_0deg.png',
    spritesByRotation: {
      0: '/images/aeterna_master_desk_0deg.png',
      90: '/images/aeterna_master_desk_0deg.png',
      180: '/images/aeterna_master_desk_0deg.png',
      270: '/images/aeterna_master_desk_0deg.png'
    },
    footprintTileWidth: 3,
    footprintTileHeight: 2,
    collisionTileWidth: 3,
    collisionTileHeight: 1,
    pixelWidth: 200,
    pixelHeight: 160,
    anchorX: 0.5,
    anchorY: 0.8
  },
  asset_armchair_chesterfield: {
    id: 'asset_armchair_chesterfield',
    src: '/images/aeterna_master_armchair_0deg.png',
    spritesByRotation: {
      0: '/images/aeterna_master_armchair_0deg.png',
      90: '/images/aeterna_master_armchair_0deg.png',
      180: '/images/aeterna_master_armchair_0deg.png',
      270: '/images/aeterna_master_armchair_0deg.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 140,
    pixelHeight: 140,
    anchorX: 0.5,
    anchorY: 0.8
  },
  asset_globe_brass: {
    id: 'asset_globe_brass',
    src: '/images/aeterna_master_globe_0deg.png',
    spritesByRotation: {
      0: '/images/aeterna_master_globe_0deg.png',
      90: '/images/aeterna_master_globe_0deg.png',
      180: '/images/aeterna_master_globe_0deg.png',
      270: '/images/aeterna_master_globe_0deg.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 110,
    pixelHeight: 160,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_window_gothic: {
    id: 'asset_window_gothic',
    src: '/images/aeterna_master_gothic_window.png',
    spritesByRotation: {
      0: '/images/aeterna_master_gothic_window.png',
      90: '/images/aeterna_master_gothic_window.png',
      180: '/images/aeterna_master_gothic_window.png',
      270: '/images/aeterna_master_gothic_window.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 160,
    pixelHeight: 240,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_ivy_wall: {
    id: 'asset_ivy_wall',
    src: '/images/aeterna_master_wall_ivy.png',
    spritesByRotation: {
      0: '/images/aeterna_master_wall_ivy.png',
      90: '/images/aeterna_master_wall_ivy.png',
      180: '/images/aeterna_master_wall_ivy.png',
      270: '/images/aeterna_master_wall_ivy.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 140,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_clock_wall: {
    id: 'asset_clock_wall',
    src: '/images/aeterna_master_wall_clock.png',
    spritesByRotation: {
      0: '/images/aeterna_master_wall_clock.png',
      90: '/images/aeterna_master_wall_clock.png',
      180: '/images/aeterna_master_wall_clock.png',
      270: '/images/aeterna_master_wall_clock.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 140,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_fireplace_gothic: {
    id: 'asset_fireplace_gothic',
    src: '/images/aeterna_master_fireplace.png',
    spritesByRotation: {
      0: '/images/aeterna_master_fireplace.png',
      90: '/images/aeterna_master_fireplace.png',
      180: '/images/aeterna_master_fireplace.png',
      270: '/images/aeterna_master_fireplace.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 160,
    pixelHeight: 200,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_astrolabe_stand: {
    id: 'asset_astrolabe_stand',
    src: '/images/aeterna_master_astrolabe.png',
    spritesByRotation: {
      0: '/images/aeterna_master_astrolabe.png',
      90: '/images/aeterna_master_astrolabe.png',
      180: '/images/aeterna_master_astrolabe.png',
      270: '/images/aeterna_master_astrolabe.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 140,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_rug_persian: {
    id: 'asset_rug_persian',
    src: '/images/aeterna_master_persian_rug.png',
    spritesByRotation: {
      0: '/images/aeterna_master_persian_rug.png',
      90: '/images/aeterna_master_persian_rug.png',
      180: '/images/aeterna_master_persian_rug.png',
      270: '/images/aeterna_master_persian_rug.png'
    },
    footprintTileWidth: 3,
    footprintTileHeight: 3,
    pixelWidth: 240,
    pixelHeight: 160,
    anchorX: 0.5,
    anchorY: 0.5
  },
  asset_tapestry_alchemy: {
    id: 'asset_tapestry_alchemy',
    src: '/images/aeterna_master_wall_tapestry.png',
    spritesByRotation: {
      0: '/images/aeterna_master_wall_tapestry.png',
      90: '/images/aeterna_master_wall_tapestry.png',
      180: '/images/aeterna_master_wall_tapestry.png',
      270: '/images/aeterna_master_wall_tapestry.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 130,
    pixelHeight: 190,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_sconce_candelabra: {
    id: 'asset_sconce_candelabra',
    src: '/images/aeterna_master_wall_sconce.png',
    spritesByRotation: {
      0: '/images/aeterna_master_wall_sconce.png',
      90: '/images/aeterna_master_wall_sconce.png',
      180: '/images/aeterna_master_wall_sconce.png',
      270: '/images/aeterna_master_wall_sconce.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 70,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_window_arched_sunlight: {
    id: 'asset_window_arched_sunlight',
    src: '/images/aeterna_master_arched_window_sunlight.png',
    spritesByRotation: {
      0: '/images/aeterna_master_arched_window_sunlight.png',
      90: '/images/aeterna_master_arched_window_sunlight.png',
      180: '/images/aeterna_master_arched_window_sunlight.png',
      270: '/images/aeterna_master_arched_window_sunlight.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 160,
    pixelHeight: 240,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_window_gothic_tight: {
    id: 'asset_window_gothic_tight',
    src: '/images/aeterna_master_gothic_window_tight.png',
    spritesByRotation: {
      0: '/images/aeterna_master_gothic_window_tight.png',
      90: '/images/aeterna_master_gothic_window_tight.png',
      180: '/images/aeterna_master_gothic_window_tight.png',
      270: '/images/aeterna_master_gothic_window_tight.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 160,
    pixelHeight: 240,
    anchorX: 0.5,
    anchorY: 1.0
  },
  asset_window_stone_arch_gothic: {
    id: 'asset_window_stone_arch_gothic',
    src: '/images/aeterna_master_stone_gothic_window.png',
    spritesByRotation: {
      0: '/images/aeterna_master_stone_gothic_window.png',
      90: '/images/aeterna_master_stone_gothic_window.png',
      180: '/images/aeterna_master_stone_gothic_window.png',
      270: '/images/aeterna_master_stone_gothic_window.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 160,
    pixelHeight: 260,
    anchorX: 0.5,
    anchorY: 1.0
  },
  asset_door_gothic_double: {
    id: 'asset_door_gothic_double',
    src: '/images/aeterna_master_gothic_door.png',
    spritesByRotation: {
      0: '/images/aeterna_master_gothic_door.png',
      90: '/images/aeterna_master_gothic_door.png',
      180: '/images/aeterna_master_gothic_door.png',
      270: '/images/aeterna_master_gothic_door.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 200,
    pixelHeight: 280,
    anchorX: 0.5,
    anchorY: 1.0,
    isIsoPreAngled: true
  },
  asset_chair_baroque_royal: {
    id: 'asset_chair_baroque_royal',
    src: '/images/aeterna_baroque_chair_front.png',
    spritesByRotation: {
      0: '/images/aeterna_baroque_chair_front.png',
      90: '/images/aeterna_baroque_chair_front.png',
      180: '/images/aeterna_baroque_chair_back.png',
      270: '/images/aeterna_baroque_chair_back.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 1.0
  },
  asset_blackboard_equations: {
    id: 'asset_blackboard_equations',
    src: '/images/aeterna_master_blackboard.png',
    spritesByRotation: {
      0: '/images/aeterna_master_blackboard.png',
      90: '/images/aeterna_master_blackboard.png',
      180: '/images/aeterna_master_blackboard.png',
      270: '/images/aeterna_master_blackboard.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 160,
    pixelHeight: 200,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_compass_proportions: {
    id: 'asset_compass_proportions',
    src: '/images/aeterna_master_compass.png',
    spritesByRotation: {
      0: '/images/aeterna_master_compass.png',
      90: '/images/aeterna_master_compass.png',
      180: '/images/aeterna_master_compass.png',
      270: '/images/aeterna_master_compass.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_sundial_marble: {
    id: 'asset_sundial_marble',
    src: '/images/aeterna_master_sundial.png',
    spritesByRotation: {
      0: '/images/aeterna_master_sundial.png',
      90: '/images/aeterna_master_sundial.png',
      180: '/images/aeterna_master_sundial.png',
      270: '/images/aeterna_master_sundial.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 150,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_chronometer_brass: {
    id: 'asset_chronometer_brass',
    src: '/images/aeterna_master_chronometer.png',
    spritesByRotation: {
      0: '/images/aeterna_master_chronometer.png',
      90: '/images/aeterna_master_chronometer.png',
      180: '/images/aeterna_master_chronometer.png',
      270: '/images/aeterna_master_chronometer.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_anvil_energy: {
    id: 'asset_anvil_energy',
    src: '/images/aeterna_master_anvil.png',
    spritesByRotation: {
      0: '/images/aeterna_master_anvil.png',
      90: '/images/aeterna_master_anvil.png',
      180: '/images/aeterna_master_anvil.png',
      270: '/images/aeterna_master_anvil.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 120,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.8
  },
  asset_newtons_cradle: {
    id: 'asset_newtons_cradle',
    src: '/images/aeterna_master_newtons_cradle.png',
    spritesByRotation: {
      0: '/images/aeterna_master_newtons_cradle.png',
      90: '/images/aeterna_master_newtons_cradle.png',
      180: '/images/aeterna_master_newtons_cradle.png',
      270: '/images/aeterna_master_newtons_cradle.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 120,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_gyroscope_brass: {
    id: 'asset_gyroscope_brass',
    src: '/images/aeterna_master_gyroscope.png',
    spritesByRotation: {
      0: '/images/aeterna_master_gyroscope.png',
      90: '/images/aeterna_master_gyroscope.png',
      180: '/images/aeterna_master_gyroscope.png',
      270: '/images/aeterna_master_gyroscope.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 130,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_archimedes_fountain: {
    id: 'asset_archimedes_fountain',
    src: '/images/aeterna_master_archimedes_fountain.png',
    spritesByRotation: {
      0: '/images/aeterna_master_archimedes_fountain.png',
      90: '/images/aeterna_master_archimedes_fountain.png',
      180: '/images/aeterna_master_archimedes_fountain.png',
      270: '/images/aeterna_master_archimedes_fountain.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 140,
    pixelHeight: 160,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_tesla_coil_mini: {
    id: 'asset_tesla_coil_mini',
    src: '/images/aeterna_master_tesla_coil.png',
    spritesByRotation: {
      0: '/images/aeterna_master_tesla_coil.png',
      90: '/images/aeterna_master_tesla_coil.png',
      180: '/images/aeterna_master_tesla_coil.png',
      270: '/images/aeterna_master_tesla_coil.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 140,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_faraday_cage: {
    id: 'asset_faraday_cage',
    src: '/images/aeterna_master_faraday_cage.png',
    spritesByRotation: {
      0: '/images/aeterna_master_faraday_cage.png',
      90: '/images/aeterna_master_faraday_cage.png',
      180: '/images/aeterna_master_faraday_cage.png',
      270: '/images/aeterna_master_faraday_cage.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 130,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_prism_desk: {
    id: 'asset_prism_desk',
    src: '/images/aeterna_master_prism_desk.png',
    spritesByRotation: {
      0: '/images/aeterna_master_prism_desk.png',
      90: '/images/aeterna_master_prism_desk.png',
      180: '/images/aeterna_master_prism_desk.png',
      270: '/images/aeterna_master_prism_desk.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_melting_clock: {
    id: 'asset_melting_clock',
    src: '/images/aeterna_master_melting_clock.png',
    spritesByRotation: {
      0: '/images/aeterna_master_melting_clock.png',
      90: '/images/aeterna_master_melting_clock.png',
      180: '/images/aeterna_master_melting_clock.png',
      270: '/images/aeterna_master_melting_clock.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 110,
    pixelHeight: 90,
    anchorX: 0.5,
    anchorY: 0.8
  },
  asset_orrery_planets: {
    id: 'asset_orrery_planets',
    src: '/images/aeterna_master_orrery.png',
    spritesByRotation: {
      0: '/images/aeterna_master_orrery.png',
      90: '/images/aeterna_master_orrery.png',
      180: '/images/aeterna_master_orrery.png',
      270: '/images/aeterna_master_orrery.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 180,
    pixelHeight: 200,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_nucleus_lamp: {
    id: 'asset_nucleus_lamp',
    src: '/images/aeterna_master_nucleus_lamp.png',
    spritesByRotation: {
      0: '/images/aeterna_master_nucleus_lamp.png',
      90: '/images/aeterna_master_nucleus_lamp.png',
      180: '/images/aeterna_master_nucleus_lamp.png',
      270: '/images/aeterna_master_nucleus_lamp.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 150,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_planck_cube: {
    id: 'asset_planck_cube',
    src: '/images/aeterna_master_planck_cube.png',
    spritesByRotation: {
      0: '/images/aeterna_master_planck_cube.png',
      90: '/images/aeterna_master_planck_cube.png',
      180: '/images/aeterna_master_planck_cube.png',
      270: '/images/aeterna_master_planck_cube.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 120,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_silicon_chip_frame: {
    id: 'asset_silicon_chip_frame',
    src: '/images/aeterna_master_silicon_chip.png',
    spritesByRotation: {
      0: '/images/aeterna_master_silicon_chip.png',
      90: '/images/aeterna_master_silicon_chip.png',
      180: '/images/aeterna_master_silicon_chip.png',
      270: '/images/aeterna_master_silicon_chip.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 120,
    pixelHeight: 120,
    anchorX: 0.5,
    anchorY: 0.9
  }
};

export function getRoomAsset(assetId: string): RoomAsset | undefined {
  return ROOM_ASSETS[assetId];
}
