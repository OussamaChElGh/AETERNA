const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/AETERNA_NEW/AETERNA-main/src/components';
const destDir = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/components';

function processDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      processDir(srcPath, destPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      let code = fs.readFileSync(srcPath, 'utf8');
      
      // Ensure 'use client' is at top for client components
      if (!code.includes("'use client'") && !code.includes('"use client"')) {
        code = "'use client';\n" + code;
      }
      
      // Replace react-router-dom imports
      code = code.replace(/import\s*\{\s*Link\s*,\s*useLocation\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';\nimport { usePathname } from 'next/navigation';");
      code = code.replace(/import\s*\{\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';");
      code = code.replace(/import\s*\{\s*useLocation\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import { usePathname } from 'next/navigation';");
      code = code.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';");
      code = code.replace(/useLocation\(\)/g, 'usePathname()');
      code = code.replace(/location\.pathname/g, 'pathname');
      code = code.replace(/const location = usePathname\(\);/g, 'const pathname = usePathname();');
      code = code.replace(/useNavigate\(\)/g, 'useRouter()');
      code = code.replace(/navigate\(/g, 'router.push(');
      code = code.replace(/const navigate = useRouter\(\);/g, 'const router = useRouter();');
      
      // Replace <Link to= with <Link href=
      code = code.replace(/<Link\s+to=/g, '<Link href=');
      
      fs.writeFileSync(destPath, code);
    }
  });
}

processDir(srcDir, destDir);
console.log('Components migrated successfully!');
