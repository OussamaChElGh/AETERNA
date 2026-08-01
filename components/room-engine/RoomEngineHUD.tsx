'use client';
import React from 'react';
import { Eye, Edit3, Grid, RotateCcw, ArrowLeft, Sparkle, Wrench, Award } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RoomEngineHUDProps {
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  showDebugMode: boolean;
  setShowDebugMode: (val: boolean) => void;
  onReset: () => void;
  itemCount: number;
  unlockedCount?: number;
  onToggleRelicWall?: () => void;
  relicWallOpen?: boolean;
}

export function RoomEngineHUD({
  editMode,
  setEditMode,
  showGrid,
  setShowGrid,
  showDebugMode,
  setShowDebugMode,
  onReset,
  itemCount,
  unlockedCount = 0,
  onToggleRelicWall,
  relicWallOpen = false
}: RoomEngineHUDProps) {
  return (
    <div className="bg-brand-ink/80 backdrop-blur-md border border-brand-gold/30 rounded-2xl p-3.5 mb-4 shadow-xl flex flex-wrap items-center justify-between gap-4 font-sans transition-all duration-300">
      {/* Title & Back Button */}
      <div className="flex items-center gap-3">
        <Link 
          href="/"
          className="p-2 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/30 rounded-xl transition-all hover:scale-105"
          title="Volver al Nexo"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-brand-gold block">
            Aeterna • Estancia del Conocimiento
          </span>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-brand-offwhite leading-tight">
            Habitación de Estudio
          </h1>
        </div>
      </div>

      {/* Mode Switcher & Controls */}
      <div className="flex items-center gap-3">
        {/* Main Mode Toggle: Contemplación / Decoración */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={cn(
            "px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2 shadow-md active:scale-95 select-none",
            editMode
              ? "bg-brand-gold text-brand-ink border-brand-gold font-black shadow-[0_0_15px_rgba(212,175,55,0.35)]"
              : "bg-white/5 text-brand-offwhite border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/10"
          )}
        >
          {editMode ? <Edit3 size={14} /> : <Eye size={14} />}
          <span>{editMode ? "Modo Decoración" : "Modo Contemplación"}</span>
        </button>

        {/* Relic Wall */}
        {onToggleRelicWall && (
          <button
            onClick={onToggleRelicWall}
            className={cn(
              "p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 font-mono font-bold select-none",
              relicWallOpen
                ? "bg-brand-gold/20 border-brand-gold text-brand-gold"
                : "bg-white/5 border-white/10 text-brand-offwhite/60 hover:text-brand-gold hover:border-brand-gold/40"
            )}
            title="Muro de Reliquias"
          >
            <Award size={15} />
            <span className="hidden sm:inline text-[11px]">Reliquias</span>
          </button>
        )}

        {/* Decoration Mode Secondary Controls */}
        {editMode && (
          <>
            {/* Subtle Grid Toggle */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 font-mono font-bold select-none",
                showGrid
                  ? "bg-brand-gold/20 border-brand-gold text-brand-gold"
                  : "bg-white/5 border-white/10 text-brand-offwhite/60 hover:text-brand-gold"
              )}
              title="Alternar Guía Isométrica"
            >
              <Grid size={15} />
              <span className="hidden sm:inline text-[11px]">Guía</span>
            </button>

            {/* DEBUG GEOMETRY TOGGLE */}
            <button
              onClick={() => setShowDebugMode(!showDebugMode)}
              className={cn(
                "p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 font-mono font-bold select-none",
                showDebugMode
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-white/5 border-white/10 text-brand-offwhite/60 hover:text-emerald-500"
              )}
              title="Alternar Debug Geometría Lógica (Verde = Suelo, Azul = Pared, Rojo = Fuera)"
            >
              <Wrench size={15} />
              <span className="hidden sm:inline text-[11px]">Debug Geometría</span>
            </button>

            {/* Reset Layout */}
            <button
              onClick={onReset}
              className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs transition-all flex items-center gap-1.5 font-mono font-bold select-none"
              title="Restablecer Disposición"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline text-[11px]">Restablecer</span>
            </button>
          </>
        )}

        {/* Item Counter Pill */}
        <div className="bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
          <Sparkle size={13} className="text-brand-gold fill-brand-gold/30" />
          <span>{itemCount} {itemCount === 1 ? 'Objeto' : 'Objetos'}</span>
          <span className="text-brand-gold/50">·</span>
          <span>{unlockedCount} {unlockedCount === 1 ? 'Desbloqueado' : 'Desbloqueados'}</span>
        </div>
      </div>
    </div>
  );
}
