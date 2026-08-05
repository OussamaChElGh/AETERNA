'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export type NodeStatus = 'done' | 'active' | 'locked'

export interface RouteNode {
  id: string
  order: number
  title: string
  description: string
  emoji: string
  slug: string
  xp: number
  stars?: 0 | 1 | 2 | 3
  status: NodeStatus
  type: 'theory' | 'practice'
}

export interface ChestReward {
  name: string
  image: string
  description: string
}

export interface RouteLevel {
  id: number
  title: string
  emoji: string
  colorClass: 'gold' | 'purple' | 'teal' | 'red'
  nodes: RouteNode[]
  chestUnlocked: boolean
  chestReward?: ChestReward
}

export interface RouteData {
  id: string
  title: string
  levels: RouteLevel[]
}

export interface RouteUserProgress {
  totalXP: number
  levelName: string
  completedNodes: string[]
}

const LEVEL_PALETTE = {
  gold: {
    band:        'border-[#2A2415]',
    title:       'text-[#D4AF37] border-[#2A2415] bg-[#16140F]',
    connector:   'from-[#B8860B] to-[#8B6914]',
    hConnector:  'from-[#8B6914] to-[#B8860B]',
    done:        'bg-[#1C1510] border-[#D4AF37] shadow-[0_0_0_8px_rgba(212,175,55,0.2)]',
    active:      'bg-[#2A1E08] border-[#EFD75F] shadow-[0_0_0_10px_rgba(239,215,95,0.25),0_0_28px_rgba(239,215,95,0.35)]',
    locked:      'bg-[#1A1710] border-[#2A2415] opacity-40',
    xpBadge:     'bg-[#EF9F27] text-[#412402]',
    doneCheck:   'bg-[#D4AF37] text-[#412402]',
    labelDone:   'text-[#D4AF37]',
    labelActive: 'text-[#EFD75F]',
    chest:       'border-[#D4AF37] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_24px_rgba(212,175,55,0.5)]',
  },
  purple: {
    band:        'border-[#2A2045]',
    title:       'text-[#A78BFA] border-[#2A2045] bg-[#16140F]',
    connector:   'from-[#7C3AED] to-[#5B21B6]',
    hConnector:  'from-[#5B21B6] to-[#7C3AED]',
    done:        'bg-[#1C1A28] border-[#A78BFA] shadow-[0_0_0_8px_rgba(167,139,250,0.2)]',
    active:      'bg-[#22203A] border-[#C4B5FD] shadow-[0_0_0_10px_rgba(196,181,253,0.25),0_0_28px_rgba(196,181,253,0.35)]',
    locked:      'bg-[#1A1820] border-[#2A2045] opacity-40',
    xpBadge:     'bg-[#A78BFA] text-[#26215C]',
    doneCheck:   'bg-[#A78BFA] text-[#26215C]',
    labelDone:   'text-[#A78BFA]',
    labelActive: 'text-[#C4B5FD]',
    chest:       'border-[#7C3AED] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_24px_rgba(167,139,250,0.5)]',
  },
  teal: {
    band:        'border-[#0A2020]',
    title:       'text-[#2DD4BF] border-[#0A2020] bg-[#16140F]',
    connector:   'from-[#0D9488] to-[#0F766E]',
    hConnector:  'from-[#0F766E] to-[#0D9488]',
    done:        'bg-[#0A1E18] border-[#2DD4BF] shadow-[0_0_0_8px_rgba(45,212,191,0.2)]',
    active:      'bg-[#0D2820] border-[#5EEAD4] shadow-[0_0_0_10px_rgba(94,234,212,0.25),0_0_28px_rgba(94,234,212,0.35)]',
    locked:      'bg-[#101810] border-[#0A2020] opacity-40',
    xpBadge:     'bg-[#2DD4BF] text-[#042F2E]',
    doneCheck:   'bg-[#2DD4BF] text-[#042F2E]',
    labelDone:   'text-[#2DD4BF]',
    labelActive: 'text-[#5EEAD4]',
    chest:       'border-[#0D9488] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_24px_rgba(45,212,191,0.5)]',
  },
  red: {
    band:        'border-[#2A1010]',
    title:       'text-[#F87171] border-[#2A1010] bg-[#16140F]',
    connector:   'from-[#DC2626] to-[#991B1B]',
    hConnector:  'from-[#991B1B] to-[#DC2626]',
    done:        'bg-[#1E0F0F] border-[#F87171] shadow-[0_0_0_8px_rgba(248,113,113,0.2)]',
    active:      'bg-[#2A1010] border-[#FCA5A5] shadow-[0_0_0_10px_rgba(252,165,165,0.25),0_0_28px_rgba(252,165,165,0.35)]',
    locked:      'bg-[#1A1010] border-[#2A1010] opacity-40',
    xpBadge:     'bg-[#F87171] text-[#501313]',
    doneCheck:   'bg-[#F87171] text-[#501313]',
    labelDone:   'text-[#F87171]',
    labelActive: 'text-[#FCA5A5]',
    chest:       'border-[#DC2626] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_24px_rgba(248,113,113,0.5)]',
  },
}

