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

/* ───────── PALETTE ───────── */
const P = {
  gold:   { accent:'#D4AF37', accent2:'#EFD75F', accent3:'#B8860B', bg:'#1C1510', border:'#2A2415', glow:'rgba(212,175,55,0.25)' },
  purple: { accent:'#A78BFA', accent2:'#C4B5FD', accent3:'#7C3AED', bg:'#1C1A28', border:'#2A2045', glow:'rgba(167,139,250,0.25)' },
  teal:   { accent:'#2DD4BF', accent2:'#5EEAD4', accent3:'#0D9488', bg:'#0A1E18', border:'#0A2020', glow:'rgba(45,212,191,0.25)' },
  red:    { accent:'#F87171', accent2:'#FCA5A5', accent3:'#DC2626', bg:'#1E0F0F', border:'#2A1010', glow:'rgba(248,113,113,0.25)' },
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
    <span key={i} className={cn('text-sm transition-all duration-300', i<lit?'opacity-100 scale-110':'opacity-15')}
      style={{color:'#D4AF37', filter:i<lit?'drop-shadow(0 0 4px #D4AF37)':'none'}}>★</span>
  ))}</div>)
}

/* ───────── NODE CIRCLE ───────── */
function NodeCircle({ node, palette, onClick }: { node:RouteNode; palette:typeof P['gold']; onClick:()=>void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-[120px] h-[120px] rounded-full flex items-center justify-center text-4xl',
        'transition-all duration-300 cursor-pointer border-[3px]',
        'hover:scale-110 hover:-translate-y-1',
        node.status==='done'   && `bg-[${palette.bg}] border-[${palette.accent}]`,
        node.status==='active' && `bg-[${palette.bg}] border-[${palette.accent2}]`,
        node.status==='locked' && `bg-[#131012] border-[${palette.border}] opacity-35`,
      )}
      style={{
        background: node.status==='done'
          ? `radial-gradient(circle at 35% 30%, ${palette.accent}20 0%, ${palette.bg} 60%, #0A080F 100%)`
          : node.status==='active'
          ? `radial-gradient(circle at 35% 30%, ${palette.accent2}30 0%, ${palette.bg} 55%, #0A080F 100%)`
          : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.02) 0%, #131012 60%, #0A080F 100%)`,
        borderColor: node.status==='done' ? palette.accent : node.status==='active' ? palette.accent2 : palette.border,
        boxShadow: node.status==='done'
          ? `0 8px 32px rgba(0,0,0,0.5), 0 0 32px ${palette.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`
          : node.status==='active'
          ? `0 8px 32px rgba(0,0,0,0.5), 0 0 48px ${palette.glow}, 0 0 80px ${palette.accent}20, inset 0 1px 0 rgba(255,255,255,0.04)`
          : `0 4px 16px rgba(0,0,0,0.4)`,
      }}
      aria-label={`${node.title} — ${node.status}`}
    >
      {/* Glass specular highlight */}
      <div className="absolute top-3 left-3 w-6 h-4 rounded-full opacity-[0.06]"
        style={{background:'linear-gradient(135deg, white, transparent)'}} />
      {/* Shadow floor */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-[25%] rounded-full"
        style={{background:'rgba(0,0,0,0.4)', filter:'blur(8px)'}} />
      <span className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
        {node.icon ? <node.icon className="w-12 h-12" /> : node.emoji}
      </span>

      {node.status==='active' && (
        <span className="absolute -top-3 -right-3 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse"
          style={{background:palette.accent2, color:'#0A080F', boxShadow:`0 2px 12px ${palette.glow}`}}>
          +{node.xp} XP
        </span>
      )}
      {node.status==='done' && (
        <span className="absolute -top-2 -right-2 w-[28px] h-[28px] rounded-full flex items-center justify-center text-sm font-bold"
          style={{background:`linear-gradient(135deg, ${palette.accent2}, ${palette.accent})`, color:'#0A080F', boxShadow:`0 3px 12px ${palette.glow}`}}>
          ✓
        </span>
      )}
      {/* Active pulse rings */}
      {node.status==='active' && (
        <>
          <div className="absolute -inset-3 rounded-full border-2 pointer-events-none animate-ping opacity-30"
            style={{borderColor:palette.accent2, animationDuration:'2s'}} />
          <div className="absolute -inset-4 rounded-full border pointer-events-none animate-pulse opacity-15"
            style={{borderColor:palette.accent2}} />
        </>
      )}
    </button>
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
      <span className={cn('text-sm font-bold text-center max-w-[120px] leading-tight',
        node.status==='done'&&'text-[#D4AF37]',
        node.status==='active'&&'text-[#EFD75F]',
        node.status==='locked'&&'text-[#3D3A35]',
      )}>{node.title}</span>
      <Stars lit={node.stars??0} />
      <Tooltip title={`${node.order}. ${node.title}`} desc={node.description} />
    </div>
  )
}

