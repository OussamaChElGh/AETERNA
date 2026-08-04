import fs from 'fs';
import path from 'path';

function loadApiKey(): string {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      if (t.substring(0, eq).trim() === 'GEMINI_API_KEY' && t.substring(eq + 1).trim()) {
        return t.substring(eq + 1).trim();
      }
    }
  }
  throw new Error('GEMINI_API_KEY not found');
}

const MODEL = 'gemini-2.0-flash';
const IMAGE_PATH = 'C:\\Users\\Flinix\\.local\\share\\opencode\\tool-output\\cosmic_path_screenshot.png';

async function main() {
  const apiKey = loadApiKey();
  const imageBytes = fs.readFileSync(IMAGE_PATH);
  const base64Image = imageBytes.toString('base64');

  const prompt = `Analyze this UI design screenshot of a gamified physics learning path called "El Sendero del Sabio" for ANEKTIA. Generate a COMPLETE, PRODUCTION-READY React component using TypeScript and Tailwind CSS v4 that EXACTLY replicates this design pixel-by-pixel.

Requirements:
- Use 'use client' directive at top
- Import from: react, next/link, motion/react, lucide-react, @/lib/utils
- NO external UI libraries - only Tailwind CSS v4 classes
- Use exact colors from the screenshot (check hex values)
- Match typography exactly (font-serif for titles, font-mono for labels, font-sans for body)
- Match ALL layout elements: cards, icons, progress indicators, buttons, text
- Match spacing, padding, margins exactly
- Include ALL text content visible in the screenshot
- Use cn() utility for conditional classes
- Export as default: export default function CosmicConstellationPath()
- The design shows a physics learning path with lesson nodes, progress tracking, and navigation

Output ONLY the complete React component code. No explanations, no markdown fences, just the raw .tsx code.`;

  const body = {
    contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/png', data: base64Image } }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  
  console.log('Sending screenshot to Gemini Vision...');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (json.error) { console.error('API Error:', JSON.stringify(json.error, null, 2)); return; }
  
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) { console.error('Empty response'); console.log(JSON.stringify(json, null, 2).substring(0, 500)); return; }

  const outPath = path.join(process.cwd(), 'components', 'learning-path', 'CosmicConstellationPath.tsx');
  fs.writeFileSync(outPath, text, 'utf8');
  console.log('Generated component saved:', outPath);
  console.log('Length:', text.length, 'chars');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
