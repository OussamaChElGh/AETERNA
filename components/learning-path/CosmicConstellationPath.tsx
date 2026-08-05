'use client'
import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Star, Flame, Award, Zap } from 'lucide-react'
import { RouteMap, type RouteData, type RouteLevel, type RouteNode, type RouteUserProgress, type NodeStatus, type ChestReward } from '@/components/learning-path/RouteMap'
import fisicaCurriculum from '@/data/curriculum/fisica.json'
import relicData from '@/data/relics.json'
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

function getRelicForLevel(nivel: number): ChestReward {
  const relics = (relicData as { relics: { id: string; name: string; description: string; icon: string; unlocksOn: { type: string; nivel: number } }[] }).relics
  const relic = relics.find(r => r.unlocksOn.type === 'nivel_completed' && r.unlocksOn.nivel === nivel)
  if (relic) return { name: relic.name, image: relic.icon, description: relic.description }
  return { name: `Reliquia del Nivel ${nivel}`, image: '/images/reliquias/placeholder.png', description: 'Un artefacto ancestral aguarda.' }
}

function getRankInfo(xp: number, totalNodes: number, completedNodes: number) {
  const pct = totalNodes > 0 ? completedNodes / totalNodes : 0
  if (pct >= 1) return { name: 'Maestro del Cosmos', color: '#D4AF37', icon: Trophy, nextRank: null }
  if (pct >= 0.66) return { name: 'Guardián Arcano', color: '#A78BFA', icon: Award, nextRank: 'Maestro del Cosmos' }
  if (pct >= 0.33) return { name: 'Aprendiz del Nexo', color: '#2DD4BF', icon: Star, nextRank: 'Guardián Arcano' }
  return { name: 'Iniciado del Éter', color: '#F87171', icon: Zap, nextRank: 'Aprendiz del Nexo' }
}

