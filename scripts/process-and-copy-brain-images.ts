import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const brainDir = 'C:\\Users\\Flinix\\.gemini\\antigravity-ide\\brain\\d0892b66-8c4a-41c2-8c56-6d6747d3312e';
const publicImages = path.join(process.cwd(), 'public', 'images');
const reliquiasDir = path.join(publicImages, 'reliquias');

async function processImage(srcPath: string, destPath: string) {
  const image = sharp(srcPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // Chroma key: remove solid white / light grey background to 100% transparent PNG
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = 0; // Alpha 0
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(destPath);
}

async function main() {
  const files = fs.readdirSync(brainDir).filter(f => f.endsWith('.png'));

  for (const f of files) {
    const baseName = f.split('_17')[0] + '.png';
    const src = path.join(brainDir, f);

    if (baseName.startsWith('reliquia_')) {
      const dest = path.join(reliquiasDir, baseName);
      await processImage(src, dest);
      console.log(`✅ Procesada Reliquia -> ${path.relative(process.cwd(), dest)}`);
    } else if (baseName.startsWith('aeterna_pixel_') || baseName.startsWith('aeterna_master_')) {
      const dest = path.join(publicImages, baseName);
      await processImage(src, dest);
      console.log(`✅ Procesado Objeto -> ${path.relative(process.cwd(), dest)}`);
    }
  }
}

main();
