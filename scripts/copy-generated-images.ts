import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Flinix\\.gemini\\antigravity-ide\\brain\\d0892b66-8c4a-41c2-8c56-6d6747d3312e';
const publicImagesDir = path.join(process.cwd(), 'public', 'images');

const files = fs.readdirSync(brainDir).filter(f => f.endsWith('.png'));

for (const f of files) {
  const baseName = f.split('_17')[0] + '.png';
  const src = path.join(brainDir, f);
  const dest = path.join(publicImagesDir, baseName);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${f} -> public/images/${baseName}`);
}
