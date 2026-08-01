'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { CatalogItem, PlacedItem } from '@/data/roomItems';
import { loadRoomState, saveRoomState, GRID_COLUMNS, GRID_ROWS } from '@/lib/roomState';
import { RoomToolbar } from './RoomToolbar';
import { RoomCanvas } from './RoomCanvas';
import { ObjectInventory } from './ObjectInventory';
import { ObjectControls } from './ObjectControls';
import { AnimatePresence } from 'motion/react';

export function KnowledgeRoom() {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [editMode, setEditMode] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  // Load initial state from localStorage on mount
  useEffect(() => {
    const loaded = loadRoomState();
    setPlacedItems(loaded);
  }, []);

  // Auto-save placedItems to localStorage whenever they change
  const updatePlacedItems = useCallback((newItems: PlacedItem[]) => {
    setPlacedItems(newItems);
    saveRoomState(newItems);
  }, []);

  // Add a NEW instance of a catalog item to the room (allows multiple books, chairs, etc.)
  const handleAddItem = (catalogItem: CatalogItem) => {
    const newInstanceId = `inst_${catalogItem.id}_${Date.now()}`;
    const defaultGridX = Math.floor(GRID_COLUMNS / 2) - Math.floor(catalogItem.widthGrid / 2);
    const defaultGridY = Math.floor(GRID_ROWS / 2) - Math.floor(catalogItem.heightGrid / 2);

    const maxZ = placedItems.reduce((max, i) => Math.max(max, i.zIndex), 0);

    const newItem: PlacedItem = {
      instanceId: newInstanceId,
      itemId: catalogItem.id,
      gridX: defaultGridX,
      gridY: defaultGridY,
      rotation: 0,
      zIndex: maxZ + 1
    };

    const updated = [...placedItems, newItem];
    updatePlacedItems(updated);
    setSelectedInstanceId(newInstanceId);
  };

  // Move placed item
  const handleMoveItem = (instanceId: string, targetGridX: number, targetGridY: number) => {
    const updated = placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return {
          ...item,
          gridX: targetGridX,
          gridY: targetGridY,
          zIndex: targetGridY // depth sorting by Y
        };
      }
      return item;
    });
    updatePlacedItems(updated);
  };

  // Rotate item 90 degrees
  const handleRotateItem = (instanceId: string) => {
    const updated = placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return {
          ...item,
          rotation: (item.rotation + 90) % 360
        };
      }
      return item;
    });
    updatePlacedItems(updated);
  };

  // Delete item instance from room
  const handleDeleteItem = (instanceId: string) => {
    const updated = placedItems.filter(item => item.instanceId !== instanceId);
    updatePlacedItems(updated);
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
  };

  // Bring to front
  const handleBringToFront = (instanceId: string) => {
    const maxZ = placedItems.reduce((max, i) => Math.max(max, i.zIndex), 0);
    const updated = placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return { ...item, zIndex: maxZ + 1 };
      }
      return item;
    });
    updatePlacedItems(updated);
  };

  // Clear room
  const handleClearRoom = () => {
    updatePlacedItems([]);
    setSelectedInstanceId(null);
  };

  const selectedPlacedItem = placedItems.find(i => i.instanceId === selectedInstanceId) || null;

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#0E0E12] p-4 sm:p-6 md:p-8 font-sans text-brand-ink dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Top Control Toolbar */}
        <RoomToolbar
          editMode={editMode}
          setEditMode={setEditMode}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          onClearRoom={handleClearRoom}
          itemCount={placedItems.length}
        />

        {/* Main Editor Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left / Center 2D Room Viewport Canvas (3 Columns) */}
          <div className="lg:col-span-3 relative">
            <RoomCanvas
              placedItems={placedItems}
              editMode={editMode}
              showGrid={showGrid}
              selectedInstanceId={selectedInstanceId}
              onSelectItem={(item) => setSelectedInstanceId(item ? item.instanceId : null)}
              onMoveItem={handleMoveItem}
            />

            {/* Floating Action Toolbar for Selected Object */}
            <AnimatePresence>
              {editMode && selectedPlacedItem && (
                <ObjectControls
                  selectedItem={selectedPlacedItem}
                  onRotate={handleRotateItem}
                  onDelete={handleDeleteItem}
                  onBringToFront={handleBringToFront}
                  onDeselect={() => setSelectedInstanceId(null)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Inventory Panel (1 Column) */}
          <div className="lg:col-span-1 h-[480px] sm:h-[580px] md:h-[680px]">
            <ObjectInventory
              onAddItem={handleAddItem}
              placedItems={placedItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
