import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc, query, orderBy, where } from 'firebase/firestore';
import { storage, db } from './firebase';

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
  const extension = file.name.split('.').pop() || 'png';
  const storagePath = `assets/${assetId}.${extension}`;
  const storageRef = ref(storage, storagePath);
  
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  
  return { imageUrl, storagePath };
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
  
  if (assetData.storagePath) {
    try {
      const oldRef = ref(storage, assetData.storagePath);
      await deleteObject(oldRef);
    } catch (e) {
      console.warn('Could not delete old image:', e);
    }
  }
  
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
    
    if (assetData.storagePath) {
      try {
        const storageRef = ref(storage, assetData.storagePath);
        await deleteObject(storageRef);
      } catch (e) {
        console.warn('Could not delete storage file:', e);
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
