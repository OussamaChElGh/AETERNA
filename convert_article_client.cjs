const fs = require('fs');

let code = fs.readFileSync('c:/Users/Flinix/.gemini/antigravity-ide/scratch/AETERNA_NEW/AETERNA-main/src/pages/ArticlePage.tsx', 'utf8');

code = "'use client';\n" + code;
code = code.replace(/import\s*\{\s*useParams\s*,\s*useSearchParams\s*,\s*useLocation\s*,\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';\nimport { useParams, useSearchParams, usePathname } from 'next/navigation';");
code = code.replace(/import\s*\{\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';");
code = code.replace(/import\s*\{\s*getStructuredArticleBySlug\s*\}\s*from\s*['"]@\/lib\/content-loader['"];?/g, "import { getStructuredArticleBySlug, getArticleBySlug } from '@/lib/content';");
code = code.replace(/import\s*\{\s*getArticleBySlug\s*,\s*getStructuredArticleBySlug\s*\}\s*from\s*['"]@\/lib\/content-loader['"];?/g, "import { getStructuredArticleBySlug, getArticleBySlug } from '@/lib/content';");

code = code.replace(/useLocation\(\)/g, 'usePathname()');
code = code.replace(/location\.pathname/g, 'pathname');
code = code.replace(/const location = usePathname\(\);/g, 'const pathname = usePathname();');
code = code.replace(/useSearchParams\(\)/g, 'useSearchParams()');
code = code.replace(/<Link\s+to=/g, '<Link href=');

code = code.replace(/export function ArticlePage\(/g, 'export function ArticlePageClient(');
code = code.replace(/export default function ArticlePage\(/g, 'export function ArticlePageClient(');

fs.writeFileSync('c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/components/ArticlePageClient.tsx', code);
console.log('ArticlePageClient created successfully!');
