'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Lock, Play, Zap } from 'lucide-react'
import { ROOM_ASSETS } from '@/data/roomEngineAssets'
import { cn } from '@/lib/utils'

export type NodeStatus = 'done' | 'active' | 'locked'

export interface RouteNode {
  id: string; order: number; title: string; description: string
  emoji: string; slug: string; xp: number; stars?: 0 | 1 | 2 | 3
  status: NodeStatus; type: 'theory' | 'practice' | 'chest' | 'boss'
  possibleRewards?: any[] // used for chests
  icon?: React.ComponentType<{ className?: string }>
}

export interface ChestReward {
  name: string; image: string; description: string
}

export interface RouteLevel {
  id: number
  title: string
  emoji: string
  colorClass: string
  nodes: RouteNode[]
  chestUnlocked?: boolean
  chestReward?: ChestReward | null
  chestNode?: RouteNode | null
}

export interface RouteData { id: string; title: string; levels: RouteLevel[] }

export interface RouteUserProgress { totalXP: number; levelName: string; completedNodes: string[] }

/* ───────── PALETTE (NEON + GLASS) ───────── */
const P = {
  gold:   { accent:'#FFD700', accent2:'#FFF07F', accent3:'#B8860B', bg:'rgba(255,215,0,0.05)', border:'rgba(255,215,0,0.2)', glow:'rgba(255,215,0,0.4)' },
  purple: { accent:'#C084FC', accent2:'#E9D5FF', accent3:'#9333EA', bg:'rgba(192,132,252,0.05)', border:'rgba(192,132,252,0.2)', glow:'rgba(192,132,252,0.4)' },
  teal:   { accent:'#2DD4BF', accent2:'#99F6E4', accent3:'#0D9488', bg:'rgba(45,212,191,0.05)', border:'rgba(45,212,191,0.2)', glow:'rgba(45,212,191,0.4)' },
  red:    { accent:'#F87171', accent2:'#FECACA', accent3:'#DC2626', bg:'rgba(248,113,113,0.05)', border:'rgba(248,113,113,0.2)', glow:'rgba(248,113,113,0.4)' },
}

/* ───────── CONSTELLATION PARTICLES ───────── */
function ConstellationParticles({ accent, count = 20 }: { accent: string; count?: number }) {
  const particles = useRef(Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, delay: Math.random() * 2
  })))
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
      {particles.current.map(p => (
        <div key={p.id} className="absolute rounded-full animate-pulse"
          style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            backgroundColor: accent, boxShadow: `0 0 ${p.size * 2}px ${accent}`,
            animationDelay: `${p.delay}s`, animationDuration: `${2 + Math.random()}s`
          }} />
      ))}
    </div>
  )
}

/* ───────── STAR RATING ───────── */
function Stars({ count=3, lit=0 }: { count?:number; lit:number }) {
  return (<div className="flex gap-1 mt-1.5">{Array.from({length:count}).map((_,i)=>(
    <span key={i} className={cn('text-sm transition-all duration-300', i<lit?'opacity-100 scale-110':'opacity-20')}
      style={{color:'#FFD700', filter:i<lit?'drop-shadow(0 0 6px #FFD700)':'none'}}>★</span>
  ))}</div>)
}

