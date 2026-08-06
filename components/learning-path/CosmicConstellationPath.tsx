'use client'
import { useMemo, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Star, Flame, Award, Zap, Sparkles, Target, TrendingUp, Gift, Map, CheckCircle } from 'lucide-react'
import { RouteMap, type RouteData, type RouteLevel, type RouteNode, type RouteUserProgress, type NodeStatus, type ChestReward } from '@/components/learning-path/RouteMap'
import fisicaCurriculum from '@/data/curriculum/fisica.json'
import relicData from '@/data/relics.json'
import { useGamification } from '@/context/GamificationContext'
import { useAuth } from '@/context/AuthContext'
import { getNodeIcon, IconGuiaMaestra } from '@/components/learning-path/NodeIcons'
import { ChestRewardModal } from './ChestRewardModal'
import { BossChallengeModal } from './BossChallengeModal'

/* ─── DATA ─── */
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

const COLOR_CLASSES = ['purple', 'teal', 'gold', 'red'] as const

function toNodeType(t?: string): 'theory' | 'practice' { return t==='practice'?'practice':'theory' }

function getRelicForLevel(nivel: number): ChestReward {
  const relics = (relicData as { relics: { id:string; name:string; description:string; icon:string; unlocksOn:{ type:string; nivel:number } }[] }).relics
  const relic = relics.find(r=>r.unlocksOn.type==='nivel_completed'&&r.unlocksOn.nivel===nivel)
  if(relic) return { name:relic.name, image:relic.icon, description:relic.description }
  return { name:`Reliquia Nivel ${nivel}`, image:'/images/reliquias/placeholder.png', description:'Artefacto ancestral.' }
}

function getRankInfo(totalNodes:number, done:number) {
  const pct = totalNodes>0 ? done/totalNodes : 0
  if(pct>=1) return { name:'Maestro del Cosmos', color:'#D4AF37', icon:Trophy, xpNeeded:null, emoji:'👑' }
  if(pct>=0.66) return { name:'Guardián Arcano', color:'#A78BFA', icon:Award, xpNeeded:'Maestro', emoji:'🛡️' }
  if(pct>=0.33) return { name:'Aprendiz del Nexo', color:'#2DD4BF', icon:Star, xpNeeded:'Guardián', emoji:'📖' }
  return { name:'Iniciado del Éter', color:'#F87171', icon:Zap, xpNeeded:'Aprendiz', emoji:'🌱' }
}

/* ─── AMBIENT STARFIELD ─── */
function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[url('/images/hero-fantasy-room.png')] bg-cover bg-center bg-fixed">
      {/* Dark overlay to make UI readable */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Top gradient for header */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
      {/* Right gradient for sidebar */}
      <div className="absolute top-0 right-0 bottom-0 w-[400px] bg-gradient-to-l from-black/80 to-transparent" />
    </div>
  )
}

/* ─── SIDEBAR CARD ─── */
function SideCard({ title, icon: Icon, children, accent='#FFD700' }: {
  title:string; icon:React.ComponentType<{size?:number; className?:string; style?:React.CSSProperties}>; children:React.ReactNode; accent?:string
}) {
  return (
    <div className="relative p-6 shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden rounded-3xl"
      style={{
        background:'rgba(0,0,0,0.4)',
      }}>
      {/* 3D Frame Background */}
      <img src="/images/sidebar-frame.png" alt="frame" className="absolute inset-0 w-full h-full object-fill mix-blend-screen opacity-50 pointer-events-none" />
      
      <div className="absolute top-0 left-0 w-[2px] h-full" style={{background: `linear-gradient(180deg, transparent, ${accent}, transparent)`}} />
      <div className="relative flex items-center gap-3 mb-5 z-10">
        <div className="p-2 rounded-xl bg-black/50 border border-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
          <Icon size={16} style={{color:accent, filter:`drop-shadow(0 0 6px ${accent})`}} />
        </div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">{title}</p>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/* ─── PROGRESS RING ─── */
function ProgressRing({ pct, size=48, stroke=4, color='#D4AF37' }: { pct:number; size?:number; stroke?:number; color?:string }) {
  const r = (size-stroke)/2
  const circ = 2*Math.PI*r
  const offset = circ*(1-pct/100)
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2A2415" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-1000"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2+1} textAnchor="middle" fill={color} fontSize={size*0.28} fontWeight="bold"
        className="font-mono">{Math.round(pct)}</text>
    </svg>
  )
}