function Stars({ count, lit }: { count: 3; lit: number }) {
  return (
    <div className="flex gap-1 mt-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn('text-sm transition-opacity', i < lit ? 'opacity-100' : 'opacity-20')}
          style={{ color: '#D4AF37' }}
        >★</span>
      ))}
    </div>
  )
}

function Tooltip({ title, description }: { title: string; description: string }) {
  return (
    <div className={cn(
      'absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2',
      'w-[200px] rounded-xl p-3.5 z-20',
      'bg-[#1C1810] border border-[#D4AF37] border-opacity-60',
      'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
      'pointer-events-none text-left'
    )}>
      <p className="text-sm font-bold text-[#D4AF37] mb-1 leading-tight">{title}</p>
      <p className="text-xs text-[#8B6914] leading-relaxed">{description}</p>
    </div>
  )
}

function NodeCircle({
  node,
  palette,
  onClick,
}: {
  node: RouteNode
  palette: typeof LEVEL_PALETTE['gold']
  onClick: () => void
}) {
  const circleClass = cn(
    'relative w-[112px] h-[112px] rounded-full flex items-center justify-center text-4xl',
    'border-[3px] transition-all duration-200 cursor-pointer',
    'hover:scale-110',
    node.status === 'done'   && palette.done,
    node.status === 'active' && palette.active,
    node.status === 'locked' && palette.locked,
  )

  return (
    <button
      className={circleClass}
      onClick={onClick}
      aria-label={`${node.title} — ${node.status === 'locked' ? 'bloqueado' : node.status === 'done' ? 'completado' : 'en progreso'}`}
    >
      <span role="img" aria-hidden>{node.emoji}</span>

      {node.status === 'active' && (
        <span className={cn(
          'absolute -top-3 -right-3 text-xs font-bold px-2.5 py-1 rounded-full',
          'animate-pulse',
          palette.xpBadge
        )}>+{node.xp} XP</span>
      )}

      {node.status === 'done' && (
        <span className={cn(
          'absolute -top-2 -right-2 w-[26px] h-[26px] rounded-full',
          'flex items-center justify-center text-sm font-bold',
          palette.doneCheck
        )}>✓</span>
      )}
    </button>
  )
}

function RouteNodeComponent({
  node,
  palette,
  onNodeClick,
}: {
  node: RouteNode
  palette: typeof LEVEL_PALETTE['gold']
  onNodeClick: (node: RouteNode) => void
}) {
  const labelClass = cn(
    'text-sm font-bold text-center max-w-[110px] leading-snug',
    node.status === 'done'   && palette.labelDone,
    node.status === 'active' && palette.labelActive,
    node.status === 'locked' && 'text-[#444441]',
  )

  return (
    <div className="relative group flex flex-col items-center gap-2.5">
      <NodeCircle node={node} palette={palette} onClick={() => onNodeClick(node)} />
      <span className={labelClass}>{node.title}</span>
      <Stars count={3} lit={node.stars ?? 0} />
      <Tooltip title={`${node.order}. ${node.title}`} description={node.description} />
    </div>
  )
}

function HorizontalConnector({ palette }: { palette: typeof LEVEL_PALETTE['gold'] }) {
  return (
    <div className={cn(
      'h-[3px] w-20 flex-shrink-0 mx-2',
      'bg-gradient-to-r opacity-50 rounded-full',
      palette.hConnector
    )} />
  )
}

function VerticalConnector({ palette, locked = false }: { palette: typeof LEVEL_PALETTE['gold']; locked?: boolean }) {
  return (
    <div className={cn(
      'w-[3px] h-12 bg-gradient-to-b flex-shrink-0 rounded-full',
      locked ? 'opacity-15' : 'opacity-60',
      palette.connector
    )} />
  )
}

