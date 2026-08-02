import fs from 'fs';
import path from 'path';
import { ROOM_ASSETS } from '../data/roomEngineAssets';
import { ROOM_ITEM_CATALOG } from '../data/roomCatalog';
import { ROOM_ENGINE_CATALOG } from '../data/roomEngineCatalog';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

console.log('=== VERIFICANDO ACTIVOS DE ROOM ENGINE (data/roomEngineAssets.ts) ===');
const missingEngine: string[] = [];
for (const [id, asset] of Object.entries(ROOM_ASSETS)) {
  const sources = new Set<string>();
  if (asset.src) sources.add(asset.src);
  if (asset.spritesByRotation) {
    Object.values(asset.spritesByRotation).forEach(s => sources.add(s));
  }
  for (const src of sources) {
    const fullPath = path.join(PUBLIC_DIR, src);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Archivo faltante en ROOM_ASSETS (${id}): ${src}`);
      missingEngine.push(src);
    }
  }
}

console.log('\n=== VERIFICANDO MAPEOS EN ROOM ENGINE CATALOG (data/roomEngineCatalog.ts) ===');
const missingCatalogAssetIds: string[] = [];
for (const item of ROOM_ENGINE_CATALOG) {
  if (!ROOM_ASSETS[item.assetId]) {
    console.log(`❌ assetId no encontrado en ROOM_ASSETS (${item.id}): ${item.assetId}`);
    missingCatalogAssetIds.push(item.assetId);
  }
}

console.log('\n=== VERIFICANDO ACTIVOS DE ROOM CATALOG (data/roomCatalog.ts) ===');
const missingCatalog: string[] = [];
for (const item of ROOM_ITEM_CATALOG) {
  if (item.asset.type === 'pixel_art' && item.asset.src) {
    const fullPath = path.join(PUBLIC_DIR, item.asset.src);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Archivo faltante en ROOM_ITEM_CATALOG (${item.id}): ${item.asset.src}`);
      missingCatalog.push(item.asset.src);
    }
  }
}

console.log(`\nResumen final: ${missingEngine.length} archivos faltantes en roomEngineAssets, ${missingCatalogAssetIds.length} assetIds no mapeados, ${missingCatalog.length} archivos faltantes en roomCatalog.`);