/* ─── MAIN ─── */
export default function CosmicConstellationPath() {
  const { progress } = useGamification()
  const { user } = useAuth()
  const router = useRouter()
  const [chestModalOpen, setChestModalOpen] = useState(false)
  const [activeChestLevel, setActiveChestLevel] = useState<number>(1)
  const [bossModalNode, setBossModalNode] = useState<RouteNode | null>(null)

  const completedPaths = progress.completedPaths || []
  const completedLayers = progress.completedLayers || {}
  const relics = progress.physicsRelics || []
  const achievements = progress.achievements || []
  const dailyStreak = progress.dailyStreak || 0
  const weeklyXp = progress.weeklyXp || 0
  const totalUserXp = progress.xp || 0

  const curriculum = fisicaCurriculum as { levels?:{nivel:number;titulo:string;descripcion:string}[]; articles?:ArticleJSON[] }
  const articles = useMemo(()=>[...(curriculum.articles||[])].sort((a,b)=>a.nivel-b.nivel||a.orden-b.orden),[])

  const routeData: RouteData = useMemo(()=>{
    const curriculumLevels = curriculum.levels||[]
    let globalOrder = 0
    const levels: RouteLevel[] = curriculumLevels.map((lvl,idx)=>{
      const lvlArticles = articles.filter(a=>a.nivel===lvl.nivel)
      let prevDone = true
      const nodes: RouteNode[] = lvlArticles.map((a, i) => {
        globalOrder++
        const lyrs = completedLayers[a.slug]?.length||0
        const done = completedPaths.includes(a.slug)||lyrs>=3
        const unlocked = globalOrder===1||prevDone
        if(done) prevDone=true; else prevDone=false
        
        const isBoss = i === lvlArticles.length - 1;
        
        return {
          id:a.slug, order:globalOrder, title:a.title,
          description:NODE_DESCRIPTIONS[a.slug]||'Un misterio del cosmos.',
          emoji:'✨', slug:a.slug, xp: isBoss ? 150 : 75, icon: getNodeIcon(a.slug),
          stars:Math.min(lyrs,3) as 0|1|2|3,
          status:(done?'done':unlocked?'active':'locked') as NodeStatus,
          type: isBoss ? 'boss' : toNodeType(a.tipo),
        }
      })

      let chestNode = null
      if (nodes.length > 0) {
        const midIndex = Math.ceil(nodes.length / 2)
        const prevNode = nodes[midIndex - 1]
        const chestStatus = prevNode?.status === 'done' ? 'active' : 'locked'
        
        chestNode = {
          id: `chest-lvl-${lvl.nivel}`,
          order: prevNode ? prevNode.order + 0.5 : globalOrder + 0.5,
          title: 'Tesoro Arcano',
          description: 'Cofre mágico con mobiliario para tu sala de estudio.',
          emoji: '🎁',
          slug: `chest-${lvl.nivel}`,
          xp: 150,
          status: chestStatus as NodeStatus,
          type: 'chest' as const
        }
      }

      const doneCount = nodes.filter(n=>n.status==='done').length
      return {
        id:lvl.nivel, title:lvl.titulo, emoji:'✦',
        colorClass:COLOR_CLASSES[idx]||'purple', nodes,
        chestNode,
        chestUnlocked: doneCount>=Math.ceil(nodes.length/2),
        chestReward: getRelicForLevel(lvl.nivel),
      }
    })
    return { id:'fisica', title:'Física', levels }
  },[articles,completedPaths,completedLayers])

  const routeUserProgress: RouteUserProgress = useMemo(()=>{
    const allNodes = routeData.levels.flatMap(l=>l.nodes)
    const doneNodes = allNodes.filter(n=>n.status==='done')
    const totalXP = allNodes.reduce((s,n)=>s+(n.stars??0)*25,0)
    const pct = allNodes.length>0?doneNodes.length/allNodes.length:0
    const levelName = pct>=1?'Maestro del Cosmos':pct>=0.66?'Guardián Arcano':pct>=0.33?'Aprendiz del Nexo':'Iniciado del Éter'
    return { totalXP, levelName, completedNodes:doneNodes.map(n=>n.id) }
  },[routeData])

  // Define allNodes early so useCallback can use it
  const allNodes = useMemo(() => routeData.levels.flatMap(l=>l.nodes), [routeData])

  const handleNodeStart = useCallback((slug:string)=>{
    if (slug.startsWith('chest-')) {
      const lvlStr = slug.replace('chest-', '')
      setActiveChestLevel(parseInt(lvlStr, 10))
      setChestModalOpen(true)
      return
    }
    
    // Check if it's a boss node
    const node = allNodes.find(n => n.slug === slug);
    if (node?.type === 'boss') {
      setBossModalNode(node);
      return;
    }

    router.push(`/guias/ciencias_naturales/fisica/${slug}`)
  },[router, allNodes])

  const doneCount = allNodes.filter(n=>n.status==='done').length
  const pct = allNodes.length>0?Math.round((doneCount/allNodes.length)*100):0
  const rank = getRankInfo(allNodes.length, doneCount)
  const chestsUnlocked = routeData.levels.filter(l=>l.chestUnlocked).length
  const RankIcon = rank.icon

  return (
    <div className="min-h-screen relative text-white selection:bg-[#C084FC]/30" style={{background:'#030206', fontFamily:'var(--font-sans), system-ui, sans-serif'}}>
      <AmbientBackground />

      {/* ─── LAYOUT ─── */}
      <div className="relative z-10 flex w-full min-h-screen pt-16">
        {/* ─── MAIN PATH (CONSTELLATION) ─── */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden relative flex items-center justify-start pl-16">
          <RouteMap route={routeData} userProgress={routeUserProgress} onNodeStart={handleNodeStart} />
          
          {/* Scroll Indicator */}
          <div className="sticky right-12 z-50 pointer-events-none flex flex-col items-center justify-center opacity-80 animate-pulse ml-8">
            <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(212,175,55,0.5)] backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-[10px] mt-3 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
              Descubrir
            </span>
          </div>
        </main>
        {/* ─── SIDEBAR DASHBOARD ─── */}
        <aside className="w-[340px] shrink-0 py-8 px-4 hidden xl:flex flex-col gap-6 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
          
          {/* RPG WOODEN FRAME (RACHA, NIVEL, RELIQUIAS) */}
          <div className="relative bg-[#1A120B] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[3px] border-[#3E2723]">
            {/* Outer Gold Border */}
            <div className="relative border-4 border-double border-[#D4AF37] p-4 flex flex-col items-center gap-6" style={{boxShadow:'inset 0 0 20px rgba(0,0,0,0.8)'}}>
              
              {/* Corner Ornaments */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

              {/* Racha Section */}
              <div className="w-full text-center">
                <p className="text-[#D4AF37] font-serif text-sm tracking-widest uppercase mb-1">Racha</p>
                <div className="flex items-center justify-center gap-3">
                  <Flame size={24} className="text-[#FB923C]" style={{filter:'drop-shadow(0 0 8px #FB923C)'}} />
                  <span className="text-2xl font-serif text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{dailyStreak} días</span>
                </div>
              </div>

              {/* Ornamental Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

              {/* Level Parchment */}
              <div className="relative w-[180px] h-[140px] flex flex-col items-center justify-center mt-2">
                {/* Parchment background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F4E4BC] to-[#D9B87B] rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
                  {/* Rolled edges effect */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[rgba(0,0,0,0.3)] to-transparent rounded-t-sm" />
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-[rgba(0,0,0,0.3)] to-transparent rounded-b-sm" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <p className="text-[#5D4037] font-serif font-bold text-xs tracking-widest uppercase mb-1">Nivel</p>
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4),inset_0_0_10px_rgba(0,0,0,0.2)]">
                    <span className="text-4xl font-serif text-[#3E2723] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">{progress.level || 1}</span>
                  </div>
                </div>
              </div>

              {/* Ornamental Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mt-2" />

              {/* Relics Section */}
              <div className="w-full text-center">
                <p className="text-[#D4AF37] font-serif text-sm tracking-widest uppercase mb-1">Reliquias</p>
                <span className="text-xl font-serif text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{chestsUnlocked}/4</span>
              </div>
            </div>
          </div>

          {/* MISSIONS SECTION */}
          <div className="relative p-4 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4 flex items-center gap-2">
              <Star size={12} className="text-[#D4AF37]" /> Misiones Secundarias
            </h3>
            
            <div className="space-y-3">
              {/* Mission 1 */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="mt-0.5">
                  <CheckCircle size={16} className="text-white/20" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Racha Perfecta</h4>
                  <p className="text-xs text-white/50 mb-2 leading-tight">Mantén una racha de 7 días consecutivos de estudio.</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF37]">
                    <Zap size={10} /> +300 XP
                  </div>
                </div>
              </div>

              {/* Mission 2 */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="mt-0.5">
                  <CheckCircle size={16} className="text-white/20" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Explorador del Nivel</h4>
                  <p className="text-xs text-white/50 mb-2 leading-tight">Visita todos los artículos del nivel actual.</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF37]">
                    <Zap size={10} /> +200 XP
                  </div>
                </div>
              </div>
            </div>
          </div>

        </aside>
      </div>
      
      <ChestRewardModal 
        isOpen={chestModalOpen} 
        onClose={() => setChestModalOpen(false)} 
        chestLevel={activeChestLevel} 
      />
      
      {bossModalNode && (
        <BossChallengeModal 
          isOpen={true} 
          onClose={() => setBossModalNode(null)} 
          node={bossModalNode} 
        />
      )}
    </div>
  )
}
