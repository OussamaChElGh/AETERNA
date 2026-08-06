export interface BossQuestion {
  text: string
  options: string[]
  correctIndex: number
}

export interface BossExam {
  id: string
  title: string
  description: string
  questions: BossQuestion[]
}

export const BOSS_EXAMS: Record<string, BossExam> = {
  'boss-lvl-1': {
    id: 'boss-lvl-1',
    title: 'Guardián de la Cinemática',
    description: 'Demuestra tu comprensión de los principios fundamentales del movimiento y las fuerzas para avanzar.',
    questions: [
      {
        text: 'Si un objeto se mueve con velocidad constante en línea recta, ¿cuál es su aceleración?',
        options: [
          'Es igual a su velocidad',
          'Aumenta gradualmente',
          'Es cero',
          'Depende de su masa'
        ],
        correctIndex: 2
      },
      {
        text: '¿Qué magnitud física representa el área bajo la curva en un gráfico de velocidad vs. tiempo?',
        options: [
          'La aceleración',
          'El desplazamiento',
          'La fuerza aplicada',
          'El impulso'
        ],
        correctIndex: 1
      },
      {
        text: 'Según la segunda ley de Newton, si se duplica la fuerza neta aplicada a un objeto de masa constante...',
        options: [
          'Su aceleración se reduce a la mitad',
          'Su velocidad se mantiene constante',
          'Su masa se duplica',
          'Su aceleración se duplica'
        ],
        correctIndex: 3
      },
      {
        text: '¿Cuál es la diferencia principal entre masa y peso?',
        options: [
          'Son exactamente lo mismo',
          'La masa es una fuerza, el peso es cantidad de materia',
          'La masa es constante en cualquier lugar, el peso depende de la gravedad local',
          'El peso se mide en kilogramos y la masa en Newtons'
        ],
        correctIndex: 2
      }
    ]
  },
  'boss-lvl-2': {
    id: 'boss-lvl-2',
    title: 'Custodio de la Energía',
    description: 'Supera el desafío del Custodio respondiendo preguntas sobre trabajo, energía y termodinámica.',
    questions: [
      {
        text: 'Si la energía mecánica total de un sistema se conserva, y la energía cinética aumenta...',
        options: [
          'La energía potencial también debe aumentar',
          'La energía potencial debe disminuir en la misma cantidad',
          'El trabajo no conservativo debe ser positivo',
          'El sistema debe estar en equilibrio'
        ],
        correctIndex: 1
      },
      {
        text: 'La primera ley de la termodinámica es esencialmente una declaración de...',
        options: [
          'La conservación de la masa',
          'El aumento de la entropía',
          'La conservación de la energía',
          'La irreversibilidad de los procesos'
        ],
        correctIndex: 2
      },
      {
        text: '¿En qué tipo de colisión se conserva la energía cinética total?',
        options: [
          'Colisión inelástica',
          'Colisión perfectamente elástica',
          'Colisión plástica',
          'En ninguna de las anteriores'
        ],
        correctIndex: 1
      }
    ]
  }
}
