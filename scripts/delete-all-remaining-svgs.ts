import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function convertAndDeleteSvg(svgPath: string) {
  if (!fs.existsSync(svgPath)) return;
  const pngPath = svgPath.replace(/\.svg$/i, '.png');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  try {
    await sharp(Buffer.from(svgContent)).png().toFile(pngPath);
    console.log(`✅ Convertido SVG -> PNG: ${path.relative(process.cwd(), pngPath)}`);
  } catch (e: any) {
    console.error(`Error convirtiendo ${svgPath}:`, e.message);
  }

  fs.unlinkSync(svgPath);
  console.log(`🗑️ Eliminado SVG: ${path.relative(process.cwd(), svgPath)}`);
}

function scanAndDelete(dir: string) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      scanAndDelete(full);
    } else if (entry.endsWith('.svg')) {
      convertAndDeleteSvg(full);
    }
  }
}

async function main() {
  console.log('--- BUSCANDO Y ELIMINANDO TODOS LOS SVGS RESTANTES EN PUBLIC ---');
  scanAndDelete(PUBLIC_DIR);
  console.log('\n¡Todos los archivos SVG eliminados y sustituidos por sus versiones PNG binarias!');
}

main();