function Chest({
  unlocked,
  reward,
  palette,
  onOpen,
}: {
  unlocked: boolean
  reward?: ChestReward
  palette: typeof LEVEL_PALETTE['gold']
  onOpen: () => void
}) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => { if (unlocked) { setShowPreview(v => !v); onOpen() } }}
        disabled={!unlocked}
        className={cn(
          'relative group w-24 h-16 rounded-xl flex flex-col items-center justify-center gap-1.5',
          'border-2 transition-all duration-200',
          unlocked
            ? cn(palette.chest, palette.chestGlow, 'hover:scale-110 cursor-pointer')
            : 'bg-[#16140F] border-[#2A2415] opacity-35 cursor-not-allowed'
        )}
        aria-label={unlocked ? `Cofre: ${reward?.name}` : 'Cofre bloqueado'}
      >
        <span className="text-3xl leading-none" role="img" aria-hidden>
          {unlocked ? '🎁' : '🔒'}
        </span>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: unlocked ? '#D4AF37' : '#3D3A30' }}>
          {unlocked ? 'Abrir' : 'Sellado'}
        </span>

        {unlocked && (
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#D4AF37] text-[#16140F] text-xs font-bold flex items-center justify-center animate-bounce">
            !
          </span>
        )}
      </button>

      {showPreview && unlocked && reward && (
        <div className={cn(
          'absolute left-1/2 -translate-x-1/2 bottom-full mb-3',
          'w-[260px] rounded-2xl p-5 z-30',
          'bg-[#1C1810] border border-[#D4AF37] border-opacity-70',
          'shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_32px_rgba(212,175,55,0.25)]',
          'animate-in zoom-in-95 fade-in duration-200'
        )}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#2A2415] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={reward.image} alt={reward.name} className="w-12 h-12 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B6914] mb-1">Recompensa</p>
              <p className="text-sm font-bold text-[#D4AF37] leading-tight">{reward.name}</p>
              <p className="text-xs text-[#8B6914] mt-2 leading-relaxed">{reward.description}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowPreview(false) }}
              className="text-[#8B6914] hover:text-[#D4AF37] text-base shrink-0"
            >✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

