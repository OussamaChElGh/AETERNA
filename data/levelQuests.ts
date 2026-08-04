/**
 * Level quests and furniture chest challenges for the Physics Learning Path.
 */

export interface ChestQuizQuestion {
  q: string;
  options: string[];
  answer: number; // index of correct option
}

export interface LevelChestData {
  nivel: number;
  title: string;
  furnitureReward: {
    catalogItemId: string; // id in roomEngineCatalog
    name: string;
    image: string;
  };
  minArticlesRequired: number; // how many articles of this level must be completed
  questions: ChestQuizQuestion[];
}

export const LEVEL_CHESTS: LevelChestData[] = [
  {
    nivel: 1,
    title: "Cofre del Observador",
    furnitureReward: {
      catalogItemId: 'globe_brass',
      name: 'Globo Celeste y Esfera Armilar',
      image: '/images/anektia_master_globe_0deg.png',
    },
    minArticlesRequired: 3,
    questions: [
      {
        q: "¿Cuál es el primer paso del método científico?",
        options: ["Formular una hipótesis", "Observar un fenómeno", "Publicar los resultados", "Diseñar un experimento"],
        answer: 1,
      },
      {
        q: "¿Qué mide la física fundamentalmente?",
        options: ["La belleza de las ecuaciones", "Magnitudes físicas con números y unidades", "La velocidad de la luz exclusivamente", "Solo la masa de los objetos"],
        answer: 1,
      },
      {
        q: "¿Qué es una magnitud escalar?",
        options: ["Una magnitud con dirección y sentido", "Una magnitud que solo tiene valor numérico y unidad", "Una medida imposible de calcular", "Un tipo de fuerza"],
        answer: 1,
      },
    ],
  },
  {
    nivel: 2,
    title: "Cofre del Mecánico",
    furnitureReward: {
      catalogItemId: 'anvil_energy',
      name: 'Yunque de la Energía',
      image: '/images/anektia_master_anvil.png',
    },
    minArticlesRequired: 4,
    questions: [
      {
        q: "¿Qué dice la primera ley de Newton?",
        options: ["F = ma", "Un objeto mantiene su velocidad si no hay fuerza neta", "La energía se conserva", "La entropía siempre aumenta"],
        answer: 1,
      },
      {
        q: "¿Qué es el trabajo en física?",
        options: ["Cualquier esfuerzo mental", "Fuerza por desplazamiento en la dirección de la fuerza", "La masa por la aceleración", "El producto de la velocidad por el tiempo"],
        answer: 1,
      },
      {
        q: "¿Qué se conserva en una colisión elástica?",
        options: ["Solo el momento", "Solo la energía cinética", "Tanto la energía cinética como el momento", "Ninguna de las anteriores"],
        answer: 2,
      },
    ],
  },
  {
    nivel: 3,
    title: "Cofre del Cuántico",
    furnitureReward: {
      catalogItemId: 'planck_cube',
      name: 'Cubo de Planck Luminoso',
      image: '/images/anektia_master_planck_cube.png',
    },
    minArticlesRequired: 3,
    questions: [
      {
        q: "¿Qué postula la relatividad especial?",
        options: ["La gravedad curva el espacio-tiempo", "Las leyes de la física son iguales en todos los sistemas inerciales y c es constante", "La energía no se conserva", "El tiempo es absoluto"],
        answer: 1,
      },
      {
        q: "¿Qué es el efecto fotoeléctrico?",
        options: ["La emisión de electrones al iluminar un metal con luz de frecuencia suficiente", "La reflexión de la luz en un espejo", "El calentamiento de un objeto al sol", "La difracción de ondas"],
        answer: 0,
      },
      {
        q: "¿Qué partícula media la fuerza electromagnética?",
        options: ["El gluón", "El fotón", "El bosón W", "El gravitón"],
        answer: 1,
      },
    ],
  },
  {
    nivel: 4,
    title: "Cofre de la Síntesis",
    furnitureReward: {
      catalogItemId: 'orrery_planets',
      name: 'Orrery de Planetas',
      image: '/images/anektia_master_orrery.png',
    },
    minArticlesRequired: 2,
    questions: [
      {
        q: "¿Qué intenta unificar la Teoría del Todo?",
        options: ["La mecánica clásica y la termodinámica", "La relatividad general y la mecánica cuántica", "La química y la biología", "La electricidad y el magnetismo"],
        answer: 1,
      },
      {
        q: "¿Qué representa la escala de Planck?",
        options: ["La temperatura del Sol", "El límite donde la relatividad y la cuántica se encuentran", "La velocidad máxima de un cohete", "La masa del electrón"],
        answer: 1,
      },
      {
        q: "¿Qué es la radiación de Hawking?",
        options: ["Luz emitida por estrellas", "Radiación térmica emitida por agujeros negros", "Ondas de radio del espacio", "Rayos cósmicos"],
        answer: 1,
      },
    ],
  },
];

export interface SideQuest {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  reward: { type: 'xp'; amount: number } | { type: 'furniture'; catalogItemId: string; name: string };
  check: (ctx: {
    completedLayers: Record<string, string[]>;
    completedPaths: string[];
    dailyStreak: number;
    xp: number;
    levelArticles: string[]; // slugs of articles in current level
  }) => boolean;
}

export const SIDE_QUESTS: SideQuest[] = [
  {
    id: 'perfect_streak_7',
    title: 'Racha Perfecta',
    description: 'Mantén una racha de 7 días consecutivos de estudio',
    icon: 'Flame',
    reward: { type: 'xp', amount: 500 },
    check: (ctx) => ctx.dailyStreak >= 7,
  },
  {
    id: 'level_explorer',
    title: 'Explorador del Nivel',
    description: 'Visita todos los artículos del nivel actual',
    icon: 'Compass',
    reward: { type: 'xp', amount: 300 },
    check: (ctx) => ctx.levelArticles.every(slug => ctx.completedPaths.includes(slug) || (ctx.completedLayers[slug]?.length || 0) > 0),
  },
  {
    id: 'triple_capa',
    title: 'Trinidad del Saber',
    description: 'Completa las 3 capas de un mismo artículo',
    icon: 'Layers',
    reward: { type: 'xp', amount: 200 },
    check: (ctx) => Object.values(ctx.completedLayers).some(layers => layers.length >= 3),
  },
  {
    id: 'speed_demon',
    title: 'Mente Veloz',
    description: 'Responde 10 preguntas correctamente en una sesión',
    icon: 'Zap',
    reward: { type: 'xp', amount: 250 },
    check: (ctx) => ctx.xp >= 1000,
  },
  {
    id: 'night_owl',
    title: 'Búho Nocturno',
    description: 'Estudia después de las 10 PM (UTC)',
    icon: 'Moon',
    reward: { type: 'xp', amount: 150 },
    check: (ctx) => {
      const hour = new Date().getUTCHours();
      return hour >= 22 || hour < 2;
    },
  },
];
