import { NextResponse } from 'next/server';
import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog';
import { ROOM_ASSETS } from '@/data/roomEngineAssets';
import fs from 'fs/promises';
import path from 'path';

const ASSETS_FILE = path.join(process.cwd(), 'data', 'assets.json');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Leer assets dinámicos
    let dynamicAssets: any[] = [];
    try {
      const data = await fs.readFile(ASSETS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      dynamicAssets = parsed.assets || [];
    } catch (e) {
      // Archivo no existe
    }

    // Crear map de assets dinámicos por ID
    const dynamicMap = new Map(dynamicAssets.map(a => [a.id, a]));

    // Combinar catálogo estático con dinámico
    const combinedCatalog = ROOM_ENGINE_CATALOG.map(item => {
      const dynamic = dynamicMap.get(item.id);
      return {
        ...item,
        // Override con datos dinámicos si existen
        name: dynamic?.name || item.name,
        description: dynamic?.description || item.description,
        discipline: dynamic?.discipline || item.discipline,
        category: dynamic?.category || item.category,
        rarity: dynamic?.rarity || item.rarity,
        placementSurface: dynamic?.placementSurface || item.placementSurface,
        canRotate: dynamic?.canRotate ?? item.canRotate,
        unlockCondition: dynamic?.unlockCondition || item.unlockCondition,
      };
    });

    // Agregar assets dinámicos que no están en el catálogo estático
    const staticIds = new Set(ROOM_ENGINE_CATALOG.map(i => i.id));
    const newDynamicItems = dynamicAssets
      .filter(a => !staticIds.has(a.id))
      .map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        discipline: a.discipline,
        category: a.category,
        rarity: a.rarity,
        assetId: a.id,
        placementSurface: a.placementSurface,
        canRotate: a.canRotate,
        unlockCondition: a.unlockCondition,
      }));

    const fullCatalog = [...combinedCatalog, ...newDynamicItems];

    // Combinar ROOM_ASSETS con dinámicos
    // Mapa: catalogItem.id → catalogItem.assetId (ROOM_ASSETS key)
    const catalogAssetIdMap = new Map(ROOM_ENGINE_CATALOG.map(c => [c.id, c.assetId]));

    const combinedAssets = { ...ROOM_ASSETS };
    for (const asset of dynamicAssets) {
      const assetKey = catalogAssetIdMap.get(asset.id) || asset.id;

      if (!combinedAssets[assetKey]) {
        combinedAssets[assetKey] = {
          id: assetKey,
          src: asset.imageUrl,
          footprintTileWidth: asset.footprintTileWidth,
          footprintTileHeight: asset.footprintTileHeight,
          pixelWidth: asset.pixelWidth,
          pixelHeight: asset.pixelHeight,
          anchorX: asset.anchorX,
          anchorY: asset.anchorY,
        };
      } else if (asset.imageUrl) {
        combinedAssets[assetKey] = {
          ...combinedAssets[assetKey],
          src: asset.imageUrl,
          footprintTileWidth: asset.footprintTileWidth || combinedAssets[assetKey].footprintTileWidth,
          footprintTileHeight: asset.footprintTileHeight || combinedAssets[assetKey].footprintTileHeight,
          pixelWidth: asset.pixelWidth || combinedAssets[assetKey].pixelWidth,
          pixelHeight: asset.pixelHeight || combinedAssets[assetKey].pixelHeight,
          anchorX: asset.anchorX ?? combinedAssets[assetKey].anchorX,
          anchorY: asset.anchorY ?? combinedAssets[assetKey].anchorY,
        };
      }
    }

    return NextResponse.json({
      catalog: fullCatalog,
      assets: combinedAssets,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error getting combined assets:', error);
    return NextResponse.json({ error: 'Error loading assets' }, { status: 500 });
  }
}
