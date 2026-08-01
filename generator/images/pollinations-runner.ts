import { ImageGenResult } from './types';

const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt';

/**
 * Free, keyless image generation via Pollinations.ai.
 * Model defaults to FLUX; format requested as webp.
 */
export async function generateImagePollinations(
  prompt: string,
  options: { width?: number; height?: number; model?: string; seed?: number; maxRetries?: number } = {}
): Promise<ImageGenResult> {
  const width = options.width || 1024;
  const height = options.height || 683;
  const model = options.model || 'flux';
  const seed = options.seed ?? Math.floor(Math.random() * 100000);
  const maxRetries = options.maxRetries ?? 3;

  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    model,
    seed: String(seed),
    nologo: 'true',
    referrer: 'aeterna.app',
  });

  const url = `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}?${params.toString()}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(90000) });
      if (!res.ok) {
        lastError = new Error(`Pollinations API ${res.status}: ${await res.text().catch(() => '')}`);
        if (res.status === 502 || res.status === 503 || res.status === 429) {
          console.log(`    ⏳ Pollinations ${res.status}, reintentando (${attempt + 1}/${maxRetries + 1})...`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        throw lastError;
      }

      const buf = Buffer.from(await res.arrayBuffer());
      return {
        base64: buf.toString('base64'),
        mimeType: 'image/webp',
      };
    } catch (e: any) {
      lastError = e;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }

  throw lastError || new Error('Falló la generación de imagen en Pollinations.');
}
