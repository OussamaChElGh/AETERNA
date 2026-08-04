import fs from 'fs';
import path from 'path';

function loadApiKey(): string {
  const envPath = path.join(process.cwd(), '.env');
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    if (t.substring(0, eq).trim() === 'GEMINI_API_KEY') return t.substring(eq + 1).trim();
  }
  throw new Error('No API key');
}

async function main() {
  const apiKey = loadApiKey();
  const img = fs.readFileSync('C:\\Users\\Flinix\\.local\\share\\opencode\\tool-output\\cosmic_path_screenshot.png').toString('base64');
  
  const body = JSON.stringify({
    contents: [{ parts: [
      { text: 'Describe this UI design in extreme detail. List every element you see: position (left/center/right), colors, typography, icons, cards, buttons, text labels, any images. What is the exact layout structure?' },
      { inlineData: { mimeType: 'image/png', data: img } }
    ]}],
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  const json = await resp.json();
  
  if (json.error) { console.error('Error:', json.error.message); return; }
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log(text);
}

main().catch(e => console.error(e.message));