/* ───────── CONNECTORS ───────── */
function HorizontalConnector({ palette }: { palette:typeof P['gold'] }) {
  return (
    <div className="flex items-center gap-1 mx-1">
      <div className="h-[2px] w-24 rounded-full opacity-50"
        style={{background:`linear-gradient(90deg, ${palette.accent3}, ${palette.accent})`}} />
      <div className="w-1.5 h-1.5 rounded-full"
        style={{background:palette.accent, boxShadow:`0 0 6px ${palette.accent}`}} />
    </div>
  )
}

function VerticalConnector({ palette, locked=false }: { palette:typeof P['gold']; locked?:boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-[2px] h-12 rounded-full"
        style={{background:`linear-gradient(180deg, ${palette.accent3}, ${palette.accent})`, opacity:locked?0.15:0.5}} />
      <div className="w-1.5 h-1.5 rounded-full"
        style={{background:palette.accent, boxShadow:`0 0 6px ${palette.accent}`, opacity:locked?0.3:0.8}} />
    </div>
  )
}

/* ───────── CHEST ───────── */
function Chest({ unlocked, reward, palette, onOpen }: {
  unlocked:boolean; reward?:ChestReward; palette:typeof P['gold']; onOpen:()=>void
}) {
  const [showPreview, setShowPreview] = useState(false)
  return (
    <div className="relative flex flex-col items-center gap-1">
      <button
        onClick={()=>{if(unlocked){setShowPreview(v=>!v);onOpen()}}}
        disabled={!unlocked}
        className={cn(
          'relative w-24 h-16 rounded-xl flex flex-col items-center justify-center gap-1',
          'border-2 transition-all duration-200',
          unlocked
            ? 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            : 'opacity-30 cursor-not-allowed'
        )}
        style={{
          background: unlocked ? `linear-gradient(180deg, ${palette.bg}F0, #0A080F)` : '#0F0C18',
          borderColor: unlocked ? palette.accent : palette.border,
          boxShadow: unlocked ? `0 6px 20px rgba(0,0,0,0.5), 0 0 24px ${palette.glow}` : 'none',
        }}
        aria-label={unlocked?`Cofre: ${reward?.name}`:'Cofre bloqueado'}
      >
        <span className="text-3xl">{unlocked?'🎁':'🔒'}</span>
        <span className="text-[10px] font-bold tracking-widest uppercase"
          style={{color:unlocked?palette.accent:'#3D3A35'}}>
          {unlocked?'Abrir':'Sellado'}
        </span>
        {unlocked && (
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-bounce"
            style={{background:palette.accent, color:'#0A080F'}}>!</span>
        )}
      </button>

      {/* Reward popup */}
      {showPreview && unlocked && reward && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[280px] rounded-2xl p-5 z-30
          bg-[#0F0C18]/98 backdrop-blur-xl border border-[#D4AF37]/40
          shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_40px_rgba(212,175,55,0.15)]
          animate-in zoom-in-95 fade-in duration-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#1C1810] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={reward.image} alt="" className="w-12 h-12 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B6914]/70 mb-1">Recompensa</p>
              <p className="text-sm font-bold text-[#D4AF37] leading-tight">{reward.name}</p>
              <p className="text-xs text-[#8B6914]/60 mt-2 leading-relaxed">{reward.description}</p>
            </div>
            <button onClick={e=>{e.stopPropagation();setShowPreview(false)}}
              className="text-[#8B6914] hover:text-[#D4AF37] text-xl shrink-0">✕</button>
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
  const rows:RouteNode[][] = []
  for(let i=0;i<level.nodes.length;i+=2) rows.push(level.nodes.slice(i,i+2))
  const done = level.nodes.filter(n=>n.status==='done').length

  return (
    <div className="relative rounded-3xl border p-6 pb-7 overflow-hidden"
      style={{background:`linear-gradient(175deg, ${palette.bg}F5 0%, ${palette.bg}98 50%, rgba(0,0,0,0.4) 100%)`, borderColor:`${palette.accent}18`}}>
      <ConstellationParticles accent={palette.accent} count={30} />

      {/* Level header pill */}
      <div className="relative z-10 flex justify-center mb-1">
        <div className="absolute -top-[18px] px-5 py-1.5 rounded-full border text-xs font-bold tracking-[0.2em] whitespace-nowrap"
          style={{background:`linear-gradient(180deg, ${palette.bg}F0, rgba(0,0,0,0.8))`, borderColor:`${palette.accent}30`, color:palette.accent2,
            boxShadow:`0 4px 16px rgba(0,0,0,0.4), 0 0 20px ${palette.glow}`}}>
          {level.emoji} NIVEL {level.id} — {level.title.toUpperCase()}
        </div>
      </div>

      {/* Row counter */}
      <div className="relative z-10 flex justify-center mb-4 mt-3">
        <span className="text-[11px] font-mono tracking-[0.12em] opacity-25" style={{color:palette.accent2}}>
          {done}/{level.nodes.length}
        </span>
      </div>

      {/* Nodes */}
      <div className="relative z-10 flex flex-col items-center gap-0">
        {rows.map((pair, ri) => (
          <div key={ri} className="flex flex-col items-center gap-0">
            <div className="flex items-center gap-0">
              <RouteNodeComponent node={pair[0]} palette={palette} onClick={onNodeClick} />
              {pair[1] && (
                <>
                  <HorizontalConnector palette={palette} />
                  <RouteNodeComponent node={pair[1]} palette={palette} onClick={onNodeClick} />
                </>
              )}
            </div>
            {ri < rows.length-1 && (
              <>
                <VerticalConnector palette={palette} />
                <Chest unlocked={level.chestUnlocked} reward={level.chestReward} palette={palette} onOpen={()=>onChestOpen(level)} />
                <VerticalConnector palette={palette} />
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

/* ───────── MAIN ───────── */
interface RouteMapProps { route:RouteData; userProgress:RouteUserProgress; onNodeStart?:(slug:string)=>void }

export function RouteMap({ route, userProgress, onNodeStart }: RouteMapProps) {
  const [selectedNode, setSelectedNode] = useState<RouteNode|null>(null)
  const [openedChest, setOpenedChest] = useState<string|null>(null)
  const totalNodes = route.levels.reduce((s,l)=>s+l.nodes.length,0)

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        {route.levels.map((level, i) => (
          <div key={level.id} className="flex flex-col items-center gap-0">
            <LevelBand level={level} onNodeClick={setSelectedNode} onChestOpen={(lvl) => setOpenedChest(lvl.id.toString())} />
            {i < route.levels.length-1 && (
              <div className="w-[2px] h-12 rounded-full opacity-20"
                style={{background:`linear-gradient(180deg, ${P[route.levels[i+1].colorClass].accent3}, ${P[route.levels[i+1].colorClass].accent})`}} />
            )}
          </div>
        ))}

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-6 py-4 rounded-2xl border"
          style={{background:'linear-gradient(180deg, rgba(22,20,15,0.9), rgba(10,8,15,0.95))', borderColor:'#2A2415'}}>
          <div>
            <p className="text-xs text-[#8B6914]/50 tracking-[0.2em] font-bold uppercase">{userProgress.levelName}</p>
            <p className="text-[#D4AF37] font-bold text-xl">{userProgress.totalXP.toLocaleString()} XP</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8B6914]/50 mb-1.5">Progreso</p>
            <div className="w-40 h-2.5 bg-[#2A2415] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all duration-700"
                style={{width:`${totalNodes>0?(userProgress.completedNodes.length/totalNodes)*100:0}%`}} />
            </div>
            <p className="text-xs text-[#8B6914]/50 mt-1.5">{userProgress.completedNodes.length}/{totalNodes}</p>
          </div>
        </div>
      </div>

      {selectedNode && <NodeModal node={selectedNode} onClose={()=>setSelectedNode(null)} onStart={(s)=>{setSelectedNode(null);onNodeStart?.(s)}} />}

      {openedChest && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0F0C18]/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-6 fade-in duration-300">
          <span className="text-3xl">🎁</span>
          <div><p className="text-[#D4AF37] font-bold text-base">¡Cofre desbloqueado!</p><p className="text-[#8B6914]/60 text-sm">Revisa tu habitación</p></div>
        </div>
      )}
    </>
  )
}
