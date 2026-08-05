'use client'
import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RouteMap, type RouteData, type RouteLevel, type RouteNode, type RouteUserProgress, type NodeStatus } from '@/components/learning-path/RouteMap'
import fisicaCurriculum from '@/data/curriculum/fisica.json'
import { useGamification } from '@/context/GamificationContext'

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string }

const NODE_DESCRIPTIONS: Record<string, string> = {
  'guia-maestra-de-fisica': 'Mapa completo de la física: ramas, historia y métodos.',
  'como-piensa-un-fisico': 'Aprende a observar, modelar y predecir como un científico.',
  'cinematica': 'El arte de describir el movimiento sin preguntar sus causas.',
  'materia-y-energia': 'Las dos caras de la moneda que compone todo el universo.',
  'metodo-cientifico': 'El ritual que separa la verdad del dogma y la creencia.',
  'vectores': 'El lenguaje matemático con el que la naturaleza escribe sus leyes.',
  'leyes-newton-movimiento': 'Los tres decretos que gobiernan todo lo que se mueve.',
  'trabajo-energia': 'La moneda universal que nada puede crear ni destruir.',
  'momentum-colisiones': 'El legado invisible que se conserva en cada choque.',
  'movimiento-circular-satelites': 'Órbitas y giros que mantienen cautivos a los mundos.',
  'torque-momento-angular': 'El giro eterno que ninguna fuerza puede detener.',
  'termodinamica': 'La flecha del tiempo grabada en calor y entropía.',
  'electromagnetismo': 'Donde la electricidad y el magnetismo se vuelven uno.',
  'ondas-y-optica': 'La luz y el sonido descifrados por la mente humana.',
  'mecanica-cuantica': 'Donde la realidad se niega a ser definida con certeza.',
  'relatividad-especial': 'El tiempo fluye distinto para cada viajero del cosmos.',
  'relatividad-general': 'El espacio se curva bajo el peso de la materia y la energía.',
  'fisica-atomica-y-nuclear': 'En el corazón de la materia arde un sol diminuto.',
  'fisica-particulas': 'El zoológico invisible de partículas que componen lo visible.',
  'teoria-del-todo': 'La última ecuación: unificar lo infinitamente grande con lo ínfimo.',
  'cosmologia': 'La historia del universo contada por su propia luz fósil.',
  'fluidos': 'El caos ordenado que fluye entre lo sólido y lo etéreo.',
  'electromagnetismo-avanzado': 'Las ecuaciones de Maxwell en todo su esplendor.',
  'ondas-y-optica-practica': 'Laboratorio: la luz confiesa sus secretos.',
  'relatividad-especial-practica': 'Viajando a lomos de un fotón hacia lo imposible.',
  'fisica-tecnologia': 'Cuando la teoría se convierte en civilización.',
}

const NODE_EMOJIS: Record<string, string> = {
  'guia-maestra-de-fisica':'🔮','como-piensa-un-fisico':'☄️','cinematica':'🌌',
  'materia-y-energia':'💠','metodo-cientifico':'⚗️','vectores':'🧿',
  'leyes-newton-movimiento':'🌍','trabajo-energia':'⚡','momentum-colisiones':'💫',
  'movimiento-circular-satelites':'🪐','torque-momento-angular':'🌀','termodinamica':'🔥',
  'electromagnetismo':'🌩️','ondas-y-optica':'🌈','mecanica-cuantica':'⬡',
  'relatividad-especial':'⏳','relatividad-general':'🕳️','fisica-atomica-y-nuclear':'⚛️',
  'fisica-particulas':'✨','teoria-del-todo':'☯️','cosmologia':'🌟','fluidos':'💧',
  'electromagnetismo-avanzado':'🔌','ondas-y-optica-practica':'👁️',
  'relatividad-especial-practica':'🚀',
}

const COLOR_CLASSES = ['purple', 'teal', 'gold', 'red'] as const
const LEVEL_EMOJIS = ['🌑', '🌓', '🌕', '🌟']

