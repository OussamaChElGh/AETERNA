import { useState, useEffect } from 'react';
import { RoomCatalogItem, RoomAsset } from '@/types/roomEngine';
import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog';
import { ROOM_ASSETS } from '@/data/roomEngineAssets';
import { clearChromaKeyCache } from '@/lib/chromaKeyAlpha';

interface CombinedAssets {
  catalog: RoomCatalogItem[];
  assets: Record<string, RoomAsset>;
  timestamp: number;
}

let cachedData: CombinedAssets | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 0 : 30000; // 0s en dev, 30s en prod

export function useCombinedAssets() {
  const [catalog, setCatalog] = useState<RoomCatalogItem[]>(ROOM_ENGINE_CATALOG);
  const [assets, setAssets] = useState<Record<string, RoomAsset>>(ROOM_ASSETS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAssets() {
      const now = Date.now();
      
      // Usar cache si es reciente
      if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        setCatalog(cachedData.catalog);
        setAssets(cachedData.assets);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/assets/combined');
        if (res.ok) {
          const data = await res.json();
          cachedData = data;
          cacheTimestamp = now;
          setCatalog(data.catalog);
          setAssets(data.assets);
        }
      } catch (error) {
        console.error('Error fetching combined assets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  return { catalog, assets, loading };
}

// Función para invalidar cache manualmente
export function invalidateAssetsCache() {
  cachedData = null;
  cacheTimestamp = 0;
  clearChromaKeyCache();
}
