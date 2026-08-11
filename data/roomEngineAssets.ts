import { RoomAsset } from '@/types/roomEngine';

export const ROOM_ASSETS: Record<string, RoomAsset> = {
  asset_sofa_leather: {
    id: 'asset_sofa_leather',
    src: '/images/anektia_master_sofa.png',
    spritesByRotation: {
      0: '/images/anektia_master_sofa.png',
      90: '/images/anektia_master_sofa.png',
      180: '/images/anektia_master_sofa.png',
      270: '/images/anektia_master_sofa.png'
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
    src: '/images/anektia_master_telescope.png',
    spritesByRotation: {
      0: '/images/anektia_master_telescope.png',
      90: '/images/anektia_master_telescope.png',
      180: '/images/anektia_master_telescope.png',
      270: '/images/anektia_master_telescope.png'
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
    src: '/images/anektia_master_bookshelf.png',
    spritesByRotation: {
      0: '/images/anektia_master_bookshelf.png',
      90: '/images/anektia_master_bookshelf.png',
      180: '/images/anektia_master_bookshelf.png',
      270: '/images/anektia_master_bookshelf.png'
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
    src: '/images/anektia_master_desk_0deg.png',
    spritesByRotation: {
      0: '/images/anektia_master_desk_0deg.png',
      90: '/images/anektia_master_desk_0deg.png',
      180: '/images/anektia_master_desk_0deg.png',
      270: '/images/anektia_master_desk_0deg.png'
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
    src: '/images/anektia_master_armchair_0deg.png',
    spritesByRotation: {
      0: '/images/anektia_master_armchair_0deg.png',
      90: '/images/anektia_master_armchair_0deg.png',
      180: '/images/anektia_master_armchair_0deg.png',
      270: '/images/anektia_master_armchair_0deg.png'
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
    src: '/images/anektia_master_globe_0deg.png',
    spritesByRotation: {
      0: '/images/anektia_master_globe_0deg.png',
      90: '/images/anektia_master_globe_0deg.png',
      180: '/images/anektia_master_globe_0deg.png',
      270: '/images/anektia_master_globe_0deg.png'
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
    src: '/images/anektia_master_gothic_window.png',
    spritesByRotation: {
      0: '/images/anektia_master_gothic_window.png',
      90: '/images/anektia_master_gothic_window.png',
      180: '/images/anektia_master_gothic_window.png',
      270: '/images/anektia_master_gothic_window.png'
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
    src: '/images/anektia_master_wall_ivy.webp',
    spritesByRotation: {
      0: '/images/anektia_master_wall_ivy.webp',
      90: '/images/anektia_master_wall_ivy.webp',
      180: '/images/anektia_master_wall_ivy.webp',
      270: '/images/anektia_master_wall_ivy.webp'
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
    src: '/images/anektia_master_wall_clock.png',
    spritesByRotation: {
      0: '/images/anektia_master_wall_clock.png',
      90: '/images/anektia_master_wall_clock.png',
      180: '/images/anektia_master_wall_clock.png',
      270: '/images/anektia_master_wall_clock.png'
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
    src: '/images/anektia_master_fireplace.webp',
    spritesByRotation: {
      0: '/images/anektia_master_fireplace.webp',
      90: '/images/anektia_master_fireplace.webp',
      180: '/images/anektia_master_fireplace.webp',
      270: '/images/anektia_master_fireplace.webp'
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
    src: '/images/anektia_master_astrolabe.png',
    spritesByRotation: {
      0: '/images/anektia_master_astrolabe.png',
      90: '/images/anektia_master_astrolabe.png',
      180: '/images/anektia_master_astrolabe.png',
      270: '/images/anektia_master_astrolabe.png'
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
    src: '/images/anektia_master_persian_rug.webp',
    spritesByRotation: {
      0: '/images/anektia_master_persian_rug.webp',
      90: '/images/anektia_master_persian_rug.webp',
      180: '/images/anektia_master_persian_rug.webp',
      270: '/images/anektia_master_persian_rug.webp'
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
    src: '/images/anektia_master_wall_tapestry.png',
    spritesByRotation: {
      0: '/images/anektia_master_wall_tapestry.png',
      90: '/images/anektia_master_wall_tapestry.png',
      180: '/images/anektia_master_wall_tapestry.png',
      270: '/images/anektia_master_wall_tapestry.png'
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
    src: '/images/anektia_master_wall_sconce.png',
    spritesByRotation: {
      0: '/images/anektia_master_wall_sconce.png',
      90: '/images/anektia_master_wall_sconce.png',
      180: '/images/anektia_master_wall_sconce.png',
      270: '/images/anektia_master_wall_sconce.png'
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
    src: '/images/anektia_master_arched_window_sunlight.png',
    spritesByRotation: {
      0: '/images/anektia_master_arched_window_sunlight.png',
      90: '/images/anektia_master_arched_window_sunlight.png',
      180: '/images/anektia_master_arched_window_sunlight.png',
      270: '/images/anektia_master_arched_window_sunlight.png'
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
    src: '/images/anektia_master_gothic_window_tight.png',
    spritesByRotation: {
      0: '/images/anektia_master_gothic_window_tight.png',
      90: '/images/anektia_master_gothic_window_tight.png',
      180: '/images/anektia_master_gothic_window_tight.png',
      270: '/images/anektia_master_gothic_window_tight.png'
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
    src: '/images/anektia_master_stone_gothic_window.png',
    spritesByRotation: {
      0: '/images/anektia_master_stone_gothic_window.png',
      90: '/images/anektia_master_stone_gothic_window.png',
      180: '/images/anektia_master_stone_gothic_window.png',
      270: '/images/anektia_master_stone_gothic_window.png'
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
    src: '/images/anektia_master_gothic_door.png',
    spritesByRotation: {
      0: '/images/anektia_master_gothic_door.png',
      90: '/images/anektia_master_gothic_door.png',
      180: '/images/anektia_master_gothic_door.png',
      270: '/images/anektia_master_gothic_door.png'
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
    src: '/images/anektia_baroque_chair_front.png',
    spritesByRotation: {
      0: '/images/anektia_baroque_chair_front.png',
      90: '/images/anektia_baroque_chair_front.png',
      180: '/images/anektia_baroque_chair_back.png',
      270: '/images/anektia_baroque_chair_back.png'
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
    src: '/images/anektia_master_blackboard.png',
    spritesByRotation: {
      0: '/images/anektia_master_blackboard.png',
      90: '/images/anektia_master_blackboard.png',
      180: '/images/anektia_master_blackboard.png',
      270: '/images/anektia_master_blackboard.png'
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
    src: '/images/anektia_master_compass.png',
    spritesByRotation: {
      0: '/images/anektia_master_compass.png',
      90: '/images/anektia_master_compass.png',
      180: '/images/anektia_master_compass.png',
      270: '/images/anektia_master_compass.png'
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
    src: '/images/anektia_master_sundial.png',
    spritesByRotation: {
      0: '/images/anektia_master_sundial.png',
      90: '/images/anektia_master_sundial.png',
      180: '/images/anektia_master_sundial.png',
      270: '/images/anektia_master_sundial.png'
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
    src: '/images/anektia_master_chronometer.png',
    spritesByRotation: {
      0: '/images/anektia_master_chronometer.png',
      90: '/images/anektia_master_chronometer.png',
      180: '/images/anektia_master_chronometer.png',
      270: '/images/anektia_master_chronometer.png'
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
    src: '/images/anektia_master_anvil.png',
    spritesByRotation: {
      0: '/images/anektia_master_anvil.png',
      90: '/images/anektia_master_anvil.png',
      180: '/images/anektia_master_anvil.png',
      270: '/images/anektia_master_anvil.png'
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
    src: '/images/anektia_master_newtons_cradle.png',
    spritesByRotation: {
      0: '/images/anektia_master_newtons_cradle.png',
      90: '/images/anektia_master_newtons_cradle.png',
      180: '/images/anektia_master_newtons_cradle.png',
      270: '/images/anektia_master_newtons_cradle.png'
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
    src: '/images/anektia_master_gyroscope.png',
    spritesByRotation: {
      0: '/images/anektia_master_gyroscope.png',
      90: '/images/anektia_master_gyroscope.png',
      180: '/images/anektia_master_gyroscope.png',
      270: '/images/anektia_master_gyroscope.png'
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
    src: '/images/anektia_master_archimedes_fountain.png',
    spritesByRotation: {
      0: '/images/anektia_master_archimedes_fountain.png',
      90: '/images/anektia_master_archimedes_fountain.png',
      180: '/images/anektia_master_archimedes_fountain.png',
      270: '/images/anektia_master_archimedes_fountain.png'
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
    src: '/images/anektia_master_tesla_coil.png',
    spritesByRotation: {
      0: '/images/anektia_master_tesla_coil.png',
      90: '/images/anektia_master_tesla_coil.png',
      180: '/images/anektia_master_tesla_coil.png',
      270: '/images/anektia_master_tesla_coil.png'
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
    src: '/images/anektia_master_faraday_cage.png',
    spritesByRotation: {
      0: '/images/anektia_master_faraday_cage.png',
      90: '/images/anektia_master_faraday_cage.png',
      180: '/images/anektia_master_faraday_cage.png',
      270: '/images/anektia_master_faraday_cage.png'
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
    src: '/images/anektia_master_prism_desk.png',
    spritesByRotation: {
      0: '/images/anektia_master_prism_desk.png',
      90: '/images/anektia_master_prism_desk.png',
      180: '/images/anektia_master_prism_desk.png',
      270: '/images/anektia_master_prism_desk.png'
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
    src: '/images/anektia_master_melting_clock.webp',
    spritesByRotation: {
      0: '/images/anektia_master_melting_clock.webp',
      90: '/images/anektia_master_melting_clock.webp',
      180: '/images/anektia_master_melting_clock.webp',
      270: '/images/anektia_master_melting_clock.webp'
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
    src: '/images/anektia_master_orrery.png',
    spritesByRotation: {
      0: '/images/anektia_master_orrery.png',
      90: '/images/anektia_master_orrery.png',
      180: '/images/anektia_master_orrery.png',
      270: '/images/anektia_master_orrery.png'
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
    src: '/images/anektia_master_nucleus_lamp.png',
    spritesByRotation: {
      0: '/images/anektia_master_nucleus_lamp.png',
      90: '/images/anektia_master_nucleus_lamp.png',
      180: '/images/anektia_master_nucleus_lamp.png',
      270: '/images/anektia_master_nucleus_lamp.png'
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
    src: '/images/anektia_master_planck_cube.png',
    spritesByRotation: {
      0: '/images/anektia_master_planck_cube.png',
      90: '/images/anektia_master_planck_cube.png',
      180: '/images/anektia_master_planck_cube.png',
      270: '/images/anektia_master_planck_cube.png'
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
    src: '/images/anektia_master_silicon_chip.png',
    spritesByRotation: {
      0: '/images/anektia_master_silicon_chip.png',
      90: '/images/anektia_master_silicon_chip.png',
      180: '/images/anektia_master_silicon_chip.png',
      270: '/images/anektia_master_silicon_chip.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 120,
    pixelHeight: 120,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_pixel_schrodinger: {
    id: 'asset_pixel_schrodinger',
    src: '/images/anektia_pixel_schrodinger.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_schrodinger.png',
      90: '/images/anektia_pixel_schrodinger.png',
      180: '/images/anektia_pixel_schrodinger.png',
      270: '/images/anektia_pixel_schrodinger.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 90,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_abacus: {
    id: 'asset_pixel_abacus',
    src: '/images/anektia_pixel_abacus.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_abacus.png',
      90: '/images/anektia_pixel_abacus.png',
      180: '/images/anektia_pixel_abacus.png',
      270: '/images/anektia_pixel_abacus.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_terminal: {
    id: 'asset_pixel_terminal',
    src: '/images/anektia_pixel_terminal.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_terminal.png',
      90: '/images/anektia_pixel_terminal.png',
      180: '/images/anektia_pixel_terminal.png',
      270: '/images/anektia_pixel_terminal.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_bust: {
    id: 'asset_pixel_bust',
    src: '/images/anektia_pixel_bust.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_bust.png',
      90: '/images/anektia_pixel_bust.png',
      180: '/images/anektia_pixel_bust.png',
      270: '/images/anektia_pixel_bust.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_microscope: {
    id: 'asset_pixel_microscope',
    src: '/images/anektia_pixel_microscope.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_microscope.png',
      90: '/images/anektia_pixel_microscope.png',
      180: '/images/anektia_pixel_microscope.png',
      270: '/images/anektia_pixel_microscope.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_terrarium: {
    id: 'asset_pixel_terrarium',
    src: '/images/anektia_pixel_terrarium.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_terrarium.png',
      90: '/images/anektia_pixel_terrarium.png',
      180: '/images/anektia_pixel_terrarium.png',
      270: '/images/anektia_pixel_terrarium.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_plant: {
    id: 'asset_pixel_plant',
    src: '/images/anektia_pixel_plant.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_plant.png',
      90: '/images/anektia_pixel_plant.png',
      180: '/images/anektia_pixel_plant.png',
      270: '/images/anektia_pixel_plant.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_bookshelf: {
    id: 'asset_pixel_bookshelf',
    src: '/images/anektia_pixel_bookshelf.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_bookshelf.png',
      90: '/images/anektia_pixel_bookshelf.png',
      180: '/images/anektia_pixel_bookshelf.png',
      270: '/images/anektia_pixel_bookshelf.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 100,
    pixelHeight: 140,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_armchair_pixel: {
    id: 'asset_pixel_armchair_pixel',
    src: '/images/anektia_pixel_armchair.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_armchair.png',
      90: '/images/anektia_pixel_armchair.png',
      180: '/images/anektia_pixel_armchair.png',
      270: '/images/anektia_pixel_armchair.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_desk_pixel: {
    id: 'asset_pixel_desk_pixel',
    src: '/images/anektia_pixel_desk.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_desk.png',
      90: '/images/anektia_pixel_desk.png',
      180: '/images/anektia_pixel_desk.png',
      270: '/images/anektia_pixel_desk.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 140,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_lamp: {
    id: 'asset_pixel_lamp',
    src: '/images/anektia_pixel_lamp.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_lamp.png',
      90: '/images/anektia_pixel_lamp.png',
      180: '/images/anektia_pixel_lamp.png',
      270: '/images/anektia_pixel_lamp.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 70,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_globe: {
    id: 'asset_pixel_globe',
    src: '/images/anektia_pixel_math.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_math.png',
      90: '/images/anektia_pixel_math.png',
      180: '/images/anektia_pixel_math.png',
      270: '/images/anektia_pixel_math.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_constellation: {
    id: 'asset_pixel_constellation',
    src: '/images/anektia_pixel_physics.webp',
    spritesByRotation: {
      0: '/images/anektia_pixel_physics.webp',
      90: '/images/anektia_pixel_physics.webp',
      180: '/images/anektia_pixel_physics.webp',
      270: '/images/anektia_pixel_physics.webp'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 120,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_pixel_books: {
    id: 'asset_pixel_books',
    src: '/images/anektia_pixel_cs.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_cs.png',
      90: '/images/anektia_pixel_cs.png',
      180: '/images/anektia_pixel_cs.png',
      270: '/images/anektia_pixel_cs.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 70,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_prism: {
    id: 'asset_pixel_prism',
    src: '/images/anektia_pixel_prism.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_prism.png',
      90: '/images/anektia_pixel_prism.png',
      180: '/images/anektia_pixel_prism.png',
      270: '/images/anektia_pixel_prism.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_pixel_trophy: {
    id: 'asset_pixel_trophy',
    src: '/images/anektia_pixel_trophy.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_trophy.png',
      90: '/images/anektia_pixel_trophy.png',
      180: '/images/anektia_pixel_trophy.png',
      270: '/images/anektia_pixel_trophy.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_flat_gothic_window: {
    id: 'asset_flat_gothic_window',
    src: '/images/anektia_master_flat_gothic_window.png',
    spritesByRotation: {
      0: '/images/anektia_master_flat_gothic_window.png',
      90: '/images/anektia_master_flat_gothic_window.png',
      180: '/images/anektia_master_flat_gothic_window.png',
      270: '/images/anektia_master_flat_gothic_window.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 160,
    pixelHeight: 220,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_rug_alternative: {
    id: 'asset_rug_alternative',
    src: '/images/anektia_master_rug.png',
    spritesByRotation: {
      0: '/images/anektia_master_rug.png',
      90: '/images/anektia_master_rug.png',
      180: '/images/anektia_master_rug.png',
      270: '/images/anektia_master_rug.png'
    },
    footprintTileWidth: 3,
    footprintTileHeight: 2,
    pixelWidth: 200,
    pixelHeight: 140,
    anchorX: 0.5,
    anchorY: 0.5
  },
  asset_ashlar_stone_wall: {
    id: 'asset_ashlar_stone_wall',
    src: '/images/anektia_master_wall_ashlar_stone.png',
    spritesByRotation: {
      0: '/images/anektia_master_wall_ashlar_stone.png',
      90: '/images/anektia_master_wall_ashlar_stone.png',
      180: '/images/anektia_master_wall_ashlar_stone.png',
      270: '/images/anektia_master_wall_ashlar_stone.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 160,
    pixelHeight: 200,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_book_tower: {
    id: 'asset_book_tower',
    src: '/images/anektia_pixel_cs.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_cs.png',
      90: '/images/anektia_pixel_cs.png',
      180: '/images/anektia_pixel_cs.png',
      270: '/images/anektia_pixel_cs.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 70,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_scroll_wall: {
    id: 'asset_scroll_wall',
    src: '/images/anektia_pixel_physics.webp',
    spritesByRotation: {
      0: '/images/anektia_pixel_physics.webp',
      90: '/images/anektia_pixel_physics.webp',
      180: '/images/anektia_pixel_physics.webp',
      270: '/images/anektia_pixel_physics.webp'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_codex_stand: {
    id: 'asset_codex_stand',
    src: '/images/anektia_pixel_terminal.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_terminal.png',
      90: '/images/anektia_pixel_terminal.png',
      180: '/images/anektia_pixel_terminal.png',
      270: '/images/anektia_pixel_terminal.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_fern_ceramic: {
    id: 'asset_fern_ceramic',
    src: '/images/anektia_pixel_plant.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_plant.png',
      90: '/images/anektia_pixel_plant.png',
      180: '/images/anektia_pixel_plant.png',
      270: '/images/anektia_pixel_plant.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 110,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_hanging_ivy_long: {
    id: 'asset_hanging_ivy_long',
    src: '/images/anektia_master_wall_ivy.webp',
    spritesByRotation: {
      0: '/images/anektia_master_wall_ivy.webp',
      90: '/images/anektia_master_wall_ivy.webp',
      180: '/images/anektia_master_wall_ivy.webp',
      270: '/images/anektia_master_wall_ivy.webp'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 160,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_cactus_desk: {
    id: 'asset_cactus_desk',
    src: '/images/anektia_pixel_plant.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_plant.png',
      90: '/images/anektia_pixel_plant.png',
      180: '/images/anektia_pixel_plant.png',
      270: '/images/anektia_pixel_plant.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 60,
    pixelHeight: 70,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_alembic_copper: {
    id: 'asset_alembic_copper',
    src: '/images/anektia_pixel_prism.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_prism.png',
      90: '/images/anektia_pixel_prism.png',
      180: '/images/anektia_pixel_prism.png',
      270: '/images/anektia_pixel_prism.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 80,
    pixelHeight: 90,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_flasks_trio: {
    id: 'asset_flasks_trio',
    src: '/images/anektia_pixel_abacus.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_abacus.png',
      90: '/images/anektia_pixel_abacus.png',
      180: '/images/anektia_pixel_abacus.png',
      270: '/images/anektia_pixel_abacus.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_side_table_marble: {
    id: 'asset_side_table_marble',
    src: '/images/anektia_pixel_desk.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_desk.png',
      90: '/images/anektia_pixel_desk.png',
      180: '/images/anektia_pixel_desk.png',
      270: '/images/anektia_pixel_desk.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 100,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_coat_rack_brass: {
    id: 'asset_coat_rack_brass',
    src: '/images/anektia_pixel_bust.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_bust.png',
      90: '/images/anektia_pixel_bust.png',
      180: '/images/anektia_pixel_bust.png',
      270: '/images/anektia_pixel_bust.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 60,
    pixelHeight: 100,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_trunk_leather: {
    id: 'asset_trunk_leather',
    src: '/images/anektia_pixel_terminal.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_terminal.png',
      90: '/images/anektia_pixel_terminal.png',
      180: '/images/anektia_pixel_terminal.png',
      270: '/images/anektia_pixel_terminal.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 1,
    pixelWidth: 120,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_hourglass_brass: {
    id: 'asset_hourglass_brass',
    src: '/images/anektia_pixel_abacus.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_abacus.png',
      90: '/images/anektia_pixel_abacus.png',
      180: '/images/anektia_pixel_abacus.png',
      270: '/images/anektia_pixel_abacus.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 70,
    pixelHeight: 90,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_portrait_aristotle: {
    id: 'asset_portrait_aristotle',
    src: '/images/anektia_pixel_physics.webp',
    spritesByRotation: {
      0: '/images/anektia_pixel_physics.webp',
      90: '/images/anektia_pixel_physics.webp',
      180: '/images/anektia_pixel_physics.webp',
      270: '/images/anektia_pixel_physics.webp'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 90,
    pixelHeight: 120,
    anchorX: 0.5,
    anchorY: 0.9
  },
  asset_candlestick_trio: {
    id: 'asset_candlestick_trio',
    src: '/images/anektia_pixel_lamp.png',
    spritesByRotation: {
      0: '/images/anektia_pixel_lamp.png',
      90: '/images/anektia_pixel_lamp.png',
      180: '/images/anektia_pixel_lamp.png',
      270: '/images/anektia_pixel_lamp.png'
    },
    footprintTileWidth: 1,
    footprintTileHeight: 1,
    pixelWidth: 60,
    pixelHeight: 80,
    anchorX: 0.5,
    anchorY: 0.85
  },
  asset_rug_oval_burgundy: {
    id: 'asset_rug_oval_burgundy',
    src: '/images/anektia_master_rug.png',
    spritesByRotation: {
      0: '/images/anektia_master_rug.png',
      90: '/images/anektia_master_rug.png',
      180: '/images/anektia_master_rug.png',
      270: '/images/anektia_master_rug.png'
    },
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 160,
    pixelHeight: 120,
    anchorX: 0.5,
    anchorY: 0.5
  },
  asset_floor_oak_parquet: {
    id: 'asset_floor_oak_parquet',
    src: '/images/anektia_master_oak_floor_tile.png',
    footprintTileWidth: 14,
    footprintTileHeight: 14,
    pixelWidth: 1200,
    pixelHeight: 600,
    anchorX: 0.5,
    anchorY: 0.5
  },
  asset_floor_oak_tile_b: {
    id: 'asset_floor_oak_tile_b',
    src: '/images/anektia_master_oak_floor_tile_b.png',
    footprintTileWidth: 14,
    footprintTileHeight: 14,
    pixelWidth: 1200,
    pixelHeight: 600,
    anchorX: 0.5,
    anchorY: 0.5
  },
  asset_floor_oak_tile_c: {
    id: 'asset_floor_oak_tile_c',
    src: '/images/anektia_master_oak_floor_tile_c.png',
    footprintTileWidth: 14,
    footprintTileHeight: 14,
    pixelWidth: 1200,
    pixelHeight: 600,
    anchorX: 0.5,
    anchorY: 0.5
  },
  asset_wall_mahogany_nw: {
    id: 'asset_wall_mahogany_nw',
    src: '/images/master_wall_iso_nw.png',
    footprintTileWidth: 14,
    footprintTileHeight: 1,
    pixelWidth: 1200,
    pixelHeight: 480,
    anchorX: 0.5,
    anchorY: 0.9,
    isFullWall: 'nw'
  },
  asset_wall_mahogany_ne: {
    id: 'asset_wall_mahogany_ne',
    src: '/images/master_wall_iso_ne.png',
    footprintTileWidth: 14,
    footprintTileHeight: 1,
    pixelWidth: 1200,
    pixelHeight: 480,
    anchorX: 0.5,
    anchorY: 0.9,
    isFullWall: 'ne'
  },
  asset_pared_motel_nw: {
    id: 'asset_pared_motel_nw',
    src: '/images/assets/asset_1786477478030_sywwc1e.png',
    footprintTileWidth: 14,
    footprintTileHeight: 1,
    pixelWidth: 1200,
    pixelHeight: 480,
    anchorX: 0.5,
    anchorY: 0.9,
    isFullWall: 'nw'
  }
};

export function getRoomAsset(assetId: string): RoomAsset | undefined {
  return ROOM_ASSETS[assetId];
}
