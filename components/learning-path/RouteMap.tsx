'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export type NodeStatus = 'done' | 'active' | 'locked'

export interface RouteNode {
  id: string; order: number; title: string; description: string
  emoji: string; slug: string; xp: number; stars?: 0 | 1 | 2 | 3
  status: NodeStatus; type: 'theory' | 'practice'
  icon?: React.ComponentType<{ className?: string }>
}

export interface ChestReward {
  name: string; image: string; description: string
}

export interface RouteLevel {
  id: number; title: string; emoji: string
  colorClass: 'gold' | 'purple' | 'teal' | 'red'
  nodes: RouteNode[]; chestUnlocked: boolean; chestReward?: ChestReward
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
    size: 1 + Math.random() * 2.5, delay: Math.random() * 4,
    duration: 2 + Math.random() * 3, opacity: 0.15 + Math.random() * 0.35,
  }))).current
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full animate-pulse"
          style={{
            left:`${p.x}%`, top:`${p.y}%`, width:`${p.size}px`, height:`${p.size}px`,
            background:accent, opacity:p.opacity,
            animationDuration:`${p.duration}s`, animationDelay:`${p.delay}s`,
            boxShadow:`0 0 ${p.size*3}px ${accent}40`,
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
function NodeCircle({ node, palette, onClick }: { node:RouteNode; palette:typeof P['gold']; onClick:()=>void }) {
  const isDone = node.status==='done'
  const isActive = node.status==='active'
  const isLocked = node.status==='locked'

  return (
    <div className="flex flex-col items-center group">
      <button 
        onClick={onClick} 
        disabled={isLocked} 
        className={cn(
          "relative w-[110px] h-[110px] rounded-full flex items-center justify-center transition-all duration-300",
          isLocked ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]'
        )}
        style={{
          background: 'rgba(0,0,0,0.7)',
          border: '4px solid #D4AF37',
          boxShadow: isLocked ? 'none' : '0 0 15px rgba(212,175,55,0.4), inset 0 0 15px rgba(212,175,55,0.4)'
        }}
      >
        <div className="absolute inset-2 rounded-full border border-[#D4AF37]/30" />
        
        {/* Content over the ring */}
        <div className="relative z-20 flex flex-col items-center justify-center">
          {node.icon ? (
            <node.icon className="w-10 h-10 text-[#D4AF37]" style={{filter: 'drop-shadow(0 2px 5px rgba(0,0,0,1))'}} />
          ) : (
            <span className="text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{node.emoji}</span>
          )}
        </div>

        {isActive && (
          <span className="absolute -top-1 -right-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full z-30 animate-pulse border border-[#3E2723]"
            style={{background:'#D4AF37', color:'#050505', boxShadow:`0 2px 12px rgba(212,175,55,0.8)`}}>
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
      <NodeCircle node={node} palette={palette} onClick={()=>onClick(node)} />
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
  const palette = P[level.colorClass]
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
                <Chest unlocked={level.chestUnlocked} reward={level.chestReward} palette={palette} onOpen={()=>onChestOpen(level)} />
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

  const heroNode = allNodes[0]
  const branchNodes = allNodes.slice(1, 5) // Take next 4 nodes for the tree

  // Hardcoded positions for the first 4 branch nodes to match the image exactly
  const nodePositions = [
    { top: '15%', left: '550px' }, // Top branch
    { top: '50%', left: '550px' }, // Middle branch
    { top: '85%', left: '550px' }, // Bottom branch
    { top: '50%', left: '750px' }, // Next middle branch
  ]

  return (
    <div className="relative w-full h-[600px] flex items-center -ml-8">
      {/* SVGs para las líneas conectoras */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{filter:'drop-shadow(0 0 5px rgba(212,175,55,0.5))'}}>
        {/* Línea horizontal principal desde Hero hasta el medio */}
        <path d="M 400 300 L 550 300" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
        {/* Bifurcación superior */}
        <path d="M 450 300 L 450 90 L 550 90" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
        {/* Bifurcación inferior */}
        <path d="M 450 300 L 450 510 L 550 510" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
        {/* Conector al nodo final */}
        <path d="M 600 300 L 750 300" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
      </svg>

      {/* HERO CARD (Left) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 w-[400px]">
        <div 
          onClick={() => setSelectedNode(heroNode)}
          className="relative rounded-2xl bg-black/80 border border-[#D4AF37]/50 overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02]"
          style={{boxShadow:'0 10px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(212,175,55,0.1)'}}>
          
          <div className="h-[200px] w-full relative overflow-hidden bg-black flex items-center justify-center">
            {/* Agujero Negro usando mix-blend y una imagen rotada */}
            <img src="/images/node-energy.png" alt="Blackhole" className="absolute w-[150%] h-[150%] object-cover mix-blend-screen opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="p-6 relative z-10 border-t border-[#D4AF37]/20">
            <p className="text-[#D4AF37] font-bold text-[10px] tracking-[0.2em] uppercase mb-2">Sección 1 • Nivel 1</p>
            <h2 className="text-3xl font-serif font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{heroNode.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{heroNode.description}</p>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-xs font-bold text-[#D4AF37]">
                +{heroNode.xp} XP
              </span>
              <Stars lit={heroNode.stars??0} />
            </div>
          </div>
        </div>
      </div>

      {/* BRANCH NODES (Right) */}
      {branchNodes.map((node, i) => (
        <div 
          key={node.id} 
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ top: nodePositions[i].top, left: nodePositions[i].left }}>
          <NodeCircle node={node} palette={P['gold']} onClick={() => setSelectedNode(node)} />
        </div>
      ))}

      {/* NODE MODAL */}
      {selectedNode && <NodeModal node={selectedNode} onClose={()=>setSelectedNode(null)} onStart={(s)=>{setSelectedNode(null);onNodeStart?.(s)}} />}
    </div>
  )
}
