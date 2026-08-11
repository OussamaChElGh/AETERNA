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
  showDebugToggle?: boolean;
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
  relicWallOpen = false,
  showDebugToggle = true
}: RoomEngineHUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between p-4 sm:p-6 pointer-events-none transition-all duration-500">
      
      {/* Left: Navigation and Primary Actions */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="flex items-center justify-center w-10 h-10 bg-brand-ink/80 backdrop-blur-md hover:bg-brand-gold text-brand-gold hover:text-brand-ink border border-brand-gold/30 rounded-full transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] group"
            title="Volver al Nexo"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          
          <button
            onClick={() => setEditMode(!editMode)}
            className={cn(
              "px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-[0.15em] rounded-full transition-all border flex items-center gap-2.5 shadow-lg active:scale-95",
              editMode
                ? "bg-brand-gold text-brand-ink border-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                : "bg-brand-ink/80 backdrop-blur-md text-brand-offwhite border-brand-gold/30 hover:border-brand-gold hover:text-brand-gold"
            )}
          >
            {editMode ? <Edit3 size={15} /> : <Eye size={15} />}
            <span>{editMode ? "Decoración" : "Contemplación"}</span>
          </button>
        </div>

        {onToggleRelicWall && (
          <button
            onClick={onToggleRelicWall}
            className={cn(
              "self-start px-4 py-2 rounded-full border text-[10px] transition-all flex items-center gap-2 font-mono font-bold uppercase tracking-wider backdrop-blur-md",
              relicWallOpen
                ? "bg-brand-gold text-brand-ink border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "bg-brand-ink/60 border-brand-gold/20 text-brand-gold hover:bg-brand-gold/10"
            )}
            title="Muro de Reliquias"
          >
            <Award size={14} />
            <span>Tus Reliquias</span>
          </button>
        )}
      </div>

      {/* Center: Glorious Title */}
      <div className="hidden md:flex flex-col items-center pointer-events-auto mt-2">
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F2E8C6] via-[#D4AF37] to-[#8C6D23] drop-shadow-[0_0_25px_rgba(212,175,55,0.4)] tracking-tight italic">
          Tu Estancia Mágica
        </h1>
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-gold/70 mt-2 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-brand-gold/30"></span>
          El Nexo de la Sabiduría
          <span className="w-8 h-[1px] bg-brand-gold/30"></span>
        </span>
      </div>

      {/* Right: Secondary/Edit Controls */}
      <div className={cn(
        "flex flex-col items-end gap-2 pointer-events-auto transition-all duration-300",
        editMode ? "pr-0 md:pr-[360px]" : "pr-0"
      )}>
        {/* Item Counter Pill */}
        <div className="bg-brand-ink/80 backdrop-blur-md border border-brand-gold/30 text-brand-gold text-[10px] font-mono font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg mb-2">
          <Sparkle size={14} className="text-brand-gold" />
          <span>{itemCount} {itemCount === 1 ? 'Objeto' : 'Objetos'}</span>
          <span className="text-brand-gold/30">|</span>
          <span className="text-brand-offwhite/70">{unlockedCount} Desbloqueados</span>
        </div>

        {editMode && (
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[10px] transition-all flex items-center gap-2 font-mono font-bold uppercase tracking-wider backdrop-blur-md",
                showGrid
                  ? "bg-brand-gold/20 border-brand-gold text-brand-gold"
                  : "bg-brand-ink/60 border-brand-gold/20 text-brand-offwhite/60 hover:text-brand-gold"
              )}
            >
              <Grid size={13} /> Guía
            </button>

            {showDebugToggle && (
              <button
                onClick={() => setShowDebugMode(!showDebugMode)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-[10px] transition-all flex items-center gap-2 font-mono font-bold uppercase tracking-wider backdrop-blur-md",
                  showDebugMode
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                    : "bg-brand-ink/60 border-brand-gold/20 text-brand-offwhite/60 hover:text-emerald-500"
                )}
              >
                <Wrench size={13} /> Debug
              </button>
            )}

            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 text-[10px] transition-all flex items-center gap-2 font-mono font-bold uppercase tracking-wider backdrop-blur-md bg-brand-ink/60"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
