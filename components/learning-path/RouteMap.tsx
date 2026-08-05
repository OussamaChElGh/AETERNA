'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────

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

export interface RouteLevel {
  id: number
  title: string
  emoji: string
  colorClass: 'gold' | 'purple' | 'teal' | 'red'
  nodes: RouteNode[]
  chestUnlocked: boolean
  chestReward?: string
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

// ─────────────────────────────────────────
// PALETA POR NIVEL
// ─────────────────────────────────────────

const LEVEL_PALETTE = {
  gold: {
    band:        'border-[#2A2415]',
    title:       'text-[#8B6914] border-[#2A2415] bg-[#16140F]',
    connector:   'from-[#B8860B] to-[#8B6914]',
    hConnector:  'from-[#8B6914] to-[#B8860B]',
    done:        'bg-[#1C1510] border-[#D4AF37] shadow-[0_0_0_4px_rgba(212,175,55,0.15)]',
    active:      'bg-[#2A1E08] border-[#EF9F27] shadow-[0_0_0_6px_rgba(239,159,39,0.2),0_0_16px_rgba(239,159,39,0.3)]',
    locked:      'bg-[#1A1710] border-[#2A2415] opacity-40',
    xpBadge:     'bg-[#EF9F27] text-[#412402]',
    doneCheck:   'bg-[#D4AF37] text-[#412402]',
    labelDone:   'text-[#B8860B]',
    labelActive: 'text-[#EF9F27]',
    chest:       'border-[#D4AF37] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_12px_rgba(212,175,55,0.3)]',
  },
  purple: {
    band:        'border-[#2A2045]',
    title:       'text-[#7F77DD] border-[#2A2045] bg-[#16140F]',
    connector:   'from-[#534AB7] to-[#3C3489]',
    hConnector:  'from-[#3C3489] to-[#534AB7]',
    done:        'bg-[#1C1A28] border-[#7F77DD] shadow-[0_0_0_4px_rgba(127,119,221,0.15)]',
    active:      'bg-[#22203A] border-[#AFA9EC] shadow-[0_0_0_6px_rgba(175,169,236,0.2),0_0_16px_rgba(175,169,236,0.3)]',
    locked:      'bg-[#1A1820] border-[#2A2045] opacity-40',
    xpBadge:     'bg-[#7F77DD] text-[#26215C]',
    doneCheck:   'bg-[#7F77DD] text-[#26215C]',
    labelDone:   'text-[#7F77DD]',
    labelActive: 'text-[#AFA9EC]',
    chest:       'border-[#534AB7] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_12px_rgba(127,119,221,0.3)]',
  },
  teal: {
    band:        'border-[#0A2020]',
    title:       'text-[#1D9E75] border-[#0A2020] bg-[#16140F]',
    connector:   'from-[#0F6E56] to-[#085041]',
    hConnector:  'from-[#085041] to-[#0F6E56]',
    done:        'bg-[#0A1E18] border-[#1D9E75] shadow-[0_0_0_4px_rgba(29,158,117,0.15)]',
    active:      'bg-[#0D2820] border-[#5DCAA5] shadow-[0_0_0_6px_rgba(93,202,165,0.2),0_0_16px_rgba(93,202,165,0.3)]',
    locked:      'bg-[#101810] border-[#0A2020] opacity-40',
    xpBadge:     'bg-[#1D9E75] text-[#04342C]',
    doneCheck:   'bg-[#1D9E75] text-[#04342C]',
    labelDone:   'text-[#1D9E75]',
    labelActive: 'text-[#5DCAA5]',
    chest:       'border-[#1D9E75] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_12px_rgba(29,158,117,0.3)]',
  },
  red: {
    band:        'border-[#2A1010]',
    title:       'text-[#E24B4A] border-[#2A1010] bg-[#16140F]',
    connector:   'from-[#A32D2D] to-[#791F1F]',
    hConnector:  'from-[#791F1F] to-[#A32D2D]',
    done:        'bg-[#1E0F0F] border-[#E24B4A] shadow-[0_0_0_4px_rgba(226,75,74,0.15)]',
    active:      'bg-[#2A1010] border-[#F09595] shadow-[0_0_0_6px_rgba(240,149,149,0.2),0_0_16px_rgba(240,149,149,0.3)]',
    locked:      'bg-[#1A1010] border-[#2A1010] opacity-40',
    xpBadge:     'bg-[#E24B4A] text-[#501313]',
    doneCheck:   'bg-[#E24B4A] text-[#501313]',
    labelDone:   'text-[#E24B4A]',
    labelActive: 'text-[#F09595]',
    chest:       'border-[#E24B4A] bg-[#16140F]',
    chestGlow:   'hover:shadow-[0_0_12px_rgba(226,75,74,0.3)]',
  },
}

// ─────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────

function Stars({ count, lit }: { count: 3; lit: number }) {
  return (
    <div className="flex gap-0.5 mt-1">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn('text-[9px] transition-opacity', i < lit ? 'opacity-100' : 'opacity-20')}
          style={{ color: '#D4AF37' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function Tooltip({ title, description }: { title: string; description: string }) {
  return (
    <div className={cn(
      'absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
      'w-[148px] rounded-lg p-2.5 z-20',
      'bg-[#1C1810] border border-[#D4AF37] border-opacity-60',
      'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
      'pointer-events-none text-left'
    )}>
      <p className="text-[11px] font-semibold text-[#D4AF37] mb-1 leading-tight">{title}</p>
      <p className="text-[10px] text-[#8B6914] leading-relaxed">{description}</p>
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
    'relative w-16 h-16 rounded-full flex items-center justify-center text-2xl',
    'border-2 transition-all duration-150 cursor-pointer',
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
          'absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full',
          palette.xpBadge
        )}>
          +{node.xp} XP
        </span>
      )}

      {node.status === 'done' && (
        <span className={cn(
          'absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full',
          'flex items-center justify-center text-[10px] font-bold',
          palette.doneCheck
        )}>
          ✓
        </span>
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
    'text-[10px] font-medium text-center max-w-[72px] leading-snug',
    node.status === 'done'   && palette.labelDone,
    node.status === 'active' && cn(palette.labelActive, 'font-semibold'),
    node.status === 'locked' && 'text-[#444441]',
  )

  return (
    <div className="relative group flex flex-col items-center gap-1.5">
      <NodeCircle node={node} palette={palette} onClick={() => onNodeClick(node)} />
      <span className={labelClass}>{node.title}</span>
      <Stars count={3} lit={node.stars ?? 0} />
      <Tooltip title={`${node.order} ${node.title}`} description={node.description} />
    </div>
  )
}

function HorizontalConnector({ palette }: { palette: typeof LEVEL_PALETTE['gold'] }) {
  return (
    <div className={cn(
      'h-0.5 w-12 flex-shrink-0',
      'bg-gradient-to-r opacity-40',
      palette.hConnector
    )} />
  )
}

function VerticalConnector({ palette, locked = false }: { palette: typeof LEVEL_PALETTE['gold']; locked?: boolean }) {
  return (
    <div className={cn(
      'w-0.5 h-8 bg-gradient-to-b flex-shrink-0',
      locked ? 'opacity-15' : 'opacity-50',
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
  reward?: string
  palette: typeof LEVEL_PALETTE['gold']
  onOpen: () => void
}) {
  return (
    <button
      onClick={unlocked ? onOpen : undefined}
      disabled={!unlocked}
      className={cn(
        'relative group w-14 h-10 rounded-lg flex flex-col items-center justify-center gap-0.5',
        'border transition-all duration-150',
        unlocked
          ? cn(palette.chest, palette.chestGlow, 'hover:scale-105 cursor-pointer')
          : 'bg-[#16140F] border-[#2A2415] opacity-30 cursor-not-allowed'
      )}
      aria-label={unlocked ? `Abrir cofre: ${reward}` : 'Cofre bloqueado'}
    >
      <span className="text-lg leading-none" role="img" aria-hidden>
        {unlocked ? '🎁' : '🔒'}
      </span>
      <span className="text-[8px] font-semibold tracking-widest text-[#8B6914]">
        {unlocked ? 'ABRIR' : 'COFRE'}
      </span>

      {unlocked && reward && (
        <div className={cn(
          'absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
          'w-[140px] rounded-lg p-2.5 z-20',
          'bg-[#1C1810] border border-[#D4AF37] border-opacity-60',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          'pointer-events-none'
        )}>
          <p className="text-[11px] font-semibold text-[#D4AF37] mb-1">Cofre disponible</p>
          <p className="text-[10px] text-[#8B6914] leading-relaxed">{reward}</p>
        </div>
      )}
    </button>
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

  return (
    <div className={cn(
      'relative rounded-xl border p-4 pb-5',
      'bg-[#16140F]',
      palette.band
    )}>
      <div className={cn(
        'absolute -top-[11px] left-1/2 -translate-x-1/2',
        'px-3 py-0.5 rounded-full border text-[10px] font-semibold tracking-widest',
        'whitespace-nowrap',
        palette.title
      )}>
        {level.emoji} NIVEL {level.id} — {level.title.toUpperCase()}
      </div>

      <div className="flex flex-col items-center gap-0 pt-2">
        {nodeRows.map((pair, rowIdx) => (
          <div key={rowIdx} className="flex flex-col items-center gap-0">
            <div className="flex items-center gap-0">
              <RouteNodeComponent
                node={pair[0]}
                palette={palette}
                onNodeClick={onNodeClick}
              />
              {pair[1] && (
                <>
                  <HorizontalConnector palette={palette} />
                  <RouteNodeComponent
                    node={pair[1]}
                    palette={palette}
                    onNodeClick={onNodeClick}
                  />
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
    </div>
  )
}

// ─────────────────────────────────────────
// MODAL DE NODO
// ─────────────────────────────────────────

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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1C1810] border border-[#D4AF37] border-opacity-60 rounded-2xl p-6 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{node.emoji}</span>
            <div>
              <p className="text-[10px] text-[#8B6914] tracking-widest font-semibold mb-0.5">
                PARADA {node.order}
              </p>
              <h3 className="text-[#D4AF37] font-semibold text-lg leading-tight">{node.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B6914] hover:text-[#D4AF37] transition-colors text-lg leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <p className="text-[#6B5B35] text-sm leading-relaxed mb-5">{node.description}</p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[#D4AF37] font-bold text-lg">{node.xp}</p>
              <p className="text-[#6B5B35] text-[10px]">XP máx.</p>
            </div>
            <div className="text-center">
              <p className="text-[#D4AF37] font-bold text-lg">
                {node.type === 'theory' ? '📖' : '⚡'}
              </p>
              <p className="text-[#6B5B35] text-[10px]">
                {node.type === 'theory' ? 'Teoría' : 'Práctica'}
              </p>
            </div>
          </div>
          <Stars count={3} lit={node.stars ?? 0} />
        </div>

        {node.status === 'locked' ? (
          <div className="text-center py-3 rounded-xl bg-[#16140F] border border-[#2A2415]">
            <p className="text-[#444441] text-sm">Completa la parada anterior para desbloquear</p>
          </div>
        ) : (
          <button
            onClick={() => onStart(node.slug)}
            className={cn(
              'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150',
              'hover:scale-[1.02] active:scale-[0.98]',
              node.status === 'done'
                ? 'bg-[#1C1510] border border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#D4AF37] text-[#16140F]'
            )}
          >
            {node.status === 'done' ? 'Repasar parada' : 'Comenzar parada →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────

interface RouteMapProps {
  route: RouteData
  userProgress: RouteUserProgress
  onNodeStart?: (slug: string) => void
}

export function RouteMap({ route, userProgress, onNodeStart }: RouteMapProps) {
  const [selectedNode, setSelectedNode] = useState<RouteNode | null>(null)
  const [openedChest, setOpenedChest] = useState<string | null>(null)

  const handleNodeClick = (node: RouteNode) => {
    setSelectedNode(node)
  }

  const handleChestOpen = (level: RouteLevel) => {
    if (level.chestUnlocked && openedChest !== level.id.toString()) {
      setOpenedChest(level.id.toString())
    }
  }

  const handleNodeStart = (slug: string) => {
    setSelectedNode(null)
    onNodeStart?.(slug)
  }

  return (
    <>
      <div className="w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-3">

        {route.levels.map((level, levelIdx) => (
          <div key={level.id} className="flex flex-col items-center gap-0">
            <LevelBand
              level={level}
              onNodeClick={handleNodeClick}
              onChestOpen={handleChestOpen}
            />

            {levelIdx < route.levels.length - 1 && (
              <div className={cn(
                'w-0.5 h-8 bg-gradient-to-b opacity-30',
                LEVEL_PALETTE[route.levels[levelIdx + 1].colorClass].connector
              )} />
            )}
          </div>
        ))}

        <div className={cn(
          'flex items-center justify-between mt-2 px-4 py-3 rounded-xl',
          'bg-[#16140F] border border-[#2A2415]'
        )}>
          <div>
            <p className="text-[10px] text-[#6B5B35] tracking-widest font-semibold mb-0.5">
              {userProgress.levelName.toUpperCase()}
            </p>
            <p className="text-[#D4AF37] font-bold text-base">
              {userProgress.totalXP.toLocaleString()} XP
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#6B5B35] mb-1">Progreso global</p>
            <div className="w-32 h-1.5 bg-[#2A2415] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (userProgress.completedNodes.length / Math.max(1, route.levels.reduce((s, l) => s + l.nodes.length, 0))) * 100)}%`
                }}
              />
            </div>
            <p className="text-[10px] text-[#6B5B35] mt-1">
              {userProgress.completedNodes.length} / {route.levels.reduce((s, l) => s + l.nodes.length, 0)} paradas
            </p>
          </div>
        </div>
      </div>

      {selectedNode && (
        <NodeModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onStart={handleNodeStart}
        />
      )}

      {openedChest && (
        <div className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
          'bg-[#1C1810] border border-[#D4AF37] rounded-xl px-5 py-3',
          'flex items-center gap-3 shadow-lg',
          'animate-in slide-in-from-bottom-4 duration-300'
        )}>
          <span className="text-2xl">🎁</span>
          <div>
            <p className="text-[#D4AF37] font-semibold text-sm">¡Cofre desbloqueado!</p>
            <p className="text-[#8B6914] text-xs">Revisa tu habitación para ver la recompensa</p>
          </div>
        </div>
      )}
    </>
  )
}
