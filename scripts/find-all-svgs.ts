import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function findSvgFiles(dir: string, fileList: string[] = []) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      findSvgFiles(full, fileList);
    } else if (entry.endsWith('.svg')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const svgFiles = findSvgFiles(PUBLIC_DIR);

console.log('=== ARCHIVOS SVG ENCONTRADOS EN PUBLIC ===');
svgFiles.forEach(f => console.log(path.relative(process.cwd(), f)));
console.log(`Total archivos .svg: ${svgFiles.length}`);
