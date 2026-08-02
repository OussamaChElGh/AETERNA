import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');
const RELIQUIAS_DIR = path.join(PUBLIC_IMAGES, 'reliquias');

async function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) continue;

    // 1. If it's a .svg file, read content, render to PNG, then DELETE the .svg file
    if (file.endsWith('.svg')) {
      const pngPath = fullPath.replace(/\.svg$/, '.png');
      const svgContent = fs.readFileSync(fullPath, 'utf8');
      try {
        await sharp(Buffer.from(svgContent)).png().toFile(pngPath);
        console.log(`✅ Convertido SVG -> Real Binary PNG: ${path.relative(process.cwd(), pngPath)}`);
      } catch (e: any) {
        console.error(`Error convirtiendo ${file}:`, e.message);
      }
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Eliminado archivo .svg: ${path.relative(process.cwd(), fullPath)}`);
    }
  }
}

async function fixFakePngs(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) continue;

    if (file.endsWith('.png')) {
      const content = fs.readFileSync(fullPath);
      // Check if file starts with '<svg' (fake text PNG)
      if (content.toString('utf8', 0, 50).includes('<svg')) {
        const svgString = content.toString('utf8');
        await sharp(Buffer.from(svgString)).png().toFile(fullPath + '.tmp');
        fs.renameSync(fullPath + '.tmp', fullPath);
        console.log(`✨ Re-renderizado texto SVG a verdadero archivo binario PNG: ${file}`);
      }
    }
  }
}

async function main() {
  console.log('--- Procesando public/images ---');
  await processDirectory(PUBLIC_IMAGES);
  await fixFakePngs(PUBLIC_IMAGES);

  console.log('\n--- Procesando public/images/reliquias ---');
  await processDirectory(RELIQUIAS_DIR);
  await fixFakePngs(RELIQUIAS_DIR);

  console.log('\n¡Proceso completado! Todas las imágenes son 100% binarias PNG.');
}

main();
