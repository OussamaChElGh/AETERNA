import fs from 'fs';
import path from 'path';

function loadApiKey(): string {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      if (t.substring(0, eq).trim() === 'GEMINI_API_KEY') {
        return t.substring(eq + 1).trim();
      }
    }
  }
  throw new Error('GEMINI_API_KEY not found');
}

async function main() {
  const apiKey = loadApiKey();
  const imgPath = 'C:\\Users\\Flinix\\.local\\share\\opencode\\tool-output\\cosmic_path_screenshot.png';
  const img = fs.readFileSync(imgPath);
  const base64 = img.toString('base64');

  const body = {
    contents: [{ parts: [{ text: 'Analyze this UI design screenshot. Generate a COMPLETE, WORKING React component with TypeScript and Tailwind CSS v4 that EXACTLY replicates this design. Use font-serif for titles, font-mono for labels. Match all colors, spacing, layout, and text exactly. Use lucide-react for icons, motion/react for animations. Just output the raw .tsx code.' }, { inlineData: { mimeType: 'image/png', data: base64 } }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 6000 },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await resp.json();

  if (json.error) { console.error('API Error:', json.error.message); return; }
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) { console.error('Empty response'); return; }

  const outPath = path.join(process.cwd(), 'components', 'learning-path', 'CosmicConstellationPath.tsx');
  fs.writeFileSync(outPath, text, 'utf8');
  console.log('Generated!', text.length, 'chars');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
