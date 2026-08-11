import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ASSETS_FILE = path.join(process.cwd(), 'data', 'assets.json');

export async function GET() {
  try {
    const data = await fs.readFile(ASSETS_FILE, 'utf-8').catch(() => '{"assets":[]}');
    const parsed = JSON.parse(data);
    const dynamicAssets = parsed.assets || [];
    const dynamicMap = new Map(dynamicAssets.map((a: any) => [a.id, a]));

    // Import from static catalog directly
    const { ROOM_ENGINE_CATALOG } = await import('@/data/roomEngineCatalog');
    const { ROOM_ASSETS } = await import('@/data/roomEngineAssets');

    const combinedCatalog = [];
    for (const item of ROOM_ENGINE_CATALOG) {
      const dynamic = dynamicMap.get(item.id) as any;
      if (dynamic?.isDeleted) continue;
      
      const roomAsset = ROOM_ASSETS[item.assetId];

      combinedCatalog.push({
        id: item.id,
        name: dynamic?.name || item.name,
        description: dynamic?.description || item.description,
        type: dynamic?.type || item.category,
        discipline: dynamic?.discipline || item.discipline,
        category: dynamic?.category || item.category,
        rarity: dynamic?.rarity || item.rarity,
        placementSurface: dynamic?.placementSurface || item.placementSurface,
        canRotate: dynamic?.canRotate ?? item.canRotate,
        unlockCondition: dynamic?.unlockCondition !== undefined ? dynamic.unlockCondition : item.unlockCondition,
        
        // Image & asset properties
        imageUrl: dynamic?.imageUrl || roomAsset?.src || '',
        storagePath: dynamic?.storagePath || roomAsset?.src || '',
        footprintTileWidth: dynamic?.footprintTileWidth ?? roomAsset?.footprintTileWidth ?? 2,
        footprintTileHeight: dynamic?.footprintTileHeight ?? roomAsset?.footprintTileHeight ?? 2,
        pixelWidth: dynamic?.pixelWidth ?? roomAsset?.pixelWidth ?? 128,
        pixelHeight: dynamic?.pixelHeight ?? roomAsset?.pixelHeight ?? 128,
        anchorX: dynamic?.anchorX ?? roomAsset?.anchorX ?? 0.5,
        anchorY: dynamic?.anchorY ?? roomAsset?.anchorY ?? 0.85,
        
        isFromCatalog: true,
        createdAt: dynamic?.createdAt || Date.now(),
        updatedAt: dynamic?.updatedAt || Date.now(),
      });
    }

    const staticIds = new Set(ROOM_ENGINE_CATALOG.map((i: any) => i.id));
    const newDynamicItems = dynamicAssets.filter((a: any) => !staticIds.has(a.id) && !a.isDeleted);

    return NextResponse.json([...combinedCatalog, ...newDynamicItems]);
  } catch (error) {
    console.error('Error reading assets:', error);
    return NextResponse.json({ error: 'Error reading assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await fs.readFile(ASSETS_FILE, 'utf-8');
    const assets = JSON.parse(data);
    
    const newAsset = {
      ...body,
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    assets.assets.push(newAsset);
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
    
    return NextResponse.json(newAsset);
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Error creating asset' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }
    
    const data = await fs.readFile(ASSETS_FILE, 'utf-8');
    const assets = JSON.parse(data);
    
    const index = assets.assets.findIndex((a: any) => a.id === id);
    if (index === -1) {
      assets.assets.push({
        ...updates,
        id,
        updatedAt: Date.now(),
      });
    } else {
      assets.assets[index] = {
        ...assets.assets[index],
        ...updates,
        id,
        updatedAt: Date.now(),
      };
    }
    
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
    
    return NextResponse.json(assets.assets[index]);
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: 'Error updating asset' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }
    
    const data = await fs.readFile(ASSETS_FILE, 'utf-8');
    const assets = JSON.parse(data);
    
    const asset = assets.assets.find((a: any) => a.id === id);
    if (!asset) {
      // If it doesn't exist in assets.json but it's a hardcoded one, we need to add it as deleted!
      assets.assets.push({ id, isDeleted: true, updatedAt: Date.now() });
    } else {
      asset.isDeleted = true;
      asset.updatedAt = Date.now();
    }
    
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
    
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ error: 'Error deleting asset' }, { status: 500 });
  }
}
