'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { EnvironmentLayout, EnvironmentTheme, EnvironmentPlacedItem } from '@/types/environmentEngine';
import { Room } from './Room';
import { RoomEngineHUD } from '../room-engine/RoomEngineHUD';
import { InventoryDrawer } from '../room-engine/InventoryDrawer';
import { RelicWall } from './RelicWall';
import { RoomCatalogItem as LegacyCatalogItem } from '@/types/roomEngine';
import { loadRoomEngineState, saveRoomEngineStateDebounced, evaluateRoomUnlocks, hasRoomEngineState, validatePlacement } from '@/lib/roomEngineStorage';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { Starfield } from '@/components/Starfield';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AeternaEnvironmentEngineProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
  initialItems?: EnvironmentPlacedItem[];
}

export function AeternaEnvironmentEngine({
  layout,
  theme,
  initialItems = []
}: AeternaEnvironmentEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { progress } = useGamification();
  const userId = user?.uid || 'anonymous';

  const [placedItems, setPlacedItems] = useState<EnvironmentPlacedItem[]>(() => {
    const hasSaved = hasRoomEngineState();
    if (hasSaved) {
      const loaded = loadRoomEngineState();
      return loaded.placedItems.length > 0 ? loaded.placedItems : initialItems;
    }
    return initialItems;
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDebugMode, setShowDebugMode] = useState<boolean>(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState<boolean>(true);
  const [relicWallOpen, setRelicWallOpen] = useState<boolean>(false);

  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number } | null>(null);

  // Gamification unlock evaluation (memoized: no se recalcula durante drags)
  const unlockedIds = useMemo(() => {
    const ctx = {
      completedPaths: progress.completedPaths || [],
      completedLayers: progress.completedLayers || {},
      userId: user?.uid
    };
    return evaluateRoomUnlocks(ctx).unlockedIds;
  }, [progress.completedPaths, progress.completedLayers, user?.uid]);

  const mountedRef = useRef(false);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  // Auto-save on placedItems change (debounced to localStorage + Firestore)
  useEffect(() => {
    if (!mountedRef.current) return;
    saveRoomEngineStateDebounced({ roomId: 'main_2d_room', theme: 'academic_library', gridSizeX: layout.gridSizeX, gridSizeY: layout.gridSizeY, placedItems }, userId);
  }, [placedItems, userId, layout]);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const factor = width / 1200;
      setScaleFactor(Math.max(0.4, Math.min(1.2, factor)));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (relicWallOpen) return;
    setSelectedInstanceId(null);
    setIsPanning(true);
    panStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (relicWallOpen || !isPanning || !panStartRef.current) return;
    const deltaX = e.clientX - panStartRef.current.startX;
    const deltaY = e.clientY - panStartRef.current.startY;
    setPan({
      x: panStartRef.current.initialPanX + deltaX,
      y: panStartRef.current.initialPanY + deltaY
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (relicWallOpen || !isPanning) {
      setIsPanning(false);
      return;
    }
    setIsPanning(false);
    panStartRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleResetCamera = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleSpawnItem = (item: LegacyCatalogItem) => {
    if (!unlockedIds.has(item.id)) return;
    const newInstanceId = `inst_${item.id}_${Date.now()}`;
    const isWallItem = item.placementSurface === 'wall';
    const newItem: EnvironmentPlacedItem = {
      instanceId: newInstanceId,
      catalogItemId: item.id,
      tileX: isWallItem ? 4 : (layout.spawnPoint?.tileX ?? 7),
      tileY: isWallItem ? 0 : (layout.spawnPoint?.tileY ?? 7),
      tileZ: 0,
      rotation: 0
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSelectedInstanceId(newInstanceId);
  };

  const handleUpdatePosition = (instanceId: string, tileX: number, tileY: number, tileZ?: number) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.instanceId === instanceId) {
        return { 
          ...item, 
          tileX, 
          tileY,
          tileZ: tileZ !== undefined ? tileZ : item.tileZ 
        };
      }
      return item;
    }));
  };

  const handleRotate = (instanceId: string) => {
    const nextRotations: Record<0 | 90 | 180 | 270, 0 | 90 | 180 | 270> = {
      0: 90, 90: 180, 180: 270, 270: 0
    };
    setPlacedItems(prev => prev.map(item => {
      if (item.instanceId === instanceId) {
        return { ...item, rotation: nextRotations[item.rotation] ?? 0 };
      }
      return item;
    }));
  };

  const handleToggleElevation = (instanceId: string) => {
    setPlacedItems(prev => {
      const target = prev.find(i => i.instanceId === instanceId);
      if (!target) return prev;
      const nextZ = target.tileZ === 1 ? 0 : 1;
      if (nextZ === 1) {
        // Elevar solo si hay una mesa de apoyo debajo (validación completa).
        const validation = validatePlacement(
          target.tileX, target.tileY, nextZ,
          target.rotation, target.catalogItemId,
          target.instanceId, prev
        );
        if (!validation.isValid) return prev;
      }
      return prev.map(item => {
        if (item.instanceId === instanceId) {
          return { ...item, tileZ: nextZ };
        }
        return item;
      });
    });
  };

  const handleDelete = (instanceId: string) => {
    setPlacedItems(prev => prev.filter(item => item.instanceId !== instanceId));
    if (selectedInstanceId === instanceId) setSelectedInstanceId(null);
  };

  const handleReset = () => {
    const loaded = loadRoomEngineState();
    setPlacedItems(loaded.placedItems);
    setSelectedInstanceId(null);
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => Math.max(0.6, Math.min(1.8, prev + zoomDelta)));
  };

  return (
    <div className="min-h-screen bg-brand-ink p-4 sm:p-6 md:p-8 font-sans text-brand-offwhite relative overflow-x-hidden selection:bg-brand-gold selection:text-brand-ink">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-brand-ink/40" />
        <div className="absolute inset-0 bg-engraving opacity-[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="max-w-6xl mx-auto pb-24 relative z-10">
        {/* HUD Navigation Header */}
        <RoomEngineHUD
          editMode={editMode}
          setEditMode={setEditMode}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showDebugMode={showDebugMode}
          setShowDebugMode={setShowDebugMode}
          onReset={handleReset}
          itemCount={placedItems.length}
          unlockedCount={unlockedIds.size}
          onToggleRelicWall={() => setRelicWallOpen(!relicWallOpen)}
          relicWallOpen={relicWallOpen}
          showDebugToggle={false}
        />

        {/* ENVIRONMENT ENGINE VIEWPORT */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className={cn(
            "relative w-full aspect-[16/10] min-h-[500px] bg-[#14110D] rounded-3xl border-2 border-brand-gold/30 shadow-[0_0_60px_rgba(212,175,55,0.1)] overflow-hidden select-none transition-all duration-300 environment-viewport",
            isPanning ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          {/* Starfield atmospheric layer */}
          <Starfield className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

          {/* Isometric grid overlay (guide) */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(60deg, rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(120deg, rgba(212,175,55,0.08) 1px, transparent 1px)',
                backgroundSize: '56px 97px',
                backgroundPosition: 'center center',
                maskImage: 'radial-gradient(ellipse 45% 40% at 50% 55%, black 30%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse 45% 40% at 50% 55%, black 30%, transparent 75%)'
              }}
            />
          )}

          {/* CAMERA PAN & ZOOM WRAPPER */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '950px',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top left'
            }}
          >
            {/* MAIN ROOM CONTAINER */}
            <Room
              layout={layout}
              theme={theme}
              placedItems={placedItems}
              editMode={editMode}
              selectedInstanceId={selectedInstanceId}
              onSelect={(selected) => setSelectedInstanceId(selected.instanceId)}
              onUpdatePosition={handleUpdatePosition}
              onRotate={handleRotate}
              onToggleElevation={handleToggleElevation}
              onDelete={handleDelete}
              onDeselect={() => setSelectedInstanceId(null)}
              scaleFactor={scaleFactor * zoom}
            />
          </div>

          {/* CAMERA ZOOM & PAN CONTROLS */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-brand-ink/80 backdrop-blur-md p-1.5 rounded-2xl border border-brand-gold/30 shadow-lg">
            <span className="text-[10px] text-brand-gold font-mono font-bold px-2 py-1 bg-brand-gold/10 rounded-lg border border-brand-gold/20">
              Cámara Pan
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
              className="p-2 hover:bg-brand-gold/20 text-brand-offwhite rounded-xl transition-colors"
              title="Acercar Cámara"
            >
              <ZoomIn size={15} />
            </button>
            <span className="text-[10px] font-mono font-bold text-brand-gold px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              className="p-2 hover:bg-brand-gold/20 text-brand-offwhite rounded-xl transition-colors"
              title="Alejar Cámara"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-2 hover:bg-brand-gold/20 text-brand-gold rounded-xl transition-colors"
              title="Restablecer Vista y Cámara"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {/* Relic Wall Overlay */}
          <RelicWall open={relicWallOpen} onClose={() => setRelicWallOpen(false)} />
        </div>

        {/* Inventory Drawer (Only in Edit Mode) */}
        {editMode && (
          <InventoryDrawer
            isOpen={inventoryOpen}
            onToggle={() => setInventoryOpen(!inventoryOpen)}
            onSpawnItem={handleSpawnItem}
            placedItems={placedItems}
            unlockedIds={unlockedIds}
          />
        )}
      </div>
    </div>
  );
}