function toNodeType(tipo?: string): 'theory' | 'practice' {
  return tipo === 'practice' ? 'practice' : 'theory'
}

export default function CosmicConstellationPath() {
  const { progress } = useGamification()
  const router = useRouter()
  const completedPaths = progress.completedPaths || []
  const completedLayers = progress.completedLayers || {}

  const curriculum = fisicaCurriculum as { levels?: { nivel: number; titulo: string; descripcion: string }[]; articles?: ArticleJSON[] }
  const articles = useMemo(() => [...(curriculum.articles || [])].sort((a, b) => a.nivel - b.nivel || a.orden - b.orden), [])

  const routeData: RouteData = useMemo(() => {
    const curriculumLevels = curriculum.levels || []
    let globalOrder = 0

    const levels: RouteLevel[] = curriculumLevels.map((lvl, idx) => {
      const lvlArticles = articles.filter(a => a.nivel === lvl.nivel)
      let prevDone = true

      const nodes: RouteNode[] = lvlArticles.map((a) => {
        globalOrder++
        const lyrs = completedLayers[a.slug]?.length || 0
        const done = completedPaths.includes(a.slug) || lyrs >= 3
        const unlocked = globalOrder === 1 || prevDone
        if (done) prevDone = true; else prevDone = false

        const status: NodeStatus = done ? 'done' : unlocked ? 'active' : 'locked'

        return {
          id: a.slug,
          order: globalOrder,
          title: a.title,
          description: NODE_DESCRIPTIONS[a.slug] || 'Un misterio del cosmos por descubrir.',
          emoji: NODE_EMOJIS[a.slug] || '🔮',
          slug: a.slug,
          xp: 75,
          stars: (Math.min(lyrs, 3) as 0 | 1 | 2 | 3),
          status,
          type: toNodeType(a.tipo),
        }
      })

      const doneCount = nodes.filter(n => n.status === 'done').length

      return {
        id: lvl.nivel,
        title: lvl.titulo,
        emoji: LEVEL_EMOJIS[idx] || '🌑',
        colorClass: COLOR_CLASSES[idx] || 'purple',
        nodes,
        chestUnlocked: doneCount >= 2,
        chestReward: doneCount >= 2 ? `Artefacto astral del ${lvl.titulo}` : undefined,
      }
    })

    return {
      id: 'fisica',
      title: 'Física',
      levels,
    }
  }, [articles, completedPaths, completedLayers])

  const routeUserProgress: RouteUserProgress = useMemo(() => {
    const allNodes = routeData.levels.flatMap(l => l.nodes)
    const doneNodes = allNodes.filter(n => n.status === 'done')
    const totalXP = allNodes.reduce((s, n) => s + (n.stars ?? 0) * 25, 0)
    const pct = allNodes.length > 0 ? doneNodes.length / allNodes.length : 0
    const levelName = pct >= 1 ? 'Maestro del Cosmos' : pct >= 0.66 ? 'Guardián Arcano' : pct >= 0.33 ? 'Aprendiz del Nexo' : 'Iniciado del Éter'

    return {
      totalXP,
      levelName,
      completedNodes: doneNodes.map(n => n.id),
    }
  }, [routeData])

  const handleNodeStart = useCallback((slug: string) => {
    router.push(`/guias/ciencias_naturales/fisica/${slug}`)
  }, [router])

  return (
    <div className="min-h-screen" style={{ background: '#0D0B14', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <div className="max-w-lg mx-auto py-8">
        <div className="text-center mb-6 px-4">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#6B5B35] mb-2">
            Archivo del Nexo
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#D4AF37' }}>
            El Sendero del Sabio
          </h1>
          <p className="text-xs text-[#6B5B35] mt-1.5">
            16 constelaciones · 4 reinos · 3 velos por lección
          </p>
        </div>

        <RouteMap
          route={routeData}
          userProgress={routeUserProgress}
          onNodeStart={handleNodeStart}
        />
      </div>
    </div>
  )
}
