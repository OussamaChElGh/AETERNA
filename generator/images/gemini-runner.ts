import fs from 'fs';
import path from 'path';
import { GeminiResponse, ImageGenResult } from './types';

const DEFAULT_MODEL = 'gemini-3.1-flash-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function loadApiKey(): string {
  // 1. Env var
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  // 2. .env file (simple parser)
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.substring(0, eq).trim();
      const value = trimmed.substring(eq + 1).trim();
      if (key === 'GEMINI_API_KEY' && value) return value;
    }
  }

  throw new Error(
    'GEMINI_API_KEY no encontrada. Define la variable de entorno GEMINI_API_KEY o créala en el archivo .env de la raíz.'
  );
}

export async function generateImage(
  prompt: string,
  options: { model?: string; aspectRatio?: string; maxRetries?: number; retryDelayMs?: number } = {}
): Promise<ImageGenResult> {
  const apiKey = loadApiKey();
  const model = options.model || DEFAULT_MODEL;
  const aspectRatio = options.aspectRatio || '3:2';
  const maxRetries = options.maxRetries ?? 3;
  const retryDelayMs = options.retryDelayMs ?? 45000;

  const url = `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: {
        aspectRatio,
      },
    },
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('retry-after')) || retryDelayMs;
        lastError = new Error(`Quota exceeded (429). Reintentando en ${retryAfter}ms...`);
        console.log(`    ⏳ 429: ${lastError.message}`);
        await new Promise(r => setTimeout(r, retryAfter));
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 500)}`);
      }

      const data = (await res.json()) as GeminiResponse;
      const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
      if (!part?.inlineData) {
        throw new Error('Gemini no devolvió una imagen en la respuesta.');
      }

      return {
        base64: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'image/png',
      };
    } catch (e: any) {
      lastError = e;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, retryDelayMs));
      }
    }
  }

  throw lastError || new Error('Falló la generación de imagen tras reintentos.');
}