export default function CosmicConstellationPath() {
  const { progress } = useGamification()
  const router = useRouter()
  const completedPaths = progress.completedPaths || []
  const completedLayers = progress.completedLayers || {}
  const relics = progress.physicsRelics || []
  const achievements = progress.achievements || []
  const dailyStreak = progress.dailyStreak || 0

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
          id: a.slug, order: globalOrder, title: a.title,
          description: NODE_DESCRIPTIONS[a.slug] || 'Un misterio del cosmos por descubrir.',
          emoji: NODE_EMOJIS[a.slug] || '🔮', slug: a.slug, xp: 75,
          stars: (Math.min(lyrs, 3) as 0 | 1 | 2 | 3), status, type: toNodeType(a.tipo),
        }
      })

      const doneCount = nodes.filter(n => n.status === 'done').length
      const minForChest = Math.ceil(nodes.length / 2)

      return {
        id: lvl.nivel, title: lvl.titulo, emoji: LEVEL_EMOJIS[idx] || '🌑',
        colorClass: COLOR_CLASSES[idx] || 'purple', nodes,
        chestUnlocked: doneCount >= minForChest,
        chestReward: getRelicForLevel(lvl.nivel),
      }
    })

    return { id: 'fisica', title: 'Física', levels }
  }, [articles, completedPaths, completedLayers])

  const routeUserProgress: RouteUserProgress = useMemo(() => {
    const allNodes = routeData.levels.flatMap(l => l.nodes)
    const doneNodes = allNodes.filter(n => n.status === 'done')
    const totalXP = allNodes.reduce((s, n) => s + (n.stars ?? 0) * 25, 0)
    const pct = allNodes.length > 0 ? doneNodes.length / allNodes.length : 0
    const levelName = pct >= 1 ? 'Maestro del Cosmos' : pct >= 0.66 ? 'Guardián Arcano' : pct >= 0.33 ? 'Aprendiz del Nexo' : 'Iniciado del Éter'
    return { totalXP, levelName, completedNodes: doneNodes.map(n => n.id) }
  }, [routeData])

  const handleNodeStart = useCallback((slug: string) => {
    router.push(`/guias/ciencias_naturales/fisica/${slug}`)
  }, [router])

  const allNodesFlat = routeData.levels.flatMap(l => l.nodes)
  const doneCount = allNodesFlat.filter(n => n.status === 'done').length
  const rank = getRankInfo(routeUserProgress.totalXP, allNodesFlat.length, doneCount)
  const RankIcon = rank.icon

  return (
    <div className="min-h-screen flex justify-center" style={{ background: '#0D0B14', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      {/* ─── Main Path ─── */}
      <div className="py-10">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 px-4">
            <p className="text-xs font-bold tracking-[0.35em] uppercase text-[#8B6914] mb-3">
              Archivo del Nexo
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: '#D4AF37' }}>
              El Sendero del Sabio
            </h1>
            <p className="text-base text-[#8B6914]">
              {allNodesFlat.length} constelaciones · {routeData.levels.length} reinos · 3 velos por lección
            </p>
          </div>

          <RouteMap route={routeData} userProgress={routeUserProgress} onNodeStart={handleNodeStart} />
        </div>
      </div>

      {/* ─── Sidebar ─── */}
      <aside className="w-[300px] shrink-0 border-l border-[#2A2415] bg-[#0D0B14] py-10 px-6 hidden lg:flex flex-col gap-6 overflow-y-auto sticky top-0">
        {/* Rank */}
        <div className="rounded-2xl border border-[#2A2415] bg-[#16140F] p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#6B5B35] mb-3">Clasificación</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${rank.color}15`, border: `2px solid ${rank.color}40` }}>
              <RankIcon size={24} style={{ color: rank.color }} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: rank.color }}>{rank.name}</p>
              {rank.nextRank && <p className="text-xs text-[#6B5B35]">Próximo: {rank.nextRank}</p>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-[#2A2415] bg-[#16140F] p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#6B5B35] mb-4">Estadísticas</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy size={16} className="text-[#D4AF37]" />
                <span className="text-sm text-[#8B7720]">XP Total</span>
              </div>
              <span className="text-base font-bold text-[#D4AF37]">{routeUserProgress.totalXP.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star size={16} className="text-[#A78BFA]" />
                <span className="text-sm text-[#8B7720]">Paradas</span>
              </div>
              <span className="text-base font-bold text-[#A78BFA]">{doneCount}/{allNodesFlat.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame size={16} className="text-[#FB923C]" />
                <span className="text-sm text-[#8B7720]">Racha diaria</span>
              </div>
              <span className="text-base font-bold text-[#FB923C]">{dailyStreak} días</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award size={16} className="text-[#2DD4BF]" />
                <span className="text-sm text-[#8B7720]">Logros</span>
              </div>
              <span className="text-base font-bold text-[#2DD4BF]">{achievements.length}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="rounded-2xl border border-[#2A2415] bg-[#16140F] p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#6B5B35] mb-3">Progreso</p>
          <div className="h-3 bg-[#2A2415] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, allNodesFlat.length > 0 ? (doneCount / allNodesFlat.length) * 100 : 0)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#6B5B35] font-bold">{Math.round(allNodesFlat.length > 0 ? (doneCount / allNodesFlat.length) * 100 : 0)}%</span>
            <span className="text-[#6B5B35]">100%</span>
          </div>
        </div>

        {/* Chests */}
        <div className="rounded-2xl border border-[#2A2415] bg-[#16140F] p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#6B5B35] mb-3">Cofres de nivel</p>
          <div className="flex gap-3">
            {routeData.levels.map((lvl) => (
              <div
                key={lvl.id}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 transition-all ${
                  lvl.chestUnlocked ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#2A2415] bg-[#2A2415]/10 opacity-30'
                }`}
                title={lvl.chestUnlocked ? lvl.chestReward?.name : 'Bloqueado'}
              >
                {lvl.chestUnlocked ? '🎁' : '🔒'}
              </div>
            ))}
          </div>
        </div>

        {/* Relics */}
        {relics.length > 0 && (
          <div className="rounded-2xl border border-[#2A2415] bg-[#16140F] p-5">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#6B5B35] mb-3">Reliquias ({relics.length})</p>
            <div className="space-y-3">
              {relics.slice(0, 4).map((relicId) => {
                const r = (relicData as { relics: { id: string; name: string; icon: string }[] }).relics.find(x => x.id === relicId)
                if (!r) return null
                return (
                  <div key={relicId} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2A2415] border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={r.icon} alt={r.name} className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-xs text-[#8B7720] truncate">{r.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
