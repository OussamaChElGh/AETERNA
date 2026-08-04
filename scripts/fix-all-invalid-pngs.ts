import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function fixFile(fullPath: string) {
  try {
    const buf = fs.readFileSync(fullPath);
    const headerHex = buf.subarray(0, 8).toString('hex');

    // If it's already a valid binary PNG (89504e470d0a1a0a), skip
    if (headerHex === '89504e470d0a1a0a') {
      return;
    }

    // Re-encode JPEG or WebP or SVG format to 100% True Binary PNG
    const convertedBuf = await sharp(buf).png().toBuffer();
    fs.writeFileSync(fullPath, convertedBuf);
    console.log(`✨ Re-codificado a PNG binario puro: ${path.relative(process.cwd(), fullPath)}`);
  } catch (e: any) {
    console.error(`❌ Error convirtiendo ${path.relative(process.cwd(), fullPath)}:`, e.message);
  }
}

async function fixDirectory(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { recursive: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, String(entry));
    if (fs.statSync(fullPath).isFile() && fullPath.endsWith('.png')) {
      await fixFile(fullPath);
    }
  }
}

async function main() {
  console.log('--- RE-CODIFICANDO TODOS LOS ARCHIVOS .PNG A FORMATO PNG BINARIO PURO ---');
  await fixDirectory(PUBLIC_DIR);

  // Fix missing google.svg / auth icon if referenced
  const authDir = path.join(PUBLIC_DIR, 'images', 'auth');
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
  
  const googleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;
  fs.writeFileSync(path.join(authDir, 'google.svg'), googleSvg, 'utf8');

  // Fix room_bookshelf.png and room_telescope.png
  const bookshelfPng = path.join(PUBLIC_DIR, 'images', 'room_bookshelf.png');
  const telescopePng = path.join(PUBLIC_DIR, 'images', 'room_telescope.png');
  
  if (fs.existsSync(path.join(PUBLIC_DIR, 'images', 'anektia_pixel_bookshelf.png'))) {
    fs.copyFileSync(path.join(PUBLIC_DIR, 'images', 'anektia_pixel_bookshelf.png'), bookshelfPng);
  }
  if (fs.existsSync(path.join(PUBLIC_DIR, 'images', 'anektia_pixel_telescope.png'))) {
    fs.copyFileSync(path.join(PUBLIC_DIR, 'images', 'anektia_pixel_telescope.png'), telescopePng);
  }

  console.log('\n¡Proceso de re-codificación PNG finalizado!');
}

main();
