'use client'
import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Star, Flame, Award, Zap, Sparkles, Target, TrendingUp, Gift, Map } from 'lucide-react'
import { RouteMap, type RouteData, type RouteLevel, type RouteNode, type RouteUserProgress, type NodeStatus, type ChestReward } from '@/components/learning-path/RouteMap'
import fisicaCurriculum from '@/data/curriculum/fisica.json'
import relicData from '@/data/relics.json'
import { useGamification } from '@/context/GamificationContext'

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

const NODE_EMOJIS: Record<string, string> = {
  'guia-maestra-de-fisica':'🔮','como-piensa-un-fisico':'☄️','cinematica':'🌌','materia-y-energia':'💠',
  'metodo-cientifico':'⚗️','vectores':'🧿','leyes-newton-movimiento':'🌍','trabajo-energia':'⚡',
  'momentum-colisiones':'💫','movimiento-circular-satelites':'🪐','torque-momento-angular':'🌀',
  'termodinamica':'🔥','electromagnetismo':'🌩️','ondas-y-optica':'🌈','mecanica-cuantica':'⬡',
  'relatividad-especial':'⏳','relatividad-general':'🕳️','fisica-atomica-y-nuclear':'⚛️',
  'fisica-particulas':'✨','teoria-del-todo':'☯️','cosmologia':'🌟','fluidos':'💧',
  'electromagnetismo-avanzado':'🔌','ondas-y-optica-practica':'👁️','relatividad-especial-practica':'🚀',
}

const COLOR_CLASSES = ['purple', 'teal', 'gold', 'red'] as const
const LEVEL_EMOJIS = ['🌑', '🌓', '🌕', '🌟']

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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Nebula glows */}
      <div className="absolute top-[-20%] left-[-5%] w-[60vw] h-[50vh] rounded-full opacity-[0.04] blur-[180px]"
        style={{background:'radial-gradient(ellipse, #8B5CF6, transparent)'}} />
      <div className="absolute bottom-[-15%] right-[-5%] w-[50vw] h-[40vh] rounded-full opacity-[0.03] blur-[150px]"
        style={{background:'radial-gradient(ellipse, #06B6D4, transparent)'}} />
      <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vh] rounded-full opacity-[0.03] blur-[120px]"
        style={{background:'radial-gradient(ellipse, #D4AF37, transparent)'}} />

      {/* Stars */}
      {Array.from({length:120}).map((_,i)=>{
        const size = i<10?2.5:i<30?2:1
        const bright = i<10
        return (
          <div key={i} className="absolute rounded-full animate-pulse"
            style={{
              left:`${5+Math.random()*90}%`, top:`${3+Math.random()*94}%`,
              width:size, height:size,
              background:['#A78BFA','#67E8F9','#D4AF37','#F472B6','#FCD34D'][i%5],
              opacity:0.15+Math.random()*0.15, animationDuration:`${3+Math.random()*5}s`,
              boxShadow:bright?`0 0 ${size*4}px currentColor`:'none',
            }} />
        )
      })}
    </div>
  )
}

