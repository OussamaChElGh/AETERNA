const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const updated = content.replace(/<Link\s+([^>]*\s+)?to=/g, '<Link $1href=');
      if (updated !== content) {
        fs.writeFileSync(fullPath, updated);
        console.log(`Updated Link to= in ${fullPath}`);
      }
    }
  });
}

processDir('c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/components');
processDir('c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/app');
