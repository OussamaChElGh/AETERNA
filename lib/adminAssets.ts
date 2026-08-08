export interface AssetMetadata {
  id?: string;
  name: string;
  description: string;
  type: 'furniture' | 'relic' | 'decoration' | 'scientific' | 'plants' | 'books';
  discipline: 'physics' | 'mathematics' | 'computer_science' | 'philosophy' | 'biology' | 'general';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'furniture' | 'scientific' | 'decoration' | 'plants' | 'books';
  imageUrl: string;
  storagePath: string;
  footprintTileWidth: number;
  footprintTileHeight: number;
  pixelWidth: number;
  pixelHeight: number;
  anchorX: number;
  anchorY: number;
  placementSurface: 'floor' | 'wall' | 'desk';
  canRotate: boolean;
  unlockCondition?: {
    type: 'article_completed' | 'layer_completed' | 'default' | 'nivel_completed';
    targetId?: string;
    layer?: string;
    nivel?: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface UploadAssetInput {
  name: string;
  description: string;
  type: 'furniture' | 'relic' | 'decoration' | 'scientific' | 'plants' | 'books';
  discipline: 'physics' | 'mathematics' | 'computer_science' | 'philosophy' | 'biology' | 'general';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'furniture' | 'scientific' | 'decoration' | 'plants' | 'books';
  placementSurface: 'floor' | 'wall' | 'desk';
  canRotate: boolean;
  footprintTileWidth: number;
  footprintTileHeight: number;
  pixelWidth: number;
  pixelHeight: number;
  anchorX: number;
  anchorY: number;
  unlockCondition?: AssetMetadata['unlockCondition'];
}

export async function uploadAssetImage(file: File, assetId: string): Promise<{ imageUrl: string; storagePath: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('assetId', assetId);

  const response = await fetch('/api/admin/assets/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al subir imagen');
  }

  const data = await response.json();
  return {
    imageUrl: data.imageUrl,
    storagePath: data.storagePath,
  };
}

export async function deleteAssetImage(filename: string): Promise<void> {
  const response = await fetch(`/api/admin/assets/upload?filename=${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.warn('Could not delete image file');
  }
}

export async function createAsset(input: UploadAssetInput, file: File): Promise<string> {
  const assetId = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  const { imageUrl, storagePath } = await uploadAssetImage(file, assetId);
  
  const now = Date.now();
  const assetData = {
    ...input,
    imageUrl,
    storagePath,
    createdAt: now,
    updatedAt: now,
  };
  
  const response = await fetch('/api/admin/assets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assetData),
  });

  if (!response.ok) {
    throw new Error('Error al crear asset');
  }

  const result = await response.json();
  return result.id;
}

export async function getAllAssets(): Promise<(AssetMetadata & { id: string })[]> {
  const response = await fetch('/api/admin/assets');
  
  if (!response.ok) {
    throw new Error('Error al obtener assets');
  }

  return response.json();
}

export async function getAssetsByType(type: AssetMetadata['type']): Promise<(AssetMetadata & { id: string })[]> {
  const allAssets = await getAllAssets();
  return allAssets.filter(asset => asset.type === type);
}

export async function updateAsset(id: string, updates: Partial<UploadAssetInput>): Promise<void> {
  const response = await fetch('/api/admin/assets', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar asset');
  }
}

export async function updateAssetImage(assetId: string, file: File): Promise<void> {
  const assets = await getAllAssets();
  const asset = assets.find(a => a.id === assetId);
  
  if (!asset) {
    throw new Error('Asset not found');
  }
  
  // Delete old image
  if (asset.storagePath) {
    const oldFilename = asset.storagePath.split('/').pop();
    if (oldFilename) {
      await deleteAssetImage(oldFilename);
    }
  }
  
  // Upload new image
  const { imageUrl, storagePath } = await uploadAssetImage(file, assetId);
  
  // Update asset metadata with new image info
  await fetch('/api/admin/assets', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: assetId, imageUrl, storagePath, updatedAt: Date.now() }),
  });
}

export async function deleteAsset(assetId: string): Promise<void> {
  const assets = await getAllAssets();
  const asset = assets.find(a => a.id === assetId);
  
  if (asset) {
    // Delete image file
    if (asset.storagePath) {
      const filename = asset.storagePath.split('/').pop();
      if (filename) {
        await deleteAssetImage(filename);
      }
    }
  }
  
  const response = await fetch(`/api/admin/assets?id=${assetId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar asset');
  }
}

export function generateAssetId(name: string): string {
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return `custom_${slug}_${Date.now().toString(36)}`;
}
