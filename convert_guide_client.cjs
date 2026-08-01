const fs = require('fs');

let code = fs.readFileSync('c:/Users/Flinix/.gemini/antigravity-ide/scratch/AETERNA_NEW/AETERNA-main/src/pages/GuidePage.tsx', 'utf8');

code = "'use client';\n" + code;
code = code.replace(/import\s*\{\s*useParams\s*,\s*Link\s*,\s*useNavigate\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';\nimport { useParams, useRouter } from 'next/navigation';");
code = code.replace(/import\s*\{\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import Link from 'next/link';");
code = code.replace(/import\s*\{\s*getAllArticles\s*\}\s*from\s*['"]@\/lib\/content-loader['"];?/g, "import { getAllArticles } from '@/lib/content';");

code = code.replace(/useNavigate\(\)/g, 'useRouter()');
code = code.replace(/navigate\(/g, 'router.push(');
code = code.replace(/const navigate = useRouter\(\);/g, 'const router = useRouter();');
code = code.replace(/<Link\s+to=/g, '<Link href=');

code = code.replace(/export function GuidePage\(/g, 'export function GuidePageClient(');
code = code.replace(/export default function GuidePage\(/g, 'export function GuidePageClient(');

fs.writeFileSync('c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/components/GuidePageClient.tsx', code);
console.log('GuidePageClient created successfully!');
