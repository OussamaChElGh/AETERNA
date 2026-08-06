import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';

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
  const assetData: Omit<AssetMetadata, 'id'> = {
    ...input,
    imageUrl,
    storagePath,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await addDoc(collection(db, 'aeternaAssets'), assetData);
  return docRef.id;
}

export async function getAllAssets(): Promise<(AssetMetadata & { id: string })[]> {
  const q = query(collection(db, 'aeternaAssets'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (AssetMetadata & { id: string })[];
}

export async function getAssetsByType(type: AssetMetadata['type']): Promise<(AssetMetadata & { id: string })[]> {
  const q = query(
    collection(db, 'aeternaAssets'),
    where('type', '==', type),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (AssetMetadata & { id: string })[];
}

export async function updateAsset(assetId: string, updates: Partial<UploadAssetInput>): Promise<void> {
  const docRef = doc(db, 'aeternaAssets', assetId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function updateAssetImage(assetId: string, file: File): Promise<void> {
  const assetDoc = await getDocs(query(collection(db, 'aeternaAssets'), where('__name__', '==', assetId)));
  if (assetDoc.empty) throw new Error('Asset not found');
  
  const assetData = assetDoc.docs[0].data() as AssetMetadata;
  
  // Delete old image
  if (assetData.storagePath) {
    const oldFilename = assetData.storagePath.split('/').pop();
    if (oldFilename) {
      await deleteAssetImage(oldFilename);
    }
  }
  
  // Upload new image
  const { imageUrl, storagePath } = await uploadAssetImage(file, assetId);
  
  const docRef = doc(db, 'aeternaAssets', assetId);
  await updateDoc(docRef, {
    imageUrl,
    storagePath,
    updatedAt: Date.now(),
  });
}

export async function deleteAsset(assetId: string): Promise<void> {
  const assetDoc = await getDocs(query(collection(db, 'aeternaAssets'), where('__name__', '==', assetId)));
  
  if (!assetDoc.empty) {
    const assetData = assetDoc.docs[0].data() as AssetMetadata;
    
    // Delete image file
    if (assetData.storagePath) {
      const filename = assetData.storagePath.split('/').pop();
      if (filename) {
        await deleteAssetImage(filename);
      }
    }
  }
  
  await deleteDoc(doc(db, 'aeternaAssets', assetId));
}

export function generateAssetId(name: string): string {
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return `custom_${slug}_${Date.now().toString(36)}`;
}
