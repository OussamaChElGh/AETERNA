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
const CACHE_DURATION = 5000;

export function useCombinedAssets() {
  const [catalog, setCatalog] = useState<RoomCatalogItem[]>(ROOM_ENGINE_CATALOG);
  const [assets, setAssets] = useState<Record<string, RoomAsset>>(ROOM_ASSETS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAssets() {
      const now = Date.now();

      if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        if (!cancelled) {
          setCatalog(cachedData.catalog);
          setAssets(cachedData.assets);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/assets/combined');
        if (res.ok) {
          const data = await res.json();
          cachedData = data;
          cacheTimestamp = now;
          if (!cancelled) {
            setCatalog(data.catalog);
            setAssets(data.assets);
          }
        }
      } catch (error) {
        console.error('Error fetching combined assets:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAssets();

    return () => { cancelled = true; };
  }, []);

  return { catalog, assets, loading };
}

export function invalidateAssetsCache() {
  cachedData = null;
  cacheTimestamp = 0;
  clearChromaKeyCache();
}

export function getCachedCombinedAssets() {
  return cachedData;
}