/* ─── SIDEBAR CARD ─── */
function SideCard({ title, icon: Icon, children, accent='#D4AF37' }: {
  title:string; icon:React.ComponentType<{size?:number; className?:string; style?:React.CSSProperties}>; children:React.ReactNode; accent?:string
}) {
  return (
    <div className="rounded-2xl border p-4 backdrop-blur-sm"
      style={{background:'rgba(22,20,15,0.7)', borderColor:'rgba(42,36,21,0.5)'}}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} style={{color:accent}} />
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{color:`${accent}80`}}>{title}</p>
      </div>
      {children}
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
  const router = useRouter()
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
      const nodes: RouteNode[] = lvlArticles.map(a=>{
        globalOrder++
        const lyrs = completedLayers[a.slug]?.length||0
        const done = completedPaths.includes(a.slug)||lyrs>=3
        const unlocked = globalOrder===1||prevDone
        if(done) prevDone=true; else prevDone=false
        return {
          id:a.slug, order:globalOrder, title:a.title,
          description:NODE_DESCRIPTIONS[a.slug]||'Un misterio del cosmos.',
          emoji:NODE_EMOJIS[a.slug]||'🔮', slug:a.slug, xp:75,
          stars:Math.min(lyrs,3) as 0|1|2|3,
          status:(done?'done':unlocked?'active':'locked') as NodeStatus,
          type:toNodeType(a.tipo),
        }
      })
      const doneCount = nodes.filter(n=>n.status==='done').length
      return {
        id:lvl.nivel, title:lvl.titulo, emoji:LEVEL_EMOJIS[idx]||'🌑',
        colorClass:COLOR_CLASSES[idx]||'purple', nodes,
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

  const handleNodeStart = useCallback((slug:string)=>router.push(`/guias/ciencias_naturales/fisica/${slug}`),[router])

  const allNodes = routeData.levels.flatMap(l=>l.nodes)
  const doneCount = allNodes.filter(n=>n.status==='done').length
  const pct = allNodes.length>0?Math.round((doneCount/allNodes.length)*100):0
  const rank = getRankInfo(allNodes.length, doneCount)
  const chestsUnlocked = routeData.levels.filter(l=>l.chestUnlocked).length
  const RankIcon = rank.icon

  return (
    <div className="min-h-screen relative" style={{background:'#08060D', fontFamily:'var(--font-sans), system-ui, sans-serif'}}>
      <AmbientBackground />

      {/* ─── LAYOUT ─── */}
      <div className="relative z-10 flex justify-center gap-0 min-h-screen">
        {/* ─── MAIN PATH ─── */}
        <main className="w-full max-w-[720px] py-10 px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="h-px w-12 rounded-full opacity-20"
                style={{background:`linear-gradient(90deg, transparent, #D4AF37)`}} />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8B6914]/50">Volumen I</span>
              <span className="h-px w-12 rounded-full opacity-20"
                style={{background:`linear-gradient(90deg, #D4AF37, transparent)`}} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2"
              style={{color:'#D4AF37', textShadow:'0 2px 12px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.15)'}}>
              El Sendero del Sabio
            </h1>
            <p className="text-base text-[#8B6914]/50 italic mb-3">
              "El universo no está hecho de átomos; está hecho de historias."
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] font-mono tracking-[0.12em] text-[#8B6914]/30">
              <span>{allNodes.length} constelaciones</span><span>·</span>
              <span>{routeData.levels.length} reinos</span><span>·</span>
              <span>3 velos por lección</span>
            </div>
          </div>

          <RouteMap route={routeData} userProgress={routeUserProgress} onNodeStart={handleNodeStart} />
        </main>

        {/* ─── SIDEBAR DASHBOARD ─── */}
        <aside className="w-[320px] shrink-0 border-l border-[#2A2415]/50 py-10 px-5 hidden lg:flex flex-col gap-4 overflow-y-auto sticky top-0 h-screen"
          style={{background:'radial-gradient(ellipse at 0% 50%, rgba(10,8,21,0.8), transparent 70%)'}}>

          {/* RANK */}
          <SideCard title="Rango arcano" icon={RankIcon} accent={rank.color}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{rank.emoji}</span>
              <div>
                <p className="text-base font-bold" style={{color:rank.color}}>{rank.name}</p>
                {rank.xpNeeded && <p className="text-[10px] text-[#6B5B35]/50">Próximo: {rank.xpNeeded}</p>}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-[#6B5B35]/40 mb-1">
                <span>Progreso de rango</span><span>{pct}%</span>
              </div>
              <div className="h-1.5 bg-[#2A2415] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`, background:`linear-gradient(90deg, ${rank.color}80, ${rank.color})`}} />
              </div>
            </div>
          </SideCard>

          {/* STREAK + WEEKLY */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border p-4 backdrop-blur-sm"
              style={{background:'rgba(22,20,15,0.7)', borderColor:'rgba(42,36,21,0.5)'}}>
              <div className="flex items-center gap-1.5 mb-2">
                <Flame size={14} style={{color:'#FB923C'}} />
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#FB923C]/60">Racha</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#FB923C]">{dailyStreak}</span>
                <span className="text-xs text-[#FB923C]/40">días</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[0,1,2,3,4].map(i=>(
                  <div key={i} className={`flex-1 h-1 rounded-full ${i<Math.min(dailyStreak,5)?'bg-[#FB923C]':'bg-[#2A2415]'}`} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-4 backdrop-blur-sm"
              style={{background:'rgba(22,20,15,0.7)', borderColor:'rgba(42,36,21,0.5)'}}>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={14} style={{color:'#2DD4BF'}} />
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#2DD4BF]/60">Semanal</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#2DD4BF]">{weeklyXp}</span>
                <span className="text-xs text-[#2DD4BF]/40">XP</span>
              </div>
              <div className="w-full h-1 bg-[#2A2415] rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#2DD4BF] rounded-full" style={{width:`${Math.min(100,(weeklyXp/500)*100)}%`}} />
              </div>
            </div>
          </div>

          {/* STATS */}
          <SideCard title="Estadísticas" icon={Target} accent="#A78BFA">
            <div className="space-y-3">
              {[
                {label:'XP Total', value:totalUserXp.toLocaleString(), color:'#D4AF37', icon:Trophy},
                {label:'Paradas completadas', value:`${doneCount}/${allNodes.length}`, color:'#A78BFA', icon:Map},
                {label:'Logros', value:String(achievements.length), color:'#2DD4BF', icon:Award},
              ].map(s=>(
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <s.icon size={13} style={{color:s.color, opacity:0.6}} />
                    <span className="text-xs text-[#8B7720]/60">{s.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{color:s.color}}>{s.value}</span>
                </div>
              ))}
            </div>
          </SideCard>

          {/* PROGRESS */}
          <SideCard title="Progreso global" icon={Sparkles} accent="#D4AF37">
            <div className="flex items-center gap-4">
              <ProgressRing pct={pct} size={56} stroke={5} color="#D4AF37" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D4AF37] font-bold">{doneCount} completadas</span>
                  <span className="text-[#6B5B35]/40">{allNodes.length} total</span>
                </div>
                <div className="h-2 bg-[#2A2415] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{width:`${pct}%`, background:'linear-gradient(90deg, #B8860B, #D4AF37)'}} />
                </div>
                <p className="text-[10px] text-[#6B5B35]/30">
                  {allNodes.length-doneCount} paradas restantes para la maestría
                </p>
              </div>
            </div>
          </SideCard>

          {/* CHESTS */}
          <SideCard title="Cofres de nivel" icon={Gift} accent="#D4AF37">
            <div className="flex gap-3">
              {routeData.levels.map(lvl=>(
                <div key={lvl.id}
                  className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all ${
                    lvl.chestUnlocked?'border-[#D4AF37]/40 bg-[#D4AF37]/5':'border-[#2A2415] bg-[#0A080F]/50 opacity-30'}`}
                  title={lvl.chestUnlocked?lvl.chestReward?.name:'Bloqueado'}>
                  <span className="text-xl">{lvl.chestUnlocked?'🎁':'🔒'}</span>
                  <span className="text-[8px] font-bold text-[#8B6914]/40">{lvl.chestUnlocked?'N'+lvl.id:'--'}</span>
                </div>
              ))}
            </div>
          </SideCard>

          {/* RELICS */}
          {relics.length>0 && (
            <SideCard title={`Reliquias (${relics.length})`} icon={Sparkles} accent="#F472B6">
              <div className="space-y-2">
                {relics.map(relicId=>{
                  const r = (relicData as { relics:{id:string;name:string;icon:string}[] }).relics.find(x=>x.id===relicId)
                  if(!r) return null
                  return (
                    <div key={relicId} className="flex items-center gap-3 p-2 rounded-xl border border-[#2A2415]/30 bg-[#0A080F]/50">
                      <div className="w-9 h-9 rounded-lg bg-[#1C1810] border border-[#D4AF37]/10 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={r.icon} alt="" className="w-7 h-7 object-contain" />
                      </div>
                      <span className="text-[11px] text-[#8B7720]/60 truncate">{r.name}</span>
                    </div>
                  )
                })}
              </div>
            </SideCard>
          )}

          {/* NEXT QUEST */}
          <SideCard title="Próxima parada" icon={Map} accent="#FB923C">
            {(()=>{
              const next = allNodes.find(n=>n.status==='active')
              if(!next) return <p className="text-xs text-[#6B5B35]/40">¡Todo completado!</p>
              return (
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[#FB923C]/10 bg-[#FB923C]/3 cursor-pointer hover:bg-[#FB923C]/6 transition-colors"
                  onClick={()=>router.push(`/guias/ciencias_naturales/fisica/${next.slug}`)}>
                  <span className="text-2xl">{next.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-[#FB923C]">{next.title}</p>
                    <p className="text-[10px] text-[#FB923C]/40">+{next.xp} XP · {next.type==='theory'?'Teoría':'Práctica'}</p>
                  </div>
                  <Sparkles size={14} className="ml-auto text-[#FB923C]/60" />
                </div>
              )
            })()}
          </SideCard>
        </aside>
      </div>
    </div>
  )
}
