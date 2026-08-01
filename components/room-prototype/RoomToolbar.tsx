'use client';
import React from 'react';
import { Eye, Edit3, Grid, Trash2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomToolbarProps {
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  onClearRoom: () => void;
  itemCount: number;
}

export function RoomToolbar({
  editMode,
  setEditMode,
  showGrid,
  setShowGrid,
  onClearRoom,
  itemCount
}: RoomToolbarProps) {
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#16161D] border border-brand-gold/30 rounded-2xl p-4 mb-4 shadow-xl flex flex-wrap items-center justify-between gap-4 font-sans">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-gold/15 border border-brand-gold/40 rounded-xl text-brand-gold">
          <Sparkles size={18} />
        </div>
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-[#8B6914] dark:text-brand-gold block">
            Prototipo Aislado /room-prototype
          </span>
          <h1 className="font-serif text-xl font-bold text-brand-ink dark:text-white leading-tight">
            Habitación 2D Interactiva
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Switcher */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={cn(
            "px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all border flex items-center gap-2 shadow-md",
            editMode
              ? "bg-brand-gold text-brand-ink border-brand-gold font-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : "bg-white dark:bg-white/5 text-brand-ink dark:text-brand-offwhite border-brand-gold/30 hover:border-brand-gold"
          )}
        >
          {editMode ? <Edit3 size={14} /> : <Eye size={14} />}
          <span>{editMode ? "Modo Edición Activo" : "Modo Contemplación"}</span>
        </button>

        {/* Grid Toggle */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={cn(
            "p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2 font-mono font-bold",
            showGrid
              ? "bg-brand-gold/20 border-brand-gold text-[#8B6914] dark:text-brand-gold"
              : "bg-white/5 border-black/10 dark:border-white/10 text-brand-muted"
          )}
          title="Alternar rejilla de snapping"
        >
          <Grid size={16} />
          <span className="hidden sm:inline">Cuadrícula (Snap)</span>
        </button>

        {/* Clear Room */}
        {editMode && (
          <button
            onClick={onClearRoom}
            className="p-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs transition-all flex items-center gap-2 font-mono font-bold"
            title="Vaciar Habitación"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Vaciar</span>
          </button>
        )}

        {/* Persistence Status Badge */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-mono font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 size={12} />
          <span>{itemCount} Objetos (localStorage)</span>
        </div>
      </div>
    </div>
  );
}
