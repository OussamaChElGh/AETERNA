import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SEARCH_DIRS = ['data', 'components', 'app', 'context', 'hooks', 'lib', 'types'];

const imageRefs = new Set<string>();

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match /images/... or relative image paths
  const matches = content.match(/\/images\/[a-zA-Z0-9_\-\/\.]+\.(png|jpg|jpeg|webp|svg)/gi) || [];
  for (const m of matches) {
    imageRefs.add(m);
  }
}

function scanDir(dir: string) {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return;
  const entries = fs.readdirSync(full, { recursive: true });
  for (const entry of entries) {
    const entryPath = path.join(full, String(entry));
    if (fs.statSync(entryPath).isFile() && /\.(ts|tsx|json|js)$/i.test(entryPath)) {
      scanFile(entryPath);
    }
  }
}

async function main() {
  console.log('=== ESCANEANDO REFERENCIAS A IMÁGENES EN TODO EL PROYECTO ===');
  for (const d of SEARCH_DIRS) {
    scanDir(d);
  }

  console.log(`\nTotal referencias a imágenes encontradas en código: ${imageRefs.size}\n`);

  let missingCount = 0;
  let invalidPngCount = 0;
  let validPngCount = 0;

  for (const ref of Array.from(imageRefs).sort()) {
    const diskPath = path.join(PUBLIC_DIR, ref);
    if (!fs.existsSync(diskPath)) {
      console.log(`❌ NO EXISTE EN DISCO: ${ref}`);
      missingCount++;
      continue;
    }

    const stat = fs.statSync(diskPath);
    const buf = fs.readFileSync(diskPath);
    const headerHex = buf.subarray(0, 8).toString('hex');

    // Check PNG magic bytes
    if (ref.endsWith('.png')) {
      if (headerHex === '89504e470d0a1a0a') {
        validPngCount++;
        console.log(`✅ PNG Binario Válido [${(stat.size / 1024).toFixed(1)} KB]: ${ref}`);
      } else {
        invalidPngCount++;
        console.log(`⚠️ ARCHIVO NO ES PNG BINARIO VÁLIDO (Header: ${headerHex}): ${ref}`);
      }
    } else {
      console.log(`ℹ️ Formato no PNG [${(stat.size / 1024).toFixed(1)} KB]: ${ref}`);
    }
  }

  console.log('\n========================================');
  console.log(`RESUMEN AUDITORÍA PROYECTO:`);
  console.log(`- Img Válidas PNG Binarias: ${validPngCount}`);
  console.log(`- Faltantes en disco: ${missingCount}`);
  console.log(`- PNGs Inválidos/Corruptos: ${invalidPngCount}`);
  console.log('========================================');
}

main();
