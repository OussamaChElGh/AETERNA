const fs = require('fs');
const path = require('path');

function convertFile(srcFile, destFile, isClient = true) {
  if (!fs.existsSync(srcFile)) return;
  const dir = path.dirname(destFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let code = fs.readFileSync(srcFile, 'utf8');

  if (isClient && !code.includes("'use client'") && !code.includes('"use client"')) {
    code = "'use client';\n" + code;
  }

  code = code.replace(/import\s*\{\s*Link\s*,\s*useLocation\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';\nimport { usePathname } from 'next/navigation';");
  code = code.replace(/import\s*\{\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';");
  code = code.replace(/import\s*\{\s*useLocation\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import { usePathname } from 'next/navigation';");
  code = code.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';");
  code = code.replace(/import\s*\{\s*useParams\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import { useParams } from 'next/navigation';");
  code = code.replace(/import\s*\{\s*getAllArticles\s*\}\s*from\s*['"]@\/lib\/content-loader['"];?/g, "import { getAllArticles } from '@/lib/content';");
  code = code.replace(/import\s*\{\s*getArticleBySlug\s*,\s*getStructuredArticleBySlug\s*\}\s*from\s*['"]@\/lib\/content-loader['"];?/g, "import { getArticleBySlug, getStructuredArticleBySlug } from '@/lib/content';");
  code = code.replace(/import\s*\{\s*getArticleBySlug\s*\}\s*from\s*['"]@\/lib\/content-loader['"];?/g, "import { getArticleBySlug } from '@/lib/content';");
  code = code.replace(/import\s*\{\s*getStructuredArticleBySlug\s*\}\s*from\s*['"]@\/lib\/content-loader['"];?/g, "import { getStructuredArticleBySlug } from '@/lib/content';");

  code = code.replace(/useLocation\(\)/g, 'usePathname()');
  code = code.replace(/location\.pathname/g, 'pathname');
  code = code.replace(/const location = usePathname\(\);/g, 'const pathname = usePathname();');
  code = code.replace(/useNavigate\(\)/g, 'useRouter()');
  code = code.replace(/navigate\(/g, 'router.push(');
  code = code.replace(/const navigate = useRouter\(\);/g, 'const router = useRouter();');

  code = code.replace(/<Link\s+to=/g, '<Link href=');

  // Replace component export default if needed
  code = code.replace(/export function Home\(\)/g, 'export default function Home()');
  code = code.replace(/export function CategoryPage\(/g, 'export default function CategoryPage(');
  code = code.replace(/export function ProfilePage\(\)/g, 'export default function ProfilePage()');
  code = code.replace(/export function BlogPage\(\)/g, 'export default function BlogPage()');
  code = code.replace(/export function AuthorsPage\(\)/g, 'export default function AuthorsPage()');
  code = code.replace(/export function InteractivePage\(\)/g, 'export default function InteractivePage()');
  code = code.replace(/export function GuidesIndexPage\(\)/g, 'export default function GuidesIndexPage()');
  code = code.replace(/export function GuidePage\(/g, 'export default function GuidePage(');

  fs.writeFileSync(destFile, code);
  console.log(`Converted ${srcFile} -> ${destFile}`);
}

const baseSrc = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/AETERNA_NEW/AETERNA-main/src/pages';
const baseApp = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/app';

convertFile(`${baseSrc}/Home.tsx`, `${baseApp}/page.tsx`);
convertFile(`${baseSrc}/ProfilePage.tsx`, `${baseApp}/perfil/page.tsx`);
convertFile(`${baseSrc}/BlogPage.tsx`, `${baseApp}/bitacora/page.tsx`);
convertFile(`${baseSrc}/AuthorsPage.tsx`, `${baseApp}/autores/page.tsx`);
convertFile(`${baseSrc}/InteractivePage.tsx`, `${baseApp}/interactivos/page.tsx`);
convertFile(`${baseSrc}/GuidesIndexPage.tsx`, `${baseApp}/guias/page.tsx`);