/* ───────── NODE CIRCLE ───────── */
function NodeCircle({ node, onClick }: { node:RouteNode; onClick:()=>void }) {
  const isDone = node.status==='done'
  const isActive = node.status==='active'
  const isLocked = node.status==='locked'
  const isChest = node.type === 'chest'

  if (isChest) {
    return (
      <div className="relative flex flex-col items-center group">
        <button 
          onClick={onClick} 
          disabled={isLocked} 
          className={cn(
            "relative w-[120px] h-[100px] flex items-center justify-center transition-all duration-500",
            isLocked ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer hover:scale-110 hover:-translate-y-2'
          )}
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
            boxShadow: isLocked ? 'none' : '0 15px 30px rgba(0,0,0,0.8), 0 0 40px rgba(255,215,0,0.5), inset 0 0 20px rgba(255,255,255,0.5)',
            border: '2px solid #FFF8DC',
            borderRadius: '16px' // Cofre cuadrado/redondeado
          }}
        >
          {/* Holographic Chest Core (Background frame) */}
          <div className="absolute inset-1.5 bg-[#1A120B] rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-[inset_0_0_20px_rgba(255,215,0,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#FFD700]/30 animate-pulse" />
          </div>
          
          {/* Pop-out Image */}
          <img 
            src="/images/chest-nanobanana.webp" 
            alt="chest" 
            className={cn(
              "absolute -top-10 w-[140px] h-[140px] object-contain z-20 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]", 
              !isLocked && "animate-bounce"
            )} 
            style={{
              filter: isLocked ? 'grayscale(100%) opacity(0.5)' : 'drop-shadow(0 0 15px rgba(255,215,0,0.6))'
            }}
          />
          {isActive && (
            <span className="absolute -top-4 right-1/2 translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full z-30 animate-pulse border border-[#FFD700] bg-black text-[#FFD700] shadow-[0_0_15px_#FFD700]">
              ¡ABRIR!
            </span>
          )}
          {isDone && (
            <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-30 border-2 border-[#3E2723]"
              style={{background:`#D4AF37`, color:'#050505', boxShadow:`0 0 10px rgba(212,175,55,1)`}}>
              ✓
            </span>
          )}
        </button>

        <div className="mt-4 flex flex-col items-center w-[160px] text-center z-20">
          <p className={cn("text-sm font-serif font-bold tracking-widest uppercase", isLocked ? "text-[#555449]" : "text-[#FFD700] drop-shadow-[0_2px_4px_rgba(0,0,0,1)]")}>
            {node.title}
          </p>
        </div>

        {/* Hover Tooltip con posibles recompensas */}
        {!isLocked && node.possibleRewards && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-[200px] bg-black/90 border border-[#D4AF37]/50 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 flex flex-col items-center">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold mb-2">Posibles Premios</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {node.possibleRewards.slice(0,3).map((item, i) => (
                <div key={i} className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                  <img src={ROOM_ASSETS[item.assetId]?.src || '/images/placeholders/furniture.png'} alt={item.name} className="w-8 h-8 object-contain" />
                </div>
              ))}
              {node.possibleRewards.length > 3 && (
                <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center">
                  <span className="text-white/50 text-xs">+{node.possibleRewards.length - 3}</span>
                </div>
              )}
            </div>
            {/* Pequeña flecha hacia abajo */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/90 border-b border-r border-[#D4AF37]/50 rotate-45" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center group">
      <button 
        onClick={onClick} 
        disabled={isLocked} 
        className={cn(
          "relative rounded-full flex items-center justify-center transition-all duration-300",
          node.type === 'boss' ? 'w-[130px] h-[130px]' : 'w-[110px] h-[110px]',
          isLocked ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer hover:scale-105',
          !isLocked && node.type === 'boss' ? 'hover:shadow-[0_0_40px_rgba(255,0,50,0.6)]' : (!isLocked && 'hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]')
        )}
        style={{
          background: 'rgba(0,0,0,0.7)',
          border: node.type === 'boss' ? '4px solid #FF3366' : '4px solid #D4AF37',
          boxShadow: isLocked ? 'none' : (node.type === 'boss' ? '0 0 20px rgba(255,51,102,0.6), inset 0 0 20px rgba(255,51,102,0.4)' : '0 0 15px rgba(212,175,55,0.4), inset 0 0 15px rgba(212,175,55,0.4)')
        }}
      >
        <div className={cn("absolute inset-2 rounded-full border", node.type === 'boss' ? "border-[#FF3366]/40" : "border-[#D4AF37]/30")} />
        
        {/* Content over the ring */}
        <div className="relative z-20 flex flex-col items-center justify-center">
          {node.icon ? (
            <node.icon className={cn("drop-shadow-[0_2px_5px_rgba(0,0,0,1)]", node.type === 'boss' ? "w-14 h-14 text-[#FF3366]" : "w-10 h-10 text-[#D4AF37]")} />
          ) : (
            <span className={cn("drop-shadow-[0_2px_4px_rgba(0,0,0,1)]", node.type === 'boss' ? "text-5xl" : "text-4xl")}>{node.emoji}</span>
          )}
        </div>

        {isActive && (
          <span className="absolute -top-1 -right-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full z-30 animate-pulse border border-[#3E2723]"
            style={{background: node.type === 'boss' ? '#FF3366' : '#D4AF37', color: node.type === 'boss' ? '#fff' : '#050505', boxShadow: node.type === 'boss' ? `0 2px 12px rgba(255,51,102,0.8)` : `0 2px 12px rgba(212,175,55,0.8)`}}>
            +{node.xp} XP
          </span>
        )}
        {isDone && (
          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-30 border-2 border-[#3E2723]"
            style={{background:`#D4AF37`, color:'#050505', boxShadow:`0 0 10px rgba(212,175,55,1)`}}>
            ✓
          </span>
        )}
      </button>

      {/* Title Badge Below Node */}
      <div className="mt-3 flex flex-col items-center w-[160px] text-center z-20">
        <p className={`text-sm font-serif font-bold leading-tight ${isLocked?'text-white/50':'text-[#D4AF37] drop-shadow-[0_2px_2px_rgba(0,0,0,1)]'}`}>
          {node.title}
        </p>
        <Stars lit={node.stars??0} />
      </div>
    </div>
  )
}

/* ───────── TOOLTIP ───────── */
function Tooltip({ title, desc }: { title:string; desc:string }) {
  return (
    <div className={cn(
      'absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-[200px] rounded-2xl p-3.5 z-20',
      'bg-[#0F0C18]/95 backdrop-blur-xl border border-[#D4AF37]/30',
      'opacity-0 group-hover:opacity-100 transition-all duration-200',
      'pointer-events-none text-left shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_16px_rgba(212,175,55,0.1)]'
    )}>
      <p className="text-sm font-bold text-[#D4AF37] mb-1">{title}</p>
      <p className="text-xs text-[#8B6914]/80 leading-relaxed">{desc}</p>
    </div>
  )
}

/* ───────── NODE COMPONENT ───────── */
function RouteNodeComponent({ node, palette, onClick }: {
  node:RouteNode; palette:typeof P['gold']; onClick:(n:RouteNode)=>void
}) {
  return (
    <div className="relative group flex flex-col items-center gap-2.5">
      <NodeCircle node={node} onClick={()=>onClick(node)} />
      <span className={cn('text-sm font-bold text-center max-w-[140px] leading-tight',
        node.status==='done'&&'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]',
        node.status==='active'&&'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]',
        node.status==='locked'&&'text-white/40',
      )}>{node.title}</span>
      <Stars lit={node.stars??0} />
      <Tooltip title={`${node.order}. ${node.title}`} desc={node.description} />
    </div>
  )
}

/* ───────── CONNECTORS ───────── */
function VerticalConnector({ palette, locked=false }: { palette:typeof P['gold']; locked?:boolean }) {
  return (
    <div className="flex flex-col items-center gap-0">
      <div className="w-[3px] h-16 rounded-full my-2"
        style={{
          background: locked ? 'rgba(255,255,255,0.05)' : `linear-gradient(180deg, ${palette.accent}, ${palette.accent2}, ${palette.accent})`, 
          opacity: locked ? 0.3 : 1,
          boxShadow: locked ? 'none' : `0 0 15px ${palette.accent}, 0 0 30px ${palette.glow}`
        }} />
    </div>
  )
}

/* ───────── CHEST ───────── */
function Chest({ unlocked, reward, palette, onOpen }: {
  unlocked:boolean; reward?:ChestReward; palette:typeof P['gold']; onOpen:()=>void
}) {
  const [showPreview, setShowPreview] = useState(false)
  return (
    <div className="relative flex flex-col items-center gap-1 my-2">
      <button
        onClick={()=>{if(unlocked){setShowPreview(v=>!v);onOpen()}}}
        disabled={!unlocked}
        className={cn(
          'relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 backdrop-blur-xl',
          'border transition-all duration-300',
          unlocked
            ? 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            : 'opacity-40 cursor-not-allowed'
        )}
        style={{
          background: unlocked ? `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.5))` : 'rgba(255,255,255,0.05)',
          borderColor: unlocked ? palette.accent : 'rgba(255,255,255,0.1)',
          boxShadow: unlocked ? `0 8px 32px rgba(0,0,0,0.5), 0 0 24px ${palette.glow}, inset 0 1px 0 rgba(255,255,255,0.3)` : 'none',
        }}
        aria-label={unlocked?`Cofre: ${reward?.name}`:'Cofre bloqueado'}
      >
        <span className="text-3xl">{unlocked?'🎁':'🔒'}</span>
        <span className="text-[9px] font-bold tracking-widest uppercase"
          style={{color:unlocked?'white':'rgba(255,255,255,0.5)'}}>
          {unlocked?'Abrir':'Sellado'}
        </span>
        {unlocked && (
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-bounce"
            style={{background:palette.accent, color:'#050505', boxShadow:`0 0 10px ${palette.glow}`}}>!</span>
        )}
      </button>

      {/* Reward popup */}
      {showPreview && unlocked && reward && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[280px] rounded-2xl p-5 z-30
          bg-[#050505]/90 backdrop-blur-2xl border
          shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_40px_rgba(255,255,255,0.1)]
          animate-in zoom-in-95 fade-in duration-200"
          style={{borderColor:palette.accent}}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                 style={{background:'rgba(255,255,255,0.1)', border:`1px solid ${palette.border}`}}>
              <img src={reward.image} alt="" className="w-12 h-12 object-contain drop-shadow-[0_0_8px_white]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1" style={{color:palette.accent}}>Recompensa</p>
              <p className="text-sm font-bold text-white leading-tight">{reward.name}</p>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">{reward.description}</p>
            </div>
            <button onClick={e=>{e.stopPropagation();setShowPreview(false)}}
              className="text-white/50 hover:text-white text-xl shrink-0">✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ───────── LEVEL BAND ───────── */
function LevelBand({ level, onNodeClick, onChestOpen }: {
  level:RouteLevel; onNodeClick:(n:RouteNode)=>void; onChestOpen:(l:RouteLevel)=>void
}) {
  const palette = P[level.colorClass as keyof typeof P]
  const done = level.nodes.filter(n=>n.status==='done').length

  return (
    <div className="relative w-full py-12 flex flex-col items-center">
      <ConstellationParticles accent={palette.accent} count={15} />

      {/* Level header pill */}
      <div className="relative z-10 flex justify-center mb-16">
        <div className="px-10 py-4 rounded-full border backdrop-blur-3xl text-sm font-black tracking-[0.25em] whitespace-nowrap"
          style={{
            background:`linear-gradient(135deg, rgba(0,0,0,0.8), rgba(255,255,255,0.08))`, 
            borderColor:palette.accent, 
            color:palette.accent2,
            boxShadow:`0 16px 40px rgba(0,0,0,0.9), 0 0 30px ${palette.glow}, inset 0 2px 0 rgba(255,255,255,0.3)`
          }}>
          <span className="mr-3 text-xl">{level.emoji}</span> NIVEL {level.id} — {level.title.toUpperCase()}
        </div>
      </div>

      {/* Row counter */}
      <div className="relative z-10 flex justify-center mb-10">
        <span className="text-[11px] font-mono tracking-[0.12em] text-white/50 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          {done}/{level.nodes.length} completados
        </span>
      </div>

      {/* Nodes (Vertical) */}
      <div className="relative z-10 flex flex-col items-center gap-0">
        {level.nodes.map((node, ri) => (
          <div key={node.id} className="flex flex-col items-center gap-0 w-full">
            <RouteNodeComponent node={node} palette={palette} onClick={onNodeClick} />
            {ri < level.nodes.length-1 && (
              <VerticalConnector palette={palette} locked={level.nodes[ri+1].status==='locked'} />
            )}
            {ri === level.nodes.length-1 && (
              <>
                <VerticalConnector palette={palette} locked={!level.chestUnlocked} />
                <Chest unlocked={!!level.chestUnlocked} reward={level.chestReward || undefined} palette={palette} onOpen={()=>onChestOpen(level)} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────── NODE MODAL ───────── */
function NodeModal({ node, onClose, onStart }: { node:RouteNode; onClose:()=>void; onStart:(s:string)=>void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div className="bg-[#0F0C18]/98 border border-[#D4AF37]/30 rounded-3xl p-8 max-w-md w-full shadow-[0_16px_64px_rgba(0,0,0,0.7),0_0_48px_rgba(212,175,55,0.1)]"
        onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-5">
            <span className="text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {node.icon ? <node.icon className="w-16 h-16" /> : node.emoji}
            </span>
            <div>
              <p className="text-xs text-[#8B6914]/60 tracking-[0.2em] font-bold mb-1">PARADA {node.order}</p>
              <h3 className="text-[#D4AF37] font-bold text-2xl leading-tight">{node.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B6914]/50 hover:text-[#D4AF37] text-2xl">✕</button>
        </div>
        <p className="text-[#8B7720]/70 text-base leading-relaxed mb-6">{node.description}</p>
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-6">
            <div className="text-center"><p className="text-[#D4AF37] font-bold text-2xl">{node.xp}</p><p className="text-[#8B6914]/60 text-xs">XP</p></div>
            <div className="text-center"><p className="text-2xl">{node.type==='theory'?'📖':'⚡'}</p><p className="text-[#8B6914]/60 text-xs">{node.type==='theory'?'Teoría':'Práctica'}</p></div>
          </div>
          <Stars lit={node.stars??0} />
        </div>
        {node.status==='locked' ? (
          <div className="text-center py-4 rounded-xl bg-[#0A080F] border border-[#2A2415]/50">
            <p className="text-[#555449] text-base">Completa la parada anterior</p>
          </div>
        ) : (
          <button onClick={()=>onStart(node.slug)}
            className={cn('w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]',
              node.status==='done'?'bg-[#1C1510] border-2 border-[#D4AF37] text-[#D4AF37]':'bg-[#D4AF37] text-[#0A080F] shadow-[0_6px_28px_rgba(212,175,55,0.4)]')}>
            {node.status==='done'?'Repasar parada':'Comenzar parada →'}
          </button>
        )}
      </div>
    </div>
  )
}

/* ───────── MAIN HORIZONTAL LAYOUT ───────── */
interface RouteMapProps { route:RouteData; userProgress:RouteUserProgress; onNodeStart?:(slug:string)=>void }

export function RouteMap({ route, userProgress, onNodeStart }: RouteMapProps) {
  const [selectedNode, setSelectedNode] = useState<RouteNode|null>(null)
  
  const allNodes = route.levels.flatMap(l=>l.nodes)
  if(allNodes.length === 0) return null

  // Configuration for layout
  const ROW_HEIGHT = 180
  const COLUMN_WIDTH = 250
  const HERO_WIDTH = 400
  const GAP_HERO_TO_NODES = 120
  const GAP_NODES_TO_NEXT_HERO = 250

  const maxNodesPerColumn = 4
  const containerHeight = Math.max(650, maxNodesPerColumn * ROW_HEIGHT + 100)
  const centerY = containerHeight / 2

  const svgPaths: React.ReactNode[] = []
  const renderedElements: React.ReactNode[] = []

  let currentX = 0

  console.log('Rendering RouteMap levels:', route.levels.map(l => ({ id: l.id, nodes: l.nodes.length })))

  route.levels.forEach((level, levelIndex) => {
    const heroX = currentX

    // 1. DIBUJAR HERO CARD DEL NIVEL
    renderedElements.push(
      <div key={`hero-${level.id}`} className="absolute z-10 w-[400px]" style={{ top: `${centerY}px`, left: `${heroX}px`, transform: 'translateY(-50%)' }}>
        <div 
          className="relative rounded-2xl bg-black/80 border border-[#D4AF37]/50 overflow-hidden group transition-transform hover:scale-[1.02]"
          style={{boxShadow:'0 10px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(212,175,55,0.1)'}}>
          
          <div className="h-[200px] w-full relative overflow-hidden bg-black flex items-center justify-center">
            {/* Usamos el emoji o imagen del nivel */}
            <img src="/images/node-energy.png" alt="Blackhole" className="absolute w-[150%] h-[150%] object-cover mix-blend-screen opacity-60 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" 
                 style={{filter: `hue-rotate(${levelIndex * 45}deg)`}}/>
            <span className="relative z-10 text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] opacity-80">{level.emoji}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="p-6 relative z-10 border-t border-[#D4AF37]/20">
            <p className="text-[#D4AF37] font-bold text-[10px] tracking-[0.2em] uppercase mb-2">SECCIÓN {levelIndex+1} • NIVEL {level.id}</p>
            <h2 className="text-3xl font-serif font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{level.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {level.nodes.length > 0 
                ? `Domina los ${level.nodes.length} módulos de este nivel para desbloquear los secretos del cosmos.`
                : 'Módulos en desarrollo. Pronto descubrirás nuevos secretos en esta región.'}
            </p>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-xs font-bold text-[#D4AF37]">
                {level.nodes.length > 0 ? `${level.nodes.filter(n=>n.status==='done').length} / ${level.nodes.length} completados` : 'Próximamente'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )

    // 2. CALCULAR COLUMNAS DE NODOS
    let trunkEndX = heroX + HERO_WIDTH

    if (level.nodes.length > 0) {
      const colsCount = Math.ceil(level.nodes.length / maxNodesPerColumn)
      const hasChest = !!level.chestNode
      const totalSlots = colsCount + (hasChest ? 1 : 0)
      const chestSlotIndex = hasChest ? Math.ceil(colsCount / 2) : -1 // Interpuesto a la mitad

      const nodesStartX = heroX + HERO_WIDTH + GAP_HERO_TO_NODES
      
      // Conector desde el Hero Card hasta el inicio de las ramas (y a través de ellas)
      trunkEndX = nodesStartX + (totalSlots - 1) * COLUMN_WIDTH
      svgPaths.push(
        <path key={`trunk-pre-${level.id}`} d={`M ${heroX + HERO_WIDTH} ${centerY} L ${trunkEndX} ${centerY}`} stroke="#D4AF37" strokeWidth="3" strokeDasharray="5 5" fill="none" opacity="0.4" />
      )

      // 2.1 Dibujar Cofre Interpuesto en el Tronco
      if (hasChest && level.chestNode) {
        const chestX = nodesStartX + chestSlotIndex * COLUMN_WIDTH
        renderedElements.push(
          <div 
            key={level.chestNode.id} 
            className="absolute z-10 -translate-y-1/2 -translate-x-1/2"
            style={{ top: `${centerY}px`, left: `${chestX}px` }}>
            <NodeCircle node={level.chestNode} onClick={() => onNodeStart?.(level.chestNode!.slug)} />
          </div>
        )
      }

      // 2.2 Dibujar Nodos (Arcos Verticales)
      for (let c = 0; c < colsCount; c++) {
        // Shift column slot if it's after the chest
        const slotIndex = (hasChest && c >= chestSlotIndex) ? c + 1 : c
        const colNodes = level.nodes.slice(c * maxNodesPerColumn, (c + 1) * maxNodesPerColumn)
        const colX = nodesStartX + slotIndex * COLUMN_WIDTH
        const branchStartX = colX - 60 // Donde se curva la rama desde el tronco principal

        colNodes.forEach((node, r) => {
          const nodeY = centerY + (r - (colNodes.length - 1) / 2) * ROW_HEIGHT

          // Draw SVG branch
          if (nodeY === centerY) {
            svgPaths.push(
              <path key={`path-${node.id}`} d={`M ${branchStartX} ${centerY} L ${colX} ${centerY}`} stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
            )
          } else {
            const radius = 15
            const isUp = nodeY < centerY
            svgPaths.push(
              <path key={`path-${node.id}`} 
                d={`M ${branchStartX} ${centerY} L ${branchStartX} ${isUp ? nodeY + radius : nodeY - radius} Q ${branchStartX} ${nodeY} ${branchStartX + radius} ${nodeY} L ${colX} ${nodeY}`} 
                stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
            )
          }

          // Render Node
          renderedElements.push(
            <div 
              key={node.id} 
              className="absolute z-10 -translate-y-1/2 -translate-x-1/2"
              style={{ top: `${nodeY}px`, left: `${colX}px` }}>
              <NodeCircle node={node} onClick={() => onNodeStart?.(node.slug)} />
            </div>
          )
        })
      }
    }

    // Si hay un nivel siguiente, conectamos el trunk hacia su Hero Card
    if (levelIndex < route.levels.length - 1) {
      const nextHeroX = trunkEndX + GAP_NODES_TO_NEXT_HERO
      svgPaths.push(
        <path key={`trunk-post-${level.id}`} d={`M ${trunkEndX} ${centerY} L ${nextHeroX} ${centerY}`} stroke="#D4AF37" strokeWidth="3" strokeDasharray="5 5" fill="none" opacity="0.4" />
      )
    }

    // Avanzar cursor X para el próximo nivel
    currentX = trunkEndX + GAP_NODES_TO_NEXT_HERO
  })

  // Width total del container
  const containerWidth = currentX + 100 // padding final

  return (
    <div className="relative flex items-center shrink-0 -ml-8" style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
      {/* SVGs para las líneas conectoras */}
      <svg className="absolute inset-0 pointer-events-none z-0" style={{ width: '100%', height: '100%', filter:'drop-shadow(0 0 8px rgba(212,175,55,0.8))' }}>
        {svgPaths}
      </svg>

      {/* ALL LEVELS HERO CARDS & NODES */}
      {renderedElements}

      {/* NODE MODAL */}
      {selectedNode && <NodeModal node={selectedNode} onClose={()=>setSelectedNode(null)} onStart={(s)=>{setSelectedNode(null);onNodeStart?.(s)}} />}
    </div>
  )
}
