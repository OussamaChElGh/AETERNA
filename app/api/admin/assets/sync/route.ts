import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog';
import { ROOM_ASSETS } from '@/data/roomEngineAssets';
import { clearDynamicAssetsCache } from '@/data/dynamicAssets';

const ASSETS_FILE = path.join(process.cwd(), 'data', 'assets.json');

export async function POST() {
  try {
    // Leer assets existentes
    let assetsData: any = { assets: [] };
    try {
      const existing = await fs.readFile(ASSETS_FILE, 'utf-8');
      assetsData = JSON.parse(existing);
    } catch (e) {
      // Archivo no existe o está vacío
    }

    // Sincronizar catálogo estático con assets.json
    let addedCount = 0;
    let updatedCount = 0;

    for (const catalogItem of ROOM_ENGINE_CATALOG) {
      const existingIndex = assetsData.assets.findIndex((a: any) => a.id === catalogItem.id);
      const roomAsset = ROOM_ASSETS[catalogItem.assetId];
      
      if (existingIndex === -1) {
        // Nuevo asset
        const newAsset = {
          id: catalogItem.id,
          name: catalogItem.name,
          description: catalogItem.description,
          type: catalogItem.category,
          discipline: catalogItem.discipline,
          rarity: catalogItem.rarity,
          category: catalogItem.category,
          imageUrl: roomAsset?.src || '',
          storagePath: roomAsset?.src || '',
          footprintTileWidth: roomAsset?.footprintTileWidth || 2,
          footprintTileHeight: roomAsset?.footprintTileHeight || 2,
          pixelWidth: roomAsset?.pixelWidth || 128,
          pixelHeight: roomAsset?.pixelHeight || 128,
          anchorX: roomAsset?.anchorX || 0.5,
          anchorY: roomAsset?.anchorY || 0.85,
          placementSurface: catalogItem.placementSurface,
          canRotate: catalogItem.canRotate,
          unlockCondition: catalogItem.unlockCondition,
          isFromCatalog: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        assetsData.assets.push(newAsset);
        addedCount++;
      } else {
        // Actualizar metadata manteniendo createdAt original
        const originalCreatedAt = assetsData.assets[existingIndex].createdAt || Date.now();
        assetsData.assets[existingIndex] = {
          ...assetsData.assets[existingIndex],
          id: catalogItem.id,
          name: catalogItem.name,
          description: catalogItem.description,
          type: catalogItem.category,
          discipline: catalogItem.discipline,
          rarity: catalogItem.rarity,
          category: catalogItem.category,
          imageUrl: roomAsset?.src || assetsData.assets[existingIndex].imageUrl,
          storagePath: roomAsset?.src || assetsData.assets[existingIndex].storagePath,
          footprintTileWidth: roomAsset?.footprintTileWidth || assetsData.assets[existingIndex].footprintTileWidth || 2,
          footprintTileHeight: roomAsset?.footprintTileHeight || assetsData.assets[existingIndex].footprintTileHeight || 2,
          pixelWidth: roomAsset?.pixelWidth || assetsData.assets[existingIndex].pixelWidth || 128,
          pixelHeight: roomAsset?.pixelHeight || assetsData.assets[existingIndex].pixelHeight || 128,
          anchorX: roomAsset?.anchorX || assetsData.assets[existingIndex].anchorX || 0.5,
          anchorY: roomAsset?.anchorY || assetsData.assets[existingIndex].anchorY || 0.85,
          placementSurface: catalogItem.placementSurface,
          canRotate: catalogItem.canRotate,
          unlockCondition: catalogItem.unlockCondition,
          isFromCatalog: true,
          createdAt: originalCreatedAt,
          updatedAt: Date.now(),
        };
        updatedCount++;
      }
    }

    // Guardar
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assetsData, null, 2));
    
    // Limpiar cache para que el room-engine recargue los datos
    clearDynamicAssetsCache();

    return NextResponse.json({
      success: true,
      added: addedCount,
      updated: updatedCount,
      total: assetsData.assets.length,
      catalogSize: ROOM_ENGINE_CATALOG.length,
    });
  } catch (error) {
    console.error('Error syncing catalog:', error);
    return NextResponse.json({ 
      error: 'Error al sincronizar catálogo',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