function LevelBand({
  level,
  onNodeClick,
  onChestOpen,
}: {
  level: RouteLevel
  onNodeClick: (node: RouteNode) => void
  onChestOpen: (level: RouteLevel) => void
}) {
  const palette = LEVEL_PALETTE[level.colorClass]
  const nodeRows: RouteNode[][] = []

  for (let i = 0; i < level.nodes.length; i += 2) {
    nodeRows.push(level.nodes.slice(i, i + 2))
  }

  const completedInLevel = level.nodes.filter(n => n.status === 'done').length

  return (
    <div className={cn(
      'relative rounded-3xl border p-6 pb-7',
      'bg-[#16140F]',
      palette.band
    )}>
      <div className={cn(
        'absolute -top-[16px] left-1/2 -translate-x-1/2',
        'px-5 py-1.5 rounded-full border text-xs font-bold tracking-[0.2em]',
        'whitespace-nowrap',
        palette.title
      )}>
        {level.emoji} NIVEL {level.id} — {level.title.toUpperCase()}
      </div>

      <div className="flex flex-col items-center gap-0 pt-4">
        {nodeRows.map((pair, rowIdx) => (
          <div key={rowIdx} className="flex flex-col items-center gap-0">
            <div className="flex items-center gap-0">
              <RouteNodeComponent node={pair[0]} palette={palette} onNodeClick={onNodeClick} />
              {pair[1] && (
                <>
                  <HorizontalConnector palette={palette} />
                  <RouteNodeComponent node={pair[1]} palette={palette} onNodeClick={onNodeClick} />
                </>
              )}
            </div>

            {rowIdx < nodeRows.length - 1 && (
              <>
                <VerticalConnector palette={palette} />
                <Chest
                  unlocked={level.chestUnlocked}
                  reward={level.chestReward}
                  palette={palette}
                  onOpen={() => onChestOpen(level)}
                />
                <VerticalConnector palette={palette} />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <span className="text-[11px] font-mono tracking-[0.15em] opacity-30" style={{ color: palette.labelActive }}>
          {completedInLevel}/{level.nodes.length} completados
        </span>
      </div>
    </div>
  )
}

function NodeModal({
  node,
  onClose,
  onStart,
}: {
  node: RouteNode
  onClose: () => void
  onStart: (slug: string) => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1C1810] border border-[#D4AF37] border-opacity-60 rounded-3xl p-8 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-5">
            <span className="text-6xl">{node.emoji}</span>
            <div>
              <p className="text-xs text-[#8B6914] tracking-[0.2em] font-bold mb-1">PARADA {node.order}</p>
              <h3 className="text-[#D4AF37] font-bold text-2xl leading-tight">{node.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B6914] hover:text-[#D4AF37] transition-colors text-2xl leading-none"
            aria-label="Cerrar"
          >✕</button>
        </div>

        <p className="text-[#8B7720] text-base leading-relaxed mb-6">{node.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-[#D4AF37] font-bold text-2xl">{node.xp}</p>
              <p className="text-[#8B6914] text-xs">XP máx.</p>
            </div>
            <div className="text-center">
              <p className="text-[#D4AF37] font-bold text-2xl">{node.type === 'theory' ? '📖' : '⚡'}</p>
              <p className="text-[#8B6914] text-xs">{node.type === 'theory' ? 'Teoría' : 'Práctica'}</p>
            </div>
          </div>
          <Stars count={3} lit={node.stars ?? 0} />
        </div>

        {node.status === 'locked' ? (
          <div className="text-center py-4 rounded-xl bg-[#16140F] border border-[#2A2415]">
            <p className="text-[#555449] text-base">Completa la parada anterior</p>
          </div>
        ) : (
          <button
            onClick={() => onStart(node.slug)}
            className={cn(
              'w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200',
              'hover:scale-[1.02] active:scale-[0.98]',
              node.status === 'done'
                ? 'bg-[#1C1510] border-2 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#D4AF37] text-[#16140F] shadow-[0_6px_28px_rgba(212,175,55,0.4)]'
            )}
          >
            {node.status === 'done' ? 'Repasar parada' : 'Comenzar parada →'}
          </button>
        )}
      </div>
    </div>
  )
}

interface RouteMapProps {
  route: RouteData
  userProgress: RouteUserProgress
  onNodeStart?: (slug: string) => void
}

export function RouteMap({ route, userProgress, onNodeStart }: RouteMapProps) {
  const [selectedNode, setSelectedNode] = useState<RouteNode | null>(null)
  const [openedChest, setOpenedChest] = useState<string | null>(null)

  const handleNodeClick = (node: RouteNode) => setSelectedNode(node)

  const handleChestOpen = (level: RouteLevel) => {
    if (level.chestUnlocked && openedChest !== level.id.toString()) {
      setOpenedChest(level.id.toString())
    }
  }

  const handleNodeStart = (slug: string) => {
    setSelectedNode(null)
    onNodeStart?.(slug)
  }

  const totalNodes = route.levels.reduce((s, l) => s + l.nodes.length, 0)

  return (
    <>
      <div className="w-full max-w-2xl px-4 py-6 flex flex-col gap-5">

        {route.levels.map((level, levelIdx) => (
          <div key={level.id} className="flex flex-col items-center gap-0">
            <LevelBand level={level} onNodeClick={handleNodeClick} onChestOpen={handleChestOpen} />
            {levelIdx < route.levels.length - 1 && (
              <div className={cn(
                'w-[3px] h-12 bg-gradient-to-b opacity-30 rounded-full',
                LEVEL_PALETTE[route.levels[levelIdx + 1].colorClass].connector
              )} />
            )}
          </div>
        ))}

        <div className={cn(
          'flex items-center justify-between mt-4 px-6 py-5 rounded-2xl',
          'bg-[#16140F] border border-[#2A2415]'
        )}>
          <div>
            <p className="text-xs text-[#8B6914] tracking-[0.2em] font-bold mb-1 uppercase">{userProgress.levelName}</p>
            <p className="text-[#D4AF37] font-bold text-xl">{userProgress.totalXP.toLocaleString()} XP</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8B6914] mb-2">Progreso global</p>
            <div className="w-40 h-2.5 bg-[#2A2415] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, totalNodes > 0 ? (userProgress.completedNodes.length / totalNodes) * 100 : 0)}%` }}
              />
            </div>
            <p className="text-xs text-[#8B6914] mt-1.5">{userProgress.completedNodes.length} / {totalNodes} paradas</p>
          </div>
        </div>
      </div>

      {selectedNode && <NodeModal node={selectedNode} onClose={() => setSelectedNode(null)} onStart={handleNodeStart} />}

      {openedChest && (
        <div className={cn(
          'fixed bottom-8 left-1/2 -translate-x-1/2 z-50',
          'bg-[#1C1810] border border-[#D4AF37] rounded-2xl px-6 py-4',
          'flex items-center gap-4 shadow-2xl',
          'animate-in slide-in-from-bottom-6 fade-in duration-300'
        )}>
          <span className="text-3xl">🎁</span>
          <div>
            <p className="text-[#D4AF37] font-bold text-base">¡Cofre desbloqueado!</p>
            <p className="text-[#8B6914] text-sm">Revisa tu habitación</p>
          </div>
        </div>
      )}
    </>
  )
}
