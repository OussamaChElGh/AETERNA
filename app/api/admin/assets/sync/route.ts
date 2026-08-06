import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { clearDynamicAssetsCache } from '@/data/dynamicAssets';

const ASSETS_FILE = path.join(process.cwd(), 'data', 'assets.json');
const CATALOG_FILE = path.join(process.cwd(), 'data', 'roomEngineCatalog.ts');
const ASSETS_DIR = path.join(process.cwd(), 'data', 'roomEngineAssets.ts');

export async function POST() {
  try {
    // Leer catálogo estático
    const catalogContent = await fs.readFile(CATALOG_FILE, 'utf-8');
    
    // Extraer items del catálogo usando regex
    const itemsMatch = catalogContent.match(/export const ROOM_ENGINE_CATALOG: RoomCatalogItem\[\] = \[([\s\S]*?)\];/);
    if (!itemsMatch) {
      return NextResponse.json({ error: 'No se pudo leer el catálogo' }, { status: 500 });
    }

    // Parsear items (simplificado - en producción usar un parser TS adecuado)
    const itemsText = itemsMatch[1];
    const itemBlocks = itemsText.match(/\{[\s\S]*?\}(?=\s*,\s*\{|\s*\]$)/g) || [];
    
    // Leer assets existentes
    let assetsData: any = { assets: [] };
    try {
      const existing = await fs.readFile(ASSETS_FILE, 'utf-8');
      assetsData = JSON.parse(existing);
    } catch (e) {
      // Archivo no existe o está vacío
    }

    // Extraer IDs de items del catálogo
    const catalogIds = new Set<string>();
    const catalogItems: any[] = [];
    
    for (const block of itemBlocks) {
      const idMatch = block.match(/id:\s*'([^']+)'/);
      const nameMatch = block.match(/name:\s*'([^']+)'/);
      const descriptionMatch = block.match(/description:\s*'([^']+)'/);
      const disciplineMatch = block.match(/discipline:\s*'([^']+)'/);
      const categoryMatch = block.match(/category:\s*'([^']+)'/);
      const rarityMatch = block.match(/rarity:\s*'([^']+)'/);
      const assetIdMatch = block.match(/assetId:\s*'([^']+)'/);
      const placementMatch = block.match(/placementSurface:\s*'([^']+)'/);
      const rotateMatch = block.match(/canRotate:\s*(true|false)/);
      
      if (idMatch && nameMatch) {
        const item = {
          id: idMatch[1],
          name: nameMatch[1],
          description: descriptionMatch?.[1] || '',
          discipline: disciplineMatch?.[1] || 'general',
          category: categoryMatch?.[1] || 'furniture',
          rarity: rarityMatch?.[1] || 'common',
          assetId: assetIdMatch?.[1] || '',
          placementSurface: placementMatch?.[1] || 'floor',
          canRotate: rotateMatch?.[1] === 'true',
        };
        catalogIds.add(item.id);
        catalogItems.push(item);
      }
    }

    // Leer roomEngineAssets para obtener metadata de imágenes
    let assetsMetadata: any = {};
    try {
      const assetsContent = await fs.readFile(ASSETS_DIR, 'utf-8');
      // Extraer definiciones de ROOM_ASSETS
      const assetsMatch = assetsContent.match(/export const ROOM_ASSETS: Record<string, RoomAsset> = \{([\s\S]*?)\};/);
      if (assetsMatch) {
        const assetsText = assetsMatch[1];
        const assetBlocks = assetsText.match(/'([^']+)':\s*\{[\s\S]*?\}(?=\s*,\s*'|\s*\}$)/g) || [];
        
        for (const block of assetBlocks) {
          const keyMatch = block.match(/'([^']+)':/);
          const srcMatch = block.match(/src:\s*'([^']+)'/);
          const widthMatch = block.match(/pixelWidth:\s*(\d+)/);
          const heightMatch = block.match(/pixelHeight:\s*(\d+)/);
          const fpWidthMatch = block.match(/footprintTileWidth:\s*(\d+)/);
          const fpHeightMatch = block.match(/footprintTileHeight:\s*(\d+)/);
          const anchorXMatch = block.match(/anchorX:\s*([\d.]+)/);
          const anchorYMatch = block.match(/anchorY:\s*([\d.]+)/);
          
          if (keyMatch && srcMatch) {
            assetsMetadata[keyMatch[1]] = {
              src: srcMatch[1],
              pixelWidth: widthMatch ? parseInt(widthMatch[1]) : 128,
              pixelHeight: heightMatch ? parseInt(heightMatch[1]) : 128,
              footprintTileWidth: fpWidthMatch ? parseInt(fpWidthMatch[1]) : 2,
              footprintTileHeight: fpHeightMatch ? parseInt(fpHeightMatch[1]) : 2,
              anchorX: anchorXMatch ? parseFloat(anchorXMatch[1]) : 0.5,
              anchorY: anchorYMatch ? parseFloat(anchorYMatch[1]) : 0.85,
            };
          }
        }
      }
    } catch (e) {
      console.warn('No se pudo leer roomEngineAssets.ts');
    }

    // Sincronizar: agregar items del catálogo que no estén en assets.json
    let addedCount = 0;
    let updatedCount = 0;

    for (const item of catalogItems) {
      const existingIndex = assetsData.assets.findIndex((a: any) => a.id === item.id);
      const assetMeta = assetsMetadata[item.assetId] || {};
      
      const assetData = {
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.category as any,
        discipline: item.discipline,
        rarity: item.rarity,
        category: item.category,
        imageUrl: assetMeta.src || '',
        storagePath: assetMeta.src || '',
        footprintTileWidth: assetMeta.footprintTileWidth || 2,
        footprintTileHeight: assetMeta.footprintTileHeight || 2,
        pixelWidth: assetMeta.pixelWidth || 128,
        pixelHeight: assetMeta.pixelHeight || 128,
        anchorX: assetMeta.anchorX || 0.5,
        anchorY: assetMeta.anchorY || 0.85,
        placementSurface: item.placementSurface,
        canRotate: item.canRotate,
        isFromCatalog: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      if (existingIndex === -1) {
        // Nuevo asset
        assetsData.assets.push(assetData);
        addedCount++;
      } else {
        // Actualizar metadata si viene del catálogo
        assetsData.assets[existingIndex] = {
          ...assetsData.assets[existingIndex],
          ...assetData,
          createdAt: assetsData.assets[existingIndex].createdAt || Date.now(),
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
    });
  } catch (error) {
    console.error('Error syncing catalog:', error);
    return NextResponse.json({ error: 'Error al sincronizar catálogo' }, { status: 500 });
  }
}
