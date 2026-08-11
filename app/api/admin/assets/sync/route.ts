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

    // Sincronizar ya no es necesario porque GET /api/admin/assets y /api/assets/combined 
    // manejan la combinación dinámicamente, y PUT/DELETE manejan isDeleted.
    // Simplemente limpiamos la caché por si acaso.
    clearDynamicAssetsCache();

    return NextResponse.json({
      success: true,
      added: 0,
      updated: 0,
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
